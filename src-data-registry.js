/* © 2026 Erfin. All rights reserved. See LICENSE. */
// Metadata ringan semua simulasi (modul simulasi sendiri dimuat saat dibuka / lazy-load).
import { ILLUS } from './src-data-illustrations.js';
export const SIMS = [
  { id: 'linear-motion', lab: 'physics', title: 'Gerak Lurus', short: 'GLB dan GLBB: atur posisi awal, kecepatan, percepatan, lihat grafik x–t dan v–t.', level: 'Mudah', topics: ['Gerak'], load: () => import('./src-simulations-physics-linear-motion-index.js') },
  { id: 'free-fall', lab: 'physics', title: 'Gerak Jatuh Bebas', short: 'Jatuhkan benda dari ketinggian, ubah gravitasi, dan buktikan massa tidak memengaruhi waktu jatuh.', level: 'Mudah', topics: ['Gerak', 'Gaya'], load: () => import('./src-simulations-physics-free-fall-index.js') },
  { id: 'newton-law', lab: 'physics', title: 'Hukum Newton', short: 'Dorong benda, ubah massa dan gesekan; lihat panah gaya, percepatan, dan pasangan aksi–reaksi.', level: 'Menengah', topics: ['Gaya'], load: () => import('./src-simulations-physics-newton-law-index.js') },
  { id: 'energy', lab: 'physics', title: 'Energi Kinetik dan Potensial', short: 'Lempar benda ke atas dan amati perubahan Ek, Ep, serta energi mekanik yang tetap.', level: 'Menengah', topics: ['Energi'], load: () => import('./src-simulations-physics-energy-index.js') },
  { id: 'waves', lab: 'physics', title: 'Getaran dan Gelombang', short: 'Gelombang berjalan dengan amplitudo, frekuensi, panjang gelombang, dan kecepatan yang saling terkait.', level: 'Lanjut', topics: ['Gelombang'], load: () => import('./src-simulations-physics-waves-index.js') },
  {"id": "quadratic", "lab": "mathematics", "title": "Studio Fungsi Kuadrat", "short": "Telusuri parabola, gradien, titik puncak, dan pengaruh koefisien.", "level": "Mudah", "topics": ["Fungsi"], load: () => import('./src-simulations-mathematics-quadratic-index.js') },
  {"id": "trigonometry", "lab": "mathematics", "title": "Lingkaran Trigonometri", "short": "Putar vektor dan hubungkan proyeksi dengan sinus dan kosinus.", "level": "Mudah", "topics": ["Trigonometri"], load: () => import('./src-simulations-mathematics-trigonometry-index.js') },
  {"id": "reaction-rate", "lab": "chemistry", "title": "Reaksi Orde Satu", "short": "Uji konsentrasi, konstanta laju, dan waktu paruh A → B.", "level": "Menengah", "topics": ["Reaksi"], load: () => import('./src-simulations-chemistry-reaction-rate-index.js') },
  {"id": "titration", "lab": "chemistry", "title": "Titrasi Asam-Basa Kuat", "short": "Tambahkan basa dan temukan pH serta volume ekuivalen.", "level": "Menengah", "topics": ["Larutan"], load: () => import('./src-simulations-chemistry-titration-index.js') },
  {"id": "population", "lab": "biology", "title": "Pertumbuhan Populasi", "short": "Jelajahi pertumbuhan logistik dan batas daya dukung lingkungan.", "level": "Menengah", "topics": ["Ekologi"], load: () => import('./src-simulations-biology-population-index.js') },
  {"id": "enzyme", "lab": "biology", "title": "Kinetika Enzim", "short": "Lihat kejenuhan enzim dalam model Michaelis-Menten.", "level": "Lanjut", "topics": ["Enzim"], load: () => import('./src-simulations-biology-enzyme-index.js') } ,
{"id": "circuits", "lab": "physics", "title": "Studio Rangkaian DC", "short": "Seri, paralel, arus, daya, dan energi listrik.", "level": "Menengah", "topics": ["Listrik"], load: () => import('./src-simulations-physics-circuits-index.js') },
{"id": "optics", "lab": "physics", "title": "Bangku Optik Lensa", "short": "Sinar utama dan bayangan nyata atau maya.", "level": "Menengah", "topics": ["Optika"], load: () => import('./src-simulations-physics-optics-index.js') },
{"id": "archimedes", "lab": "physics", "title": "Tangki Archimedes", "short": "Volume tercelup dan gaya apung dalam fluida.", "level": "Menengah", "topics": ["Fluida"], load: () => import('./src-simulations-physics-archimedes-index.js') },
{"id": "expansion", "lab": "physics", "title": "Studio Pemuaian", "short": "Suhu dan perubahan panjang batang ideal.", "level": "Menengah", "topics": ["Kalor"], load: () => import('./src-simulations-physics-expansion-index.js') }
];
for (const s of SIMS) { s.route = `#/${s.lab}/${s.id}`; s.illus = ILLUS[s.id] || newIllus(s.id); s.labName = {physics:'Physics Lab',mathematics:'Mathematics Lab',chemistry:'Chemistry Lab',biology:'Biology Lab'}[s.lab]; }
export const simById = (id) => SIMS.find((s) => s.id === id);

export const LABS = [
  { id: 'physics', name: 'Physics Lab', icon: 'atom', desc: 'Sembilan simulasi: gerak, gaya, energi, gelombang, listrik, optika, Archimedes, dan pemuaian.', available: true, color: 'primary' },
  { id: 'mathematics', name: 'Mathematics Lab', icon: 'math', desc: 'Fungsi kuadrat, gradien, dan lingkaran trigonometri.', available: true, color: 'secondary', planned: ['Grafik fungsi linear dan kuadrat', 'Transformasi geometri', 'Peluang dan simulasi dadu'] },
  { id: 'chemistry', name: 'Chemistry Lab', icon: 'chem', desc: 'Reaksi orde satu dan titrasi asam-basa kuat.', available: true, color: 'warn', planned: ['Titrasi asam–basa', 'Konfigurasi elektron', 'Laju reaksi'] },
  { id: 'biology', name: 'Biology Lab', icon: 'bio', desc: 'Pertumbuhan populasi dan kinetika enzim.', available: true, color: 'ok', planned: ['Pembelahan sel', 'Persilangan Mendel', 'Rantai makanan'] },
];
export const DIFFICULTY = ['Mudah', 'Menengah', 'Lanjut'];
export const CATEGORIES = ['Gerak', 'Gaya', 'Energi', 'Gelombang', 'Fungsi', 'Trigonometri', 'Reaksi', 'Larutan', 'Ekologi', 'Enzim', 'Listrik', 'Optika', 'Fluida', 'Kalor'];

function newIllus(id){const paths={circuits:'M50 55H270V135H50ZM115 55v-15h30v30h-30v-15M200 55v-15h30v30h-30v-15M135 120v30m12-23v16',optics:'M40 120h240M160 30v120M55 120V65l105 0 110 80M55 65l215 75M115 116v8m90-8v8',archimedes:'M65 45v95h190V45M70 85h180M160 30v40m-25 0h50v50h-50Z',expansion:'M40 85h210v25H40ZM250 80h25v35h-25M40 135h235M40 130v10m235-10v10M145 55v-25m-8 8 8-8 8 8'};return `<svg viewBox="0 0 320 180" xmlns="http://www.w3.org/2000/svg"><rect width="320" height="180" rx="18" fill="#101b2c"/><path d="${paths[id]||paths.circuits}" fill="none" stroke="#52e1cb" stroke-width="3" stroke-linejoin="round"/><circle cx="265" cy="35" r="4" fill="#f5bf68"/></svg>`}
