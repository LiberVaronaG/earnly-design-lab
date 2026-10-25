// Renders the animated Christmas Home concepts to MP4 (H.264, plays on iPhone) frame by
// frame, driving SVG (SMIL) and CSS animation clocks so every frame is exact.
// Usage: node prototype/tools/capture-hat-video.cjs   (needs ffmpeg)
const { chromium } = require('playwright');
const { execFileSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const os = require('os');

const INDEX = 'file://' + path.resolve(__dirname, '..', 'index.html');
const OUT = path.resolve(__dirname, '..', 'captures', 'home');
const FPS = 30;
const SECONDS = 8;
// The elf hat's press "hop" is a CSS transition in the app; here it is replayed at a fixed time.
const HOP = { at: 6.0, up: 0.12, hold: 0.18, down: 0.2 };

function hopAmount(t) {
  const { at, up, hold, down } = HOP;
  if (t < at || t > at + up + hold + down) return 0;
  if (t < at + up) return (t - at) / up;
  if (t < at + up + hold) return 1;
  return 1 - (t - at - up - hold) / down;
}

async function render(browser, name, hash, { selector, scale, width, height }) {
  const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: scale });
  await page.goto(`${INDEX}#solo=1&lang=es&${hash}`);
  await page.waitForTimeout(300);
  const target = selector ? await page.$(selector) : null;
  if (target) await target.scrollIntoViewIfNeeded();
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'hat-'));
  for (let i = 0; i < FPS * SECONDS; i++) {
    const t = i / FPS;
    await page.evaluate(([time, k]) => {
      document.querySelectorAll('svg').forEach((s) => { if (s.pauseAnimations) { s.pauseAnimations(); s.setCurrentTime(time); } });
      document.getAnimations().forEach((a) => { a.pause(); a.currentTime = time * 1000; });
      document.querySelectorAll('.xmas-elf').forEach((h) => { h.style.transition = 'none'; h.style.setProperty('--elf-hop', `${-6 * k}px`); });
      document.querySelectorAll('.start-circle').forEach((b) => { b.style.transition = 'none'; b.style.transform = k ? `scale(${1 - 0.03 * k})` : ''; });
    }, [t, hopAmount(t)]);
    const file = path.join(dir, `f${String(i).padStart(4, '0')}.png`);
    if (target) await target.screenshot({ path: file });
    else await page.screenshot({ path: file });
  }
  await page.close();
  const out = path.join(OUT, name);
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', String(FPS), '-i', path.join(dir, 'f%04d.png'),
    '-vf', 'scale=trunc(iw/2)*2:trunc(ih/2)*2', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '20', '-movflags', '+faststart', out]);
  fs.rmSync(dir, { recursive: true, force: true });
  console.log('wrote', out);
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch();
  await render(browser, '11-navidad-duende-detalle.mp4', 'family=v3&screen=home&deco=xmas-elf', { selector: '.start-wrap', scale: 3, width: 390, height: 844 });
  await render(browser, '12-navidad-duende.mp4', 'family=v3&screen=home&deco=xmas-elf', { scale: 2, width: 390, height: 844 });
  await render(browser, '13-navidad-nevada.mp4', 'family=v3&screen=home&deco=xmas-snow', { scale: 2, width: 390, height: 844 });
  await render(browser, '14-navidad-luces-oscuro.mp4', 'family=v3&screen=home&deco=xmas-lights&theme=dark', { scale: 2, width: 390, height: 844 });
  await browser.close();
})();
