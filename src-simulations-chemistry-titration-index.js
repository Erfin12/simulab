/* © 2026 Erfin. All rights reserved. See LICENSE. */
import * as model from './src-simulations-chemistry-titration-model.js';
import {label,disk,line,grid,axes,beaker,f} from './src-simulations-scenes.js';
export default {model,
id:"titration",
title:"Titrasi Asam-Basa Kuat",
description:"Tambahkan basa ke asam, ikuti pH dan temukan titik ekuivalen pada kurva titrasi.",
objectives:["Menghitung volume ekuivalen dari jumlah mol.", "Membedakan pH sebelum, saat, dan sesudah ekuivalen."],
theory:["Asam kuat monoprotik dan basa kuat monovalen terdisosiasi sempurna. Model larutan ideal pada 25 °C, volume aditif, tanpa perubahan suhu dan aktivitas ion. Bukan panduan praktik bahan kimia.", "Autoprotolisis air (Kw = 10⁻¹⁴) disertakan agar pH di titik ekuivalen tepat 7. Warna larutan adalah kode pH ilustratif, bukan warna HCl/NaOH atau indikator tertentu. Waktu hanya animasi penambahan volume."],
formulas:[{"eq": "CₐVₐ = CᵦVₑ", "note": "titik ekuivalen"}, {"eq": "d = (CₐVₐ − CᵦVᵦ)/(Vₐ + Vᵦ)", "note": "selisih konsentrasi muatan"}, {"eq": "[H⁺] = (d + √(d² + 4Kw))/2; pH = −log₁₀[H⁺]", "note": "solusi kesetimbangan air"}],

 charts:[{id:'ph',title:'Kurva titrasi',xLabel:'Basa ditambahkan (mL)',yLabel:'pH',kind:'static',xDomain:p=>[0,p.Vmax],yFixed:()=>[0,14],series:[{label:'pH',color:'primary',fn:model.ph}],marker:(p,t)=>[{x:model.at(p,t).V,y:model.at(p,t).pH,color:'warn'}]},{id:'moles',title:'Jumlah asam dan basa',xLabel:'Basa ditambahkan (mL)',yLabel:'mmol',kind:'static',xDomain:p=>[0,p.Vmax],series:[{label:'Asam awal',color:'warn',fn:p=>p.Ca*p.Va},{label:'Basa masuk',color:'secondary',fn:(p,V)=>p.Cb*V}]}],
 draw(v,p,s,t){grid(v);const {ctx:c,w,h,th}=v;const col=s.pH<6.9?th.warn:s.pH>7.1?th.primary:th.ok;const bw=Math.min(180,w*.5),x=(w-bw)/2,y=h*.37,bh=h*.42;beaker(c,x,y,bw,bh,.35+.5*s.V/p.Vmax,col,th);line(c,w/2,50,w/2,y-22,th.text2,8);disk(c,w/2,y-12+(t*24)%17,3,col);label(c,`pH ${f(s.pH)}`,18,24,th,'left',col,17);label(c,`V basa = ${f(s.V)} mL`,w/2,h-20,th,'center');label(c,'25 °C • ideal',w-18,24,th,'right',th.text2,11)},
 challenges:[{id:'tit-eq',type:'predict',title:'Prediksi ekuivalen',text:'25 mL asam 0,1 M dititrasi basa 0,1 M. Berapa mL basa untuk ekuivalen?',setup:{Ca:.1,Va:25,Cb:.1,Vmax:50},input:{label:'Volume ekuivalen',unit:'mL'},answer:r=>r.eq,tol:.001,explain:'CₐVₐ = CᵦVₑ, jadi Vₑ = 25 mL.'},{id:'tit-ph',type:'choice',title:'pH ekuivalen',text:'Berapa pH pada ekuivalen untuk asam kuat dan basa kuat ideal pada 25 °C?',options:['0','7','14'],correct:1,explain:'Asam dan basa habis bereaksi. Ion garam tidak terhidrolisis; air memberi pH 7 pada 25 °C.'}],
 conclude(p){const eq=p.Ca*p.Va/p.Cb;return `Ekuivalen pada ${f(eq)} mL basa. Percobaan berakhir ${p.Vmax<eq?'sebelum':p.Vmax>eq?'sesudah':'tepat saat'} ekuivalen dengan pH ${f(model.ph(p,p.Vmax))}. Model hanya berlaku untuk asam/basa kuat monovalen ideal pada 25 °C.`}

};
