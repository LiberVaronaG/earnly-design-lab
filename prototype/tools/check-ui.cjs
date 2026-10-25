// Browser checks for the prototype (Chromium via Playwright).
// Usage: node prototype/tools/check-ui.cjs            (full matrix, ~2 min)
//        node prototype/tools/check-ui.cjs --quick    (V0 + V1 only)
// Results describe Chromium behaviour; they are not iOS, VoiceOver or keyboard tests on a device.
const { chromium } = require('playwright');
const path = require('path');

const INDEX = 'file://' + path.resolve(__dirname, '..', 'index.html');
const QUICK = process.argv.includes('--quick');
const FAMILIES = QUICK ? ['v0', 'v1'] : ['v0', 'v1', 'v2', 'v3'];
const SCREENS = ['home', 'homeBreakdown', 'homeOptions', 'active', 'close', 'closeResult', 'closeInvalid', 'closeExtras',
  'recovery', 'historyWork', 'historyPersonal', 'day', 'trip', 'tripGap', 'shift', 'editor', 'editorTip', 'editorDone',
  'seDetail', 'calc', 'export', 'pdf', 'settings', 'vehicle', 'trash'];
const SCENARIO_FOR = { recovery: 'orphan', trash: 'complete', closeResult: 'complete', pdf: 'complete' };

let failures = 0;
const fail = (msg) => { failures++; console.log('FAIL ' + msg); };
const info = [];

async function audit(page, label) {
  return page.evaluate(() => {
    const app = document.querySelector('.app');
    const out = { overflow: [], unnamed: [], tiny: [], small: 0 };
    for (const sc of app.querySelectorAll('.scroll, .sheet-body, .history-head, .large-title-bar, .navbar, .footer-bar, .tabbar')) {
      if (sc.scrollWidth > sc.clientWidth + 1) {
        const edge = sc.getBoundingClientRect().right;
        const culprit = [...sc.querySelectorAll('*')].filter((e) => e.getBoundingClientRect().right > edge + 1 && !e.closest('.segmented'))
          .map((e) => e.tagName.toLowerCase() + '.' + String(e.className.baseVal ?? e.className).split(' ')[0]).slice(-2).join(',');
        out.overflow.push(`${sc.className.split(' ')[0]} ${sc.scrollWidth}>${sc.clientWidth} [${culprit}]`);
      }
    }
    const appRect = app.getBoundingClientRect();
    for (const el of app.querySelectorAll('button, input, [tabindex="0"]')) {
      const r = el.getBoundingClientRect();
      if (!r.width || !r.height) continue;
      const inScroller = el.closest('.segmented');
      if (!inScroller && r.right > appRect.right + 1) out.overflow.push('element past edge: ' + (el.textContent || el.className).trim().slice(0, 30));
      const name = (el.getAttribute('aria-label') || el.textContent || el.getAttribute('placeholder') || '').trim()
        || (el.getAttribute('aria-labelledby') && document.getElementById(el.getAttribute('aria-labelledby'))?.textContent.trim())
        || (el.id && app.querySelector(`label[for="${el.id}"]`)?.textContent.trim());
      if (!name) out.unnamed.push(el.outerHTML.slice(0, 80));
      if (r.height < 24 || r.width < 24) out.tiny.push((el.textContent || el.className).trim().slice(0, 30) + ` ${Math.round(r.width)}x${Math.round(r.height)}`);
      else if (r.height < 44) out.small++;
    }
    return out;
  });
}

async function run() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const logs = [];
  page.on('console', (m) => { if (['error', 'warning'].includes(m.type())) logs.push(m.text()); });
  page.on('pageerror', (e) => logs.push('pageerror: ' + e.message));

  // 1. Matrix: every family x theme x language x screen, at 320 and 390 px, plus 200 % text at 320 px.
  const combos = [];
  for (const family of FAMILIES) for (const theme of ['light', 'dark']) for (const lang of ['en', 'es']) {
    combos.push({ family, theme, lang, width: 390, text: 1 });
    combos.push({ family, theme, lang, width: 320, text: 1 });
  }
  for (const family of FAMILIES) for (const lang of ['en', 'es']) combos.push({ family, theme: 'light', lang, width: 320, text: 2 });
  let checked = 0;
  let small = 0;
  for (const c of combos) {
    await page.setViewportSize({ width: c.width, height: 700 });
    for (const screen of SCREENS) {
      const scenario = SCENARIO_FOR[screen] || 'partial';
      const label = `${c.family}/${c.theme}/${c.lang}/${c.width}px/text${c.text}/${screen}`;
      logs.length = 0;
      await page.goto(`${INDEX}#solo=1&family=${c.family}&theme=${c.theme}&lang=${c.lang}&scenario=${scenario}&screen=${screen}&width=${c.width === 320 ? 320 : 390}&text=${c.text}`);
      await page.waitForSelector('.app .scroll, .app .sheet');
      const a = await audit(page, label);
      checked++;
      small += a.small;
      if (logs.length) fail(`${label}: console ${logs.join(' | ')}`);
      if (a.overflow.length) fail(`${label}: horizontal overflow ${a.overflow.join('; ')}`);
      if (a.unnamed.length) fail(`${label}: controls without a name ${a.unnamed.join('; ')}`);
      if (a.tiny.length) fail(`${label}: targets under 24px ${a.tiny.join('; ')}`);
    }
  }
  // Christmas start-button variants on Home: same audit, every family, 320/390 px and 200 % text.
  for (const deco of ['xmas-hat', 'xmas-ornament', 'xmas-wreath']) for (const family of FAMILIES) {
    for (const [width, text, theme] of [[390, 1, 'light'], [320, 1, 'dark'], [320, 2, 'light']]) {
      await page.setViewportSize({ width, height: 700 });
      const label = `${family}/${deco}/${theme}/${width}px/text${text}/home`;
      logs.length = 0;
      await page.goto(`${INDEX}#solo=1&family=${family}&theme=${theme}&lang=es&screen=home&width=${width === 320 ? 320 : 390}&text=${text}&deco=${deco}`);
      await page.waitForSelector('.app .scroll');
      const a = await audit(page, label);
      checked++;
      if (logs.length) fail(`${label}: console ${logs.join(' | ')}`);
      if (a.overflow.length) fail(`${label}: horizontal overflow ${a.overflow.join('; ')}`);
      if (a.unnamed.length) fail(`${label}: controls without a name ${a.unnamed.join('; ')}`);
      // The decoration must not cover the button label.
      const covered = await page.evaluate(() => {
        const label = document.querySelector('[data-action="startShift"] span');
        label.scrollIntoView({ block: 'center' });
        const r = label.getBoundingClientRect();
        const hit = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
        return !(hit && hit.closest('[data-action="startShift"]'));
      });
      if (covered) fail(`${label}: decoration covers the Start label`);
    }
  }
  info.push(`${checked} screen renders audited; ${small} control instances between 24 and 44 px tall (segments/inline links; see PRUEBAS.md)`);

  // 2. Flows (each in V0 and V1, EN and ES).
  await page.setViewportSize({ width: 390, height: 844 });
  for (const family of ['v0', 'v1']) for (const lang of ['en', 'es']) {
    const L = (en, es) => (lang === 'es' ? es : en);
    const go = (screen, scenario) => page.goto(`${INDEX}#solo=1&family=${family}&lang=${lang}&scenario=${scenario}&screen=${screen}`);
    const tag = `${family}/${lang}`;
    logs.length = 0;

    // Close a simulated shift: start → platform → end → pay 90 → $82.00 and $27.33/hr → Done.
    await go('home', 'complete');
    await page.click('[data-action="startShift"]');
    if (!(await page.isDisabled('[data-action="endShift"]'))) fail(`${tag}: End Shift enabled before a platform is chosen`);
    await page.click('[data-action="pickPlatform"][data-arg="amazonFlex"]');
    await page.click('[data-action="endShift"]');
    await page.fill('#in-payMain', '90');
    const result = await page.textContent('.card-result');
    if (!result.includes('$82.00') || !result.includes('$27.33')) fail(`${tag}: close result missing $82.00/$27.33: ${result.replace(/\s+/g, ' ')}`);
    if ((await page.evaluate(() => document.activeElement.id)) !== 'in-payMain') fail(`${tag}: focus lost while typing`);
    await page.fill('#in-payMain', '90..');
    if (!(await page.isVisible('#err-payMain'))) fail(`${tag}: invalid pay shows no error`);
    if (!(await page.isDisabled('[data-action="finishClose"]'))) fail(`${tag}: Done enabled with an invalid amount`);
    await page.fill('#in-payMain', '90');
    await page.click('[data-action="finishClose"]');
    if (!(await page.isVisible('.toast'))) fail(`${tag}: no confirmation after Done`);
    if (!(await page.isVisible('[data-action="startShift"]'))) fail(`${tag}: Done did not return Home`);

    // Complete pay amounts: invalid → error + disabled; tip > pay → refusal; save → not now → done → back.
    await go('historyWork', 'partial');
    await page.click('.row-complete');
    const save = '[data-action="editorSave"]';
    if (!(await page.isDisabled(save))) fail(`${tag}: Save enabled with empty field`);
    await page.fill('#in-edAmt', 'abc');
    if (!(await page.isVisible('#err-edAmt')) || !(await page.isDisabled(save))) fail(`${tag}: invalid amount not refused`);
    await page.fill('#in-edAmt', '12');
    if (await page.$('#in-edTip')) {
      await page.fill('#in-edTip', '15');
      if (!(await page.isVisible('#err-edTip')) || !(await page.isDisabled(save))) fail(`${tag}: tip > pay not refused`);
      await page.fill('#in-edTip', '2');
    }
    await page.click(save);
    await page.click('[data-action="editorSkip"]');
    const done = await page.textContent('.sheet');
    if (!done.includes(L('Saved: 1 · Not now: 1', 'Guardados: 1 · Ahora no: 1'))) fail(`${tag}: editor summary wrong: ${done.replace(/\s+/g, ' ')}`);
    await page.click('.sheet [data-action="closeSheet"]:not(.link-button)');
    const row = await page.textContent('.row-complete');
    if (!row.includes(L('1 shift without', '1 turno sin'))) fail(`${tag}: History did not update after saving: ${row}`);

    // Close (Cerrar) mid-way leaves the shift untouched.
    await page.click('.row-complete');
    await page.fill('#in-edAmt', '30');
    await page.click('.sheet-bar [data-action="closeSheet"]');
    if (!(await page.textContent('.row-complete')).includes(L('1 shift without', '1 turno sin'))) fail(`${tag}: Close changed data`);

    // Trash dialog: focus moves into it, Escape cancels, nothing is removed.
    await go('close', 'partial');
    await page.click('[data-action="confirmTrash"]');
    if (!(await page.evaluate(() => !!document.activeElement.closest('.dialog')))) fail(`${tag}: focus not moved into dialog`);
    await page.keyboard.press('Escape');
    if (await page.$('.dialog')) fail(`${tag}: Escape did not close dialog`);

    // Sheets: Escape closes the SE sheet; Tab stays inside it.
    await go('seDetail', 'partial');
    for (let i = 0; i < 8; i++) await page.keyboard.press('Tab');
    if (!(await page.evaluate(() => !!document.activeElement.closest('.sheet')))) fail(`${tag}: Tab escaped the sheet`);
    await page.keyboard.press('Escape');
    if (await page.$('.sheet')) fail(`${tag}: Escape did not close sheet`);

    // Keyboard reachability and visible focus on the tab bar.
    await go('home', 'partial');
    let reached = false;
    for (let i = 0; i < 40 && !reached; i++) {
      await page.keyboard.press('Tab');
      reached = await page.evaluate(() => document.activeElement.matches('.tab[data-arg="settings"]'));
    }
    if (!reached) fail(`${tag}: Settings tab not reachable by Tab`);
    const outline = await page.evaluate(() => getComputedStyle(document.activeElement).outlineStyle);
    if (outline === 'none') fail(`${tag}: no visible focus outline`);
    await page.keyboard.press('Enter');
    if (!(await page.isVisible('.screen-settings'))) fail(`${tag}: Enter on tab did not navigate`);

    // Language switch from Settings reaches the lab state.
    await page.click('[data-action="push"][data-arg="language"]');
    await page.click(`[data-action="setLang"][data-arg="${lang === 'es' ? 'en' : 'es'}"]`);
    const title = await page.textContent('.navbar-title');
    if (title !== (lang === 'es' ? 'Language' : 'Idioma')) fail(`${tag}: language switch did not re-render (${title})`);
    if (logs.length) fail(`${tag}: console during flows ${logs.join(' | ')}`);
  }
  info.push('flows: close shift, complete pay, Close without saving, trash dialog, sheet Escape/Tab trap, tab-bar keyboard, language switch');

  // 3. Lab page: compare keeps screen and data when the family changes; 200 % page zoom keeps controls usable.
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto(`${INDEX}#view=compare&family=v0&b=v2&scenario=partial&screen=historyWork`);
  const before = await page.$$eval('[data-slot] .row-complete', (els) => els.map((e) => e.textContent.trim()));
  await page.selectOption('#c-family', 'v3');
  const after = await page.$$eval('[data-slot] .row-complete', (els) => els.map((e) => e.textContent.trim()));
  if (before.length !== 2 || after.length !== 2 || before[0] !== after[0]) fail('compare: screen/data not preserved across family change');
  await page.evaluate(() => { document.body.style.zoom = '2'; });
  const ctl = await page.evaluate(() => {
    const r = document.getElementById('c-scenario').getBoundingClientRect();
    const st = document.getElementById('stage');
    return { visible: r.width > 0, overflow: document.documentElement.scrollWidth > window.innerWidth * 1.01, stage: st.scrollWidth > st.clientWidth };
  });
  if (!ctl.visible) fail('lab at 200 % zoom: controls hidden');
  if (ctl.overflow) fail('lab at 200 % zoom: whole page scrolls horizontally');
  info.push(`lab at 200 % zoom (compare view, 1280 px window): controls ${ctl.visible ? 'visible and wrapped' : 'hidden'}; page has no horizontal scroll; ${ctl.stage ? 'the fixed-size phone frames scroll inside the stage' : 'frames fit'}`);

  await browser.close();
  console.log(info.map((i) => 'info ' + i).join('\n'));
  console.log(failures ? `\n${failures} failure(s)` : '\nui checks ok');
  process.exit(failures ? 1 : 0);
}

run().catch((e) => { console.error(e); process.exit(1); });
