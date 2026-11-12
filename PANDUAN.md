# SIMULAB 3.0.0 - paket lengkap Fase 1-3

Ini satu paket pengganti lengkap, bukan patch. `index.html` ada di akar ZIP. Jangan campur dengan berkas versi lama. Tidak ada proses build atau pemasangan npm untuk menjalankan aplikasi.

## Isi

15 simulasi interaktif: Gerak Lurus, Jatuh Bebas, Hukum Newton, Energi, Gelombang, Fungsi Kuadrat, Trigonometri, Laju Reaksi, Titrasi, Populasi, Enzim, serta empat tambahan: rangkaian Ohm seri/paralel, lensa cembung, Archimedes, dan pemuaian panjang. Ada 40 preset, sehingga Library berisi 55 entri.

Enam fitur pada tiga fase:
1. Prediksi - Coba - Jelaskan (POE) di semua simulasi. Start dan jelajah waktu terkunci sampai prediksi disimpan. Mengubah parameter/reset meminta konfirmasi prediksi lagi.
2. Aksesibilitas: skala huruf 100%-200%, kontras tinggi, keyboard, pengurangan gerak, Bacakan dengan suara lokal yang tersedia.
3. Kartu hasil Canvas PNG dengan identitas/kode siswa, grafik, prediksi, dan kesimpulan. Tombol Bagikan membuka pilihan aplikasi OS bila file sharing didukung. Kalau tidak, PNG diunduh. Tidak mengirim WhatsApp otomatis.
4. Bank 30 soal JSON (2 per simulasi), pembahasan, hasil lokal IndexedDB, impor JSON siswa, rekap CSV, lembar guru dan laporan eksperimen yang bisa dicetak/disimpan sebagai PDF lewat dialog browser.
5. Empat simulasi baru di atas, lengkap dengan materi, kontrol, POE, grafik, tabel dan latihan.
6. Tur Driver.js lokal, UI ringan tanpa blur, serta shortcut PWA ke Explore, Ohm dan Ruang Guru.

## Membuka atau memperbarui situs

- Ekstrak ZIP. Unggah semua isi ke GitHub Pages atau host statis HTTPS. `index.html` harus di akar lokasi situs; jalur aset mendukung subfolder repositori.
- Untuk lokal: jalankan `python -m http.server 8767` di folder ini, lalu buka `http://localhost:8767/`.
- Membuka `index.html` langsung dengan file:// tidak didukung karena modul dan Service Worker.
- Buka sekali sambil online sampai cache siap. Setelah itu aplikasi, bank soal dan tur dapat dibuka offline. Instal PWA bergantung browser/OS. Shortcut bukan jaminan ikon/menu akan tampil di semua OS.
- Untuk pembaruan di alamat sama, tunggu cache baru terpasang, tutup tab lama lalu buka lagi. Periksa Settings/About menampilkan 3.0.0. Cadangkan data sebelum menghapus data browser.

## Alur siswa

1. Pilih simulasi dan parameter. Isi prediksi lalu tekan Simpan prediksi & buka eksperimen.
2. Jalankan Start, amati, lalu selesaikan simulasi. Isi penjelasan berdasarkan hasil.
3. Kerjakan dua soal lalu Periksa latihan untuk melihat pembahasan.
4. Isi kode/nama singkat dan kelas. Simpan lembar hasil lokal untuk rekap; unduh JSON untuk dipindah ke perangkat guru.
5. Unduh/bagikan kartu PNG setelah percobaan selesai. Dialog aplikasi tetap perlu dipilih sendiri. Pembatalan dialog tidak mengirim apa pun.
6. Untuk laporan formal, Simpan Eksperimen, buka Reports, pilih catatan, Cetak laporan. Pilih Save as PDF pada browser. Ini fungsi cetak browser, bukan mesin ekspor PDF mandiri di aplikasi.

Gunakan kode siswa bila tidak ingin mencantumkan nama. Jangan membagikan hasil orang lain tanpa izin. Tidak ada unggahan data otomatis atau akun kelas.

## Ruang Guru

Buka menu Ruang Guru, atau tambahkan `?mode=guru` pada alamat situs. Ini tampilan lokal, BUKAN autentikasi atau perlindungan kunci jawaban.

Impor hasil JSON siswa secara manual: maksimum 50 berkas sekali impor, 500 KB per berkas dan 500 lembar tersimpan. Format/isi skor diperiksa, ID sama dideduplikasi. Data tetap bisa diedit pengirim; skor bukan nilai ujian terverifikasi. Filter siswa/kelas berlaku juga pada unduhan CSV dan backup JSON. Hapus meminta konfirmasi. Backup dahulu sebelum menghapus.

Pilih simulasi pada Persiapan pembelajaran untuk tujuan belajar, aktivitas, kunci, pembahasan dan rubrik refleksi. Cetak lembar guru tidak mencetak rekap kelas. Penjelasan POE dinilai guru, bukan AI/penilaian otomatis.

## Data dan cadangan

IndexedDB menyimpan data di browser/perangkat/alamat situs itu saja. Tidak tersinkron otomatis. Settings > Unduh cadangan memuat data aplikasi dan pengaturan; Ruang Guru > Cadangkan hasil JSON khusus lembar kelas. Ekspor JSON siswa adalah format pertukaran kelas. Jangan anggap backup Settings sebagai file impor kelas.

## Batas model dan perangkat

- Rangkaian: resistor ideal, DC, tanpa panas atau resistansi kabel.
- Lensa: lensa tipis/paraksial. Dekat fokus dibatasi untuk menghindari singularitas. Animasi jejak bukan waktu rambat cahaya; parameter tetap menghasilkan grafik datar selama jejak.
- Archimedes: pencelupan kuasi-statis dipaksakan penahan, bukan lintasan benda mengapung bebas. Liter diubah ke m³ sebelum perhitungan.
- Pemuaian: alpha konstan dan ramp suhu linear. Tidak memodelkan perpindahan panas. Pertambahan panjang visual diperbesar 40 kali dan diberi label.
- Bacakan bergantung suara lokal terpasang. Tidak ada suara lokal pada lingkungan pengujian, sehingga suara Indonesia/offline nyata belum teruji.
- Teks Canvas tidak membesar mengikuti skala huruf HTML. Tabel dan hasil angka tersedia sebagai alternatif; belum ada audit pembaca layar/WCAG.
- Tidak memakai CDN, font jaringan, framework besar atau blur. Kurangi gerak ada di Settings. Driver.js dibundel lokal beserta lisensi MIT.
- Diuji pada Chrome Linux, bukan HP fisik atau Windows 7/Supermium. FPS, baterai, PWA di perangkat asli dan kelancaran laptop lama belum diukur. Tidak ada klaim bebas lag atau bukti peningkatan hasil belajar.

Lihat HASIL-PENGUJIAN.md, STRUKTUR-FOLDER.md, dan SUMBER-MODEL.md.
