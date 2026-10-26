// Regenerates prototype/captures/*.png from the running prototype (Chromium).
// Usage: node prototype/tools/capture.cjs
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const INDEX = 'file://' + path.resolve(__dirname, '..', 'index.html');
const OUT = path.resolve(__dirname, '..', 'captures');

const GALLERY = [
  ['01-inicio-parcial-claro-en', 'view=gallery&screen=home&scenario=partial&lang=en'],
  ['02-inicio-parcial-oscuro-es', 'view=gallery&screen=home&scenario=partial&lang=es&theme=dark'],
  ['03-inicio-desglose-cifras-grandes', 'view=gallery&screen=homeBreakdown&scenario=tooLarge&lang=en'],
  ['04-historial-trabajo-completo', 'view=gallery&screen=historyWork&scenario=complete&lang=en'],
  ['05-historial-personal-oscuro', 'view=gallery&screen=historyPersonal&scenario=partial&lang=es&theme=dark'],
  ['06-detalle-personal-hueco-es', 'view=gallery&screen=tripGap&scenario=partial&lang=es'],
  ['07-cierre-resultado-oscuro-es', 'view=gallery&screen=closeResult&scenario=complete&lang=es&theme=dark'],
  ['08-cierre-otra-plataforma-parcial', 'view=gallery&screen=closeExtras&scenario=partial&lang=en'],
  ['09-completar-propina-rechazada', 'view=gallery&screen=editorTip&scenario=partial&lang=en'],
  ['10-completar-terminado-es', 'view=gallery&screen=editorDone&scenario=partial&lang=es'],
  ['11-recuperar-turno', 'view=gallery&screen=recovery&scenario=orphan&lang=en'],
  ['12-exportar-oscuro-es', 'view=gallery&screen=export&scenario=complete&lang=es&theme=dark'],
  ['13-ajustes', 'view=gallery&screen=settings&scenario=partial&lang=en'],
  ['14-autoempleo-hoja', 'view=gallery&screen=seDetail&scenario=partial&lang=en'],
  ['15-comparar-v0-v2-cierre', 'view=compare&family=v0&b=v2&screen=closeResult&scenario=complete&lang=en'],
  ['16-decoracion-navidad-opcional', 'view=compare&family=v1&b=v3&screen=home&scenario=complete&lang=es&deco=christmas']
];
const SOLO = [
  ['17-320px-texto-200-inicio', 'screen=home&scenario=partial&lang=es&text=2'],
  ['18-320px-texto-200-historial', 'screen=historyWork&scenario=partial&lang=en&text=2'],
  ['19-320px-texto-200-cierre', 'screen=closeResult&scenario=complete&lang=es&text=2'],
  ['20-320px-texto-200-ajustes', 'screen=settings&scenario=partial&lang=en&text=2']
];

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1800, height: 1000 } });
  for (const [name, hash] of GALLERY) {
    await page.goto(`${INDEX}#${hash}`);
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(OUT, name + '.png'), fullPage: true });
  }
  // Solo frames at 320 px with 200 % text: one image per family, side by side.
  const solo = await browser.newPage({ viewport: { width: 320, height: 640 } });
  for (const [name, hash] of SOLO) {
    const shots = [];
    for (const fam of ['v0', 'v1', 'v2', 'v3']) {
      await solo.goto(`${INDEX}#solo=1&family=${fam}&width=320&${hash}`);
      await solo.waitForTimeout(200);
      shots.push((await solo.screenshot()).toString('base64'));
    }
    const strip = await browser.newPage({ viewport: { width: 4 * 320 + 3 * 16 + 32, height: 640 + 64 } });
    await strip.setContent(`<body style="margin:0;padding:16px;background:#e9e7e2;display:flex;gap:16px;font:12px system-ui">
      ${shots.map((b, i) => `<figure style="margin:0"><figcaption style="height:22px">V${i}</figcaption><img width="320" height="640" src="data:image/png;base64,${b}"></figure>`).join('')}</body>`);
    await strip.screenshot({ path: path.join(OUT, name + '.png') });
    await strip.close();
  }
  await browser.close();
  console.log('captures written to', OUT);
})();
