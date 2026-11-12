/* © 2026 Erfin. All rights reserved. See LICENSE. */
import * as model from './src-simulations-physics-energy-model.js';
import { arrow, text, niceTicks } from './src-charts-canvas.js';
import { num } from './src-utils-format.js';

export default {
  id: 'energy', title: 'Energi Kinetik dan Potensial', subtitle: 'Kekekalan energi mekanik',
  description: 'Lempar benda ke atas dari ketinggian tertentu. Lihat energi kinetik berubah menjadi potensial dan sebaliknya, sementara energi mekanik total tetap.',
  objectives: ['Menghitung energi kinetik dan energi potensial gravitasi.', 'Menunjukkan energi mekanik tetap tanpa hambatan udara.', 'Menjelaskan perubahan energi di titik tertinggi dan saat menyentuh tanah.', 'Menghubungkan massa, kecepatan, dan ketinggian dengan energi.'],
  theory: [
    'Energi kinetik (Ek) adalah energi gerak. Energi potensial gravitasi (Ep) adalah energi karena posisi terhadap acuan (di sini tanah, y = 0). Jumlahnya disebut energi mekanik Em = Ek + Ep.',
    'Jika hanya gravitasi yang bekerja (tanpa hambatan udara), Em konstan: saat benda naik, Ek turun dan Ep naik; saat turun sebaliknya. Di titik tertinggi kecepatan nol sehingga Ek = 0.',
    '<b>Model ideal:</b> tanpa hambatan udara, g konstan, gerak vertikal. Benda berhenti saat menyentuh tanah (energi tidak dimodelkan setelah tumbukan).',
  ],
  formulas: [{ eq: 'Ek = ½·m·v²', note: 'energi kinetik' }, { eq: 'Ep = m·g·h', note: 'energi potensial' }, { eq: 'Em = Ek + Ep = konstan', note: 'energi mekanik' }, { eq: 'h<sub>maks</sub> = h<sub>0</sub> + v<sub>0</sub>² / (2g)', note: 'tinggi maksimum' }],
  model,
  charts: [{ id: 'e', title: 'Energi terhadap waktu', xLabel: 't (s)', yLabel: 'Energi (J)', kind: 'time', xDomain: (p) => [0, model.duration(p)], yFixed: (p) => [0, results0(p) * 1.05], series: [{ label: 'Ek', color: 'primary', fn: (p, t) => model.at(p, t).ek }, { label: 'Ep', color: 'warn', fn: (p, t) => model.at(p, t).ep }, { label: 'Em', color: 'ok', fn: (p, t) => model.at(p, t).em }] }],
  draw({ ctx, w, h, th }, p, s, t) {
    const hmax = model.results(p).find((r) => r.key === 'hmax').value; const top = 40, gy = h - 30, H = gy - top; const Y = (y) => gy - (y / hmax) * H;
    const shaftW = Math.min(w * 0.45, 190); const nt = niceTicks(0, hmax, Math.max(3, Math.floor(H / 50)));
    for (const v of nt.ticks) { if (v > hmax + 1e-9) continue; ctx.strokeStyle = th.border; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(44, Y(v)); ctx.lineTo(shaftW, Y(v)); ctx.stroke(); text(ctx, num(v, 1), 38, Y(v) + 4, { color: th.text2, size: 11, align: 'right' }); }
    ctx.fillStyle = th.border; ctx.fillRect(44, gy, shaftW - 44, 6);
    const bx = 44 + (shaftW - 44) / 2, rr = 9 + Math.min(10, p.m * 0.3); ctx.fillStyle = th.primary; ctx.beginPath(); ctx.arc(bx, Y(s.y) - rr, rr, 0, 7); ctx.fill();
    if (Math.abs(s.v) > 0.05) arrow(ctx, bx + rr + 10, Y(s.y) - rr, bx + rr + 10, Y(s.y) - rr - Math.max(-40, Math.min(40, s.v * 2)), th.secondary, 3);
    // batang energi
    const em = Math.max(model.at(p, 0).em, 1e-9), bxl = shaftW + 24, bwid = Math.max(18, (w - bxl - 20) / 5), bars = [['Ek', s.ek, th.primary], ['Ep', s.ep, th.warn], ['Em', s.em, th.ok]];
    bars.forEach(([n, v, c], i) => { const x = bxl + i * (bwid + 10), bh = (v / em) * H; ctx.fillStyle = c; ctx.fillRect(x, gy - bh, bwid, bh); text(ctx, n, x + bwid / 2, gy + 18, { color: th.text2, size: 12, align: 'center', weight: 700 }); text(ctx, num(v, 1), x + bwid / 2, gy - bh - 5, { color: th.text, size: 11, align: 'center' }); });
    text(ctx, `t = ${num(t, 2)} s    y = ${num(s.y, 2)} m    v = ${num(s.v, 2)} m/s`, 14, 22, { color: th.text, size: 13, weight: 600 });
  },
  challenges: [
    { id: 'target-equal', type: 'target', title: 'Ek awal = Ep awal', text: 'Atur variabel agar energi kinetik awal sama dengan energi potensial awal (selisih ≤ 2%), dan keduanya lebih dari nol.', check: ({ r }) => (r.ek0 > 0 && r.ep0 > 0 && Math.abs(r.ek0 - r.ep0) <= 0.02 * Math.max(r.ek0, r.ep0) ? { ok: true } : { ok: false, msg: `Ek₀ = ${num(r.ek0, 2)} J, Ep₀ = ${num(r.ep0, 2)} J.` }), explain: '½·m·v₀² = m·g·h₀ → v₀² = 2·g·h₀. Massa tidak berpengaruh pada syarat ini. Contoh: h₀ = 10 m, g = 9,81 → v₀ ≈ 14,0 m/s.' },
    { id: 'predict-v', type: 'predict', title: 'Prediksi kecepatan di tanah', text: 'Setup soal: benda dilepas (v₀ = 0) dari h₀ = 20 m dengan g = 10 m/s². Prediksi kecepatan saat menyentuh tanah (m/s).', setup: { m: 1, h0: 20, v0: 0, g: 10 }, input: { label: 'Prediksi v', unit: 'm/s' }, answer: (r) => r.vimp, tol: 0.03, explain: 'Ep awal berubah penuh menjadi Ek: m·g·h = ½·m·v² → v = √(2gh) = √400 = 20 m/s.' },
    { id: 'choice-top', type: 'choice', title: 'Di titik tertinggi', text: 'Benda dilempar ke atas (v₀ > 0). Di titik tertinggi, energi kinetiknya…', options: ['Maksimum', 'Nol, semua energi menjadi potensial', 'Sama dengan energi potensial'], correct: 1, explain: 'Di puncak kecepatan sesaat nol sehingga Ek = 0 dan Ep = Em (maksimum).' },
  ],
  conclude(p, r) {
    const R = Object.fromEntries(r.map((x) => [x.key, x.value]));
    return `Energi mekanik total ${num(R.em, 2)} J tetap sepanjang gerak: saat benda naik Ek berubah menjadi Ep, mencapai ketinggian maksimum ${num(R.hmax, 2)} m pada t = ${num(R.tApex, 2)} s (Ek = 0 di sana), lalu Ep berubah kembali menjadi Ek. Benda menyentuh tanah dengan kecepatan ${num(R.vimp, 2)} m/s. Hasil ini berlaku tanpa hambatan udara.`;
  },
};
function results0(p) { return model.results(p).find((r) => r.key === 'em').value; }
