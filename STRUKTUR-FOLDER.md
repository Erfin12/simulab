# Struktur SIMULAB 3

- index.html: pintu masuk, semua dependensi lokal.
- manifest.webmanifest / public/: PWA, ikon dan shortcut.
- sw.js: cache offline v3, dihasilkan tools/gen-sw.mjs.
- src/main.js: routing, navigasi, tur dan ?mode=guru.
- src/learning/: POE, aksesibilitas/suara, bank latihan, IndexedDB kelas, kartu PNG.
- src/data/: registry 15 simulasi, 40 preset, rumus dan questions.json.
- src/pages/: eksperimen, Ruang Guru, laporan, library, pengaturan dan halaman pendukung.
- src/simulations/: model sains, materi dan visual masing-masing simulasi.
- src/charts/: Canvas ringan, angka sumbu adaptif, tema cetak.
- src/storage/db.js: penyimpanan lokal, tanpa server kelas.
- src/styles/: gaya dasar, Fase 1, Fase 2/3 dan media cetak.
- vendor/driver/: Driver.js 1.11.0 lokal dan lisensi MIT.
- tests/: tes model, POE dan browser. phase3-regression.mjs dan phase23-features.mjs adalah suite terbaru; berkas tes v2/Fase1 historis dapat memiliki ekspektasi jumlah/menu lama.
- tools/gen-sw.mjs: regenerasi daftar cache setelah menambah/menghapus aset.

Tidak memerlukan node_modules untuk penggunaan. Node diperlukan hanya bila menjalankan pengujian/pengembangan.
