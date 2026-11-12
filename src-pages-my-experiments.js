/* © 2026 Erfin. All rights reserved. See LICENSE. */
import { h, clear, toast, modal, download } from './src-utils-dom.js';
import { dateTime, dateStamp, num } from './src-utils-format.js';
import { buildCsv } from './src-utils-csv.js';
import * as store from './src-storage-db.js';
import { simById } from './src-data-registry.js';
import { head, empty } from './src-components-cards.js';
import { icon } from './src-components-icons.js';

export async function exportCsv(rec) {
  const meta = simById(rec.simId); const def = (await meta.load()).default;
  download(`simulab-${rec.simId}-${dateStamp(rec.createdAt)}.csv`, buildCsv(rec, def.model.params), 'text/csv');
  store.logActivity('csv', rec.simId, rec.name);
}
export async function confirmDelete(rec) {
  const ok = await modal({ title: 'Hapus eksperimen?', body: h('p', null, `"${rec.name}" akan dihapus dari perangkat ini. Tindakan ini tidak bisa dibatalkan.`), actions: [{ label: 'Batal', value: false }, { label: 'Hapus', primary: true, value: true }] });
  if (ok) { await store.deleteExperiment(rec.id, rec.name); toast('Eksperimen dihapus.'); }
  return !!ok;
}
export const paramSummary = async (rec) => { const def = (await simById(rec.simId).load()).default; return def.model.params.filter((d) => d.type !== 'select').map((d) => `${d.symbol} = ${num(rec.params[d.key], 3)} ${d.unit}`).join(', '); };

export async function render() {
  const box = h('div', { class: 'list' });
  async function draw() {
    const list = await store.listExperiments(); clear(box);
    if (!list.length) { box.append(empty('Belum ada eksperimen tersimpan', 'Jalankan simulasi, lalu tekan "Simpan Eksperimen" di halaman simulasi.', h('a', { class: 'btn btn-primary', href: '#/explore' }, 'Jelajahi simulasi'))); return; }
    for (const rec of list) {
      const sum = h('p', { class: 'muted small' }, '…'); paramSummary(rec).then((t) => { sum.textContent = t; }).catch(() => { sum.textContent = ''; });
      box.append(h('article', { class: 'card exp-item' }, h('div', null, h('h3', null, rec.name), h('p', { class: 'muted small' }, `${rec.simTitle} · ${dateTime(rec.createdAt)} · ${rec.observations ? rec.observations.length : 0} baris data`), sum),
        h('div', { class: 'row-gap wrap' }, h('a', { class: 'btn btn-sm btn-primary', href: `${simById(rec.simId).route}?load=${rec.id}` }, 'Buka'), h('a', { class: 'btn btn-sm', href: '#/reports/' + rec.id }, icon('report', 16), h('span', null, 'Laporan')), h('button', { class: 'btn btn-sm', type: 'button', onclick: () => exportCsv(rec).catch((e) => toast('Gagal ekspor: ' + e.message, 'bad')) }, icon('download', 16), h('span', null, 'CSV')), h('button', { class: 'btn btn-sm btn-danger', type: 'button', onclick: async () => { if (await confirmDelete(rec)) draw(); } }, icon('trash', 16), h('span', null, 'Hapus')))));
    }
  }
  await draw();
  return { el: h('div', { class: 'page' }, head('My Experiments', 'Eksperimen yang Anda simpan.'), h('div', { class: 'alert info' }, 'Data tersimpan di perangkat dan browser ini saja. Tidak otomatis tersinkron ke perangkat lain. Untuk memindahkan, gunakan Cadangan di Settings.'), box), title: 'My Experiments' };
}
