/* © 2026 Erfin. All rights reserved. See LICENSE. */
import {h} from './src-utils-dom.js';
// Suara dikendalikan OS/browser. Pilih suara lokal saja agar tidak menjanjikan
// dukungan offline dari suara jaringan. Tidak ada layanan TTS atau CDN tambahan.
export function speechControls(getText,label='Bacakan'){
 const supported=!!window.speechSynthesis&&typeof window.SpeechSynthesisUtterance==='function';
 const status=h('span',{class:'small muted',role:'status','aria-live':'polite'});let disposed=false;
 const select=h('select',{'aria-label':'Suara lokal untuk bacaan',class:'speech-voices'});
 let localVoices=[];
 const read=h('button',{class:'btn btn-sm',type:'button',onclick:()=>{
  if(!supported)return;const text=String(getText()||'').trim();if(!text){status.textContent='Belum ada teks untuk dibacakan.';return}
  localVoices=window.speechSynthesis.getVoices().filter(v=>v.localService);
  const voice=localVoices.find(v=>v.voiceURI===select.value)||localVoices.find(v=>/^id([-_]|$)/i.test(v.lang))||localVoices[0];
  if(!voice){status.textContent='Belum ada suara lokal. Pasang suara lewat pengaturan sistem/perangkat; materi tetap dapat dibaca sebagai teks.';return}
  window.speechSynthesis.cancel();const utter=new SpeechSynthesisUtterance(text.slice(0,16000));utter.voice=voice;utter.lang=voice.lang;utter.rate=.95;
  utter.onstart=()=>{if(!disposed)status.textContent='Sedang membacakan dengan suara '+voice.name+'.'};
  utter.onend=()=>{if(!disposed)status.textContent='Selesai dibacakan.'};
  utter.onerror=e=>{if(!disposed)status.textContent=e.error==='canceled'||e.error==='interrupted'?'Bacaan dihentikan.':'Suara gagal diputar ('+e.error+'). Teks tetap tersedia.'};
  try{window.speechSynthesis.speak(utter);status.textContent='Memulai suara '+voice.name+'.'}catch{status.textContent='Browser tidak dapat memutar suara ini.'}
 }},label);
 const stop=h('button',{class:'btn btn-sm',type:'button',onclick:()=>{if(supported)window.speechSynthesis.cancel();status.textContent='Bacaan dihentikan.'}},'Hentikan bacaan');
 function refresh(){if(!supported)return;const previous=select.value;localVoices=window.speechSynthesis.getVoices().filter(v=>v.localService);select.replaceChildren(...localVoices.map(v=>h('option',{value:v.voiceURI},v.name+' ('+v.lang+')')));select.value=localVoices.some(v=>v.voiceURI===previous)?previous:(localVoices.find(v=>/^id([-_]|$)/i.test(v.lang))||localVoices[0])?.voiceURI||'';select.hidden=!localVoices.length;status.textContent=localVoices.length?(localVoices.some(v=>/^id([-_]|$)/i.test(v.lang))?'Suara lokal tersedia.':'Suara Indonesia lokal belum tersedia. Pilih suara lokal lain atau baca teks.'):'API tersedia, tetapi belum ada suara lokal yang dapat dipakai offline.'}
 if(supported){refresh();window.speechSynthesis.addEventListener('voiceschanged',refresh)}else{read.disabled=true;stop.disabled=true;select.hidden=true;status.textContent='Browser ini tidak mendukung bacaan suara. Teks tetap tersedia.'}
 return {el:h('div',{class:'speech-controls'},h('div',{class:'row-gap wrap'},read,stop,select),status),destroy(){disposed=true;if(supported){window.speechSynthesis.removeEventListener('voiceschanged',refresh);window.speechSynthesis.cancel()}}};
}
