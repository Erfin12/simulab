/* © 2026 Erfin. All rights reserved. See LICENSE. */
import {h,clear,toast} from './src-utils-dom.js';
import {num} from './src-utils-format.js';
import {PoeState} from './src-learning-poe-state.js';
import * as store from './src-storage-db.js';
import {speechControls} from './src-accessibility-speech.js';
// Setiap simulasi punya draf tersendiri di IndexedDB (settings), tanpa migrasi DB v2.
export async function createPoe({id,title,onChange}){
 const machine=new PoeState();let destroyed=false,saveTimer=0,writeChain=Promise.resolve();
 const key='poe:'+id;const saved=await store.getSetting(key,null);
 // Simpan satu refleksi terakhir agar kunjungan baru tidak menghapus tulisan lama.
 let lastReflection=saved?.explanation?.trim()?{prediction:saved.prediction,explanation:saved.explanation,results:saved.results}:saved?.previous||null;
 const prediction=h('textarea',{id:'poe-prediction',rows:2,maxlength:1200,'aria-label':'Prediksi sebelum eksperimen',placeholder:'Prediksi saya ... karena ... (boleh angka dan satuan)'});
 if(typeof saved?.prediction==='string')prediction.value=saved.prediction.slice(0,1200);
 const explanation=h('textarea',{id:'poe-explanation',rows:3,maxlength:1200,'aria-label':'Penjelasan setelah eksperimen',placeholder:'Data menunjukkan ... sehingga ...'});
 const stage=h('span',{class:'chip',id:'poe-stage',role:'status','aria-live':'polite'}),hint=h('p',{class:'muted small',id:'poe-hint'}),resultBox=h('div',{class:'poe-results'}),storageStatus=h('span',{class:'small muted',role:'status'});
 const conclusion=h('div',{class:'poe-conclusion',hidden:true},h('h3',null,'03 / Jelaskan dengan bukti'),h('p',{class:'small muted'},'Bandingkan prediksi dengan hasil model, lalu tulis mengapa sama atau berbeda. Tidak ada penilaian otomatis.'),resultBox,h('label',{for:'poe-explanation'},'Penjelasan Anda'),explanation);
 function persist(){clearTimeout(saveTimer);saveTimer=setTimeout(()=>flush(),450)}
 function flush(){clearTimeout(saveTimer);const data={...machine.snapshot(),prediction:prediction.value.slice(0,1200),updatedAt:Date.now(),previous:lastReflection};writeChain=writeChain.catch(()=>{}).then(()=>store.setSetting(key,data)).then(()=>{if(!destroyed)storageStatus.textContent=store.persistent?'Draf disimpan di perangkat ini.':'Draf hanya sementara: penyimpanan permanen tidak tersedia.'}).catch(()=>{if(!destroyed)storageStatus.textContent='Draf gagal disimpan. Salin jawaban sebelum menutup.'});return writeChain}
 const confirm=h('button',{class:'btn btn-primary',type:'button',id:'poe-confirm',disabled:!prediction.value.trim(),onclick:()=>{if(!machine.predict(prediction.value))return;draw();flush();onChange();document.querySelector('#visual')?.scrollIntoView({block:'start'});}},'Simpan prediksi & buka eksperimen');
 const revise=h('button',{class:'btn',type:'button',id:'poe-revise',onclick:()=>{onResetRequest?.();api.reset();prediction.focus();}},'Ubah prediksi / percobaan baru');
 let onResetRequest=null;
 const compareText=()=>`Prediksi: ${machine.prediction}. Hasil simulasi model: `+machine.results.map(r=>`${r.label} ${num(r.value,3)} ${r.unit}`).join('. ')+'. Penjelasan siswa: '+(machine.explanation||'Belum diisi.');
 const reader=speechControls(compareText,'Bacakan hasil & penjelasan');
 function draw(){const state=machine.state;stage.textContent={prediksi:'1 / Prediksi',eksperimen:'2 / Coba',kesimpulan:'3 / Jelaskan'}[state];root.dataset.state=state;prediction.disabled=state!=='prediksi';confirm.hidden=state!=='prediksi';confirm.disabled=!prediction.value.trim();revise.hidden=state==='prediksi';conclusion.hidden=state!=='kesimpulan';reader.el.hidden=state!=='kesimpulan';explanation.disabled=state!=='kesimpulan';hint.textContent={prediksi:'Isi prediksi, lalu simpan untuk mengaktifkan Start dan jelajah waktu. Mengubah variabel atau Reset meminta prediksi baru.',eksperimen:'02 / Coba: jalankan simulasi sampai selesai. Ubah satu variabel untuk percobaan baru. Untuk gelombang, amati minimal satu periode.',kesimpulan:'Percobaan selesai. Hasil berasal dari model ideal, bukan pengukuran dunia nyata.'}[state];clear(resultBox);if(state==='kesimpulan'){resultBox.append(h('div',{class:'poe-compare'},h('div',null,h('h4',null,'Prediksi sebelum percobaan'),h('p',null,machine.prediction)),h('div',null,h('h4',null,'Hasil simulasi (model)'),h('ul',null,machine.results.map(r=>h('li',null,`${r.label}: ${num(r.value,3)} ${r.unit}`))))));} }
 prediction.addEventListener('input',()=>{confirm.disabled=!prediction.value.trim();persist()});explanation.addEventListener('input',()=>{machine.explain(explanation.value);if(explanation.value.trim())lastReflection={prediction:machine.prediction,explanation:machine.explanation,results:machine.results.map(r=>({...r}))};persist()});
 const root=h('section',{class:'card poe-panel',id:'poe'},h('div',{class:'row-between wrap'},h('div',null,h('div',{class:'eyebrow'},'ALUR BELAJAR / '+title),h('h2',null,'Prediksi · Coba · Jelaskan')),stage),h('div',{class:'poe-input'},h('label',{for:'poe-prediction'},'01 / Prediksi dan alasan'),prediction,h('div',{class:'row-gap wrap'},confirm,revise)),hint,conclusion,h('div',{class:'row-gap wrap'},reader.el,storageStatus),lastReflection?.explanation?h('details',{class:'poe-history'},h('summary',null,'Lihat penjelasan terakhir yang tersimpan'),h('p',{class:'small muted'},'Catatan percobaan terdahulu, bukan hasil percobaan aktif.'),h('p',null,lastReflection.explanation)):null,
    saved?.prediction?h('p',{class:'small muted'},'Draf prediksi sebelumnya dipulihkan. Simpan ulang untuk percobaan baru; hasil lama tidak dianggap percobaan aktif.'):null);
 const api={el:root,get state(){return machine.state},get canStart(){return machine.state==='eksperimen'},snapshot:()=>machine.snapshot(),reset(){machine.reset();explanation.value='';draw();persist();onChange()},reopen(){machine.reopen();explanation.value='';draw();onChange()},complete(results){if(machine.complete(results)){draw();flush();onChange()}},setResetHandler(fn){onResetRequest=fn},destroy(){destroyed=true;flush();reader.destroy()}};
 draw();return api;
}
