/* © 2026 Erfin. All rights reserved. See LICENSE. */
// Service worker SIMULAB: precache semua berkas, cache-first, jatuh ke index.html untuk navigasi offline.
// Daftar PRECACHE dibuat oleh tools/gen-sw.mjs. Naikkan VERSION setiap kali berkas berubah.
const VERSION = 'simulab-v3.0.0-flat-erfin-2';
/*PRECACHE_START*/
const PRECACHE = [
  "./",
  "./sw.js",
  "./.nojekyll",
  "./HASIL-PENGUJIAN.md",
  "./LICENSE",
  "./MULAI-DI-SINI.md",
  "./PANDUAN.md",
  "./STRUKTUR-FOLDER.md",
  "./SUMBER-MODEL.md",
  "./index.html",
  "./manifest.webmanifest",
  "./public-icons-icon-192.png",
  "./public-icons-icon-512.png",
  "./public-icons-icon-maskable-512.png",
  "./public-icons-icon.svg",
  "./src-accessibility-settings.js",
  "./src-accessibility-speech.js",
  "./src-charts-canvas.js",
  "./src-charts-chart.js",
  "./src-components-cards.js",
  "./src-components-icons.js",
  "./src-components-tour.js",
  "./src-data-formulas.js",
  "./src-data-hero.js",
  "./src-data-illustrations.js",
  "./src-data-presets.js",
  "./src-data-questions.json",
  "./src-data-registry.js",
  "./src-engines-engine.js",
  "./src-learning-assessment-store.js",
  "./src-learning-assessment.js",
  "./src-learning-poe-state.js",
  "./src-learning-poe-ui.js",
  "./src-learning-result-card.js",
  "./src-main.js",
  "./src-pages-about.js",
  "./src-pages-dashboard.js",
  "./src-pages-docs.js",
  "./src-pages-experiment.js",
  "./src-pages-explore.js",
  "./src-pages-formulas.js",
  "./src-pages-graph-analyzer.js",
  "./src-pages-labs.js",
  "./src-pages-library.js",
  "./src-pages-my-experiments.js",
  "./src-pages-progress.js",
  "./src-pages-reports.js",
  "./src-pages-settings.js",
  "./src-pages-teacher.js",
  "./src-prefs.js",
  "./src-simulations-biology-enzyme-index.js",
  "./src-simulations-biology-enzyme-model.js",
  "./src-simulations-biology-population-index.js",
  "./src-simulations-biology-population-model.js",
  "./src-simulations-chemistry-reaction-rate-index.js",
  "./src-simulations-chemistry-reaction-rate-model.js",
  "./src-simulations-chemistry-titration-index.js",
  "./src-simulations-chemistry-titration-model.js",
  "./src-simulations-mathematics-quadratic-index.js",
  "./src-simulations-mathematics-quadratic-model.js",
  "./src-simulations-mathematics-trigonometry-index.js",
  "./src-simulations-mathematics-trigonometry-model.js",
  "./src-simulations-physics-archimedes-index.js",
  "./src-simulations-physics-archimedes-model.js",
  "./src-simulations-physics-circuits-index.js",
  "./src-simulations-physics-circuits-model.js",
  "./src-simulations-physics-energy-index.js",
  "./src-simulations-physics-energy-model.js",
  "./src-simulations-physics-expansion-index.js",
  "./src-simulations-physics-expansion-model.js",
  "./src-simulations-physics-free-fall-index.js",
  "./src-simulations-physics-free-fall-model.js",
  "./src-simulations-physics-linear-motion-index.js",
  "./src-simulations-physics-linear-motion-model.js",
  "./src-simulations-physics-newton-law-index.js",
  "./src-simulations-physics-newton-law-model.js",
  "./src-simulations-physics-optics-index.js",
  "./src-simulations-physics-optics-model.js",
  "./src-simulations-physics-waves-index.js",
  "./src-simulations-physics-waves-model.js",
  "./src-simulations-scenes.js",
  "./src-storage-db.js",
  "./src-styles-base.css",
  "./src-styles-components.css",
  "./src-styles-layout.css",
  "./src-styles-phase1.css",
  "./src-styles-phase23.css",
  "./src-utils-csv.js",
  "./src-utils-dom.js",
  "./src-utils-format.js",
  "./src-utils-validate.js",
  "./src-version.js",
  "./vendor-driver-driver.css",
  "./vendor-driver-driver.js.iife.js",
  "./vendor-driver-license"
];
/*PRECACHE_END*/
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(PRECACHE)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k.startsWith('simulab-') && k !== VERSION).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  e.respondWith(caches.match(req, { ignoreSearch: true }).then((hit) => hit || fetch(req).then((res) => {
    if (res.ok) { const copy = res.clone(); caches.open(VERSION).then((c) => c.put(req, copy)); }
    return res;
  }).catch(() => (req.mode === 'navigate' ? caches.match('./index.html') : Response.error()))));
});
