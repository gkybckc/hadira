// Hadıra landing: live phone screens. No network requests, no storage, no tracking.
// Prayer times are an approximate on-page calculation for Istanbul (Diyanet-style
// angles: imsak 18°, yatsı 17°, Shafi asr, with the usual minute adjustments).
// The app itself calculates them for the user's location.
(function () {
  'use strict';
  document.documentElement.classList.add('js');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ---------- Istanbul clock ---------- */
  var TZ = 'Europe/Istanbul';
  var LAT = 41.0082, LNG = 28.9784, UTC_OFFSET = 3;
  var fmtParts = new Intl.DateTimeFormat('en-GB', { timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
  var fmtDate = new Intl.DateTimeFormat('tr-TR', { timeZone: TZ, weekday: 'long', day: 'numeric', month: 'long' });

  function istanbulNow() {
    var p = {};
    fmtParts.formatToParts(new Date()).forEach(function (x) { p[x.type] = x.value; });
    var h = (+p.hour) % 24;
    return { y: +p.year, m: +p.month, d: +p.day, mins: h * 60 + (+p.minute) + (+p.second) / 60 };
  }

  /* ---------- prayer times (approximate) ---------- */
  var rad = Math.PI / 180, deg = 180 / Math.PI;
  function fix(a, b) { a = a - b * Math.floor(a / b); return a < 0 ? a + b : a; }
  function julian(y, m, d) {
    if (m <= 2) { y -= 1; m += 12; }
    var A = Math.floor(y / 100), B = 2 - A + Math.floor(A / 4);
    return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + d + B - 1524.5;
  }
  function sun(jd) {
    var D = jd - 2451545.0;
    var g = fix(357.529 + 0.98560028 * D, 360);
    var q = fix(280.459 + 0.98564736 * D, 360);
    var L = fix(q + 1.915 * Math.sin(g * rad) + 0.020 * Math.sin(2 * g * rad), 360);
    var e = 23.439 - 0.00000036 * D;
    var RA = Math.atan2(Math.cos(e * rad) * Math.sin(L * rad), Math.cos(L * rad)) * deg / 15;
    return { decl: Math.asin(Math.sin(e * rad) * Math.sin(L * rad)) * deg, eqt: q / 15 - fix(RA, 24) };
  }
  function prayerMinutes(y, m, d) {
    var jd = julian(y, m, d) - LNG / 360 + 0.5;
    var s = sun(jd);
    var noon = fix(12 - s.eqt, 24);
    function angleTime(angle, ccw) {
      var c = (-Math.sin(angle * rad) - Math.sin(s.decl * rad) * Math.sin(LAT * rad)) / (Math.cos(s.decl * rad) * Math.cos(LAT * rad));
      var t = Math.acos(Math.max(-1, Math.min(1, c))) * deg / 15;
      return noon + (ccw ? -t : t);
    }
    var asrAngle = -Math.atan(1 / (1 + Math.tan(Math.abs(LAT - s.decl) * rad))) * deg;
    var adj = UTC_OFFSET - LNG / 15;
    var hours = [
      angleTime(18, true),        // imsak
      angleTime(0.833, true),     // güneş
      noon,                       // öğle
      angleTime(asrAngle, false), // ikindi
      angleTime(0.833, false),    // akşam
      angleTime(17, false)        // yatsı
    ];
    var temkin = [0, -7, 5, 4, 7, 0];
    return hours.map(function (h, i) { return Math.round((h + adj) * 60 + temkin[i]); });
  }
  var NAMES = ['İmsak', 'Güneş', 'Öğle', 'İkindi', 'Akşam', 'Yatsı'];
  function hhmm(mins) { mins = fix(mins, 1440); var h = Math.floor(mins / 60), m = Math.floor(mins % 60); return (h < 10 ? '0' : '') + h + ':' + (m < 10 ? '0' : '') + m; }
  function left(diff) {
    diff = Math.max(1, Math.ceil(diff));
    var h = Math.floor(diff / 60), m = diff % 60;
    return h ? h + ' sa ' + (m ? m + ' dk' : '') : m + ' dk';
  }

  var dayKey = '', today = [];
  function tick() {
    var now = istanbulNow();
    var key = now.y + '-' + now.m + '-' + now.d;
    if (key !== dayKey) {
      dayKey = key;
      today = prayerMinutes(now.y, now.m, now.d);
      $$('[data-vakit]').forEach(function (li) { $('b', li).textContent = hhmm(today[+li.dataset.vakit]); });
      var dateStr = fmtDate.format(new Date());
      $$('[data-date]').forEach(function (el) { el.textContent = dateStr.charAt(0).toLocaleUpperCase('tr') + dateStr.slice(1); });
    }
    var clock = hhmm(now.mins);
    $$('[data-clock]').forEach(function (el) { if (el.textContent !== clock) el.textContent = clock; });

    var next = -1;
    for (var i = 0; i < 6; i++) { if (today[i] > now.mins) { next = i; break; } }
    var nextMins = next === -1 ? today[0] + 1440 : today[next];
    var name = NAMES[next === -1 ? 0 : next];
    var l = left(nextMins - now.mins);
    $$('[data-next-name]').forEach(function (el) { el.textContent = name; });
    $$('[data-next-time]').forEach(function (el) { el.textContent = hhmm(nextMins); });
    $$('[data-next-left]').forEach(function (el) { el.textContent = l; });
    $$('[data-vakit]').forEach(function (li) {
      var i = +li.dataset.vakit;
      li.classList.toggle('is-next', i === next || (next === -1 && i === 0 && false));
      li.classList.toggle('is-past', next !== -1 ? i < next : true);
    });
  }
  tick();
  setInterval(tick, 1000 * 15);

  /* ---------- bells ---------- */
  $$('.bell').forEach(function (b) {
    b.addEventListener('click', function () { b.setAttribute('aria-pressed', b.getAttribute('aria-pressed') === 'true' ? 'false' : 'true'); });
  });

  /* ---------- feed ---------- */
  var feed = $('[data-feed]');
  if (feed) {
    var list = $('[data-feed-list]', feed);
    var items = $$('li', list);
    var dots = $('[data-feed-dots]', feed);
    var fav = $('[data-fav]', feed);
    var favs = {};
    var idx = 0, timer = null, visible = true, hover = false;
    items.forEach(function () { dots.appendChild(document.createElement('i')); });
    function show(i) {
      idx = (i + items.length) % items.length;
      list.style.transform = 'translateY(' + (-100 * idx) + '%)';
      $$('i', dots).forEach(function (d, j) { d.classList.toggle('on', j === idx); });
      fav.setAttribute('aria-pressed', favs[idx] ? 'true' : 'false');
      fav.setAttribute('aria-label', favs[idx] ? 'Favorilerden çıkar' : 'Favorilere ekle');
    }
    function schedule() {
      clearInterval(timer);
      if (reduce) return;
      timer = setInterval(function () { if (visible && !hover && !document.hidden) show(idx + 1); }, 3400);
    }
    $('[data-feed-next]', feed).addEventListener('click', function () { show(idx + 1); schedule(); });
    fav.addEventListener('click', function () { favs[idx] = !favs[idx]; show(idx); schedule(); });
    feed.addEventListener('pointerenter', function () { hover = true; });
    feed.addEventListener('pointerleave', function () { hover = false; });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (e) { visible = e[0].isIntersecting; }).observe(feed);
    }
    show(0); schedule();
  }

  /* ---------- themes ---------- */
  var themeScreen = $('[data-theme-screen]');
  if (themeScreen) {
    var nameEl = $('[data-theme-name]', themeScreen);
    $$('[data-themes] [data-theme]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        if (!reduce) {
          var ghost = document.createElement('div');
          ghost.style.cssText = 'position:absolute;inset:0;z-index:0;transition:opacity .6s;background:' + getComputedStyle(themeScreen).backgroundImage;
          themeScreen.insertBefore(ghost, themeScreen.firstChild);
          requestAnimationFrame(function () { requestAnimationFrame(function () { ghost.style.opacity = '0'; }); });
          setTimeout(function () { ghost.remove(); }, 700);
        }
        ['--a', '--b', '--c', '--t'].forEach(function (v) { themeScreen.style.setProperty(v, btn.style.getPropertyValue(v)); });
        nameEl.textContent = btn.textContent;
        $$('[data-themes] [data-theme]').forEach(function (b) { b.setAttribute('aria-pressed', b === btn ? 'true' : 'false'); });
      });
    });
  }

  /* ---------- quiz (sample questions) ---------- */
  var quiz = $('[data-quiz]');
  if (quiz) {
    var Q = [
      { q: 'Kur’an-ı Kerim kaç sureden oluşur?', o: ['99', '114', '120'], a: 1 },
      { q: 'Hicret hangi şehre yapıldı?', o: ['Taif', 'Kudüs', 'Medine'], a: 2 },
      { q: 'Kur’an-ı Kerim’in ilk suresi hangisidir?', o: ['Fâtiha', 'Bakara', 'İhlâs'], a: 0 }
    ];
    var qi = 0;
    var qEl = $('[data-quiz-q]', quiz), opts = $('[data-quiz-opts]', quiz), nextBtn = $('[data-quiz-next]', quiz), count = $('[data-quiz-count]', quiz);
    function render() {
      var cur = Q[qi];
      qEl.textContent = cur.q;
      count.textContent = (qi + 1) + ' / ' + Q.length;
      opts.innerHTML = '';
      cur.o.forEach(function (text, i) {
        var b = document.createElement('button');
        b.type = 'button'; b.textContent = text;
        b.addEventListener('click', function () {
          $$('button', opts).forEach(function (x, j) {
            x.disabled = true;
            if (j === cur.a) { x.classList.add('right'); x.setAttribute('aria-label', x.textContent + ', doğru cevap'); }
            else if (x === b) { x.classList.add('wrong'); x.setAttribute('aria-label', x.textContent + ', yanlış'); }
          });
          nextBtn.hidden = false;
          nextBtn.textContent = qi === Q.length - 1 ? 'Baştan başla' : 'Sonraki soru';
        });
        opts.appendChild(b);
      });
      nextBtn.hidden = true;
    }
    nextBtn.addEventListener('click', function () { qi = (qi + 1) % Q.length; render(); $('button', opts).focus(); });
    render();
  }

  /* ---------- stage: reveal, centre the main phone on small screens, gentle parallax ---------- */
  var shots = $$('.shot');
  requestAnimationFrame(function () { shots.forEach(function (s) { s.classList.add('in'); }); });
  var track = $('.stage-track'), main = $('.shot-main');
  if (track && main && track.scrollWidth > track.clientWidth) {
    track.scrollLeft = main.offsetLeft - (track.clientWidth - main.offsetWidth) / 2;
  }
  if (!reduce && window.matchMedia('(min-width: 900px)').matches) {
    var side = $$('.shot:not(.shot-main) .phone'), ticking = false;
    window.addEventListener('scroll', function () {
      if (ticking) return; ticking = true;
      requestAnimationFrame(function () {
        var y = Math.min(window.scrollY, 900);
        side.forEach(function (p, i) { p.style.transform = 'translateY(' + (-y * 0.08) + 'px) rotate(' + (i ? 1 : -1) * Math.min(y / 300, 2) + 'deg)'; });
        ticking = false;
      });
    }, { passive: true });
  }
})();
