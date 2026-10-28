// Synthetic demo scenarios. Every figure is a fixed example value: deductions, gas
// costs and SE wording are stored per scenario, never derived from rates or formulas.
// The model only sums, counts and divides values that are already here.
(function () {
  const TODAY = '2026-10-24';
  const PLATFORMS = {
    amazonFlex: { name: 'Amazon Flex', icon: 'box', color: 'platform-amazon-flex' },
    uber: { name: 'Uber', icon: 'car', color: 'platform-uber' },
    doorDash: { name: 'DoorDash', icon: 'bag', color: 'platform-door-dash' },
    lyft: { name: 'Lyft', icon: 'car', color: 'platform-lyft' },
    instacart: { name: 'Instacart', icon: 'bag', color: 'platform-instacart' },
    spark: { name: 'Spark', icon: 'box', color: 'platform-spark' }
  };

  // pay.main: number | null (missing) | 'overflow' (stored value too large to add up)
  const shift = (o) => ({ kind: 'work', extras: [], tip: 0, route: 0, ...o });

  const personalDrives = [
    { id: 'p1', date: '2026-10-22', start: '13:30', end: '13:30', secs: 20, miles: 0.05, status: 'ok', route: 3 },
    { id: 'p2', date: '2026-10-22', start: '13:00', end: '13:13', secs: 0, mins: 13.17, miles: 1.21, status: 'gap', route: 1 },
    { id: 'p3', date: '2026-10-22', start: '12:30', end: '12:34', mins: 4, miles: 1.6, status: 'interrupted', route: 2 },
    { id: 'p4', date: '2026-10-22', start: '12:00', end: '12:11', mins: 11.25, miles: 3.13, status: 'ok', route: 0 },
    { id: 'p5', date: '2026-10-21', start: '17:40', end: '17:52', mins: 12, miles: 2.9, status: 'ok', route: 4 }
  ];

  const SCENARIOS = {
    partial: {
      label: { es: 'Pago parcial (24 oct)', en: 'Partial pay (Oct 24)' },
      ref: 'screens/05-coherencia-corregida/01-04',
      permission: 'whenInUse',
      gasKnown: false,
      gasPrice: null,
      autoPersonal: true,
      tooLarge: false,
      orphan: false,
      seState: 'under',
      shifts: [
        shift({ id: 'w1', platform: 'amazonFlex', date: '2026-10-22', start: '06:35', end: '09:35', miles: 20.0, deduction: 15.20, gas: null, main: 50, route: 5 }),
        shift({ id: 'w2', platform: 'uber', date: '2026-10-21', start: '06:35', end: '07:35', miles: 10.0, deduction: 7.60, gas: null, main: null, route: 6 }),
        shift({ id: 'w3', platform: 'amazonFlex', date: '2026-10-19', start: '06:35', end: '08:35', miles: 15.0, deduction: 11.40, gas: null, main: null, extras: [{ platform: 'uber', amount: 20, tip: 0 }], route: 7 })
      ],
      personal: personalDrives,
      trash: []
    },
    complete: {
      label: { es: 'Pagos completos', en: 'All pay logged' },
      ref: 'screens/04-completar-importes/08 + 03-cierre-laboral/05',
      permission: 'always',
      gasKnown: true,
      gasPrice: 3.20,
      autoPersonal: true,
      tooLarge: false,
      orphan: false,
      seState: 'under',
      shifts: [
        shift({ id: 'w1', platform: 'amazonFlex', date: '2026-10-22', start: '06:35', end: '09:35', miles: 40.0, deduction: 29.00, gas: 8.00, main: 90, route: 5 }),
        shift({ id: 'w2', platform: 'uber', date: '2026-10-21', start: '06:35', end: '07:35', miles: 6.0, deduction: 4.35, gas: 1.20, main: 20, tip: 5, route: 6 }),
        shift({ id: 'w3', platform: 'amazonFlex', date: '2026-10-20', start: '06:35', end: '08:35', miles: 20.0, deduction: 14.50, gas: 4.00, main: 66, route: 7 }),
        shift({ id: 'w4', platform: 'doorDash', date: '2026-10-19', start: '17:00', end: '19:00', miles: 18.0, deduction: 13.05, gas: 3.60, main: 17, route: 8 })
      ],
      personal: personalDrives,
      trash: [
        shift({ id: 'w9', platform: 'uber', date: '2026-10-12', start: '20:10', end: '20:40', miles: 4.0, deduction: 2.90, gas: 0.80, main: 9, route: 6 })
      ]
    },
    tooLarge: {
      label: { es: 'Cifras demasiado grandes', en: 'Amounts too large' },
      ref: 'screens/05-coherencia-corregida/05-08',
      permission: 'whenInUse',
      gasKnown: false,
      gasPrice: null,
      autoPersonal: false,
      tooLarge: true,
      orphan: false,
      seState: 'notEstimated',
      shifts: [
        shift({ id: 'w1', platform: 'amazonFlex', date: '2026-10-23', start: '05:45', end: '07:45', miles: 20.0, deduction: 15.20, gas: null, main: 'overflow', route: 5 }),
        shift({ id: 'w2', platform: 'amazonFlex', date: '2026-10-22', start: '05:45', end: '07:45', miles: 15.0, deduction: 11.40, gas: null, main: 40, route: 7 })
      ],
      personal: [],
      trash: []
    },
    empty: {
      label: { es: 'Sin datos (aproximación)', en: 'No data (approximation)' },
      ref: null,
      permission: 'denied',
      gasKnown: false,
      gasPrice: null,
      autoPersonal: false,
      tooLarge: false,
      orphan: false,
      seState: 'none',
      shifts: [],
      personal: [],
      trash: []
    },
    orphan: {
      label: { es: 'Turno sin cerrar', en: 'Shift left open' },
      ref: 'screens/03-cierre-laboral/00',
      permission: 'always',
      gasKnown: true,
      gasPrice: 3.20,
      autoPersonal: true,
      tooLarge: false,
      orphan: true,
      seState: 'under',
      shifts: [
        shift({ id: 'w1', platform: 'amazonFlex', date: '2026-10-22', start: '06:35', end: '09:35', miles: 40.0, deduction: 29.00, gas: 8.00, main: 90, route: 5 }),
        shift({ id: 'w2', platform: 'uber', date: '2026-10-21', start: '06:35', end: '07:35', miles: 6.0, deduction: 4.35, gas: 1.20, main: null, route: 6 })
      ],
      personal: personalDrives,
      trash: []
    },
    // Stress cases for the green card: presentation only, values are as synthetic as the rest.
    longPay: {
      label: { es: 'Importe largo (prueba de diseño)', en: 'Long amount (design test)' },
      ref: null,
      permission: 'always',
      gasKnown: false,
      gasPrice: null,
      autoPersonal: true,
      tooLarge: false,
      orphan: false,
      seState: 'under',
      shifts: [
        shift({ id: 'w1', platform: 'amazonFlex', date: '2026-10-24', start: '04:00', end: '16:00', miles: 312.4, deduction: 226.49, gas: null, main: 99999.99, route: 5 }),
        shift({ id: 'w2', platform: 'uber', date: '2026-10-20', start: '05:00', end: '17:00', miles: 4790.6, deduction: 3473.19, gas: null, main: null, extras: [{ platform: 'uber', amount: 23456.79, tip: 0 }], route: 6 }),
        shift({ id: 'w3', platform: 'amazonFlex', date: '2026-10-16', start: '05:00', end: '17:00', miles: 4773.0, deduction: 3460.43, gas: null, main: null, route: 7 })
      ],
      personal: personalDrives,
      trash: []
    },
    zeroPay: {
      label: { es: 'Cobrado $0, negativo tras gasolina (prueba de diseño)', en: 'Paid $0, negative after gas (design test)' },
      ref: null,
      permission: 'always',
      gasKnown: true,
      gasPrice: 3.20,
      autoPersonal: false,
      tooLarge: false,
      orphan: false,
      seState: 'under',
      shifts: [
        shift({ id: 'w1', platform: 'amazonFlex', date: '2026-10-24', start: '06:00', end: '07:00', miles: 18.0, deduction: 13.05, gas: 5.60, main: 0, route: 5 }),
        shift({ id: 'w2', platform: 'doorDash', date: '2026-10-21', start: '18:00', end: '18:45', miles: 8.0, deduction: 5.80, gas: 2.40, main: 0, route: 6 })
      ],
      personal: [],
      trash: []
    }
  };

  // Stress case for the Personal row: same work data as «partial», only the personal drives have more digits.
  SCENARIOS.personalLong = {
    ...SCENARIOS.partial,
    label: { es: 'Millas personales largas (prueba de diseño)', en: 'Long personal miles (design test)' },
    ref: null,
    personal: [
      { id: 'p1', date: '2026-10-24', start: '05:10', end: '17:40', mins: 750, miles: 1248.4, status: 'ok', route: 3 },
      { id: 'p2', date: '2026-10-20', start: '04:00', end: '23:50', mins: 1190, miles: 11237.6, status: 'ok', route: 4 }
    ]
  };

  // The shift produced by the simulated close flow (matches the 03-cierre-laboral captures).
  const CLOSE_SHIFT = { id: 'wNew', platform: 'amazonFlex', date: '2026-10-23', start: '01:55', end: '04:55', miles: 40.0, deduction: 29.00, gasKnownCost: 8.00, route: 9 };

  const WEEK_MILES = { partial: [0, 15, 0, 10, 20, 0, 0], complete: [18, 20, 6, 40, 0, 0, 0], tooLarge: [0, 0, 0, 0, 15, 20, 0], empty: [0, 0, 0, 0, 0, 0, 0], orphan: [0, 0, 6, 40, 0, 0, 0], longPay: [0, 0, 4790.6, 0, 0, 0, 312.4], zeroPay: [0, 0, 0, 8, 0, 0, 18], personalLong: [0, 15, 0, 10, 20, 0, 0] };

  function load(id) {
    return JSON.parse(JSON.stringify(SCENARIOS[id]));
  }

  const mins = (s) => {
    if (s.mins) return s.mins;
    const [h1, m1] = s.start.split(':').map(Number);
    const [h2, m2] = s.end.split(':').map(Number);
    return (h2 * 60 + m2) - (h1 * 60 + m1);
  };

  function inPeriod(date, period) {
    if (period === 'today') return date === TODAY;
    if (period === 'week') return date >= '2026-10-18' && date <= TODAY;
    if (period === 'month' || period === 'custom') return date >= '2026-10-01' && date <= '2026-10-31';
    if (period === 'year') return date >= '2026-01-01';
    if (period === 'lastYear') return date >= '2025-01-01' && date < '2026-01-01';
    return true;
  }

  // Derived figures for a list of work shifts. Only sums/counts of stored values.
  function summarize(data, shifts) {
    const n = shifts.length;
    const overflow = shifts.some((s) => s.main === 'overflow');
    const withAnyPay = shifts.filter((s) => s.main !== null || s.extras.length);
    const withMain = shifts.filter((s) => s.main !== null);
    const extrasOnly = shifts.filter((s) => s.main === null && s.extras.length);
    const noPay = shifts.filter((s) => s.main === null && !s.extras.length);
    const missing = shifts.filter((s) => s.main === null);
    let paid = 0;
    const byPlatform = {};
    for (const s of shifts) {
      const lines = [];
      if (typeof s.main === 'number') lines.push([s.platform, s.main]);
      for (const x of s.extras) lines.push([x.platform, x.amount]);
      for (const [p, amt] of lines) {
        paid += amt;
        byPlatform[p] = byPlatform[p] || { count: 0, amount: 0 };
        byPlatform[p].count += 1;
        byPlatform[p].amount += amt;
      }
    }
    const miles = shifts.reduce((a, s) => a + s.miles, 0);
    const deduction = shifts.reduce((a, s) => a + s.deduction, 0);
    const gas = data.gasKnown ? withMain.reduce((a, s) => a + (s.gas || 0), 0) : null;

    // Per-hour figures over shifts with their main pay logged.
    const rated = withMain.filter((s) => typeof s.main === 'number');
    const ratedMins = rated.reduce((a, s) => a + mins(s), 0);
    const ratedPaid = rated.reduce((a, s) => a + s.main + s.extras.reduce((b, x) => b + x.amount, 0), 0);
    const ratedGas = rated.reduce((a, s) => a + (s.gas || 0), 0);
    const perPlatform = {};
    for (const s of rated) {
      const p = perPlatform[s.platform] || (perPlatform[s.platform] = { paid: 0, mins: 0 });
      p.paid += s.main;
      p.mins += mins(s);
    }
    const perShift = rated.map((s) => ({ s, rate: ((s.main - (data.gasKnown ? s.gas || 0 : 0)) / mins(s)) * 60 }));
    perShift.sort((a, b) => b.rate - a.rate);
    return {
      n, overflow, paid: overflow ? null : paid, byPlatform,
      withAnyPay: withAnyPay.length, withMain: withMain.length, extrasOnly: extrasOnly.length, noPay: noPay.length,
      missing, miles, deduction, gas,
      afterGas: !overflow && gas !== null && missing.length === 0 ? paid - gas : null,
      rateCount: rated.length,
      ratePerHour: overflow || !rated.length ? null : ((ratedPaid - (data.gasKnown ? ratedGas : 0)) / ratedMins) * 60,
      perPlatformRate: Object.fromEntries(Object.entries(perPlatform).map(([k, v]) => [k, (v.paid / v.mins) * 60])),
      best: perShift[0] || null,
      worst: perShift.length > 1 ? perShift[perShift.length - 1] : null
    };
  }

  function seIncome(data) {
    const year = data.shifts.filter((s) => inPeriod(s.date, 'year'));
    const logged = year.filter((s) => typeof s.main === 'number');
    const income = logged.reduce((a, s) => a + s.main + s.extras.reduce((b, x) => b + x.amount, 0), 0);
    const deduction = logged.reduce((a, s) => a + s.deduction, 0);
    return { n: year.length, a: logged.length, income, deduction, net: income - deduction };
  }

  window.E = window.E || {};
  Object.assign(window.E, { TODAY, PLATFORMS, SCENARIOS, CLOSE_SHIFT, WEEK_MILES, load, mins, inPeriod, summarize, seIncome });
})();
