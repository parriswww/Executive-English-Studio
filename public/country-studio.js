(function () {
  'use strict';
  var pages = {
    'korea.html': { country: 'korea', label: 'Executive English Studio 이용하기', detail: '무료 비즈니스 영어 도구' },
    'japan.html': { country: 'japan', label: 'Executive English Studio を使う', detail: 'ビジネス英語ツール' },
    'taiwan.html': { country: 'taiwan', label: '開啟 Executive English Studio', detail: '商務英文實用工具' }
  };
  var page = pages[window.location.pathname.split('/').pop()];
  if (!page) return;
  var wrap = document.createElement('div');
  wrap.setAttribute('aria-label', 'Executive English Studio');
  wrap.style.cssText = 'position:relative;padding:24px 16px;text-align:center;background:#123d46;color:#fff;font-family:system-ui,sans-serif';
  var text = document.createElement('p');
  text.textContent = page.detail;
  text.style.cssText = 'margin:0 0 10px;color:#fff;font-size:14px';
  var link = document.createElement('a');
  link.href = './?country=' + page.country;
  link.textContent = page.label;
  link.setAttribute('data-testid', 'country-studio-link');
  link.style.cssText = 'display:inline-block;padding:12px 20px;border-radius:6px;background:#fff;color:#123d46;text-decoration:none;font-weight:700;max-width:100%;overflow-wrap:anywhere';
  wrap.append(text, link);
  document.body.prepend(wrap);
})();
