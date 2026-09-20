/*
 * Site-wide behaviour that lived inline in the WordPress markup.
 */

/* Elementor: paint section background images only once they approach the viewport. */
const lazyloadRunObserver = () => {
    const lazyloadBackgrounds = document.querySelectorAll( `.e-con.e-parent:not(.e-lazyloaded)` );
    const lazyloadBackgroundObserver = new IntersectionObserver( ( entries ) => {
        entries.forEach( ( entry ) => {
            if ( entry.isIntersecting ) {
                let lazyloadBackground = entry.target;
                if( lazyloadBackground ) {
                    lazyloadBackground.classList.add( 'e-lazyloaded' );
                }
                lazyloadBackgroundObserver.unobserve( entry.target );
            }
        });
    }, { rootMargin: '200px 0px 200px 0px' } );
    lazyloadBackgrounds.forEach( ( lazyloadBackground ) => {
        lazyloadBackgroundObserver.observe( lazyloadBackground );
    } );
};
const events = [
    'DOMContentLoaded',
    'elementor/lazyload/observe',
];
events.forEach( ( event ) => {
    document.addEventListener( event, lazyloadRunObserver );
} );

/* Off-canvas menu guard: never open on load or after a viewport width change, close on a tap outside the
   panel, lock page scrolling while it is open. The theme toggles `.aux-open` on the panel itself. */
(function () {
    var panels = function () { return Array.prototype.slice.call(document.querySelectorAll('.aux-offcanvas-menu')); };
    var openPanels = function () { return panels().filter(function (p) { return p.classList.contains('aux-open'); }); };
    var forceClose = function () {
        openPanels().forEach(function (p) { p.classList.remove('aux-open'); });
        Array.prototype.forEach.call(document.querySelectorAll('.aux-burger.aux-close'), function (b) { b.classList.remove('aux-close'); });
        document.body.classList.remove('tfc-oc-open');
    };
    var syncBody = function () {
        var isOpen = openPanels().length > 0;
        document.body.classList.toggle('tfc-oc-open', isOpen);
        Array.prototype.forEach.call(document.querySelectorAll('.aux-burger-box'), function (b) { b.setAttribute('aria-expanded', isOpen ? 'true' : 'false'); });
    };
    var ready = function (fn) { if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', fn); } else { fn(); } };
    ready(function () {
        setTimeout(forceClose, 50);
        if (window.MutationObserver) {
            var mo = new MutationObserver(syncBody);
            panels().forEach(function (p) { mo.observe(p, { attributes: true, attributeFilter: ['class'] }); });
        }
    });
    window.addEventListener('load', function () { setTimeout(forceClose, 100); });
    var lastWidth = window.innerWidth;
    window.addEventListener('resize', function () {
        if (window.innerWidth === lastWidth) { return; } /* mobile toolbars only change the height */
        lastWidth = window.innerWidth;
        forceClose();
    });
    document.addEventListener('click', function (e) {
        var open = openPanels();
        if (!open.length || !e.target.closest) { return; }
        /* the round close button is 40px but the theme only listens on the 16px cross inside it */
        var round = e.target.closest('.aux-offcanvas-menu .aux-panel-close');
        if (round && !e.target.closest('.aux-close')) {
            var cross = round.querySelector('.aux-close');
            if (cross) { cross.click(); } else { forceClose(); }
            return;
        }
        if (e.target.closest('.aux-offcanvas-menu') || e.target.closest('.aux-burger-box')) { return; }
        var close = open[0].querySelector('.aux-close');
        if (close) { close.click(); } else { forceClose(); }
    }, true);
})();

/* Keyboard access to the mobile menu: the theme renders the burger as a plain <div>, so it could not be focused or
   opened without a pointer. It becomes a button (Enter/Space open it, focus moves into the panel and returns to the
   burger when the panel closes). The visually hidden site-title link duplicates the logo link, so it leaves the tab order. */
(function () {
    var labels = { en: 'Menu', tr: 'Menü', ar: 'القائمة' };
    var closeLabels = { en: 'Close menu', tr: 'Menüyü kapat', ar: 'إغلاق القائمة' };
    var ready = function (fn) { if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', fn); } else { fn(); } };
    var activate = function (el) {
        el.addEventListener('keydown', function (e) {
            if (e.key !== 'Enter' && e.key !== ' ' && e.key !== 'Spacebar') { return; }
            e.preventDefault();
            el.click();
        });
    };
    ready(function () {
        var lang = (document.documentElement.lang || 'en').slice(0, 2).toLowerCase();
        Array.prototype.forEach.call(document.querySelectorAll('.aux-logo-text .site-title a'), function (a) { a.setAttribute('tabindex', '-1'); });
        Array.prototype.forEach.call(document.querySelectorAll('.aux-offcanvas-menu .aux-panel-close'), function (c) {
            c.setAttribute('role', 'button');
            c.setAttribute('tabindex', '0');
            c.setAttribute('aria-label', closeLabels[lang] || closeLabels.en);
            activate(c); /* the capture handler above forwards clicks on the round button to the theme's cross */
        });
        Array.prototype.forEach.call(document.querySelectorAll('.aux-burger-box'), function (b) {
            b.setAttribute('role', 'button');
            b.setAttribute('tabindex', '0');
            if (!b.getAttribute('aria-label')) { b.setAttribute('aria-label', labels[lang] || labels.en); }
            if (!b.hasAttribute('aria-expanded')) { b.setAttribute('aria-expanded', 'false'); }
            activate(b);
            b.addEventListener('keydown', function (e) {
                if (e.key !== 'Enter' && e.key !== ' ' && e.key !== 'Spacebar') { return; }
                setTimeout(function () {
                    var panel = document.querySelector('.aux-offcanvas-menu.aux-open');
                    var first = panel && panel.querySelector('.aux-panel-close');
                    if (first) { first.focus(); }
                }, 350);
            });
        });
        /* return focus to the burger when the panel closes with focus inside it */
        if (window.MutationObserver) {
            var mo = new MutationObserver(function (records) {
                records.forEach(function (r) {
                    var p = r.target;
                    if (p.classList.contains('aux-open') || !p.contains(document.activeElement)) { return; }
                    var b = document.querySelector('.aux-burger-box');
                    if (b && b.offsetParent !== null) { b.focus(); }
                });
            });
            Array.prototype.forEach.call(document.querySelectorAll('.aux-offcanvas-menu'), function (p) { mo.observe(p, { attributes: true, attributeFilter: ['class'] }); });
        }
    });
})();

/* The header menu widget keeps the transform of its finished entrance animation, which makes it the
   containing block of the fixed off-canvas panel (the panel then hangs off the burger instead of the
   viewport edge). Drop the finished animation so the panel positions against the viewport. */
(function () {
    var hosts = Array.prototype.slice.call(document.querySelectorAll('.elementor-widget-aux_menu_box.aux-appear-watch-animation'));
    if (!hosts.length) { return; }
    var settle = function (h) {
        h.style.setProperty('animation', 'none', 'important');
        h.style.setProperty('transform', 'none', 'important');
        h.style.setProperty('opacity', '1', 'important');
    };
    hosts.forEach(function (h) {
        h.addEventListener('animationend', function (e) { if (e.target === h) { settle(h); } });
        h.addEventListener('click', function (e) { if (e.target.closest && e.target.closest('.aux-burger-box')) { settle(h); } }, true);
    });
})();

/* Video modal: "watch the video" buttons carry data-video-id (and data-video-start, in seconds); the YouTube player
   is embedded only while the dialog is open (privacy-enhanced domain). Falls back to the plain link where <dialog> is unsupported. */
(function () {
    var dialog = document.querySelector('.tfc-video');
    if (!dialog || typeof dialog.showModal !== 'function') { return; }
    var frame = dialog.querySelector('.tfc-video-frame');
    var opener = null;
    var open = function (id, title, start) {
        frame.innerHTML = '';
        var f = document.createElement('iframe');
        f.src = 'https://www.youtube-nocookie.com/embed/' + encodeURIComponent(id) + '?autoplay=1&rel=0&modestbranding=1' +
            (/^\d+$/.test(start || '') ? '&start=' + start : '');
        f.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
        f.referrerPolicy = 'strict-origin-when-cross-origin'; /* YouTube refuses embeds without a referrer (error 153) */
        f.allowFullscreen = true;
        f.title = title || 'Video';
        frame.appendChild(f);
        dialog.showModal();
        document.body.classList.add('tfc-modal-open');
    };
    var close = function () { if (dialog.open) { dialog.close(); } };
    dialog.addEventListener('close', function () {
        frame.innerHTML = '';
        document.body.classList.remove('tfc-modal-open');
        if (opener && opener.focus) { opener.focus(); }
    });
    dialog.addEventListener('click', function (e) { if (e.target === dialog) { close(); } });
    dialog.querySelector('.tfc-video-close').addEventListener('click', close);
    document.addEventListener('click', function (e) {
        var a = e.target.closest && e.target.closest('[data-video-id]');
        if (!a) { return; }
        e.preventDefault();
        opener = a;
        open(a.getAttribute('data-video-id'), a.getAttribute('aria-label') || a.textContent.trim(), a.getAttribute('data-video-start'));
    });
})();

/* Header language selector: the pill toggles its list on click (desktop also opens on hover via CSS); Escape and
   clicks/focus outside close it. Handlers are delegated because the theme moves the menu into the off-canvas
   panel on narrow screens. */
(function () {
    var closeAll = function (except) {
        Array.prototype.forEach.call(document.querySelectorAll('.tfc-lang.is-open'), function (li) {
            if (li === except) { return; }
            li.classList.remove('is-open');
            var b = li.querySelector('.tfc-lang-btn');
            if (b) { b.setAttribute('aria-expanded', 'false'); }
        });
    };
    document.addEventListener('click', function (e) {
        var btn = e.target.closest && e.target.closest('.tfc-lang-btn');
        if (btn) {
            var li = btn.closest('.tfc-lang');
            var open = !li.classList.contains('is-open');
            closeAll(li);
            li.classList.toggle('is-open', open);
            btn.setAttribute('aria-expanded', open ? 'true' : 'false');
            e.preventDefault();
            return;
        }
        if (!(e.target.closest && e.target.closest('.tfc-lang'))) { closeAll(); }
    });
    document.addEventListener('keydown', function (e) {
        if (e.key !== 'Escape') { return; }
        var open = document.querySelector('.tfc-lang.is-open');
        if (!open) { return; }
        closeAll();
        var b = open.querySelector('.tfc-lang-btn');
        if (b) { b.focus(); }
    });
    document.addEventListener('focusout', function (e) {
        var li = e.target.closest && e.target.closest('.tfc-lang.is-open');
        if (!li || (e.relatedTarget && li.contains(e.relatedTarget))) { return; }
        /* Safari does not focus a clicked link, so a click on an option would otherwise close the list first */
        if (li.matches(':hover')) { return; }
        closeAll();
    });
    window.addEventListener('resize', function () { closeAll(); });
})();

/* Contact map: Firefox starts a lazy iframe only within about 600px of the screen (Chrome about 2000px), so on a phone
   the Google map, which takes a second or two to draw, could still be loading when the visitor reached it. Once the
   page itself has loaded, start it as soon as it is within one and a half screens. On a computer it is in the first
   screen and starts with the page, as before. Without script the iframe keeps its lazy loading. */
(function () {
    var frame = document.querySelector('.tfc-contact-map iframe[loading="lazy"]');
    if (!frame) { return; }
    var start = function () { frame.setAttribute('loading', 'eager'); };
    var watch = function () {
        if (!('IntersectionObserver' in window)) { start(); return; }
        var io = new IntersectionObserver(function (entries) {
            if (entries.some(function (e) { return e.isIntersecting; })) { io.disconnect(); start(); }
        }, { rootMargin: '150% 0px' });
        io.observe(frame);
    };
    if (document.readyState === 'complete') { watch(); } else { window.addEventListener('load', watch); }
})();

/* Sticky header (round 31): the header is sticky in CSS; this marks the body once the page has scrolled past
   the first 120px so it can compact and take its shadow. A sentinel element is used instead of a scroll
   listener so the browser does the work; without IntersectionObserver the header simply stays full height. */
(function () {
    var header = document.querySelector('.aux-elementor-header');
    if (!header || !('IntersectionObserver' in window)) { return; }
    var sentinel = document.createElement('div');
    sentinel.setAttribute('aria-hidden', 'true');
    sentinel.style.cssText = 'position:absolute;top:0;left:0;width:1px;height:120px;pointer-events:none;visibility:hidden';
    var host = header.parentNode;
    if (getComputedStyle(host).position === 'static') { host.style.position = 'relative'; }
    host.insertBefore(sentinel, host.firstChild);
    var io = new IntersectionObserver(function (entries) {
        document.body.classList.toggle('tfc-stuck', !entries[0].isIntersecting);
    }, { threshold: 0 });
    io.observe(sentinel);
})();
