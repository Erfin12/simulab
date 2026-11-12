/* © 2026 Erfin. All rights reserved. See LICENSE. */
export const params=[
 {key:'r',symbol:'r',label:'Jari-jari',unit:'',min:0.5,max:3,step:0.1,def:1,desc:'Skala lingkaran; sin dan cos tidak berubah.'},
 {key:'angle',symbol:'θ',label:'Sudut akhir',unit:'°',min:30,max:720,step:15,def:360,desc:'Sudut positif berputar berlawanan jarum jam.'}];
export const duration=()=>8,check=()=>null;
export const columns=[{key:'t',label:'Waktu animasi',unit:'s',dec:2},{key:'theta',label:'Sudut',unit:'°',dec:2},{key:'x',label:'x',unit:'',dec:3},{key:'y',label:'y',unit:'',dec:3},{key:'sin',label:'sin θ',unit:'',dec:3},{key:'cos',label:'cos θ',unit:'',dec:3}];
export function at(p,t){const theta=p.angle*Math.min(1,t/8),rad=theta*Math.PI/180;return {t,theta,x:p.r*Math.cos(rad),y:p.r*Math.sin(rad),sin:Math.sin(rad),cos:Math.cos(rad)}}
export const results=p=>{const s=at(p,8);return [{key:'sin',label:'Sinus akhir',symbol:'sin θ',unit:'',value:s.sin},{key:'cos',label:'Kosinus akhir',symbol:'cos θ',unit:'',value:s.cos},{key:'identity',label:'Identitas Pythagoras',symbol:'sin²θ+cos²θ',unit:'',value:s.sin**2+s.cos**2}]};
