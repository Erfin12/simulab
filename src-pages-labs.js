/* © 2026 Erfin. All rights reserved. See LICENSE. */
import { h } from './src-utils-dom.js';
import * as store from './src-storage-db.js';
import { SIMS, LABS } from './src-data-registry.js';
import { simCard, head } from './src-components-cards.js';
import { icon } from './src-components-icons.js';

export async function render(ctx) {
  const lab = LABS.find((l) => l.id === ctx.segs[0]); if (!lab) return ctx.notFound();
  if (!lab.available) return { title: lab.name, el: h('div', { class: 'page' }, head(lab.name, lab.desc, h('span', { class: 'chip soon-chip' }, 'Coming Soon')), h('div', { class: 'card soon-card' }, h('h3', null, 'Belum tersedia'), h('p', null, 'Laboratorium ini masih dalam rencana dan belum memiliki simulasi yang berfungsi. Topik yang direncanakan:'), h('ul', null, lab.planned.map((x) => h('li', null, x))), h('a', { class: 'btn btn-primary', href: '#/lab/physics' }, icon('atom', 18), h('span', null, 'Buka Physics Lab')))) };
  const favs = await store.listFavorites();
  return { title: lab.name, el: h('div', { class: 'page' }, head(lab.name, lab.desc + ' Semua eksperimen di sini bisa dipakai offline setelah cache siap.'), h('div', { class: 'grid3' }, SIMS.filter((s) => s.lab === lab.id).map((s) => simCard(s, { fav: favs.includes('sim:' + s.id), onFav: () => store.toggleFavorite('sim:' + s.id) }))), h('p', { class: 'muted small' }, 'Setiap simulasi punya tujuan belajar, teori, rumus, kontrol variabel, grafik, kesimpulan, dan tantangan.')) };
}
