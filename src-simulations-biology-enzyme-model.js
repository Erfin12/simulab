/* © 2026 Erfin. All rights reserved. See LICENSE. */
export const params=[
 {key:'Vmax',symbol:'Vₘₐₓ',label:'Laju maksimum',unit:'µmol/min',min:10,max:200,step:5,def:100,desc:'Berbanding lurus dengan jumlah enzim aktif.'},
 {key:'Km',symbol:'Kₘ',label:'Konstanta Michaelis',unit:'mmol/L',min:0.1,max:10,step:0.1,def:2,desc:'Konsentrasi substrat saat laju = ½ Vmax.'},
 {key:'Smax',symbol:'Sₘ',label:'Substrat akhir',unit:'mmol/L',min:1,max:30,step:0.5,def:15,desc:'Sapuan konsentrasi dari nol; bukan reaksi terhadap waktu.'}];
export const duration=()=>8,check=()=>null;
export const velocity=(p,S)=>p.Vmax*S/(p.Km+S);
export const columns=[{key:'t',label:'Waktu animasi',unit:'s',dec:2},{key:'S',label:'[S]',unit:'mmol/L',dec:3},{key:'v',label:'Laju awal',unit:'µmol/min',dec:3},{key:'occupied',label:'Fraksi ES',unit:'%',dec:2}];
export function at(p,t){const S=p.Smax*Math.min(1,t/8);return {t,S,v:velocity(p,S),occupied:100*S/(p.Km+S)}}
export const results=p=>[{key:'v',label:'Laju pada substrat akhir',symbol:'v',unit:'µmol/min',value:velocity(p,p.Smax)},{key:'half',label:'Laju saat [S] = Km',symbol:'Vmax/2',unit:'µmol/min',value:p.Vmax/2},{key:'occupied',label:'Fraksi ES akhir',symbol:'ES/Etotal',unit:'%',value:100*p.Smax/(p.Km+p.Smax)}];
