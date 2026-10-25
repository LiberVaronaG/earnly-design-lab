// App core: one shared demo state rendered into one or more phone frames.
// All frames show the same route and data; only the family differs.
(function () {
  const E = window.E;
  const { icon, esc } = E;
  const TABS = ['home', 'history', 'export', 'settings'];
  const TAB_ICONS = { home: 'home', history: 'list', export: 'export', settings: 'gear' };

  function initialUi(data) {
    return {
      tab: 'home', stacks: { home: [], history: [], export: [], settings: [] },
      sheet: data.orphan ? 'recovery' : null, dialog: null, toast: null,
      heroOpen: false, optionsOpen: false, historySeg: 'work', period: 'month', periodMenu: false,
      exportRange: 'month', pdfYear: 2026, expanded: {}, f: {}, editor: null, close: null, active: null,
      dismissed: {}, lookup: false, diag: false, platformsOff: {}, weekMiles: E.WEEK_MILES.partial, nav: 0
    };
  }

  const state = {
    lab: { view: 'single', family: 'v0', familyB: 'v1', theme: 'light', lang: 'en', scenario: 'partial', width: 390, textScale: 1, deco: 'none', motion: 'normal', solo: false },
    data: null,
    ui: null
  };

  function resetScenario() {
    state.data = E.load(state.lab.scenario);
    state.data.stations = [];
    state.ui = initialUi(state.data);
    state.ui.weekMiles = E.WEEK_MILES[state.lab.scenario];
  }

  const current = () => {
    const st = state.ui.stacks[state.ui.tab];
    return st.length ? st[st.length - 1] : { name: state.ui.tab, params: {} };
  };
  const navigated = () => { state.ui.nav += 1; state.ui.periodMenu = false; };
  const push = (name, params = {}) => { state.ui.stacks[state.ui.tab].push({ name, params }); navigated(); };
  const toast = (key) => { state.ui.toast = { key, id: Date.now() }; };

  function openEditor(ids) {
    const queue = ids || state.data.shifts.filter((s) => s.main === null && E.inPeriod(s.date, state.ui.period)).sort((a, b) => b.date.localeCompare(a.date)).map((s) => s.id);
    if (!queue.length) return;
    state.ui.editor = { queue, i: 0, saved: 0, skipped: 0, done: false };
    state.ui.f.edAmt = '';
    state.ui.f.edTip = '';
    state.ui.sheet = 'editor';
    navigated();
  }

  function startClose() {
    state.ui.close = { shift: JSON.parse(JSON.stringify(E.CLOSE_SHIFT)), extrasOpen: false, stationDone: false };
    Object.assign(state.ui.f, { payMain: '', payX: '', payXTip: '', station: '' });
    state.ui.tab = 'home';
    state.ui.stacks.home = [{ name: 'close', params: {} }];
    navigated();
  }

  const actions = {
    tab(arg) {
      if (state.ui.tab === arg) state.ui.stacks[arg] = [];
      state.ui.tab = arg;
      navigated();
    },
    back() { state.ui.stacks[state.ui.tab].pop(); navigated(); },
    push(arg) { push(arg); },
    toggleHero() { state.ui.heroOpen = !state.ui.heroOpen; },
    toggleOptions() { state.ui.optionsOpen = !state.ui.optionsOpen; },
    openSheet(arg) { state.ui.sheet = arg; navigated(); },
    closeSheet() {
      state.ui.sheet = null;
      state.ui.editor = null;
      navigated();
    },
    openTrackingSettings() {
      state.ui.tab = 'settings';
      state.ui.stacks.settings = [];
      state.ui.focusTarget = 'tracking-status';
      navigated();
    },
    openPersonal() {
      state.ui.tab = 'history';
      state.ui.stacks.history = [];
      state.ui.historySeg = 'personal';
      navigated();
    },
    viewAll() { state.ui.tab = 'history'; state.ui.stacks.history = []; state.ui.historySeg = 'work'; navigated(); },
    startShift() { state.ui.active = { platform: null }; push('active'); },
    pickPlatform(arg) { state.ui.active.platform = arg; },
    endShift() { startClose(); },
    openExtras() { state.ui.close.extrasOpen = true; state.ui.focusTarget = 'in-payX'; },
    saveStation() {
      state.data.stations.push(state.ui.f.station.trim());
      state.ui.close.stationDone = true;
      toast('savedDemo');
    },
    skipStation() { state.ui.close.stationDone = true; },
    confirmTrash(arg) { state.ui.dialog = { kind: 'trash', id: arg || null }; },
    cancelDialog() { state.ui.dialog = null; },
    doTrash() {
      const id = state.ui.dialog.id;
      state.ui.dialog = null;
      if (id) {
        const idx = state.data.shifts.findIndex((s) => s.id === id);
        if (idx >= 0) state.data.trash.push(...state.data.shifts.splice(idx, 1));
        state.ui.stacks[state.ui.tab].pop();
      } else {
        state.ui.close = null;
        state.ui.stacks.home = [];
      }
      toast('trashedDemo');
      navigated();
    },
    finishClose() {
      const c = state.ui.close;
      const f = state.ui.f;
      const main = E.parseAmount(f.payMain);
      const extra = c.extrasOpen ? E.parseAmount(f.payX) : '';
      const tip = c.extrasOpen ? E.parseAmount(f.payXTip) : '';
      const sh = c.shift;
      state.data.shifts.push({
        id: sh.id + Date.now(), kind: 'work', platform: sh.platform, date: sh.date, start: sh.start, end: sh.end,
        miles: sh.miles, deduction: sh.deduction, gas: state.data.gasKnown ? sh.gasKnownCost : null, route: sh.route,
        main: typeof main === 'number' ? main : null, tip: 0,
        extras: typeof extra === 'number' ? [{ platform: 'uber', amount: extra, tip: typeof tip === 'number' ? tip : 0 }] : []
      });
      state.ui.close = null;
      state.ui.stacks.home = [];
      toast('savedDemo');
      navigated();
    },
    recoverEnd() { state.ui.sheet = null; state.data.orphan = false; startClose(); },
    recoverEdit() { state.ui.sheet = null; state.data.orphan = false; toast('editTimeDemo'); startClose(); },
    recoverKeep() { state.ui.sheet = null; state.data.orphan = false; state.ui.active = { platform: 'amazonFlex' }; push('active'); },
    setHistorySeg(arg) { state.ui.historySeg = arg; },
    setPeriod(arg) { state.ui.period = arg; state.ui.periodMenu = false; },
    togglePeriodMenu() { state.ui.periodMenu = !state.ui.periodMenu; },
    openShift(arg) { push('shift', { id: arg }); },
    openDay(arg) { push('day', { date: arg }); },
    openTrip(arg) { push('trip', { id: arg }); },
    openEditor(arg) { openEditor(arg ? [arg] : null); },
    editorSave() {
      const ed = state.ui.editor;
      const s = state.data.shifts.find((x) => x.id === ed.queue[ed.i]);
      s.main = E.parseAmount(state.ui.f.edAmt);
      const tip = E.parseAmount(state.ui.f.edTip);
      s.tip = typeof tip === 'number' ? tip : 0;
      ed.saved += 1;
      advanceEditor();
    },
    editorSkip() { state.ui.editor.skipped += 1; advanceEditor(); },
    setExportRange(arg) { state.ui.exportRange = arg; },
    setPdfYear(arg) { state.ui.pdfYear = Number(arg); },
    expand(arg) { state.ui.expanded[arg] = !state.ui.expanded[arg]; },
    toggle(arg) {
      if (arg === 'autoPersonal') state.data.autoPersonal = !state.data.autoPersonal;
      else state.ui[arg] = !state.ui[arg];
    },
    togglePlatform(arg) { state.ui.platformsOff[arg] = !state.ui.platformsOff[arg]; },
    dismiss(arg) { state.ui.dismissed[arg] = true; },
    setLang(arg) { state.lab.lang = arg; E.syncLab && E.syncLab(); },
    restore(arg) {
      const idx = state.data.trash.findIndex((s) => s.id === arg);
      if (idx >= 0) state.data.shifts.push(...state.data.trash.splice(idx, 1));
      toast('restoredDemo');
    },
    toast(arg) { toast(arg); }
  };

  function advanceEditor() {
    const ed = state.ui.editor;
    state.ui.f.edAmt = '';
    state.ui.f.edTip = '';
    if (ed.i < ed.queue.length - 1) ed.i += 1;
    else ed.done = true;
    navigated();
  }

  // ---------- rendering ----------

  function ctxFor(famId) {
    const lang = state.lab.lang;
    const monthShifts = state.data.shifts.filter((s) => E.inPeriod(s.date, 'month'));
    return {
      famId, fam: window.EARNLY_FAMILIES[famId].composition, lang,
      t: (k, v) => E.t(lang, k, v), fmt: E.fmt, data: state.data, ui: state.ui,
      month: E.summarize(state.data, monthShifts), lab: state.lab
    };
  }

  function statusBar() {
    return `<div class="statusbar" aria-hidden="true"><span class="sb-time">9:41</span><span class="sb-island"></span>
      <span class="sb-icons"><svg viewBox="0 0 18 12" width="17" height="11"><rect x="0" y="8" width="3" height="4" rx="1"/><rect x="5" y="5" width="3" height="7" rx="1"/><rect x="10" y="2" width="3" height="10" rx="1"/><rect x="15" y="0" width="3" height="12" rx="1" opacity=".35"/></svg>
      <svg viewBox="0 0 26 12" width="25" height="12"><rect x=".5" y=".5" width="22" height="11" rx="3" fill="none" stroke="currentColor" opacity=".5"/><rect x="2" y="2" width="16" height="8" rx="2"/><rect x="23.5" y="4" width="2" height="4" rx="1" opacity=".5"/></svg></span></div>`;
  }

  function tabBar(ctx) {
    return `<nav class="tabbar" aria-label="${esc(ctx.t('tabsLabel'))}">${TABS.map((t) => {
      const on = state.ui.tab === t;
      const label = ctx.t('tab' + t[0].toUpperCase() + t.slice(1));
      return `<button class="tab ${on ? 'is-active' : ''}" ${E.act('tab', t)} ${on ? 'aria-current="page"' : ''}>${icon(TAB_ICONS[t])}<span>${esc(label)}</span></button>`;
    }).join('')}</nav>`;
  }

  function dialog(ctx) {
    const d = state.ui.dialog;
    if (!d) return '';
    return `<div class="dialog-backdrop"><div class="dialog" role="alertdialog" aria-modal="true" aria-labelledby="dlg-title" aria-describedby="dlg-body">
      <h2 id="dlg-title" class="dialog-title" tabindex="-1" data-dialog-heading>${esc(ctx.t('trashConfirmTitle'))}</h2>
      <p id="dlg-body" class="note">${esc(ctx.t('trashConfirmBody'))}</p>
      <div class="dialog-actions">${E.button(ctx.t('cancel'), 'cancelDialog', undefined, { kind: 'secondary' })}${E.button(ctx.t('moveToTrash'), 'doTrash', undefined, { kind: 'destructive' })}</div>
    </div></div>`;
  }

  E.decoration = function (ctx) {
    const deco = ctx.lab.deco;
    if (deco === 'halloween') {
      return `<svg class="deco" viewBox="0 0 64 40" aria-hidden="true"><path d="M8 14c4-4 8-4 10 0 2-4 6-4 10 0-3 0-6 2-10 6-4-4-7-6-10-6z" fill="var(--color-text-muted)" opacity=".55"/>
        <ellipse cx="44" cy="28" rx="13" ry="10" fill="var(--color-hour2)"/><path d="M44 18v-4" stroke="var(--color-action)" stroke-width="2.5" stroke-linecap="round"/>
        <path d="M37 21c-1 4-1 10 1 14M51 21c1 4 1 10-1 14M44 18v20" stroke="rgba(0,0,0,.18)" stroke-width="1.2" fill="none"/></svg>`;
    }
    if (deco === 'christmas') {
      return `<svg class="deco" viewBox="0 0 64 40" aria-hidden="true"><g fill="var(--color-action)"><path d="M30 26c-6-10 2-16 10-14-2 6-4 10-10 14z"/><path d="M34 26c8-6 16-2 16 6-6 0-10-2-16-6z"/></g>
        <circle cx="31" cy="28" r="3.2" fill="var(--color-destructive-fill)"/><circle cx="36" cy="30" r="3.2" fill="var(--color-destructive-fill)"/>
        <g fill="var(--color-text-muted)" opacity=".5"><circle cx="10" cy="10" r="1.6"/><circle cx="20" cy="22" r="1.2"/><circle cx="56" cy="8" r="1.4"/><circle cx="8" cy="30" r="1"/></g></svg>`;
    }
    return '';
  };

  function renderApp(famId) {
    const ctx = ctxFor(famId);
    const route = current();
    const screen = E.screens[route.name];
    const out = screen.render(ctx, route.params || {});
    const sheet = state.ui.sheet ? E.sheets[state.ui.sheet].render(ctx) : '';
    const t = state.ui.toast;
    const toastKey = t ? (t.key in E.STRINGS.en ? t.key : 'savedDemo') : null;
    return `${statusBar()}
      <div class="screen screen-${route.name}" ${sheet || state.ui.dialog ? 'inert aria-hidden="true"' : ''}>
        ${out.header || ''}
        <div class="scroll" data-scroll="${route.name}">${out.body}<div class="scroll-end"></div></div>
        ${out.footer || ''}
      </div>
      <div class="tabbar-wrap" ${sheet || state.ui.dialog ? 'inert aria-hidden="true"' : ''}>${tabBar(ctx)}<div class="home-indicator" aria-hidden="true"></div></div>
      ${sheet ? `<div class="sheet-backdrop"><div class="sheet sheet-${state.ui.sheet}" role="dialog" aria-modal="true" aria-labelledby="sheet-title">${sheet}</div></div>` : ''}
      ${dialog(ctx)}
      ${t ? `<div class="toast" role="status">${icon('info')}<span>${esc(ctx.t(toastKey))}</span></div>` : ''}`;
  }

  // Render all frames, keeping focus and scroll stable across re-renders.
  let lastNav = -1;
  function render() {
    const slots = [...document.querySelectorAll('[data-slot]')];
    const active = document.activeElement;
    const activeSlot = active && active.closest && active.closest('[data-slot]');
    const fk = active && active.getAttribute && active.getAttribute('data-fk');
    const sel = active && 'selectionStart' in active ? [active.selectionStart, active.selectionEnd] : null;
    const scrolls = slots.map((s) => {
      const sc = s.querySelector('.scroll');
      const sh = s.querySelector('.sheet-body');
      return { scroll: sc ? sc.scrollTop : 0, sheet: sh ? sh.scrollTop : 0 };
    });
    const isNav = state.ui.nav !== lastNav;
    for (const slot of slots) {
      const app = slot.querySelector('.app');
      app.dataset.family = slot.dataset.family;
      app.dataset.theme = state.lab.theme;
      app.lang = state.lab.lang;
      app.style.setProperty('--text-scale', state.lab.textScale);
      app.dataset.ax = String(state.lab.textScale >= 1.6);
      app.dataset.deco = state.lab.deco;
      app.dataset.motion = state.lab.motion;
      app.innerHTML = renderApp(slot.dataset.family);
    }
    slots.forEach((s, i) => {
      if (isNav) return;
      const sc = s.querySelector('.scroll');
      const sh = s.querySelector('.sheet-body');
      if (sc) sc.scrollTop = scrolls[i].scroll;
      if (sh) sh.scrollTop = scrolls[i].sheet;
    });
    const target = activeSlot ? slots.indexOf(activeSlot) : -1;
    const slot = target >= 0 ? slots[target] : slots[0];
    let el = null;
    if (state.ui.focusTarget && slot) {
      el = slot.querySelector('#' + state.ui.focusTarget);
      if (el && !el.matches('input, button')) el.setAttribute('tabindex', '-1');
      state.ui.focusTarget = null;
    } else if (state.ui.dialog && slot) {
      el = slot.querySelector('[data-dialog-heading]');
    } else if (fk && target >= 0 && !isNav) {
      el = slot.querySelector(`[data-fk="${CSS.escape(fk)}"]`);
    } else if (isNav && target >= 0) {
      el = slot.querySelector('.sheet [data-screen-heading]') || slot.querySelector('[data-screen-heading]');
    }
    if (el) {
      el.focus({ preventScroll: !isNav });
      if (sel && el.setSelectionRange && el.value !== undefined) { try { el.setSelectionRange(sel[0], sel[1]); } catch (e) { /* number inputs */ } }
      if (isNav && el.id && el.id.startsWith('tracking')) el.scrollIntoView({ block: 'center' });
    }
    lastNav = state.ui.nav;
    if (state.ui.toast) {
      const id = state.ui.toast.id;
      setTimeout(() => { if (state.ui.toast && state.ui.toast.id === id) { state.ui.toast = null; render(); } }, 2600);
    }
    if (E.onRender) E.onRender();
  }

  function handleClick(e) {
    const el = e.target.closest('[data-action]');
    if (!el || !el.closest('.app') || el.disabled) return;
    const fn = actions[el.dataset.action];
    if (!fn) return console.warn('no action', el.dataset.action);
    e.preventDefault();
    fn(el.dataset.arg);
    render();
  }

  function handleInput(e) {
    const el = e.target;
    if (!el.dataset || !el.dataset.field || !el.closest('.app')) return;
    state.ui.f[el.dataset.field] = el.value;
    render();
  }

  function handleKey(e) {
    if (!e.target.closest || !e.target.closest('.app')) return;
    if (e.key === 'Escape') {
      if (state.ui.dialog) actions.cancelDialog();
      else if (state.ui.periodMenu) state.ui.periodMenu = false;
      else if (state.ui.sheet && state.ui.sheet !== 'recovery') actions.closeSheet();
      else return;
      e.preventDefault();
      render();
    }
    // Keep Tab inside an open sheet or dialog.
    if (e.key === 'Tab' && (state.ui.sheet || state.ui.dialog)) {
      const box = e.target.closest('.app').querySelector(state.ui.dialog ? '.dialog' : '.sheet');
      const items = [...box.querySelectorAll('button:not([disabled]), input, [tabindex="0"]')];
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { last.focus(); e.preventDefault(); }
      else if (!e.shiftKey && document.activeElement === last) { first.focus(); e.preventDefault(); }
    }
  }

  // Jump points for the lab's screen selector. Each resets the UI, then sets a route.
  const JUMPS = {
    home: () => {},
    homeBreakdown: () => { state.ui.heroOpen = true; },
    homeOptions: () => { state.ui.optionsOpen = true; },
    active: () => { state.ui.active = { platform: 'amazonFlex' }; push('active'); },
    close: () => { startClose(); },
    closeResult: () => { startClose(); state.ui.f.payMain = '90'; },
    closeInvalid: () => { startClose(); state.ui.f.payMain = '90..'; },
    closeExtras: () => { startClose(); state.ui.close.extrasOpen = true; Object.assign(state.ui.f, { payX: '20', payXTip: '5' }); },
    recovery: () => { state.ui.sheet = 'recovery'; },
    historyWork: () => { state.ui.tab = 'history'; },
    historyPersonal: () => { state.ui.tab = 'history'; state.ui.historySeg = 'personal'; },
    day: () => { state.ui.tab = 'history'; state.ui.historySeg = 'personal'; push('day', { date: '2026-10-22' }); },
    trip: () => { state.ui.tab = 'history'; state.ui.historySeg = 'personal'; push('day', { date: '2026-10-22' }); push('trip', { id: 'p4' }); },
    tripGap: () => { state.ui.tab = 'history'; state.ui.historySeg = 'personal'; push('day', { date: '2026-10-22' }); push('trip', { id: 'p2' }); },
    shift: () => { state.ui.tab = 'history'; const s = state.data.shifts[0]; if (s) push('shift', { id: s.id }); },
    editor: () => { state.ui.tab = 'history'; openEditor(); },
    editorTip: () => { state.ui.tab = 'history'; openEditor(); const ed = state.ui.editor; if (ed) { const i = ed.queue.findIndex((id) => state.data.shifts.find((s) => s.id === id).platform !== 'amazonFlex'); if (i >= 0) ed.i = i; Object.assign(state.ui.f, { edAmt: '12', edTip: '15' }); } },
    editorDone: () => { state.ui.tab = 'history'; openEditor(); if (state.ui.editor) Object.assign(state.ui.editor, { done: true, saved: 1, skipped: 1 }); },
    seDetail: () => { state.ui.sheet = 'seDetail'; },
    calc: () => { push('calc'); },
    export: () => { state.ui.tab = 'export'; },
    pdf: () => { state.ui.tab = 'export'; state.ui.sheet = 'pdf'; },
    settings: () => { state.ui.tab = 'settings'; },
    vehicle: () => { state.ui.tab = 'settings'; push('vehicle'); },
    trash: () => { state.ui.tab = 'settings'; push('trash'); }
  };

  function jump(id) {
    resetScenario();
    if (JUMPS[id]) JUMPS[id]();
    if (id !== 'recovery' && id !== 'home' && state.ui.sheet === 'recovery') state.ui.sheet = null;
    navigated();
  }

  function info() {
    const route = current();
    const def = state.ui.sheet ? E.sheets[state.ui.sheet] : E.screens[route.name];
    return { name: state.ui.sheet || route.name, ref: def.ref || null, approx: !!def.approx };
  }

  Object.assign(E, { state, actions, render, resetScenario, jump, JUMPS, info, handleClick, handleInput, handleKey });
})();
