/* © 2026 Erfin. All rights reserved. See LICENSE. */
export const params=[
 {key:'C0',symbol:'[A]₀',label:'Konsentrasi awal',unit:'mol/L',min:0.1,max:2,step:0.1,def:1,desc:'Konsentrasi reaktan A pada awal reaksi.'},
 {key:'k',symbol:'k',label:'Konstanta laju',unit:'s⁻¹',min:0.01,max:1,step:0.01,def:0.2,desc:'Tetap sepanjang reaksi; suhu dianggap tetap.'},
 {key:'T',symbol:'T',label:'Waktu pengamatan',unit:'s',min:2,max:30,step:1,def:12,desc:'Reaksi A → B orde satu, stoikiometri 1:1.'}];
export const duration=p=>p.T,check=()=>null;
export const columns=[{key:'t',label:'t',unit:'s',dec:2},{key:'A',label:'[A]',unit:'mol/L',dec:4},{key:'B',label:'[B]',unit:'mol/L',dec:4},{key:'rate',label:'Laju',unit:'mol/(L·s)',dec:4}];
export function at(p,t){const A=p.C0*Math.exp(-p.k*t);return {t,A,B:p.C0-A,rate:p.k*A}}
export const results=p=>[{key:'half',label:'Waktu paruh',symbol:'t½',unit:'s',value:Math.log(2)/p.k},{key:'A',label:'Reaktan akhir',symbol:'[A]',unit:'mol/L',value:at(p,p.T).A},{key:'conversion',label:'Konversi A',symbol:'X',unit:'%',value:100*(1-Math.exp(-p.k*p.T))}];
