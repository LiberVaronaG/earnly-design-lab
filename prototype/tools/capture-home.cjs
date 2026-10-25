// Phone-friendly PNGs of Home only: one image per family (light + dark, full length),
// plus 2x2 overviews. Usage: node prototype/tools/capture-home.cjs
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const INDEX = 'file://' + path.resolve(__dirname, '..', 'index.html');
const OUT = path.resolve(__dirname, '..', 'captures', 'home');
const FAMS = [['v0', 'V0 Actual'], ['v1', 'V1 Esencial'], ['v2', 'V2 Claridad'], ['v3', 'V3 Estudio']];
const W = 390;
// Stills are taken at a resting moment of the hat animation (after the drop-in).
const settle = (page) => page.evaluate(() => {
  document.querySelectorAll('svg').forEach((s) => { if (s.pauseAnimations) { s.pauseAnimations(); s.setCurrentTime(3); } });
  document.getAnimations().forEach((a) => { a.pause(); a.currentTime = 3000; });
});

// Renders Home in solo mode and returns a PNG tall enough to show the whole scroll content.
async function shot(page, hash, full) {
  await page.setViewportSize({ width: W, height: 844 });
  await page.goto(`${INDEX}#solo=1&lang=es&${hash}`);
  await page.waitForTimeout(250);
  await settle(page);
  if (full) {
    const extra = await page.evaluate(() => {
      const s = document.querySelector('.scroll');
      return s.scrollHeight - s.clientHeight;
    });
    if (extra > 0) {
      await page.setViewportSize({ width: W, height: 844 + extra });
      await page.waitForTimeout(150);
    }
  }
  return (await page.screenshot()).toString('base64');
}

async function sheet(browser, file, title, cells, cols) {
  const page = await browser.newPage({ deviceScaleFactor: 2 });
  await page.setContent(`<body style="margin:0;padding:24px;background:#e9e7e2;font:16px system-ui,sans-serif;color:#1d1d1b;display:inline-block">
    <h1 style="font-size:22px;margin:0 0 4px">${title}</h1>
    <p style="margin:0 0 18px;color:#5f5e5a">Prototipo en navegador · datos sintéticos · no es la app real</p>
    <div style="display:grid;grid-template-columns:repeat(${cols}, ${W}px);gap:24px;align-items:start">
      ${cells.map(([label, b64]) => `<figure style="margin:0"><figcaption style="font-weight:600;margin-bottom:8px">${label}</figcaption>
        <img style="display:block;width:${W}px;border-radius:28px;box-shadow:0 8px 24px rgba(0,0,0,.18)" src="data:image/png;base64,${b64}"></figure>`).join('')}
    </div></body>`);
  await page.waitForTimeout(200);
  const box = await page.evaluate(() => ({ w: document.body.offsetWidth, h: document.body.offsetHeight }));
  await page.setViewportSize({ width: box.w, height: box.h });
  await page.screenshot({ path: path.join(OUT, file), fullPage: true });
  await page.close();
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage({ deviceScaleFactor: 2 });

  const first = [];
  for (const [id, name] of FAMS) first.push([name, await shot(page, `family=${id}&screen=home&scenario=partial`, false)]);
  await sheet(browser, '00-inicio-4-familias.png', 'Inicio · las cuatro familias (claro, pago parcial)', first, 2);

  let n = 1;
  for (const [id, name] of FAMS) {
    const light = await shot(page, `family=${id}&screen=home&scenario=partial`, true);
    const dark = await shot(page, `family=${id}&screen=home&scenario=partial&theme=dark`, true);
    await sheet(browser, `0${n++}-inicio-${id}-completo.png`, `${name} · Inicio completo`, [['Claro', light], ['Oscuro', dark]], 2);
  }

  const open = [];
  for (const [id, name] of FAMS) open.push([name, await shot(page, `family=${id}&screen=homeBreakdown&scenario=partial`, true)]);
  await sheet(browser, '05-inicio-desglose-abierto.png', 'Inicio · desglose del cobro abierto', open, 2);

  // Christmas Home concepts (lab option), on the V3 base the owner preferred.
  const XMAS = [['xmas-elf', 'Duende'], ['xmas-snow', 'Nevada'], ['xmas-lights', 'Luces']];
  const grid = [];
  for (const [deco, label] of XMAS) grid.push([label, await shot(page, `family=v3&screen=home&scenario=partial&deco=${deco}`, false)]);
  grid.push(['Luces · oscuro', await shot(page, 'family=v3&screen=home&scenario=partial&deco=xmas-lights&theme=dark', false)]);
  await sheet(browser, '06-navidad-3-propuestas.png', 'Inicio navideño · 3 propuestas', grid, 2);
  n = 7;
  for (const [deco, label] of XMAS) {
    const light = await shot(page, `family=v3&screen=home&scenario=partial&deco=${deco}`, true);
    const dark = await shot(page, `family=v3&screen=home&scenario=partial&deco=${deco}&theme=dark`, true);
    await sheet(browser, `${String(n++).padStart(2, '0')}-navidad-${label.toLowerCase()}.png`, `Inicio navideño · ${label}`, [['Claro', light], ['Oscuro', dark]], 2);
  }
  // Close-ups of the decorated button at 3x.
  const cu = await browser.newPage({ viewport: { width: W, height: 844 }, deviceScaleFactor: 3 });
  const crops = [];
  for (const [deco, label] of XMAS) {
    await cu.goto(`${INDEX}#solo=1&lang=es&family=v3&screen=home&deco=${deco}`);
    await cu.waitForTimeout(250);
    await settle(cu);
    crops.push([label, (await (await cu.$('.start-wrap')).screenshot()).toString('base64')]);
  }
  await cu.close();
  await sheet(browser, '10-navidad-detalle-boton.png', 'Detalle del botón «Iniciar turno»', crops, 1);

  await browser.close();
  console.log('written to', OUT);
})();
