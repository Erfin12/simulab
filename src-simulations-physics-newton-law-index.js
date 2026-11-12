/* © 2026 Erfin. All rights reserved. See LICENSE. */
import * as model from './src-simulations-physics-newton-law-model.js';
import { arrow, text } from './src-charts-canvas.js';
import { num } from './src-utils-format.js';

export default {
  id: 'newton-law', title: 'Hukum Newton', subtitle: 'Gaya, massa, dan percepatan',
  description: 'Dorong sebuah benda di lantai datar. Ubah massa, gaya, dan gesekan; lihat panah gaya, percepatan, dan gerak benda.',
  objectives: ['Menerapkan Hukum II Newton: a = ΣF / m.', 'Menunjukkan Hukum I: tanpa gaya total, benda diam atau bergerak lurus beraturan.', 'Mengenali pasangan gaya aksi–reaksi (Hukum III).', 'Membaca hubungan percepatan terhadap gaya dan massa.'],
  theory: [
    '<b>Hukum I (kelembaman):</b> benda tetap diam atau bergerak lurus beraturan jika gaya total nol. Di simulasi ini, jika gaya dorong tidak melebihi gesekan maksimum, benda tetap diam.',
    '<b>Hukum II:</b> percepatan sebanding dengan gaya total dan berbanding terbalik dengan massa: a = ΣF/m.',
    '<b>Hukum III (aksi–reaksi):</b> jika tangan mendorong benda dengan gaya F, benda mendorong tangan dengan gaya sama besar berlawanan arah. Keduanya bekerja pada benda yang berbeda, sehingga tidak saling meniadakan pada benda.',
    '<b>Model:</b> lantai datar, gaya horizontal tetap, g = 9,81 m/s², gesekan statis dan kinetis dianggap sama (μ). Hambatan udara diabaikan.',
  ],
  formulas: [{ eq: 'ΣF = m·a', note: 'Hukum II' }, { eq: 'f = μ·N = μ·m·g', note: 'gesekan maksimum' }, { eq: 'ΣF = F − f', note: 'gaya total (jika bergerak)' }, { eq: 'v = a·t,  x = ½·a·t²', note: 'gerak dari diam' }],
  model,
  charts: [
    { id: 'aF', title: 'Percepatan terhadap gaya (m dan μ saat ini)', xLabel: 'F (N)', yLabel: 'a (m/s²)', kind: 'static', xDomain: () => [0, 200], series: [{ label: 'a(F)', color: 'primary', fn: (p, F) => model.accelAtForce(p, F) }], yFixed: (p) => [0, Math.max(1, 200 / p.m)], marker: (p) => [{ x: p.F, y: model.accel(p), color: 'warn' }] },
    { id: 'vt', title: 'Kecepatan terhadap waktu', xLabel: 't (s)', yLabel: 'v (m/s)', kind: 'time', xDomain: (p) => [0, p.T], series: [{ label: 'v(t)', color: 'secondary', fn: (p, t) => model.at(p, t).v }] },
  ],
  draw({ ctx, w, h, th }, p, s, t) {
    const f = model.force(p); const gy = h * 0.68, bw = 50 + 22 * Math.sqrt(p.m), bh = 36 + 8 * Math.sqrt(p.m) * 0.7;
    const bx = Math.min(w * 0.5, w - bw - 60); ctx.fillStyle = th.card2; ctx.fillRect(0, gy, w, h - gy);
    ctx.strokeStyle = th.border; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(w, gy); ctx.stroke();
    ctx.strokeStyle = th.text2; ctx.globalAlpha = 0.5; const sp = 40, off = ((s.x * 20) % sp + sp) % sp; for (let x = -off; x < w; x += sp) { ctx.beginPath(); ctx.moveTo(x, gy + 8); ctx.lineTo(x + 14, gy + 8); ctx.stroke(); } ctx.globalAlpha = 1;
    ctx.fillStyle = th.primary; ctx.beginPath(); ctx.roundRect(bx, gy - bh, bw, bh, 6); ctx.fill();
    text(ctx, `${num(p.m, 1)} kg`, bx + bw / 2, gy - bh / 2 + 5, { color: '#fff', size: 13, align: 'center', weight: 700 });
    ctx.fillStyle = th.warn; ctx.beginPath(); ctx.roundRect(bx - 30, gy - bh * 0.75, 22, bh * 0.5, 5); ctx.fill(); text(ctx, 'tangan', bx - 19, gy - bh * 0.75 - 6, { color: th.text2, size: 10, align: 'center' });
    const sc = 110 / Math.max(p.F, f.fric, 10);
    const fy = gy - bh - 22; // gaya pada benda
    if (p.F > 0) { arrow(ctx, bx, fy, bx + p.F * sc, fy, th.primary, 4); text(ctx, `F = ${num(p.F, 1)} N`, bx + (p.F * sc) / 2, fy - 10, { color: th.primary, size: 12, align: 'center', weight: 600 }); }
    if (f.fric > 0.01) { arrow(ctx, bx + bw, gy - 6, bx + bw - f.fric * sc, gy - 6, th.bad, 4); text(ctx, `f = ${num(f.fric, 1)} N`, bx + bw - (f.fric * sc) / 2, gy + 24, { color: th.bad, size: 12, align: 'center', weight: 600 }); }
    if (f.net > 0.01) { arrow(ctx, bx + bw / 2, fy - 26, bx + bw / 2 + f.net * sc, fy - 26, th.ok, 4); text(ctx, `ΣF = ${num(f.net, 1)} N`, bx + bw / 2 + (f.net * sc) / 2, fy - 36, { color: th.ok, size: 12, align: 'center', weight: 600 }); }
    if (p.F > 0) { arrow(ctx, bx - 8, gy - bh * 0.5, bx - 8 - Math.min(50, p.F * sc), gy - bh * 0.5, th.violet, 3); text(ctx, 'reaksi', bx - 8 - Math.min(50, p.F * sc) / 2, gy - bh * 0.5 + 18, { color: th.violet, size: 10, align: 'center' }); }
    text(ctx, `t = ${num(t, 2)} s    a = ${num(s.a, 2)} m/s²    v = ${num(s.v, 2)} m/s`, 14, 22, { color: th.text, size: 13, weight: 600 });
    text(ctx, f.moves ? (f.net > 0 && p.mu === 0 ? 'Tanpa gesekan' : 'Benda bergerak (gaya > gesekan)') : (p.F === 0 ? 'Tanpa gaya: benda diam (Hukum I)' : 'Gaya ≤ gesekan: benda diam (Hukum I)'), 14, 42, { color: th.text2, size: 12 });
    text(ctx, 'panjang panah ∝ besar gaya (skala sama)', w - 10, h - 8, { color: th.text2, size: 10, align: 'right' });
  },
  challenges: [
    { id: 'target-a', type: 'target', title: 'Percepatan 2,5 m/s²', text: 'Atur massa, gaya, dan gesekan sehingga percepatan benda 2,5 m/s² (±0,05).', check: ({ r }) => (Math.abs(r.a - 2.5) <= 0.05 ? { ok: true } : { ok: false, msg: `Percepatan saat ini ${num(r.a, 3)} m/s².` }), explain: 'a = (F − μmg)/m. Tanpa gesekan, F = m·a: untuk m = 4 kg dibutuhkan F = 10 N.' },
    { id: 'choice-double', type: 'choice', title: 'Gaya dua kali lipat', text: 'Massa dan gesekan tetap (tanpa gesekan). Jika gaya dijadikan dua kali, percepatan menjadi…', options: ['Setengah kali', 'Tetap', 'Dua kali', 'Empat kali'], correct: 2, explain: 'a = F/m, jadi a sebanding dengan F: gaya dua kali berarti percepatan dua kali (grafik a–F berupa garis lurus).' },
    { id: 'predict-v', type: 'predict', title: 'Prediksi kecepatan akhir', text: 'Setup soal: m = 10 kg, F = 60 N, μ = 0,2, t = 5 s. Prediksi kecepatan akhir (m/s).', setup: { m: 10, F: 60, mu: 0.2, T: 5 }, input: { label: 'Prediksi v akhir', unit: 'm/s' }, answer: (r) => r.v, tol: 0.03, explain: 'f = 0,2·10·9,81 = 19,62 N; ΣF = 40,38 N; a = 4,038 m/s²; v = a·t ≈ 20,19 m/s.' },
    { id: 'compare-mass', type: 'compare', title: 'Bandingkan dua massa', text: 'Tambahkan dua percobaan ke perbandingan dengan gaya, μ, dan waktu sama, tetapi massa kedua dua kali massa pertama.', check: ({ compares }) => { for (const a of compares) for (const b of compares) { if (a !== b && a.params.F === b.params.F && a.params.mu === b.params.mu && a.params.F > 0 && Math.abs(b.params.m / a.params.m - 2) < 1e-6 && a.results.a > 0) return { ok: true }; } return { ok: false, msg: 'Perlu dua entri dengan F dan μ sama (F menggerakkan benda), massa kedua = 2 × massa pertama.' }; }, explain: 'Percepatan benda bermassa dua kali lipat menjadi setengahnya (tanpa gesekan): a ∝ 1/m. Benda yang lebih berat lebih sulit dipercepat.' },
  ],
  conclude(p, r) {
    const R = Object.fromEntries(r.map((x) => [x.key, x.value]));
    if (!model.force(p).moves) return `Gaya dorong ${num(p.F, 1)} N tidak melebihi gesekan maksimum ${num(model.friction(p), 1)} N, sehingga gaya total nol dan benda tetap diam (Hukum I).`;
    return `Dengan m = ${num(p.m, 1)} kg dan gaya total ${num(R.fnet, 1)} N, percepatan benda ${num(R.a, 2)} m/s² (a = ΣF/m, Hukum II). Setelah ${num(p.T, 1)} s kecepatannya ${num(R.v, 2)} m/s dan benda berpindah ${num(R.x, 2)} m. Gaya lebih besar menaikkan percepatan; massa lebih besar menurunkannya.`;
  },
};
