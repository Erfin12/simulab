/* © 2026 Erfin. All rights reserved. See LICENSE. */
import * as model from './src-simulations-mathematics-quadratic-model.js';
import {label,disk,line,grid,axes,beaker,f} from './src-simulations-scenes.js';
export default {model,
id:"quadratic",
title:"Studio Fungsi Kuadrat",
description:"Telusuri parabola dengan titik bergerak dan garis singgung. Ubah a, b, c dan lihat fungsi serta turunannya.",
objectives:["Menghubungkan koefisien dengan bentuk kurva.", "Membaca gradien garis singgung sebagai turunan.", "Membedakan fungsi kuadrat dan linear saat a = 0."],
theory:["Fungsi y = ax² + bx + c berbentuk parabola jika a tidak nol. Tanda a menentukan arah bukaan. Saat a = 0, fungsi menjadi linear atau konstan.", "Diskriminan D = b² − 4ac hanya menggolongkan akar kuadrat saat a ≠ 0. Titik puncak x = −b/(2a). Waktu di sini hanya durasi animasi sapuan x, bukan besaran pada fungsi."],
formulas:[{"eq": "y = ax² + bx + c", "note": "nilai fungsi"}, {"eq": "dy/dx = 2ax + b", "note": "gradien lokal"}, {"eq": "D = b² − 4ac", "note": "diskriminan (a ≠ 0)"}],

 charts:[{id:'function',title:'Fungsi dan titik pengamatan',xLabel:'x',yLabel:'y',kind:'static',xDomain:p=>[-p.R,p.R],series:[{label:'y(x)',color:'primary',fn:model.value}],marker:(p,t)=>[{x:model.at(p,t).x,y:model.at(p,t).y,color:'secondary'}]}, {id:'derivative',title:'Gradien sepanjang kurva',xLabel:'x',yLabel:'dy/dx',kind:'static',xDomain:p=>[-p.R,p.R],series:[{label:'Turunan',color:'secondary',fn:model.slope}]}],
 draw(v,p,s){grid(v);const {ctx:c,w,h,th}=v; const vals=[model.value(p,-p.R),model.value(p,p.R),p.c];if(p.a!==0){const xv=-p.b/(2*p.a);if(Math.abs(xv)<=p.R)vals.push(model.value(p,xv))}const lo=Math.min(0,...vals)-2,hi=Math.max(0,...vals)+2;const {X,Y}=axes(c,w,h,th,-p.R,p.R,lo,hi,x=>model.value(p,x),[s.x,s.y]);const dx=p.R/5;line(c,X(s.x-dx),Y(s.y-s.slope*dx),X(s.x+dx),Y(s.y+s.slope*dx),th.warn);label(c,`x = ${f(s.x)}   y = ${f(s.y)}`,18,24,th);label(c,`gradien = ${f(s.slope)}`,w-18,h-12,th,'right',th.secondary)},
 challenges:[{id:'quad-predict',type:'predict',title:'Prediksi nilai fungsi',text:'a = 1, b = -2, c = -3 dan R = 5. Berapa y(5)?',setup:{a:1,b:-2,c:-3,R:5},input:{label:'Prediksi y(5)',unit:''},answer:r=>r.end,tol:.001,explain:'y(5) = 25 - 10 - 3 = 12.'},{id:'quad-shape',type:'choice',title:'Arah bukaan',text:'Jika a < 0, bagaimana arah bukaan parabola?',options:['Ke atas','Ke bawah','Selalu garis lurus'],correct:1,explain:'Koefisien x² negatif menghasilkan parabola terbuka ke bawah.'}],
 conclude(p){return p.a===0?`a = 0: fungsi menjadi ${p.b===0?'konstan':'linear'} dengan gradien ${f(p.b)}. Diskriminan bukan uji akar kuadrat untuk kasus ini.`:`Parabola terbuka ke ${p.a>0?'atas':'bawah'}, puncak pada x = ${f(-p.b/(2*p.a))}. D = ${f(p.b*p.b-4*p.a*p.c)}. Gradien berubah linear mengikuti 2ax + b.`}

};
