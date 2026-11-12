/* © 2026 Erfin. All rights reserved. See LICENSE. */
import * as store from './src-storage-db.js';
import {toast} from './src-utils-dom.js';
let active=null;
export async function startTour(){
 if(!window.driver?.js?.driver){toast('Tur tidak tersedia. Panduan tetap ada pada Documentation.','warn');return}
 active?.destroy();active=window.driver.js.driver({animate:false,showProgress:true,allowClose:true,overlayOpacity:.65,nextBtnText:'Lanjut',prevBtnText:'Kembali',doneBtnText:'Selesai',progressText:'{{current}} / {{total}}',steps:[
 {element:'.topbar',popover:{title:'SIMULAB 3',description:'15 simulasi, tanpa akun. Kontrol tampilan Aa menyediakan huruf besar dan kontras tinggi.'}},
 {element:'#main',popover:{title:'Prediksi, Coba, Jelaskan',description:'Buka satu simulasi. Pilih variabel, tulis prediksi, lalu simpan untuk mengaktifkan Start. Setelah selesai, tulis penjelasan berdasarkan hasil model.'}},
 {element:'#main',popover:{title:'Latihan dan kartu hasil',description:'Di setiap simulasi ada dua soal konsep. Isi kode siswa lalu simpan hasil atau buat kartu PNG dengan grafik. Dialog berbagi meminta Anda sendiri memilih tujuan.'}},
 {element:'#main',popover:{title:'Ruang Guru tetap lokal',description:'Buka ?mode=guru untuk rekap IndexedDB dan impor hasil siswa. Ini bukan login atau ujian terawasi. Cadangkan data sebelum berganti perangkat.'}}
 ],onDestroyed:()=>{store.setSetting('tour:v3',true).catch(()=>{});active=null}});active.drive();
}
export async function firstTour(){try{if(!await store.getSetting('tour:v3',false))setTimeout(startTour,550)}catch{}}
