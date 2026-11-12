/* © 2026 Erfin. All rights reserved. See LICENSE. */
import {firstTour,startTour} from './src-components-tour.js';
import {initAccessibility,installRangeKeys} from './src-accessibility-settings.js';
import { h, clear, toast } from './src-utils-dom.js';
import { icon } from './src-components-icons.js';
import * as store from './src-storage-db.js';
import { applyTheme, getTheme, setTheme, applyMotion, getMotion, installPrompt } from './src-prefs.js';

const NAV = [
  ['OVERVIEW', [['dashboard', 'Dashboard', 'home'], ['explore', 'Explore Simulations', 'compass'], ['my-experiments', 'My Experiments', 'flask'], ['progress', 'Learning Progress', 'progress']]],
  ['SCIENCE LAB', [['lab/physics', 'Physics Lab', 'atom'], ['lab/mathematics', 'Mathematics Lab', 'math'], ['lab/chemistry', 'Chemistry Lab', 'chem'], ['lab/biology', 'Biology Lab', 'bio']]],
  ['TOOLS', [['formulas', 'Formula Library', 'formula'], ['library', 'Experiment Library', 'library'], ['graph-analyzer', 'Graph Analyzer', 'graph'], ['reports', 'Reports', 'report'], ['teacher','Ruang Guru','docs']]],
  ['GENERAL', [['docs', 'Documentation', 'docs'], ['settings', 'Settings', 'settings'], ['about', 'About SIMULAB', 'info']]],
];
const ROUTES = {
  teacher: () => import('./src-pages-teacher.js'), dashboard: () => import('./src-pages-dashboard.js'), explore: () => import('./src-pages-explore.js'), 'my-experiments': () => import('./src-pages-my-experiments.js'), progress: () => import('./src-pages-progress.js'),
  lab: () => import('./src-pages-labs.js'), physics: () => import('./src-pages-experiment.js'), mathematics: () => import('./src-pages-experiment.js'), chemistry: () => import('./src-pages-experiment.js'), biology: () => import('./src-pages-experiment.js'), formulas: () => import('./src-pages-formulas.js'), library: () => import('./src-pages-library.js'),
  'graph-analyzer': () => import('./src-pages-graph-analyzer.js'), reports: () => import('./src-pages-reports.js'), docs: () => import('./src-pages-docs.js'), settings: () => import('./src-pages-settings.js'), about: () => import('./src-pages-about.js'),
};
const app = { current: null, token: 0 };
const mainEl = h('main', { id: 'main', tabindex: '-1' });
const titleEl = h('div', { class: 'tb-title' });
const sidebar = h('aside', { class: 'sidebar', id: 'sidebar', 'aria-label': 'Navigasi utama' });
const scrim = h('div', { class: 'scrim', onclick: () => toggleDrawer(false) });
const links = new Map();
function toggleDrawer(open) { document.body.classList.toggle('drawer-open', open); menuBtn.setAttribute('aria-expanded', String(open)); syncSidebar(); if(open)sidebar.querySelector('a')?.focus(); }
// Jangan biarkan Tab menjangkau navigasi yang tersembunyi di layar kecil.
function syncSidebar(){const hidden=matchMedia('(max-width:1023px)').matches&&!document.body.classList.contains('drawer-open');sidebar.style.visibility=hidden?'hidden':'visible';sidebar.setAttribute('aria-hidden',String(hidden));}
window.addEventListener('resize',syncSidebar);

const menuBtn = h('button', { class: 'btn-icon menu-btn', type: 'button', 'aria-label': 'Buka menu', 'aria-expanded': 'false', 'aria-controls': 'sidebar', onclick: () => toggleDrawer(!document.body.classList.contains('drawer-open')) }, icon('menu', 22));
const themeBtn = h('button', { class: 'btn-icon', type: 'button', 'aria-label': 'Ganti tema', onclick: () => { setTheme(getTheme() === 'dark' ? 'light' : 'dark'); syncThemeBtn(); } });
function syncThemeBtn() { clear(themeBtn); themeBtn.append(icon(getTheme() === 'dark' ? 'sun' : 'moon', 20)); themeBtn.title = getTheme() === 'dark' ? 'Mode terang' : 'Mode gelap'; }
const search = h('input', { type: 'search', placeholder: 'Cari eksperimen…', 'aria-label': 'Cari eksperimen', class: 'tb-search', onkeydown: (e) => { if (e.key === 'Enter' && e.target.value.trim()) { location.hash = '#/library?q=' + encodeURIComponent(e.target.value.trim()); e.target.value = ''; } } });

function build() {
  sidebar.append(h('a', { class: 'brand', href: '#/dashboard' }, h('span', { class: 'logo', html: '<svg viewBox="0 0 32 32" width="30" height="30" aria-hidden="true"><rect width="32" height="32" rx="8" fill="var(--primary)"/><path d="M12 6h8M13 6v7l-5 9a2 2 0 0 0 1.8 3h12.4a2 2 0 0 0 1.8-3l-5-9V6" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="14" cy="21" r="1.6" fill="#fff"/><circle cx="19" cy="19" r="1.2" fill="#fff"/></svg>' }), h('span', null, h('b', null, 'SIMULAB'), h('small', null, 'Explore. Experiment. Understand.'))));
  const nav = h('nav', null);
  for (const [grp, items] of NAV) {
    nav.append(h('div', { class: 'nav-grp' }, grp));
    for (const [path, label, ic, soon] of items) { const a = h('a', { href: '#/' + path, class: 'nav-link' }, icon(ic, 18), h('span', null, label), soon ? h('em', { class: 'soon' }, 'Soon') : null); links.set(path, a); nav.append(a); }
  }
  sidebar.append(nav);
  const bottom = h('nav', { class: 'bottom-nav', 'aria-label': 'Navigasi cepat' }, [['dashboard', 'Home', 'home'], ['explore', 'Explore', 'compass'], ['lab/physics', 'Physics', 'atom'], ['my-experiments', 'Saved', 'flask']].map(([p, l, i]) => { const a = h('a', { href: '#/' + p, 'data-p': p }, icon(i, 22), h('span', null, l)); return a; }), h('button', { type: 'button', onclick: () => toggleDrawer(true), 'aria-label': 'Menu lengkap' }, icon('more', 22), h('span', null, 'Menu')));
  const top = h('header', { class: 'topbar' }, menuBtn, titleEl, h('div', { class: 'tb-right' }, search, h('button',{class:'btn-icon',type:'button','aria-label':'Tur pengenalan',onclick:startTour},'?'), h('a',{class:'btn-icon',href:'#/settings','aria-label':'Pengaturan aksesibilitas'},'Aa'), themeBtn));
  document.getElementById('app').append(h('a', { class: 'skip', href: '#main', onclick: (e) => { e.preventDefault(); mainEl.focus(); } }, 'Lewati ke konten'), sidebar, scrim, h('div', { class: 'shell' }, top, mainEl, h('footer', { class: 'app-copyright' }, '© 2026 Erfin. Seluruh hak dilindungi.')), bottom);
  syncSidebar(); syncThemeBtn();
  window.addEventListener('themechange', syncThemeBtn);
}
function parse() {
  if(new URLSearchParams(location.search).get('mode')==='guru'&&!location.hash)location.hash='#/teacher';
  const raw = location.hash.replace(/^#\/?/, ''); const [pathPart, q] = raw.split('?'); const segs = pathPart.split('/').filter(Boolean).map(decodeURIComponent);
  return { segs, query: new URLSearchParams(q || '') };
}
function notFound() { return { title: 'Halaman tidak ditemukan', el: h('div', { class: 'page narrow' }, h('div', { class: 'card empty' }, h('h2', null, 'Halaman tidak ditemukan'), h('p', { class: 'muted' }, 'Tautan ini tidak mengarah ke halaman SIMULAB yang ada.'), h('a', { class: 'btn btn-primary', href: '#/dashboard' }, 'Kembali ke Dashboard'))) }; }
async function route() {
  const token = ++app.token; const { segs, query } = parse();
  if (!segs.length) { location.replace('#/dashboard'); return; }
  const key = segs[0]; const loader = ROUTES[key];
  if (app.current && app.current.destroy) { try { app.current.destroy(); } catch (e) { console.error(e); } }
  app.current = null; toggleDrawer(false);
  const navKey = key === 'lab' ? `lab/${segs[1]}` : ['physics','mathematics','chemistry','biology'].includes(key) ? 'lab/'+key : key;
  links.forEach((a, k) => { const on = k === navKey; a.classList.toggle('active', on); if (on) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current'); });
  document.querySelectorAll('.bottom-nav a').forEach((a) => a.classList.toggle('active', a.dataset.p === navKey));
  let res;
  try {
    if (!loader) res = notFound();
    else {
      clear(mainEl); mainEl.append(h('div', { class: 'page' }, h('div', { class: 'card skel', style: 'height:120px' }), h('div', { class: 'grid3' }, [1, 2, 3].map(() => h('div', { class: 'card skel' })))));
      const mod = await loader(); const rest = key === 'lab' || key === 'physics' || key === 'reports' ? segs.slice(1) : segs.slice(1);
      res = await mod.render({ segs: rest, query, notFound }) || notFound();
    }
  } catch (e) {
    console.error(e);
    res = { title: 'Terjadi kesalahan', el: h('div', { class: 'page narrow' }, h('div', { class: 'card empty' }, h('h2', null, 'Halaman gagal dimuat'), h('p', { class: 'muted' }, 'Terjadi kesalahan saat membuka halaman ini. Jika Anda offline dan baru pertama kali membukanya, sambungkan internet sekali agar semua berkas tersimpan.'), h('button', { class: 'btn btn-primary', type: 'button', onclick: () => route() }, 'Coba lagi'))) };
  }
  if (token !== app.token) { if (res.destroy) res.destroy(); return; } // pindah halaman saat memuat
  app.current = res; clear(mainEl); res.el.classList.add('page-in'); mainEl.append(res.el);
  titleEl.textContent = res.title || ''; document.title = (res.title ? res.title + ' · ' : '') + 'SIMULAB';
  window.scrollTo(0, 0); mainEl.focus({ preventScroll: true });
}
window.addEventListener('hashchange', route);
window.addEventListener('error', (e) => { console.error(e.error || e.message); toast('Terjadi kesalahan tak terduga. Coba muat ulang halaman.', 'bad'); });
window.addEventListener('unhandledrejection', (e) => { console.error(e.reason); toast('Terjadi kesalahan tak terduga.', 'bad'); });
window.addEventListener('beforeinstallprompt', (e) => { e.preventDefault(); installPrompt.event = e; });
window.addEventListener('keydown', (e) => { if (e.key === 'Escape') toggleDrawer(false); });

(async function start() {
  applyMotion(getMotion()); applyTheme(getTheme(), false);
  build();
  try { await store.init(); } catch (e) { console.error(e); }
  if (!store.persistent) toast('Penyimpanan lokal tidak tersedia: data tidak akan bertahan.', 'warn');
  await initAccessibility(); installRangeKeys(); await route();
  document.body.classList.add('ready'); firstTour();
  if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1')) navigator.serviceWorker.register('./sw.js').catch((e) => console.warn('SW gagal', e));
})();
window.__simulab = app;
