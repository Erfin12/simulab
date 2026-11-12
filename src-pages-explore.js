/* © 2026 Erfin. All rights reserved. See LICENSE. */
import { h } from './src-utils-dom.js';
import * as store from './src-storage-db.js';
import { SIMS, LABS } from './src-data-registry.js';
import { simCard, head } from './src-components-cards.js';
import { icon } from './src-components-icons.js';

export async function render() {
  const favs = await store.listFavorites();
  const sec = (l) => h('section', null, h('h3', { class: 'sec' }, h('span', { class: 'lab-ico sm ' + l.color }, icon(l.icon, 18)), ' ', l.name, l.available ? null : h('span', { class: 'chip soon-chip' }, 'Coming Soon')),
    l.available ? h('div', { class: 'grid3' }, SIMS.filter((s) => s.lab === l.id).map((s) => simCard(s, { fav: favs.includes('sim:' + s.id), onFav: () => store.toggleFavorite('sim:' + s.id) })))
      : h('div', { class: 'card soon-card' }, h('p', { class: 'muted' }, l.desc + ' Belum tersedia. Rencana topik:'), h('ul', null, l.planned.map((x) => h('li', null, x))), h('p', { class: 'muted small' }, 'Tidak ada simulasi palsu di sini: halaman ini baru dibuka kalau simulasinya benar-benar berfungsi.')));
  return { el: h('div', { class: 'page' }, head('Explore Simulations', 'Semua simulasi yang tersedia, dikelompokkan per laboratorium.', h('a', { class: 'btn', href: '#/library' }, icon('library', 18), h('span', null, 'Cari di Experiment Library'))), LABS.map(sec)), title: 'Explore Simulations' };
}
