// Christmas decorations for Home (lab preview only, off by default).
// All pieces are decorative: aria-hidden, pointer-events: none, and they never cover the label.
// Button pieces use the button's own box (0..200, centre 100,175 for overlays, or 100,100
// for rings), so they scale with the button at any text size.
(function () {
  const E = window.E;
  const r2 = (n) => Math.round(n * 10) / 10;
  const P = (r, deg, cx = 100, cy = 175) => [r2(cx + r * Math.cos((deg * Math.PI) / 180)), r2(cy + r * Math.sin((deg * Math.PI) / 180))];
  // Deterministic jitter so every render (and every frame in compare view) is identical.
  const jit = (i, k = 1) => (Math.sin(i * 12.9898 + k * 78.233) * 43758.5453) % 1;

  // Smooth closed/open path through points (Catmull-Rom → cubic Bézier).
  function smooth(pts, close = true) {
    const n = pts.length;
    const at = (i) => pts[close ? (i + n) % n : Math.max(0, Math.min(n - 1, i))];
    let d = `M${pts[0][0]} ${pts[0][1]}`;
    for (let i = 0; i < (close ? n : n - 1); i++) {
      const [p0, p1, p2, p3] = [at(i - 1), at(i), at(i + 1), at(i + 2)];
      const c1 = [r2(p1[0] + (p2[0] - p0[0]) / 6), r2(p1[1] + (p2[1] - p0[1]) / 6)];
      const c2 = [r2(p2[0] - (p3[0] - p1[0]) / 6), r2(p2[1] - (p3[1] - p1[1]) / 6)];
      d += `C${c1[0]} ${c1[1]} ${c2[0]} ${c2[1]} ${p2[0]} ${p2[1]}`;
    }
    return d + (close ? 'Z' : '');
  }
  const ease = (n) => Array(n).fill('0.45 0 0.55 1').join(';');
  const swing = (motion, vals, cx, cy, dur, begin) => (motion
    ? `<animateTransform attributeName="transform" type="rotate" values="${vals.map((v) => `${v} ${cx} ${cy}`).join(';')}" keyTimes="${vals.map((_, i) => r2(i / (vals.length - 1) * 100) / 100).join(';')}" calcMode="spline" keySplines="${ease(vals.length - 1)}" dur="${dur}" begin="${begin}" repeatCount="indefinite"/>`
    : '');
  const glint = (motion, x, y, s, begin, dur = '4.2s') => `<path d="M${x} ${y - s}L${r2(x + s * 0.26)} ${r2(y - s * 0.26)}L${x + s} ${y}L${r2(x + s * 0.26)} ${r2(y + s * 0.26)}L${x} ${y + s}L${r2(x - s * 0.26)} ${r2(y + s * 0.26)}L${x - s} ${y}L${r2(x - s * 0.26)} ${r2(y - s * 0.26)}Z" fill="#fff" opacity="${motion ? 0 : 0.8}">${motion ? `<animate attributeName="opacity" values="0;0;1;0;0" keyTimes="0;.42;.5;.58;1" dur="${dur}" begin="${begin}" repeatCount="indefinite"/>` : ''}</path>`;

  // Small elf hat: a decoration placed on the button's top-right edge, not a hat the
  // button "wears". Red cone with a curled tip and a swinging gold bell, gold zigzag
  // cuff with tiny bells, and a holly sprig. Pops in when Home appears, then sways.
  function elfHat(uid, { motion = true, entrance = true } = {}) {
    const u = `elf-${uid}`;
    const cuffTop = [[2, 86], [26, 80], [50, 78], [74, 81], [98, 89]];
    const zig = [[99, 103], [91, 98], [84, 108], [76, 100], [68, 109], [60, 101], [52, 110], [44, 101], [36, 109], [28, 100], [20, 107], [12, 98], [3, 102]];
    const cuff = `M${cuffTop.map((p) => p.join(' ')).join('L')}L${zig.map((p) => p.join(' ')).join('L')}Z`;
    const bells = zig.filter((_, i) => i % 2 === 0).slice(1, -1).map(([x, y]) => `<circle cx="${x}" cy="${y + 1.6}" r="2.4" fill="url(#${u}-bell)"/>`).join('');
    const pop = motion && entrance
      ? `<animateTransform attributeName="transform" type="scale" values="0.2;1.14;0.95;1" keyTimes="0;.55;.8;1" calcMode="spline" keySplines="0.3 0 0.6 1;0.4 0 0.6 1;0.4 0 0.6 1" dur=".8s" begin=".15s" fill="freeze"/>
         <animate attributeName="opacity" values="0;1" dur=".2s" begin=".15s" fill="freeze"/>`
      : '';
    return `<svg class="xmas-elf" viewBox="0 0 120 120" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="${u}-red" gradientUnits="userSpaceOnUse" x1="14" y1="20" x2="110" y2="100">
          <stop offset="0" stop-color="#EE5A45"/><stop offset=".5" stop-color="#C72C25"/><stop offset="1" stop-color="#861719"/>
        </linearGradient>
        <linearGradient id="${u}-gold" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#FBE08A"/><stop offset=".55" stop-color="#DDAA3E"/><stop offset="1" stop-color="#9A6B1B"/>
        </linearGradient>
        <radialGradient id="${u}-bell" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#FFF6CF"/><stop offset=".45" stop-color="#E9B94C"/><stop offset="1" stop-color="#8A5E12"/></radialGradient>
        <filter id="${u}-drop" x="-20%" y="-20%" width="140%" height="150%"><feDropShadow dx="0" dy="2" stdDeviation="1.8" flood-color="#1d0806" flood-opacity=".32"/></filter>
      </defs>
      <g transform="translate(50 100)"><g ${motion && entrance ? 'opacity="0"' : ''}>${pop}<g transform="translate(-50 -100)">
        <g filter="url(#${u}-drop)">
          ${swing(motion, [0, 3, 0, -2, 0], 50, 100, '4.2s', '1s')}
          <path d="M14 92C20 62 38 36 64 24C79 17 95 15 104 20C111 24 113 33 107 38C100 33 91 34 85 40C77 49 77 70 86 98Z" fill="url(#${u}-red)"/>
          <path d="M85 40C77 49 77 70 86 98L70 98C66 74 72 52 85 40Z" fill="#4A0A0A" opacity=".3"/>
          <path d="M24 84C28 62 42 42 62 30" stroke="#fff" stroke-opacity=".3" stroke-width="4" stroke-linecap="round" fill="none"/>
          <path d="M56 36C50 52 48 70 52 88" stroke="#6E1010" stroke-opacity=".32" stroke-width="1.8" stroke-linecap="round" fill="none"/>
          <path d="M70 26C88 18 100 18 106 24" stroke="#fff" stroke-opacity=".22" stroke-width="2.4" stroke-linecap="round" fill="none"/>
          <g>
            ${swing(motion, [0, 16, 0, -12, 0], 106, 39, '2.4s', '1.1s')}
            <circle cx="106" cy="40.5" r="2" fill="none" stroke="#C99A33" stroke-width="1.4"/>
            <path d="M99.4 53C99.8 47.5 101 42.4 106 42.4C111 42.4 112.2 47.5 112.6 53Z" fill="url(#${u}-bell)"/>
            <ellipse cx="106" cy="53" rx="7.2" ry="1.7" fill="#B5862B"/>
            <path d="M103 49.5H109" stroke="#7A5310" stroke-width=".9" stroke-linecap="round"/>
            <circle cx="106" cy="55" r="1.6" fill="#6B4A0E"/>
            <circle cx="103.6" cy="46" r="1.3" fill="#fff" opacity=".8"/>
          </g>
          <path d="${cuff}" fill="url(#${u}-gold)" stroke="#8A5E12" stroke-opacity=".45" stroke-width=".8" stroke-linejoin="round"/>
          <path d="M4 88C30 81 60 79 96 92" stroke="#fff" stroke-opacity=".55" stroke-width="1.4" fill="none" stroke-linecap="round"/>
          ${bells}
          <g transform="translate(22 84) rotate(-12)">
            <path d="M0 0C-4 -6 -12 -6 -16 -2C-12 -1 -11 3 -14 5C-8 6 -3 4 0 0Z" fill="#2E7D4F" stroke="#1E5A36" stroke-width=".6"/>
            <path d="M0 0C3 -7 11 -8 15 -5C11 -3 11 1 13 3C7 5 2 4 0 0Z" fill="#3A8F5C" stroke="#1E5A36" stroke-width=".6"/>
            <circle cx="-1" cy="-2" r="2.6" fill="#D32F2F"/><circle cx="2.6" cy="-0.6" r="2.4" fill="#B71C1C"/><circle cx="0.6" cy="1.8" r="2.3" fill="#E53935"/>
            <circle cx="-1.8" cy="-2.8" r=".8" fill="#fff" opacity=".8"/>
          </g>
        </g>
        ${glint(motion, 116, 46, 4, '2.4s')}${glint(motion, 40, 74, 3.2, '3.6s')}
      </g></g></g>
    </svg>`;
  }

  // Snow resting on the top of the start button (button box coordinates, centre 100,175).
  function snowCap(uid, { motion = true } = {}) {
    const u = `cap-${uid}`;
    const outer = [];
    const inner = [];
    for (let d = -164; d <= -16; d += 4) {
      const taper = Math.sin(Math.PI * (d + 164) / 148);
      const lump = 0.7 + 0.3 * Math.sin(d * 0.37) * Math.cos(d * 0.11);
      outer.push(P(100 + 1.5 + 8 * taper * lump, d));
    }
    for (let d = -16; d >= -164; d -= 4) {
      const taper = Math.sin(Math.PI * (d + 164) / 148);
      const drip = [-128, -96, -62, -40].reduce((a, c) => a + 7 * Math.exp(-((d - c) ** 2) / 18), 0) * taper;
      inner.push(P(100 - 1 - 7 * taper - drip, d));
    }
    const shape = smooth([...outer, ...inner]);
    const shadow = smooth(inner.map(([x, y]) => [x, r2(y + 4)]), false);
    return `<svg class="xmas-snowcap" viewBox="0 75 200 200" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="${u}-snow" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFFFF"/><stop offset=".7" stop-color="#F2F6FA"/><stop offset="1" stop-color="#D9E4EE"/></linearGradient>
        <clipPath id="${u}-clip"><circle cx="100" cy="175" r="100"/></clipPath>
        <filter id="${u}-blur"><feGaussianBlur stdDeviation="2.5"/></filter>
      </defs>
      <g clip-path="url(#${u}-clip)"><path d="${shadow}" stroke="#0B2A1C" stroke-opacity=".35" stroke-width="6" fill="none" filter="url(#${u}-blur)"/></g>
      <path d="${shape}" fill="url(#${u}-snow)"/>
      <path d="${smooth(outer, false)}" stroke="#fff" stroke-width="1.5" fill="none" opacity=".9"/>
      ${glint(motion, ...P(104, -120), 3.5, '1.6s', '5s')}${glint(motion, ...P(106, -78), 3, '3.1s', '5s')}${glint(motion, ...P(104, -46), 3.2, '4.2s', '5s')}
    </svg>`;
  }

  // Lumpy snow drift along the top edge of the hero card.
  function heroDrift(uid) {
    const pts = [[0, 0], [360, 0]];
    for (let x = 360; x >= 0; x -= 12) {
      const drip = [60, 150, 255, 330].reduce((a, c) => a + 7 * Math.exp(-((x - c) ** 2) / 60), 0);
      pts.push([x, r2(6 + 3 * Math.abs(Math.sin(x * 0.07)) + 2 * Math.abs(Math.cos(x * 0.031)) + drip)]);
    }
    return `<svg class="xmas-drift" viewBox="0 0 360 22" preserveAspectRatio="none" aria-hidden="true" focusable="false">
      <defs><linearGradient id="drift-${uid}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#DCE7F0"/></linearGradient></defs>
      <path d="M0 0H360V${pts[2][1]}${pts.slice(2).map(([x, y]) => `L${x} ${y}`).join('')}Z" fill="url(#drift-${uid})"/>
    </svg>`;
  }

  const BULBS = ['#E5483E', '#F2C14E', '#3FA34D', '#4DA3F0'];
  function bulb(u, x, y, angle, color, i, motion, size = 1) {
    const tw = motion ? `<animate attributeName="opacity" values=".25;1;.25" dur="2.4s" begin="${r2(i * 0.2)}s" repeatCount="indefinite"/>` : '';
    return `<g transform="translate(${x} ${y}) rotate(${r2(angle)}) scale(${size})">
      <circle cx="0" cy="8" r="9" fill="${color}" opacity=".55" filter="url(#${u}-glow)">${tw}</circle>
      <rect x="-2.4" y="-1" width="4.8" height="4.4" rx="1" fill="#3C3A36"/>
      <ellipse cx="0" cy="8.4" rx="4.2" ry="5.8" fill="${color}"/>
      <ellipse cx="-1.3" cy="6.6" rx="1.2" ry="2.2" fill="#fff" opacity=".65"/>
    </g>`;
  }

  // String of lights sagging under the title.
  function garland(uid, { motion = true } = {}) {
    const u = `gar-${uid}`;
    const halves = [[[-6, 4], [90, 32], [180, 6]], [[180, 6], [270, 32], [366, 4]]];
    const q = ([a, b, c], t) => [0, 1].map((k) => r2((1 - t) ** 2 * a[k] + 2 * (1 - t) * t * b[k] + t * t * c[k]));
    let i = 0;
    const bulbs = [];
    for (const h of halves) {
      for (const t of [0.14, 0.32, 0.5, 0.68, 0.86]) {
        const [x, y] = q(h, t);
        const [x2, y2] = q(h, t + 0.01);
        const slope = (Math.atan2(y2 - y, x2 - x) * 180) / Math.PI;
        bulbs.push(bulb(u, x, y, slope * 0.35, BULBS[i % 4], i, motion));
        i++;
      }
    }
    return `<svg class="xmas-garland" viewBox="0 0 360 46" aria-hidden="true" focusable="false">
      <defs><filter id="${u}-glow" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="3"/></filter></defs>
      <path d="M-6 4Q90 32 180 6Q270 32 366 4" stroke="var(--color-text-muted)" stroke-opacity=".6" stroke-width="1.4" fill="none"/>
      ${bulbs.join('')}
    </svg>`;
  }

  // Ring of lights around the start button (replaces the hour ring).
  function lightsRing(uid, { motion = true } = {}) {
    const u = `ring-${uid}`;
    const bulbs = [];
    for (let k = 0; k < 16; k++) {
      const deg = -90 + k * 22.5;
      const [x, y] = P(94, deg, 100, 100);
      bulbs.push(bulb(u, x, y, deg - 90, BULBS[k % 4], k, motion, 0.9));
    }
    return `<svg class="xmas-lights-ring" viewBox="0 0 200 200" aria-hidden="true" focusable="false">
      <defs><filter id="${u}-glow" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="3"/></filter></defs>
      <circle cx="100" cy="100" r="94" stroke="var(--color-text-muted)" stroke-opacity=".55" stroke-width="1.2" fill="none"/>
      ${bulbs.join('')}
    </svg>`;
  }

  // Gold cap, loop and thread on top of the button: turns the circle into a tree ornament.
  function ornamentCap(uid) {
    const u = `orn-${uid}`;
    const ridges = [18, 23, 28, 33, 38, 43].map((x) => `<line x1="${x}" y1="29" x2="${x}" y2="41" />`).join('');
    return `<svg class="xmas-cap" viewBox="0 0 60 60" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="${u}-gold" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stop-color="#8F6516"/><stop offset=".3" stop-color="#F6D98A"/><stop offset=".55" stop-color="#D9A93E"/><stop offset="1" stop-color="#7E5812"/>
        </linearGradient>
      </defs>
      <line x1="30" y1="-60" x2="30" y2="12" stroke="var(--color-text-muted)" stroke-opacity=".55" stroke-width="1"/>
      <ellipse cx="30" cy="17" rx="7" ry="8" fill="none" stroke="url(#${u}-gold)" stroke-width="2.6"/>
      <rect x="13" y="26" width="34" height="18" rx="3" fill="url(#${u}-gold)"/>
      <g stroke="#6E4C10" stroke-opacity=".45" stroke-width="1">${ridges}</g>
      <rect x="11" y="41" width="38" height="6" rx="2.5" fill="url(#${u}-gold)"/>
      <rect x="15" y="27.5" width="30" height="2" rx="1" fill="#fff" opacity=".45"/>
    </svg>`;
  }

  function sparkles() {
    const star = (x, y, s, o) => `<path d="M${x} ${y - s}L${x + s * 0.28} ${y - s * 0.28}L${x + s} ${y}L${x + s * 0.28} ${y + s * 0.28}L${x} ${y + s}L${x - s * 0.28} ${y + s * 0.28}L${x - s} ${y}L${x - s * 0.28} ${y - s * 0.28}Z" opacity="${o}"/>`;
    return `<svg class="xmas-sparkles" viewBox="0 0 200 200" aria-hidden="true" focusable="false"><g fill="#D9A93E">${star(22, 40, 7, 0.9)}${star(182, 70, 5, 0.7)}${star(170, 180, 6, 0.8)}${star(12, 150, 4, 0.6)}</g></svg>`;
  }

  // Pine wreath that replaces the hour ring, with berry clusters and a bow at the bottom.
  function wreath(uid) {
    const u = `wr-${uid}`;
    const greens = ['#2C5A36', '#3B7446', '#24492C', '#4C8656'];
    const leaves = [];
    for (let i = 0; i < 72; i++) {
      const deg = i * 5;
      for (const [k, r] of [[0, 86], [1, 93], [2, 100]]) {
        const d = deg + jit(i, k + 1) * 4;
        const [x, y] = P(r + jit(i, k + 9) * 2, d, 100, 100);
        const rot = d + 90 + (k === 1 ? 35 : -35) + jit(i, k + 5) * 20;
        leaves.push(`<ellipse cx="${x}" cy="${y}" rx="${r2(8 + jit(i, k + 3) * 2)}" ry="3.1" transform="rotate(${r2(rot)} ${x} ${y})" fill="${greens[(i + k) % greens.length]}"/>`);
      }
    }
    const berries = [];
    for (const deg of [-150, -95, -40, 10, 165, 215]) {
      const [x, y] = P(94, deg, 100, 100);
      for (const [dx, dy] of [[0, 0], [5, 3], [-1, 6]]) {
        berries.push(`<circle cx="${r2(x + dx)}" cy="${r2(y + dy)}" r="3.4" fill="url(#${u}-berry)"/>`);
      }
    }
    return `<svg class="xmas-wreath" viewBox="0 0 200 200" aria-hidden="true" focusable="false">
      <defs>
        <radialGradient id="${u}-berry" cx=".35" cy=".3" r=".75"><stop offset="0" stop-color="#FF8A80"/><stop offset=".4" stop-color="#D32F2F"/><stop offset="1" stop-color="#7F1414"/></radialGradient>
        <linearGradient id="${u}-ribbon" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E5483E"/><stop offset="1" stop-color="#8E1818"/></linearGradient>
      </defs>
      <g>${leaves.join('')}</g>
      <g>${berries.join('')}</g>
      <g transform="translate(100 182)">
        <path d="M-4 0C-22 -16 -34 -6 -26 4C-20 12 -10 6 -4 0Z" fill="url(#${u}-ribbon)"/>
        <path d="M4 0C22 -16 34 -6 26 4C20 12 10 6 4 0Z" fill="url(#${u}-ribbon)"/>
        <path d="M-3 2L-12 18L-6 16L-3 21Z" fill="#9E1B1B"/><path d="M3 2L12 18L6 16L3 21Z" fill="#9E1B1B"/>
        <rect x="-6" y="-5" width="12" height="10" rx="3" fill="#C62B25"/>
      </g>
    </svg>`;
  }

  // Motion follows the lab's Motion control and the OS reduced-motion setting. Entrances
  // play when Home is newly shown, not on every re-render (typing, toasts).
  const lastNav = {};
  function motionFor(ctx, key) {
    const reduced = ctx.lab.motion === 'reduced' || (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
    const entrance = lastNav[key] !== ctx.ui.nav;
    lastNav[key] = ctx.ui.nav;
    return { motion: !reduced, entrance };
  }

  // Decorated start button for circle/ring families; null when no Christmas variant is on.
  function startDecor(ctx) {
    const deco = ctx.lab.deco;
    if (!deco.startsWith('xmas')) return null;
    const uid = ctx.famId;
    const m = motionFor(ctx, uid + deco);
    const ring = deco === 'xmas-wreath' ? wreath(uid)
      : deco === 'xmas-lights' ? lightsRing(uid, m)
        : ctx.fam.start === 'ring' ? E.hourRing() : '';
    const before = deco === 'xmas-ornament' ? ornamentCap(uid) + sparkles() : '';
    const after = deco === 'xmas-elf' ? elfHat(uid, m) : deco === 'xmas-snow' ? snowCap(uid, m) : '';
    const cls = deco === 'xmas-ornament' ? 'start-ornament' : '';
    return `<div class="start-wrap start-wrap-ring start-xmas start-${deco}">${ring}
      <div class="start-holder">${before}<button class="start-circle ${ctx.fam.start === 'ring' ? 'start-ring' : ''} ${cls}" ${E.act('startShift')}><span>${E.esc(ctx.t('startShift'))}</span></button>${after}</div>
    </div>`;
  }

  // Small elf hat on the right end of the pill/bar start buttons (V1, V2).
  function pillDecor(ctx) {
    const uid = ctx.famId + '-pill';
    return ctx.lab.deco === 'xmas-elf' ? elfHat(uid, motionFor(ctx, uid)) : '';
  }

  // Decorations above the hero (lights garland) and inside it (snow drift).
  function topDecor(ctx) {
    return ctx.lab.deco === 'xmas-lights' ? garland(ctx.famId, motionFor(ctx, ctx.famId + 'gar')) : '';
  }
  function heroDecor(ctx) {
    return ctx.lab.deco === 'xmas-snow' ? heroDrift(ctx.famId) : '';
  }

  Object.assign(E, { xmas: { elfHat, snowCap, garland, lightsRing, ornamentCap, wreath, startDecor, pillDecor, topDecor, heroDecor } });
})();
