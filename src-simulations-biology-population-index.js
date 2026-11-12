/* © 2026 Erfin. All rights reserved. See LICENSE. */
import * as model from './src-simulations-biology-population-model.js';
import {label,disk,line,grid,axes,beaker,f} from './src-simulations-scenes.js';
export default {model,
id:"population",
title:"Pertumbuhan Populasi",
description:"Amati populasi mendekati daya dukung lingkungan. Ubah laju pertumbuhan dan bandingkan hasilnya.",
objectives:["Menjelaskan daya dukung lingkungan.", "Menghubungkan populasi dengan laju pertumbuhan.", "Mengamati penurunan jika N₀ > K."],
theory:["Model logistik kontinu menganggap lingkungan tertutup, r dan K konstan, tanpa migrasi dan tanpa fluktuasi acak. Model pendidikan ini bukan prediksi populasi nyata.", "Populasi di bawah K tumbuh mendekati K. Di atas K populasi menurun menuju K. Pertumbuhan terbesar pada N = K/2. Angka pecahan adalah keluaran model kontinu; titik pada animasi hanya mewakili proporsi."],
formulas:[{"eq": "dN/dt = rN(1 − N/K)", "note": "persamaan logistik"}, {"eq": "N(t) = K / [1 + (K/N₀ − 1)e<sup>−rt</sup>]", "note": "solusi analitik"}, {"eq": "(dN/dt)ₘₐₓ = rK/4", "note": "pada N = K/2"}],

 charts:[{id:'population',title:'Populasi terhadap waktu',xLabel:'t (hari)',yLabel:'individu',kind:'time',xDomain:p=>[0,p.T],series:[{label:'N',color:'ok',fn:(p,t)=>model.at(p,t).N},{label:'K',color:'secondary',fn:p=>p.K}]},{id:'growth',title:'Laju pertumbuhan',xLabel:'t (hari)',yLabel:'individu/hari',kind:'time',xDomain:p=>[0,p.T],series:[{label:'dN/dt',color:'primary',fn:(p,t)=>model.at(p,t).growth}]}],
 draw(v,p,s,t){grid(v);const {ctx:c,w,h,th}=v;label(c,`Hari ${f(t)}   •   N = ${f(s.N)}`,18,24,th);const n=Math.max(1,Math.round(72*Math.min(1,s.N/Math.max(p.N0,p.K))));for(let i=0;i<72;i++){const x=24+(i%12)*(w-48)/11,y=65+Math.floor(i/12)*(h-123)/5;disk(c,x,y,i<n?5:2,i<n?th.ok:th.border)}label(c,`K = ${p.K}   •   ${f(s.capacity)}% daya dukung`,w/2,h-20,th,'center');},
 challenges:[{id:'pop-eq',type:'predict',title:'Populasi seimbang',text:'N₀ = K = 500 individu. Berapa populasi setelah 20 hari?',setup:{N0:500,K:500,r:.3,T:20},input:{label:'Populasi akhir',unit:'individu'},answer:r=>r.N,tol:.001,explain:'Saat N = K, faktor (1 − N/K) = 0 sehingga populasi tetap 500.'},{id:'pop-max',type:'choice',title:'Pertumbuhan tercepat',text:'Laju pertumbuhan positif maksimum terjadi pada populasi berapa?',options:['N = 0','N = K/2','N = K'],correct:1,explain:'rN(1 − N/K) adalah parabola terhadap N, dengan puncak pada K/2.'}],
 conclude(p){const s=model.at(p,p.T);return `Populasi ${p.N0>p.K?'menurun':p.N0===p.K?'tetap':'tumbuh'} dari ${p.N0} ke ${f(s.N)} individu dalam ${p.T} hari, menuju daya dukung K = ${p.K}. Laju akhir ${f(s.growth)} individu/hari. Ini model kontinu ideal, bukan hitungan lapangan.`}

};
