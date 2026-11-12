/* © 2026 Erfin. All rights reserved. See LICENSE. */
// Energi mekanik: benda dilempar vertikal ke atas dari ketinggian h0 dengan kecepatan awal v0, tanpa hambatan udara.
// Acuan energi potensial: permukaan tanah (y = 0).
export const params = [
  { key: 'm', symbol: 'm', label: 'Massa', unit: 'kg', min: 0.1, max: 100, step: 0.1, def: 2, desc: 'Massa benda.' },
  { key: 'h0', symbol: 'h₀', label: 'Ketinggian awal', unit: 'm', min: 0, max: 100, step: 0.5, def: 10, desc: 'Tinggi awal di atas tanah (acuan EP = 0).' },
  { key: 'v0', symbol: 'v₀', label: 'Kecepatan awal ke atas', unit: 'm/s', min: 0, max: 30, step: 0.5, def: 8, desc: 'Kecepatan lemparan ke atas saat t = 0.' },
  { key: 'g', symbol: 'g', label: 'Percepatan gravitasi', unit: 'm/s²', min: 1, max: 30, step: 0.01, def: 9.81, desc: 'Bumi 9,81 m/s².' },
];
export const columns = [
  { key: 't', label: 't', unit: 's', dec: 2 }, { key: 'y', label: 'ketinggian', unit: 'm', dec: 3 }, { key: 'v', label: 'kecepatan', unit: 'm/s', dec: 3 },
  { key: 'ek', label: 'Ek', unit: 'J', dec: 3 }, { key: 'ep', label: 'Ep', unit: 'J', dec: 3 }, { key: 'em', label: 'Em', unit: 'J', dec: 3 },
];
export const check = (p) => (p.h0 + p.v0 <= 0 ? 'Atur ketinggian awal atau kecepatan awal lebih dari 0 agar benda bergerak.' : null);
export const duration = (p) => (p.v0 + Math.sqrt(p.v0 * p.v0 + 2 * p.g * p.h0)) / p.g; // waktu sampai tanah
export function at(p, t) {
  const tc = Math.min(Math.max(t, 0), duration(p));
  const y = Math.max(0, p.h0 + p.v0 * tc - 0.5 * p.g * tc * tc);
  const v = p.v0 - p.g * tc; // positif ke atas
  const ek = 0.5 * p.m * v * v, ep = p.m * p.g * y;
  return { t, y, v, ek, ep, em: ek + ep };
}
export function results(p) {
  const tApex = p.v0 / p.g, hmax = p.h0 + (p.v0 * p.v0) / (2 * p.g), em = p.m * p.g * p.h0 + 0.5 * p.m * p.v0 * p.v0;
  return [
    { key: 'em', label: 'Energi mekanik total', symbol: 'Em', unit: 'J', value: em },
    { key: 'ek0', label: 'Energi kinetik awal', symbol: 'Ek₀', unit: 'J', value: 0.5 * p.m * p.v0 * p.v0 },
    { key: 'ep0', label: 'Energi potensial awal', symbol: 'Ep₀', unit: 'J', value: p.m * p.g * p.h0 },
    { key: 'hmax', label: 'Ketinggian maksimum', symbol: 'hmaks', unit: 'm', value: hmax },
    { key: 'tApex', label: 'Waktu mencapai puncak', symbol: 't', unit: 's', value: tApex },
    { key: 'vimp', label: 'Kecepatan saat menyentuh tanah', symbol: 'v', unit: 'm/s', value: Math.sqrt(p.v0 * p.v0 + 2 * p.g * p.h0) },
  ];
}
