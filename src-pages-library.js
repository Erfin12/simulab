/* © 2026 Erfin. All rights reserved. See LICENSE. */
import { h, clear } from './src-utils-dom.js';
import * as store from './src-storage-db.js';
import { SIMS, simById, CATEGORIES, DIFFICULTY } from './src-data-registry.js';
import { PRESETS } from './src-data-presets.js';
import { simCard, head, empty } from './src-components-cards.js';
import { icon } from './src-components-icons.js';

export async function render(ctx) {
  let favs = await store.listFavorites();
  const items = [
    ...SIMS.map((s) => ({ key: 'sim:' + s.id, sim: s, title: s.title, short: s.short, level: s.level, topics: s.topics, route: s.route, label: 'Mulai', kind: 'Simulasi' })),
    ...PRESETS.map((pr) => { const s = simById(pr.sim); return { key: 'preset:' + pr.id, sim: s, title: pr.title, short: pr.desc, level: pr.level, topics: s.topics, route: `${s.route}?preset=${pr.id}`, label: 'Mulai', kind: 'Eksperimen siap pakai' }; }),
  ];
  let q = (ctx.query.get('q') || '').trim(), cat = 'Semua', lvl = 'Semua', onlyFav = false;
  const grid = h('div', { class: 'grid3' }); const count = h('p', { class: 'muted small', role: 'status' });
  const search = h('input', { type: 'search', class: 'full', placeholder: 'Cari eksperimen, topik, atau kata kunci…', value: q, 'aria-label': 'Cari eksperimen' });
  const chipRow = (label, opts, get, set) => { const row = h('div', { class: 'chips', role: 'group', 'aria-label': label }); const draw = () => { clear(row); opts.forEach((o) => row.append(h('button', { type: 'button', class: 'chip-btn' + (get() === o ? ' on' : ''), 'aria-pressed': String(get() === o), onclick: () => { set(o); draw(); apply(); } }, o))); }; draw(); return h('div', { class: 'filter' }, h('span', { class: 'muted small' }, label), row); };
  const favBtn = h('button', { type: 'button', class: 'chip-btn', 'aria-pressed': 'false', onclick: () => { onlyFav = !onlyFav; favBtn.classList.toggle('on', onlyFav); favBtn.setAttribute('aria-pressed', String(onlyFav)); apply(); } }, icon('star', 14), ' Favorit saja');
  function apply() {
    const words = q.toLowerCase().split(/\s+/).filter(Boolean);
    const list = items.filter((i) => (cat === 'Semua' || i.topics.includes(cat)) && (lvl === 'Semua' || i.level === lvl) && (!onlyFav || favs.includes(i.key)) && words.every((w) => (i.title + ' ' + i.short + ' ' + i.topics.join(' ') + ' ' + i.kind + ' ' + i.sim.title).toLowerCase().includes(w)));
    clear(grid); count.textContent = `${list.length} dari ${items.length} eksperimen`;
    if (!list.length) { grid.append(empty('Tidak ada hasil', 'Coba kata kunci lain atau hapus filter.', h('button', { class: 'btn', type: 'button', onclick: () => { q = ''; search.value = ''; cat = lvl = 'Semua'; onlyFav = false; render2(); } }, 'Atur ulang filter'))); return; }
    for (const i of list) grid.append(simCard({ ...i.sim, title: i.title, short: i.short, level: i.level, topics: i.topics, labName: i.kind }, { href: i.route, label: i.label, fav: favs.includes(i.key), onFav: async () => { const on = await store.toggleFavorite(i.key); favs = await store.listFavorites(); return on; } }));
  }
  const root = h('div', { class: 'page' });
  function render2() { clear(root); root.append(head('Experiment Library', 'Cari simulasi dan eksperimen siap pakai. Eksperimen siap pakai membuka simulasi dengan variabel yang sudah diatur.'), h('div', { class: 'card filters' }, h('div', { class: 'search-wrap' }, icon('search', 18), search), chipRow('Kategori', ['Semua', ...CATEGORIES], () => cat, (v) => (cat = v)), chipRow('Tingkat', ['Semua', ...DIFFICULTY], () => lvl, (v) => (lvl = v)), h('div', { class: 'filter' }, favBtn)), count, grid); apply(); }
  search.addEventListener('input', () => { q = search.value; apply(); });
  render2();
  return { el: root, title: 'Experiment Library' };
}
