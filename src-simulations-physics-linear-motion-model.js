/* © 2026 Erfin. All rights reserved. See LICENSE. */
// Gerak lurus (GLB / GLBB). Model murni: tidak menyentuh DOM.
export const params = [
  { key: 'x0', symbol: 'x₀', label: 'Posisi awal', unit: 'm', min: -50, max: 50, step: 0.5, def: 0, desc: 'Posisi benda saat t = 0 pada lintasan lurus.' },
  { key: 'v', symbol: 'v₀', label: 'Kecepatan awal', unit: 'm/s', min: -30, max: 30, step: 0.5, def: 5, desc: 'Positif ke kanan, negatif ke kiri.' },
  { key: 'a', symbol: 'a', label: 'Percepatan', unit: 'm/s²', min: -10, max: 10, step: 0.1, def: 0, desc: 'Nol berarti GLB (kecepatan tetap); tidak nol berarti GLBB.' },
  { key: 'T', symbol: 't', label: 'Waktu pengamatan', unit: 's', min: 1, max: 20, step: 0.5, def: 10, desc: 'Lamanya percobaan.' },
];
export const columns = [
  { key: 't', label: 't', unit: 's', dec: 2 }, { key: 'x', label: 'x', unit: 'm', dec: 3 }, { key: 'v', label: 'v', unit: 'm/s', dec: 3 },
  { key: 'disp', label: 'Δx', unit: 'm', dec: 3 }, { key: 'dist', label: 's (jarak)', unit: 'm', dec: 3 },
];
export const check = () => null;
export const duration = (p) => p.T;
export const turnTime = (p) => (p.a !== 0 && p.v * p.a < 0 ? -p.v / p.a : null);
export const position = (p, t) => p.x0 + p.v * t + 0.5 * p.a * t * t;
export const velocity = (p, t) => p.v + p.a * t;
export function distance(p, t) {
  const tt = turnTime(p);
  if (tt !== null && tt < t) return Math.abs(position(p, tt) - p.x0) + Math.abs(position(p, t) - position(p, tt));
  return Math.abs(position(p, t) - p.x0);
}
export function at(p, t) {
  const x = position(p, t);
  return { t, x, v: velocity(p, t), disp: x - p.x0, dist: distance(p, t) };
}
export function results(p) {
  const s = at(p, p.T);
  return [
    { key: 'x', label: 'Posisi akhir', symbol: 'x', unit: 'm', value: s.x },
    { key: 'v', label: 'Kecepatan akhir', symbol: 'v', unit: 'm/s', value: s.v },
    { key: 'disp', label: 'Perpindahan', symbol: 'Δx', unit: 'm', value: s.disp },
    { key: 'dist', label: 'Jarak tempuh', symbol: 's', unit: 'm', value: s.dist },
    { key: 'vavg', label: 'Kecepatan rata-rata', symbol: 'v̄', unit: 'm/s', value: s.disp / p.T },
    { key: 'speedavg', label: 'Laju rata-rata', symbol: '|v̄|', unit: 'm/s', value: s.dist / p.T },
  ];
}
// Rentang posisi selama percobaan (untuk skala lintasan).
export function extent(p) {
  let lo = Math.min(p.x0, position(p, p.T)), hi = Math.max(p.x0, position(p, p.T));
  const tt = turnTime(p);
  if (tt !== null && tt < p.T) { const xt = position(p, tt); lo = Math.min(lo, xt); hi = Math.max(hi, xt); }
  return [lo, hi];
}
