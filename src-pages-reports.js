/* © 2026 Erfin. All rights reserved. See LICENSE. */
import { h, clear, toast } from './src-utils-dom.js';
import { num, dateTime } from './src-utils-format.js';
import { Chart } from './src-charts-chart.js';
import { theme } from './src-charts-canvas.js';
import * as store from './src-storage-db.js';
import { simById } from './src-data-registry.js';
import { head, empty } from './src-components-cards.js';
import { icon } from './src-components-icons.js';
import { exportCsv, confirmDelete } from './src-pages-my-experiments.js';

export async function render(ctx) {
  const id = ctx.segs[0];
  if (!id) {
    const list = await store.listExperiments();
    return { title: 'Reports', el: h('div', { class: 'page' }, head('Reports', 'Pilih eksperimen tersimpan untuk membuat laporan yang bisa dicetak.'), list.length ? h('div', { class: 'list' }, list.map((r) => h('a', { class: 'card exp-item link', href: '#/reports/' + r.id }, h('div', null, h('h3', null, r.name), h('p', { class: 'muted small' }, `${r.simTitle} · ${dateTime(r.createdAt)}`)), icon('chevron', 20)))) : empty('Belum ada laporan', 'Laporan dibuat dari eksperimen yang sudah disimpan.', h('a', { class: 'btn btn-primary', href: '#/explore' }, 'Jelajahi simulasi'))) };
  }
  const rec = await store.getExperiment(id); if (!rec) return ctx.notFound();
  const meta = simById(rec.simId); const def = (await meta.load()).default; const pd = def.model.params;
  const charts = []; const chartEls = [];
  const obs = rec.observations || []; const cols = rec.columns || [];
  if (obs.length > 1) for (const c of cols.filter((c) => c.key !== 't')) { const cv = h('canvas', { class: 'chart', role: 'img', 'aria-label': `Grafik ${c.label} terhadap waktu` }); const ch = new Chart(cv, { xLabel: (()=>{const tc=cols.find(x=>x.key==='t');return tc?tc.label+(tc.unit?' ('+tc.unit+')':''):'t'})(), yLabel: `${c.label}${c.unit ? ' (' + c.unit + ')' : ''}` }); charts.push(ch); chartEls.push(h('div', { class: 'chart-card' }, cv)); const th = theme(); requestAnimationFrame(() => ch.draw({ xDomain: [obs[0].t, obs[obs.length - 1].t], series: [{ label: c.label, color: th.primary, pts: obs.map((o) => [o.t, o[c.key]]) }] })); }
  const res4 = (r) => h('tr', null, h('td', null, r.label), h('td', null, r.symbol), h('td', null, num(r.value, 4)), h('td', null, r.unit));
  const th4 = () => h('thead', null, h('tr', null, ['Besaran', 'Simbol', 'Nilai', 'Satuan'].map((x) => h('th', null, x))));
  const el = h('div', { class: 'page report' },
    h('div', { class: 'no-print row-gap wrap' }, h('a', { class: 'btn btn-sm', href: '#/reports' }, 'Semua laporan'), h('button', { class: 'btn btn-sm btn-primary', type: 'button', onclick: () => window.print() }, icon('print', 16), h('span', null, 'Cetak laporan')), h('button', { class: 'btn btn-sm', type: 'button', onclick: () => exportCsv(rec).catch((e) => toast(e.message, 'bad')) }, icon('download', 16), h('span', null, 'CSV')), h('a', { class: 'btn btn-sm', href: '#/graph-analyzer?id=' + rec.id }, icon('graph', 16), h('span', null, 'Analisis grafik')), h('a', { class: 'btn btn-sm', href: `${simById(rec.simId).route}?load=${rec.id}` }, 'Buka eksperimen'), h('button', { class: 'btn btn-sm btn-danger', type: 'button', onclick: async () => { if (await confirmDelete(rec)) location.hash = '#/my-experiments'; } }, icon('trash', 16), h('span', null, 'Hapus'))),
    h('article', { class: 'card report-doc' },
      h('div', { class: 'rep-brand' }, h('b', null, 'SIMULAB'), h('span', null, 'Explore. Experiment. Understand.')),
      h('h1', null, 'Laporan Eksperimen'), h('table', { class: 'tbl meta' }, h('tbody', null, [['Nama eksperimen', rec.name], ['Simulasi', rec.simTitle], ['Tanggal', dateTime(rec.createdAt)], ['Status', rec.completed ? 'Simulasi dijalankan sampai selesai' : 'Simulasi belum dijalankan sampai selesai saat disimpan']].map(([a, b]) => h('tr', null, h('th', null, a), h('td', null, b))))),
      rec.poe ? h('section',{class:'report-poe'},h('h2',null,'Prediksi - Coba - Jelaskan'),h('h3',null,'Prediksi'),h('p',null,rec.poe.prediction||'Belum diisi.'),h('h3',null,'Penjelasan siswa'),h('p',null,rec.poe.explanation||'Belum diisi.'),h('p',{class:'muted small'},'Tahap saat disimpan: '+rec.poe.state+'. Jawaban siswa tidak dinilai otomatis.')) : null,
      h('h2', null, 'Parameter'), h('table', { class: 'tbl' }, th4(), h('tbody', null, pd.map((d) => h('tr', null, h('td', null, d.label), h('td', null, d.symbol || ''), h('td', null, d.type === 'select' ? (d.options.find((o) => o.value === rec.params[d.key]) || {}).label : num(rec.params[d.key], 3)), h('td', null, d.unit || ''))))),
      h('h2', null, 'Hasil perhitungan'), h('table', { class: 'tbl' }, th4(), h('tbody', null, (rec.results || []).map(res4))),
      h('h2',null,'Kesimpulan model'),h('p',null,rec.completed?def.conclude(rec.params,rec.results||[]):'Percobaan belum selesai. Kesimpulan model belum tersedia.'),
      h('h2', null, 'Tabel pengamatan'), obs.length ? h('div', { class: 'table-wrap' }, h('table', { class: 'tbl' }, h('thead', null, h('tr', null, cols.map((c) => h('th', null, c.label + (c.unit ? ` (${c.unit})` : ''))))), h('tbody', null, obs.map((o) => h('tr', null, cols.map((c) => h('td', null, num(o[c.key], c.dec)))))))) : h('p', { class: 'muted' }, 'Tidak ada data pengamatan (simulasi tidak dijalankan sebelum disimpan).'),
      chartEls.length ? [h('h2', null, 'Grafik'), h('div', { class: 'grid2' }, chartEls)] : null,
      h('p', { class: 'muted small' }, 'Dibuat oleh SIMULAB. Data dihitung dari model pendidikan ideal, bukan pengukuran dunia nyata. Asumsi tiap model ada pada halaman eksperimen. Waktu animasi berbeda dari waktu fisik untuk sapuan parameter.')));
  return { el, title: 'Laporan: ' + rec.name, destroy() { charts.forEach((c) => c.destroy()); } };
}
