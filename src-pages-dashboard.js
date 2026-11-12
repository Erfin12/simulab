/* © 2026 Erfin. All rights reserved. See LICENSE. */
import { HERO } from './src-data-hero.js';
import { h, clear } from './src-utils-dom.js';
import { num, dur, dateTime } from './src-utils-format.js';
import * as store from './src-storage-db.js';
import { SIMS, LABS, simById } from './src-data-registry.js';
import { simCard } from './src-components-cards.js';
import { icon } from './src-components-icons.js';

export const ACT = { open: 'Membuka', run: 'Menyelesaikan percobaan', save: 'Menyimpan', challenge: 'Menyelesaikan tantangan', csv: 'Mengekspor CSV', delete: 'Menghapus' };
export function activityList(items) {
  if (!items.length) return h('p', { class: 'muted' }, 'Belum ada aktivitas. Buka salah satu simulasi untuk memulai.');
  return h('ul', { class: 'act' }, items.map((a) => h('li', null, h('span', { class: 'dot' }), h('div', null, h('b', null, `${ACT[a.type] || a.type}${a.label ? ': ' : ''}`), a.label), h('time', { class: 'muted small' }, dateTime(a.ts)))));
}
export async function render(ctx) {
  const statVals = {}; const mk = (k, label, sub) => { const v = h('div', { class: 'stat-v skel-txt' }, '…'); statVals[k] = v; return h('div', { class: 'card stat' }, h('div', { class: 'stat-l' }, label), v, h('div', { class: 'muted small', 'data-sub': k }, sub || '')); };
  const actBox = h('div', { class: 'card' }, h('h3', null, 'Recent Activity'), h('div', { class: 'skel', style: 'height:90px' }));
  const greet = h('h1', null, 'Sains dimulai dari rasa ingin tahu.'); const contBtn = h('a', { class: 'btn', href: '#/physics/linear-motion' }, 'Continue Experiment');
  const contHint = h('p', { class: 'muted small' });
  const featured = h('div', { class: 'grid3' });
  const el = h('div', { class: 'page' },
    h('section', { class: 'hero card' }, h('div', null, h('div', {class:'eyebrow'}, 'SIMULAB 3 / LEARNING STUDIO'), greet, h('p', { class: 'lead' }, 'Laboratorium sains digital interaktif. Ubah variabel, amati hasilnya, dan simpulkan sendiri, semuanya berjalan di perangkat Anda tanpa akun dan bisa offline.'), h('div', { class: 'row-gap' }, h('a', { class: 'btn btn-primary', href: '#/explore' }, icon('compass', 18), h('span', null, 'Jelajahi 15 simulasi')), contBtn), contHint), h('div', { class: 'hero-art', 'aria-hidden': 'true', html: HERO })),
    h('section', null, h('h3', { class: 'sec' }, 'Quick Access'), h('div', { class: 'grid4' }, LABS.map((l) => h('a', { class: 'card lab-card ' + (l.available ? '' : 'soon'), href: '#/lab/' + l.id }, h('span', { class: 'lab-ico ' + l.color }, icon(l.icon, 24)), h('b', null, l.name), h('span', { class: 'muted small' }, l.available ? l.desc : 'Coming Soon'))))),
    h('section', null, h('h3', { class: 'sec' }, 'Learning Statistics'), h('div', { class: 'grid4' }, mk('sim', 'Simulasi tersedia', '4 laboratorium aktif'), mk('saved', 'Eksperimen tersimpan', 'di perangkat ini'), mk('done', 'Eksperimen selesai', 'minimal 1 tantangan benar'), mk('time', 'Waktu belajar', 'halaman eksperimen terbuka'))),
    h('section', null, h('h3', { class: 'sec' }, 'Baru di studio'), featured), h('section', null, actBox));
  (async () => {
    const [prog, saved, acts, favs, name] = await Promise.all([store.allProgress(), store.listExperiments(), store.listActivity(6), store.listFavorites(), store.getSetting('name', '')]);
    if (name) greet.textContent = 'Halo, ' + name; // textContent: aman dari HTML
    const done = prog.filter((x) => x.challenges && x.challenges.length).length; const secs = prog.reduce((a, x) => a + (x.seconds || 0), 0);
    for (const [k, v] of [['sim', String(SIMS.length)], ['saved', String(saved.length)], ['done', `${done} / ${SIMS.length}`], ['time', dur(secs)]]) { statVals[k].textContent = v; statVals[k].classList.remove('skel-txt'); }
    const last = [...prog].filter((x) => x.opened).sort((a, b) => b.lastAt - a.lastAt)[0];
    if (last && simById(last.simId)) { contBtn.href = simById(last.simId).route; contHint.textContent = `Terakhir dibuka: ${simById(last.simId).title}`; } else contHint.textContent = 'Belum ada eksperimen yang dibuka; tombol ini membuka Gerak Lurus.';
    clear(featured); [SIMS[11], SIMS[12], SIMS[13], SIMS[14]].forEach((s) => featured.append(simCard(s, { fav: favs.includes('sim:' + s.id), onFav: () => store.toggleFavorite('sim:' + s.id) })));
    clear(actBox); actBox.append(h('h3', null, 'Recent Activity'), activityList(acts), acts.length ? h('a', { class: 'btn-link', href: '#/progress' }, 'Lihat riwayat lengkap') : null);
  })().catch((e) => { console.error(e); });
  return { el, title: 'Dashboard' };
}
