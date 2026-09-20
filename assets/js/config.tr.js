/* Turkish UI strings for the Elementor frontend and the Chaty contact widget. Loaded on /tr/ pages after config.js. */
(function (w) {
  w.settings.cta_text = "Bize ulaşın!";
  w.settings.close_text = "Gizle";
  var labels = {"Whatsapp": "WhatsApp", "Phone": "Telefon", "Email": "E-posta"};
  w.channels.forEach(function (c) { c.hover_text = labels[c.channel] || c.hover_text; if (c.channel === "Whatsapp") { c.wp_popup_headline = "WhatsApp üzerinden yazışalım"; c.chat_welcome_message = "<p>Size nasıl yardımcı olabiliriz? :)</p>"; c.input_placeholder = "Mesajınızı yazın..."; } });
})(chaty_settings.chaty_widgets[0]);
chaty_settings.lang = {"whatsapp_label": "WhatsApp Mesajı", "hide_whatsapp_form": "WhatsApp Formunu Gizle", "emoji_picker": "Emojileri Göster"};
elementorFrontendConfig.i18n = {"shareOnFacebook":"Facebook’ta paylaş","shareOnTwitter":"Twitter’da paylaşın","pinIt":"Sabitle","download":"İndir","downloadImage":"Görseli indir","fullscreen":"Tam Ekran","zoom":"Yakınlaştır","share":"Paylaş","playVideo":"Videoyu Oynat","previous":"Önceki","next":"Sonraki","close":"Kapat","a11yCarouselPrevSlideMessage":"Önceki Slayt","a11yCarouselNextSlideMessage":"Sonraki Slayt","a11yCarouselFirstSlideMessage":"Bu ilk slayt","a11yCarouselLastSlideMessage":"Bu son slayt","a11yCarouselPaginationBulletMessage":"Slayta Git"};
(function (b, l) { for (var k in l) if (b[k]) b[k].label = l[k]; })(elementorFrontendConfig.responsive.breakpoints, {"mobile":"Mobil Portre","mobile_extra":"Mobil Görünümü","tablet":"Tablet Portresi","tablet_extra":"Tablet Görünümü","laptop":"Dizüstü bilgisayar","widescreen":"Geniş ekran"});
