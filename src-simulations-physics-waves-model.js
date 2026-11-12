/* © 2026 Erfin. All rights reserved. See LICENSE. */
// Gelombang transversal berjalan ke kanan: y(x,t) = A sin(kx − ωt), dengan v = f·λ.
export const params = [
  { key: 'A', symbol: 'A', label: 'Amplitudo', unit: 'm', min: 0.1, max: 2, step: 0.05, def: 1, desc: 'Simpangan maksimum dari titik setimbang.' },
  { key: 'f', symbol: 'f', label: 'Frekuensi', unit: 'Hz', min: 0.1, max: 5, step: 0.05, def: 0.5, desc: 'Jumlah getaran per detik.' },
  { key: 'lambda', symbol: 'λ', label: 'Panjang gelombang', unit: 'm', min: 0.5, max: 10, step: 0.1, def: 4, desc: 'Jarak satu gelombang penuh.' },
  { key: 'v', symbol: 'v', label: 'Kecepatan rambat', unit: 'm/s', min: 0.05, max: 50, step: 0.05, def: 2, desc: 'Kecepatan gelombang merambat pada medium.' },
  { key: 'mode', type: 'select', label: 'Variabel yang dihitung otomatis', def: 'v', options: [{ value: 'v', label: 'v = f·λ (kecepatan)' }, { value: 'lambda', label: 'λ = v/f (panjang gelombang)' }, { value: 'f', label: 'f = v/λ (frekuensi)' }], desc: 'Tiga besaran saling terkait. Pilih satu yang dihitung dari dua lainnya.' },
  { key: 'xp', symbol: 'x', label: 'Titik pengamatan', unit: 'm', min: 0, max: 20, step: 0.5, def: 5, desc: 'Posisi partikel medium yang grafik simpangannya diamati.' },
];
export const XMAX = 20;
export const columns = [
  { key: 't', label: 't', unit: 's', dec: 2 }, { key: 'y', label: 'y di titik x', unit: 'm', dec: 3 }, { key: 'vy', label: 'kecepatan partikel', unit: 'm/s', dec: 3 },
];
export const infinite = true;
export const duration = () => Infinity;
// Nilai efektif: satu besaran dihitung dari dua lainnya sesuai mode.
export function effective(p) {
  const e = { ...p };
  if (p.mode === 'v') e.v = p.f * p.lambda;
  else if (p.mode === 'lambda') e.lambda = p.v / p.f;
  else e.f = p.v / p.lambda;
  return e;
}
export function check(p) {
  const e = effective(p);
  for (const d of params) {
    if (d.type === 'select' || d.key === 'mode') continue;
    if (d.key === p.mode && (e[d.key] < d.min - 1e-9 || e[d.key] > d.max + 1e-9)) return `Hasil perhitungan ${d.label.toLowerCase()} = ${+e[d.key].toFixed(3)} ${d.unit} di luar batas ${d.min}–${d.max} ${d.unit}. Ubah nilai lainnya.`;
  }
  return null;
}
export const omega = (e) => 2 * Math.PI * e.f;
export const k = (e) => (2 * Math.PI) / e.lambda;
export const yAt = (p, x, t) => { const e = effective(p); return e.A * Math.sin(k(e) * x - omega(e) * t); };
export function at(p, t) {
  const e = effective(p); const ph = k(e) * p.xp - omega(e) * t;
  return { t, y: e.A * Math.sin(ph), vy: -e.A * omega(e) * Math.cos(ph) };
}
export function results(p) {
  const e = effective(p);
  return [
    { key: 'T', label: 'Periode', symbol: 'T', unit: 's', value: 1 / e.f },
    { key: 'v', label: 'Kecepatan rambat', symbol: 'v', unit: 'm/s', value: e.v },
    { key: 'lambda', label: 'Panjang gelombang', symbol: 'λ', unit: 'm', value: e.lambda },
    { key: 'f', label: 'Frekuensi', symbol: 'f', unit: 'Hz', value: e.f },
    { key: 'omega', label: 'Frekuensi sudut', symbol: 'ω', unit: 'rad/s', value: omega(e) },
    { key: 'k', label: 'Bilangan gelombang', symbol: 'k', unit: 'rad/m', value: k(e) },
  ];
}
