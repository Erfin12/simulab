/* © 2026 Erfin. All rights reserved. See LICENSE. */
export const params=[
 {key:'Ca',symbol:'Cₐ',label:'Konsentrasi asam',unit:'mol/L',min:0.01,max:0.5,step:0.01,def:0.1,desc:'Asam kuat monoprotik, misalnya HCl.'},
 {key:'Va',symbol:'Vₐ',label:'Volume asam',unit:'mL',min:5,max:50,step:1,def:25,desc:'Volume awal dalam labu.'},
 {key:'Cb',symbol:'Cᵦ',label:'Konsentrasi basa',unit:'mol/L',min:0.01,max:0.5,step:0.01,def:0.1,desc:'Basa kuat monovalen, misalnya NaOH.'},
 {key:'Vmax',symbol:'Vₘ',label:'Basa ditambahkan',unit:'mL',min:5,max:100,step:1,def:50,desc:'Volume akhir titran; dapat berhenti sebelum ekuivalen.'}];
export const duration=()=>10,check=()=>null;
export function ph(p,V){const d=(p.Ca*p.Va-p.Cb*V)/(p.Va+V),q=Math.sqrt(d*d+4e-14);const H=d>=0?(d+q)/2:2e-14/(q-d);return -Math.log10(H)}
export const columns=[{key:'t',label:'Waktu animasi',unit:'s',dec:2},{key:'V',label:'Volume basa',unit:'mL',dec:3},{key:'pH',label:'pH',unit:'',dec:3},{key:'excess',label:'Asam bersih',unit:'mmol',dec:3}];
export function at(p,t){const V=p.Vmax*Math.min(1,t/10);return {t,V,pH:ph(p,V),excess:p.Ca*p.Va-p.Cb*V}}
export const results=p=>[{key:'eq',label:'Volume ekuivalen',symbol:'Vₑ',unit:'mL',value:p.Ca*p.Va/p.Cb},{key:'pH',label:'pH akhir',symbol:'pH',unit:'',value:ph(p,p.Vmax)},{key:'total',label:'Volume akhir larutan',symbol:'V',unit:'mL',value:p.Va+p.Vmax}];
