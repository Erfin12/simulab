/* © 2026 Erfin. All rights reserved. See LICENSE. */
import { h } from './src-utils-dom.js';
import { head } from './src-components-cards.js';
import { SIMS } from './src-data-registry.js';
import { VERSION } from './src-version.js';
export async function render() {
  return { title: 'About SIMULAB', el: h('div', { class: 'page narrow' }, head('About SIMULAB', 'Explore. Experiment. Understand.'),
    h('div', { class: 'card doc' }, h('p', null, 'SIMULAB adalah laboratorium sains digital interaktif: belajar dengan mengubah variabel, mengamati perubahan, dan menyimpulkan sendiri.'), h('h3', null, 'Yang tersedia (versi ' + VERSION + ')'), h('ul', null, [...SIMS.map((s) => s.title), 'Formula Library, Experiment Library, My Experiments, Learning Progress, Graph Analyzer, Reports (cetak dan CSV)'].map((x) => h('li', null, x))), h('h3', null, 'Empat laboratorium aktif'), h('p', null, '9 fisika, 2 matematika, 2 kimia, 2 biologi. Model pendidikan dengan asumsi dan batas yang dijelaskan pada tiap eksperimen.'), h('h3', null, 'Privasi'), h('p', null, 'Tanpa akun, tanpa pelacak, tanpa server. Semua data tinggal di perangkat Anda. Tidak ada ketergantungan pada AI atau layanan luar.'), h('h3', null, 'Hak Cipta'), h('p', null, '© 2026 Erfin. Seluruh hak dilindungi.'), h('p', null, 'Kode asli SIMULAB tidak boleh disalin, diubah, didistribusikan, atau dijual tanpa izin tertulis Erfin. Komponen pihak ketiga mengikuti lisensinya masing-masing; lihat LICENSE dan vendor/driver/license.'), h('h3', null, 'Teknologi'), h('p', null, 'HTML, CSS, dan JavaScript modular tanpa framework dan tanpa langkah build. Canvas untuk visualisasi dan grafik, IndexedDB untuk data lokal, Service Worker untuk offline.'))) };
}
