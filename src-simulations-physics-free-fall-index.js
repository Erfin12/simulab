/* © 2026 Erfin. All rights reserved. See LICENSE. */
import * as model from './src-simulations-physics-free-fall-model.js';
import { arrow, text, niceTicks } from './src-charts-canvas.js';
import { num } from './src-utils-format.js';

export default {
  id: 'free-fall', title: 'Gerak Jatuh Bebas', subtitle: 'Jatuh bebas ideal tanpa hambatan udara',
  description: 'Jatuhkan benda dari ketinggian tertentu, ubah gravitasi dan massa, lalu lihat bahwa massa tidak memengaruhi waktu jatuh. Benda pembanding 1 kg dijatuhkan bersamaan.',
  objectives: ['Menghitung waktu jatuh dan kecepatan saat menyentuh tanah.', 'Menunjukkan bahwa percepatan jatuh bebas tidak bergantung pada massa.', 'Membandingkan jatuh bebas di Bumi, Bulan, Mars, dan Jupiter.', 'Membaca grafik ketinggian–waktu dan kecepatan–waktu.'],
  theory: [
    'Pada jatuh bebas, benda hanya dipengaruhi gravitasi dan dilepas tanpa kecepatan awal. Percepatannya sama dengan g untuk semua massa: gaya berat yang lebih besar pada benda berat diimbangi oleh kelembaman yang juga lebih besar.',
    '<b>Model ideal:</b> hambatan udara diabaikan. Di dunia nyata, selembar kertas jatuh lebih lambat dari batu karena hambatan udara, bukan karena massanya. Di ruang hampa keduanya jatuh bersamaan.',
    'Ketinggian dihitung dari tanah (y = 0). Setelah menyentuh tanah, simulasi berhenti.',
  ],
  formulas: [
    { eq: 'y(t) = h − ½·g·t²', note: 'ketinggian' }, { eq: 'v(t) = g·t', note: 'kecepatan' },
    { eq: 't<sub>jatuh</sub> = √(2h / g)', note: 'waktu jatuh' }, { eq: 'v<sub>akhir</sub> = √(2·g·h)', note: 'kecepatan di tanah' }, { eq: 'w = m·g', note: 'berat' },
  ],
  model,
  charts: [
    { id: 'yt', title: 'Ketinggian terhadap waktu', xLabel: 't (s)', yLabel: 'y (m)', kind: 'time', xDomain: (p) => [0, model.fallTime(p)], series: [{ label: 'y(t)', color: 'primary', fn: (p, t) => model.at(p, t).y }] },
    { id: 'vt', title: 'Kecepatan terhadap waktu', xLabel: 't (s)', yLabel: '|v| (m/s)', kind: 'time', xDomain: (p) => [0, model.fallTime(p)], series: [{ label: 'v(t)', color: 'secondary', fn: (p, t) => model.at(p, t).v }] },
  ],
  draw({ ctx, w, h, th }, p, s, t) {
    const top = 34, gy = h - 30, H = gy - top; const Y = (y) => gy - (y / p.h) * H;
    const nt = niceTicks(0, p.h, Math.max(3, Math.floor(H / 50)));
    ctx.lineWidth = 1; for (const v of nt.ticks) { if (v > p.h + 1e-9) continue; const y = Y(v); ctx.strokeStyle = th.border; ctx.beginPath(); ctx.moveTo(46, y); ctx.lineTo(w - 10, y); ctx.stroke(); text(ctx, num(v, 1), 40, y + 4, { color: th.text2, size: 11, align: 'right' }); }
    ctx.fillStyle = th.border; ctx.fillRect(46, gy, w - 56, 6); text(ctx, 'tanah', w - 14, gy + 20, { color: th.text2, size: 11, align: 'right' });
    const tf = model.fallTime(p); ctx.fillStyle = th.text2; ctx.globalAlpha = 0.45;
    for (let i = 1; i <= 10; i++) { const ti = (tf * i) / 10; if (ti > t) break; const yy = Y(model.at(p, ti).y); for (const fx of [0.4, 0.68]) { ctx.beginPath(); ctx.arc(46 + (w - 56) * fx, yy, 2.5, 0, 7); ctx.fill(); } }
    ctx.globalAlpha = 1;
    const r = (m) => 7 + 6 * Math.log10(1 + m);
    const balls = [{ x: 46 + (w - 56) * 0.4, m: p.m, c: th.primary, label: `${num(p.m, 1)} kg` }, { x: 46 + (w - 56) * 0.68, m: 1, c: th.secondary, label: '1 kg (pembanding)' }];
    for (const b of balls) { const rr = r(b.m), y = Y(s.y) - rr; ctx.fillStyle = b.c; ctx.beginPath(); ctx.arc(b.x, y, rr, 0, 7); ctx.fill(); text(ctx, b.label, b.x, gy - 8 > 0 ? gy + 20 : 0, { color: th.text2, size: 11, align: 'center' }); }
    const b0 = balls[0], rr0 = r(p.m); if (s.v > 0.01) arrow(ctx, b0.x + rr0 + 12, Y(s.y) - rr0, b0.x + rr0 + 12, Y(s.y) - rr0 + Math.min(50, 8 + s.v * 1.2), th.bad, 3);
    text(ctx, `t = ${num(t, 2)} s`, 56, 20, { color: th.text, size: 13, weight: 600 });
    text(ctx, `y = ${num(s.y, 2)} m    v = ${num(s.v, 2)} m/s`, w - 10, 20, { color: th.text, size: 13, weight: 600, align: 'right' });
  },
  challenges: [
    { id: 'compare-mass', type: 'compare', title: 'Bandingkan dua massa', text: 'Tambahkan dua percobaan ke tabel perbandingan: ketinggian dan g sama, massa berbeda sedikitnya 10 kali lipat. Bandingkan waktu jatuhnya.', check: ({ compares }) => { for (let i = 0; i < compares.length; i++) for (let j = i + 1; j < compares.length; j++) { const a = compares[i], b = compares[j]; if (a.params.h === b.params.h && a.params.g === b.params.g && Math.max(a.params.m, b.params.m) >= 10 * Math.min(a.params.m, b.params.m)) return { ok: true }; } return { ok: false, msg: 'Perlu dua entri dengan h dan g sama, massa berbeda ≥ 10×.' }; }, explain: 'Waktu jatuh kedua benda sama (t = √(2h/g)) karena rumusnya tidak memuat massa. Benda berat ditarik gaya lebih besar, tetapi juga lebih sulit dipercepat; efeknya saling meniadakan.' },
    { id: 'target-t', type: 'target', title: 'Waktu jatuh 3 detik', text: 'Atur ketinggian dan g agar benda jatuh dalam 3,00 s (toleransi ±0,05 s).', check: ({ r }) => (Math.abs(r.tf - 3) <= 0.05 ? { ok: true } : { ok: false, msg: `Waktu jatuh saat ini ${num(r.tf, 3)} s.` }), explain: 't = √(2h/g) → h = ½·g·t². Di Bumi (g = 9,81) h = ½·9,81·9 ≈ 44,1 m.' },
    { id: 'predict-moon', type: 'predict', title: 'Prediksi di Bulan', text: 'Setup soal: h = 10 m, g = 1,62 m/s² (Bulan). Prediksi waktu jatuh (s).', setup: { h: 10, g: 1.62, m: 1 }, input: { label: 'Prediksi waktu jatuh', unit: 's' }, answer: (r) => r.tf, tol: 0.03, explain: 't = √(2·10/1,62) ≈ 3,51 s. Di Bumi dari 10 m hanya ≈ 1,43 s, karena g Bulan lebih kecil.' },
  ],
  conclude(p, r) {
    const R = Object.fromEntries(r.map((x) => [x.key, x.value]));
    return `Benda ${num(p.m, 1)} kg dan benda pembanding 1 kg jatuh dari ${num(p.h, 1)} m dengan g = ${num(p.g, 2)} m/s² dan mencapai tanah bersamaan setelah ${num(R.tf, 2)} s, dengan kecepatan ${num(R.vf, 2)} m/s. Massa hanya memengaruhi berat (${num(R.W, 1)} N), bukan waktu jatuh. Hasil ini berlaku untuk model ideal tanpa hambatan udara.`;
  },
};
