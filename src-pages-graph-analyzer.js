/* © 2026 Erfin. All rights reserved. See LICENSE. */
import { h, clear } from './src-utils-dom.js';
import { num } from './src-utils-format.js';
import { Chart } from './src-charts-chart.js';
import { theme } from './src-charts-canvas.js';
import * as store from './src-storage-db.js';
import { head, empty } from './src-components-cards.js';

export function stats(pts) {
  const n = pts.length; if (n < 2) return null;
  const mx = pts.reduce((a, p) => a + p[0], 0) / n, my = pts.reduce((a, p) => a + p[1], 0) / n;
  let sxx = 0, sxy = 0, syy = 0; for (const [x, y] of pts) { sxx += (x - mx) ** 2; sxy += (x - mx) * (y - my); syy += (y - my) ** 2; }
  const slope = sxx > 0 ? sxy / sxx : NaN, icpt = my - slope * mx; const r2 = sxx > 0 && syy > 0 ? (sxy * sxy) / (sxx * syy) : (syy === 0 ? 1 : NaN);
  const ys = pts.map((p) => p[1]);
  return { n, min: Math.min(...ys), max: Math.max(...ys), mean: my, slope, icpt, r2 };
}
export async function render(ctx) {
  const list = (await store.listExperiments()).filter((r) => r.observations && r.observations.length > 1);
  if (!list.length) return { title: 'Graph Analyzer', el: h('div', { class: 'page' }, head('Graph Analyzer', 'Analisis data dari tabel pengamatan eksperimen tersimpan.'), empty('Belum ada data untuk dianalisis', 'Jalankan simulasi sampai ada tabel pengamatan, lalu simpan eksperimen.', h('a', { class: 'btn btn-primary', href: '#/explore' }, 'Jelajahi simulasi'))) };
  let cur = list.find((r) => r.id === ctx.query.get('id')) || list[0];
  const out = h('div'); const selExp = h('select', { 'aria-label': 'Eksperimen' }, list.map((r) => h('option', { value: r.id, selected: r.id === cur.id }, r.name)));
  const selX = h('select', { 'aria-label': 'Sumbu X' }), selY = h('select', { 'aria-label': 'Sumbu Y' }); let chart = null;
  const lab = (c) => c.label + (c.unit ? ` (${c.unit})` : '');
  function fillCols() { clear(selX); clear(selY); cur.columns.forEach((c) => { selX.append(h('option', { value: c.key }, lab(c))); selY.append(h('option', { value: c.key }, lab(c))); }); selX.value = cur.columns[0].key; selY.value = (cur.columns[1] || cur.columns[0]).key; }
  function draw() {
    clear(out); if (chart) { chart.destroy(); chart = null; }
    const cx = cur.columns.find((c) => c.key === selX.value), cy = cur.columns.find((c) => c.key === selY.value);
    const pts = cur.observations.map((o) => [o[cx.key], o[cy.key]]).filter((p) => Number.isFinite(p[0]) && Number.isFinite(p[1])).sort((a, b) => a[0] - b[0]);
    const st = stats(pts); const cv = h('canvas', { class: 'chart', role: 'img', 'aria-label': 'Grafik analisis' });
    out.append(h('div', { class: 'card chart-card' }, cv));
    if (!st) { out.append(h('p', { class: 'muted' }, 'Data tidak cukup (minimal 2 titik).')); return; }
    const th = theme(); const xs = pts.map((p) => p[0]); const x0 = Math.min(...xs), x1 = Math.max(...xs);
    const series = [{ label: cy.label, color: th.primary, pts }]; if (Number.isFinite(st.slope) && x1 > x0) series.push({ label: 'regresi linear', color: th.warn, pts: [[x0, st.icpt + st.slope * x0], [x1, st.icpt + st.slope * x1]], dash: [6, 4] });
    chart = new Chart(cv, { xLabel: lab(cx), yLabel: lab(cy) }); requestAnimationFrame(() => chart.draw({ xDomain: x0 === x1 ? [x0 - 1, x1 + 1] : [x0, x1], series }));
    out.append(h('div', { class: 'tiles' }, [['Jumlah titik', st.n], ['Y minimum', num(st.min, 4)], ['Y maksimum', num(st.max, 4)], ['Y rata-rata', num(st.mean, 4)], ['Kemiringan (dY/dX)', num(st.slope, 4)], ['Perpotongan Y', num(st.icpt, 4)], ['R² regresi linear', num(st.r2, 4)]].map(([l, v]) => h('div', { class: 'tile' }, h('span', { class: 'tile-l' }, l), h('b', null, v)))), h('p', { class: 'muted small' }, 'Regresi linear bermakna jika data mendekati garis lurus (R² mendekati 1). Untuk fungsi melengkung (gerak dipercepat, kinetika, populasi), R² linear < 1 itu wajar. Korelasi tidak membuktikan sebab-akibat.'));
  }
  selExp.addEventListener('change', () => { cur = list.find((r) => r.id === selExp.value); fillCols(); draw(); }); selX.addEventListener('change', draw); selY.addEventListener('change', draw);
  fillCols(); draw();
  return { title: 'Graph Analyzer', el: h('div', { class: 'page' }, head('Graph Analyzer', 'Pilih data eksperimen tersimpan, tentukan sumbu, dan lihat statistik serta regresi linear.'), h('div', { class: 'card filters row-gap wrap' }, h('label', null, 'Eksperimen', selExp), h('label', null, 'Sumbu X', selX), h('label', null, 'Sumbu Y', selY)), out), destroy() { if (chart) chart.destroy(); } };
}
