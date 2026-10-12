/* کیس‌استادی‌ها — سوییچ زبان مشترک */
(function () {
  var els = document.querySelectorAll('[data-en][data-fa]');
  var btn = document.getElementById('csLang');
  var label = document.getElementById('csLangLabel');

  function apply(lang) {
    document.documentElement.setAttribute('lang', lang);
    document.documentElement.setAttribute('dir', lang === 'fa' ? 'rtl' : 'ltr');
    els.forEach(function (el) {
      var v = el.getAttribute(lang === 'fa' ? 'data-fa' : 'data-en');
      if (v == null) return;
      if (el.getAttribute('data-html') === 'true') el.innerHTML = v;
      else el.textContent = v;
    });
    if (label) label.textContent = lang === 'fa' ? 'EN' : 'FA';
    window.csLang = lang;
    window.dispatchEvent(new CustomEvent('cs-lang-change', { detail: lang }));
    try { localStorage.setItem('site-lang', lang); } catch (e) {}
  }

  var start = 'en';
  try { start = localStorage.getItem('site-lang') || 'en'; } catch (e) {}
  apply(start);

  if (btn) {
    btn.addEventListener('click', function () {
      var next = window.csLang === 'fa' ? 'en' : 'fa';
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { apply(next); return; }
      document.body.classList.add('lang-switching');
      setTimeout(function () {
        apply(next);
        requestAnimationFrame(function () {
          document.body.classList.remove('lang-switching');
        });
      }, 200);
    });
  }
})();
