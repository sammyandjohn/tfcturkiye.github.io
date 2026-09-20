# TFC Turkiye — static site

Static HTML/CSS/JS conversion of https://www.tfcturkiye.com/ (WordPress, Phlox Pro theme + Elementor).
No PHP, WordPress, or remote server is used at runtime; every asset is local. The only
external resources are the Google Maps embed on the contact pages and the YouTube player that the
homepage video modal loads while it is open.

## Deploying updates

The static host (static.app / Cloudflare) serves the HTML uncached but every asset with a four-hour
cache, so a redeploy that changes `site.css`, `site.js` or an image under the same file name leaves
returning visitors with the new markup and the old stylesheet until their cache expires. The pages
therefore reference `assets/css/site.css`, `assets/css/rtl/site.css`, `assets/js/site.js` and the
service icons with a `?v=…` query string: bump it (search-and-replace across the 45 pages) whenever
those files change. The host also injects a "Hosted for free" badge at the bottom-left corner; a rule
at the end of `site.css` lifts the floating language switcher above it when that badge is present.

## Run it

Open `index.html` directly in a browser, or serve the folder with any static file server:

```
python3 -m http.server 8000
```

Pages live at their original URL paths (`about/index.html`, `services/property-investment/index.html`,
`tr/index.html`…) and every internal link points at the page file explicitly, so navigation works
both from disk and on any host.

## Pages (45)

| English | Turkish | Arabic |
|---|---|---|
| `index.html` — Home | `tr/index.html` | `ar/index.html` |
| `about/` | `tr/about/` | `ar/about/` |
| `services/` + 6 service pages (`services/<slug>/`) | `tr/services/…` | `ar/services/…` |
| `blog/`, 2 posts (`<post-slug>/`) | `tr/blog/`, `tr/<post-slug>/` | `ar/blog/`, `ar/<post-slug>/` |
| `contact/` | `tr/contact/` | `ar/contact/` |
| `author/yonetici-1/`, `category/uncategorized/` (archives) | `tr/author/…`, `tr/category/…` | `ar/author/…`, `ar/category/…` |

Each page is the fully rendered markup of the live page (header, menus with the correct
active item, footer, off-canvas panels) with WordPress-only output removed and all URLs
rewritten to local relative paths. The language switchers (the "Languages" menu and the
floating switcher) list all three languages and link to the same page in each language.

The live site's Turkish pages were only partially translated (TranslatePress had covered
the menu service names and the homepage hero/process copy). The `/tr/` pages here carry a
complete Turkish translation ("gayrimenkul" is used for "property" throughout, never "mülk"):
page titles and meta descriptions, menus, all page copy,
both blog posts, form labels and placeholders, archive headings, dates, the Chaty contact
widget strings and Elementor's UI strings (`assets/js/config.tr.js`). Proper nouns, the
language names in the switcher, and the Latin placeholder paragraphs on the service pages
are left as they are.

### Arabic (`/ar/`, right-to-left)

The Arabic pages do not exist on the live site; they are generated from the English pages
with the same coverage as the Turkish ones (`assets/js/config.ar.js` carries the widget /
Elementor strings). They render right-to-left (`<html lang="ar" dir="rtl">`):

- The theme and Elementor ship RTL builds, which the Arabic pages load instead of the LTR
  ones (`assets/vendor/phlox/rtl.css`, `assets/vendor/elementor/css/*-rtl.min.css`,
  `assets/vendor/contact-form-7/styles-rtl.css`).
- The site's own Elementor CSS only exists left-to-right, so `assets/css/rtl/` holds
  mirrored copies of every file in `assets/css/` (margins, paddings, positions, floats,
  text alignment, radii and shadow offsets flipped; letter-spacing removed because it breaks
  joined Arabic letters). `assets/vendor/phlox/css/portfolio-rtl.css` is the same kind of
  mirror for the theme's portfolio styles. These are generated: edit the originals.
  `assets/css/rtl/site.css` ends with a few hand-written RTL-only rules (mobile off-canvas
  menu side, blog read-more floats, project navigation arrows).
- The site's Google fonts have no Arabic glyphs. `assets/css/fonts/*.arabic.css` declare
  Tajawal (`assets/fonts/tajawal/`, SIL Open Font License) under the same family names,
  restricted to the Arabic unicode range, so Arabic text uses Tajawal while Latin text and
  digits keep DM Sans / Quicksand / etc. Each `.arabic.css` accompanies the Latin stylesheet
  of the same name. Change the Arabic typeface by swapping the files referenced there.
- Canonical / `hreflang` links for `/ar/` point at `https://www.tfcturkiye.com/ar/…`, the
  address the pages would have when deployed next to the live site.
- The "Turrist" brand is written **توريست** in the Arabic menus (Latin elsewhere: URLs, alt text).

## Site polish on top of the live design

These changes are not on the live site; they live in the block at the end of
`assets/css/site.css` (duplicated in `assets/css/rtl/site.css`, written with logical properties so
the same rules serve both directions), in `assets/js/site.js`, and in the page markup:

- **Logos**: `assets/images/logo/logo.svg`, `logo-tr.svg` ("TFC Gayrimenkul Hizmetleri") and
  `logo-ar.svg` ("TFC خدمات العقارات", mark on the right) replace the blurry 998×457 PNG. The mark is drawn
  geometrically and the wordmark is outlined from the site's own fonts (DM Sans / Tajawal), so the files
  need no web font. The header, sticky header, footer and mobile panel size them by height (`site.css`,
  "Brand + navigation" block); the old PNGs were removed.
- **Footer clearance**: the copyright container keeps 60px bottom padding up to 1024px (the go-to-top button and the floating language switcher sit at that height on small screens) and 16px above that.
- **Batch 3 tweaks**: the "Polish batch 3" block in `site.css` keeps the homepage services title on one line, enlarges the About right column, pins the floating language switcher to the page gutter, hides the portfolio demo meta box on the service pages, and keeps the phone previous/next labels on one line. The service navigation now says "Previous Service / Next Service" (TR "Önceki/Sonraki Hizmet", AR "الخدمة السابقة/التالية"). The service body copy is still the theme demo text and needs real content.
- **Archives + blog title**: the "Polish batch 2" block in `site.css` restyles the category and author archive cards to the blog page card, unhides and restyles the theme page title on those archives, and styles the `.tfc-page-head` H1 inserted at the top of the three blog pages. The empty "Tags" line was removed from the six posts, the WP ULike heart is hidden (it needs WordPress), and the author is shown as "TFC Türkiye" instead of the login name.
- **Polish rules**: the "Polish batch 1" block at the end of `site.css` (mirrored in `rtl/site.css`) restyles the custom eyebrow labels and section titles to the theme scale, overrides the theme's cyan/yellow link hovers with brand blue, unifies the two submit buttons with the pill style, adds keyboard focus rings, and keeps the About team captions visible at every width.
- **Service icons**: the six portfolio tiles (home, services, about, related-services grids) use one
  consistent SVG set, `assets/images/icons/service-*.svg` (48-unit grid, 2px brand-blue strokes, a
  literal motif per service plus one yellow accent, no background baked in; refs carry `?v=20260911d`; the tinted rounded tile is `img.tfc-service-icon` in `site.css`), also
  as the featured image of the six service pages and in their previous/next navigation. The old PNGs and
  their size variants were removed; the icons are decorative (`alt=""`) because a title always sits next to them.
- **Header / footer navigation**: one link style for both menus (15px, brand-blue hover with an
  underline that grows from the centre, navy bold current item, visible focus ring, dropdown caret that
  flips on hover). The header's empty second column is hidden so the menu keeps one row down to 1025px.
- **Header dropdowns** are centred under their parent item and drawn as a white card with a caret.
- **Mobile off-canvas menu**: hidden unless it carries `.aux-open` (it can no longer appear open
  on load), 340px panel pinned to the burger's screen edge (right in LTR, left in RTL) with the logo, round
  close button, taller rows, indented sub-menus, a dimmed backdrop (closes on tap) and body scroll lock.
  `site.js` holds the guard and also drops the menu widget's finished entrance animation, whose leftover
  transform otherwise turns the widget into the containing block of the fixed panel.
- **Footer menu** is a flat inline list (no burger, no dropdowns, no "Languages" item, which the
  floating switcher covers) centred with the logo; on phones it wraps and centres.
- **Floating language switcher**: the TranslatePress one described in earlier notes is retired; the site's
  own `.tfc-lang-float` (round 4) sits bottom-left in every language, opposite the chat widget. The
  theme's go-to-top arrow sits above the chat button (bottom-left on Arabic desktop).
- **Homepage**: the hero "Watch the video" button opens a `<dialog>` video modal (`.tfc-video`,
  `site.js`); the YouTube player (privacy-enhanced domain) is only embedded while the modal is open and
  the video id lives in the button's `data-video-id` (currently a placeholder). On phones the
  process section has no wave line and its number badges skip the entrance animation, and the testimonial avatars are SVG initials in the
  brand colours (`assets/images/avatars/`, Latin for EN/TR, Arabic for AR) instead of stock photos.
- **About page**: the long text widget is rebuilt as an intro, a mission band, four cards, a
  "why choose us" grid and a closing block (`.tfc-about…` markup) styled in the site's own language
  (blue label, large headings, tinted borderless cards, yellow markers) at the full container width;
  the team photos become a two-column grid with always-visible names under 768px (they are hover-only on desktop).
- **Contact page**: rebuilt as one section (`.tfc-contact`): heading, three contact cards
  (`tel:` / `mailto:` / map links) with the map under them, and the Contact Form 7 form beside them
  (labels above 52px fields, `required` on the required inputs, a proper submit button). The form
  still needs a backend, see "Forms".
- **Property Selling page**: its text widget had a fixed 1050px width from the live site and ran off
  the screen on phones; `site.css` gives it a full-width override below 1024px.

## Layout

```
<page>/index.html          one folder per page, mirroring the original URL structure
assets/
  css/
    fonts/<families>.css   self-hosted Google Fonts; each page links the theme's set plus the
                           Elementor set its widgets request (same @font-face availability as live)
    fonts/<families>.arabic.css  Arabic (Tajawal) faces under the same family names — /ar/ pages only
    rtl/                   mirrored (right-to-left) copies of the files below — /ar/ pages only
    theme-custom.css       Phlox customizer output (body font, logo size, colors…)     — site-wide
    header.css             Elementor header template styles                          — site-wide
    footer.css             Elementor footer template styles                          — site-wide
    elementor-kit.css      Elementor global colors/typography/container width         — site-wide
    site.css               inline <style> blocks from WP (custom CSS, widget tweaks)  — site-wide
    wp-blocks.css          Gutenberg block styles (blog posts, block content)
    pages/<page>.css       per-page Elementor styles (home, about, services, blog, contact, service-*)
  js/
    config.js              runtime config objects the vendored scripts read (Elementor, Chaty, theme)
    config.tr.js           Turkish UI strings for Elementor (loaded on /tr/ pages)
    config.ar.js           Arabic UI strings + RTL flags for the theme/Elementor (loaded on /ar/ pages)
    site.js                small site-wide behaviour (background lazy-load, menus, video modal, contact map start)
  fonts/<family>/          woff2 files referenced by css/fonts/*.css (tajawal/: Arabic subset only)
  images/<yyyy>/<mm>/      media library files (same path structure as wp-content/uploads)
  images/icons/            service icons (SVG) used in the portfolio grids and service pages
  images/logo/             SVG logos (EN / TR / AR), text outlined
  images/avatars/          testimonial avatars (SVG initials)
  vendor/                  third-party CSS/JS kept in their original internal layout
    phlox/                 theme CSS (base, main, icons, portfolio, rtl) + theme JS (menus, off-canvas, animations)
    elementor/             frontend CSS/JS, widget CSS, lazy chunks (lightbox etc.), swiper, eicons, dialog
    auxin-elements/, auxin-pro-tools/   Phlox widget scripts
    fontawesome/           Font Awesome Free 5.15.4 (single copy for theme + Elementor)
    contact-form-7/        form styles (see "Forms" below)
    chaty/                 floating WhatsApp / phone / e-mail contact widget
    translatepress/        language switcher (menu + floating) and flags
    jquery/, imagesloaded/, masonry/, wp-ulike/
```

Vendor files are unmodified copies, so `url()` paths inside them keep working; only the
WordPress page CSS in `assets/css/` had its absolute upload URLs rewritten to `../images/`.

Every page loads the same shared stylesheet/script set in the theme's original cascade
order, plus its own `assets/css/pages/<page>.css` (Elementor pages) and, for posts and
archives, `wp-blocks.css`. Shared blocks in the markup are delimited with
`<!-- ===== SITE HEADER ===== -->`, `PAGE CONTENT`, `SITE FOOTER`, `OFF-CANVAS PANELS…`
and `SCRIPTS` comments so a new page can be assembled by copying any existing one.

## Forms (need a backend)

WordPress handled these server-side; static hosting cannot:

- **Contact form** (`contact/`, `tr/contact/`, `ar/contact/`): markup and styling are intact, `action`
  is a placeholder `#`. Point `action` at a form endpoint (Formspree, Netlify Forms, your
  own API) to make it send. An HTML comment above the form marks the spot.
- **Comment forms** on the two blog posts: same situation; placeholder `action="#"`.
- **Search overlays** (`#fs-search`, `#fs-menu-search`): kept for the theme scripts but
  not reachable from the UI and have no backend.

## What was intentionally left out

- WordPress-only head/foot output: RSS/oEmbed/REST links, emoji script, speculation
  rules, generator tags, bot-check link, and the `noindex, nofollow` robots meta that the
  WordPress install currently sets.
- Scripts that only talk to the WordPress backend: Contact Form 7 JS, WP ULike JS (like
  buttons are display-only), portfolio AJAX filtering / "load more" (every item is already
  in the markup; the theme's 70px list spacing is kept via `.aux-loadmore-static`),
  TranslatePress dynamic-DOM translator, comment-reply script, MediaElement player (no
  media on the site), Go Pricing tables.
- The homepage "Photos" gallery section is present in the markup but hidden by the
  site's own custom CSS, exactly as on the live site.
- The unlinked default WordPress "Sample Page".
- Font Awesome / theme icon fonts ship only in woff2/woff (+ttf for the theme icons);
  the legacy eot/svg formats referenced for old IE are omitted.
- No favicon exists on the live site (WordPress serves its default); pages point the
  icon at an empty `data:` URL so browsers don't request one.
- Canonical and `hreflang` links still point at the live domain, as on the original.

### Round 3, batch A (2026-09-12)
- `site.css?v=20260912c` (mirrored to `rtl/site.css`): services icon frames no longer cast the square shadow
  (tile carries its own), About text uses the 35px gutter below 1025px, phone type scale on the homepage
  (16/15/17/14), footer copyright band (line → 24px → centred text → 32px desktop / 48px tablet / 100px phone
  for the chat bubble), one section rhythm on Home / About / Contact (desktop 140px between sections, 70px
  heading → content; phones 90 / 40), About team boxes sized by the photo aspect ratio (no empty band).
- Phones: the go-to-top button moves to the bottom-left corner (level with the chat bubble) so the copyright line clears it.
- The floating TranslatePress switcher is hidden by CSS (`.trp-floating-switcher`); batch B2 replaces it with
  the header selector and removes the markup.
- Contact form (EN/TR/AR): Subject optional, Your message required; EN meta description rewritten.

### Round 3, batch B (2026-09-12)
- Header language selector: the "Languages" text item is now `li.tfc-lang` — a flag + code pill (`EN ▾`) with a
  dropdown list (flag + native name, current marked). Opens on hover (≥1025px), on click, and with Enter; Escape,
  a click outside or tabbing out closes it (`site.js`, delegated handlers because the theme moves the menu into the
  off-canvas panel). In the panel the pill is hidden and the same list shows as inline pills under a "Language" title.
- The floating TranslatePress switcher markup is removed from all 45 pages (its CSS file link is kept; harmless).
- Footer: `nav.tfc-footer-nav` under the main links carries a Services row (six service links, from the page's own
  header menu so relative paths are right at every depth) and a Language row (three flag links, current in navy).
  Left-aligned on desktop, centred ≤1024px. The empty footer column `9361c41` is hidden.
- Generated by `scratchpad/batchb.py` (regex over the header menu of each page); labels: Services from the header,
  Language = Language / Dil / اللغة.
- Header gaps tighten to 22px between 1025 and 1150px so the Turkish menu plus the pill stay on one row.

### Round 3, batch C (2026-09-12)
- Icons (`?v=20260912e` on the two changed files): Property Selling = house + yard "SOLD" sign (yellow board, SVG
  text in Arial/Liberation Sans bold, legible at the 60px prev/next size); Short-Term Renting = house + yellow
  suitcase + rating star (hosting travellers; the Airbnb logo itself is a trademark and is not used).
- Testimonial photos: `assets/images/avatars/{ahmed,maria,omar}.{jpg,webp}` 240×240, served via `<picture>` (WebP
  first, JPG fallback) on the three home pages; the SVG monograms are gone. Sources are Pexels (free licence, no
  attribution required): Ahmed A. = photo 10582832 (Alireza RBM), Maria L. = 2530364 (Golnar Sabzpoush Rashidi),
  Omar H. = 19469865 (Omer Gulen). Candid, natural-light photos chosen on purpose; they are models, not the clients.

### Round 3 review (2026-09-12)
- `site.js?v=20260912f`: the language list also closes on viewport resize, and a focus loss while the pointer is still
  over the list no longer closes it (Safari does not focus a clicked link, so the option click could be lost).
- Verified: static (45 pages: versions, generated markup, every footer/selector link target exists, hreflang targets
  match, current-language option is the page itself, tag balance, contact required flags, SVG parse, CSS braces,
  RTL tail identical), and in the browser (sticky-free header, hover/click/keyboard/Escape, resize state, off-canvas
  pills navigate, Services accordion still opens, go-to-top clickable on phones, tablet/RTL footers).

### Round 4 (2026-09-13)
Versions: `site.css` / `rtl/site.css` `?v=20260913b` (spacing rework; `a` was the first cut), `site.js?v=20260913a`, `service-property-selling.svg` and `service-short-term-renting.svg` `?v=20260913a`.

- **Icons** — Short-Term Renting lost the star (house + suitcase, group nudged 2px right); Property Selling "SOLD" baseline moved from 28.9 to 26.8 so the text sits centred on the yellow board.
- **Section rhythm (site-wide)** — the "4.5" block at the end of `site.css` sets `--padding-bottom` per section so that *rendered* content-to-content distances are: 100px between sections, 48px between a section label and its content, 110px from the last content to the footer band, 60px from the header to the first content on sub-pages; phones 60 / 28 / 64 / 32. Values were tuned by measuring the pages headlessly (scratch scripts `space.js` / `explain.js`), so they include each block's internal whitespace (portfolio grid margins, card paddings, the footer band's own 90px top padding — was 130). Archive pages keep the theme's 170px bottom padding overridden with a `.category main.aux-archive .aux-primary` rule (specificity had to beat an earlier `!important`).
- **Blog meta** — `.entry-info` (date / author / category), `footer.entry-meta` (share + like) and `#respond` (comment form) removed from the six post pages; `.entry-info` and `.comments-iconic` (like widget) removed from post cards on home, blog, category and author pages. Static markup removal, no CSS hiding.
- **Header language list** — centred under the pill (`left:50%; translateX(-50%)`) with a 12px rotated-square notch (`.tfc-lang-list::after`), 14px below the pill like the Services submenu. Hidden in the off-canvas panel.
- **Floating switcher** — `.tfc-lang.tfc-lang-float` (same markup as the header pill, generated from each page's own header block by `round4.py`), fixed bottom-left, list opens upward with the notch at the bottom. Phones: pill at 16/18px; the go-to-top button is hidden ≤767px (it sat over card text once the corners were taken).
- **About team (phone)** — the caption block is transparent and a `::after` gradient covers only the bottom 56% of each card (the previous caption-block gradient darkened ~70% of the photo).
- **Video** — `site.js` sets `referrerPolicy` on the YouTube iframe. Error 153 ("Video player configuration error") is YouTube refusing an embed that arrives without a Referer; that happens when the HTML is opened from disk (`file://`). Over http/https the modal plays (verified on the deployed site and locally). The About hero now carries the same "Watch the video" icon-box widget (`elementor-element-01bde3a`, styled for `.elementor-174` in site.css since Elementor's per-page icon-box CSS is not loaded there) and the `<dialog class="tfc-video">` block.
- **Service page template** — the 18 service pages (`services/*/`, `tr/services/*/`, `ar/services/*/`) now share one custom layout (`article.tfc-svc`): hero (label, H1 from the page title, lead, "Contact us" → contact page, "WhatsApp" → `wa.me/905076354088`, icon tile), "What's included" (4 tint cards), "How it works" (3 numbered steps), then the theme's prev/next service nav. The Phlox demo lorem paragraphs and gallery images are gone; meta descriptions rewritten. **The copy is deliberately generic and identical on all six pages** (EN/TR/AR) until per-service content is written — it lives inline in each page (`.tfc-svc-lead`, `.tfc-svc-grid`, `.tfc-svc-steps`). The per-page `service-*.css` files are still loaded but no longer style anything visible.

### Round 4 review (2026-09-13)
- Turkish and Arabic copies measured with the same scripts: two language-specific corrections added (`:lang(tr)` testimonial slider padding on desktop, `[dir="rtl"]` footer band top padding), phone blog-section padding raised so the last gap lands on 64px in all three languages.
- The floating switcher is hidden while the off-canvas panel is open (`body.tfc-oc-open`, the panel has its own pills); it is not covered by the panel overlay otherwise.
- Off-canvas language pills verified unaffected by the centring rule (static, no transform) at 414 and 820; no horizontal overflow at 820 on any page; full 45-page sweep at 1366/414 clean.
- Pre-existing bug fixed: the (CSS-hidden) breadcrumb on `tr/category/` and `tr/author/` had an unclosed `<a>` closed by a `</span>`.
- Property Investment shows only a "Previous service" link because it is the last item in the theme's order — unchanged behaviour, not a template bug.

### Round 4, spacing rework (2026-09-13)
The first rhythm pass measured element boxes at scroll position 0. Two things made that unrepresentative: text boxes carry line-height/padding above the glyphs, and the theme's scroll parallax (`aux-scroll-anim`, `AvertaScrollAnims`) moved the hero and About images by up to 60px depending on scroll position, so the same gap looked different at different scroll offsets and screen sizes.
- Parallax removed: the `aux-scroll-anim` class is gone from the 24 elements that had it (home + About heroes, home About image, decorative shapes; EN/TR/AR). Entrance animations are untouched.
- New scale, measured on *visible* boxes (text glyphs via Range rects, images, tinted cards, the blue footer band) with each boundary scrolled into view (`scratchpad/pup/space3.js`): **120px between sections, 56px label→content, 120px last content→footer band, 60px header→first content on sub-pages; phones 72 / 32 / 72 / 32.** Identical at 1366 and 1920. The service page prev/next nav now carries the 120px bottom padding; contact, services, blog, post and archive pages got matching bottom paddings.
- Review of the rework: no theme CSS depended on the removed `aux-scroll-anim` class (its data-attributes stay, harmless). Tablets (768–1024) needed three home paddings and the service-page nav padding of their own because the About columns stack and the testimonial slider grows there; measured at 1024 and 820 afterwards. Turkish/Arabic posts, archives, blog, contact and service pages measure the same as English. The only sweep flag is the Google Map on one Arabic post making external requests in headless Chrome.

### Service page content (2026-09-13)
All 18 service pages now carry real copy in EN/TR/AR, generated from `scratchpad/svc_content_{en,tr,ar}.py` by `svc-content.py`: a service-specific lead, four "What's included" cards, three "How it works" steps and a new closing description section (`.tfc-svc-text`: title, sub-headings, paragraphs and bullet lists, 310–380 words per page in English). Facts were taken from the home/About pages and the two blog posts (USD 400,000 citizenship threshold, three-year holding period, family inclusion, 3–6 month timeline, permit requirement for short-term lets, compulsory earthquake insurance, five-year capital-gains exemption) and kept general where rules change. Meta descriptions are per service. The previous/next service navigation was removed from the pages and its CSS deleted; the article now carries the 120px (phone 72px) bottom spacing itself. Versions: `site.css` / `rtl/site.css` `?v=20260913c`.

### Copy edit (2026-09-13)
Proofread all 45 pages and toned down the most generic, AI-sounding phrasing, sentence by sentence and in all three languages: the home hero and process steps, two About Us paragraphs on the home page, the About page (mission, team, market knowledge, client approach, "Why Choose Us" and closing words) and the closing paragraphs of both blog posts. Em dashes in the copy were replaced with commas, colons or parentheses. Fixes: "Become Citizen" → "Become a Citizen"; the citizenship post's merged "Land Registry / Transfer funds" bullet split in two; the Turkish holding-period bullet made imperative like its neighbours; "Beyoglu" → "Beyoğlu" on the English contact page; Arabic author page `<title>`; filename alt texts on the two blog images replaced with descriptions. Meta descriptions rewritten where they were WordPress leftovers (home, About, blog, whose description was placeholder lorem ipsum, services, both English posts). Service pages: American spelling to match the rest of the English site, curly apostrophes (EN/TR), and a few awkward sentences reworded (`svc-content.py` now converts `'` to `’`). No CSS/JS changes, so no version bump.
Turkish follow-up: literal translations from English removed from the service copy: "kısa liste" (shortlist) → "ön seçim" / "sizin için seçeriz", "geliştirici" (developer) → "müteahhit", "kapanış" (closing) → "tapu devri", "ekstre" (statement) → "hesap dökümü" / "rapor", plus "risk iştahı", "ev sahipliği standardı", "Devralma", "Misafir operasyonu", "neye benzer", "kanıta dayalı", "uygun satın alma" (now "şartlara uygun"), "Nasıl çalışır?" (now "Süreç nasıl işler?"). Same fix for "Geliştiricilerin" in the Turkish Turkey post.

### Round 5 (2026-09-13)
- **Home About column** — the four feature blurbs beside the photo are now 20px titles / 17px text (18/16 below 1400px, 19/16 on phones); the older 16px/15px override and the 13–14px ≤1400px rule no longer apply.
- **Hero video** — the "Watch The Video" icon-box next to "Learn More" is gone from the home hero (EN/TR/AR); the trigger is now a play button with its label on the hero photo (`a.tfc-hero-play`, bottom-left, bottom-right in Arabic, pulsing ring off under `prefers-reduced-motion`). The About hero lost the same icon-box; its existing play button on the photo (`elementor-element-e12b0a5`, previously `href="#"`) now opens the video modal. The CSS for the removed About widget was deleted.
- **Footer band** — equal top/bottom padding (110px desktop, 56px tablet, 44px phone, all languages) and both columns vertically centred on each other; the old 90px-top / 130px-bottom split and the Arabic 77px correction are removed.
- **Favicon** — taken from the logo mark (three blue blocks with T F C): `favicon.ico` at the root (16px hand-drawn pixel version, 32/48 rendered), `assets/images/logo/favicon.svg` (letters drawn slightly bolder so they survive tab size), `apple-touch-icon.png` (180px, white padding), `icon-192/512.png` and `site.webmanifest`. Linked from all 45 pages in place of the empty `data:,` icon.
- **Service template v2** (`scratchpad/svc-content.py`) — the page now uses the site's 1600px width and 35px gutters (the old 1200px cap and zero phone gutters caused the cut-off cards on phones). Hero on a tinted panel with breadcrumb (Home / Services / name), larger H1 and the icon on a white tile with the blue/yellow shapes from the home hero; "What's included" as white bordered cards with check icons (4 / 2 / 1 columns); "How it works" on a tinted band with dashed connectors (vertical timeline on phones); the long text now sits beside a sticky aside with a blue "Talk to an adviser" card (contact + WhatsApp) and links to the other five services. Body copy 16–17px in a darker grey (`--svc-text:#566074`). New UI strings in `svc_content_*.py` (`crumbs`, `home`, `services`, `aside_h`, `aside_p`, `other`).
- **Turkish** — second naturalness pass. Service copy rewritten sentence by sentence (active voice, everyday wording: "kurum içi avukat" → "ekibimizdeki avukat", "Asla atlamadığımız kontroller" → "Her zaman yaptığımız kontroller", "Neler dahil?" → "Hizmete neler dahil?", etc.). Other pages (`scratchpad/tr-natural.py`): home hero, process steps, About Us block and testimonials; About page ("Varlık Optimizasyonu" → "Değer Artırma", "Kanıtlanmış Uzmanlık" → "Deneyimli Ekip", "…arkasındaki ekiple tanışın" → "TFC Türkiye ekibiyle tanışın" and others); contact intro; both posts; footer band text; "Anasayfa" → "Ana Sayfa"; "Bilgi Edinin" → "Daha Fazla Bilgi". Versions: `site.css` / `rtl/site.css` `?v=20260913d` (JS unchanged).

### Round 6: footer (2026-09-13)
- **Blue band** — one inner width (112px side padding desktop, 80px ≤1366, heading column flexible, text column 440/400/340px), paragraph now regular weight 18px (was bold 20px), 32px corner radius, a yellow circle in the top corner and a faint white ring in the opposite bottom corner (both mirrored in Arabic, sized so they never touch the text). Phones: 30px heading instead of 22px, so it no longer looks smaller than the paragraph.
- **Lower footer** — the old logo + menu row, the "Services"/"Language" link rows and the centred copyright line are replaced by `div.tfc-footer` (built by `scratchpad/r6-footer.py`, idempotent, reads links/labels/logo/copyright from each page so paths and translations are unchanged): brand column (logo, one-line description, WhatsApp button), Company links (Turrist keeps its red), Services, Contact (phone, e-mail, address with Google Maps link), then a bottom bar with the copyright on one side and the three language pills on the other. The current page is marked with `aria-current="page"`. Four columns on desktop; on tablets the brand spans the top and the three link columns sit below; on phones Company/Services sit side by side and Contact goes full width, with the bottom bar centred and padded clear of the floating switcher and chat bubble.
- CSS for the removed footer elements (35 rules and 2 emptied media blocks) deleted. Versions: `site.css` / `rtl/site.css` `?v=20260913e`.

### Round 7 (2026-09-13)
- **Service pages** — the long-text column has no max-width any more; it fills the space next to the aside.
- **Home hero** — the "Watch The Video" icon-box is back next to "Learn More" (restored from the pre-round-5 markup, EN/TR/AR); the pill on the photo is gone.
- **About hero** — the play button on the photo is now a pill with its label ("Watch The Video" / "Videoyu İzleyin" / "شاهد الفيديو"), centred on the photo, opening the video modal.
- **Mobile menu** — the round close button only reacted on the 16px cross inside it (the theme binds the cross); `site.js` now forwards taps anywhere on the 40px circle.
- **Back-to-top on phones** — shown again, in the bottom-right corner above the chat bubble.
- Versions: `site.css` / `rtl/site.css` `?v=20260913f`, `site.js` `?v=20260913b`.

### Review of rounds 5–7 (2026-09-13)
Checked: every internal `href`/`src`/`srcset` on the 45 pages resolves (0 missing); tag balance unchanged against the pre-round-6 backup; no page has horizontal overflow or JS errors at 360/768/1024/1920 px; the mobile menu closes from the cross, the edge of the round button and a tap outside, in EN/TR/AR (Arabic panel opens on the left); the phone back-to-top button is hidden at the top, appears after scrolling, sits clear of the chat bubble and language switcher and scrolls back to the top; video modal opens from the home icon-box and both About pills; `svc-content.py` and `r6-footer.py` re-run without changing any page.
Fixed during the review:
- **Service aside was not sticky**: the theme's `.aux-full-width #inner-body { overflow-x:hidden }` made `#inner-body` a scroll container. Service pages now use `overflow-x:clip` there (same clipping, no scroll container; behind `@supports`). On screens shorter than 820px the aside (≈780px tall) scrolls normally instead.
- **1025–1280px**: footer columns re-weighted so the address no longer breaks into four lines, and the band heading drops to 46px (it wrapped into five lines).
- **Dead CSS removed**: the old footer menu styles (`.aux-elementor-footer .aux-master-menu …`, including its phone wrap rules; the header rules that shared those selector lists are untouched), the `09ec041`/`c4cb033` leftovers, and two superseded phone positions for the back-to-top button (only the "above the chat bubble" rule remains).
Versions: `site.css` / `rtl/site.css` `?v=20260913g`, `site.js` `?v=20260913b`.

### Round 8: frontend audit fixes (2026-09-14)
Audit: all 45 pages at 360/414/768/1024/1280/1920 px (scrolled through for lazy content) for JS/console errors, failed requests, overflow, clipped or overlapping text, broken/distorted images, tiny text and tap targets, plus screenshots of every page type at 390/820/1440 (and 1025–1366/1920 where relevant) in EN/TR/AR and interactive checks of menus, switchers, off-canvas, video modal, chat and keyboard navigation. No JS errors, failed requests, broken images or page overflow were found. Fixed:
- **Arabic About team captions** (≤768px) were shifted ~30px and cut off: a legacy rule `.elementor-widget-aux_staff { left:25% !important }` became `right:25% !important` in the RTL copy. The legacy rule is removed from both stylesheet heads and the caption rules reset `right` as well. A duplicate 768–1024px team block was removed (the later copy is the one that wins over the `min-width:768px` block, so it stays).
- **Home "Latest Posts"**: the small card's title no longer stops after two lines ("…by Property" without "Investment"), the featured excerpt is clamped to three whole lines with an ellipsis instead of a fixed 71px box; on phones the Read More buttons are no longer flush with the card edge (a "last card" rule matched both cards), both cards use the same button and title style and sit 30px apart.
- **About hero** (1025–1280px): 24px row gap in the text column; the label no longer touches the heading and the paragraph no longer touches the buttons.
- **Service tile titles** are centred when they wrap (home/About on tablets, Turkish on phones).
- **Home "Our Process"**: step columns align to the top (step 1 sat ~12px lower).
- **Home hero blue shape** is pinned to the photo's top edge at 1025–1439px (it climbed into the header behind the language pill).
- **Hero headings**: the theme's 5px margin before the second span is removed (double gap in "Our  Priority", indented second line on About).
- **Blog posts**: headings in the article use line-height 1.3 (was the theme's 1.8).
- **Home on tablets** (768–1024px): testimonials 15px (names 16px, job titles 14px), About paragraph 16px, process text 15px; previously 14/14/12px, smaller than on phones.
- **Archives**: blog cards use the category/author card type (25px titles, 16px excerpts); stacked category/author cards on phones are 40px apart (was 10px).
- **Service icons**: each SVG's `viewBox` re-centred so every glyph takes 72% of its tile (the "SOLD" sign and the residency badge touched the tile edge); icon `?v=` unified to `20260914a`.
- **Keyboard access**: the mobile menu burger is a focusable button (`role="button"`, localised `aria-label`, `aria-expanded`, Enter/Space); focus moves to the panel's close button (also a button now) and returns to the burger when the panel closes. The visually hidden site-title link is out of the tab order and the header logo shows a focus ring.
Not changed (need a decision): the 3-column blog/archive grids and home Latest Posts leave an empty column while there are only two posts; the chat widget's "Contact us!" label covers content on phones; the contact form still needs a real endpoint.
- **Service pages, "How it works"** (follow-up): the steps are white cards on the tinted band with the yellow numbers on a dashed rail above them and a small pointer from each card to its number, text centred under the centred heading (the heading was centred over left-aligned columns with empty space on the right). Tablets (≤1024px) get a vertical timeline with the numbers beside the cards; phones stack the cards with the number on the top edge and a short dashed link between them. CSS only (section 4.6), mirrored to RTL.
Versions: `site.css` / `rtl/site.css` `?v=20260914d`, `site.js` `?v=20260914a`.
- **Service pages, "What's included"** (follow-up): the four identical check marks are replaced by an inline line icon per item (24px, stroke 2, `currentColor`, same order in EN/TR/AR): investment — search/chart, document check, signing pen, lifebuoy; management — people, banknote, wrench, scales; selling — rising chart, megaphone, person check, key; short-term renting — clipboard check, price tag, reception bell, bar chart; citizenship — map, house check, folder, passport; residency — checklist, documents, calendar, renew arrows. Markup only (18 pages); the `.tfc-svc-check` tile styling is unchanged. The wrench and scales follow the Feather (MIT) / Lucide (ISC) shapes.

### Round 9: contact form paused (2026-09-14)
The contact form has no backend yet, so on the contact page (EN/TR/AR) a notice card (caution stripe, cone icon) floats over the blurred, faded form and says the form is under construction and asks visitors to use WhatsApp or the phone for now, with a WhatsApp button (`wa.me/905076354088`) and a call button (`tel:+905076354088`). The form stays visible behind it (blurred and greyed out): its wrapper carries `inert` and `.tfc-form-paused`, and the four fields and the submit button are `disabled`, so it cannot be focused, typed into or submitted. Styles: "Round 9" block at the end of `site.css` (mirrored to RTL).
To re-enable the form once it has an endpoint: delete the `.tfc-form-notice` block, remove `inert` and `tfc-form-paused` from the `.wpcf7` wrapper and the five `disabled` attributes, and point the form `action` at the backend.

### Round 10: service icons redrawn from the ChatGPT artwork (2026-09-14)
The six `assets/images/icons/service-*.svg` files are new vector versions of the ChatGPT PNGs in the same folder (buildings with a rising arrow, house with a clipboard, house with a SOLD sign, passport with crescent and star, house with a suitcase, ID card with a house). They were redrawn as clean strokes and shapes over the PNGs rather than auto-traced, so each file is 0.5-1.7 KB and scales sharply. Edits against the originals: site colours (`#0E47C0` blue, `#FFDA2B` yellow, `#4A94F5` windows), the same line weight across the set (about 4% of the tile), transparent background, the glyph centred at 72% of a square `viewBox` like the previous icons, the SOLD lettering drawn as paths (no font dependency), and the overlap artefacts cleaned up (roof slivers beside the clipboard clip and the sign, the ring around the sign hook, flat cut ends on the ID card border). Overlaps are kept as clean gaps via masks, so the icons work on any background. Icon `?v=` is `20260914g` (round 14).
The ChatGPT PNGs were source artwork only and were removed from the project in round 13.

Versions after rounds 9-10: `site.css` / `rtl/site.css` `?v=20260914f`, `site.js` `?v=20260914a`, service icons `?v=20260914e` (see round 14 for the current ones).

### Round 11: service order (2026-09-14)
The service tiles on the home page, the Services page and the About page (EN/TR/AR) follow the header dropdown order: Property Investment, Short-Term Renting, Property Management, Turkish Citizenship, Property Selling, Turkish Residency (the "Other services" list on the service pages already did). Markup only: the six `.aux-iso-item` blocks were moved, nothing else changed. The footer list still starts with Short-Term Renting, then Property Investment.

### Round 12: Airbnb management on the Short-Term Renting page (2026-09-14)
`services/short-term-renting/` (EN/TR/AR) now leads with Airbnb management: heading and browser title "Short-Term Renting & Airbnb Management" (TR "Kısa Dönem Kiralama ve Airbnb Yönetimi", AR "الإيجار قصير المدى وإدارة Airbnb"), a lead that opens with Airbnb management in Istanbul, Airbnb in the "What's included" cards (Permit and Airbnb setup, Airbnb listing and pricing, Airbnb guest messages, Airbnb income in the reports), in the three steps, and a new "Full Airbnb management" section in the long text (listing optimisation, fast replies, calendar and pricing, ratings and reviews, the other platforms kept in sync). Meta descriptions lead with Airbnb management. The service name in the breadcrumb, menus, tiles and "Other services" lists stays "Short-Term Renting". Content lives in the generator's content modules (`svc_content_*.py`, with new optional `h1` / `title` keys); the other 15 service pages regenerate unchanged.

### Round 13: project cleanup (2026-09-14)
Removed 16 files that no page, stylesheet or script references (about 6.3 MB): the six ChatGPT source PNGs in `assets/images/icons/`, the six old raster icons `service-*.jpg` (replaced by the SVGs), two unused 2021 upload PNGs, an unused `assets/images/2026/04/heart.png`, and `TODO.md` (the finished round-1 plan; everything in it is done and described above). Empty folders left behind were deleted. A copy of everything removed is in `tfc2-removed-files-2026-09-14.tar.gz` next to the project folder. Kept on purpose although no page links them directly: `assets/vendor/elementor/css/conditionals/{dialog,lightbox}.min.css` and `assets/vendor/elementor/lib/{dialog,share-link}/`, which Elementor's frontend script loads on demand.

### Round 14: review of rounds 9-13 (2026-09-14)
Checked every change since round 8 (How it works, "What's included" icons, contact overlay, SVG service icons, service order, Airbnb content, cleanup) at 360-1920px in EN/TR/AR: markup of all 30 touched pages is balanced, the service generator reproduces all 18 service pages byte for byte, RTL tail identical, `site.js` unchanged and valid, no console errors or failed requests on any page. Fixed:
- **Service icons**: the masks that cut clean gaps around overlapping shapes used SVG's default mask region, which is computed without stroke width, so the SOLD icon's chimney lost the outer half of its strokes (thin, square corners). All masks now use `maskUnits="userSpaceOnUse"` covering the whole `viewBox`. The chimney legs in the SOLD and suitcase icons now end on the roof's centre line (they left a small notch where they met the roof). Icon `?v=20260914g`.
- **Contact overlay**: `overflow:hidden` on the form card removed (not needed; it would have clipped the Submit button's shadow once the form is switched back on).
- **Home "Latest Posts", 1025-1365px (EN/TR/AR)**: the featured card's Read More button sat on top of the second and third excerpt lines (the excerpt keeps only 45% of its width free for the button); the button now sits under the excerpt at those widths, with logical padding so the RTL copy works too. The one-post column's button wrapped "Read More" onto two lines and touched the excerpt; its side padding drops to 18px there and the label no longer wraps. That card's excerpt box (94-96px, 3.8 lines) showed a half-cut fourth line for long excerpts; it is clamped to three whole lines with an ellipsis (the stacked tablet/phone card is ~20px shorter as a result).
Checked and left as is: the home gallery links to `pexels-*-scaled.jpg` files that were never mirrored, but that gallery section (`79aa3cb`) is hidden at every width, so the links cannot be reached; the remaining audit notes are the intentional contact overlay, fixed floating widgets over content at some scroll positions, and entrance-animation timing.
Versions: `site.css` / `rtl/site.css` `?v=20260914h`, `site.js` `?v=20260914a`, service icons `?v=20260914g`.

### Round 15: service page spacing (2026-09-14)
The service pages spaced their blocks 120px apart (72px on phones) on top of the tinted hero's and steps band's own 84-96px padding, so the empty space between one block of text and the next was 204-216px on desktop and 112-120px on phones, against roughly 100-125px (55-75px) on the home page. Section gaps are now 80 / 72 / 64 / 48px (desktop / ≤1366 / ≤1024 / ≤767), the hero padding 72 / 56 / 48px (phones unchanged), the steps band padding 64-72 / 56-64 / 48-56 / 40-44px, and the space before the footer banner 96 / 88 / 80 / 56px. Text-to-text gaps are now about 145-150px on desktop, 112-120px on tablets and 88-92px on phones. CSS only (section 4.6), mirrored to RTL. Versions: `site.css` / `rtl/site.css` `?v=20260914i`.

### Round 16: third Turkish naturalness pass (2026-09-14)
Read all 458 Turkish strings on the 15 Turkish pages and rewrote the ones that still read like translations: English sentence structures carried over word for word ("…onu yatırımcılar için çekici kılıyor", "kalıcı değeri birlikte inşa edelim", "Yatırımları Fırsata Dönüştürüyoruz" → "Yatırımınızı Kazanca Dönüştürüyoruz", "ilk seferde kolayca doğru yapılabilecek şeyler"), stiff calques ("sahada aktif yönetim", "değer artışına alan bırakan fiyat", "kazandırması gerekeni kazandırır", "Türkiye’ye olan güçlü bağlarımız", "kiracı adayları elenir"), repetitions and a missing subject, loan words in the new Airbnb copy ("optimize", "senkronize") and its mixed tenses, and the contact notice. The footer line (all 15 pages) now reads "…Türk vatandaşlığı tek ekipte: ilk daire gezmesinden aylık rapora kadar." The category page's copy of the citizenship post excerpt was an older wording and now matches the blog and author pages. Service copy lives in `svc_content_tr.py` (23 edits, regenerated); the other pages were edited with exact replacements (`scratchpad/trn/tr-natural-3.py`). Text only, no CSS/JS change.

### Round 17: English naturalness pass (2026-09-14)
Read all 453 English strings on the 15 English pages and rewrote the ones that sounded like template or AI copy: the footer band ("…we take care of every step with experience and attention to detail"), the About page (the "focused on creating long-term value" paragraph, a second "Founded in 2023", "develop strategies to help maximize returns", "Strong properties are built on strong teams", "With strong roots in Türkiye…", buzzword headings such as "Asset Optimization", "A Client-Centric Approach", "Proven Expertise", "Transparency You Can Trust", "Tailored Strategies", "Dedicated Support", "Full-Service Partner", "Final Words" and the closing "Let’s build lasting value together"), the home page ("Turning Investments into Opportunities" → "Turning Your Property into Income", "Make Revenue" → "Earn an Income", three service blurbs), both blog posts and their excerpts on the blog, author, category and home pages ("a go-to option", "a clear breakdown", "giving it a unique advantage", "add another layer of accessibility", "Family inclusion"), the contact intro and form notice, and 18 lines of service copy (passive or jargon phrasing such as "income-producing asset", "evidence-based valuation", "created and optimized", "serious candidates", "Guest operations"). Also "advisors"/"adviser" made consistent and the search placeholder "Type here.." → "Type here...". Service copy lives in `svc_content_en.py` (regenerated); the other pages were edited with exact replacements (`scratchpad/enn/en-natural.py`). Text only, no CSS/JS change.

### Round 18: SEO (2026-09-14)
Production domain: `https://www.tfcturkiye.com/` (the canonical domain the pages already carried). Everything below is generated by `scratchpad/seo/seo.py`, which is idempotent and is re-run automatically at the end of `svc-content.py`; the generated head sits between `<!-- seo:start -->` and `<!-- seo:end -->` on every page.
- **Titles and descriptions**: keyword titles for About, Services, Blog, Contact and the six services in EN/TR/AR (e.g. "Property Investment in Istanbul – TFC Türkiye", "Gayrimenkul Yatırımıyla Türk Vatandaşlığı – TFC Türkiye"); brand written "TFC Türkiye" in every title; descriptions trimmed to 110-160 characters; the six author/category archive pages got descriptions. No duplicate titles or descriptions.
- **Indexing**: canonical on all 45 pages (was missing on the archives); `hreflang` rebuilt as en / tr / ar / x-default (the duplicate en-US/tr-TR entries are gone), reciprocal and pointing at existing pages; `robots` meta: `index, follow, max-image-preview:large`, the author and "Uncategorized" archives `noindex, follow` (thin copies of the blog). New `robots.txt` and `sitemap.xml` (39 indexable URLs with hreflang alternates and lastmod).
- **Social cards**: Open Graph and Twitter tags on every page, with 1200x630 images in `assets/images/og/`: a branded card per language (home, About, Services, Blog, Contact), a card per service and language (18) and the two posts' own photos.
- **Structured data** (JSON-LD `@graph`): `RealEstateAgent` (name, logo, address, phone, email, languages, contact point), `WebSite`, the page (`WebPage` / `AboutPage` / `ContactPage` / `CollectionPage`), `BreadcrumbList` on inner pages, `Service` on service pages, `BlogPosting` on the posts (no dates: the posts carry none).
- **On-page**: one `<h1>` per page (the theme's empty `h1.aux-modern-heading-primary` on the home and About pages is now a `<div>` with the same margins); alt texts on the home hero photo, the home About photo and the About page photo in three languages; the WordPress leftover `<meta name="title">` removed; viewport no longer blocks zooming; `theme-color` set to the brand blue.
Versions: `site.css` / `rtl/site.css` `?v=20260914j` (see round 19).

### Round 19: review of rounds 15-18 (2026-09-14)
Checked the service spacing, both copy passes and the SEO work: layout audit of all 45 pages at 360 / 1024 / 1440px (no overflow, clipping, overlaps, broken images or console errors beyond the known intentional items), the SEO head on every page (one canonical pointing at itself, one description/title/robots, four reciprocal hreflang links whose targets exist, Open Graph + Twitter image, valid JSON-LD with the expected types, noindex only on the author/category archives), the sitemap (exactly the 39 indexable pages), the head free of WordPress leftovers, and the service generator + SEO rebuild changing nothing. Fixed:
- **About page closing line**: after the English rewrite it read as a call to action ("Let’s talk about your property.") but was plain text; in all three languages it now links to the contact page (hover underline, focus ring). The Arabic line still said "let's build lasting value together" and now matches ("لنتحدث عن عقارك.").
- **Structured data**: the organization now lists its two co-founders (name, role and the LinkedIn profiles already linked from the About page).
Versions: `site.css` / `rtl/site.css` `?v=20260914k`.

### Round 20: design audit, phase 1 (2026-09-13)
First phase of the design/UX audit (report: "TFC Türkiye design audit" artifact, findings F1-F21). Heading case follows decision D1: sentence case in English and Turkish.
- **F1 Text contrast**: the Elementor pages' secondary grey `#70798B` (4.38:1 on white, 4.02:1 on the `#F1F6F9` cards, below WCAG AA) is replaced by the service pages' `#566074` everywhere: `--tfc-grey`, the Elementor global colour `--e-global-color-72f454e` (overridden on `.elementor-kit-176` in `site.css`, so the unversioned kit file is untouched), the phone post-card excerpt on the home page and the contact form labels. A contrast scan of 12 page/width combinations now finds no failing text (only white text on photos, which the scan cannot measure).
- **F6 Headings**: the theme's `text-transform:capitalize` ("Become A Citizen", "Management In Istanbul", Turkish "Yatırımı Ve Yönetimi") is switched off for Elementor headings, and the headings of the home, About, Services, Contact, blog and archive pages, the footer banner (all 30 EN/TR pages) and the two posts' subheadings are written in sentence case. Names keep their capitals: service names, the brand, people and job titles, the two post titles and the hero slogan. Service pages were already sentence case. Arabic is unaffected. Script: `scratchpad/p1/case.py`.
- **F5 Keyboard**: every link now shows the site's 2px blue focus ring (the theme removed it on service tiles, post cards and the hero video link; white on the team photos). The six hidden WP ULike buttons on the home and About pages (12x2px, invisible, but each a tab stop) are removed with the plugin stylesheet link on all 45 pages. Image links that duplicate the title link next to them (service tiles, post cards, the post's own hero image) leave the tab order (`tabindex="-1" aria-hidden="true"`): the home page goes from 18 to 6 stops in the services grid. The LinkedIn icons on the About page have names ("… on LinkedIn (opens in a new tab)", in three languages).
- **F12 Service pages**: long-form paragraphs and lists are capped at `68ch` (~72 characters a line; they ran ~100 at 1440px and ~130 at 1024px).
- **F15 Menu button**: the hamburger's hit area is 44x44px (was 20x20) with the icon and header layout unchanged (checked pixel for pixel); tapping its corner opens the menu in EN/TR/AR.
- **F19 Turrist**: the red is `#D10000` (5.7:1; pure red was 4.0:1) in the header, mobile menu and footer.
`sitemap.xml` lastmod refreshed. Checked: sweep of all 45 pages (0 flags), layout audit at 360 / 1024 / 1440px compared with the pre-change baseline (no new issues; differences are renamed text, animation timing and the floating language pill's scroll position), service generator + SEO rebuild unchanged, keyboard pass on the home and About pages. Versions: `site.css` / `rtl/site.css` `?v=20260914l`.

### Round 21: design audit, phase 2 (2026-09-13)
Second phase of the design audit (F3, F4, F7, F8, F9, F12, F13, F16), with decisions D1 (sentence case) and D2 (floating controls) as recommended.
- **F3 + F9 Service tiles** (Home, About, Services in EN/TR/AR): one style everywhere, the flat Home tile with a DM Sans 600 label (25px desktop, 21px tablet); the Services page lost its tile shadow and 20px/700 label and now shows three columns on tablets like the other two pages (`aux-tb-col3`). On phones the six tiles sit two per row (140px icons, 17px labels) in a CSS grid that overrides the isotope positions; the home page at 390px is ~950px shorter, Services ~800px, About ~970px.
- **F7 One button**: every filled pill (Elementor buttons, Read more, `.tfc-btn`, the form submit) is 52px tall (48px on phones), Quicksand 600 16px, 28px sides, with one centred glow in its own colour (the offset `-15px 20px 40px` glows are gone). Hover keeps the brand swap for all of them: blue turns yellow with navy text, yellow turns navy with white text (the service pages' blue buttons used to turn navy and their yellow button white). The banner button's arrow sits 12px from its label (was 66px). Read more on the blog, author, category and home cards: the link now fills its pill, so the whole pill is clickable (only the words were before). Labels in sentence case: "Learn more", "Read more", "Contact us", "Our services"; Turkish "Daha fazla bilgi", "Devamını oku", "Bize ulaşın".
- **F8 Two heading sizes, DM Sans only**: display (Home and About section titles, the Services / Blog / Contact / archive page titles) `clamp(32px, 2.2vw + 20px, 50px)`, -0.03em; section (the home About heading, About "Why choose us?" / "In short", the service pages' h2s) `clamp(27px, 1.6vw + 17px, 40px)`, -0.025em. Before: 25-50px with four tracking values. "Find the service you need" and the About mission statement were Quicksand; the first is now an `h2` (was a `<p>`), and About's "Why choose us?" / "In short" are `h2` (were `h3`).
- **F4 Floating controls**: two at any width. Desktop keeps chat + back-to-top (the floating language pill is hidden, the header has the picker); tablets and phones keep chat + the language pill (back-to-top hidden).
- **F12 Service pages below 1025px**: the blue "Talk to an adviser" panel is hidden (it sat right above the blue footer banner; the hero buttons and the banner carry the same actions); "Other services" takes the full row, in two columns on tablets.
- **F13** The four blue feature titles in the home About section link to their service pages (EN/TR/AR), underline on hover.
- **F16 Phones**: the home About section, the About intro and closing, and the footer banner read from the start edge (right in Arabic) instead of centred; step captions and hero intros stay centred.
Checked: button sizes on 7 page types at 1440/1280/390, hover colours, nothing covering any button, heading sizes on 7 page types at 1440/1024/390, sweep of 45 pages (0 flags), layout audit at 360/1024/1440 against the phase 1 baseline (no new issues), keyboard order, service generator + SEO rebuild unchanged. Noted for phase 4: the footer banner heading wraps to six lines at 768px (unchanged from before). Versions: `site.css` / `rtl/site.css` `?v=20260914m`.

### Round 22: design audit, phase 3 (2026-09-13)
Third phase of the design audit (F2, F10, F11), with decisions D3 (two equal columns), D4 (intro copy from the existing descriptions) and D5 (related-service block) as recommended. Markup script: `scratchpad/p3/markup.py`.
- **F2 Blog posts** (6 pages): the breadcrumb (Home / Blog / title) and the title now come first, then the photo in a 16:9 frame and the text, all in one 760px column. At 1440x900 the title and the photo are in the first screen (the photo used to fill it, title at 967px); text 18px / 1.75 in the body grey at ~72 characters a line (was 16px across 1100px, ~130). Section headings are `h2` under the `h1` (were `h3`, the citizenship post's wrapped in `<strong>`), 27px DM Sans; list markers in brand blue; the "Final thoughts" separator is a hairline (was a 2px near-black rule). Each post ends with a "Related service" block (service icon, name, the service page's intro line, "See the service" and WhatsApp buttons: "Why Turkey" → Property Investment, citizenship → Turkish Citizenship) and an "All posts" link. The visible breadcrumb matches the BreadcrumbList already in the structured data.
- **F11 One post card** (home, blog, author and category pages in EN/TR/AR): 16:9 photo on top, 22px title, three-line excerpt and Read more at the foot of the card; two posts sit in two equal columns above 767px (a CSS grid on the archives, applied only while a listing holds exactly two posts: `.aux-total-2`), with equal card heights. The home page's photo card with text over the map and the text-only second card are gone; the archives, which showed no photos, now carry them (markup copied from the blog cards, paths rewritten per page). The home and blog cards now use the full excerpts the archives already had (the home citizenship excerpt stopped after seven words).
- **F10 Intro panels**: Services and Blog open with the service pages' tinted panel (breadcrumb, title, one sentence from the existing page descriptions); on the Services page each tile carries one line on what the service covers (six per language, trimmed from the service pages' descriptions).
Checked: sweep of 45 pages (0 flags), every local link and image on all pages resolves, structural tags balanced, layout audit at 360 / 1024 / 1440px against the phase 2 baseline (no new issues), card positions equal at 390 / 768 / 1024 / 1440, keyboard order on a post (breadcrumb, related-service buttons, All posts), service generator + SEO rebuild unchanged. Versions: `site.css` / `rtl/site.css` `?v=20260914n`.

### Round 23: design audit, phase 4 (2026-09-13)
Last phase of the design audit (F14, F17, F18, F20, F21 and the footer banner on small tablets).
- **F14 About edges**: the text section (mission panel, cards, "Why choose us?") and the team row now share the 35px page edge of the header, footer and banner at every width, and the footer's boxed edge from 1670px up (they sat at 60px and 65px on desktop). The text widget's padding is `clamp(0px, calc(835px - 50vw), 25px)` above 1024px because its section is full-bleed with a 10px padding up to 1620px and boxed beyond. The four team photos fill the row with 30px gaps (20px on tablets): 320px wide at 1440 (were 306px with uneven 15/10/30px margins). The team roles on the photos were 11px on phones and tablets and are now 12.5px.
- **F17 Contact**: the "Contact" eyebrow above the "Contact us" title is gone (EN/TR/AR). On phones the notice and the blurred form share one grid cell, so the form card is as tall as the notice in any language (~500px instead of 777px) and the ghost form behind it is clipped at 300px with a fade; the overlay design is unchanged.
- **F18 Testimonials**: the author row sits at the foot of each card, so the three authors line up whatever the quote length (they were 50px apart at 768px).
- **Footer banner, 768-880px**: stacks like on phones; the heading had a 214px column and broke into six lines, now two (the banner is 320px tall at 768px instead of 494px).
- **F20 Chat button**: brand blue (`#0E47C0`) instead of pale green `#86CD91`; it opens three channels (WhatsApp, phone, e-mail), so it takes the brand colour rather than WhatsApp's. Set in `assets/js/config.js`, now loaded as `config.js?v=20260914o` on all pages.
- **F21 404 page**: new `/404.html` (English, `noindex`) with the site header and footer, a "We can’t find that page" panel, buttons to the home page, Services and Contact, and links to the Turkish and Arabic home pages. All its URLs are root-absolute so it works at any depth (tested served at `/tr/does/not/exist/`: styles, logo, chat and all 45 links load); the language pickers lead to each language's home page. Built from the Blog page by `scratchpad/p4/make404.py`; `seo.py` only handles `index.html` files, so it stays out of the sitemap. The host needs to serve `404.html` for unknown paths (static.app's default for a root `404.html`; to be confirmed after upload).
Checked: sweep of 45 pages (0 flags), contrast scan (no failing text), layout audit at 360 / 1024 / 1440px against the phase 3 baseline (no new issues; the flagged About overlaps are entrance-animation timing, geometry identical to before), About edges at 1025 / 1280 / 1440 / 1600 / 1650 / 1920px in EN and AR, service generator + SEO rebuild unchanged. Versions: `site.css` / `rtl/site.css` `?v=20260914o`.

### Round 24: review of rounds 20-23 (2026-09-13)
Checked the four design-audit phases end to end: every Round 20-23 CSS rule parses (the browser drops none; braces balanced; RTL tail identical), all 46 pages (45 + `404.html`) have resolving links, balanced tags, no duplicate ids, one `h1`, no nested or hidden-but-focusable links and no leftover Title Case on buttons or headings (names, job titles, post titles and the hero slogan keep theirs by design); a language picker is visible at every width (the header picker from 1025px, the floating pill below it) in EN/AR and on the 404 page; the mobile menu opens and closes by keyboard and returns focus, the video dialog opens and closes clean on Home/About/TR, both language pickers open, the contact notice links are right; the Services tiles with their new lines never collide at 768-1920px in three languages; contrast passes on the changed pages; keyboard order on Services, Blog, posts and 404; layout audit of 46 pages at 360 / 1024 / 1440px against the pre-review state and the service generator + SEO rebuild unchanged. Fixed:
- **Card and post photos**: the WordPress export's `srcset` listed the 2000px citizenship photo as `637w`, so the new photo cards downloaded the 770 KB file on phones and laptops; the post photos declared `sizes` of 1080-2000px for a 760px column. All 30 card and post photos now use the 16:9 crops that match how they are shown (`-768x432` … `-1024x576`, `-2550x1434` / `-1070x601`) with `sizes` for the real slot, so a phone or laptop loads the 768px file (56 KB instead of 770 KB for that photo); the home cards load lazily. Script: `scratchpad/rv/srcset.py`.
- **Home cards at 1025-1365px**: a round 14 rule for the old narrow second card still gave its Read more 18px sides (121px wide against 141px everywhere else); that block and the round 14 excerpt clamp, both superseded by the round 22 card, are removed.
- **Post title on phones**: an older phone rule (`line-height:50px !important`) spread the title's lines 50px apart; it now keeps 1.15.
- **Services tiles**: the page CSS animated `all` properties on the tile links, so the focus ring grew in over 300ms; the transition is limited to colour like the other tile grids.
Versions: `site.css` / `rtl/site.css` `?v=20260914p`.

### Round 25: review follow-ups (2026-09-13)
Seven points from a visual review; spacing measured as white space between sections on full-page screenshots.
- **Home, services → About**: the About section sat ~102px under the service tiles from 768px up while the other sections are ~126px apart; the tiles section's bottom padding is 34px (was 10px), so the gap is 125-128px at 820 / 1024 / 1366 / 1920. Phones already had 90px against a ~72-82px rhythm and are unchanged.
- **Service pages**: the round 20 cap of 68 characters a line on the text is removed; the text fills its column (1124px at 1920), on all 18 service pages.
- **Home hero on phones**: "Watch the video" kept a 20px top margin meant for its stacked layout when it fitted beside the button, so its play icon sat ~15px lower, and it touched the button. The two now centre on one line with a 12px gap where they fit (414px in English, Arabic) and stack 16px apart where they do not (360-390px, Turkish). The play icon sits beside its text, centred with it and 15px apart, on every phone: from 415 to 767px the builder's phone setting put it above the text, and at 414px and below the page's own rule left it 6px above the text's centre.
- **Home service tiles**: the grid kept its section's 10px edge, so "Property Management" ran to 11px from the screen edge on phones, and Turkish "Türkiye Oturum Danışmanlığı" to 10px at 1025-1100px; the grid now keeps the 35px page edge at every width (as on Services; from 1670px, where the section is boxed, nothing changes) and long names wrap to two lines, in all three languages.
- **About intro**: the buttons sat 74px under the text below 1025px (the heading widget's 50px bottom margin, with the paragraph's own 15px margin collapsing into it) and 22-57px on desktop, where the text column stretches to the photo's height and spread the spare room between its rows. Now 32px at every width: the rows stay together, centred on the photo (eyebrow → title 21px, title → text 45px). On phones the buttons start at the text edge (they were spread out by `space-evenly`) with a 16px gap, since "Contact us" loses its side padding on phones.
- **Blog posts** (6 pages; reverted to a 900px column in round 26): the round 22 760px column is gone; breadcrumb, title, photo, text and the related-service block run across the page width like the other pages (160-1760px at 1920, the 35px page edge below 1670px). The citizenship photo has a new `-1600x900` crop (235 KB, made from the 2550px file) so a 1366-1920px screen does not load the 509 KB file; `sizes` follows the wider slot. The "Why Turkey" map photo's original is only 1080px wide, so it is upscaled at full width (a higher-resolution original would fix that).
- **Numbered lists**: the citizenship post's "Step-by-step process" list started at 8 in Firefox (Chrome showed 1). The theme's `ol { counter-reset:item }` replaces the browser's `list-item` reset, and Firefox then continued the second list from the first; `ol` now resets both. `start` and `reversed` keep working in Chrome; Firefox ignores them under the theme rule with or without this one (no list on the site uses them). This bug predates the design audit.
Checked: before/after screenshots at 360-1920px in EN/TR/AR, sweep of 45 pages (0 flags), 404 page (no failed requests or bad links), CSS parse (no dropped rules; the one flag is an old customizer selector, identical before), layout audit of 13 changed pages at 360 / 414 / 600 / 820 / 1024 / 1366 / 1920px against the pre-round state (no new issues; flagged overlaps are the floating pill's scroll position and entrance animations, geometry identical when frozen), service generator + SEO rebuild unchanged. Versions: `site.css` / `rtl/site.css` `?v=20260914q`, `?v=20260914r` after the review.
Review of this round: the phone hero icon at 414px and below, the tiles' edge at 1025-1100px in Turkish and the About button gap on desktop (above) were found and fixed; the list bug was confirmed and its fix checked in Firefox (headless Firefox via puppeteer), where the section gaps, hero, tiles, About buttons, post and service widths were also re-measured. Every post photo URL resolves; the sweep (45 pages, 0 flags), CSS parse, 404 check, layout audit of 10 pages at 8 widths against the pre-round state (no new issues) and generator round trip pass.

### Round 26: header logo, contact map, blog post column (2026-09-13)
- **Header logo**: the logo was 72px tall, 26px under the top of the page and 52px over the content (so it seemed to float above the page), 3px above the links' centre line, and 72px from "Home": an empty divider spacer (zero height, never visible) with 22 + 8px margins, plus the menu widget's 40px padding. The spacer is hidden; the logo is 60px tall on desktop (175px wide in English, 214px Turkish, 152px Arabic), 26px under the top and 34px over the content, and 48px before the first link (the links are 32px apart), in both directions. The logo wrapper was `inline-block` and left a 6px text gap under the image, which lowered the links, and on phones and tablets the burger, by 3px; the logo wrapper and image are blocks now, so the links and the burger sit on the logo's centre line. Header height: 130 → 100px on desktop, 100 → 88px on tablets and large phones (logo 58 → 52px), 88 → 82px at 480px and below (logo 46px, unchanged). Every page moves up by the same amount; the dropdowns attach as before.
- **Contact map** (3 pages): Google matched the address to another business at the same number, so the map showed "7th House Ceramics" on the pin and that business's place card (rating, links) in its top corner, while the TFC card covered Google's map-type button at the bottom. The iframe now points at the address's coordinates (41.036173, 28.993777, Google's own pin for the address) with the `/maps/embed?pb=` URL that the old `maps.google.com/maps?...&output=embed` link redirected to (one redirect less), in the page's language (`en` / `tr` / `ar`): a plain pin, no place card, 36 requests / ~613 KB instead of 46 / ~673 KB. The TFC card sits in the top corner, compact (250px, it was 300 x 135px) so it stays clear of the pin down to the 385px-wide map at 1025px; on phones it stays under the map. A blue pin marks the spot on the tinted box until Google's map has drawn. The pages preconnect to `www.google.com` and `maps.googleapis.com` (dns-prefetch `maps.gstatic.com`). Firefox starts a lazy iframe only within ~600px of the screen (Chrome ~2000px), so `site.js` switches the map to eager loading once the page has loaded and the map is within 1.5 screens; on a computer it is in the first screen and starts with the page as before; without script the iframe keeps its lazy loading.
- **Blog posts** (6 pages): back to a centred column, 900px wide instead of round 22's 760px (~85 characters a line instead of ~72; round 25 ran it across the page width). The column keeps the 35px page edge below 970px. Photo `sizes`: `(max-width:969px) calc(100vw - 70px), 900px`; the round 25 `-1600x900` citizenship crop stays in the `srcset` (a 1.5-1.8x screen uses it), and the 1070px "Why Turkey" map photo is no longer upscaled on a standard screen.
Checked: headless Firefox and Chrome. Header measured on all 46 pages at 390 / 1025 / 1440px (height, logo size, 48px gap, menu on one line) and the burger at 360-1024px in EN/TR/AR; map load timed old vs new; card and pin clearance at 768-1920px in EN/TR/AR; post column at 390-1920px; all 5,895 local references resolve; all pages at three widths without script errors, failed requests or sideways scrolling. Versions: `site.css` / `rtl/site.css` `?v=20260914s`, `site.js` `?v=20260914b`.
- **Video** (added after round 26): the "Watch the video" links on the home and About pages (EN/TR/AR, 9 links) open `CLcKDVUDWbE` from 0:16 (`https://www.youtube.com/watch?t=16&v=CLcKDVUDWbE`, was `GT81Ph8BLmM`; 0:15 at first). The links carry `data-video-start="16"`, which the modal passes to the player as `start=16`; the plain link (no script, or no `<dialog>` support) carries `t=16`. Checked in Firefox and Chrome: the modal opens and plays from the start time. `site.js` `?v=20260914c`.
- **Video modal size** (after round 26): up to 1200px wide on desktop (was 960px), 32px from the window sides from 1025px up (16px below), and never taller than the window less 140px, so the video and its close button always fit: 1200 x 675 at 1440 x 900 and up, 1116 x 628 at 1366 x 768, 1031 x 580 at 1280 x 720; phones in portrait unchanged (358px at 390px); a phone held sideways (844 x 390) now gets a 444px video that fits the height (it was 812px wide and ran off the screen). `site.css` / `rtl/site.css` `?v=20260914t`.
Review of round 26 and the video changes: every HTML change against the pre-round copy is one of the intended kinds (asset versions, map URL and connection hints on the 3 contact pages, photo `sizes` on the 6 posts, 9 video links), with nothing else touched; the connection hints were moved above the stylesheets block on all three contact pages (the Arabic page had them in a different place). The map loads once in every case in Firefox and Chrome: on a computer the browser starts it and the script's switch to eager does not reload it; on a 360 x 640 phone, where the map is 671px below the fold (past Firefox's ~600px), the script starts it right after the page loads. Also checked: mobile menu opening, tablet and phone headers in EN/TR/AR, the post's related-service block inside the 900px column, the Arabic video modal (close button on the left, Escape closes it and returns focus; start time now 0:16), the sweep of 46 pages at three widths (0 flags; header 100px / logo 60px / 48px gap / menu on one line on every page), 5,895 local references, and `rtl/site.css` identical to `site.css` from the shared block on.
- **Service tile icons** (after round 26): on hover the icons in the service grids (home and Services, EN/TR/AR) rose 6px; on the home page their frame and the animated grid clip their content, so the icon's top edge was cut flat and its bottom looked 6px short. On hover or keyboard focus the icon now zooms to 105% in place (0.3s; no animation with reduced motion) and the title turns blue. The home grid's frame and container no longer clip (sampled every frame during the grid's load and resize animations: no tile ever leaves the container); checked at 360-1880px in EN/TR/AR: no icon clipped, no sideways scrolling. `site.css` / `rtl/site.css` `?v=20260914u`.
- **Service descriptions** (after round 26): the Services page's citizenship line no longer names the investment amount: "Citizenship through a qualifying property purchase." / "Şartlara uygun gayrimenkul alımıyla vatandaşlık." / "الجنسية عبر شراء عقار مستوفٍ للشروط." (was "a USD 400,000 property purchase" and its translations). The home page service tiles (EN/TR/AR) now carry the same one-line descriptions as the Services page (`p.tfc-tile-desc`, matched to each tile by its service link; same styles). Checked at 360-1880px: no tile overlaps, every line inside the grid, the gap to the About section unchanged (124px, 84px on phones). The amount still appears on the citizenship service page (requirements list and meta description) and in the two blog posts. HTML only; no version change.
# tfcturkiye.github.io

### Round 27: small-screen fixes (2026-09-20)
From a mobile responsiveness audit at 320-430px (plus 5px sweeps 320-560 and landscape) in EN/TR/AR. CSS only, in `site.css` and its RTL mirror.
- **Arabic language switcher**: the floating list opened at x -87 to 99 on every phone width, so the flags and half of each language name were cut off at the left edge (English and Turkish were fine). The rule set `left:0` and then `inset-inline-end:auto`, which in RTL maps to `left` and, declared later, won — the list then anchored by its other edge and ran off screen. It is pinned to the left in both directions now, matching its button.
- **Turkish hero headline**: "Gayrimenkulünüz" did not fit at 325-350px (40px type) or 415-450px (55px type, which covers 414/428/430px phones) and the page's hidden overflow cut it mid-letter. The Turkish hero now shrinks only when the longest word would not fit (`min(<step>, calc((100vw - 70px) / 8.2))`, scoped to `html[lang|="tr"]`): 30/35/40/44/50px at 320/360/414/430/480, unchanged 55px from 768px up. English and Arabic keep the sizes they had, since their words fit.
- **Tap targets** (all pages, ≤767px): footer links were a 19px text box, footer column headings 17px, breadcrumbs 18px and card titles 21-25px. They take their spacing as padding now, so the rhythm on screen is unchanged (footer pitch 35px before and after) while the tappable box is 28-35px, past the 24px minimum.
- **Contact form** (≤767px): fields were 15px, which makes iOS zoom the page when one is focused; they are 16px on phones. (Latent until the form has a backend.)
- **Team names**: "Abdulsamet Türkoğlu" overflowed its card by 4-12px in the two-column layout at 320px; team names and roles wrap instead.
- **"Find the service you need" heading**: its widget is a flex item Elementor lets shrink past its content, so at 320px the Turkish heading sat in a 143px box and spilled out; the widget keeps its content width on phones.
Checked: hero sweeps 320-560px in all three languages (no overflow), language list open and closed in EN/TR/AR, tap targets re-measured, all 46 pages at 320 / 390 / 1440px with no script errors, failed requests or sideways scrolling. Two audit flags were false positives and deliberately left alone: the theme's 1x1px screen-reader site title, and the chat widget's label, whose 5px "clip" is its arrow sticking out of the box (the text renders in full). Versions: `site.css` / `rtl/site.css` `?v=20260914v`.
