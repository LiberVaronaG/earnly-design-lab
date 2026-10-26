// WCAG contrast check of the text/background pairs the components actually use,
// for every family and theme. Usage: node prototype/tools/check-contrast.mjs
// V0 failures inherited from TOKENS-BASE.json are reported but allowed (see DECISIONES.md).
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const tokens = JSON.parse(readFileSync(join(root, 'design-tokens.json'), 'utf8'));

// [foreground, background, minimum ratio, what it is]
const PAIRS = [
  ['text', 'bg', 4.5, 'body text'],
  ['text', 'surface', 4.5, 'card text'],
  ['textMuted', 'bg', 4.5, 'secondary text'],
  ['textMuted', 'surface', 4.5, 'secondary text on cards'],
  ['onAction', 'action', 4.5, 'primary button label (17px semibold)'],
  ['link', 'bg', 4.5, 'links'],
  ['link', 'surface', 4.5, 'links on cards'],
  ['onHero', 'hero', 4.5, 'hero figures'],
  ['onHeroMuted', 'hero', 4.5, 'hero labels'],
  ['error', 'surface', 4.5, 'validation text'],
  ['error', 'sheet', 4.5, 'validation text in sheets'],
  ['destructive', 'bg', 4.5, 'Move to Trash'],
  ['caution', 'bg', 3, 'partial chip / status dot (bold or graphic)'],
  ['tabActive', 'tabBar', 4.5, 'selected tab'],
  ['tabInactive', 'tabBar', 4.5, 'tab labels'],
  ['onSegmentSelected', 'segmentSelected', 4.5, 'selected segment'],
  ['action', 'surface', 3, 'toggle / icon / secondary outline (graphic)']
];
const ALLOWED_V0 = new Set(['onAction/action/dark']);

const parse = (c) => {
  c = c.trim();
  if (c.startsWith('#')) return [parseInt(c.slice(1, 3), 16), parseInt(c.slice(3, 5), 16), parseInt(c.slice(5, 7), 16), 1];
  const m = c.match(/rgba?\(([^)]+)\)/);
  if (!m) return null;
  const p = m[1].split(',').map(Number);
  return [p[0], p[1], p[2], p[3] ?? 1];
};
const over = (fg, bg) => fg[3] >= 1 ? fg : [0, 1, 2].map((i) => fg[i] * fg[3] + bg[i] * (1 - fg[3])).concat(1);
const lum = ([r, g, b]) => {
  const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
};
const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m); return (x + 0.05) / (y + 0.05); };

function resolve(fam, mode) {
  const out = {};
  for (const [k, v] of Object.entries(tokens.base.color)) out[k] = v[mode];
  for (const [k, v] of Object.entries(tokens.families[fam].override.color || {})) out[k] = v[mode];
  return out;
}
// Gradient backgrounds: check every color stop.
const stops = (v) => (v.includes('gradient') ? v.match(/#[0-9a-fA-F]{6}/g) : [v]);

let failed = 0;
const rows = [];
for (const fam of Object.keys(tokens.families)) {
  for (const mode of ['light', 'dark']) {
    const c = resolve(fam, mode);
    const page = parse(c.bg);
    for (const [fg, bg, min, what] of PAIRS) {
      if (c[fg] === 'transparent' || c[bg] === 'transparent') continue;
      let worst = Infinity;
      for (const stop of stops(c[bg])) {
        const b = over(parse(stop), page);
        worst = Math.min(worst, ratio(over(parse(c[fg]), b), b));
      }
      const key = `${fg}/${bg}/${mode}`;
      const ok = worst >= min;
      const allowed = !ok && fam === 'v0' && ALLOWED_V0.has(key);
      if (!ok && !allowed) failed++;
      if (!ok || process.argv.includes('--all')) rows.push(`${ok ? 'ok  ' : allowed ? 'V0* ' : 'FAIL'} ${fam} ${mode.padEnd(5)} ${(fg + ' on ' + bg).padEnd(34)} ${worst.toFixed(2).padStart(5)} (min ${min}) ${what}`);
    }
  }
}
console.log(rows.join('\n') || 'all pairs pass');
console.log(failed ? `\n${failed} failing pair(s)` : '\ncontrast ok (V0* = inherited from the reference, documented)');
process.exit(failed ? 1 : 0);
