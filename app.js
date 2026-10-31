(() => {
  'use strict';

  // ---------------------------------------------------------------------------
  // Configuration
  // ---------------------------------------------------------------------------

  const STORE_KEY = 'hotandcold.v1';
  const WEIGHT_MIN = 0;
  const WEIGHT_MAX = 3;
  const WEIGHT_STEP = 0.5;
  const ADJ_MIN = -5;
  const ADJ_MAX = 5;
  const ADJ_STEP = 0.5;

  const CATEGORIES = [
    { id: 'booking',  label: 'Booking experience',       hint: 'Ease, clarity, flexibility' },
    { id: 'location', label: 'Bathhouse location',       hint: 'Access, surroundings, views' },
    { id: 'sauna',    label: 'Sauna',                    hint: 'Heat, space, wood, rituals' },
    { id: 'steam',    label: 'Steam room',               hint: 'Density, aroma, cleanliness' },
    { id: 'hotpool',  label: 'Hot / warm pool',          hint: 'Temperature, size, calm' },
    { id: 'cold',     label: 'Cold plunge',              hint: 'How cold, depth, access' },
    { id: 'ambience', label: 'General setup & ambience', hint: 'Flow, design, quiet, light' },
    { id: 'refresh',  label: 'Water, tea & snacks',      hint: 'Availability, quality' },
    { id: 'change',   label: 'Change rooms & shower',    hint: 'Space, lockers, amenities' },
    { id: 'price',    label: 'Price',                    hint: 'Value for money' },
  ];

  const ICONS = {
    booking:  '<rect x="3.5" y="5" width="17" height="15.5" rx="3"/><path d="M3.5 10h17M8 3v4M16 3v4"/><path d="M9 15l2 2 4-4"/>',
    location: '<path d="M12 21s-6.5-5.8-6.5-11A6.5 6.5 0 0 1 18.5 10c0 5.2-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.4"/>',
    sauna:    '<path d="M8 3.5c-1.3 1.6 1.3 2.6 0 4.5M12 3.5c-1.3 1.6 1.3 2.6 0 4.5M16 3.5c-1.3 1.6 1.3 2.6 0 4.5"/><path d="M3.5 12h17M3.5 16.5h17M6 12v8.5M18 12v8.5"/>',
    steam:    '<path d="M7.5 18.5a4 4 0 0 1-.4-8 5.6 5.6 0 0 1 10.8 1.4 3.3 3.3 0 0 1-.4 6.6z"/><path d="M9 21.5h6"/>',
    hotpool:  '<path d="M2.5 15.5c1.6 0 1.6-1.3 3.2-1.3s1.6 1.3 3.2 1.3 1.6-1.3 3.2-1.3 1.6 1.3 3.2 1.3 1.6-1.3 3.2-1.3 1.6 1.3 2.9 1.3M2.5 19.5c1.6 0 1.6-1.3 3.2-1.3s1.6 1.3 3.2 1.3 1.6-1.3 3.2-1.3 1.6 1.3 3.2 1.3 1.6-1.3 3.2-1.3 1.6 1.3 2.9 1.3"/><path d="M9 10.5c-1-1.4 1-2.4 0-4.2M15 10.5c-1-1.4 1-2.4 0-4.2"/>',
    cold:     '<path d="M12 2.5v19M3.8 7.2l16.4 9.6M20.2 7.2L3.8 16.8"/><path d="M9.5 4.2L12 6l2.5-1.8M9.5 19.8L12 18l2.5 1.8"/>',
    ambience: '<path d="M5 19.5C5 11.5 10.5 5 20 4.5c0 9-6 15-14 15"/><path d="M5 19.5c2.6-4 6-7 10-9"/>',
    refresh:  '<path d="M4 9.5h12.5v4.5a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5z"/><path d="M16.5 11h1.3a2.5 2.5 0 0 1 0 5h-1.3"/><path d="M8 3.5c-.8 1 .8 2 0 3M12 3.5c-.8 1 .8 2 0 3"/>',
    change:   '<path d="M12 7.5a2 2 0 1 1 2-2"/><path d="M12 7.5v1.2L3.5 15a1 1 0 0 0 .6 1.8h15.8a1 1 0 0 0 .6-1.8L12 8.7"/>',
    price:    '<path d="M3.5 12.2V4.5a1 1 0 0 1 1-1h7.7l8.3 8.3a1.5 1.5 0 0 1 0 2.1l-6.4 6.4a1.5 1.5 0 0 1-2.1 0z"/><circle cx="8" cy="8" r="1.6"/>',
  };

  const UI_ICONS = {
    back:     '<path d="M15 5l-7 7 7 7"/>',
    plus:     '<path d="M12 5v14M5 12h14"/>',
    minus:    '<path d="M5 12h14"/>',
    close:    '<path d="M6 6l12 12M18 6L6 18"/>',
    settings: '<path d="M4 7h9M17 7h3M4 17h3M11 17h9"/><circle cx="15" cy="7" r="2"/><circle cx="9" cy="17" r="2"/>',
    edit:     '<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="M13.5 6.5l4 4"/>',
    trash:    '<path d="M4.5 7h15M9.5 7V4.5h5V7M6.5 7l1 13h9l1-13"/>',
    sparkle:  '<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/>',
    pin:      '<path d="M12 21s-6.5-5.8-6.5-11A6.5 6.5 0 0 1 18.5 10c0 5.2-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.4"/>',
    calendar: '<rect x="3.5" y="5" width="17" height="15.5" rx="3"/><path d="M3.5 10h17M8 3v4M16 3v4"/>',
    download: '<path d="M12 4v11M7 10.5l5 5 5-5M5 20h14"/>',
    upload:   '<path d="M12 16V5M7 9.5l5-5 5 5M5 20h14"/>',
  };

  const TIERS = [
    [9.5, 'Transcendent'],
    [8.5, 'Blissful'],
    [7.5, 'Soothing'],
    [6.5, 'Pleasant'],
    [5.5, 'Lukewarm'],
    [4,   'Tepid'],
    [0,   'Chilly'],
  ];

  const ADJ_PRESETS = [
    { label: 'Sauna ritual / Aufguss', points: 1 },
    { label: 'Outdoor area / nature',  points: 1 },
    { label: 'Massage or treatments',  points: 0.5 },
    { label: 'Crowded',                points: -1 },
    { label: 'Noisy',                  points: -0.5 },
    { label: 'Cleanliness issues',     points: -1.5 },
  ];

  // ---------------------------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------------------------

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
  const round = (v, step) => Math.round(v / step) * step;
  const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[c]));

  const icon = (paths, cls = '') =>
    `<svg class="ico ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;

  const fmt = (v, digits = 1) => (v == null ? '–' : Number(v).toFixed(digits));
  const fmtSigned = (v) => (v > 0 ? '+' : v < 0 ? '−' : '±') + Math.abs(v).toFixed(1);
  const fmtWeight = (w) => '×' + Number(w).toFixed(1);

  const todayLocal = () => {
    const d = new Date();
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().slice(0, 10);
  };

  const fmtDate = (iso) => {
    if (!iso) return '';
    const d = new Date(iso + 'T00:00:00');
    if (isNaN(d)) return iso;
    return d.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const tierFor = (v) => (v == null ? 'Not yet rated' : TIERS.find(([min]) => v >= min)[1]);

  const tick = () => { if (navigator.vibrate) { try { navigator.vibrate(4); } catch (_) { /* noop */ } } };

  const replay = (el, cls) => {
    if (!el) return;
    el.classList.remove(cls);
    void el.offsetWidth; // restart the CSS animation
    el.classList.add(cls);
  };

  // ---------------------------------------------------------------------------
  // State & persistence
  // ---------------------------------------------------------------------------

  const defaultWeights = () => Object.fromEntries(CATEGORIES.map((c) => [c.id, 1]));

  function normaliseRating(r) {
    const scores = {};
    for (const c of CATEGORIES) {
      const e = (r.scores && r.scores[c.id]) || {};
      const score = e.score == null || e.score === '' ? null : clamp(Number(e.score), 0, 10);
      const weight = e.weight == null ? 1 : clamp(Number(e.weight), WEIGHT_MIN, WEIGHT_MAX);
      scores[c.id] = { score: Number.isFinite(score) ? score : null, weight: Number.isFinite(weight) ? weight : 1, na: !!e.na };
    }
    return {
      id: r.id || uid(),
      name: String(r.name || ''),
      location: String(r.location || ''),
      date: String(r.date || ''),
      notes: String(r.notes || ''),
      scores,
      adjustments: (Array.isArray(r.adjustments) ? r.adjustments : []).map((a) => ({
        id: a.id || uid(),
        label: String(a.label || ''),
        points: clamp(Number(a.points) || 0, ADJ_MIN, ADJ_MAX),
      })),
      createdAt: r.createdAt || Date.now(),
      updatedAt: r.updatedAt || Date.now(),
    };
  }

  function load() {
    const fresh = { ratings: [], defaults: { weights: defaultWeights() }, sort: 'score' };
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (!raw) return fresh;
      const d = JSON.parse(raw);
      return {
        ratings: Array.isArray(d.ratings) ? d.ratings.map(normaliseRating) : [],
        defaults: { weights: { ...defaultWeights(), ...((d.defaults && d.defaults.weights) || {}) } },
        sort: d.sort || 'score',
      };
    } catch (_) {
      return fresh;
    }
  }

  const state = load();

  function persist() {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(state));
    } catch (_) {
      toast('Could not save — storage is unavailable');
    }
  }

  function newRating() {
    const scores = {};
    for (const c of CATEGORIES) {
      scores[c.id] = { score: null, weight: state.defaults.weights[c.id] ?? 1, na: false };
    }
    return normaliseRating({ id: uid(), date: todayLocal(), scores, adjustments: [] });
  }

  const findRating = (id) => state.ratings.find((r) => r.id === id);

  // ---------------------------------------------------------------------------
  // Scoring
  // ---------------------------------------------------------------------------

  /**
   * Weighted average of every scored, offered category (0–10),
   * plus the sum of bonus/minus points, clamped to 0–10.
   */
  function compute(r) {
    let weightSum = 0;
    let weighted = 0;
    let rated = 0;
    let offered = 0;
    let offeredWeight = 0;
    for (const c of CATEGORIES) {
      const e = r.scores[c.id];
      if (e.na) continue;
      offered++;
      offeredWeight += e.weight;
      if (e.score == null) continue;
      rated++;
      weightSum += e.weight;
      weighted += e.score * e.weight;
    }
    const base = weightSum > 0 ? weighted / weightSum : null;
    const adj = r.adjustments.reduce((sum, a) => sum + (Number(a.points) || 0), 0);
    const total = base == null ? null : clamp(base + adj, 0, 10);
    return { base, adj, total, rated, offered, weightSum, offeredWeight };
  }

  // ---------------------------------------------------------------------------
  // Shared components
  // ---------------------------------------------------------------------------

  function ring(value, size, stroke, extraClass = '') {
    const r = (size - stroke) / 2;
    const c = size / 2;
    const circ = 2 * Math.PI * r;
    const off = value == null ? circ : circ * (1 - value / 10);
    return `
      <svg class="ring ${extraClass}" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" aria-hidden="true">
        <circle class="ring-track" cx="${c}" cy="${c}" r="${r}" stroke-width="${stroke}"/>
        <circle class="ring-val" cx="${c}" cy="${c}" r="${r}" stroke-width="${stroke}"
          stroke-dasharray="${circ.toFixed(2)}" stroke-dashoffset="${circ.toFixed(2)}"
          data-circ="${circ.toFixed(2)}" data-off="${off.toFixed(2)}"
          transform="rotate(-90 ${c} ${c})"/>
      </svg>`;
  }

  function setRing(svg, value) {
    const val = svg && $('.ring-val', svg);
    if (!val) return;
    const circ = Number(val.dataset.circ);
    const off = value == null ? circ : circ * (1 - clamp(value, 0, 10) / 10);
    val.style.strokeDashoffset = off.toFixed(2);
  }

  function animateNumber(el, to, digits = 1) {
    if (!el) return;
    if (to == null) { el.textContent = '–'; el.dataset.value = ''; return; }
    const from = el.dataset.value === '' || el.dataset.value == null ? 0 : Number(el.dataset.value);
    el.dataset.value = String(to);
    if (reduceMotion || from === to) { el.textContent = to.toFixed(digits); return; }
    const start = performance.now();
    const dur = 650;
    const step = (now) => {
      if (el.dataset.value !== String(to)) return; // superseded by a newer animation
      const t = clamp((now - start) / dur, 0, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = (from + (to - from) * eased).toFixed(digits);
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  /** Kick off entrance animations for rings and counters in the freshly rendered view. */
  function settle(root) {
    requestAnimationFrame(() => requestAnimationFrame(() => {
      $$('.ring-val', root).forEach((c) => { c.style.strokeDashoffset = c.dataset.off; });
      $$('[data-count]', root).forEach((el) => {
        const v = el.dataset.count;
        el.dataset.value = '';
        animateNumber(el, v === '' ? null : Number(v), Number(el.dataset.digits || 1));
      });
    }));
  }

  let toastTimer;
  function toast(msg) {
    const el = $('#toast');
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('show'), 2400);
  }

  // ---------------------------------------------------------------------------
  // Views
  // ---------------------------------------------------------------------------

  const app = $('#app');
  let draft = null;      // rating being edited
  let draftDirty = false;
  let draftIsNew = false;

  function mount(html, cls) {
    app.className = 'app ' + cls;
    app.innerHTML = html;
    replay(app, 'view-enter');
    window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
    settle(app);
  }

  // ----- List ---------------------------------------------------------------

  function sortedRatings() {
    const list = state.ratings.map((r) => ({ r, s: compute(r) }));
    const by = {
      score:  (a, b) => (b.s.total ?? -1) - (a.s.total ?? -1),
      recent: (a, b) => (b.r.date || '').localeCompare(a.r.date || '') || b.r.updatedAt - a.r.updatedAt,
      name:   (a, b) => a.r.name.localeCompare(b.r.name),
    }[state.sort] || (() => 0);
    return list.sort(by);
  }

  function renderList() {
    const items = sortedRatings();
    const scored = items.filter((i) => i.s.total != null);
    const avg = scored.length ? scored.reduce((a, i) => a + i.s.total, 0) / scored.length : null;

    const cards = items.map(({ r, s }, i) => `
      <a class="b-card glass" href="#/b/${esc(r.id)}" style="--i:${i}">
        <div class="ring-wrap sm">
          ${ring(s.total, 60, 5)}
          <span class="ring-num" data-count="${s.total ?? ''}">–</span>
        </div>
        <div class="b-card-body">
          <h3>${esc(r.name) || 'Untitled bathhouse'}</h3>
          <p class="meta">
            ${r.location ? `<span>${icon(UI_ICONS.pin)}${esc(r.location)}</span>` : ''}
            ${r.date ? `<span>${icon(UI_ICONS.calendar)}${esc(fmtDate(r.date))}</span>` : ''}
          </p>
          <span class="tier">${tierFor(s.total)}</span>
        </div>
        <span class="chev">${icon('<path d="M9 5l7 7-7 7"/>')}</span>
      </a>`).join('');

    const empty = `
      <div class="empty glass">
        <div class="empty-art" aria-hidden="true">
          <span class="drop"></span><span class="ripple r1"></span><span class="ripple r2"></span><span class="ripple r3"></span>
        </div>
        <h2>Your journal is still water</h2>
        <p>Rate your first bathhouse — score each part of the experience, weight what matters to you, and add bonus or minus points for the moments that stood out.</p>
        <a class="btn btn-primary" href="#/new">${icon(UI_ICONS.plus)}Rate a bathhouse</a>
      </div>`;

    mount(`
      <header class="hero">
        <div class="brand">
          <span class="logo" aria-hidden="true">${logoSvg()}</span>
          <div>
            <h1>Hot &amp; Cold</h1>
            <p>A bathhouse journal</p>
          </div>
        </div>
        <a class="icon-btn" href="#/settings" aria-label="Settings">${icon(UI_ICONS.settings)}</a>
      </header>

      ${items.length ? `
        <section class="stats">
          <div class="stat glass"><span class="stat-num" data-count="${items.length}" data-digits="0">0</span><span class="stat-lbl">${items.length === 1 ? 'Bathhouse' : 'Bathhouses'}</span></div>
          <div class="stat glass"><span class="stat-num" data-count="${avg ?? ''}">–</span><span class="stat-lbl">Average</span></div>
          <div class="stat glass"><span class="stat-num" data-count="${scored.length ? scored.reduce((m, i) => Math.max(m, i.s.total), 0) : ''}">–</span><span class="stat-lbl">Best</span></div>
        </section>
        <div class="list-head">
          <h2 class="section-title">Your bathhouses</h2>
          <div class="seg" role="tablist" aria-label="Sort by">
            ${['score', 'recent', 'name'].map((k) => `
              <button role="tab" class="${state.sort === k ? 'on' : ''}" aria-selected="${state.sort === k}" data-sort="${k}">${{ score: 'Score', recent: 'Recent', name: 'A–Z' }[k]}</button>`).join('')}
          </div>
        </div>
        <div class="b-list">${cards}</div>
        <a class="fab" href="#/new">${icon(UI_ICONS.plus)}<span>Rate a bathhouse</span></a>
      ` : empty}
    `, 'view-list');

    $$('[data-sort]', app).forEach((b) => b.addEventListener('click', () => {
      state.sort = b.dataset.sort;
      persist();
      renderList();
    }));
  }

  function logoSvg() {
    return `<svg viewBox="0 0 40 40" fill="none" stroke-linecap="round" stroke-linejoin="round">
      <path d="M20 5c-5 7-9 11.5-9 16.5a9 9 0 0 0 18 0C29 16.5 25 12 20 5z" fill="url(#waterGrad)" stroke="none"/>
      <path d="M15.5 22.5c1.2 0 1.2-1 2.3-1s1.2 1 2.2 1 1.2-1 2.3-1 1.2 1 2.2 1" stroke="#fff" stroke-width="1.5" opacity=".85"/>
      <path d="M16 26.5c1.2 0 1.2-1 2.3-1s1.2 1 2.2 1 1.2-1 2.3-1" stroke="#fff" stroke-width="1.5" opacity=".55"/>
    </svg>`;
  }

  // ----- Detail -------------------------------------------------------------

  function renderDetail(id) {
    const r = findRating(id);
    if (!r) { location.hash = '#/'; return; }
    const s = compute(r);

    const rows = CATEGORIES.map((c, i) => {
      const e = r.scores[c.id];
      const share = !e.na && e.score != null && s.weightSum > 0 ? (e.weight / s.weightSum) * 100 : 0;
      return `
        <div class="bd-row ${e.na ? 'is-na' : ''} ${e.score == null && !e.na ? 'is-unrated' : ''}" style="--i:${i}">
          <span class="cat-icon">${icon(ICONS[c.id])}</span>
          <div class="bd-main">
            <div class="bd-top">
              <span class="bd-label">${c.label}</span>
              <span class="bd-score">${e.na ? 'Not offered' : e.score == null ? 'Not rated' : `<b>${fmt(e.score, 0)}</b>/10`}</span>
            </div>
            <div class="bar"><i style="--w:${e.na || e.score == null ? 0 : e.score * 10}%"></i></div>
            ${e.na ? '' : `<div class="bd-sub"><span>Weight ${fmtWeight(e.weight)}</span>${share ? `<span>${Math.round(share)}% of base</span>` : ''}</div>`}
          </div>
        </div>`;
    }).join('');

    const adjs = r.adjustments.length ? `
      <h2 class="section-title">Bonus &amp; minus</h2>
      <section class="glass card adj-summary">
        ${r.adjustments.map((a) => `
          <div class="adj-line">
            <span>${esc(a.label) || 'Untitled'}</span>
            <b class="${a.points > 0 ? 'pos' : a.points < 0 ? 'neg' : ''}">${fmtSigned(a.points)}</b>
          </div>`).join('')}
      </section>` : '';

    mount(`
      <header class="topbar">
        <a class="icon-btn" href="#/" aria-label="Back">${icon(UI_ICONS.back)}</a>
        <span class="topbar-title"></span>
        <a class="icon-btn" href="#/b/${esc(r.id)}/edit" aria-label="Edit">${icon(UI_ICONS.edit)}</a>
      </header>

      <section class="detail-hero glass">
        <div class="ring-wrap lg">
          ${ring(s.total, 168, 10)}
          <div class="ring-center">
            <span class="ring-num big" data-count="${s.total ?? ''}">–</span>
            <span class="ring-of">out of 10</span>
          </div>
        </div>
        <h1>${esc(r.name) || 'Untitled bathhouse'}</h1>
        <p class="meta center">
          ${r.location ? `<span>${icon(UI_ICONS.pin)}${esc(r.location)}</span>` : ''}
          ${r.date ? `<span>${icon(UI_ICONS.calendar)}${esc(fmtDate(r.date))}</span>` : ''}
        </p>
        <span class="tier lg">${tierFor(s.total)}</span>
        <div class="formula">
          <div><span>Weighted base</span><b>${fmt(s.base, 2)}</b></div>
          <div><span>Bonus / minus</span><b class="${s.adj > 0 ? 'pos' : s.adj < 0 ? 'neg' : ''}">${fmtSigned(s.adj)}</b></div>
          <div><span>Rated</span><b>${s.rated}/${s.offered}</b></div>
        </div>
      </section>

      <h2 class="section-title">Breakdown</h2>
      <section class="glass card breakdown">${rows}</section>

      ${adjs}

      ${r.notes ? `<h2 class="section-title">Notes</h2><section class="glass card notes">${esc(r.notes).replace(/\n/g, '<br>')}</section>` : ''}

      <div class="bottom-actions">
        <button class="btn btn-ghost danger" data-action="delete">${icon(UI_ICONS.trash)}Delete</button>
        <a class="btn btn-primary" href="#/b/${esc(r.id)}/edit">${icon(UI_ICONS.edit)}Edit rating</a>
      </div>
    `, 'view-detail');

    $('[data-action="delete"]', app).addEventListener('click', () => {
      if (!confirm(`Delete “${r.name || 'Untitled bathhouse'}”? This cannot be undone.`)) return;
      state.ratings = state.ratings.filter((x) => x.id !== r.id);
      persist();
      toast('Rating deleted');
      location.hash = '#/';
    });
  }

  // ----- Editor -------------------------------------------------------------

  function renderEditor(id) {
    if (id) {
      const r = findRating(id);
      if (!r) { location.hash = '#/'; return; }
      draft = normaliseRating(JSON.parse(JSON.stringify(r)));
      draftIsNew = false;
    } else {
      draft = newRating();
      draftIsNew = true;
    }
    draftDirty = false;

    const s = compute(draft);
    const cats = CATEGORIES.map((c, i) => catCard(c, draft.scores[c.id], i)).join('');

    mount(`
      <header class="topbar">
        <button class="icon-btn" data-action="back" aria-label="Back">${icon(UI_ICONS.back)}</button>
        <span class="topbar-title">${draftIsNew ? 'New rating' : 'Edit rating'}</span>
        <button class="btn btn-primary btn-sm" data-action="save">Save</button>
      </header>

      <section class="summary glass" id="summary">
        <div class="ring-wrap md">
          ${ring(s.total, 76, 7)}
          <span class="ring-num" id="sum-total" data-count="${s.total ?? ''}">–</span>
        </div>
        <div class="summary-body">
          <span class="tier" id="sum-tier">${tierFor(s.total)}</span>
          <div class="summary-meta">
            <span>Base <b id="sum-base">${fmt(s.base, 2)}</b></span>
            <span>Bonus <b id="sum-adj">${fmtSigned(s.adj)}</b></span>
            <span><b id="sum-rated">${s.rated}/${s.offered}</b> rated</span>
          </div>
          <div class="progress"><i id="sum-progress" style="--w:${s.offered ? (s.rated / s.offered) * 100 : 0}%"></i></div>
        </div>
      </section>

      <section class="glass card details">
        <label class="field">
          <span>Bathhouse</span>
          <input name="name" type="text" autocomplete="off" placeholder="e.g. Cedar Springs Bathhouse" value="${esc(draft.name)}" required>
        </label>
        <div class="field-row">
          <label class="field">
            <span>Location</span>
            <input name="location" type="text" autocomplete="off" placeholder="City or area" value="${esc(draft.location)}">
          </label>
          <label class="field">
            <span>Visited</span>
            <input name="date" type="date" value="${esc(draft.date)}">
          </label>
        </div>
      </section>

      <div class="section-head">
        <h2 class="section-title">Categories</h2>
        <span class="section-hint">Slide or tap to score 0–10 · set a weight per category</span>
      </div>
      <div class="cats">${cats}</div>

      <div class="section-head">
        <h2 class="section-title">Bonus &amp; minus points</h2>
        <span class="section-hint">Added to the weighted score (final score stays within 0–10)</span>
      </div>
      <section class="glass card adjustments">
        <div class="adj-list" id="adj-list">${draft.adjustments.map(adjRow).join('')}</div>
        <p class="adj-empty" ${draft.adjustments.length ? 'hidden' : ''}>Nothing yet — add your own or pick a suggestion.</p>
        <div class="chips">
          ${ADJ_PRESETS.map((p, i) => `<button class="chip ${p.points > 0 ? 'pos' : 'neg'}" data-preset="${i}">${fmtSigned(p.points)} ${esc(p.label)}</button>`).join('')}
        </div>
        <button class="btn btn-soft" data-action="adj-add">${icon(UI_ICONS.plus)}Add custom bonus or minus</button>
      </section>

      <h2 class="section-title">Notes</h2>
      <section class="glass card">
        <textarea name="notes" rows="4" placeholder="Anything worth remembering — the view, the silence, the best Aufguss…">${esc(draft.notes)}</textarea>
      </section>

      <div class="bottom-actions">
        ${draftIsNew ? '<span></span>' : `<button class="btn btn-ghost danger" data-action="delete">${icon(UI_ICONS.trash)}Delete</button>`}
        <button class="btn btn-primary" data-action="save">Save rating</button>
      </div>
    `, 'view-editor');

    bindEditor();
  }

  function catCard(c, e, i) {
    const f = e.score == null ? 0.5 : e.score / 10;
    return `
      <article class="cat glass ${e.score == null ? 'unrated' : ''} ${e.na ? 'na' : ''}" data-cat="${c.id}" style="--i:${i}">
        <div class="cat-head">
          <span class="cat-icon">${icon(ICONS[c.id])}</span>
          <div class="cat-title">
            <h3>${c.label}</h3>
            <p>${c.hint}</p>
          </div>
          <output class="cat-score" aria-live="off"><span class="v">${e.score == null ? '–' : e.score}</span><small>/10</small></output>
        </div>
        <div class="collapse"><div class="collapse-inner">
          <div class="slider" style="--f:${f}">
            <input class="range" type="range" min="0" max="10" step="1" value="${e.score ?? 5}"
              aria-label="${esc(c.label)} score" aria-valuetext="${e.score == null ? 'Not rated' : e.score + ' out of 10'}">
            <span class="ripples" aria-hidden="true"></span>
          </div>
          <div class="ticks" aria-hidden="true">
            ${Array.from({ length: 11 }, (_, n) => `<button tabindex="-1" data-tick="${n}" class="${e.score === n ? 'on' : ''}">${n}</button>`).join('')}
          </div>
        </div></div>
        <div class="cat-foot">
          <div class="weight" role="group" aria-label="${esc(c.label)} weight">
            <span class="lbl">Weight</span>
            <button class="step" data-action="w-dec" aria-label="Decrease weight">${icon(UI_ICONS.minus)}</button>
            <span class="w-val">${fmtWeight(e.weight)}</span>
            <button class="step" data-action="w-inc" aria-label="Increase weight">${icon(UI_ICONS.plus)}</button>
            <span class="share" title="Share of the weighted score"></span>
          </div>
          <label class="toggle">
            <input type="checkbox" data-action="na" ${e.na ? 'checked' : ''}>
            <span class="switch" aria-hidden="true"></span>
            <span>Not offered</span>
          </label>
        </div>
      </article>`;
  }

  function adjRow(a) {
    const cls = a.points > 0 ? 'pos' : a.points < 0 ? 'neg' : 'zero';
    return `
      <div class="adj ${cls}" data-adj="${esc(a.id)}">
        <span class="adj-dot" aria-hidden="true">${icon(UI_ICONS.sparkle)}</span>
        <input class="adj-label" type="text" placeholder="What stood out?" value="${esc(a.label)}" aria-label="Bonus or minus description">
        <div class="stepper">
          <button class="step" data-action="adj-dec" aria-label="Fewer points">${icon(UI_ICONS.minus)}</button>
          <span class="adj-val">${fmtSigned(a.points)}</span>
          <button class="step" data-action="adj-inc" aria-label="More points">${icon(UI_ICONS.plus)}</button>
        </div>
        <button class="icon-btn sm" data-action="adj-del" aria-label="Remove">${icon(UI_ICONS.close)}</button>
      </div>`;
  }

  function bindEditor() {
    const markDirty = () => { draftDirty = true; };

    // Text fields
    $$('input[name], textarea[name]', app).forEach((el) => {
      el.addEventListener('input', () => {
        draft[el.name] = el.value;
        if (el.name === 'name') el.closest('.field').classList.remove('invalid');
        markDirty();
      });
    });

    // Category cards
    $$('.cat', app).forEach((card) => {
      const id = card.dataset.cat;
      const range = $('.range', card);

      const setScore = (v, fromTick = false) => {
        const e = draft.scores[id];
        const changed = e.score !== v;
        e.score = v;
        range.value = v;
        markDirty();
        if (changed) { tick(); ripple(card); replay($('.cat-score', card), 'bump'); }
        if (fromTick) replay(card.querySelector(`[data-tick="${v}"]`), 'pop');
        updateCat(card);
        updateSummary();
      };

      range.addEventListener('input', () => setScore(Number(range.value)));
      // Clicking the thumb of an unrated slider without moving it still counts as a rating
      range.addEventListener('pointerup', () => { if (draft.scores[id].score == null) setScore(Number(range.value)); });
      range.addEventListener('keydown', (ev) => {
        if (draft.scores[id].score == null && (ev.key === 'Enter' || ev.key === ' ')) { ev.preventDefault(); setScore(Number(range.value)); }
      });

      $$('[data-tick]', card).forEach((t) => t.addEventListener('click', () => setScore(Number(t.dataset.tick), true)));

      const stepWeight = (dir) => {
        const e = draft.scores[id];
        e.weight = clamp(round(e.weight + dir * WEIGHT_STEP, WEIGHT_STEP), WEIGHT_MIN, WEIGHT_MAX);
        markDirty();
        replay($('.w-val', card), 'bump');
        updateAllCats();
        updateSummary();
      };
      $('[data-action="w-dec"]', card).addEventListener('click', () => stepWeight(-1));
      $('[data-action="w-inc"]', card).addEventListener('click', () => stepWeight(1));

      $('[data-action="na"]', card).addEventListener('change', (ev) => {
        draft.scores[id].na = ev.target.checked;
        markDirty();
        updateAllCats();
        updateSummary();
      });
    });

    // Adjustments
    const list = $('#adj-list', app);
    const refreshAdjEmpty = () => { $('.adj-empty', app).hidden = draft.adjustments.length > 0; };

    const addAdj = (label, points) => {
      const a = { id: uid(), label, points };
      draft.adjustments.push(a);
      list.insertAdjacentHTML('beforeend', adjRow(a));
      const row = list.lastElementChild;
      replay(row, 'enter');
      refreshAdjEmpty();
      markDirty();
      updateSummary();
      return row;
    };

    $('[data-action="adj-add"]', app).addEventListener('click', () => {
      const row = addAdj('', 1);
      $('.adj-label', row).focus();
    });

    $$('[data-preset]', app).forEach((chip) => chip.addEventListener('click', () => {
      const p = ADJ_PRESETS[Number(chip.dataset.preset)];
      addAdj(p.label, p.points);
      replay(chip, 'pop');
    }));

    list.addEventListener('input', (ev) => {
      const row = ev.target.closest('.adj');
      if (!row || !ev.target.classList.contains('adj-label')) return;
      draft.adjustments.find((a) => a.id === row.dataset.adj).label = ev.target.value;
      markDirty();
    });

    list.addEventListener('click', (ev) => {
      const btn = ev.target.closest('[data-action]');
      const row = ev.target.closest('.adj');
      if (!btn || !row) return;
      const a = draft.adjustments.find((x) => x.id === row.dataset.adj);
      if (btn.dataset.action === 'adj-del') {
        draft.adjustments = draft.adjustments.filter((x) => x !== a);
        row.classList.add('leave');
        const done = () => { row.remove(); refreshAdjEmpty(); };
        if (reduceMotion) done(); else row.addEventListener('animationend', done, { once: true });
      } else {
        const dir = btn.dataset.action === 'adj-inc' ? 1 : -1;
        a.points = clamp(round(a.points + dir * ADJ_STEP, ADJ_STEP), ADJ_MIN, ADJ_MAX);
        row.className = 'adj ' + (a.points > 0 ? 'pos' : a.points < 0 ? 'neg' : 'zero');
        $('.adj-val', row).textContent = fmtSigned(a.points);
        replay($('.adj-val', row), 'bump');
        tick();
      }
      markDirty();
      updateSummary();
    });

    // Actions
    $$('[data-action="save"]', app).forEach((b) => b.addEventListener('click', saveDraft));
    $('[data-action="back"]', app).addEventListener('click', leaveEditor);
    const del = $('[data-action="delete"]', app);
    if (del) del.addEventListener('click', () => {
      if (!confirm(`Delete “${draft.name || 'Untitled bathhouse'}”? This cannot be undone.`)) return;
      state.ratings = state.ratings.filter((x) => x.id !== draft.id);
      persist();
      draftDirty = false;
      toast('Rating deleted');
      location.hash = '#/';
    });

    updateAllCats();
  }

  function ripple(card) {
    if (reduceMotion) return;
    const layer = $('.ripples', card);
    const drop = document.createElement('i');
    layer.appendChild(drop);
    drop.addEventListener('animationend', () => drop.remove(), { once: true });
  }

  function updateCat(card) {
    const id = card.dataset.cat;
    const e = draft.scores[id];
    const range = $('.range', card);
    card.classList.toggle('unrated', e.score == null);
    card.classList.toggle('na', e.na);
    $('.slider', card).style.setProperty('--f', e.score == null ? 0.5 : e.score / 10);
    $('.cat-score .v', card).textContent = e.na ? '—' : e.score == null ? '–' : e.score;
    $('.w-val', card).textContent = fmtWeight(e.weight);
    range.disabled = e.na;
    range.setAttribute('aria-valuetext', e.score == null ? 'Not rated' : `${e.score} out of 10`);
    $$('[data-tick]', card).forEach((t) => t.classList.toggle('on', Number(t.dataset.tick) === e.score));
    $('[data-action="w-dec"]', card).disabled = e.weight <= WEIGHT_MIN;
    $('[data-action="w-inc"]', card).disabled = e.weight >= WEIGHT_MAX;
  }

  function updateAllCats() {
    $$('.cat', app).forEach(updateCat);
    updateShares();
  }

  /** Each category's share of the weight among offered categories. */
  function updateShares() {
    const s = compute(draft);
    $$('.cat', app).forEach((card) => {
      const e = draft.scores[card.dataset.cat];
      const share = !e.na && s.offeredWeight > 0 ? Math.round((e.weight / s.offeredWeight) * 100) : 0;
      $('.share', card).textContent = e.na ? '' : `${share}%`;
    });
  }

  function updateSummary() {
    const s = compute(draft);
    const sum = $('#summary', app);
    setRing($('.ring', sum), s.total);
    animateNumber($('#sum-total', app), s.total);
    const tierEl = $('#sum-tier', app);
    const tier = tierFor(s.total);
    if (tierEl.textContent !== tier) { tierEl.textContent = tier; replay(tierEl, 'pop'); }
    $('#sum-base', app).textContent = fmt(s.base, 2);
    const adjEl = $('#sum-adj', app);
    adjEl.textContent = fmtSigned(s.adj);
    adjEl.className = s.adj > 0 ? 'pos' : s.adj < 0 ? 'neg' : '';
    $('#sum-rated', app).textContent = `${s.rated}/${s.offered}`;
    $('#sum-progress', app).style.setProperty('--w', `${s.offered ? (s.rated / s.offered) * 100 : 0}%`);
  }

  function saveDraft() {
    if (!draft.name.trim()) {
      const field = $('input[name="name"]', app).closest('.field');
      field.classList.add('invalid');
      replay(field, 'shake');
      field.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
      $('input', field).focus({ preventScroll: true });
      toast('Give the bathhouse a name first');
      return;
    }
    draft.name = draft.name.trim();
    draft.location = draft.location.trim();
    draft.updatedAt = Date.now();
    const idx = state.ratings.findIndex((r) => r.id === draft.id);
    if (idx >= 0) state.ratings[idx] = draft; else state.ratings.push(draft);
    persist();
    draftDirty = false;
    toast(draftIsNew ? 'Rating saved' : 'Changes saved');
    location.hash = `#/b/${draft.id}`;
  }

  function leaveEditor() {
    if (draftDirty && !confirm('Discard unsaved changes?')) return;
    draftDirty = false;
    location.hash = draftIsNew ? '#/' : `#/b/${draft.id}`;
  }

  // ----- Settings -----------------------------------------------------------

  function renderSettings() {
    const w = state.defaults.weights;
    const total = CATEGORIES.reduce((a, c) => a + w[c.id], 0);

    mount(`
      <header class="topbar">
        <a class="icon-btn" href="#/" aria-label="Back">${icon(UI_ICONS.back)}</a>
        <span class="topbar-title">Settings</span>
        <span class="icon-btn ghost"></span>
      </header>

      <div class="section-head">
        <h2 class="section-title">Default weights</h2>
        <span class="section-hint">Used for every new rating — you can still fine-tune weights per bathhouse</span>
      </div>
      <section class="glass card weights">
        ${CATEGORIES.map((c) => `
          <div class="w-row" data-cat="${c.id}">
            <span class="cat-icon">${icon(ICONS[c.id])}</span>
            <span class="w-label">${c.label}</span>
            <div class="weight">
              <button class="step" data-action="w-dec" aria-label="Decrease ${esc(c.label)} weight" ${w[c.id] <= WEIGHT_MIN ? 'disabled' : ''}>${icon(UI_ICONS.minus)}</button>
              <span class="w-val">${fmtWeight(w[c.id])}</span>
              <button class="step" data-action="w-inc" aria-label="Increase ${esc(c.label)} weight" ${w[c.id] >= WEIGHT_MAX ? 'disabled' : ''}>${icon(UI_ICONS.plus)}</button>
              <span class="share">${total ? Math.round((w[c.id] / total) * 100) : 0}%</span>
            </div>
          </div>`).join('')}
        <button class="btn btn-soft" data-action="w-reset">Reset all to ×1.0</button>
      </section>

      <h2 class="section-title">How the score works</h2>
      <section class="glass card explainer">
        <p><b>Weighted base</b> = Σ (score × weight) ÷ Σ weight, across every category you scored. Categories marked <i>Not offered</i> are left out, so a bathhouse without a steam room isn’t penalised.</p>
        <p><b>Final score</b> = weighted base + bonus/minus points, kept between 0 and 10.</p>
      </section>

      <h2 class="section-title">Your data</h2>
      <section class="glass card data">
        <p class="muted">Ratings are stored privately on this device. Export a backup to move them to another device.</p>
        <div class="btn-row">
          <button class="btn btn-soft" data-action="export">${icon(UI_ICONS.download)}Export</button>
          <label class="btn btn-soft">${icon(UI_ICONS.upload)}Import<input type="file" accept="application/json,.json" data-action="import" hidden></label>
        </div>
        <button class="btn btn-ghost danger" data-action="wipe">${icon(UI_ICONS.trash)}Delete all ratings</button>
      </section>
    `, 'view-settings');

    $$('.w-row', app).forEach((row) => {
      const id = row.dataset.cat;
      const stepW = (dir) => {
        w[id] = clamp(round(w[id] + dir * WEIGHT_STEP, WEIGHT_STEP), WEIGHT_MIN, WEIGHT_MAX);
        persist();
        refreshWeights();
        replay($('.w-val', row), 'bump');
      };
      $('[data-action="w-dec"]', row).addEventListener('click', () => stepW(-1));
      $('[data-action="w-inc"]', row).addEventListener('click', () => stepW(1));
    });

    const refreshWeights = () => {
      const t = CATEGORIES.reduce((a, c) => a + w[c.id], 0);
      $$('.w-row', app).forEach((row) => {
        const id = row.dataset.cat;
        $('.w-val', row).textContent = fmtWeight(w[id]);
        $('.share', row).textContent = `${t ? Math.round((w[id] / t) * 100) : 0}%`;
        $('[data-action="w-dec"]', row).disabled = w[id] <= WEIGHT_MIN;
        $('[data-action="w-inc"]', row).disabled = w[id] >= WEIGHT_MAX;
      });
    };

    $('[data-action="w-reset"]', app).addEventListener('click', () => {
      state.defaults.weights = defaultWeights();
      persist();
      renderSettings();
      toast('Default weights reset');
    });

    $('[data-action="export"]', app).addEventListener('click', () => {
      const blob = new Blob([JSON.stringify({ app: 'hotandcold', version: 1, exportedAt: new Date().toISOString(), ...state }, null, 2)], { type: 'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `hotandcold-backup-${todayLocal()}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    });

    $('[data-action="import"]', app).addEventListener('change', async (ev) => {
      const file = ev.target.files[0];
      if (!file) return;
      try {
        const data = JSON.parse(await file.text());
        const incoming = (Array.isArray(data.ratings) ? data.ratings : []).map(normaliseRating);
        const byId = new Map(state.ratings.map((r) => [r.id, r]));
        incoming.forEach((r) => byId.set(r.id, r));
        state.ratings = Array.from(byId.values());
        if (data.defaults && data.defaults.weights) state.defaults.weights = { ...defaultWeights(), ...data.defaults.weights };
        persist();
        toast(`Imported ${incoming.length} rating${incoming.length === 1 ? '' : 's'}`);
        renderSettings();
      } catch (_) {
        toast('That file could not be read');
      }
    });

    $('[data-action="wipe"]', app).addEventListener('click', () => {
      if (!state.ratings.length) { toast('Nothing to delete'); return; }
      if (!confirm('Delete all ratings from this device? Consider exporting a backup first.')) return;
      state.ratings = [];
      persist();
      toast('All ratings deleted');
    });
  }

  // ---------------------------------------------------------------------------
  // Router
  // ---------------------------------------------------------------------------

  function route() {
    const parts = location.hash.replace(/^#\/?/, '').split('/').filter(Boolean);
    if (parts[0] === 'new') return renderEditor(null);
    if (parts[0] === 'settings') return renderSettings();
    if (parts[0] === 'b' && parts[1] && parts[2] === 'edit') return renderEditor(parts[1]);
    if (parts[0] === 'b' && parts[1]) return renderDetail(parts[1]);
    return renderList();
  }

  window.addEventListener('hashchange', route);
  window.addEventListener('beforeunload', (ev) => {
    if (draftDirty && app.classList.contains('view-editor')) { ev.preventDefault(); ev.returnValue = ''; }
  });

  route();

  if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol)) {
    window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
  }
})();
