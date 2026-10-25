// Reusable presentational pieces. Every visual decision lives in CSS tokens;
// these helpers only choose structure, optionally by family composition flag.
(function () {
  const { icon } = window.E;
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  const act = (name, arg) => `data-action="${name}"${arg !== undefined ? ` data-arg="${esc(arg)}"` : ''} data-fk="${name}:${esc(arg ?? '')}"`;

  function navBar(ctx, title, opts = {}) {
    const left = opts.back
      ? `<button class="nav-back" ${act('back')} aria-label="${esc(ctx.t('back'))}">${icon('chevronLeft')}<span>${esc(opts.backLabel || ctx.t('back'))}</span></button>`
      : opts.left || '<span></span>';
    return `<header class="navbar">
      <div class="navbar-side">${left}</div>
      <h1 class="navbar-title" tabindex="-1" data-screen-heading>${esc(title)}</h1>
      <div class="navbar-side navbar-right">${opts.right || ''}</div>
    </header>`;
  }

  function largeTitle(ctx, title, extra = '') {
    return `<header class="large-title-bar"><h1 class="large-title" tabindex="-1" data-screen-heading>${esc(title)}</h1>${extra}</header>`;
  }

  function sheetBar(ctx, title, opts = {}) {
    return `<header class="sheet-bar">
      <div class="navbar-side">${opts.left ?? `<button class="link-button" ${act('closeSheet')}>${esc(ctx.t('close'))}</button>`}</div>
      <h2 class="navbar-title" id="sheet-title" tabindex="-1" data-screen-heading>${esc(title)}</h2>
      <div class="navbar-side navbar-right">${opts.right || ''}</div>
    </header>`;
  }

  const card = (inner, cls = '', attrs = '') => `<section class="card ${cls}" ${attrs}>${inner}</section>`;

  function kv(rows, cls = '') {
    return `<dl class="kv ${cls}">${rows.filter(Boolean).map((r) => r === '---'
      ? '<div class="kv-rule" role="presentation"></div>'
      : `<div class="kv-row ${r.cls || ''}"><dt>${r.k}</dt><dd>${r.v}</dd></div>`).join('')}</dl>`;
  }

  function button(label, action, arg, opts = {}) {
    const kind = opts.kind || 'primary';
    const dis = opts.disabled ? ' disabled aria-disabled="true"' : '';
    return `<button class="btn btn-${kind} ${opts.cls || ''}" ${act(action, arg)}${dis}>${opts.icon ? icon(opts.icon) : ''}<span>${esc(label)}</span></button>`;
  }

  function row(ctx, { title, sub, value, iconName, iconCls = '', action, arg, chevron = true, cls = '', trailing = '' }) {
    const tag = action ? 'button' : 'div';
    const a = action ? act(action, arg) : '';
    return `<${tag} class="row ${cls}" ${a}>
      ${iconName ? `<span class="row-icon ${iconCls}">${icon(iconName)}</span>` : ''}
      <span class="row-main"><span class="row-title">${title}</span>${sub ? `<span class="row-sub">${sub}</span>` : ''}</span>
      ${value !== undefined ? `<span class="row-value">${value}</span>` : ''}
      ${trailing}
      ${action && chevron ? `<span class="row-chevron">${icon('chevronRight')}</span>` : ''}
    </${tag}>`;
  }

  function toggle(label, on, arg, desc) {
    const id = `sw-${arg}`;
    return `<div class="toggle-row">
      <span class="toggle-label" id="${id}">${label}</span>
      <button class="switch" role="switch" aria-checked="${on}" aria-labelledby="${id}" ${act('toggle', arg)}><span class="switch-knob"></span></button>
    </div>${desc || ''}`;
  }

  function moneyField(ctx, key, { label, placeholder = '0.00', error, describedBy, value }) {
    const v = value ?? ctx.ui.f[key] ?? '';
    const errId = `err-${key}`;
    const desc = [error ? errId : '', describedBy || ''].filter(Boolean).join(' ');
    return `<div class="field ${error ? 'has-error' : ''}">
      ${label ? `<label class="field-label" for="in-${key}">${label}</label>` : ''}
      <div class="field-row"><span class="field-prefix" aria-hidden="true">$</span>
        <input class="input" id="in-${key}" data-field="${key}" data-fk="field:${key}" inputmode="decimal" autocomplete="off"
          placeholder="${esc(placeholder)}" value="${esc(v)}" ${error ? 'aria-invalid="true"' : ''} ${desc ? `aria-describedby="${desc}"` : ''}>
      </div>
      ${error ? `<p class="field-error" id="${errId}" role="alert">${error}</p>` : ''}
    </div>`;
  }

  function textField(ctx, key, { label, placeholder = '' }) {
    const v = ctx.ui.f[key] ?? '';
    return `<div class="field">
      ${label ? `<label class="field-label" for="in-${key}">${label}</label>` : `<label class="sr-only" for="in-${key}">${esc(placeholder)}</label>`}
      <input class="input" id="in-${key}" data-field="${key}" data-fk="field:${key}" autocomplete="off" placeholder="${esc(placeholder)}" value="${esc(v)}">
    </div>`;
  }

  function segmented(options, selected, action, opts = {}) {
    return `<div class="segmented ${opts.cls || ''}" role="tablist" aria-label="${esc(opts.label || '')}">
      ${options.map(([id, label]) => `<button role="tab" class="seg ${id === selected ? 'is-selected' : ''}" aria-selected="${id === selected}" ${act(action, id)}>${esc(label)}</button>`).join('')}
    </div>`;
  }

  function chip(text, kind = '') {
    return `<span class="chip ${kind ? 'chip-' + kind : ''}">${text}</span>`;
  }

  function platformBadge(platformId) {
    const p = window.E.PLATFORMS[platformId];
    return `<span class="platform-badge" style="color: var(--color-${p.color})">${icon(p.icon)}</span>`;
  }

  function hourBucket(hhmm) {
    const h = Number(hhmm.split(':')[0]);
    if (h >= 4 && h < 7) return 1;
    if (h >= 7 && h < 11) return 2;
    if (h >= 11 && h < 14) return 3;
    if (h >= 14 && h < 17) return 4;
    if (h >= 17 && h < 20) return 5;
    return 6;
  }

  // Fictional map: invented coastline, roads and labels. No real geography.
  const ROUTES = [
    { counted: [[70, 150], [120, 132], [175, 118], [230, 96], [282, 70]], dashed: [] },
    { counted: [[64, 120], [96, 112]], counted2: [[246, 104], [284, 92]], dashed: [[96, 112], [170, 106], [246, 104]] },
    { counted: [[90, 160], [130, 140], [150, 110]], dashed: [[150, 110], [176, 92]] },
    { counted: [[160, 120], [163, 118]], dashed: [] },
    { counted: [[60, 70], [110, 90], [150, 130], [210, 150]], dashed: [] },
    { counted: [[40, 170], [90, 150], [140, 150], [190, 120], [250, 110], [300, 60]], dashed: [] },
    { counted: [[60, 60], [120, 70], [170, 100], [200, 150]], dashed: [] },
    { counted: [[50, 110], [100, 100], [160, 70], [230, 80], [290, 130]], dashed: [] },
    { counted: [[80, 50], [100, 110], [160, 140], [250, 150]], dashed: [] },
    { counted: [[40, 150], [110, 120], [180, 128], [260, 84], [300, 50]], dashed: [] }
  ];
  const pts = (a) => a.map((p) => p.join(',')).join(' ');

  function map(ctx, routeIdx, opts = {}) {
    const r = ROUTES[routeIdx % ROUTES.length];
    const start = r.counted[0];
    const endSeg = r.counted2 || r.counted;
    const end = endSeg[endSeg.length - 1];
    const label = `${ctx.t('fictionalMap')}. ${ctx.t('mapLegendSolid')} / ${ctx.t('mapLegendDashed')}.`;
    return `<figure class="map ${opts.cls || ''}">
      <svg viewBox="0 0 340 200" role="img" aria-label="${esc(label)}" preserveAspectRatio="xMidYMid slice">
        <rect width="340" height="200" fill="var(--color-map-water)"/>
        <path d="M0 0H220C200 30 196 60 214 86C232 112 210 140 160 160C120 176 60 186 0 200Z" fill="var(--color-map-land)"/>
        <path d="M260 0H340V200H250C270 170 300 150 290 120C280 90 250 60 260 0Z" fill="var(--color-map-land)"/>
        <ellipse cx="236" cy="150" rx="26" ry="12" fill="var(--color-map-park)"/>
        <ellipse cx="70" cy="60" rx="30" ry="18" fill="var(--color-map-park)"/>
        <g stroke="var(--color-map-road)" stroke-width="5" fill="none" stroke-linecap="round" opacity="0.95">
          <path d="M0 120C60 112 140 108 340 98"/><path d="M40 0C50 60 60 130 70 200"/><path d="M130 0C134 50 140 110 150 170"/>
          <path d="M290 0C292 60 300 130 310 200"/><path d="M0 40C80 44 160 40 220 36"/>
        </g>
        <g fill="var(--color-text-muted)" font-size="10" font-family="var(--font-text)" opacity="0.8">
          <text x="226" y="40">Isla Palma</text><text x="20" y="186">Bahía Norte</text><text x="150" y="70">Av. Central</text>
        </g>
        ${r.dashed.length ? `<polyline points="${pts(r.dashed)}" fill="none" stroke="var(--color-map-route)" stroke-width="3" stroke-dasharray="5 5" stroke-linecap="round" opacity="0.8"/>` : ''}
        <polyline points="${pts(r.counted)}" fill="none" stroke="var(--color-map-route)" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
        ${r.counted2 ? `<polyline points="${pts(r.counted2)}" fill="none" stroke="var(--color-map-route)" stroke-width="4" stroke-linecap="round"/>` : ''}
        ${pin(start, 'var(--color-map-start)', ctx.t('start'))}
        ${pin(end, 'var(--color-map-end)', ctx.t('end'))}
      </svg>
      ${opts.legend ? `<figcaption class="map-legend">
        <span><svg width="22" height="6" aria-hidden="true"><line x1="1" y1="3" x2="21" y2="3" stroke="var(--color-map-route)" stroke-width="4" stroke-linecap="round"/></svg>${esc(ctx.t('mapLegendSolid'))}</span>
        <span><svg width="22" height="6" aria-hidden="true"><line x1="1" y1="3" x2="21" y2="3" stroke="var(--color-map-route)" stroke-width="3" stroke-dasharray="4 4"/></svg>${esc(ctx.t('mapLegendDashed'))}</span>
        <span class="map-fiction">${esc(ctx.t('fictionalMap'))}</span>
      </figcaption>` : `<figcaption class="map-legend"><span class="map-fiction">${esc(ctx.t('fictionalMap'))}</span></figcaption>`}
    </figure>`;
  }
  function pin([x, y], color, label) {
    return `<g transform="translate(${x},${y})"><path d="M0 0C-6 -8 -9 -12 -9 -16A9 9 0 0 1 9 -16C9 -12 6 -8 0 0Z" fill="${color}" stroke="#fff" stroke-width="1.5"/><circle cy="-16" r="3" fill="#fff"/>
      <text y="11" text-anchor="middle" font-size="9" font-weight="600" fill="var(--color-text)" font-family="var(--font-text)">${esc(label)}</text></g>`;
  }

  // Single-series weekly bar chart (V2). One hue, rounded data ends at the baseline,
  // per-bar hover/focus tooltip, direct label on the max only, table fallback.
  function weekChart(ctx, values) {
    const days = ['2026-10-18', '2026-10-19', '2026-10-20', '2026-10-21', '2026-10-22', '2026-10-23', '2026-10-24'];
    const max = Math.max(...values, 1);
    const maxIdx = values.indexOf(Math.max(...values));
    const bars = values.map((v, i) => {
      const h = v ? Math.max(4, (v / max) * 64) : 0;
      const tip = `${ctx.fmt.date(ctx.lang, days[i])}: ${ctx.fmt.miles(ctx.lang, v)} mi`;
      return `<div class="wc-col" tabindex="0" aria-label="${esc(tip)}" data-tip="${esc(tip)}">
        <span class="wc-val">${i === maxIdx && v ? ctx.fmt.miles(ctx.lang, v, 0) : ''}</span>
        <span class="wc-bar ${v ? '' : 'is-zero'}" style="height:${h}px"></span>
        <span class="wc-day">${esc(ctx.fmt.dayShort(ctx.lang, days[i]))}</span>
      </div>`;
    }).join('');
    const table = `<table class="sr-only"><caption>${esc(ctx.t('weekMiles'))}</caption><tbody>${values.map((v, i) => `<tr><th>${esc(ctx.fmt.date(ctx.lang, days[i]))}</th><td>${ctx.fmt.miles(ctx.lang, v)} mi</td></tr>`).join('')}</tbody></table>`;
    return `<figure class="week-chart"><figcaption class="wc-title">${esc(ctx.t('weekMiles'))}</figcaption><div class="wc-plot" aria-hidden="false">${bars}</div>${table}</figure>`;
  }

  // Decorative dial for V3's start button, painted with the hourProgress roles.
  function hourRing() {
    const segs = [1, 2, 3, 4, 5, 6].map((n, i) => {
      const a0 = (i / 6) * Math.PI * 2 - Math.PI / 2 + 0.06;
      const a1 = ((i + 1) / 6) * Math.PI * 2 - Math.PI / 2 - 0.06;
      const R = 96;
      const p = (a) => `${100 + R * Math.cos(a)} ${100 + R * Math.sin(a)}`;
      return `<path d="M${p(a0)}A${R} ${R} 0 0 1 ${p(a1)}" stroke="var(--color-hour${n})" stroke-width="6" fill="none" stroke-linecap="round"/>`;
    }).join('');
    return `<svg class="hour-ring" viewBox="0 0 200 200" aria-hidden="true">${segs}</svg>`;
  }

  window.E = window.E || {};
  Object.assign(window.E, { esc, act, navBar, largeTitle, sheetBar, card, kv, button, row, toggle, moneyField, textField, segmented, chip, platformBadge, hourBucket, map, weekChart, hourRing });
})();
