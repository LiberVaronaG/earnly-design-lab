// Christmas start-button decorations (lab preview only, off by default).
// All pieces are decorative: aria-hidden, pointer-events: none, and they never cover the label.
// Geometry: the start circle is the unit box 0..200 with centre (100,175) in the hat's
// coordinates, so the hat scales with the button at any text size.
(function () {
  const E = window.E;
  const r2 = (n) => Math.round(n * 10) / 10;
  const P = (r, deg, cx = 100, cy = 175) => [r2(cx + r * Math.cos((deg * Math.PI) / 180)), r2(cy + r * Math.sin((deg * Math.PI) / 180))];
  // Deterministic jitter so every render (and every frame in compare view) is identical.
  const jit = (i, k = 1) => (Math.sin(i * 12.9898 + k * 78.233) * 43758.5453) % 1;

  function hat(uid) {
    const u = `hat-${uid}`;
    const a0 = -160;
    const a1 = -20;
    const [ox0, oy0] = P(113, a0);
    const [ox1, oy1] = P(113, a1);
    const [ix1, iy1] = P(89, a1);
    const [ix0, iy0] = P(89, a0);
    const brim = `M${ox0} ${oy0}A113 113 0 0 1 ${ox1} ${oy1}L${ix1} ${iy1}A89 89 0 0 0 ${ix0} ${iy0}Z`;
    const fluff = [];
    for (let d = a0; d <= a1; d += 6.5) {
      const [x, y] = P(112 + jit(d) * 2, d);
      fluff.push(`<circle cx="${x}" cy="${y}" r="${r2(6.4 + jit(d, 2) * 1.6)}"/>`);
      const [x2, y2] = P(90 - jit(d, 3) * 2, d + 3);
      fluff.push(`<circle cx="${x2}" cy="${y2}" r="${r2(5.6 + jit(d, 4) * 1.4)}"/>`);
    }
    for (const d of [a0, a1]) {
      for (const r of [94, 101, 108]) {
        const [x, y] = P(r, d);
        fluff.push(`<circle cx="${x}" cy="${y}" r="7"/>`);
      }
    }
    const texture = [];
    for (let d = a0 + 5; d < a1 - 3; d += 7.5) {
      const [x, y] = P(96 + jit(d, 5) * 13, d + jit(d, 6) * 2);
      texture.push(`<path d="M${x} ${y}l1.6 -1.2" />`);
    }
    const pom = [];
    for (let d = 0; d < 360; d += 30) {
      const [x, y] = P(16, d, 196, 66);
      pom.push(`<circle cx="${x}" cy="${y}" r="${r2(5 + jit(d, 7) * 1.5)}"/>`);
    }
    const [sx0, sy0] = P(96, -158);
    const [sx1, sy1] = P(96, -22);
    return `<svg class="xmas-hat" viewBox="-10 0 230 150" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="${u}-red" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#E9503F"/><stop offset=".45" stop-color="#C62B25"/><stop offset="1" stop-color="#8A1616"/>
        </linearGradient>
        <linearGradient id="${u}-fur" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#FFFFFF"/><stop offset=".6" stop-color="#F6F2EB"/><stop offset="1" stop-color="#E2DBCF"/>
        </linearGradient>
        <radialGradient id="${u}-pom" cx=".38" cy=".34" r=".72">
          <stop offset="0" stop-color="#FFFFFF"/><stop offset=".65" stop-color="#F3EEE6"/><stop offset="1" stop-color="#D6CDBF"/>
        </radialGradient>
        <clipPath id="${u}-clip"><circle cx="100" cy="175" r="100"/></clipPath>
        <clipPath id="${u}-above"><path clip-rule="evenodd" d="M-20 -20H240V200H-20Z M5 175A95 95 0 1 0 195 175A95 95 0 1 0 5 175Z"/></clipPath>
        <filter id="${u}-blur" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="3.2"/></filter>
        <filter id="${u}-drop" x="-10%" y="-10%" width="125%" height="130%"><feDropShadow dx="0" dy="2.5" stdDeviation="2.4" flood-color="#2a0a06" flood-opacity=".28"/></filter>
      </defs>
      <g clip-path="url(#${u}-clip)"><path d="M${sx0} ${sy0 + 8}A96 96 0 0 1 ${sx1} ${sy1 + 8}" stroke="#000" stroke-opacity=".38" stroke-width="12" fill="none" filter="url(#${u}-blur)"/></g>
      <g filter="url(#${u}-drop)">
        <g clip-path="url(#${u}-above)">
        <path d="M14 120C16 70 52 26 108 14C150 6 186 20 198 50C201 58 197 66 190 68C180 54 162 46 146 52C160 70 174 92 186 120Z" fill="url(#${u}-red)"/>
        <path d="M146 52C160 70 174 92 186 120L152 120C151 96 148 72 146 52Z" fill="#5E0C0C" opacity=".32"/>
        <path d="M108 14C150 6 186 20 198 50C186 34 158 25 126 29Z" fill="#fff" opacity=".14"/>
        <path d="M30 108C34 74 58 40 96 26" stroke="#fff" stroke-opacity=".24" stroke-width="6" stroke-linecap="round" fill="none"/>
        <path d="M120 40C118 62 121 86 128 112" stroke="#6E1010" stroke-opacity=".38" stroke-width="2.4" stroke-linecap="round" fill="none"/>
        <path d="M78 34C69 58 65 84 67 112" stroke="#6E1010" stroke-opacity=".24" stroke-width="2" stroke-linecap="round" fill="none"/>
        <path d="M150 55C158 50 170 52 182 62" stroke="#5E0C0C" stroke-opacity=".35" stroke-width="2" stroke-linecap="round" fill="none"/>
        </g>
        <g fill="url(#${u}-fur)">${fluff.join('')}<path d="${brim}"/></g>
        <g stroke="#D8D0C3" stroke-width=".9" stroke-linecap="round" fill="none" opacity=".45">${texture.join('')}</g>
        <path d="M${P(111, -150).join(' ')}A111 111 0 0 1 ${P(111, -30).join(' ')}" stroke="#fff" stroke-opacity=".9" stroke-width="1.6" fill="none" stroke-linecap="round"/>
        <ellipse cx="198" cy="84" rx="13" ry="3.5" fill="#000" opacity=".16" filter="url(#${u}-blur)"/>
        <g fill="url(#${u}-pom)">${pom.join('')}<circle cx="196" cy="66" r="17"/></g>
        <circle cx="190" cy="60" r="4.5" fill="#fff" opacity=".9"/>
        <g fill="#D3CABC" opacity=".7"><circle cx="201" cy="72" r="1.3"/><circle cx="192" cy="74" r="1.1"/><circle cx="204" cy="63" r="1"/></g>
      </g>
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

  // Decorated start button for circle/ring families; null when no Christmas variant is on.
  function startDecor(ctx) {
    const deco = ctx.lab.deco;
    if (!deco.startsWith('xmas')) return null;
    const uid = ctx.famId;
    const ring = deco === 'xmas-wreath' ? wreath(uid) : ctx.fam.start === 'ring' ? E.hourRing() : '';
    const before = deco === 'xmas-ornament' ? ornamentCap(uid) + sparkles() : '';
    const after = deco === 'xmas-hat' ? hat(uid) : '';
    const cls = deco === 'xmas-ornament' ? 'start-ornament' : '';
    return `<div class="start-wrap start-wrap-ring start-xmas start-${deco}">${ring}
      <div class="start-holder">${before}<button class="start-circle ${ctx.fam.start === 'ring' ? 'start-ring' : ''} ${cls}" ${E.act('startShift')}><span>${E.esc(ctx.t('startShift'))}</span></button>${after}</div>
    </div>`;
  }

  // Small hat on the corner of the pill/bar start buttons (V1, V2).
  function pillHat(ctx) {
    return ctx.lab.deco === 'xmas-hat' ? hat(ctx.famId + '-pill') : '';
  }

  Object.assign(E, { xmas: { hat, ornamentCap, wreath, startDecor, pillHat } });
})();
