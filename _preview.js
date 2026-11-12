(function () {
  var D = {"included":[{"number":29,"author":"stirringdesert","title":"About page: new photo, sticky on the right on desktop, top-right on phones"},{"number":38,"author":"stirringdesert","title":"Preview tag in the top right corner"}],"skipped":[]};
  var n = D.included.length;
  var css = '#pv-tag{position:fixed;right:12px;bottom:12px;z-index:2147483646;font:12px/1.3 -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;color:#fff}'
    + '#pv-tag button{font:inherit;color:#000;background:#ffd84d;border:0;border-radius:999px;padding:6px 11px;cursor:pointer;box-shadow:0 2px 10px rgba(0,0,0,.35)}'
    + '#pv-tag .pv-panel{position:absolute;right:0;bottom:36px;width:min(320px,calc(100vw - 24px));box-sizing:border-box;background:#1b1b1b;border:1px solid #333;border-radius:10px;padding:12px 14px;display:none}'
    + '#pv-tag.open .pv-panel{display:block}'
    + '#pv-tag p{margin:0 0 8px}#pv-tag ul{margin:0 0 10px;padding-left:18px}#pv-tag li{margin:3px 0}'
    + '#pv-tag .pv-muted{color:#9a9a9a}#pv-tag a{color:#ffd84d}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]; }); }
  function list(items) { return '<ul>' + items.map(function (c) { return '<li>' + esc(c.title) + (c.author ? ' <span class="pv-muted">(' + esc(c.author) + ')</span>' : '') + '</li>'; }).join('') + '</ul>'; }
  var live = 'https://harrysergeev.com' + location.pathname + location.hash;
  var html = '<div class="pv-panel">'
    + '<p><b>Preview, not live.</b> The live site plus ' + (n ? n + ' waiting change' + (n > 1 ? 's' : '') + ':' : 'nothing waiting right now.') + '</p>'
    + (n ? list(D.included) : '')
    + (D.skipped.length ? '<p class="pv-muted">Not shown yet (clashes with another change, being fixed):</p>' + list(D.skipped) : '')
    + '<a href="' + esc(live) + '">open this page on the live site &rarr;</a></div>'
    + '<button type="button" aria-expanded="false">preview' + (n ? ' · ' + n : '') + '</button>';
  var tag = document.createElement('div'); tag.id = 'pv-tag'; tag.innerHTML = html;
  document.body.appendChild(tag);
  var btn = tag.querySelector('button');
  btn.addEventListener('click', function () { var o = tag.classList.toggle('open'); btn.setAttribute('aria-expanded', o); });
})();
