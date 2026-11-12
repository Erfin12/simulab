/* © 2026 Erfin. All rights reserved. See LICENSE. */
import { h, clear } from './src-utils-dom.js';
import { num } from './src-utils-format.js';
import { FORMULAS, FORMULA_CATS } from './src-data-formulas.js';
import { simById } from './src-data-registry.js';
import { head, empty } from './src-components-cards.js';
import { icon } from './src-components-icons.js';

export async function render(ctx) {
  let cat = FORMULA_CATS.includes(ctx.query.get('cat')) ? ctx.query.get('cat') : 'Semua', q = '';
  const list = h('div', { class: 'grid2' }); const tabs = h('div', { class: 'chips', role: 'tablist' });
  const search = h('input', { type: 'search', class: 'full', placeholder: 'Cari rumus…', 'aria-label': 'Cari rumus' });
  function card(f) {
    const sim = f.sim ? simById(f.sim) : null; const val = f.ex.f();
    return h('article', { class: 'card formula' }, h('div', { class: 'row-between' }, h('h3', null, f.name), h('span', { class: 'chip' }, f.cat)), h('div', { class: 'eq big', html: f.eq }),
      h('div', { class: 'table-wrap' }, h('table', { class: 'tbl' }, h('thead', null, h('tr', null, ['Simbol', 'Keterangan', 'Satuan'].map((x) => h('th', null, x)))), h('tbody', null, f.symbols.map((s) => h('tr', null, s.map((x) => h('td', null, x))))))),
      h('div', { class: 'example' }, h('b', null, 'Contoh. '), f.ex.q, h('div', null, '→ ', h('b', null, `${num(val, f.ex.dec + 1)} ${f.ex.unit}`))),
      sim ? h('a', { class: 'btn btn-sm', href: sim.route }, icon('play', 16), h('span', null, 'Buka simulasi: ' + sim.title)) : h('span', { class: 'chip soon-chip' }, 'Simulasi terkait: Coming Soon'));
  }
  function apply() { const w = q.toLowerCase(); const r = FORMULAS.filter((f) => (cat === 'Semua' || f.cat === cat) && (!w || (f.name + ' ' + f.eq.replace(/<[^>]+>/g, '') + ' ' + f.cat).toLowerCase().includes(w))); clear(list); if (!r.length) list.append(empty('Rumus tidak ditemukan', 'Coba kata kunci lain.')); else r.forEach((f) => list.append(card(f))); }
  function drawTabs() { clear(tabs); ['Semua', ...FORMULA_CATS].forEach((c) => tabs.append(h('button', { type: 'button', role: 'tab', 'aria-selected': String(c === cat), class: 'chip-btn' + (c === cat ? ' on' : ''), onclick: () => { cat = c; drawTabs(); apply(); } }, c))); }
  search.addEventListener('input', () => { q = search.value; apply(); }); drawTabs(); apply();
  return { el: h('div', { class: 'page' }, head('Formula Library', 'Rumus, simbol, satuan, dan contoh. Nilai contoh dihitung langsung oleh program, bukan diketik manual.'), h('div', { class: 'card filters' }, h('div', { class: 'search-wrap' }, icon('search', 18), search), tabs), list), title: 'Formula Library' };
}
