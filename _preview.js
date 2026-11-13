(function () {
  var D = {"included":[{"number":29,"author":"stirringdesert","title":"About page: new photo, sticky on the right on desktop, top-right on phones","when":"2026-11-12T18:41:25Z"}],"skipped":[]}, B = {"run":43389275612,"at":"2026-11-13T07:56:02.786Z"}, LIVE = "https://harrysergeev.com";

  // All runs of both workflows in one request (public GitHub API, no login).
  var RUNS = 'https://api.github.com/repos/stirringdesert/hs/actions/runs?per_page=10';
  var LOADED = Date.now();
  var n = D.included.length;
  function plural(k) { var a = k % 10, b = k % 100; return a === 1 && b !== 11 ? 'изменение' : a >= 2 && a <= 4 && (b < 12 || b > 14) ? 'изменения' : 'изменений'; }
  function time(iso) { if (!iso) return ''; var d = new Date(iso), now = new Date();
    var t = d.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
    return d.toDateString() === now.toDateString() ? t : d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' }) + ' ' + t; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]; }); }
  function short(t, k) { return t.length > k ? t.slice(0, k - 1).replace(/\s+\S*$/, '').replace(/[\s,.;:]+$/, '') + '…' : t; }

  // Quiet, small pills: dark glass, muted text. The coloured dot carries the state.
  var css = '#pv-tag{position:fixed;right:12px;top:12px;z-index:2147483646;display:flex;gap:6px;align-items:center;font:11px/1.3 -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;color:#ddd}'
    + '#pv-tag .pv-pill{font:inherit;color:#cfcfcf;background:rgba(24,24,24,.72);border:1px solid rgba(255,255,255,.12);border-radius:999px;padding:4px 9px;cursor:pointer;text-decoration:none;-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px);transition:color .2s,border-color .2s,box-shadow .2s}'
    + '#pv-tag .pv-pill:hover{color:#fff;border-color:rgba(255,255,255,.3)}'
    + '#pv-tag .pv-dot{display:inline-block;width:6px;height:6px;border-radius:50%;margin-right:6px;vertical-align:1px;background:#2f9e44}'
    + '#pv-tag[data-s=busy] .pv-dot{background:#f08c00;animation:pv-pulse 1s ease-in-out infinite alternate}'
    + '#pv-tag[data-s=new] .pv-dot{background:#4dabf7}'
    + '#pv-tag[data-s=unknown] .pv-dot{background:#777}'
    + '#pv-tag .pv-live.glow{color:#fff;border-color:#2f9e44;animation:pv-glow 1.6s ease-in-out infinite alternate}'
    + '@keyframes pv-pulse{from{opacity:1}to{opacity:.25}}'
    + '@keyframes pv-glow{from{box-shadow:0 0 0 0 rgba(47,158,68,.0)}to{box-shadow:0 0 10px 2px rgba(47,158,68,.7)}}'
    + '#pv-tag .pv-panel{position:absolute;right:0;top:30px;width:min(320px,calc(100vw - 24px));box-sizing:border-box;background:#1b1b1b;border:1px solid #333;border-radius:10px;padding:12px 14px;display:none;font-size:12px;color:#fff}'
    + '#pv-tag.open .pv-panel{display:block}'
    + '@media (min-width:700px){#pv-tag{right:180px}}'
    + '#pv-tag p{margin:0 0 8px}#pv-tag ul{margin:0 0 10px;padding-left:18px}#pv-tag li{margin:3px 0}'
    + '#pv-tag .pv-muted{color:#9a9a9a}#pv-tag .pv-panel a{color:#ffd84d}#pv-tag .pv-state p{margin-bottom:6px}#pv-tag .pv-state{margin-bottom:10px}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
  function list(items) { return '<ul>' + items.map(function (c) { return '<li>' + esc(c.title) + ' <span class="pv-muted">(' + [c.author, c.when ? 'изменено ' + time(c.when) : ''].filter(Boolean).map(esc).join(', ') + ')</span></li>'; }).join('') + '</ul>'; }
  var live = LIVE + location.pathname + location.hash;
  var tag = document.createElement('div'); tag.id = 'pv-tag';
  tag.innerHTML = '<div class="pv-panel"><div class="pv-state"></div>'
    + '<p><b>Превью, ещё не на сайте.</b> ' + (n ? 'Сайт плюс ' + n + ' ' + plural(n) + ', ' + (n === 1 ? 'которое ждёт' : 'которые ждут') + ' публикации:' : 'Сейчас ничего не ждёт публикации, всё как на сайте.') + '</p>'
    + (n ? list(D.included) : '')
    + (D.skipped.length ? '<p class="pv-muted">Пока не показано (конфликтует с другим изменением, исправляется):</p>' + list(D.skipped) : '')
    + '</div>'
    + '<a class="pv-pill pv-live" href="' + esc(live) + '" target="_blank" rel="noopener" title="Открыть эту страницу на сайте">сайт ↗</a>'
    + '<button type="button" class="pv-pill pv-btn" aria-expanded="false"><span class="pv-dot"></span><span class="pv-label"></span></button>';
  document.body.appendChild(tag);
  var btn = tag.querySelector('.pv-btn'), stateEl = tag.querySelector('.pv-state'), labelEl = tag.querySelector('.pv-label'), liveBtn = tag.querySelector('.pv-live');
  btn.addEventListener('click', function () {
    if (tag.getAttribute('data-s') === 'new') { location.reload(); return; }
    var o = tag.classList.toggle('open'); btn.setAttribute('aria-expanded', o);
  });

  // What a run is about: a waiting change's title, or for a push to main the title of
  // the published change (second paragraph of the merge commit).
  function what(run) {
    if (run.event === 'push') {
      var parts = ((run.head_commit && run.head_commit.message) || run.display_title || '').split(/\n\s*\n/);
      return /^Merge pull request/.test(parts[0]) && parts[1] ? parts[1].split('\n')[0] : parts[0].split('\n')[0];
    }
    return run.display_title || 'изменения';
  }
  function fmt(secs) { return secs < 60 ? secs + ' сек' : Math.floor(secs / 60) + ' мин ' + (secs % 60) + ' сек'; }

  // States, shown on the button and in the panel:
  //   публикуется    a change is being published to the live site (Deploy workflow running)
  //   собирается     the preview is being built (Update preview workflow running)
  //   обновляется    built; the preview site is about to serve it
  //   готово         the preview serves a newer version: a click reloads
  //   превью · N     nothing happening
  // When a publication finishes while the page is open, the panel says so and the "сайт"
  // button glows until the next change starts or the page is left.
  var built = 'Эта версия превью собрана в ' + time(B.at) + '.';
  var pause = 0, timer = 0, liveLine = '', dismissed = {};
  var clocks = {};  // element class -> start time, ticked every second
  function show(s, text, label) {
    tag.setAttribute('data-s', s);
    stateEl.innerHTML = liveLine + '<p>' + text + '</p>';
    labelEl.textContent = label || ('превью' + (n ? ' · ' + n : ''));
    tick();
  }
  function tick() {
    for (var k in clocks) { var el = stateEl.querySelector('.' + k);
      if (el) el.textContent = fmt(Math.max(0, Math.round((Date.now() - clocks[k]) / 1000))); }
  }
  setInterval(tick, 1000);
  function glow(on) { liveBtn.classList.toggle('glow', on); }

  function check() {
    if (document.hidden || Date.now() < pause) return;
    var opts = { cache: 'no-cache' };
    if (window.__pvApi) opts.headers = { Authorization: 'Bearer ' + window.__pvApi };
    fetch(RUNS, opts).then(function (r) {
      if (r.status === 401 && window.__pvApi) { window.__pvApi = null; return null; } // token expired: go on without it
      if (r.status === 403 || r.status === 429) {
        pause = Date.now() + 300000;
        show('unknown', '<b>Статус на паузе.</b> GitHub ограничил число проверок, продолжу через 5 минут. ' + built, 'статус на паузе');
        return false;
      }
      return r.ok ? r.json() : null;
    }).then(function (j) {
      if (j === false) return;
      var runs = (j && j.workflow_runs) || [];
      var pv = runs.filter(function (r) { return r.name === 'Update preview site'; })[0];
      var lv = runs.filter(function (r) { return r.name === 'Deploy to GitHub Pages'; })[0];
      clocks = {}; liveLine = '';
      var label = null;
      if (lv && lv.status !== 'completed') {
        clocks['pv-t-live'] = new Date(lv.run_started_at || lv.created_at).getTime();
        liveLine = '<p><b>Публикуется на сайт:</b> «' + esc(what(lv)) + '». Идёт <span class="pv-t-live"></span>.</p>';
        label = 'публикуется: ' + short(what(lv), 26);
        glow(false);
      } else if (lv && lv.conclusion === 'success' && new Date(lv.updated_at).getTime() > LOADED - 5000) {
        // A preview build that started after the publication finished is "something new":
        // it ends the glow. (The rebuild that the publication itself starts doesn't.)
        if (pv && pv.status !== 'completed' && new Date(pv.created_at) > new Date(lv.updated_at)) dismissed[lv.id] = true;
        if (!dismissed[lv.id]) { liveLine = '<p><b>Сайт обновлён:</b> «' + esc(what(lv)) + '» уже на сайте. <a href="' + esc(live) + '">Открыть ↗</a></p>'; glow(true); }
        else glow(false);
      }
      if (!pv) return show(label ? 'busy' : 'unknown', built, label);
      var q = '«' + esc(what(pv)) + '»';
      if (pv.status !== 'completed') {
        clocks['pv-t-pv'] = new Date(pv.run_started_at || pv.created_at).getTime();
        return show('busy', '<b>Собирается превью:</b> ' + q + '. Идёт <span class="pv-t-pv"></span>. ' + built, label || 'собирается: ' + short(what(pv), 26));
      }
      if (pv.id === B.run || pv.conclusion !== 'success' || new Date(pv.updated_at) < new Date(B.at))
        return show(label ? 'busy' : 'ok', '<b>Превью актуально.</b> ' + built, label);
      // Built; ready once the preview site actually serves it.
      fetch('/_preview.js?check=' + Date.now(), { cache: 'no-store' }).then(function (r) { return r.text(); }).then(function (t) {
        if (t.indexOf('"run":' + pv.id) !== -1)
          show(label ? 'busy' : 'new', '<b>Превью готово:</b> ' + q + '. <a href="javascript:location.reload()">Обновите страницу</a>, чтобы увидеть.', label || 'готово · обновить');
        else
          show('busy', '<b>Обновляется превью:</b> ' + q + '. Собрано, вот-вот появится. ' + built, label || 'обновляется: ' + short(what(pv), 26));
      }).catch(function () {});
    }).catch(function () { show('unknown', built); });
  }
  // GitHub is asked every 5 s while something is happening, every 15 s otherwise
  // (unchanged answers don't count toward its hourly limit); the timers tick locally.
  function schedule() { clearTimeout(timer); timer = setTimeout(function () { check(); schedule(); }, tag.getAttribute('data-s') === 'busy' ? 5000 : 15000); }
  show('unknown', built);
  check();
  schedule();
  document.addEventListener('visibilitychange', function () { if (!document.hidden) check(); });
})();
