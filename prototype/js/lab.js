// Lab shell: controls outside the phone frame, URL hash state and frame layout.
(function () {
  const E = window.E;
  const S = E.state;
  const FAMS = window.EARNLY_FAMILIES;
  const $ = (id) => document.getElementById(id);
  const HEIGHT = { 320: 640, 390: 844, 430: 932 };

  const SCREENS = [
    ['home', 'Inicio'], ['homeBreakdown', 'Inicio · desglose abierto'], ['homeOptions', 'Inicio · opciones'],
    ['active', 'Turno en curso (aprox.)'], ['close', 'Cierre · vacío'], ['closeResult', 'Cierre · resultado ($90)'],
    ['closeInvalid', 'Cierre · cantidad inválida'], ['closeExtras', 'Cierre · otra plataforma'], ['recovery', 'Recuperar turno (hoja)'],
    ['historyWork', 'Historial · Trabajo'], ['historyPersonal', 'Historial · Personal'], ['day', 'Día personal'],
    ['trip', 'Detalle personal'], ['tripGap', 'Detalle con hueco'], ['shift', 'Detalle de turno (aprox.)'],
    ['editor', 'Completar importes'], ['editorTip', 'Completar · propina rechazada'], ['editorDone', 'Completar · terminado'],
    ['seDetail', 'Autoempleo (hoja)'], ['calc', '¿Vale la pena? (aprox.)'], ['export', 'Exportar'], ['pdf', 'Vista previa PDF'],
    ['settings', 'Ajustes'], ['vehicle', 'Ajustes · vehículo (aprox.)'], ['trash', 'Ajustes · papelera (aprox.)']
  ];
  let screenId = 'home';

  function fill(select, entries) {
    select.innerHTML = entries.map(([v, l]) => `<option value="${v}">${l}</option>`).join('');
  }

  const DEFAULTS = { ...S.lab };

  // Missing parameters fall back to defaults, so a link always shows the same state.
  function readHash() {
    const h = new URLSearchParams(location.hash.slice(1));
    const L = Object.assign(S.lab, DEFAULTS);
    screenId = 'home';
    if (h.get('view')) L.view = h.get('view');
    if (FAMS[h.get('family')]) L.family = h.get('family');
    if (FAMS[h.get('b')]) L.familyB = h.get('b');
    if (['light', 'dark'].includes(h.get('theme'))) L.theme = h.get('theme');
    if (['en', 'es'].includes(h.get('lang'))) L.lang = h.get('lang');
    if (E.SCENARIOS[h.get('scenario')]) L.scenario = h.get('scenario');
    if (HEIGHT[h.get('width')]) L.width = Number(h.get('width'));
    if (h.get('text')) L.textScale = Number(h.get('text')) || 1;
    if (h.get('deco')) L.deco = h.get('deco');
    if (h.get('motion') === 'reduced') L.motion = 'reduced';
    L.solo = h.get('solo') === '1';
    L.tall = h.get('tall') === '1';
    if (E.JUMPS[h.get('screen')]) screenId = h.get('screen');
  }

  function writeHash() {
    const L = S.lab;
    const h = new URLSearchParams({ view: L.view, family: L.family, b: L.familyB, theme: L.theme, lang: L.lang, scenario: L.scenario, screen: screenId, width: L.width, text: L.textScale, deco: L.deco, motion: L.motion });
    if (L.solo) h.set('solo', '1');
    if (L.tall) h.set('tall', '1');
    history.replaceState(null, '', '#' + h.toString());
  }

  function syncControls() {
    const L = S.lab;
    $('c-view').value = L.view;
    $('c-family').value = L.family;
    $('c-familyB').value = L.familyB;
    $('c-theme').value = L.theme;
    $('c-lang').value = L.lang;
    $('c-scenario').value = L.scenario;
    $('c-screen').value = screenId;
    $('c-width').value = String(L.width);
    $('c-text').value = String(L.textScale);
    $('c-deco').value = L.deco;
    $('c-motion').value = L.motion;
    document.querySelectorAll('[data-when="compare"]').forEach((el) => { el.hidden = L.view !== 'compare'; });
    $('c-family').parentElement.hidden = L.view === 'gallery';
  }
  E.syncLab = () => { syncControls(); writeHash(); };

  function buildStage() {
    const L = S.lab;
    const fams = L.solo ? [L.family] : L.view === 'gallery' ? Object.keys(FAMS) : L.view === 'compare' ? [L.family, L.familyB] : [L.family];
    document.body.classList.toggle('is-solo', L.solo);
    const stage = $('stage');
    stage.innerHTML = fams.map((f, i) => `
      <section class="frame-col" aria-label="${FAMS[f].name.es}" style="--w:${L.width}px">
        ${L.solo ? '' : `<div class="frame-head"><strong>${FAMS[f].name.es}</strong><span>${FAMS[f].summary.es}</span></div>`}
        <div class="phone" style="--w:${L.width}px; --h:${L.tall ? 2200 : HEIGHT[L.width]}px" data-slot="${i}" data-family="${f}">
          <div class="app" data-family="${f}" data-theme="${L.theme}"></div>
        </div>
      </section>`).join('');
  }

  function updateInfo() {
    const i = E.info();
    const sc = E.SCENARIOS[S.lab.scenario];
    const src = i.approx
      ? '<span class="tag tag-approx">Aproximación</span> Sin captura nativa: propuesta del laboratorio.'
      : `<span class="tag tag-ref">Referencia</span> <code>${i.ref}</code>`;
    $('lab-info').innerHTML = `<span>Vista actual: <strong>${i.name}</strong></span><span>${src}</span>
      <span>Escenario: ${sc.label.es}${sc.ref ? ` (<code>${sc.ref}</code>)` : ' <span class="tag tag-approx">aprox.</span>'}</span>
      <span class="lab-hint">Navegador ≠ iOS: fuentes, teclado y VoiceOver son aproximados.</span>`;
  }
  E.onRender = updateInfo;

  function onControl() {
    const L = S.lab;
    const prev = { ...L };
    const prevScreen = screenId;
    L.view = $('c-view').value;
    L.family = $('c-family').value;
    L.familyB = $('c-familyB').value;
    L.theme = $('c-theme').value;
    L.lang = $('c-lang').value;
    L.scenario = $('c-scenario').value;
    screenId = $('c-screen').value;
    L.width = Number($('c-width').value);
    L.textScale = Number($('c-text').value);
    L.deco = $('c-deco').value;
    L.motion = $('c-motion').value;
    if (L.view === 'compare' && L.familyB === L.family) {
      L.familyB = Object.keys(FAMS).find((f) => f !== L.family);
    }
    if (prev.scenario !== L.scenario || prevScreen !== screenId) E.jump(screenId);
    if (prev.view !== L.view || prev.family !== L.family || prev.familyB !== L.familyB || prev.width !== L.width) buildStage();
    syncControls();
    writeHash();
    E.render();
  }

  function init() {
    fill($('c-family'), Object.values(FAMS).map((f) => [f.id, f.name.es]));
    fill($('c-familyB'), Object.values(FAMS).map((f) => [f.id, f.name.es]));
    fill($('c-scenario'), Object.entries(E.SCENARIOS).map(([id, s]) => [id, s.label.es]));
    fill($('c-screen'), SCREENS);
    readHash();
    E.jump(screenId);
    buildStage();
    syncControls();
    writeHash();
    E.render();
    $('lab-controls').addEventListener('change', onControl);
    document.addEventListener('click', E.handleClick);
    document.addEventListener('input', E.handleInput);
    document.addEventListener('keydown', E.handleKey);
    window.addEventListener('hashchange', () => { readHash(); E.jump(screenId); buildStage(); syncControls(); E.render(); });
  }

  init();
})();
