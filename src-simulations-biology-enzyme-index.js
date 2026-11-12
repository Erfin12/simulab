/* © 2026 Erfin. All rights reserved. See LICENSE. */
import * as model from './src-simulations-biology-enzyme-model.js';
import {label,disk,line,grid,axes,beaker,f} from './src-simulations-scenes.js';
export default {model,
id:"enzyme",
title:"Kinetika Enzim",
description:"Sapukan konsentrasi substrat, lihat enzim menuju jenuh dan temukan arti Km dalam model Michaelis-Menten.",
objectives:["Menjelaskan kejenuhan enzim.", "Menemukan laju setengah maksimum saat [S] = Km."],
theory:["Model Michaelis-Menten menggambarkan laju awal satu enzim dan satu substrat pada keadaan tunak, tanpa inhibisi dan tanpa kooperativitas. Suhu dan pH tetap.", "Animasi menyapukan konsentrasi [S] yang dipilih, bukan konsumsi substrat terhadap waktu. Fraksi ES = [S]/(Km + [S]) dalam model sederhana ini. Bentuk pada gambar adalah ilustrasi, bukan struktur molekul."],
formulas:[{"eq": "v = Vmax[S] / (Km + [S])", "note": "laju awal"}, {"eq": "[S] = Km ⇒ v = Vmax/2", "note": "arti Km"}, {"eq": "ES/Etotal = [S]/(Km + [S])", "note": "fraksi kompleks pada model sederhana"}],

 charts:[{id:'velocity',title:'Kurva Michaelis-Menten',xLabel:'[S] (mmol/L)',yLabel:'v (µmol/min)',kind:'static',xDomain:p=>[0,p.Smax],yFixed:p=>[0,p.Vmax*1.1],series:[{label:'Laju awal',color:'ok',fn:model.velocity},{label:'Vmax',color:'secondary',fn:p=>p.Vmax}],marker:(p,t)=>[{x:model.at(p,t).S,y:model.at(p,t).v,color:'warn'}]},{id:'fraction',title:'Fraksi kompleks ES',xLabel:'[S] (mmol/L)',yLabel:'%',kind:'static',xDomain:p=>[0,p.Smax],yFixed:()=>[0,100],series:[{label:'ES/Etotal',color:'primary',fn:(p,S)=>100*S/(p.Km+S)}]}],
 draw(v,p,s,t){grid(v);const {ctx:c,w,h,th}=v;label(c,`[S] = ${f(s.S)} mmol/L`,18,24,th);const n=Math.round(12*s.occupied/100);for(let i=0;i<12;i++){const x=28+(i%6)*(w-56)/5,y=h*.35+Math.floor(i/6)*h*.25;c.strokeStyle=th.ok;c.lineWidth=5;c.beginPath();c.arc(x,y,12,.5,Math.PI*2-.5);c.stroke();if(i<n)disk(c,x+8,y,5,th.warn);else if(s.S>0)disk(c,x+10+Math.sin(t+i)*4,y-17,3,th.text2)}label(c,`v = ${f(s.v)} µmol/min`,w/2,h-20,th,'center',th.ok);},
 challenges:[{id:'enz-half',type:'predict',title:'Laju setengah maksimum',text:'Vmax = 100 µmol/min, Km = 2 mmol/L dan [S] = 2 mmol/L. Berapa laju awal?',setup:{Vmax:100,Km:2,Smax:2},input:{label:'Laju awal',unit:'µmol/min'},answer:r=>r.v,tol:.001,explain:'v = 100 × 2/(2 + 2) = 50 µmol/min.'},{id:'enz-saturation',type:'choice',title:'Saat substrat sangat banyak',text:'Jika [S] jauh lebih besar daripada Km, laju mendekati apa?',options:['Nol','Vmax','Tak terhingga'],correct:1,explain:'Saat [S] ≫ Km, [S]/(Km + [S]) mendekati 1. Laju mendekati Vmax.'}],
 conclude(p){const s=model.at(p,8);return `Pada [S] = ${f(p.Smax)} mmol/L, laju awal ${f(s.v)} µmol/min (${f(s.occupied)}% dari Vmax). Saat [S] = Km = ${f(p.Km)} mmol/L, laju = ${f(p.Vmax/2)} µmol/min. Sapuan ini bukan simulasi reaksi terhadap waktu.`}

};
