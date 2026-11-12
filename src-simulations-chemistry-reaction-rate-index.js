/* © 2026 Erfin. All rights reserved. See LICENSE. */
import * as model from './src-simulations-chemistry-reaction-rate-model.js';
import {label,disk,line,grid,axes,beaker,f} from './src-simulations-scenes.js';
export default {model,
id:"reaction-rate",
title:"Reaksi Orde Satu",
description:"Lihat reaktan A berubah menjadi produk B. Ubah konstanta laju dan uji waktu paruh reaksi ideal.",
objectives:["Membedakan konsentrasi dan laju reaksi.", "Menghitung waktu paruh dan konversi."],
theory:["Model ideal A → B dengan stoikiometri 1:1, volume dan suhu tetap, tanpa reaksi balik. Orde satu berarti laju berbanding lurus dengan [A].", "Titik-titik pada animasi adalah ilustrasi fraksi konsentrasi, bukan lintasan molekul hasil simulasi dinamika molekul. Jumlah total [A] + [B] tetap."],
formulas:[{"eq": "[A](t) = [A]₀ exp(−kt)", "note": "konsentrasi reaktan"}, {"eq": "v = k[A]; [B] = [A]₀ − [A]", "note": "laju dan produk"}, {"eq": "t½ = ln(2)/k", "note": "waktu paruh"}],

 charts:[{id:'concentration',title:'Konsentrasi reaktan dan produk',xLabel:'t (s)',yLabel:'mol/L',kind:'time',xDomain:p=>[0,p.T],yFixed:p=>[0,p.C0*1.1],series:[{label:'A',color:'primary',fn:(p,t)=>model.at(p,t).A},{label:'B',color:'secondary',fn:(p,t)=>model.at(p,t).B}]},{id:'rate',title:'Laju reaksi',xLabel:'t (s)',yLabel:'mol/(L·s)',kind:'time',xDomain:p=>[0,p.T],series:[{label:'v',color:'warn',fn:(p,t)=>model.at(p,t).rate}]}],
 draw(v,p,s,t){grid(v);const {ctx:c,w,h,th}=v;label(c,`A → B     t = ${f(t)} s`,18,24,th);const nA=Math.round(60*s.A/p.C0),boxW=Math.min(w-50,420),left=(w-boxW)/2;beaker(c,left,55,boxW,h-110,.94,th.primary,th);for(let i=0;i<60;i++){const col=i<nA?th.primary:th.secondary;disk(c,left+18+(i%10)*(boxW-36)/9+Math.sin(t+i)*2,77+Math.floor(i/10)*(h-155)/5+Math.cos(t+i)*2,4.5,col)}label(c,`A ${f(s.A)} M   •   B ${f(s.B)} M`,w/2,h-20,th,'center');},
 challenges:[{id:'rate-half',type:'predict',title:'Hitung waktu paruh',text:'Jika k = 0,2 s⁻¹, berapa waktu paruh (s)?',setup:{C0:1,k:.2,T:12},input:{label:'Waktu paruh',unit:'s'},answer:r=>r.half,tol:.02,explain:'t½ = ln(2)/0,2 = 3,466 s. Tidak bergantung pada konsentrasi awal.'},{id:'rate-k',type:'choice',title:'Reaksi lebih cepat',text:'Jika k digandakan, apa yang terjadi pada waktu paruh?',options:['Dua kali lebih lama','Setengahnya','Tidak berubah'],correct:1,explain:'t½ berbanding terbalik dengan k.'}],
 conclude(p){const s=model.at(p,p.T);return `Setelah ${f(p.T)} s, [A] = ${f(s.A)} M dan [B] = ${f(s.B)} M. Total tetap ${f(p.C0)} M. Waktu paruh ${f(Math.log(2)/p.k)} s. Laju menurun saat reaktan berkurang.`}

};
