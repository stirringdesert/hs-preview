(function () {
  var D = {"included":[{"number":29,"author":"stirringdesert","title":"About page: new photo, sticky on the right on desktop, top-right on phones","when":"2026-11-12T18:41:25Z"}],"skipped":[]};
  var B = {"run":43285404592,"at":"2026-11-12T18:59:06.984Z"};
  var RUNS = 'https://api.github.com/repos/stirringdesert/hs/actions/workflows/preview.yml/runs?per_page=1';
  var n = D.included.length;
  function plural(k) { var a = k % 10, b = k % 100; return a === 1 && b !== 11 ? 'изменение' : a >= 2 && a <= 4 && (b < 12 || b > 14) ? 'изменения' : 'изменений'; }
  function time(iso) { if (!iso) return ''; var d = new Date(iso), now = new Date();
    var t = d.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
    return d.toDateString() === now.toDateString() ? t : d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' }) + ' ' + t; }
  var css = '#pv-tag{position:fixed;right:12px;top:12px;z-index:2147483646;font:12px/1.3 -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;color:#fff}'
    + '#pv-tag{display:flex;gap:6px;align-items:center}'
    + '#pv-tag .pv-live{color:#fff;background:rgba(40,40,40,.9);text-decoration:none;border-radius:999px;padding:6px 10px;box-shadow:0 2px 10px rgba(0,0,0,.35)}'
    + '#pv-tag .pv-live:hover{background:#3a3a3a}'
    + '#pv-tag button{font:inherit;color:#000;background:#ffd84d;border:0;border-radius:999px;padding:6px 11px;cursor:pointer;box-shadow:0 2px 10px rgba(0,0,0,.35)}'
    + '#pv-tag .pv-dot{display:inline-block;width:7px;height:7px;border-radius:50%;margin-right:6px;vertical-align:1px;background:#1f9d55}'
    + '#pv-tag[data-s=busy] .pv-dot{background:#e8590c;animation:pv-pulse 1s ease-in-out infinite alternate}'
    + '#pv-tag[data-s=new] .pv-dot{background:#1c7ed6}'
    + '#pv-tag[data-s=unknown] .pv-dot{display:none}'
    + '@keyframes pv-pulse{from{opacity:1}to{opacity:.25}}'
    + '#pv-tag .pv-panel{position:absolute;right:0;top:36px;width:min(320px,calc(100vw - 24px));box-sizing:border-box;background:#1b1b1b;border:1px solid #333;border-radius:10px;padding:12px 14px;display:none}'
    + '#pv-tag.open .pv-panel{display:block}'
    + '@media (min-width:700px){#pv-tag{right:180px}}'
    + '#pv-tag p{margin:0 0 8px}#pv-tag ul{margin:0 0 10px;padding-left:18px}#pv-tag li{margin:3px 0}'
    + '#pv-tag .pv-muted{color:#9a9a9a}#pv-tag a{color:#ffd84d}#pv-tag .pv-state{margin-bottom:10px}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]; }); }
  function list(items) { return '<ul>' + items.map(function (c) { return '<li>' + esc(c.title) + ' <span class="pv-muted">(' + [c.author, c.when ? 'изменено ' + time(c.when) : ''].filter(Boolean).map(esc).join(', ') + ')</span></li>'; }).join('') + '</ul>'; }
  var live = 'https://harrysergeev.com' + location.pathname + location.hash;
  var html = '<div class="pv-panel">'
    + '<p class="pv-state" id="pv-state"></p>'
    + '<p><b>Превью, ещё не на сайте.</b> ' + (n ? 'Сайт плюс ' + n + ' ' + plural(n) + ', ' + (n === 1 ? 'которое ждёт' : 'которые ждут') + ' публикации:' : 'Сейчас ничего не ждёт публикации, всё как на сайте.') + '</p>'
    + (n ? list(D.included) : '')
    + (D.skipped.length ? '<p class="pv-muted">Пока не показано (конфликтует с другим изменением, исправляется):</p>' + list(D.skipped) : '')
    + '</div>'
    + '<a class="pv-live" href="' + esc(live) + '" title="Открыть эту страницу на сайте">сайт &nearr;</a>'
    + '<button type="button" aria-expanded="false"><span class="pv-dot"></span><span class="pv-label"></span></button>';
  var tag = document.createElement('div'); tag.id = 'pv-tag'; tag.innerHTML = html;
  document.body.appendChild(tag);
  var btn = tag.querySelector('button'), stateEl = tag.querySelector('#pv-state'), labelEl = tag.querySelector('.pv-label');
  // The button says what is happening: "превью · 2", "обновляется: <what>" or
  // "готово · обновить" (then a click reloads; otherwise it opens the list).
  btn.addEventListener('click', function () {
    if (tag.getAttribute('data-s') === 'new') { location.reload(); return; }
    var o = tag.classList.toggle('open'); btn.setAttribute('aria-expanded', o);
  });

  // Status: is a newer preview being built, or already built? Asks GitHub (public, no
  // login) for the latest preview run every 15 s while the tab is visible. Requests are
  // conditional ("no-cache" revalidates with the ETag), and an unchanged answer (304)
  // doesn't count toward GitHub's limit of 60 requests an hour; if the limit is hit
  // anyway, it waits a few minutes before asking again.
  var built = 'Эта версия собрана в ' + time(B.at) + '.';
  function short(t, k) { return t.length > k ? t.slice(0, k - 1).replace(/\s+\S*$/, '') + '…' : t; }
  // What the running update is about: the waiting change's title, or for a
  // publication the title of the published change (second paragraph of the merge commit).
  function what(run) {
    if (run.event === 'push') {
      var parts = ((run.head_commit && run.head_commit.message) || run.display_title || '').split(/\n\s*\n/);
      return /^Merge pull request/.test(parts[0]) && parts[1] ? 'опубликовано: ' + parts[1].split('\n')[0] : 'сайт: ' + parts[0].split('\n')[0];
    }
    return run.display_title || 'изменения';
  }
  function show(s, text, label) {
    tag.setAttribute('data-s', s); stateEl.innerHTML = text;
    labelEl.textContent = label || ('превью' + (n ? ' · ' + n : ''));
  }
  show('unknown', built);
  function check() {
    if (document.hidden) return;
    if (Date.now() < pause) return;
    fetch(RUNS, { cache: 'no-cache' }).then(function (r) {
      if (r.status === 403 || r.status === 429) { pause = Date.now() + 300000; return null; }
      return r.ok ? r.json() : null;
    }).then(function (j) {
      var run = j && j.workflow_runs && j.workflow_runs[0];
      if (!run) return show('unknown', built);
      var w = what(run), q = '«' + esc(w) + '»';
      if (run.status !== 'completed') {
        var secs = Math.max(0, Math.round((Date.now() - new Date(run.run_started_at || run.created_at)) / 1000));
        return show('busy', '<b>Обновляется:</b> ' + q + '. Идёт ' + (secs < 60 ? secs + ' сек' : Math.floor(secs / 60) + ' мин ' + (secs % 60) + ' сек') + '. ' + built,
          'обновляется: ' + short(w, 28));
      }
      if (run.id === B.run || run.conclusion !== 'success' || new Date(run.updated_at) < new Date(B.at))
        return show('ok', '<b>Актуально.</b> ' + built);
      // The build is done; the new version is ready once the preview site actually serves it.
      fetch('/_preview.js?check=' + Date.now(), { cache: 'no-store' }).then(function (r) { return r.text(); }).then(function (t) {
        if (t.indexOf('"run":' + run.id) !== -1)
          show('new', '<b>Готово:</b> ' + q + '. <a href="javascript:location.reload()">Обновите страницу</a>, чтобы увидеть.', 'готово · обновить');
        else
          show('busy', '<b>Публикуется:</b> ' + q + '. Собрано, превью вот-вот обновится. ' + built, 'публикуется: ' + short(w, 28));
      }).catch(function () {});
    }).catch(function () { show('unknown', built); });
  }
  var pause = 0;
  check();
  setInterval(check, 15000);
  document.addEventListener('visibilitychange', function () { if (!document.hidden) check(); });
})();
