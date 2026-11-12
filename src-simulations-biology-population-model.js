/* © 2026 Erfin. All rights reserved. See LICENSE. */
export const params=[
 {key:'N0',symbol:'N₀',label:'Populasi awal',unit:'individu',min:10,max:500,step:10,def:50,desc:'Populasi diperlakukan kontinu, bukan hitungan acak.'},
 {key:'K',symbol:'K',label:'Daya dukung',unit:'individu',min:100,max:2000,step:50,def:1000,desc:'Populasi keseimbangan lingkungan.'},
 {key:'r',symbol:'r',label:'Laju intrinsik',unit:'hari⁻¹',min:0.05,max:1,step:0.05,def:0.3,desc:'Lingkungan tertutup dan parameter tetap.'},
 {key:'T',symbol:'T',label:'Durasi model',unit:'hari',min:5,max:30,step:1,def:20,desc:'Satu detik animasi mewakili satu hari model.'}];
export const duration=p=>p.T,check=()=>null;
export const columns=[{key:'t',label:'Waktu',unit:'hari',dec:2},{key:'N',label:'Populasi',unit:'individu',dec:2},{key:'growth',label:'Pertumbuhan',unit:'individu/hari',dec:3},{key:'capacity',label:'Terisi',unit:'%',dec:2}];
export function at(p,t){const N=p.K/(1+(p.K/p.N0-1)*Math.exp(-p.r*t));return {t,N,growth:p.r*N*(1-N/p.K),capacity:100*N/p.K}}
export const results=p=>[{key:'N',label:'Populasi akhir',symbol:'N(T)',unit:'individu',value:at(p,p.T).N},{key:'growth',label:'Pertumbuhan akhir',symbol:'dN/dt',unit:'individu/hari',value:at(p,p.T).growth},{key:'max',label:'Laju maksimum teoretis',symbol:'rK/4',unit:'individu/hari',value:p.r*p.K/4}];
