(function () {
  var D = {"included":[],"skipped":[{"number":29,"author":"stirringdesert","title":"About page: new photo, sticky on the right on desktop, top-right on phones"}]};
  var n = D.included.length;
  function plural(k) { var a = k % 10, b = k % 100; return a === 1 && b !== 11 ? 'изменение' : a >= 2 && a <= 4 && (b < 12 || b > 14) ? 'изменения' : 'изменений'; }
  var css = '#pv-tag{position:fixed;right:12px;top:12px;z-index:2147483646;font:12px/1.3 -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;color:#fff}'
    + '#pv-tag button{font:inherit;color:#000;background:#ffd84d;border:0;border-radius:999px;padding:6px 11px;cursor:pointer;box-shadow:0 2px 10px rgba(0,0,0,.35)}'
    + '#pv-tag .pv-panel{position:absolute;right:0;top:36px;width:min(320px,calc(100vw - 24px));box-sizing:border-box;background:#1b1b1b;border:1px solid #333;border-radius:10px;padding:12px 14px;display:none}'
    + '#pv-tag.open .pv-panel{display:block}'
    + '@media (min-width:700px){#pv-tag{right:76px}}'
    + '#pv-tag p{margin:0 0 8px}#pv-tag ul{margin:0 0 10px;padding-left:18px}#pv-tag li{margin:3px 0}'
    + '#pv-tag .pv-muted{color:#9a9a9a}#pv-tag a{color:#ffd84d}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]; }); }
  function list(items) { return '<ul>' + items.map(function (c) { return '<li>' + esc(c.title) + (c.author ? ' <span class="pv-muted">(' + esc(c.author) + ')</span>' : '') + '</li>'; }).join('') + '</ul>'; }
  var live = 'https://harrysergeev.com' + location.pathname + location.hash;
  var html = '<div class="pv-panel">'
    + '<p><b>Превью, ещё не на сайте.</b> ' + (n ? 'Сайт плюс ' + n + ' ' + plural(n) + ', ' + (n === 1 ? 'которое ждёт' : 'которые ждут') + ' публикации:' : 'Сейчас ничего не ждёт публикации, всё как на сайте.') + '</p>'
    + (n ? list(D.included) : '')
    + (D.skipped.length ? '<p class="pv-muted">Пока не показано (конфликтует с другим изменением, исправляется):</p>' + list(D.skipped) : '')
    + '<a href="' + esc(live) + '">открыть эту страницу на сайте &rarr;</a></div>'
    + '<button type="button" aria-expanded="false">превью' + (n ? ' · ' + n : '') + '</button>';
  var tag = document.createElement('div'); tag.id = 'pv-tag'; tag.innerHTML = html;
  document.body.appendChild(tag);
  var btn = tag.querySelector('button');
  btn.addEventListener('click', function () { var o = tag.classList.toggle('open'); btn.setAttribute('aria-expanded', o); });
})();
