/* Arabic UI strings and right-to-left flags for the theme scripts, the Elementor frontend and the Chaty contact widget. Loaded on /ar/ pages after config.js. */
auxin.is_rtl = "1";
auxin.wpml_lang = "ar";
elementorFrontendConfig.is_rtl = true;
(function (w) {
  w.settings.cta_text = "تواصل معنا!";
  w.settings.close_text = "إخفاء";
  var labels = {"Whatsapp": "واتساب", "Phone": "الهاتف", "Email": "البريد الإلكتروني"};
  w.channels.forEach(function (c) { c.hover_text = labels[c.channel] || c.hover_text; if (c.channel === "Whatsapp") { c.wp_popup_headline = "لنتحدث عبر واتساب"; c.chat_welcome_message = "<p>كيف يمكننا مساعدتك؟ :)</p>"; c.input_placeholder = "اكتب رسالتك..."; } });
})(chaty_settings.chaty_widgets[0]);
chaty_settings.lang = {"whatsapp_label": "رسالة واتساب", "hide_whatsapp_form": "إخفاء نموذج واتساب", "emoji_picker": "إظهار الرموز التعبيرية"};
elementorFrontendConfig.i18n = {"shareOnFacebook":"مشاركة على فيسبوك","shareOnTwitter":"مشاركة على تويتر","pinIt":"تثبيت","download":"تنزيل","downloadImage":"تنزيل الصورة","fullscreen":"ملء الشاشة","zoom":"تكبير","share":"مشاركة","playVideo":"تشغيل الفيديو","previous":"السابق","next":"التالي","close":"إغلاق","a11yCarouselPrevSlideMessage":"الشريحة السابقة","a11yCarouselNextSlideMessage":"الشريحة التالية","a11yCarouselFirstSlideMessage":"هذه هي الشريحة الأولى","a11yCarouselLastSlideMessage":"هذه هي الشريحة الأخيرة","a11yCarouselPaginationBulletMessage":"الانتقال إلى الشريحة"};
(function (b, l) { for (var k in l) if (b[k]) b[k].label = l[k]; })(elementorFrontendConfig.responsive.breakpoints, {"mobile":"الجوال عمودي","mobile_extra":"الجوال أفقي","tablet":"الجهاز اللوحي عمودي","tablet_extra":"الجهاز اللوحي أفقي","laptop":"الحاسوب المحمول","widescreen":"شاشة عريضة"});
