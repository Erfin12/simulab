/* © 2026 Erfin. All rights reserved. See LICENSE. */
import * as model from './src-simulations-mathematics-trigonometry-model.js';
import {label,disk,line,grid,axes,beaker,f} from './src-simulations-scenes.js';
export default {model,
id:"trigonometry",
title:"Lingkaran Trigonometri",
description:"Putar vektor, amati proyeksi x dan y, lalu hubungkan lingkaran dengan grafik sinus dan kosinus.",
objectives:["Menghubungkan sudut dengan proyeksi pada sumbu.", "Memeriksa identitas sin²θ + cos²θ = 1."],
theory:["Koordinat titik pada lingkaran berjari-jari r adalah (r cos θ, r sin θ). Sudut positif diukur berlawanan arah jarum jam dari sumbu x positif.", "Grafik sin dan cos memakai derajat. Waktu hanya mengatur sapuan sudut; bukan model benda yang berputar karena suatu gaya."],
formulas:[{"eq": "x = r cos θ; y = r sin θ", "note": "koordinat"}, {"eq": "sin²θ + cos²θ = 1", "note": "untuk setiap sudut"}],

 charts:[{id:'sin',title:'Sinus dan kosinus',xLabel:'θ (°)',yLabel:'nilai',kind:'static',xDomain:p=>[0,p.angle],yFixed:()=>[-1.2,1.2],series:[{label:'sin θ',color:'primary',fn:(p,x)=>Math.sin(x*Math.PI/180)},{label:'cos θ',color:'secondary',fn:(p,x)=>Math.cos(x*Math.PI/180)}],marker:(p,t)=>[{x:model.at(p,t).theta,y:model.at(p,t).sin,color:'primary'}]},{id:'coordinates',title:'Proyeksi koordinat',xLabel:'Waktu animasi (s)',yLabel:'koordinat',kind:'time',xDomain:()=>[0,8],yFixed:p=>[-p.r*1.2,p.r*1.2],series:[{label:'x',color:'secondary',fn:(p,t)=>model.at(p,t).x},{label:'y',color:'primary',fn:(p,t)=>model.at(p,t).y}]}],
 draw(v,p,s){grid(v);const {ctx:c,w,h,th}=v; const cx=w/2,cy=h/2+10,R=Math.min(w*.32,h*.32),X=cx+R*s.cos,Y=cy-R*s.sin;line(c,cx-R-20,cy,cx+R+20,cy,th.border);line(c,cx,cy-R-20,cx,cy+R+20,th.border);c.strokeStyle=th.text2;c.lineWidth=1.5;c.beginPath();c.arc(cx,cy,R,0,Math.PI*2);c.stroke();line(c,cx,cy,X,Y,th.primary,3);line(c,X,cy,X,Y,th.secondary,3);line(c,cx,cy,X,cy,th.warn,3);disk(c,X,Y,7,th.primary);label(c,`θ = ${f(s.theta)}°`,18,24,th);label(c,`sin = ${f(s.sin)}   cos = ${f(s.cos)}`,w/2,h-16,th,'center');label(c,'+x',cx+R+18,cy-8,th);label(c,'+y',cx+9,cy-R-10,th)},
 challenges:[{id:'trig-sin',type:'predict',title:'Sinus 90 derajat',text:'r = 1, sudut akhir 90°. Prediksi sinus sudut akhir.',setup:{r:1,angle:90},input:{label:'Sinus 90°',unit:''},answer:r=>r.sin,tol:.001,explain:'Titik berada di puncak lingkaran: sin 90° = 1, cos 90° = 0.'},{id:'trig-radius',type:'choice',title:'Mengubah radius',text:'Jika r digandakan pada sudut tetap, apa yang berubah?',options:['Sin dan cos berlipat dua','x dan y berlipat dua; sin dan cos tetap','Sudut berlipat dua'],correct:1,explain:'x = r cos θ dan y = r sin θ. Nilai sin dan cos hanya ditentukan sudut.'}],
 conclude(p){const s=model.at(p,8);return `Pada θ = ${f(p.angle)}°, koordinat (${f(s.x)}, ${f(s.y)}). sin²θ + cos²θ = ${f(s.sin**2+s.cos**2)}. Radius mengubah koordinat, bukan nilai fungsi trigonometri.`}

};
