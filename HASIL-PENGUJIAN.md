# Pengujian SIMULAB 3.0.0

Tanggal: 12 November 2026. Lingkungan: Chrome headless Linux dengan server HTTP localhost; Node untuk tes model. Ini pengujian implementasi, bukan penelitian efektivitas belajar.

## Hasil

| Suite | Hasil | Cakupan |
|---|---:|---|
| models.test.mjs | 19/19 | model fisika lama, nilai rujukan dan kasus batas |
| science.test.mjs | 25/25 | model lintas 15 simulasi, termasuk 250 set parameter acak per model |
| phase1-state.test.mjs | 6/6 | transisi POE, penguncian dan reset |
| phase3-models.test.mjs | 12/12 | Ohm seri/paralel, satuan Archimedes, lensa nyata/maya/fokus, pemuaian/pendinginan |
| phase3-e2e.mjs | 26/26 | POE 15 simulasi, keyboard, aksesibilitas, penyimpanan, laporan, offline |
| phase23-features.mjs | 18/18 | tur lokal, latihan, impor/deduplikasi/penolakan JSON, filter/hapus, CSV, PNG, Web Share, layout, PWA/offline |
| phase3-regression.mjs | 130/130 | seluruh menu, 15 simulasi, Start/Pause/Reset, hasil, input, tema, simpan/muat/CSV, tantangan, filter Library, layout 360/768/1280/1600 |
| phase3-print.mjs | 1/1 | simpan eksperimen, CSV dengan angka acuan, laporan dan kesimpulan model, berkas PDF aktual |

Regresi 130/130 lulus sebelum penyempurnaan khusus cetak dan teks Documentation. Setelah perubahan tersebut, tes cetak khusus dan POE dijalankan ulang. Tes fitur baru dijalankan ulang setelah perbaikan impor/filter dan tema Canvas cetak. Bukan klaim seluruh kombinasi browser/perangkat telah diuji.

## Pemeriksaan tampilan

Diperiksa gambar aktual: dashboard HP 360px, latihan HP, empat adegan dan grafik baru, Ruang Guru, kartu PNG 1080x1550, lembar guru PDF dan laporan siswa PDF. PDF final juga dirender terpisah menjadi gambar halaman untuk memeriksa tabel, grafik dan pemenggalan halaman.

Diperbaiki saat pemeriksaan: array DOM yang menjadi teks objek di lembar guru; satu lubang array preset yang merusak Library; pembulatan sumbu panjang pemuaian; latar dan teks grafik cetak. Pemeriksaan akhir tidak menemukan JavaScript exception pada suite browser terkait.

## Apa yang benar-benar terjadi pada ekspor

- PNG dihasilkan Canvas/toBlob dan berkas PNG diperiksa visual.
- CSV guru benar-benar diunduh; impor memakai file input asli, duplikat tidak ditambahkan.
- PDF siswa/guru benar-benar dibuat lewat Chrome printToPDF untuk memeriksa jalur cetak browser. Aplikasi tetap memakai dialog Print/Save as PDF, tidak menyediakan generator PDF mandiri.
- Web Share diuji dengan navigator.share/canShare yang dimock: sukses, pembatalan dan fallback download. Tidak ada pengiriman WhatsApp nyata atau jaminan aplikasi tujuan terpasang/berkas terkirim.
- Offline diuji dengan Service Worker dan mode offline Chrome setelah cache selesai.
- Shortcut manifest diperiksa ke rute yang ada, bukan instalasi PWA nyata di HP.

## Batas

Belum diuji pada HP fisik, Windows 7/Supermium, browser Safari/Firefox, baterai atau FPS perangkat asli. Tidak ada klaim bebas lag. Tidak ada suara lokal pada lingkungan uji, jadi pengucapan Indonesia dan audio offline asli belum terverifikasi. Belum ada audit screen reader/WCAG. ?mode=guru bukan autentikasi. Hasil impor dan kunci jawaban tidak aman sebagai sistem ujian. Semua model ideal; batas khusus ada pada panduan dan materi simulasi.

## Menjalankan ulang

Gunakan Node 22+ dan Google Chrome terpasang. Sajikan folder dengan `python -m http.server 8767`. Dalam terminal lain:

    node --experimental-default-type=module tests/models.test.mjs
    node --experimental-default-type=module tests/science.test.mjs
    node --experimental-default-type=module tests/phase1-state.test.mjs
    node --experimental-default-type=module tests/phase3-models.test.mjs
    node --experimental-default-type=module tests/phase3-e2e.mjs http://localhost:8767/
    node --experimental-default-type=module tests/phase23-features.mjs http://localhost:8767/
    node --experimental-default-type=module tests/phase3-regression.mjs http://localhost:8767/
    node --experimental-default-type=module tests/phase3-print.mjs http://localhost:8767/

Tes browser ekspor memakai direktori /downloads/phase3-generated pada lingkungan pengembangan. Buat/ubah direktori output itu bila memakai sistem lain. Tes v2/Fase1 historis masih disertakan sebagai referensi dan sebagian ekspektasi jumlah/menu lama tidak berlaku untuk v3.
