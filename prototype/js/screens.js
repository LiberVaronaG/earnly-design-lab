// Screens and sheets. Each returns { header, body, footer } (sheets: { html }).
// `ref` points at the capture a screen was rebuilt from; `approx` marks lab proposals.
(function () {
  const E = window.E;
  const { icon, esc, act, navBar, largeTitle, sheetBar, card, kv, button, row, toggle, moneyField, textField, segmented, chip, platformBadge, hourBucket } = E;

  const money = (ctx, n) => ctx.fmt.money(ctx.lang, n);
  const mi = (ctx, n, d = 1) => `${ctx.fmt.miles(ctx.lang, n, d)} mi`;
  const pname = (id) => E.PLATFORMS[id].name;
  const range = (ctx, s) => `${ctx.fmt.time(ctx.lang, s.start)} – ${ctx.fmt.time(ctx.lang, s.end)}`;
  const dur = (s) => E.fmt.duration(E.mins(s), true, s.secs || 0);
  const byDateDesc = (a, b) => (b.date + b.start).localeCompare(a.date + a.start);
  const mainAmount = (s) => (typeof s.main === 'number' ? s.main : 0) + s.extras.reduce((a, x) => a + x.amount, 0);

  // Amount parser shared by every money field: '' | number | NaN (invalid).
  function parseAmount(v) {
    if (v === undefined || v === null) return '';
    const s = String(v).trim().replace(',', '.');
    if (s === '') return '';
    if (!/^\d{1,6}(\.\d{0,2})?$/.test(s)) return NaN;
    const n = Number(s);
    return n > 99999.99 ? NaN : n;
  }
  E.parseAmount = parseAmount;

  // ---------- shared blocks ----------

  function payStatus(ctx) {
    const s = ctx.month;
    if (s.overflow) return { text: ctx.t('tooLarge'), partial: false };
    if (!s.n) return { text: ctx.t('noShiftsYet'), partial: false };
    if (!s.missing.length) return { text: ctx.t('allShiftsLogged', { n: s.n }), partial: false };
    let text = ctx.t('shiftsOfWithPay', { a: s.withAnyPay, n: s.n });
    // Card C wraps the two facts as whole pieces, so a narrow card never leaves «principal» alone on a line.
    const parts = s.extrasOnly ? [text + ' ·', ctx.t('missingMain', { m: s.extrasOnly })] : null;
    if (s.extrasOnly) text += ' · ' + ctx.t('missingMain', { m: s.extrasOnly });
    return { text, parts, partial: true };
  }

  function paidText(ctx) {
    const s = ctx.month;
    if (s.overflow || !s.withAnyPay) return '—';
    return money(ctx, s.paid);
  }

  function breakdownLines(ctx) {
    const s = ctx.month;
    const out = [];
    out.push({ k: ctx.t('paidLogged'), v: s.overflow || !s.withAnyPay ? '—' : money(ctx, s.paid) });
    // Notes keep their order; they are also split by what they explain (pay, gas, totals).
    const payNotes = [];
    if (s.extrasOnly) payNotes.push(ctx.t('extrasOnlyNote', { m: s.extrasOnly, n: s.n }));
    if (s.noPay) payNotes.push(ctx.t('noPayNote', { m: s.noPay, n: s.n }));
    const gasNotes = !ctx.data.gasKnown && s.n ? [ctx.t('gasUnknown')] : [];
    const sumNotes = s.overflow ? [ctx.t('tooLargeNote')] : [];
    const notes = [...payNotes, ...gasNotes, ...sumNotes];
    const gas = [];
    if (ctx.data.gasKnown && s.gas !== null && s.n && !s.overflow) {
      gas.push({ k: ctx.t('gasCostMonth'), v: money(ctx, -s.gas) });
      if (s.afterGas !== null) gas.push({ k: `<strong>${ctx.t('leftAfterGas')}</strong>`, v: `<strong>${money(ctx, s.afterGas)}</strong>` });
    }
    const platforms = Object.entries(s.byPlatform).map(([p, v]) => ({
      k: ctx.t(v.count === 1 ? 'blocks' : 'blocksPl', { p: pname(p), n: v.count }), v: money(ctx, v.amount)
    }));
    return { paid: out, notes, payNotes, gasNotes, sumNotes, gas, deduction: { k: ctx.t('deductionEstimate'), v: money(ctx, s.deduction), note: ctx.t('deductionNote') }, platforms };
  }

  function breakdownHtml(ctx, cls = '') {
    const b = breakdownLines(ctx);
    return `<div class="breakdown ${cls}">
      ${kv(b.paid)}
      ${b.notes.map((n) => `<p class="note">${esc(n)}</p>`).join('')}
      ${b.gas.length ? kv(b.gas) : ''}
      <div class="breakdown-sep"></div>
      ${kv([b.deduction])}<p class="note">${esc(b.deduction.note)}</p>
      ${b.platforms.length ? `<div class="breakdown-sep"></div>${kv(b.platforms)}` : ''}
    </div>`;
  }

  // «Propuesta» for the open C card: the same lines and conditions, grouped by meaning.
  // Pay and gas read as a small statement ending in the result; the tax estimate leaves
  // the money column so it is not read as one more step of the subtraction.
  function breakdownGrouped(ctx) {
    const b = breakdownLines(ctx);
    const notes = (list) => list.map((n) => `<p class="note">${esc(n)}</p>`).join('');
    const [gas, left] = b.gas;
    return `<div class="breakdown bdp">
      <div class="bdp-group">
        ${kv(b.paid)}
        ${b.payNotes.length ? `<div class="bdp-notes">${notes(b.payNotes)}</div>` : ''}
        ${notes(b.gasNotes)}
        ${gas ? kv([gas, left && { ...left, cls: 'bdp-result' }]) : ''}
        ${notes(b.sumNotes)}
      </div>
      <div class="bdp-group bdp-tax">
        <dl><dt>${esc(b.deduction.k)}</dt><dd>${b.deduction.v}</dd></dl>
        <p class="note">${esc(b.deduction.note)}</p>
      </div>
      ${b.platforms.length ? `<div class="bdp-group">${kv(b.platforms)}</div>` : ''}
    </div>`;
  }

  function seText(ctx) {
    const se = E.seIncome(ctx.data);
    if (ctx.data.seState === 'notEstimated' || ctx.month.overflow) return [ctx.t('seNotEstimated')];
    if (!se.a) return [ctx.t('seNoData')];
    if (se.net >= 400) return [ctx.t('seOverDemo')];
    return [ctx.t('seUnder'), se.a < se.n ? ctx.t('seBasedOn', { a: se.a, n: se.n }) : ctx.t('seBasedAll', { n: se.n })];
  }

  // Home notices in the app's order: Location, Personal blocked (only while Location is fine), Low Power Mode.
  function noticeList(d) {
    const out = [];
    if (d.permission === 'denied') out.push('denied');
    else if (d.permission !== 'always') out.push('always');
    if (d.autoPersonal && d.motionDenied && d.permission === 'always') out.push('motion');
    if (d.lowPower) out.push('low');
    return out;
  }
  // The proposals put first what stops the shift: Low Power Mode disables Start, and with Location off nothing is recorded.
  const SEVERITY = { low: 0, denied: 1, always: 2, motion: 3 };
  const bySeverity = (list) => [...list].sort((x, y) => SEVERITY[x] - SEVERITY[y]);
  // iOS has no link to Settings → Battery, so the Low Power Mode notice has no button (as in the app).
  const NOTICE = {
    always: { icon: 'locationOff', title: 'alwaysTitle', body: 'alwaysBody', short: 'alwaysShort', fix: true },
    denied: { icon: 'locationOff', title: 'nDeniedTitle', body: 'nDeniedBody', short: 'nDeniedShort', fix: true, blocks: true },
    motion: { icon: 'motion', title: 'nMotionTitle', body: 'nMotionBody', short: 'nMotionShort', fix: true },
    low: { icon: 'battery', title: 'nLowTitle', body: 'nLowBody', short: 'nLowShort', fix: false, blocks: true }
  };
  const fixButton = (ctx, k, cls) => `<button class="${cls}" ${act('toast', 'systemSettings')} aria-describedby="nt-${k}">${esc(ctx.t('openSettings'))}</button>`;

  // Today: one card per notice, stacked in the app's order. Only the Location ones open Settings.
  function noticeCards(ctx, list) {
    return list.map((k) => {
      const n = NOTICE[k];
      const inner = `<span class="notice-icon${k === 'motion' ? ' notice-icon-small' : ''}">${icon(n.icon)}</span>
        <span class="notice-main"><span class="notice-title">${esc(ctx.t(n.title))}</span><span class="notice-body">${esc(ctx.t(n.body))}</span></span>`;
      return n.fix ? `<button class="notice notice-card" ${act(k === 'motion' ? 'toast' : 'openTrackingSettings', k === 'motion' ? 'systemSettings' : undefined)}>${inner}<span class="row-chevron">${icon('chevronRight')}</span></button>`
        : `<div class="notice notice-card" role="group" aria-label="${esc(ctx.t(n.title))}">${inner}</div>`;
    }).join('');
  }

  // A · One box for every notice, worst first, each with its own explicit action.
  function noticeGroup(ctx, list) {
    const items = bySeverity(list);
    const head = items.length > 1 ? `<p class="nb-head">${icon('warning')}<span>${esc(ctx.t('nGroupHead', { n: items.length }))}</span></p>` : '';
    return `<section class="nb" aria-label="${esc(ctx.t('noticesLabel'))}">${head}${items.map((k) => {
      const n = NOTICE[k];
      return `<div class="nb-item${n.blocks ? ' nb-blocks' : ''}"><span class="nb-icon">${icon(n.icon)}</span>
        <div class="nb-text"><p class="nb-title" id="nt-${k}">${esc(ctx.t(n.title))}</p><p class="nb-body">${esc(ctx.t(n.body))}</p>${n.fix ? fixButton(ctx, k, 'link-button nb-action') : ''}</div></div>`;
    }).join('')}</section>`;
  }

  // B · What affects the shift sits under the circle it affects; Personal's own notice goes inside Personal.
  function startNote(ctx, list) {
    const items = bySeverity(list.filter((k) => k !== 'motion'));
    if (!items.length) return '';
    return `<div class="start-note" id="start-note">${items.map((k) => {
      const n = NOTICE[k];
      return `<div class="sn-item${n.blocks ? ' sn-blocks' : ''}"><p class="sn-title" id="nt-${k}">${icon(n.icon)}<span>${esc(ctx.t(n.title))}</span></p><p class="sn-body">${esc(ctx.t(n.short))}</p>${n.fix ? fixButton(ctx, k, 'link-button sn-action') : ''}</div>`;
    }).join('')}</div>`;
  }

  function personalBlock(ctx) {
    return `<div class="pv-live pv-block"><span class="pv-live-mark">${icon('motion')}</span>
      <span class="pv-live-text"><span class="pv-live-title" id="nt-motion">${esc(ctx.t('nMotionShortTitle'))}</span> <span class="pv-live-sub">${esc(ctx.t('nMotionShort'))}</span></span>
      ${fixButton(ctx, 'motion', 'pv-stop')}</div>`;
  }

  // C · Short rows at the very top; each opens its full explanation in a sheet.
  function noticeStrip(ctx, list) {
    const items = bySeverity(list);
    return `<div class="nc" role="group" aria-label="${esc(ctx.t('noticesLabel'))}">${items.map((k) => {
      const n = NOTICE[k];
      return `<button class="nc-row${n.blocks ? ' nc-blocks' : ''}" ${act('openNotice', k)}><span class="nc-icon">${icon(n.icon)}</span><span class="nc-title">${esc(ctx.t(n.title))}</span><span class="row-chevron">${icon('chevronRight')}</span></button>`;
    }).join('')}</div>`;
  }

  function noticeSheet(ctx) {
    const k = ctx.ui.noticeId;
    const n = NOTICE[k];
    return `${sheetBar(ctx, ctx.t(n.title), { left: `<button class="link-button" ${act('closeSheet')}>${esc(ctx.t('done'))}</button>` })}
      <div class="sheet-body"><div class="ns${n.blocks ? ' ns-blocks' : ''}"><span class="ns-icon">${icon(n.icon)}</span><p class="ns-body">${esc(ctx.t(n.body))}</p>
        ${n.fix ? button(ctx.t('openSettings'), 'toast', 'systemSettings') : ''}</div></div>`;
  }

  function noticeBlock(ctx) {
    if (ctx.famId === 'v0') {
      const list = noticeList(ctx.data);
      if (!list.length) return '';
      if (ctx.avisos === 'a') return noticeGroup(ctx, list);
      if (ctx.avisos === 'b' || ctx.avisos === 'c') return '';
      return noticeCards(ctx, list);
    }
    const perm = ctx.data.permission;
    if (perm === 'always') return '';
    const denied = perm === 'denied';
    const title = ctx.t(denied ? 'deniedTitle' : 'alwaysTitle');
    const body = ctx.t(denied ? 'deniedBody' : 'alwaysBody');
    const style = ctx.fam.notice;
    if (style === 'inline') {
      return `<button class="status-line" ${act('openTrackingSettings')}>
        <span class="status-dot" aria-hidden="true"></span>
        <span class="status-text">${esc(ctx.t(denied ? 'deniedInline' : 'alwaysInline'))}</span>
        <span class="status-action">${esc(denied ? ctx.t('openSettings') : ctx.t('alwaysInlineAction'))}</span>
      </button>`;
    }
    return `<button class="notice notice-${style}" ${act('openTrackingSettings')}>
      <span class="notice-icon">${icon('locationOff')}</span>
      <span class="notice-main"><span class="notice-title">${esc(title)}</span><span class="notice-body">${esc(body)}</span></span>
      <span class="row-chevron">${icon('chevronRight')}</span>
    </button>`;
  }

  function shiftRow(ctx, s, variant) {
    const status = s.main === null ? chip(s.extras.length ? ctx.t('partialChip') : ctx.t('noPayChip')) : s.main === 'overflow' ? chip('—') : '';
    const stripe = ctx.fam.hourStripe ? ` style="--stripe: var(--color-hour${hourBucket(s.start)})"` : '';
    if (variant === 'table') {
      const paid = s.main === 'overflow' ? '—' : s.main === null && !s.extras.length ? '—' : money(ctx, mainAmount(s));
      return `<button class="trow" ${act('openShift', s.id)}>
        <span class="tcell tcell-main">${platformBadge(s.platform)}<span><span class="tdate">${esc(ctx.fmt.date(ctx.lang, s.date, 'short'))}</span><span class="tsub">${esc(ctx.fmt.time(ctx.lang, s.start))}</span></span></span>
        <span class="tcell num">${ctx.fmt.miles(ctx.lang, s.miles)}</span>
        <span class="tcell num">${E.fmt.duration(E.mins(s), false)}</span>
        <span class="tcell num ${s.main === null ? 'is-missing' : ''}">${paid}</span>
      </button>`;
    }
    return `<button class="shift-row shift-row-${variant} ${ctx.fam.hourStripe ? 'has-stripe' : ''}" ${act('openShift', s.id)}${stripe}>
      <span class="sr-line1">${platformBadge(s.platform)}<span class="sr-date">${esc(ctx.fmt.date(ctx.lang, s.date))}</span><span class="sr-miles">${mi(ctx, s.miles)}</span></span>
      <span class="sr-line2"><span>${esc(range(ctx, s))}</span><span class="sr-dur">${dur(s)}</span></span>
      ${variant !== 'card' || ctx.famId !== 'v0' ? (status ? `<span class="sr-status">${status}</span>` : '') : ''}
    </button>`;
  }

  function shiftList(ctx, shifts) {
    const v = ctx.fam.rows;
    if (v === 'table') {
      return `<div class="table" role="group">
        <div class="thead" aria-hidden="true"><span>${esc(ctx.t('date'))}</span><span class="num">mi</span><span class="num">h</span><span class="num">${esc(ctx.t('paid'))}</span></div>
        ${shifts.map((s) => shiftRow(ctx, s, 'table')).join('')}
      </div>`;
    }
    if (v === 'list') return `<div class="list-group">${shifts.map((s) => shiftRow(ctx, s, 'list')).join('')}</div>`;
    return `<div class="stack">${shifts.map((s) => shiftRow(ctx, s, 'card')).join('')}</div>`;
  }

  // ---------- Home ----------

  function hero(ctx) {
    const s = ctx.month;
    const today = ctx.data.shifts.filter((x) => x.date === E.TODAY).reduce((a, x) => a + x.miles, 0);
    const st = payStatus(ctx);
    const open = ctx.ui.heroOpen;
    const toggleBtn = (label) => `<button class="hero-toggle" ${act('toggleHero')} aria-expanded="${open}" aria-label="${esc(ctx.t(open ? 'hideBreakdown' : 'showBreakdown'))}">${label}${icon(open ? 'chevronUp' : 'chevronDown')}</button>`;
    const style = ctx.fam.hero;

    if (style === 'focus') {
      return `<section class="hero hero-focus" aria-label="${esc(ctx.t('paid'))}">
        <p class="hero-label">${esc(ctx.t('paidThisMonth'))}</p>
        <p class="hero-figure">${paidText(ctx)}</p>
        <p class="hero-status">${st.partial ? chip(ctx.t('partialChip'), 'partial') : ''}<span>${esc(st.text)}</span></p>
        <div class="hero-pair">
          <span><span class="hero-mini-label">${esc(ctx.t('today'))}</span> <strong>${mi(ctx, today, 0)}</strong></span>
          <span><span class="hero-mini-label">${esc(ctx.t('thisMonth'))}</span> <strong>${mi(ctx, s.miles, 0)}</strong></span>
        </div>
        <button class="link-button hero-link" ${act('toggleHero')} aria-expanded="${open}">${esc(ctx.t(open ? 'hideBreakdown' : 'showBreakdown'))}</button>
      </section>
      ${open ? card(breakdownHtml(ctx), 'card-breakdown') : ''}`;
    }

    if (style === 'ledger') {
      const b = breakdownLines(ctx);
      return `<section class="hero hero-ledger" aria-label="${esc(ctx.t('paid'))}">
        <div class="ledger-head"><h2 class="ledger-period">${esc(ctx.fmt.monthYear(ctx.lang, E.TODAY))}</h2>${st.partial ? chip(ctx.t('partialChip'), 'partial') : ''}</div>
        <dl class="kv kv-ledger">
          <div class="kv-row kv-strong"><dt>${esc(ctx.t('paidLogged'))}<span class="kv-sub">${esc(st.text)}</span></dt><dd>${paidText(ctx)}</dd></div>
          <div class="kv-row"><dt>${esc(ctx.t('milesToday'))}</dt><dd>${mi(ctx, today, 1)}</dd></div>
          <div class="kv-row"><dt>${esc(ctx.t('milesMonth'))}</dt><dd>${mi(ctx, s.miles, 1)}</dd></div>
          ${b.gas.map((g) => `<div class="kv-row"><dt>${g.k}</dt><dd>${g.v}</dd></div>`).join('')}
          <div class="kv-row kv-separate"><dt>${esc(b.deduction.k)}<span class="kv-sub">${esc(ctx.t('notSubtracted'))}</span></dt><dd>${b.deduction.v}</dd></div>
        </dl>
        <button class="hero-toggle hero-toggle-ledger" ${act('toggleHero')} aria-expanded="${open}">${esc(ctx.t(open ? 'hideBreakdown' : 'detailsLabel'))}${icon(open ? 'chevronUp' : 'chevronDown')}</button>
        ${open ? `<div class="ledger-more">${b.notes.map((n) => `<p class="note">${esc(n)}</p>`).join('')}${b.platforms.length ? kv(b.platforms) : ''}<p class="note">${esc(b.deduction.note)}</p></div>` : ''}
      </section>
      ${ctx.fam.weekChart && ctx.ui.weekMiles.some(Boolean) ? card(E.weekChart(ctx, ctx.ui.weekMiles), 'card-chart') : ''}`;
    }

    if (style === 'studio') {
      return `<section class="hero hero-studio" aria-label="${esc(ctx.t('paid'))}">
        <p class="hero-date">${esc(ctx.fmt.date(ctx.lang, E.TODAY, 'long'))}</p>
        <div class="studio-figure"><span class="hero-label">${esc(ctx.t('paidThisMonth'))}</span>${toggleBtn(`<span class="hero-figure">${paidText(ctx)}</span>`)}</div>
        <p class="hero-status">${st.partial ? chip(ctx.t('partialChip'), 'on-hero') : ''}<span>${esc(st.text)}</span></p>
        <div class="studio-stats">
          <div><span class="hero-mini-label">${esc(ctx.t('today'))}</span><span class="studio-stat">${mi(ctx, today, 0)}</span></div>
          <div><span class="hero-mini-label">${esc(ctx.t('thisMonth'))}</span><span class="studio-stat">${mi(ctx, s.miles, 0)}</span></div>
        </div>
        ${open ? `<div class="hero-breakdown">${breakdownHtml(ctx)}</div>` : ''}
      </section>`;
    }

    // Lab card variants of the V0 card. Same data, labels and toggle; only the composition changes.
    if (ctx.card === 'c') {
      return `<section class="hero hero-c" aria-label="${esc(ctx.t('paid'))}">
        <div class="c-zones">
          <div class="c-money">
            <span class="hero-mini-label">${esc(ctx.t('paid'))}</span>
            <span class="c-amount" data-fit>${toggleBtn(`<span class="hero-figure">${paidText(ctx)}</span>`)}</span>
            <span class="hero-status">${st.parts ? `<span>${st.parts.map((x) => `<span class="hs-part">${esc(x)}</span>`).join(' ')}</span>` : esc(st.text)}</span>
          </div>
          <dl class="c-miles">
            <div class="c-mile"><dt class="hero-mini-label">${esc(ctx.t('today'))}</dt><dd class="c-mile-figure">${ctx.fmt.int(ctx.lang, today)}<small> mi</small></dd></div>
            <div class="c-mile"><dt class="hero-mini-label">${esc(ctx.t('thisMonth'))}</dt><dd class="c-mile-figure">${ctx.fmt.int(ctx.lang, s.miles)}<small> mi</small></dd></div>
          </dl>
        </div>
        ${open ? `<div class="hero-breakdown">${ctx.bd === 'propuesta' ? breakdownGrouped(ctx) : breakdownHtml(ctx)}</div>` : ''}
      </section>`;
    }

    // V0 triple, as in the 24 Oct reference.
    return `<section class="hero hero-triple" aria-label="${esc(ctx.t('paid'))}">
      <div class="triple">
        <div class="triple-col"><span class="hero-mini-label">${esc(ctx.t('today'))}</span><span class="hero-figure">${ctx.fmt.int(ctx.lang, today)}<small> mi</small></span></div>
        <div class="triple-col triple-mid"><span class="hero-mini-label">${esc(ctx.t('paid'))}</span>${toggleBtn(`<span class="hero-figure">${paidText(ctx)}</span>`)}<span class="hero-status">${esc(st.text)}</span></div>
        <div class="triple-col"><span class="hero-mini-label">${esc(ctx.t('thisMonth'))}</span><span class="hero-figure">${ctx.fmt.int(ctx.lang, s.miles)}<small> mi</small></span></div>
      </div>
      ${open ? `<div class="hero-breakdown">${breakdownHtml(ctx)}</div>` : ''}
    </section>`;
  }

  function optionsBlock(ctx) {
    const se = seText(ctx);
    if (ctx.fam.options === 'menu') {
      return `<section class="section"><h2 class="section-title">${esc(ctx.t('more'))}</h2><div class="list-group">
        ${row(ctx, { title: esc(ctx.t('worthIt')), iconName: 'calculator', action: 'push', arg: 'calc' })}
        ${row(ctx, { title: esc(ctx.t('seTitle')), sub: esc(se[0]), iconName: 'banknote', action: 'openSheet', arg: 'seDetail' })}
      </div></section>`;
    }
    const open = ctx.ui.optionsOpen;
    const seButton = (cls) => `<button class="row ${cls} row-se" ${act('openSheet', 'seDetail')}><span class="row-icon">${icon('banknote')}</span><span class="row-main"><span class="row-title">${esc(ctx.t('seTitle'))}</span>${se.map((x) => `<span class="row-sub">${esc(x)}</span>`).join('')}</span><span class="row-chevron">${icon('chevronRight')}</span></button>`;
    // «Propuesta» (lab variant for V0): one quiet container holding the header and both tools,
    // split by hairlines instead of three bordered boxes. Same buttons, texts and destinations.
    if (ctx.opts === 'propuesta' && ctx.famId === 'v0') {
      return `<div class="opts">
        <button class="opts-head" ${act('toggleOptions')} aria-expanded="${open}">${icon('sliders')}<span>${esc(ctx.t('options'))}</span>${icon(open ? 'chevronUp' : 'chevronDown')}</button>
        ${open ? `<div class="opts-list">
          ${row(ctx, { title: esc(ctx.t('worthIt')), iconName: 'dollar', action: 'push', arg: 'calc', cls: 'opts-row' })}
          ${seButton('opts-row')}
        </div>` : ''}
      </div>`;
    }
    return `<div class="options">
      <button class="options-toggle" ${act('toggleOptions')} aria-expanded="${open}">${icon('sliders')}<span>${esc(ctx.t('options'))}</span>${icon(open ? 'chevronUp' : 'chevronDown')}</button>
      ${open ? `<div class="options-body stack">
        ${row(ctx, { title: esc(ctx.t('worthIt')), iconName: 'dollar', action: 'push', arg: 'calc', cls: 'row-card' })}
        ${seButton('row-card')}
      </div>` : ''}
    </div>`;
  }

  // A personal drive in progress (lab state), shown inside the chosen Personal box A instead of a
  // separate banner. Status titles and reasons are the app's own; «this drive» is new. The trip
  // is not in Today or This Month until it ends, as in the app.
  function liveInfo(ctx, trip) {
    const LIVE = {
      recording: { title: 'liveRecording', mark: '<span class="pv-live-dot"></span>' },
      acquiring: { title: 'liveAcquiring', why: 'liveWaitGps', mark: icon('location') },
      signalLost: { title: 'liveNoSignal', why: 'liveNoSignalWhy', mark: icon('signalOff') },
      paused: { title: 'livePaused', why: 'livePausedWhy', mark: icon('pause') }
    }[trip.status];
    return {
      mark: `<span class="pv-live-mark">${LIVE.mark}</span>`,
      title: esc(ctx.t(LIVE.title)),
      // The app joins the reason with « · »; here it gets its own line so the dot never hangs at a line end.
      why: LIVE.why ? ` <span class="pv-live-why">${esc(ctx.t(LIVE.why))}</span>` : '',
      miles: ctx.fmt.miles(ctx.lang, trip.miles),
      stop: (cls = '') => `<button class="pv-stop ${cls}" ${act('stopPersonalTrip')} aria-description="${esc(ctx.t('liveStopHint'))}">${esc(ctx.t('liveStop'))}</button>`
    };
  }

  // 1 · Live line: one quiet line under row A, on its columns.
  function liveLine(ctx, trip) {
    const L = liveInfo(ctx, trip);
    return `<div class="pv-live" data-status="${trip.status}">
      ${L.mark}
      <span class="pv-live-text"><span class="pv-live-title">${L.title}</span> <span class="pv-live-sub"><span class="pv-live-mi">${L.miles}<small> mi</small></span> ${esc(ctx.t('liveThisDrive'))}</span>${L.why}</span>
      ${L.stop()}
    </div>`;
  }

  // 2 · The drive first: the state as a chip, the drive's miles large and Stop as a button,
  // above row A, which stays whole underneath.
  function liveBoard(ctx, trip, rowA) {
    const L = liveInfo(ctx, trip);
    return `<div class="pv-box pv-board" data-status="${trip.status}">
      <div class="pv-board-top">
        <span class="pv-chip">${L.mark}<span>${L.title}</span></span>
        <span class="pv-board-fig"><span class="pv-board-mi">${L.miles}<small> mi</small></span> <span class="pv-board-cap">${esc(ctx.t('liveThisDrive'))}</span>${L.why}</span>
        ${L.stop('pv-stop-tinted')}
      </div>
      ${rowA}
    </div>`;
  }

  // 3 · A bar docked above the tab bar: in view however far Home scrolls, Stop within thumb reach.
  function liveDock(ctx, trip) {
    const L = liveInfo(ctx, trip);
    return `<div class="pv-dock" data-status="${trip.status}">
      ${L.mark}
      <span class="pv-live-text"><span class="pv-live-title">${L.title}</span> <span class="pv-live-sub"><span class="pv-live-mi">${L.miles}<small> mi</small></span> ${esc(ctx.t('liveThisDrive'))}</span>${L.why}</span>
      ${L.stop('pv-stop-tinted')}
    </div>`;
  }

  function personalRow(ctx) {
    if (!ctx.data.autoPersonal) return '';
    const p = ctx.data.personal;
    const today = p.filter((x) => x.date === E.TODAY).reduce((a, x) => a + x.miles, 0);
    const month = p.reduce((a, x) => a + x.miles, 0);
    // Personal proposals (V0 only): the existing «Today» / «This Month» labels sit above their
    // value, and a chevron says the whole row opens History → Personal. Same figures and action.
    // The spaces between spans keep the button's accessible name readable: «Personal Today 0 mi This Month 9 mi».
    if (ctx.famId === 'v0' && (ctx.personal === 'a' || ctx.personal === 'b')) {
      const metric = (label, n) => `<span class="pv-metric"><span class="pv-label">${esc(label)}</span> <span class="pv-value">${ctx.fmt.int(ctx.lang, n)}<small> mi</small></span></span>`;
      const metrics = `<span class="pv-metrics">${metric(ctx.t('today'), today)} ${metric(ctx.t('thisMonth'), month)}</span>`;
      const lead = `<span class="pv-icon">${icon('car')}</span> <span class="pv-title">${esc(ctx.t('personal'))}</span>`;
      const chevron = `<span class="pv-chevron">${icon('chevronRight')}</span>`;
      if (ctx.personal === 'b') return `<button class="pv pv-b" ${act('openPersonal')}><span class="pv-top">${lead} ${chevron}</span> ${metrics}</button>`;
      const rowA = `<button class="pv pv-a" id="personal-row" ${act('openPersonal')}><span class="pv-lead">${lead}</span> ${metrics} ${chevron}</button>`;
      const trip = ctx.ui.liveTrip;
      if (!trip && ctx.avisos === 'b' && noticeList(ctx.data).includes('motion')) return `<div class="pv-box">${rowA}${personalBlock(ctx)}</div>`;
      if (!trip || ctx.vivo === 'barra') return rowA;
      return ctx.vivo === 'tablero' ? liveBoard(ctx, trip, rowA) : `<div class="pv-box">${rowA}${liveLine(ctx, trip)}</div>`;
    }
    if (ctx.famId === 'v0') {
      return `<button class="personal-row card" ${act('openPersonal')}>${icon('car')}<span class="pr-title">${esc(ctx.t('personal'))}</span>
        <span class="pr-val"><strong>${ctx.fmt.int(ctx.lang, today)}</strong> ${esc(ctx.t('personalToday', { a: '' }).trim())}</span>
        <span class="pr-val"><strong>${ctx.fmt.int(ctx.lang, month)}</strong> ${esc(ctx.t('personalMonth', { b: '' }).trim())}</span></button>`;
    }
    return `<div class="list-group">${row(ctx, { title: esc(ctx.t('personal')), sub: esc(ctx.t('personalNotWork')), value: `${ctx.fmt.miles(ctx.lang, month)} mi`, iconName: 'car', action: 'openPersonal' })}</div>`;
  }

  function startBlock(ctx) {
    const s = ctx.fam.start;
    if (s === 'circle' || s === 'ring') {
      const xmas = E.xmas.startDecor(ctx);
      if (xmas) return xmas;
    }
    // «Fondo»: the real Woodbridge interchange fills the circle behind the label; it is decorative only.
    // «Corte» and «Tenue» change only how the lines meet the label in dark mode (app.css).
    const map = { fondo: '', 'fondo-corte': ' start-map-corte', 'fondo-tenue': ' start-map-tenue' }[ctx.circ];
    if (s === 'circle' && map !== undefined) return `<div class="start-wrap"><button class="start-circle start-circle-map${map}" ${act('startShift')}>${E.startMap()}<span class="start-label">${esc(ctx.t('startShift'))}</span></button></div>`;
    if (s === 'circle') return `<div class="start-wrap"><button class="start-circle" ${act('startShift')}><span>${esc(ctx.t('startShift'))}</span></button></div>`;
    if (s === 'ring') return `<div class="start-wrap start-wrap-ring">${E.hourRing()}<button class="start-circle start-ring" ${act('startShift')}><span>${esc(ctx.t('startShift'))}</span></button></div>`;
    return '';
  }

  function startFooter(ctx) {
    const s = ctx.fam.start;
    if (s === 'pill' || s === 'bar') return `<div class="footer-bar ${['xmas-elf', 'xmas-gorrito'].includes(ctx.lab.deco) ? 'footer-xmas' : ''}">${button(ctx.t('startShift'), 'startShift', undefined, { cls: s === 'pill' ? 'btn-pill' : 'btn-bar' })}${E.xmas.pillDecor(ctx)}</div>`;
    return '';
  }

  // ---------- Home · Recientes ----------
  const durShort = (s) => E.fmt.duration(E.mins(s), false);
  const recentHead = (ctx) => `<div class="section-head"><h2 class="section-title">${esc(ctx.t('recent'))}</h2><button class="link-button" ${act('viewAll')}>${esc(ctx.t('viewAll'))}</button></div>`;
  // What the shift paid so far, or the chip that says it is missing (same rule as History).
  function payNote(ctx, s) {
    if (s.main === 'overflow') return chip('—');
    if (s.main === null) return s.extras.length ? `<span class="rx-paid">${money(ctx, mainAmount(s))}</span> ${chip(ctx.t('partialChip'), 'partial')}` : chip(ctx.t('noPayChip'));
    return `<span class="rx-paid">${money(ctx, mainAmount(s))}</span>`;
  }

  // Today in the app: only the latest shift, a 140 pt route map and one row of details. The card is not a button;
  // VoiceOver reads one label for the whole card.
  function recentApp(ctx, s) {
    const label = ctx.t('recentA11y', { d: ctx.fmt.date(ctx.lang, s.date, 'wide'), m: ctx.fmt.miles(ctx.lang, s.miles) });
    const top = s.route == null ? `<span class="rc-noroute">${icon('pin')}<span>${esc(ctx.t('noRoute'))}</span></span>` : E.map(ctx, s.route, { bare: true });
    return `<div class="rc" role="group" aria-label="${esc(label)}"><span aria-hidden="true">${top}
      <span class="rc-info">${platformBadge(s.platform)}<span class="rc-date">${esc(ctx.fmt.date(ctx.lang, s.date, 'short'))}</span><span class="rc-time">${esc(ctx.fmt.time(ctx.lang, s.start))}</span><span class="rc-gap"></span><span class="rc-dur">${durShort(s)}</span><span class="rc-mi">${mi(ctx, s.miles)}</span></span></span></div>`;
  }

  // A · The same card, map 20 pt lower, details on two lines that wrap instead of truncating, pay included,
  // start time and duration as in the app,
  // and the whole card opens the shift. Without a route there is no empty 140 pt box.
  function recentA(ctx, s) {
    return `<button class="ra" id="recent-latest" ${act('openShift', s.id)}>${s.route == null ? '' : E.map(ctx, s.route, { bare: true })}
      <span class="ra-body"><span class="ra-text">
        <span class="ra-line1"><span class="ra-date">${esc(ctx.fmt.date(ctx.lang, s.date, 'weekdayShort'))}</span> <span class="ra-mi">${mi(ctx, s.miles)}</span></span>
        <span class="ra-line2"><span class="ra-when">${platformBadge(s.platform)} ${esc(ctx.fmt.time(ctx.lang, s.start))} · ${durShort(s)}</span> <span class="ra-pay">${payNote(ctx, s)}</span></span>
      </span><span class="row-chevron">${icon('chevronRight')}</span></span></button>`;
  }

  // B · The three latest shifts, as SPEC §4.3 describes, in one quiet box; no map.
  function recentB(ctx, list) {
    return `<div class="rb">${list.map((s) => `<button class="rb-row" ${act('openShift', s.id)}>
      <span class="rb-icon">${platformBadge(s.platform)}</span>
      <span class="rb-content"><span class="rb-main"><span class="rb-date">${esc(ctx.fmt.date(ctx.lang, s.date, 'weekdayShort'))}</span> <span class="rb-sub">${esc(ctx.fmt.time(ctx.lang, s.start))} · ${durShort(s)}</span></span>
      <span class="rb-side"><span class="rb-mi">${mi(ctx, s.miles)}</span> <span class="rb-pay">${payNote(ctx, s)}</span></span></span>
    </button>`).join('')}</div>`;
  }

  // C · Only the latest shift in one row: the route drawn alone (no streets, no map service), then its figures.
  function recentC(ctx, s) {
    return `<button class="rcc" id="recent-latest" ${act('openShift', s.id)}>
      <span class="rcc-sketch">${s.route == null ? platformBadge(s.platform) : E.routeSketch(s.route)}</span>
      <span class="rcc-main"><span class="rcc-top"><span class="rcc-date">${esc(ctx.fmt.date(ctx.lang, s.date, 'weekdayShort'))}</span> <span class="rcc-mi">${mi(ctx, s.miles)}</span></span>
        <span class="rcc-sub"><span>${esc(pname(s.platform))} · ${durShort(s)}</span> <span class="rcc-pay">${payNote(ctx, s)}</span></span></span>
      <span class="row-chevron">${icon('chevronRight')}</span></button>`;
  }

  // D · Liber's pick (6 Nov) from a ChatGPT sketch: the latest shift large, with miles, pay and the estimated
  // deduction as figures, then the two before it as small rows. No map: the route stays in the shift detail.
  function payFigure(ctx, s) {
    if (s.main === 'overflow') return { v: '—', chip: '' };
    if (s.main === null) return s.extras.length ? { v: money(ctx, mainAmount(s)), chip: chip(ctx.t('partialChip'), 'partial') } : { v: '', chip: chip(ctx.t('noPayChip')) };
    return { v: money(ctx, mainAmount(s)), chip: '' };
  }
  function recentD(ctx, list) {
    const [s, ...rest] = list;
    const pay = payFigure(ctx, s);
    const fig = (v, label, extra = '') => `<span class="rd-fig"><span class="rd-val">${v}</span><span class="rd-lab">${esc(label)}${extra ? ` ${extra}` : ''}</span></span>`;
    const latest = `<button class="rd" id="recent-latest" ${act('openShift', s.id)}><span class="rd-body"><span class="rd-text">
        <span class="rd-top"><span class="rd-who">${platformBadge(s.platform)}<span class="rd-name">${esc(pname(s.platform))}</span></span> <span class="rd-date">${esc(ctx.fmt.date(ctx.lang, s.date, 'weekdayShort'))}</span></span>
        <span class="rd-figs">${fig(esc(mi(ctx, s.miles)), ctx.t('miles'))}${fig(pay.v ? esc(pay.v) : pay.chip, ctx.t('paid'), pay.v ? pay.chip : '')}${fig(s.deduction == null ? '—' : esc(money(ctx, s.deduction)), ctx.t('estimatedDeduction'))}</span>
        <span class="rd-foot"><span>${esc(ctx.fmt.timeRange(ctx.lang, s.start, s.end))}</span> <span class="rd-dur">${durShort(s)}</span></span>
      </span><span class="row-chevron">${icon('chevronRight')}</span></span></button>`;
    const rows = rest.length ? `<h3 class="rd-earlier">${esc(ctx.t('earlier'))}</h3><div class="rd-list">${rest.map((r) => `<button class="rb-row rd-row" ${act('openShift', r.id)}>
      <span class="rb-icon">${platformBadge(r.platform)}</span>
      <span class="rb-content"><span class="rb-main"><span class="rd-rname">${esc(pname(r.platform))}</span> <span class="rb-sub">${esc(ctx.fmt.date(ctx.lang, r.date, 'weekdayShort'))} · ${durShort(r)}</span></span>
      <span class="rb-side"><span class="rb-mi">${mi(ctx, r.miles)}</span> <span class="rb-pay">${payNote(ctx, r)}</span></span></span>
      <span class="row-chevron">${icon('chevronRight')}</span>
    </button>`).join('')}</div>` : '';
    return `<div class="rd-wrap">${latest}${rows}</div>`;
  }

  function recentBlock(ctx) {
    const list = [...ctx.data.shifts].sort(byDateDesc).slice(0, 3);
    if (ctx.famId === 'v0' && ['actual', 'a', 'b', 'c', 'd'].includes(ctx.recientes)) {
      // As in the app, Home shows no Recent section at all until a shift is saved.
      if (!list.length) return '';
      const body = { actual: () => recentApp(ctx, list[0]), a: () => recentA(ctx, list[0]), b: () => recentB(ctx, list), c: () => recentC(ctx, list[0]), d: () => recentD(ctx, list) }[ctx.recientes]();
      return `<section class="section rx-section">${recentHead(ctx)}${body}</section>`;
    }
    if (!list.length) return `<section class="section"><h2 class="section-title">${esc(ctx.t('recent'))}</h2><p class="empty">${esc(ctx.t('emptyRecent'))}</p></section>`;
    return `<section class="section">
      <div class="section-head"><h2 class="section-title">${esc(ctx.t('recent'))}</h2><button class="link-button" ${act('viewAll')}>${esc(ctx.t('viewAll'))}</button></div>
      ${shiftList(ctx, list)}
    </section>`;
  }

  function home(ctx) {
    const h = ctx.fam.hero;
    const parts = {
      hero: hero(ctx), options: optionsBlock(ctx), personal: personalRow(ctx), notice: noticeBlock(ctx),
      start: startBlock(ctx), recent: recentBlock(ctx)
    };
    const order = {
      triple: ['hero', 'options', 'personal', 'notice', 'start', 'recent'],
      focus: ['notice', 'hero', 'recent', 'personal', 'options'],
      ledger: ['notice', 'hero', 'recent', 'personal', 'options'],
      studio: ['hero', 'start', 'notice', 'recent', 'personal', 'options']
    }[h];
    if (ctx.famId === 'v0') {
      const list = noticeList(ctx.data);
      // Low Power Mode: as in the app, Start is disabled and filled with brandBorder at 55 %.
      if (ctx.data.lowPower) {
        const why = ctx.avisos === 'b' ? 'start-note' : 'start-off-hint';
        parts.start = parts.start.replace('<button class="start-circle', `<button disabled aria-describedby="${why}" class="start-off start-circle`)
          .replace(/<\/div>$/, `<span class="sr-only" id="start-off-hint">${esc(ctx.t('startOffHint'))}</span></div>`);
      }
      if (ctx.avisos === 'b') parts.start += startNote(ctx, list);
      if (ctx.avisos === 'c' && list.length) parts.hero = noticeStrip(ctx, list) + parts.hero;
    }
    const drift = E.xmas.heroDecor(ctx);
    if (drift) parts.hero = parts.hero.replace(/(<section class="hero[^>]*>)/, `$1${drift}`).replace('class="hero ', 'class="hero hero-drift ');
    // «Sin título»: the visible name and its bar go away; the heading stays for screen readers and focus.
    const header = ctx.home === 'sintitulo'
      ? `<h1 class="sr-only" tabindex="-1" data-screen-heading>${esc(ctx.t('appName'))}</h1>`
      : largeTitle(ctx, ctx.t('appName'), E.decoration(ctx));
    return {
      header,
      body: E.xmas.topDecor(ctx) + order.map((k) => parts[k]).join(''),
      footer: (ctx.famId === 'v0' && ctx.personal === 'a' && ctx.vivo === 'barra' && ctx.ui.liveTrip && ctx.data.autoPersonal ? liveDock(ctx, ctx.ui.liveTrip) : '') + startFooter(ctx)
    };
  }

  // ---------- Active shift (approximation) & close ----------

  // The app's screen (ActiveTrackingView) and three proposals, V0 only. Fixed example values: nothing advances.
  const lowCard = (ctx, body) => (ctx.data.lowPower ? `<div class="notice notice-card ts-low" role="group" aria-label="${esc(ctx.t('nLowTitle'))}"><span class="notice-icon">${icon('battery')}</span><span class="notice-main"><span class="notice-title">${esc(ctx.t('nLowTitle'))}</span><span class="notice-body">${esc(ctx.t(body))}</span></span></div>` : '');
  function activeParts(ctx) {
    const a = ctx.ui.active || {};
    const sh = E.ACTIVE_SHIFT[a.kind || 'normal'];
    const waiting = sh.route == null;
    const platform = a.platform || 'amazonFlex';
    const miles = ctx.fmt.miles(ctx.lang, sh.miles);
    const chip = waiting
      ? `<span class="pv-chip ts-chip"><span class="pv-live-mark">${icon('location')}</span><span>${esc(ctx.t('liveAcquiring'))}</span></span>`
      : `<span class="pv-chip ts-chip"><span class="pv-live-mark"><span class="pv-live-dot"></span></span><span>${esc(ctx.t('shiftTracking'))}</span></span>`;
    const who = `<span class="ts-who">${platformBadge(platform)}<span>${esc(pname(platform))} · ${esc(ctx.t('shiftSince', { t: ctx.fmt.time(ctx.lang, sh.start) }))}</span></span>`;
    const fig = (v, label) => `<span class="rd-fig"><span class="rd-val">${v}</span><span class="rd-lab">${esc(label)}</span></span>`;
    return {
      sh, miles, chip, who,
      status: `<div class="ts-status">${chip}${who}</div>`,
      // B, as Liber chose it: no «Trackeando» chip, only the platform and the start time, laid out like Recientes D.
      // The chip stays only while there is no GPS point yet, so 0.0 mi never stands unexplained.
      statusB: `${waiting ? `<div class="ts-status">${chip}</div>` : ''}<div class="rd-top ts-top"><span class="rd-who">${platformBadge(platform)}<span class="rd-name">${esc(pname(platform))}</span></span> <span class="rd-date ts-since">${esc(ctx.t('shiftSince', { t: ctx.fmt.time(ctx.lang, sh.start) }))}</span></div>`,
      map: (cls) => E.map(ctx, sh.route ?? 0, { live: true, waiting, cls, label: `${ctx.t('routeMap')}, ${ctx.t(waiting ? 'routeWaiting' : 'routeInProgress')}` }),
      // The app's banner in its during-shift wording: not tappable, iOS has no link to Battery settings.
      low: lowCard(ctx, 'nLowShiftBody'),
      lowShort: lowCard(ctx, 'nLowShiftShort'),
      counters: `<div class="ts-counters"><span class="ts-counter"><span class="ts-counter-label">${esc(ctx.t('miles'))}</span><span class="ts-counter-mi">${esc(miles)}<small> mi</small></span></span>
        <span class="ts-counter"><span class="ts-counter-label">${esc(ctx.t('duration'))}</span><span class="ts-counter-dur">${esc(sh.elapsed)}</span></span></div>`,
      figMiles: fig(`${esc(miles)}<small> mi</small>`, ctx.t('miles')),
      figDur: fig(esc(sh.elapsed), ctx.t('duration')),
      figDed: fig(esc(money(ctx, sh.deduction)), ctx.t('estimatedDeduction')),
      end: (cls) => `<button class="ts-end ${cls}" ${act('endShift', 'confirm')} aria-description="${esc(ctx.t('endShiftHint'))}">${esc(ctx.t('endShift'))}</button>`
    };
  }

  function activeVariant(ctx) {
    const P = activeParts(ctx);
    const header = navBar(ctx, ctx.t('activeShiftTitle'));
    // Today: map, then the two counters centred in what is left, then End Shift, all in one column that
    // does not scroll in the app. No platform, no start time, nothing that says it is recording.
    if (ctx.turno === 'actual') {
      return { header, body: `<div class="ts ts-app">${P.low}${P.map('ts-map-240')}<span class="ts-spacer"></span>${P.counters}<span class="ts-spacer"></span>${P.end('ts-end-glow')}</div>` };
    }
    // A · The same screen with one status line: whether it records, the platform and when it started.
    if (ctx.turno === 'a') {
      return { header, body: `<div class="ts ts-a">${P.status}${P.lowShort}${P.map('ts-map-shrink')}<span class="ts-spacer"></span>${P.counters}<span class="ts-spacer"></span></div>`,
        footer: `<div class="ts-foot">${P.end('ts-end-glow')}</div>` };
    }
    // B · The language of «El viaje primero»: the state, this shift's miles large, time and deduction, then the map.
  // End Shift keeps SPEC §4.4 (destructive fill, static glow) in every proposal.
    if (ctx.turno.startsWith('b')) {
      const space = { 'b-tope': ' ts-b-tope', 'b-junto': ' ts-b-junto' }[ctx.turno] || '';
      return { header, body: `<div class="ts ts-b${space}"><div class="pv-box ts-board">${P.statusB}
          <span class="ts-board-fig"><span class="ts-big">${esc(P.miles)}<small> mi</small></span> <span class="ts-cap">${esc(ctx.t('thisShift'))}</span></span>
          <div class="rd-figs ts-figs">${P.figDur}${P.figDed}</div></div>${P.lowShort}${P.map('ts-map-fill')}</div>`,
        footer: `<div class="ts-foot">${P.end('ts-end-glow')}</div>` };
    }
    // C · The map takes whatever is left; the figures sit in one panel above End Shift.
    return { header, body: `<div class="ts ts-c">${P.lowShort}${P.map('ts-map-fill')}<div class="ts-panel">${P.status}<div class="rd-figs ts-figs">${P.figMiles}${P.figDur}${P.figDed}</div></div></div>`,
      footer: `<div class="ts-foot">${P.end('ts-end-glow')}</div>` };
  }

  function active(ctx) {
    if (ctx.famId === 'v0' && ['actual', 'a', 'b', 'c', 'b-tope', 'b-junto'].includes(ctx.turno)) return activeVariant(ctx);
    const a = ctx.ui.active || {};
    const platforms = ['amazonFlex', 'uber', 'doorDash', 'spark'];
    return {
      header: navBar(ctx, ctx.t('activeShift'), { back: true, backLabel: ctx.t('tabHome') }),
      body: `<p class="demo-note">${icon('info')}<span>${esc(ctx.t('simulated'))}</span></p>
        <section class="section"><h2 class="section-title">${esc(ctx.t('choosePlatform'))}</h2>
          <div class="choice-grid" role="radiogroup" aria-label="${esc(ctx.t('choosePlatform'))}">
          ${platforms.map((p) => `<button class="choice ${a.platform === p ? 'is-selected' : ''}" role="radio" aria-checked="${a.platform === p}" ${act('pickPlatform', p)}>${platformBadge(p)}<span>${esc(pname(p))}</span></button>`).join('')}
          </div></section>
        ${card(kv([{ k: ctx.t('elapsed'), v: '1:24:10' }, { k: ctx.t('milesSoFar'), v: '18.6 mi' }]), 'card-active')}`,
      footer: `<div class="footer-bar">${button(ctx.t('endShift'), 'endShift', undefined, { disabled: !a.platform })}</div>`
    };
  }

  // ---------- Close · proposals: ask the pay of every app used on the shift ----------
  // The app (2.0.3) asks only the shift's own pay here; other platforms are added later in History's edit
  // («Also ran another platform?»). The proposals ask it at close. They store what the app already stores
  // (`grossEarnings`, `tip`, `extraEarnings`); nothing new in the data.
  function hasTips(p) { return p !== 'amazonFlex'; }
  function closeProposal(ctx) {
    const c = ctx.ui.close;
    const sh = c.shift;
    const f = ctx.ui.f;
    const v = ctx.cierre;
    const enabled = ctx.data.enabledPlatforms || E.ENABLED_PLATFORMS;
    const others = enabled.filter((p) => p !== sh.platform);
    const chosen = v === 'c' && c.ask !== 'yes' ? [] : (c.apps || []).filter((p) => others.includes(p));
    const errs = {};
    const read = (key) => { const n = parseAmount(f[key]); if (Number.isNaN(n)) errs[key] = ctx.t('invalidAmount'); return n; };
    const main = read('payMain');
    const mainTip = hasTips(sh.platform) ? read('payMainTip') : '';
    if (!errs.payMainTip && typeof mainTip === 'number' && !(typeof main === 'number' && mainTip <= main)) errs.payMainTip = ctx.t('tipTooBig');
    const pays = typeof main === 'number' ? [{ p: sh.platform, gross: main, tip: typeof mainTip === 'number' && mainTip > 0 && mainTip <= main ? mainTip : null, primary: true }] : [];
    for (const p of chosen) {
      const gross = read(`pay_${p}`);
      const tip = hasTips(p) ? read(`tip_${p}`) : '';
      if (!errs[`tip_${p}`] && typeof tip === 'number' && !(typeof gross === 'number' && tip <= gross)) errs[`tip_${p}`] = ctx.t('tipTooBig');
      if (typeof gross === 'number') pays.push({ p, gross, tip: typeof tip === 'number' && tip > 0 && tip <= gross ? tip : null });
    }
    const hasMain = pays.some((x) => x.primary);
    const hasExtra = pays.some((x) => !x.primary);
    const lines = [];
    for (const x of pays) {
      lines.push({ k: hasExtra ? pname(x.p) : ctx.t('paid'), v: money(ctx, x.gross) });
      if (x.tip) lines.push({ k: ctx.t('ofWhichTip'), v: money(ctx, x.tip), cls: 'kv-indent' });
    }
    const total = pays.reduce((a, x) => a + x.gross, 0);

    const mainField = moneyField(ctx, 'payMain', { label: esc(ctx.t('clPaidBy', { p: pname(sh.platform) })), error: errs.payMain })
      + (hasTips(sh.platform) ? moneyField(ctx, 'payMainTip', { label: esc(ctx.t('tipOptional')), error: errs.payMainTip }) : '');
    const fields = (p) => `<div class="cl-fields" data-app="${p}">${moneyField(ctx, `pay_${p}`, { label: esc(ctx.t('clPaidBy', { p: pname(p) })), error: errs[`pay_${p}`] })}${hasTips(p) ? moneyField(ctx, `tip_${p}`, { label: esc(ctx.t('tipOptional')), error: errs[`tip_${p}`] }) : ''}</div>`;
    const later = `<p class="note">${esc(ctx.t(hasTips(sh.platform) ? 'tipsLater' : 'payOptional'))}</p>`;
    let pay;
    // With a single platform switched on there is nothing else to ask: the shift's own field, as in the app.
    if (!others.length) {
      pay = `${mainField}${later}`;
    } else if (v === 'a') {
      // A · A checklist of the apps usually run with this one (CIERRE-COMBINACIONES.md): first those this driver has
      // already logged together with it, then the default table. «Otra app» opens the rest, so nothing real is unloggable.
      const used = [];
      for (const s of ctx.data.shifts) {
        const set = [s.platform, ...s.extras.map((x) => x.platform)];
        if (set.length > 1 && set.includes(sh.platform)) for (const p of set) if (p !== sh.platform && !used.includes(p)) used.push(p);
      }
      const suggested = [...used, ...(E.COMBOS[sh.platform] || [])].filter((p, i, all) => others.includes(p) && all.indexOf(p) === i);
      const rows = [...suggested, ...chosen.filter((p) => !suggested.includes(p))];
      const rest = others.filter((p) => !rows.includes(p));
      const shown = c.moreOpen ? [...rows, ...rest] : rows;
      const row = (p) => { const on = chosen.includes(p); return `<button class="cl-app ${on ? 'is-on' : ''}" role="checkbox" aria-checked="${on}" ${act('toggleApp', p)}><span class="cl-box" aria-hidden="true">${on ? icon('check') : ''}</span>${platformBadge(p)}<span class="cl-name">${esc(pname(p))}</span>${used.includes(p) ? `<span class="cl-tag">${esc(ctx.t('clUsedBefore'))}</span>` : ''}</button>${on ? fields(p) : ''}`; };
      const more = rest.length && !c.moreOpen ? `<button class="link-button with-icon cl-more" ${act('moreApps')}>${icon('plus')}<span>${esc(ctx.t('clAddOther'))}</span></button>` : '';
      pay = !shown.length
        ? `${mainField}${more}${later}`
        : `<p class="cl-q" id="cl-apps-q">${esc(ctx.t('clWhichApps'))}</p>
        <div class="cl-list" role="group" aria-labelledby="cl-apps-q">
          <div class="cl-app is-on is-fixed"><span class="cl-box" aria-hidden="true">${icon('check')}</span>${platformBadge(sh.platform)}<span class="cl-name">${esc(pname(sh.platform))}</span><span class="cl-tag">${esc(ctx.t('clShiftApp'))}</span></div>
          <div class="cl-fields">${mainField}</div>
          ${shown.map(row).join('')}
        </div>${more}${later}`;
    } else if (v === 'b') {
      // B · The shift's app first; «+ Otra app» picks another, as History's editor does, without leaving the close.
      const left = others.filter((p) => !chosen.includes(p));
      pay = `${mainField}
        ${chosen.map((p) => `<div class="cl-added">${fields(p)}<button class="btn-destructive-text cl-remove" ${act('removeApp', p)}>${esc(ctx.t('clRemove', { p: pname(p) }))}</button></div>`).join('')}
        ${!left.length ? '' : c.picking
          ? `<p class="cl-q" id="cl-pick-q">${esc(ctx.t('clWhichOther'))}</p><div class="cl-chips" role="group" aria-labelledby="cl-pick-q">${left.map((p) => `<button class="choice cl-chip" ${act('addApp', p)}>${platformBadge(p)}<span>${esc(pname(p))}</span></button>`).join('')}</div>`
          : `<button class="btn btn-secondary cl-add" ${act('pickOther')}>${icon('plus')}<span>${esc(ctx.t('clAddOther'))}</span></button>`}
        ${later}`;
    } else {
      // C · Asks every time: «¿Usaste otra app además de Amazon Flex?» No / Sí; Sí shows the apps to tick.
      pay = `${mainField}
        <p class="cl-q" id="cl-ask-q">${esc(ctx.t('clOtherQ', { p: pname(sh.platform) }))}</p>
        <div class="cl-yesno" role="radiogroup" aria-labelledby="cl-ask-q">${[['no', 'clNo'], ['yes', 'clYes']].map(([k, label]) => `<button class="choice cl-answer ${c.ask === k ? 'is-selected' : ''}" role="radio" aria-checked="${c.ask === k}" ${act('askOther', k)}><span>${esc(ctx.t(label))}</span></button>`).join('')}</div>
        ${c.ask === 'yes' ? `<div class="cl-chips" role="group" aria-labelledby="cl-ask-q">${others.map((p) => { const on = chosen.includes(p); return `<button class="choice cl-chip ${on ? 'is-selected' : ''}" aria-pressed="${on}" ${act('toggleApp', p)}>${platformBadge(p)}<span>${esc(pname(p))}</span></button>`; }).join('')}</div>${chosen.map(fields).join('')}` : ''}
        ${later}`;
    }
    const anyErr = Object.keys(errs).length > 0;
    const result = closeResult(ctx, sh, lines, total, hasMain, hasExtra);
    return closeFrame(ctx, card(pay, `card-pay cl-pay cl-${v}`), result, anyErr);
  }

  // What the shift paid after gas, from the pay lines already built. Shared by the app's screen and the proposals.
  function closeResult(ctx, sh, lines, total, hasMain, hasExtra) {
    const gas = ctx.data.gasKnown ? sh.gasKnownCost : null;
    const hours = E.mins(sh) / 60;
    // «Total recorded» only when another app is added; a tip row alone is part of the same pay.
    let result = '';
    if (!hasMain && hasExtra) {
      result = `${kv([...lines, { k: ctx.t('recordedSoFar'), v: money(ctx, total) }])}
        <p class="note note-partial">${chip(ctx.t('partialChip'), 'partial')} ${esc(ctx.t('partialAfterGas', { p: pname(sh.platform) }))}</p>
        ${gas !== null ? kv([{ k: ctx.t('estGasCost'), v: money(ctx, -gas) }]) : ''}`;
    } else if (!hasMain) {
      result = `${kv([{ k: ctx.t('paid'), v: '—' }, gas !== null ? { k: ctx.t('estGasCost'), v: money(ctx, -gas) } : null])}
        ${gas === null ? `<p class="note">${esc(ctx.t('gasUnknownShort'))}</p>` : ''}`;
    } else if (gas === null) {
      result = `${kv(hasExtra ? [...lines, { k: ctx.t('totalRecorded'), v: money(ctx, total) }] : lines)}<p class="note">${esc(ctx.t('gasUnknownShort'))}</p>`;
    } else {
      const left = total - gas;
      const perHour = left / hours;
      const layout = ctx.fam.resultLayout;
      if (layout === 'equation') {
        result = `<div class="equation" role="group" aria-label="${esc(ctx.t('leftAfterGas'))}">
            <div class="eq-term"><span class="eq-label">${esc(ctx.t(hasExtra ? 'totalRecorded' : 'paid'))}</span><span class="eq-val">${money(ctx, total)}</span></div>
            <span class="eq-op" aria-hidden="true">−</span>
            <div class="eq-term"><span class="eq-label">${esc(ctx.t('estGasCost'))}</span><span class="eq-val">${money(ctx, gas)}</span></div>
            <div class="eq-term eq-result"><span class="eq-label"><span aria-hidden="true">= </span>${esc(ctx.t('leftAfterGas'))}</span><span class="eq-val">${money(ctx, left)}</span></div>
          </div>
          ${lines.length > 1 ? kv(lines, 'kv-small') : ''}
          ${kv([{ k: ctx.t('perHour'), v: `${money(ctx, perHour)} ${ctx.t('perHr')}` }])}
          <p class="note">${esc(ctx.t('afterGasNote'))}</p>`;
      } else {
        result = `${kv([...lines, hasExtra ? { k: ctx.t('totalRecorded'), v: money(ctx, total) } : null, { k: ctx.t('estGasCost'), v: money(ctx, -gas) }, '---'], layout === 'ledger' ? 'kv-ledger' : '')}
          <div class="result-figure"><span class="result-label">${esc(ctx.t('leftAfterGas'))}</span><span class="result-value ${left < 0 ? 'is-negative' : ''}">${money(ctx, left)}</span></div>
          ${kv([{ k: ctx.t('perHour'), v: `${money(ctx, perHour)} ${ctx.t('perHr')}` }])}
          <p class="note">${esc(ctx.t('afterGasNote'))}</p>`;
      }
    }

    return result;
  }

  function closeShift(ctx) {
    if (ctx.famId === 'v0' && ['a', 'b', 'c'].includes(ctx.cierre)) return closeProposal(ctx);
    const c = ctx.ui.close;
    const sh = c.shift;
    const f = ctx.ui.f;
    const main = parseAmount(f.payMain);
    // «Hoy» (the app, 2.0.3): no other platform on this screen; that is History's edit.
    const extrasHere = !(ctx.famId === 'v0' && ctx.cierre === 'actual');
    const extra = extrasHere && c.extrasOpen ? parseAmount(f.payX) : '';
    const tip = extrasHere && c.extrasOpen ? parseAmount(f.payXTip) : '';
    const mainErr = Number.isNaN(main) ? ctx.t('invalidAmount') : '';
    const extraErr = Number.isNaN(extra) ? ctx.t('invalidAmount') : '';
    const tipErr = Number.isNaN(tip) ? ctx.t('invalidAmount') : (typeof tip === 'number' && typeof extra === 'number' && tip > extra ? ctx.t('tipTooBig') : '');
    const hasMain = typeof main === 'number';
    const hasExtra = typeof extra === 'number';
    // The shift's own tip, only on platforms that pay tips (every one but Amazon Flex), as the app's ShiftPayCard.
    const tipsHere = hasTips(sh.platform);
    const mainTip = tipsHere ? parseAmount(f.payMainTip) : '';
    const mainTipErr = Number.isNaN(mainTip) ? ctx.t('invalidAmount') : (typeof mainTip === 'number' && !(hasMain && mainTip <= main) ? ctx.t('tipTooBig') : '');

    const lines = [];
    if (hasMain) lines.push({ k: hasExtra ? pname(sh.platform) : ctx.t('paid'), v: money(ctx, main) });
    if (hasMain && typeof mainTip === 'number' && mainTip > 0 && mainTip <= main) lines.push({ k: ctx.t('ofWhichTip'), v: money(ctx, mainTip), cls: 'kv-indent' });
    if (hasExtra) {
      lines.push({ k: 'Uber', v: money(ctx, extra) });
      if (typeof tip === 'number' && tip > 0) lines.push({ k: ctx.t('ofWhichTip'), v: money(ctx, tip), cls: 'kv-indent' });
    }
    const total = (hasMain ? main : 0) + (hasExtra ? extra : 0);
    const result = closeResult(ctx, sh, lines, total, hasMain, hasExtra);

    const payCard = card(`${moneyField(ctx, 'payMain', { label: ctx.t('howMuchPaid'), error: mainErr, describedBy: 'pay-help' })}
          ${tipsHere ? `${moneyField(ctx, 'payMainTip', { label: ctx.t('tipOptional'), error: mainTipErr })}<p class="note" id="pay-help">${esc(ctx.t('tipsLater'))}</p>` : `<p class="note" id="pay-help">${esc(ctx.t('payOptional'))}</p>`}
          ${!extrasHere ? '' : c.extrasOpen
            ? `<div class="extras">${moneyField(ctx, 'payX', { label: ctx.t('otherPlatformPay'), error: extraErr })}${moneyField(ctx, 'payXTip', { label: ctx.t('tipOptional'), error: tipErr })}</div>`
            : `<button class="link-button with-icon" ${act('openExtras')}>${icon('plus')}<span>${esc(ctx.t('addOtherPlatform'))}</span></button>`}`, 'card-pay');
    return closeFrame(ctx, payCard, result, Boolean(mainErr || extraErr || tipErr || mainTipErr));
  }

  // The close screen around its pay card: summary, result, station, trash and Done, the same in every variant.
  function closeFrame(ctx, payCard, result, anyErr) {
    const c = ctx.ui.close;
    const sh = c.shift;
    const f = ctx.ui.f;
    const station = c.stationDone ? '' : card(`<h3 class="card-title">${esc(ctx.t('saveStationQ'))}</h3>
      <p class="note">${esc(ctx.t('saveStationBody'))}</p>
      ${textField(ctx, 'station', { placeholder: ctx.t('stationPlaceholder') })}
      <div class="btn-row">${button(ctx.t('saveStation'), 'saveStation', undefined, { disabled: !(f.station || '').trim(), kind: 'secondary' })}${button(ctx.t('notNow'), 'skipStation', undefined, { kind: 'text' })}</div>`, 'card-station');

    return {
      header: navBar(ctx, ctx.t('summary')),
      body: `<h2 class="screen-subtitle">${esc(ctx.t('shiftComplete'))}</h2>
        ${card(kv([
          { k: ctx.t('date'), v: ctx.fmt.date(ctx.lang, sh.date) },
          { k: ctx.t('start'), v: ctx.fmt.time(ctx.lang, sh.start) },
          { k: ctx.t('end'), v: ctx.fmt.time(ctx.lang, sh.end) },
          { k: ctx.t('duration'), v: dur(sh) },
          { k: ctx.t('miles'), v: `${ctx.fmt.miles(ctx.lang, sh.miles, 2)} mi` }, '---',
          { k: ctx.t('estDeduction'), v: money(ctx, sh.deduction) }
        ]))}
        ${payCard}
        ${card(`<h3 class="card-title">${esc(ctx.t('afterGas'))}</h3>${result}`, 'card-result', 'aria-live="polite"')}
        ${station}
        <div class="center">${button(ctx.t('moveToTrash'), 'confirmTrash', undefined, { kind: 'destructive-text' })}</div>`,
      footer: `<div class="footer-bar">${button(ctx.t('done'), 'finishClose', undefined, { disabled: anyErr })}</div>`
    };
  }

  // ---------- History ----------

  function periodPicker(ctx) {
    const p = ctx.ui.period;
    const all = [['today', ctx.t('periodToday')], ['week', ctx.t('periodWeek')], ['month', ctx.t('periodMonth')], ['year', ctx.t('periodYear')], ['all', ctx.t('periodAll')], ['custom', ctx.t('periodCustom')]];
    const style = ctx.fam.period;
    if (style === 'segmented6') return segmented(all, p, 'setPeriod', { cls: 'segmented-text', label: ctx.t('periodLabel') });
    if (style === 'stepper') {
      const label = p === 'week' ? ctx.t('weekLabel') : p === 'year' ? '2026' : p === 'all' ? ctx.t('periodAll') : ctx.fmt.monthYear(ctx.lang, E.TODAY);
      return `<div class="stepper">
        ${segmented([['week', ctx.t('periodWeek')], ['month', ctx.t('periodMonth')], ['year', ctx.t('periodYear')], ['all', ctx.t('periodAll')]], p === 'today' || p === 'custom' ? 'month' : p, 'setPeriod', { cls: 'segmented-compact', label: ctx.t('periodLabel') })}
        <div class="stepper-row"><button class="icon-button" ${act('toast', 'periodDemo')} aria-label="${esc(ctx.t('periodPrev'))}">${icon('chevronLeft')}</button>
        <span class="stepper-label" aria-live="polite">${esc(label)}</span>
        <button class="icon-button" disabled aria-label="${esc(ctx.t('periodNext'))}">${icon('chevronRight')}</button></div>
      </div>`;
    }
    const main = [['week', ctx.t('periodWeek')], ['month', ctx.t('periodMonth')], ['year', ctx.t('periodYear')]];
    const isMore = !main.some(([id]) => id === p);
    const moreLabel = isMore ? all.find(([id]) => id === p)[1] : ctx.t('more');
    return `<div class="period-more">
      ${segmented([...main], isMore ? '' : p, 'setPeriod', { cls: 'segmented-soft', label: ctx.t('periodLabel') })}
      <button class="seg-more ${isMore ? 'is-selected' : ''}" ${act('togglePeriodMenu')} aria-expanded="${ctx.ui.periodMenu}" aria-haspopup="menu">${esc(moreLabel)}${icon('chevronDown')}</button>
      ${ctx.ui.periodMenu ? `<div class="menu" role="menu">${[all[0], all[4], all[5]].map(([id, l]) => `<button role="menuitemradio" aria-checked="${id === p}" class="menu-item" ${act('setPeriod', id)}>${esc(l)}${id === p ? icon('check') : ''}</button>`).join('')}</div>` : ''}
    </div>`;
  }

  function rateCard(ctx, s) {
    const fig = (v) => `<p class="rate-figure">${money(ctx, v)}<small> ${esc(ctx.t('perHr'))}</small></p>`;
    if (s.overflow) return card(`<h2 class="card-title">${esc(ctx.t('paidPerHourBeforeGas'))}</h2><p class="note">${esc(ctx.t('rateTooLarge'))}</p>`, 'card-rate');
    if (!s.rateCount) return card(`<h2 class="card-title">${esc(ctx.t('netPerHour'))}</h2><p class="note">${esc(ctx.t('netPerHourEmpty'))}</p>`, 'card-rate card-empty');
    const title = ctx.data.gasKnown ? ctx.t('afterGasPerHour') : ctx.t('paidPerHourBeforeGas');
    const best = s.best && s.worst && s.rateCount >= 3 ? kv([
      { k: ctx.t('bestShift'), v: `<span class="muted">${esc(ctx.fmt.date(ctx.lang, s.best.s.date).replace(/,? 2026/, ''))}</span> ${money(ctx, s.best.rate)} ${ctx.t('perHr')}` },
      { k: ctx.t('worstShift'), v: `<span class="muted">${esc(ctx.fmt.date(ctx.lang, s.worst.s.date).replace(/,? 2026/, ''))}</span> ${money(ctx, s.worst.rate)} ${ctx.t('perHr')}` }
    ]) : '';
    const plats = Object.entries(s.perPlatformRate).map(([p, r]) => ({ k: `${platformBadge(p)} ${esc(pname(p))}`, v: `${money(ctx, r)} ${ctx.t('perHr')}` }));
    return card(`<h2 class="card-title">${esc(title)}</h2>${fig(s.ratePerHour)}
      ${best ? `<div class="breakdown-sep"></div>${best}` : ''}
      <div class="breakdown-sep"></div>
      <p class="note">${esc(ctx.t('byPlatformNote'))}</p>${kv(plats, 'kv-platforms')}
      <p class="note">${esc(ctx.t('basedOnShifts', { a: s.rateCount, n: s.n }))}</p>`, 'card-rate');
  }

  function history(ctx) {
    const seg = ctx.ui.historySeg;
    const segs = segmented([['work', ctx.t('work')], ['personal', ctx.t('personal')]], seg, 'setHistorySeg', { cls: 'segmented-main', label: ctx.t('tabHistory') });
    let body = '';
    if (seg === 'work') {
      const shifts = ctx.data.shifts.filter((s) => E.inPeriod(s.date, ctx.ui.period)).sort(byDateDesc);
      const s = E.summarize(ctx.data, shifts);
      const missing = shifts.filter((x) => x.main === null);
      body += ctx.ui.period === 'custom' ? `<p class="note">${esc(ctx.t('customApprox'))}</p>` : '';
      if (missing.length) {
        body += `<button class="row row-card row-complete" ${act('openEditor')}><span class="row-icon">${icon('dollar')}</span>
          <span class="row-main"><span class="row-title">${esc(ctx.t('completePay'))}</span><span class="row-sub">${esc(ctx.t(missing.length === 1 ? 'shiftsWithoutPay' : 'shiftsWithoutPayPl', { n: missing.length }))}</span></span>
          <span class="row-chevron">${icon('chevronRight')}</span></button>`;
      }
      if (shifts.length) {
        body += rateCard(ctx, s);
        if (ctx.fam.weekChart && ctx.ui.weekMiles.some(Boolean)) body += card(E.weekChart(ctx, ctx.ui.weekMiles), 'card-chart');
        body += shiftList(ctx, shifts);
      } else {
        body += `<p class="empty">${esc(ctx.t('emptyWork'))}</p>`;
      }
    } else {
      const drives = ctx.data.personal.filter((d) => E.inPeriod(d.date, ctx.ui.period));
      const total = drives.reduce((a, d) => a + d.miles, 0);
      body += `<div class="personal-head"><h2 class="title2">${esc(ctx.t('personalHeader'))}</h2><span class="muted">${mi(ctx, total)}</span></div>
        <p class="note">${esc(ctx.t('personalExplain'))}</p>`;
      const days = {};
      for (const d of drives) (days[d.date] = days[d.date] || []).push(d);
      const keys = Object.keys(days).sort().reverse();
      body += keys.length ? `<div class="${ctx.fam.rows === 'card' ? 'stack' : 'list-group'}">${keys.map((k) => {
        const n = days[k].length;
        const m = days[k].reduce((a, d) => a + d.miles, 0);
        return row(ctx, { title: esc(ctx.fmt.date(ctx.lang, k, 'weekday')), sub: esc(ctx.t(n === 1 ? 'drives' : 'drivesPl', { n })), value: mi(ctx, m), iconName: 'car', action: 'openDay', arg: k, cls: ctx.fam.rows === 'card' ? 'row-card' : '' });
      }).join('')}</div>` : `<p class="empty">${esc(ctx.t('emptyPersonal'))}</p>`;
    }
    return {
      header: `<header class="history-head"><h1 class="sr-only" tabindex="-1" data-screen-heading>${esc(ctx.t('tabHistory'))}</h1>${segs}${periodPicker(ctx)}</header>`,
      body
    };
  }

  function day(ctx, { date }) {
    const drives = ctx.data.personal.filter((d) => d.date === date).sort(byDateDesc);
    return {
      header: navBar(ctx, ctx.fmt.date(ctx.lang, date), { back: true }),
      body: `<div class="${ctx.fam.rows === 'card' ? 'stack' : 'list-group'}">${drives.map((d) => {
        const extra = d.status === 'gap' ? `<span class="dr-note">${esc(ctx.t('gapRow'))}</span>`
          : d.status === 'interrupted' ? `<span class="dr-note"><strong>${esc(ctx.t('interrupted'))}</strong><br>${esc(ctx.t('interruptedBody'))}</span>` : '';
        return `<button class="shift-row shift-row-${ctx.fam.rows === 'card' ? 'card' : 'list'}" ${act('openTrip', d.id)}>
          <span class="sr-line1"><span class="platform-badge">${icon('car')}</span><span class="sr-date">${esc(ctx.fmt.date(ctx.lang, d.date))}</span><span class="sr-miles">${mi(ctx, d.miles)}</span></span>
          <span class="sr-line2"><span>${esc(range(ctx, d))}</span><span class="sr-dur">${dur(d)}</span></span>${extra}</button>`;
      }).join('')}</div>`
    };
  }

  function timeline(ctx, d) {
    const steps = [[ctx.t('tlStart'), d.start, 'ok']];
    if (d.status === 'gap') steps.push([ctx.t('tlGap'), '', 'gap']);
    if (d.status === 'interrupted') steps.push([ctx.t('tlStop'), '', 'stop']);
    steps.push([ctx.t('tlEnd'), d.end, 'ok']);
    return `<ol class="timeline" aria-label="${esc(ctx.t('timeline'))}">${steps.map(([l, tm, k]) => `<li class="tl-${k}"><span class="tl-dot" aria-hidden="true"></span><span class="tl-label">${esc(l)}</span>${tm ? `<span class="tl-time">${esc(ctx.fmt.time(ctx.lang, tm))}</span>` : ''}</li>`).join('')}</ol>`;
  }

  function trip(ctx, { id }) {
    const d = ctx.data.personal.find((x) => x.id === id);
    const v0 = ctx.famId === 'v0';
    return {
      header: navBar(ctx, ctx.t('personalTrip'), { back: true, backLabel: ctx.fmt.date(ctx.lang, d.date) }),
      body: `${E.map(ctx, d.route, { legend: !v0 })}
        ${v0 ? `<p class="note">${esc(ctx.t('mapLegend'))}</p>` : ''}
        ${!v0 && d.status !== 'ok' ? card(timeline(ctx, d), 'card-timeline') : ''}
        ${card(kv([
          { k: ctx.t('date'), v: ctx.fmt.date(ctx.lang, d.date) },
          { k: ctx.t('start'), v: ctx.fmt.time(ctx.lang, d.start) },
          { k: ctx.t('end'), v: ctx.fmt.time(ctx.lang, d.end) },
          { k: ctx.t('duration'), v: dur(d) },
          { k: ctx.t('personalMiles'), v: `${ctx.fmt.miles(ctx.lang, d.miles, 2)} mi` }
        ]))}
        ${d.status === 'gap' ? card(`<h3 class="card-title">${esc(ctx.t('gapTitle'))}</h3><p class="note">${esc(ctx.t('gapBody', { mi: ctx.fmt.miles(ctx.lang, d.miles, 2) }))}</p>`) : ''}
        ${d.status === 'interrupted' ? card(`<h3 class="card-title">${esc(ctx.t('interrupted'))}</h3><p class="note">${esc(ctx.t('interruptedBody'))}</p>`) : ''}
        ${card(`<p class="note">${esc(ctx.t('personalNotice'))}</p>`, 'card-quiet')}`
    };
  }

  function shiftDetail(ctx, { id }) {
    const s = ctx.data.shifts.find((x) => x.id === id);
    if (!s) return { header: navBar(ctx, ctx.t('workShift'), { back: true }), body: '' };
    const pay = [];
    pay.push({ k: pname(s.platform), v: s.main === null ? `<span class="muted">${esc(ctx.t('notLogged'))}</span>` : s.main === 'overflow' ? '—' : money(ctx, s.main) });
    if (s.tip) pay.push({ k: ctx.t('ofWhichTip'), v: money(ctx, s.tip), cls: 'kv-indent' });
    for (const x of s.extras) pay.push({ k: pname(x.platform), v: money(ctx, x.amount) });
    return {
      header: navBar(ctx, ctx.t('workShift'), { back: true }),
      body: `${E.map(ctx, s.route, { legend: ctx.famId !== 'v0' })}
        ${card(kv([
          { k: ctx.t('date'), v: ctx.fmt.date(ctx.lang, s.date) },
          { k: ctx.t('start'), v: ctx.fmt.time(ctx.lang, s.start) },
          { k: ctx.t('end'), v: ctx.fmt.time(ctx.lang, s.end) },
          { k: ctx.t('duration'), v: dur(s) },
          { k: ctx.t('miles'), v: `${ctx.fmt.miles(ctx.lang, s.miles, 2)} mi` }, '---',
          { k: ctx.t('estDeduction'), v: money(ctx, s.deduction) }
        ]))}
        ${card(`<h3 class="card-title">${esc(ctx.t('payLines'))}</h3>${kv(pay)}
          ${s.main === 'overflow' ? `<p class="note">${esc(ctx.t('tooLargeNote'))}</p>` : ''}
          <div class="btn-row">${button(ctx.t('editPay'), 'openEditor', s.id, { kind: 'secondary' })}</div>`)}
        <div class="center">${button(ctx.t('moveToTrash'), 'confirmTrash', s.id, { kind: 'destructive-text' })}</div>`
    };
  }

  // ---------- Export ----------

  function exportScreen(ctx) {
    const r = ctx.ui.exportRange;
    const shifts = ctx.data.shifts.filter((s) => E.inPeriod(s.date, r));
    const s = E.summarize(ctx.data, shifts);
    const ranges = [['month', ctx.t('periodMonth')], ['year', ctx.t('periodYear')], ['lastYear', ctx.t('lastYear')], ['all', ctx.t('periodAll')], ['custom', ctx.t('periodCustom')]];
    const summary = card(kv([
      { k: ctx.t('shifts'), v: ctx.fmt.int(ctx.lang, s.n) },
      { k: ctx.t('miles'), v: ctx.fmt.miles(ctx.lang, s.miles, 2) },
      { k: ctx.t('estimatedDeduction'), v: money(ctx, s.deduction) },
      { k: ctx.t('payLogged'), v: ctx.t('ofShifts', { a: s.withMain, n: s.n }) }
    ], ctx.fam.rows === 'table' ? 'kv-ledger' : ''));
    const years = segmented([['2025', '2025'], ['2026', '2026']], String(ctx.ui.pdfYear), 'setPdfYear', { cls: 'segmented-compact', label: ctx.t('taxYear') });
    const pdfText = `<h2 class="card-title">${esc(ctx.t('taxPdf'))}</h2><p class="note">${esc(ctx.t('taxPdfBody'))}</p><div class="field-label">${esc(ctx.t('taxYear'))}</div>${years}`;
    let body = `<h2 class="section-title">${esc(ctx.t('dateRange'))}</h2>${segmented(ranges, r, 'setExportRange', { cls: (ctx.famId === 'v0' ? 'segmented-text' : 'segmented-soft') + ' segmented-wrap', label: ctx.t('dateRange') })}${summary}`;
    if (ctx.fam.export === 'twoPrimary') {
      body += `${button(ctx.t('exportCsv'), 'toast', 'csvDemo')}<div class="divider"></div><section class="section">${pdfText}</section>${button(ctx.t('generatePdf'), 'openSheet', 'pdf')}`;
    } else {
      body += card(`${pdfText}${button(ctx.t('generatePdf'), 'openSheet', 'pdf', { icon: 'doc' })}`, 'card-pdf')
        + `<div class="center">${button(ctx.t('exportCsvSecondary'), 'toast', 'csvDemo', { kind: 'secondary', icon: 'export' })}</div>`;
    }
    return {
      header: ctx.famId === 'v0'
        ? `<h1 class="sr-only" tabindex="-1" data-screen-heading>${esc(ctx.t('tabExport'))}</h1>`
        : largeTitle(ctx, ctx.t('tabExport'), E.decoration(ctx)),
      body
    };
  }

  // ---------- Settings ----------

  function explain(ctx, key) {
    if (ctx.fam.settingsText === 'full') return `<p class="note">${esc(ctx.t(key + 'Full'))}</p>`;
    const open = ctx.ui.expanded[key];
    return `<p class="note">${esc(ctx.t(open ? key + 'Full' : key + 'Short'))}</p>
      <button class="link-button" ${act('expand', key)} aria-expanded="${!!open}">${esc(ctx.t(open ? 'showLess' : 'learnMore'))}</button>`;
  }

  function coverage(ctx) {
    const rows = [['covOpen', true], ['covBackground', true], ['covClosed', false]];
    return card(`<h3 class="card-title">${esc(ctx.t('coverage'))}</h3>
      <ul class="coverage">${rows.map(([k, ok]) => `<li class="${ok ? 'cov-yes' : 'cov-no'}"><span class="cov-icon">${icon(ok ? 'checkCircle' : 'x')}</span><span class="cov-state">${esc(ctx.t(k))}</span><span class="cov-res">${esc(ctx.t(ok ? 'covYes' : 'covNo'))}</span></li>`).join('')}</ul>`, 'card-coverage');
  }

  function settings(ctx) {
    const d = ctx.data;
    const v0 = ctx.famId === 'v0';
    const group = (title, inner) => `<section class="section"><h2 class="section-title">${esc(title)}</h2>${inner}</section>`;
    const rows = (items) => `<div class="${v0 ? 'stack' : 'list-group'}">${items.map((it) => row(ctx, { ...it, cls: v0 ? 'row-card' : '' })).join('')}</div>`;
    let tracking = card(toggle(esc(ctx.t('autoTrack')), d.autoPersonal, 'autoPersonal', explain(ctx, 'autoTrack')))
      + card(toggle(esc(ctx.t('lookup')), !!ctx.ui.lookup, 'lookup', explain(ctx, 'lookup')));
    if (!v0) tracking += coverage(ctx);
    if (!ctx.ui.dismissed.whatChanged) tracking += card(`<h3 class="card-title">${esc(ctx.t('whatChanged'))}</h3><p class="note">${esc(ctx.t('whatChangedBody'))}</p>${button(ctx.t('gotIt'), 'dismiss', 'whatChanged', { kind: 'tinted' })}`);
    if (d.autoPersonal && !ctx.ui.dismissed.wasClosed) tracking += card(`<p class="note">${esc(ctx.t('wasClosed'))}</p>${button(ctx.t('gotIt'), 'dismiss', 'wasClosed', { kind: 'tinted' })}`);
    if (d.permission === 'denied') tracking += card(`<p class="warn-title">${icon('warning')}<span>${esc(ctx.t('deniedTitle'))}</span></p><p class="note">${esc(ctx.t('deniedBody'))}</p>${button(ctx.t('openSettings'), 'toast', 'systemSettings', { kind: 'tinted' })}`, '', 'id="tracking-status"');
    if (d.permission === 'whenInUse') tracking += card(`<p class="warn-title">${icon('locationOff')}<span>${esc(ctx.t('alwaysTitle'))}</span></p><p class="note">${esc(ctx.t('alwaysBody'))}</p>${button(ctx.t('openSettings'), 'toast', 'systemSettings', { kind: 'tinted' })}`, '', 'id="tracking-status"');

    const general = rows([
      { title: esc(ctx.t('myVehicle')), iconName: 'fuel', action: 'push', arg: 'vehicle' },
      { title: esc(ctx.t('platforms')), iconName: 'box', action: 'push', arg: 'platforms' },
      { title: esc(ctx.t('myStations')), iconName: 'station', action: 'push', arg: 'stations' },
      { title: esc(ctx.t('expenses')), iconName: 'dollar', action: 'push', arg: 'expenses' },
      { title: esc(ctx.t('language')), iconName: 'globe', action: 'push', arg: 'language', value: esc(ctx.lang === 'es' ? 'Español' : 'English') },
      { title: esc(ctx.t('accessibility')), iconName: 'accessibility', action: 'push', arg: 'accessibilityInfo' }
    ]);
    const diag = card(toggle(`${icon('pulse')} ${esc(ctx.t('diagLog'))}`, !!ctx.ui.diag, 'diag', explain(ctx, 'diagLog'))
      + `<h3 class="card-title">${esc(ctx.t('discarded'))}</h3><p class="note">${esc(ctx.t('discardedBody'))}</p>`);
    return {
      header: largeTitle(ctx, ctx.t('tabSettings'), E.decoration(ctx)),
      body: group(ctx.t('tracking'), `<div class="stack">${tracking}</div>`)
        + group(ctx.t('general'), general)
        + diag
        + group(ctx.t('data'), rows([{ title: esc(ctx.t('trash')), iconName: 'trash', action: 'push', arg: 'trash', value: d.trash.length ? String(d.trash.length) : undefined }]))
        + group(ctx.t('support'), rows([
          { title: esc(ctx.t('help')), iconName: 'question', action: 'push', arg: 'help' },
          { title: esc(ctx.t('about')), iconName: 'info', action: 'push', arg: 'about' }
        ]))
    };
  }

  function simple(titleKey, bodyFn) {
    return (ctx) => ({ header: navBar(ctx, ctx.t(titleKey), { back: true }), body: `<p class="demo-note">${icon('info')}<span>${esc(ctx.t('approxScreen'))}</span></p>${bodyFn(ctx)}` });
  }

  const vehicle = simple('myVehicle', (ctx) => card(kv([
    { k: ctx.t('vehicle'), v: esc(ctx.t('vehicleExample')) },
    { k: ctx.t('mpg'), v: esc(ctx.t('mpgValue')) },
    { k: ctx.t('gasPrice'), v: ctx.data.gasPrice ? `${money(ctx, ctx.data.gasPrice)}${ctx.t('perGallon')}` : `<span class="muted">${esc(ctx.t('notSet'))}</span>` }
  ])) + `<p class="note">${esc(ctx.t('vehicleDemo'))}</p>`);

  const platforms = simple('platforms', (ctx) => card(Object.keys(E.PLATFORMS).map((p) =>
    `<div class="toggle-row"><span class="toggle-label">${platformBadge(p)} ${esc(pname(p))}</span><button class="switch" role="switch" aria-checked="${!ctx.ui.platformsOff[p]}" aria-label="${esc(pname(p))}" ${act('togglePlatform', p)}><span class="switch-knob"></span></button></div>`).join('')));

  const stations = simple('myStations', (ctx) => ctx.data.stations && ctx.data.stations.length
    ? `<div class="list-group">${ctx.data.stations.map((s) => row(ctx, { title: esc(s), iconName: 'station' })).join('')}</div>`
    : `<p class="empty">${esc(ctx.t('stationsBody'))}</p>`);

  const expenses = simple('expenses', (ctx) => `<p class="empty">${esc(ctx.t('expensesBody'))}</p>`);
  const help = simple('help', (ctx) => `<p class="note">${esc(ctx.t('helpBody'))}</p>`);
  const about = simple('about', (ctx) => `<p class="note">${esc(ctx.t('aboutBody'))}</p>${/^fondo/.test(ctx.circ || '') ? `<p class="note">${esc(ctx.t('startMapCredit'))}</p>` : ''}`);
  const accessibilityInfo = simple('accessibility', (ctx) => `<p class="note">${esc(ctx.t('accessibilityBody'))}</p>`);

  function language(ctx) {
    return {
      header: navBar(ctx, ctx.t('language'), { back: true }),
      body: `<div class="list-group" role="radiogroup" aria-label="${esc(ctx.t('language'))}">${[['en', 'English'], ['es', 'Español']].map(([id, l]) =>
        `<button class="row" role="radio" aria-checked="${ctx.lang === id}" ${act('setLang', id)}><span class="row-main"><span class="row-title">${l}</span></span>${ctx.lang === id ? `<span class="row-check">${icon('check')}</span>` : ''}</button>`).join('')}</div>`
    };
  }

  function trash(ctx) {
    const items = ctx.data.trash;
    return {
      header: navBar(ctx, ctx.t('trash'), { back: true }),
      body: items.length ? `<div class="stack">${items.map((s) => card(`<div class="sr-line1">${platformBadge(s.platform)}<span class="sr-date">${esc(ctx.fmt.date(ctx.lang, s.date))}</span><span class="sr-miles">${mi(ctx, s.miles)}</span></div>
        <div class="sr-line2"><span>${esc(range(ctx, s))}</span></div>${button(ctx.t('restore'), 'restore', s.id, { kind: 'secondary' })}`)).join('')}</div>`
        : `<p class="empty">${esc(ctx.t('trashEmpty'))}</p>`
    };
  }

  function calc(ctx) {
    const f = ctx.ui.f;
    const offer = parseAmount(f.calcOffer);
    const miles = parseAmount(f.calcMiles);
    const minutes = parseAmount(f.calcMinutes);
    const ok = typeof offer === 'number';
    const field = (key, label, unit) => `<div class="field"><label class="field-label" for="in-${key}">${esc(label)}</label><div class="field-row">${unit === '$' ? '<span class="field-prefix" aria-hidden="true">$</span>' : ''}<input class="input" id="in-${key}" data-field="${key}" data-fk="field:${key}" inputmode="decimal" value="${esc(f[key] || '')}" placeholder="0">${unit !== '$' ? `<span class="field-suffix">${unit}</span>` : ''}</div></div>`;
    return {
      header: navBar(ctx, ctx.t('calcTitle'), { back: true }),
      body: `<p class="demo-note">${icon('info')}<span>${esc(ctx.t('approxScreen'))}</span></p>
        ${card(field('calcOffer', ctx.t('calcOffer'), '$') + field('calcMiles', ctx.t('calcMiles'), 'mi') + field('calcMinutes', ctx.t('calcMinutes'), 'min'))}
        ${card(kv([
          { k: ctx.t('calcPerHour'), v: ok && typeof minutes === 'number' && minutes > 0 ? `${money(ctx, (offer / minutes) * 60)} ${ctx.t('perHr')}` : '—' },
          { k: ctx.t('calcPerMile'), v: ok && typeof miles === 'number' && miles > 0 ? `${money(ctx, offer / miles)}/mi` : '—' }
        ]) + `<p class="note">${esc(ctx.t('calcNote'))}</p>`, '', 'aria-live="polite"')}`
    };
  }

  // ---------- Sheets ----------

  function editorSheet(ctx) {
    const ed = ctx.ui.editor;
    if (ed.done) {
      return `${sheetBar(ctx, ctx.t('completePay'))}<div class="sheet-body sheet-center">
        <span class="done-icon">${icon('checkCircle')}</span>
        <h3 class="title2">${esc(ctx.t('allDone'))}</h3>
        <p class="muted">${esc(ctx.t('savedSkipped', { a: ed.saved, b: ed.skipped }))}</p>
        ${button(ctx.t('backToHistory'), 'closeSheet')}
      </div>`;
    }
    const s = ctx.data.shifts.find((x) => x.id === ed.queue[ed.i]);
    const f = ctx.ui.f;
    const amt = parseAmount(f.edAmt);
    const tip = parseAmount(f.edTip);
    const amtErr = Number.isNaN(amt) ? ctx.t('invalidEditor') : '';
    const tipErr = Number.isNaN(tip) ? ctx.t('invalidEditor') : (typeof tip === 'number' && typeof amt === 'number' && tip > amt ? ctx.t('tipTooBig') : '');
    const canSave = typeof amt === 'number' && !amtErr && !tipErr;
    const last = ed.i === ed.queue.length - 1;
    const showTip = s.platform !== 'amazonFlex';
    const n = ed.queue.length;
    return `${sheetBar(ctx, ctx.t('completePay'))}
      <div class="sheet-body">
        <div class="progress" aria-hidden="${ctx.famId === 'v0'}">
          <span class="progress-label">${esc(ctx.t('shiftNofM', { a: ed.i + 1, n }))}</span>
          ${ctx.famId !== 'v0' ? `<span class="progress-dots">${ed.queue.map((_, k) => `<span class="pdot ${k < ed.i ? 'is-past' : k === ed.i ? 'is-current' : ''}"></span>`).join('')}</span>` : ''}
        </div>
        ${card(`<div class="ed-platform">${platformBadge(s.platform)}<strong>${esc(pname(s.platform))}</strong></div>
          <div>${esc(ctx.fmt.date(ctx.lang, s.date, 'long'))}</div>
          <div class="muted">${esc(range(ctx, s))}</div>
          <div class="muted">${mi(ctx, s.miles)}</div>
          ${s.extras.map((x) => `<div class="muted">${esc(ctx.t('alreadyLogged', { p: pname(x.platform), amt: money(ctx, x.amount) }))}</div>`).join('')}`, 'card-editor')}
        ${moneyField(ctx, 'edAmt', { label: ctx.t('whatDidPay', { p: pname(s.platform) }), error: amtErr })}
        ${showTip ? moneyField(ctx, 'edTip', { label: ctx.t('tipOptional'), error: tipErr }) : ''}
        <div class="center">${button(ctx.t('notNow'), 'editorSkip', undefined, { kind: 'text' })}</div>
      </div>
      <div class="sheet-footer">${button(ctx.t(last ? 'save' : 'saveAndNext'), 'editorSave', undefined, { disabled: !canSave })}</div>`;
  }

  function seSheet(ctx) {
    const se = E.seIncome(ctx.data);
    const overflow = ctx.month.overflow;
    return `${sheetBar(ctx, ctx.t('seDetailTitle'), { left: `<button class="link-button" ${act('closeSheet')}>${esc(ctx.t('done'))}</button>` })}
      <div class="sheet-body">
        ${card(`<h3 class="title2">2026</h3>
          ${overflow ? `<p class="note">${esc(ctx.t('seNotEstimated'))}</p>` : kv([
            { k: ctx.t('workIncome'), v: money(ctx, se.income) },
            { k: ctx.t('mileageStd'), v: money(ctx, -se.deduction) }, '---',
            { k: ctx.t('netEarnings'), v: `<strong>${money(ctx, se.net)}</strong>` }
          ])}
          ${seText(ctx).slice(0, 1).map((x) => `<p class="note">${esc(x)}</p>`).join('')}
          ${se.a ? `<p class="note">${esc(ctx.t('seDetailBased', { a: se.a, n: se.n }))}</p>` : ''}`)}
        ${button(ctx.t('payIrs'), 'toast', 'externalDemo', { icon: 'external', kind: ctx.famId === 'v0' ? 'primary' : 'secondary' })}
        ${card(`<p class="note">${esc(ctx.t('seDisclaimer'))}</p>`, 'card-quiet')}
      </div>`;
  }

  function recoverySheet(ctx) {
    return `${sheetBar(ctx, ctx.t('shiftRecovery'), { left: '' })}
      <div class="sheet-body">
        <h3 class="title2">${esc(ctx.t('forgotEnd'))}</h3>
        <p class="note">${esc(ctx.t('forgotBody'))}</p>
        ${card(kv([
          { k: ctx.t('started'), v: `${ctx.fmt.date(ctx.lang, '2026-10-23')} · ${ctx.fmt.time(ctx.lang, '01:55')}` },
          { k: ctx.t('lastGps'), v: `${ctx.fmt.date(ctx.lang, '2026-10-23')} · ${ctx.fmt.time(ctx.lang, '04:55')}` },
          { k: ctx.t('milesTracked'), v: '40.00 mi' }
        ]))}
        ${button(ctx.t('endAtLastGps'), 'recoverEnd')}
        <p class="note">${esc(ctx.t('endAtLastGpsNote'))}</p>
        ${button(ctx.t('editEndTime'), 'recoverEdit', undefined, { kind: 'secondary' })}
        <p class="note">${esc(ctx.t('editEndTimeNote'))}</p>
        ${button(ctx.t('keepTracking'), 'recoverKeep', undefined, { kind: 'text' })}
        <p class="note">${esc(ctx.t('keepTrackingNote'))}</p>
      </div>`;
  }

  function pdfSheet(ctx) {
    const year = String(ctx.ui.pdfYear);
    const shifts = ctx.data.shifts.filter((s) => s.date.startsWith(year));
    const s = E.summarize(ctx.data, shifts);
    const se = E.seIncome(ctx.data);
    const d = (k, v, cls = '') => `<div class="doc-row ${cls}"><span>${k}</span><span>${v}</span></div>`;
    const months = Array.from({ length: 12 }, (_, m) => shifts.filter((x) => Number(x.date.slice(5, 7)) === m + 1).reduce((a, x) => a + x.miles, 0));
    const maxM = Math.max(...months, 1);
    const L = ctx.lang;
    return `${sheetBar(ctx, ctx.t('pdfPreview'), { left: `<button class="link-button" ${act('closeSheet')}>${esc(ctx.t('done'))}</button>` })}
      <div class="sheet-body">
        <p class="demo-note">${icon('doc')}<span>${esc(ctx.t('pdfSynthetic'))}</span></p>
        <article class="doc" lang="${L}">
          <h3>Earnly — ${esc(ctx.t('docTitle'))} ${year}</h3>
          <p class="doc-meta">${esc(ctx.t('vehicle'))}: ${esc(ctx.t('vehicleExample'))}</p>
          <h4>${esc(ctx.t('docMileage'))}</h4>
          ${d(ctx.t('shifts'), s.n)}${d(ctx.t('docBusinessMiles'), `${ctx.fmt.miles(L, s.miles)} mi`)}${d(ctx.t('estimatedDeduction'), money(ctx, s.deduction))}
          <h4>${esc(ctx.t('docPay'))}</h4>
          ${d(ctx.t('payLogged'), s.overflow ? '—' : money(ctx, s.paid))}${d(ctx.t('docShiftsWithPay'), `${s.withMain} / ${s.n}`)}
          ${Object.entries(s.byPlatform).map(([p, v]) => d(pname(p), money(ctx, v.amount), 'doc-indent')).join('')}
          <h4>${esc(ctx.t('docSe'))}</h4>
          <p>${esc(seText(ctx)[0])}</p>
          ${se.a ? `<p class="doc-small">${esc(ctx.t('seDetailBased', { a: se.a, n: se.n }))}</p>` : ''}
          <h4>${esc(ctx.t('docMonthly'))}</h4>
          <div class="doc-bars" aria-hidden="true">${months.map((v) => `<span style="height:${(v / maxM) * 40}px"></span>`).join('')}</div>
          <p class="doc-foot">${esc(ctx.t('docFoot'))}</p>
        </article>
      </div>`;
  }

  E.screens = {
    home: { render: home, ref: 'screens/05-coherencia-corregida/01-04, 01-personales-c34/01' },
    active: { render: active, approx: true },
    close: { render: closeShift, ref: 'screens/03-cierre-laboral/01-17' },
    calc: { render: calc, approx: true },
    history: { render: history, ref: 'screens/01-personales-c34/02-03, 04-completar-importes/02, 08' },
    day: { render: day, ref: 'screens/01-personales-c34/04' },
    trip: { render: trip, ref: 'screens/01-personales-c34/05-06, 15-16' },
    shift: { render: shiftDetail, approx: true },
    export: { render: exportScreen, ref: 'screens/04-completar-importes/12' },
    settings: { render: settings, ref: 'screens/02-ajustes-c34/09-11' },
    vehicle: { render: vehicle, approx: true },
    platforms: { render: platforms, approx: true },
    stations: { render: stations, approx: true },
    expenses: { render: expenses, approx: true },
    language: { render: language, approx: true },
    accessibilityInfo: { render: accessibilityInfo, approx: true },
    trash: { render: trash, approx: true },
    help: { render: help, approx: true },
    about: { render: about, approx: true }
  };
  E.sheets = {
    editor: { render: editorSheet, ref: 'screens/04-completar-importes/03-07, 16-18, 23-25' },
    seDetail: { render: seSheet, ref: 'screens/04-completar-importes/11 + 05-coherencia-corregida/03, 08' },
    notice: { render: noticeSheet, approx: true },
    recovery: { render: recoverySheet, ref: 'screens/03-cierre-laboral/00' },
    pdf: { render: pdfSheet, ref: 'screens/06-documentos-ejemplo (in-app preview is an approximation)' }
  };
})();
