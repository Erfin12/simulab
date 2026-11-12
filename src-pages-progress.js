/* © 2026 Erfin. All rights reserved. See LICENSE. */
import { h } from './src-utils-dom.js';
import { dur, dateTime } from './src-utils-format.js';
import * as store from './src-storage-db.js';
import { SIMS } from './src-data-registry.js';
import { head } from './src-components-cards.js';
import { icon } from './src-components-icons.js';
import { activityList } from './src-pages-dashboard.js';

export async function render() {
  const [prog, saved, acts, allActs] = await Promise.all([store.allProgress(), store.listExperiments(), store.listActivity(40), store.listActivity(300)]);
  const P = Object.fromEntries(prog.map((x) => [x.simId, x]));
  const totals = await Promise.all(SIMS.map(async (s) => (await s.load()).default.challenges.length));
  const csvCount = allActs.filter((a) => a.type === 'csv').length;
  const sims = SIMS.map((s, i) => { const x = P[s.id] || { opened: 0, runs: 0, challenges: [], seconds: 0 }; const steps = [['Dibuka', x.opened > 0], ['Dijalankan sampai selesai', x.runs > 0], [`Tantangan ${x.challenges.length}/${totals[i]}`, x.challenges.length > 0], ['Hasil disimpan', saved.some((r) => r.simId === s.id)]]; return { s, x, steps, pct: steps.filter((z) => z[1]).length * 25 }; });
  const doneAll = sims.filter((z) => z.x.challenges.length).length;
  const ach = [
    ['Percobaan pertama', 'Menjalankan satu simulasi sampai selesai.', prog.some((x) => x.runs > 0)],
    ['Pemecah tantangan', 'Menyelesaikan satu tantangan.', prog.some((x) => x.challenges.length)],
    ['Penyimpan data', 'Menyimpan satu eksperimen.', saved.length > 0],
    ['Penjelajah fisika', 'Membuka kelima simulasi Physics Lab.', SIMS.filter(s=>s.lab==='physics').every((s) => (P[s.id] || {}).opened > 0)],
    ['Analis data', 'Mengekspor satu file CSV.', csvCount > 0],
  ];
  const el = h('div', { class: 'page' }, head('Learning Progress', 'Dihitung dari aktivitas nyata Anda di perangkat ini. Tidak ada nilai atau skor.'),
    h('div', { class: 'grid4' }, [['Eksperimen selesai', `${doneAll} / ${SIMS.length}`], ['Dijalankan', `${prog.filter((x) => x.runs > 0).length} / ${SIMS.length}`], ['Eksperimen tersimpan', String(saved.length)], ['Waktu belajar', dur(prog.reduce((a, x) => a + (x.seconds || 0), 0))]].map(([l, v]) => h('div', { class: 'card stat' }, h('div', { class: 'stat-l' }, l), h('div', { class: 'stat-v' }, v)))),
    h('p', { class: 'muted small' }, '"Selesai" berarti minimal satu tantangan di simulasi itu dijawab benar.'),
    h('h3', { class: 'sec' }, 'Materi yang dipelajari'), h('div', { class: 'grid2' }, sims.map(({ s, x, steps, pct }) => h('div', { class: 'card' }, h('div', { class: 'row-between' }, h('h4', null, s.title), h('a', { class: 'btn-link', href: s.route }, 'Buka')), h('div', { class: 'bar', role: 'progressbar', 'aria-valuenow': pct, 'aria-valuemin': 0, 'aria-valuemax': 100 }, h('i', { style: `width:${pct}%` })), h('ul', { class: 'steps' }, steps.map(([l, ok]) => h('li', { class: ok ? 'ok' : '' }, icon(ok ? 'check' : 'lock', 14), ' ', l))), h('p', { class: 'muted small' }, `Dijalankan ${x.runs}× · ${dur(x.seconds || 0)} · ${x.lastAt ? 'terakhir ' + dateTime(x.lastAt) : 'belum dibuka'}`)))),
    h('h3', { class: 'sec' }, 'Pencapaian'), h('div', { class: 'grid3' }, ach.map(([t, d, ok]) => h('div', { class: 'card ach ' + (ok ? 'on' : '') }, icon(ok ? 'trophy' : 'lock', 22), h('div', null, h('b', null, t), h('p', { class: 'muted small' }, d))))),
    h('h3', { class: 'sec' }, 'Riwayat eksperimen'), saved.length ? h('div', { class: 'card' }, h('ul', { class: 'act' }, saved.slice(0, 15).map((r) => h('li', null, h('span', { class: 'dot' }), h('div', null, h('a', { href: `#/reports/${r.id}` }, r.name), h('div', { class: 'muted small' }, r.simTitle)), h('time', { class: 'muted small' }, dateTime(r.createdAt)))))) : h('p', { class: 'muted' }, 'Belum ada eksperimen tersimpan.'),
    h('h3', { class: 'sec' }, 'Aktivitas belajar'), h('div', { class: 'card' }, activityList(acts)));
  return { el, title: 'Learning Progress' };
}
