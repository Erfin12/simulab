/* © 2026 Erfin. All rights reserved. See LICENSE. */
export const params = [
 {key:'a',symbol:'a',label:'Koefisien kuadrat',unit:'',min:-3,max:3,step:0.1,def:1,desc:'a = 0 menghasilkan fungsi linear.'},
 {key:'b',symbol:'b',label:'Koefisien linear',unit:'',min:-6,max:6,step:0.1,def:-2,desc:'Mengubah kemiringan kurva.'},
 {key:'c',symbol:'c',label:'Konstanta',unit:'',min:-10,max:10,step:0.1,def:-3,desc:'Titik potong sumbu y.'},
 {key:'R',symbol:'R',label:'Rentang x',unit:'',min:2,max:10,step:1,def:5,desc:'x ditelusuri dari -R sampai +R.'}];
export const duration=()=>8, check=()=>null;
export const value=(p,x)=>p.a*x*x+p.b*x+p.c;
export const slope=(p,x)=>2*p.a*x+p.b;
export const columns=[{key:'t',label:'Waktu animasi',unit:'s',dec:2},{key:'x',label:'x',unit:'',dec:3},{key:'y',label:'y',unit:'',dec:3},{key:'slope',label:'dy/dx',unit:'',dec:3}];
export function at(p,t){const x=-p.R+2*p.R*Math.min(1,t/8);return {t,x,y:value(p,x),slope:slope(p,x)}}
export const results=p=>[{key:'disc',label:'Diskriminan',symbol:'D',unit:'',value:p.b*p.b-4*p.a*p.c},{key:'intercept',label:'Potong sumbu y',symbol:'c',unit:'',value:p.c},{key:'end',label:'y pada x = R',symbol:'y(R)',unit:'',value:value(p,p.R)}];
