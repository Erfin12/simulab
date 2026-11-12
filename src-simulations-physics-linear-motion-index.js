/* © 2026 Erfin. All rights reserved. See LICENSE. */
import * as model from './src-simulations-physics-linear-motion-model.js';
import { arrow, text, niceTicks } from './src-charts-canvas.js';
import { num } from './src-utils-format.js';

const COL = { x: 'primary', v: 'secondary', pos: 'primary' };
export default {
  id: 'linear-motion', title: 'Gerak Lurus', subtitle: 'GLB dan GLBB pada lintasan lurus',
  description: 'Atur posisi awal, kecepatan, percepatan, dan waktu. Amati benda bergerak sambil grafik posisi–waktu dan kecepatan–waktu terbentuk.',
  objectives: [
    'Membedakan GLB (percepatan nol) dan GLBB (percepatan tetap).',
    'Menghubungkan bentuk grafik x–t dan v–t dengan jenis gerak.',
    'Menghitung posisi, kecepatan, perpindahan, dan jarak tempuh dari rumus.',
    'Membedakan perpindahan (vektor) dan jarak tempuh (skalar).',
  ],
  theory: [
    'Gerak lurus adalah gerak benda pada lintasan lurus. Pada <b>GLB</b> kecepatan tetap sehingga percepatan nol dan grafik x–t berupa garis lurus. Pada <b>GLBB</b> kecepatan berubah secara tetap tiap detik sehingga grafik v–t berupa garis lurus miring dan grafik x–t berupa parabola.',
    'Perpindahan adalah perubahan posisi (bisa negatif). Jarak tempuh adalah panjang lintasan sebenarnya, selalu positif. Keduanya sama hanya jika benda tidak berbalik arah.',
    'Model: percepatan konstan, gerak satu dimensi, tanpa gesekan. Arah ke kanan dianggap positif.',
  ],
  formulas: [
    { eq: 'x(t) = x<sub>0</sub> + v<sub>0</sub>·t + ½·a·t²', note: 'posisi' },
    { eq: 'v(t) = v<sub>0</sub> + a·t', note: 'kecepatan' },
    { eq: 'Δx = x(t) − x<sub>0</sub>', note: 'perpindahan' },
    { eq: 'v̄ = Δx / t', note: 'kecepatan rata-rata' },
  ],
  model,
  charts: [
    { id: 'xt', title: 'Posisi terhadap waktu', xLabel: 't (s)', yLabel: 'x (m)', kind: 'time', xDomain: (p) => [0, p.T], series: [{ label: 'x(t)', color: 'primary', fn: model.position }] },
    { id: 'vt', title: 'Kecepatan terhadap waktu', xLabel: 't (s)', yLabel: 'v (m/s)', kind: 'time', xDomain: (p) => [0, p.T], series: [{ label: 'v(t)', color: 'secondary', fn: model.velocity }] },
  ],
  draw({ ctx, w, h, th }, p, s, t) {
    const [lo0, hi0] = model.extent(p); let lo = lo0, hi = hi0; const span = Math.max(10, hi - lo); const pad = span * 0.12; lo -= pad; hi += pad; if (hi - lo < 10) { const c = (hi + lo) / 2; lo = c - 5; hi = c + 5; }
    const L = 24, R = w - 24, gy = h * 0.66; const X = (v) => L + ((v - lo) / (hi - lo)) * (R - L);
    ctx.strokeStyle = th.border; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(L, gy); ctx.lineTo(R, gy); ctx.stroke();
    const nt = niceTicks(lo, hi, Math.max(3, Math.floor((R - L) / 70)));
    ctx.lineWidth = 1; for (const v of nt.ticks) { if (v < lo || v > hi) continue; const x = X(v); ctx.beginPath(); ctx.moveTo(x, gy); ctx.lineTo(x, gy + 7); ctx.strokeStyle = th.text2; ctx.stroke(); text(ctx, num(v, 2), x, gy + 21, { color: th.text2, size: 11, align: 'center' }); }
    text(ctx, 'posisi (m)', R, gy + 38, { color: th.text2, size: 11, align: 'right' });
    // jejak tiap detik
    ctx.fillStyle = th.text2; ctx.globalAlpha = 0.5; for (let ti = 0; ti <= t + 1e-9; ti += 1) { ctx.beginPath(); ctx.arc(X(model.position(p, ti)), gy - 6, 2.5, 0, 7); ctx.fill(); } ctx.globalAlpha = 1;
    // titik awal
    const x0 = X(p.x0); ctx.strokeStyle = th.warn; ctx.setLineDash([4, 3]); ctx.beginPath(); ctx.moveTo(x0, gy - 60); ctx.lineTo(x0, gy); ctx.stroke(); ctx.setLineDash([]);
    text(ctx, 'x₀', x0, gy - 66, { color: th.warn, size: 11, align: 'center' });
    // benda
    const cx = X(s.x), bw = 44, bh = 26; ctx.fillStyle = th.primary; ctx.beginPath(); ctx.roundRect(cx - bw / 2, gy - bh - 4, bw, bh, 6); ctx.fill();
    ctx.fillStyle = th.text2; for (const dx of [-12, 12]) { ctx.beginPath(); ctx.arc(cx + dx, gy - 2, 5, 0, 7); ctx.fill(); }
    // panah kecepatan
    const sc = Math.min(60, (R - L) / 6) / Math.max(5, Math.abs(p.v), Math.abs(model.velocity(p, p.T)));
    if (Math.abs(s.v) > 0.01) arrow(ctx, cx, gy - bh - 16, cx + s.v * sc, gy - bh - 16, th.secondary, 3);
    text(ctx, `v = ${num(s.v, 2)} m/s`, cx, gy - bh - 26, { color: th.secondary, size: 12, align: 'center', weight: 600 });
    text(ctx, `t = ${num(t, 2)} s    x = ${num(s.x, 2)} m`, 14, 22, { color: th.text, size: 13, weight: 600 });
    text(ctx, p.a === 0 ? 'GLB' : 'GLBB', R, 22, { color: th.text2, size: 12, align: 'right', weight: 700 });
  },
  challenges: [
    { id: 'target-v', type: 'target', title: 'Capai kecepatan tertentu', text: 'Atur variabel agar kecepatan akhir = 20 m/s dengan percepatan tidak nol (GLBB).', check: ({ p, r }) => (Math.abs(r.v - 20) <= 0.2 && p.a !== 0 ? { ok: true } : { ok: false, msg: `Kecepatan akhir saat ini ${num(r.v, 2)} m/s${p.a === 0 ? ' dan percepatan masih nol' : ''}.` }), explain: 'Dengan v = v₀ + a·t, kecepatan akhir 20 m/s dapat dicapai dengan banyak kombinasi (v₀, a, t). Contoh: v₀ = 5, a = 3, t = 5 → v = 5 + 3·5 = 20 m/s.' },
    { id: 'predict-x', type: 'predict', title: 'Prediksi posisi akhir', text: 'Setup soal: x₀ = 2 m, v₀ = 4 m/s, a = 2 m/s², t = 6 s. Prediksi posisi akhir (m) sebelum menjalankan simulasi.', setup: { x0: 2, v: 4, a: 2, T: 6 }, input: { label: 'Prediksi x akhir', unit: 'm' }, answer: (r) => r.x, tol: 0.02, explain: 'x = x₀ + v₀t + ½at² = 2 + 4·6 + ½·2·36 = 62 m.' },
    { id: 'choice-shape', type: 'choice', title: 'Bentuk grafik', text: 'Jika a ≠ 0 dan v₀ ≠ 0, bagaimana bentuk grafik x–t?', options: ['Garis lurus mendatar', 'Garis lurus miring', 'Parabola (lengkung)'], correct: 2, explain: 'x(t) memuat suku ½at² sehingga berbentuk parabola. Garis lurus miring hanya terjadi pada GLB (a = 0).' },
  ],
  conclude(p, r) {
    const R = Object.fromEntries(r.map((x) => [x.key, x.value]));
    const kind = p.a === 0 ? `GLB: kecepatan tetap ${num(p.v, 2)} m/s, grafik x–t lurus dan v–t mendatar.` : `GLBB: kecepatan berubah ${num(p.a, 2)} m/s tiap detik, grafik v–t lurus miring dan x–t melengkung.`;
    const turn = model.turnTime(p) !== null && model.turnTime(p) < p.T ? ` Benda berbalik arah pada t = ${num(model.turnTime(p), 2)} s, sehingga jarak tempuh (${num(R.dist, 2)} m) berbeda dari besar perpindahan (${num(Math.abs(R.disp), 2)} m).` : '';
    return `Pada percobaan ini benda bergerak ${kind} Setelah ${num(p.T, 1)} s, posisi akhir ${num(R.x, 2)} m, kecepatan akhir ${num(R.v, 2)} m/s, perpindahan ${num(R.disp, 2)} m.${turn}`;
  },
};
