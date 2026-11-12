/* © 2026 Erfin. All rights reserved. See LICENSE. */
// Hukum Newton pada bidang datar: gaya dorong F, gesekan opsional (μ statis = μ kinetis, penyederhanaan).
export const G = 9.81;
export const params = [
  { key: 'm', symbol: 'm', label: 'Massa benda', unit: 'kg', min: 0.5, max: 100, step: 0.5, def: 5, desc: 'Ukuran kelembaman benda.' },
  { key: 'F', symbol: 'F', label: 'Gaya dorong', unit: 'N', min: 0, max: 200, step: 1, def: 20, desc: 'Gaya horizontal ke kanan.' },
  { key: 'mu', symbol: 'μ', label: 'Koefisien gesek', unit: '', min: 0, max: 1, step: 0.01, def: 0, desc: '0 = lantai licin. Gesekan melawan arah gerak.' },
  { key: 'T', symbol: 't', label: 'Waktu pengamatan', unit: 's', min: 1, max: 20, step: 0.5, def: 6, desc: 'Lamanya percobaan.' },
];
export const columns = [
  { key: 't', label: 't', unit: 's', dec: 2 }, { key: 'x', label: 'x', unit: 'm', dec: 3 }, { key: 'v', label: 'v', unit: 'm/s', dec: 3 }, { key: 'a', label: 'a', unit: 'm/s²', dec: 3 },
];
export const check = () => null;
export const duration = (p) => p.T;
export const friction = (p) => p.mu * p.m * G;
export function force(p) {
  const fmax = friction(p);
  const moves = p.F > fmax;
  const fric = moves ? fmax : p.F; // saat diam, gesekan statis = F (seimbang)
  return { N: p.m * G, w: p.m * G, fmax, moves, fric, net: moves ? p.F - fmax : 0 };
}
export const accel = (p) => force(p).net / p.m;
export function at(p, t) { const a = accel(p); return { t, x: 0.5 * a * t * t, v: a * t, a }; }
export function results(p) {
  const f = force(p), s = at(p, p.T);
  return [
    { key: 'fnet', label: 'Gaya total', symbol: 'ΣF', unit: 'N', value: f.net },
    { key: 'a', label: 'Percepatan', symbol: 'a', unit: 'm/s²', value: f.net / p.m },
    { key: 'v', label: 'Kecepatan akhir', symbol: 'v', unit: 'm/s', value: s.v },
    { key: 'x', label: 'Perpindahan', symbol: 'Δx', unit: 'm', value: s.x },
    { key: 'fric', label: 'Gaya gesek', symbol: 'f', unit: 'N', value: f.fric },
  ];
}
// Percepatan sebagai fungsi gaya (untuk grafik a–F pada m dan μ saat ini).
export const accelAtForce = (p, F) => accel({ ...p, F });
