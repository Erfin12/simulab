/* © 2026 Erfin. All rights reserved. See LICENSE. */
import * as model from './src-simulations-physics-waves-model.js';
import { arrow, text } from './src-charts-canvas.js';
import { num } from './src-utils-format.js';

export default {
  id: 'waves', title: 'Getaran dan Gelombang', subtitle: 'Gelombang transversal berjalan',
  description: 'Atur amplitudo, frekuensi, panjang gelombang, dan kecepatan rambat. Lihat gelombang merambat terus-menerus dan titik pengamatan yang bergetar naik-turun.',
  objectives: ['Menghubungkan v = f·λ pada gelombang.', 'Mengenali amplitudo, periode, frekuensi, dan panjang gelombang pada grafik.', 'Membedakan perambatan gelombang dan gerak partikel medium (partikel hanya bergetar di tempat).', 'Membaca grafik simpangan terhadap posisi dan terhadap waktu.'],
  theory: [
    'Gelombang membawa energi tanpa memindahkan materi. Pada gelombang transversal, partikel medium bergetar tegak lurus arah rambat. Satu getaran penuh memerlukan periode T = 1/f; selama itu gelombang maju sejauh satu panjang gelombang λ, sehingga v = λ/T = f·λ.',
    'Tiga besaran f, λ, dan v saling terkait: jika dua ditetapkan, yang ketiga ditentukan. Pilih satu di "Variabel yang dihitung otomatis". Pada medium yang sama v tetap; menaikkan f akan memperpendek λ.',
    '<b>Model:</b> gelombang sinus ideal merambat ke kanan tanpa redaman dan tanpa pantulan. Simulasi berjalan terus sampai dihentikan.',
  ],
  formulas: [{ eq: 'y(x,t) = A·sin(k·x − ω·t)', note: 'simpangan' }, { eq: 'v = f·λ', note: 'cepat rambat' }, { eq: 'T = 1 / f,  ω = 2π·f,  k = 2π / λ', note: 'besaran turunan' }],
  model,
  liveParams: true,
  charts: [
    { id: 'yx', title: 'Simpangan terhadap posisi (cuplikan saat ini)', xLabel: 'x (m)', yLabel: 'y (m)', kind: 'static', xDomain: () => [0, model.XMAX], yFixed: () => [-2, 2], series: [{ label: 'y(x)', color: 'primary', fn: (p, x, t) => model.yAt(p, x, t) }], marker: (p, t) => [{ x: p.xp, y: model.yAt(p, p.xp, t), color: 'warn' }] },
    { id: 'yt', title: 'Simpangan titik pengamatan terhadap waktu', xLabel: 't (s)', yLabel: 'y (m)', kind: 'time', xDomain: (p, t) => { const e = model.effective(p); const W = Math.max(3 / e.f, 2); const hi = Math.max(W, t); return [hi - W, hi]; }, yFixed: () => [-2, 2], series: [{ label: 'y(t)', color: 'secondary', fn: (p, t) => model.at(p, t).y }] },
  ],
  draw({ ctx, w, h, th }, p, s, t) {
    const e = model.effective(p); const L = 16, R = w - 16, my = h * 0.55, sc = (h * 0.34) / 2; const X = (x) => L + (x / model.XMAX) * (R - L);
    ctx.strokeStyle = th.border; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(L, my); ctx.lineTo(R, my); ctx.stroke();
    ctx.setLineDash([4, 4]); for (const sgn of [1, -1]) { ctx.beginPath(); ctx.moveTo(L, my - sgn * e.A * sc); ctx.lineTo(R, my - sgn * e.A * sc); ctx.stroke(); } ctx.setLineDash([]);
    text(ctx, 'A', L + 2, my - e.A * sc - 4, { color: th.text2, size: 11 });
    ctx.strokeStyle = th.primary; ctx.lineWidth = 3; ctx.lineJoin = 'round'; ctx.beginPath();
    const N = Math.max(60, Math.min(240, Math.floor((R - L) / 3))); for (let i = 0; i <= N; i++) { const x = (model.XMAX * i) / N, y = my - model.yAt(p, x, t) * sc; i ? ctx.lineTo(X(x), y) : ctx.moveTo(X(x), y); } ctx.stroke();
    ctx.fillStyle = th.secondary; for (let x = 0.5; x < model.XMAX; x += 0.5) { ctx.beginPath(); ctx.arc(X(x), my - model.yAt(p, x, t) * sc, 2.6, 0, 7); ctx.fill(); }
    // titik pengamatan
    const px = X(p.xp), py = my - s.y * sc; ctx.strokeStyle = th.warn; ctx.setLineDash([3, 3]); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(px, my - 2 * sc - 6); ctx.lineTo(px, my + 2 * sc + 6); ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle = th.warn; ctx.beginPath(); ctx.arc(px, py, 7, 0, 7); ctx.fill(); text(ctx, `x = ${num(p.xp, 1)} m`, px, my + 2 * sc + 20, { color: th.warn, size: 11, align: 'center', weight: 600 });
    // bracket panjang gelombang
    const k = model.k(e), om = model.omega(e); const twoPi = 2 * Math.PI; const ph = (((Math.PI / 2 + om * t) % twoPi) + twoPi) % twoPi; const x1 = ph / k, x2 = x1 + e.lambda; const by = my - 2 * sc - 14;
    if (x2 <= model.XMAX) { ctx.strokeStyle = th.ok; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(X(x1), by); ctx.lineTo(X(x2), by); ctx.moveTo(X(x1), by - 5); ctx.lineTo(X(x1), by + 5); ctx.moveTo(X(x2), by - 5); ctx.lineTo(X(x2), by + 5); ctx.stroke(); text(ctx, `λ = ${num(e.lambda, 2)} m`, (X(x1) + X(x2)) / 2, by - 7, { color: th.ok, size: 12, align: 'center', weight: 600 }); }
    arrow(ctx, R - 90, 20, R - 20, 20, th.text2, 2); text(ctx, `v = ${num(e.v, 2)} m/s`, R - 94, 24, { color: th.text2, size: 12, align: 'right' });
    text(ctx, `t = ${num(t, 2)} s`, 14, 20, { color: th.text, size: 13, weight: 600 });
  },
  challenges: [
    { id: 'target-v', type: 'target', title: 'Cepat rambat 6 m/s', text: 'Atur variabel agar kecepatan rambat gelombang = 6 m/s (±0,05) dan frekuensi minimal 1 Hz.', check: ({ r }) => (Math.abs(r.v - 6) <= 0.05 && r.f >= 1 ? { ok: true } : { ok: false, msg: `v = ${num(r.v, 3)} m/s, f = ${num(r.f, 2)} Hz.` }), explain: 'v = f·λ. Contoh: f = 2 Hz dan λ = 3 m → v = 6 m/s.' },
    { id: 'predict-lambda', type: 'predict', title: 'Prediksi panjang gelombang', text: 'Setup soal: v = 12 m/s dan f = 4 Hz (λ dihitung otomatis). Prediksi panjang gelombang (m).', setup: { v: 12, f: 4, mode: 'lambda' }, input: { label: 'Prediksi λ', unit: 'm' }, answer: (r) => r.lambda, tol: 0.02, explain: 'λ = v/f = 12/4 = 3 m.' },
    { id: 'choice-f', type: 'choice', title: 'Frekuensi naik, medium sama', text: 'Pada medium yang sama (v tetap), jika frekuensi dijadikan dua kali, panjang gelombang menjadi…', options: ['Dua kali', 'Tetap', 'Setengah kali'], correct: 2, explain: 'λ = v/f. Dengan v tetap, f dua kali berarti λ setengahnya. Coba mode "λ = v/f".' },
  ],
  conclude(p, r) {
    const R = Object.fromEntries(r.map((x) => [x.key, x.value]));
    return `Gelombang dengan amplitudo ${num(p.A, 2)} m memiliki frekuensi ${num(R.f, 2)} Hz, periode ${num(R.T, 2)} s, dan panjang gelombang ${num(R.lambda, 2)} m. Kecepatan rambatnya ${num(R.v, 2)} m/s, sesuai v = f·λ. Partikel di x = ${num(p.xp, 1)} m hanya bergetar naik-turun antara ±${num(p.A, 2)} m; yang merambat adalah bentuk gelombangnya.`;
  },
};
