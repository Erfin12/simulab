/* © 2026 Erfin. All rights reserved. See LICENSE. */
// Jatuh bebas ideal: tanpa hambatan udara, g konstan, kecepatan awal nol.
export const params = [
  { key: 'h', symbol: 'h', label: 'Ketinggian awal', unit: 'm', min: 1, max: 500, step: 1, def: 20, desc: 'Tinggi benda di atas tanah saat dilepas.' },
  { key: 'g', symbol: 'g', label: 'Percepatan gravitasi', unit: 'm/s²', min: 1, max: 30, step: 0.01, def: 9.81, desc: 'Bumi 9,81; Bulan 1,62; Mars 3,71; Jupiter 24,79.' },
  { key: 'm', symbol: 'm', label: 'Massa benda', unit: 'kg', min: 0.1, max: 1000, step: 0.1, def: 1, desc: 'Tidak memengaruhi percepatan jatuh bebas ideal. Benda pembanding selalu 1 kg.' },
];
export const columns = [
  { key: 't', label: 't', unit: 's', dec: 2 }, { key: 'y', label: 'ketinggian y', unit: 'm', dec: 3 }, { key: 'v', label: 'kecepatan |v|', unit: 'm/s', dec: 3 },
  { key: 'fallen', label: 'jarak jatuh', unit: 'm', dec: 3 }, { key: 'yRef', label: 'y benda 1 kg', unit: 'm', dec: 3 },
];
export const check = () => null;
export const fallTime = (p) => Math.sqrt((2 * p.h) / p.g);
export const duration = fallTime;
export function at(p, t) {
  const tf = fallTime(p); const tc = Math.min(Math.max(t, 0), tf);
  const fallen = 0.5 * p.g * tc * tc;
  const y = Math.max(0, p.h - fallen);
  return { t, y, v: p.g * tc, fallen: p.h - y, yRef: y }; // benda 1 kg bergerak identik (massa tidak berpengaruh)
}
export function results(p) {
  const tf = fallTime(p), vf = p.g * tf;
  return [
    { key: 'tf', label: 'Waktu jatuh', symbol: 't', unit: 's', value: tf },
    { key: 'vf', label: 'Kecepatan saat menyentuh tanah', symbol: 'v', unit: 'm/s', value: vf },
    { key: 'W', label: 'Berat benda', symbol: 'w', unit: 'N', value: p.m * p.g },
    { key: 'Ek', label: 'Energi kinetik saat tumbukan', symbol: 'Ek', unit: 'J', value: 0.5 * p.m * vf * vf },
  ];
}
