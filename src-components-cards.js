/* © 2026 Erfin. All rights reserved. See LICENSE. */
import { h } from './src-utils-dom.js';
import { icon } from './src-components-icons.js';
export function levelChip(l) { return h('span', { class: 'chip lvl-' + l.toLowerCase() }, l); }
export function simCard(sim, { fav, onFav, label = 'Open Experiment', href } = {}) {
  const star = onFav ? h('button', { class: 'btn-icon fav', type: 'button', 'aria-label': 'Favorit', 'aria-pressed': String(!!fav), onclick: async (e) => { e.preventDefault(); e.stopPropagation(); const on = await onFav(); e.currentTarget.setAttribute('aria-pressed', String(on)); } }, icon('star', 18)) : null;
  return h('article', { class: 'card sim-card' },
    h('div', { class: 'illus', html: sim.illus || '' }),
    h('div', { class: 'sim-body' }, h('div', { class: 'row-between' }, h('span', { class: 'cat' }, [sim.labName, ...(sim.topics || [])].filter(Boolean).join(' · ')), star), h('h3', null, sim.title), h('p', { class: 'muted' }, sim.short), h('div', { class: 'row-between' }, levelChip(sim.level), h('a', { class: 'btn btn-primary btn-sm', href: href || sim.route }, label))));
}
export function skeletonCards(n = 3) { return h('div', { class: 'grid3' }, Array.from({ length: n }, () => h('div', { class: 'card skel', 'aria-hidden': 'true' }))); }
export function empty(title, text, action) { return h('div', { class: 'card empty' }, h('h3', null, title), h('p', { class: 'muted' }, text), action || null); }
export function head(title, lead, extra) { return h('div', { class: 'page-h' }, h('div', null, h('h1', null, title), lead ? h('p', { class: 'lead' }, lead) : null), extra || null); }
