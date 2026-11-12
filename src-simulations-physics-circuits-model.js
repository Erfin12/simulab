/* © 2026 Erfin. All rights reserved. See LICENSE. */
export const params=[{"key": "V", "symbol": "V", "label": "Tegangan sumber", "unit": "V", "min": 0, "max": 24, "step": 1, "def": 12, "desc": "Sumber DC ideal."}, {"key": "R1", "symbol": "R₁", "label": "Hambatan pertama", "unit": "Ω", "min": 1, "max": 100, "step": 1, "def": 10, "desc": "Resistor ohmik, suhu tetap."}, {"key": "R2", "symbol": "R₂", "label": "Hambatan kedua", "unit": "Ω", "min": 1, "max": 100, "step": 1, "def": 20, "desc": "Kabel dianggap tanpa hambatan."}, {"key": "mode", "type": "select", "label": "Susunan", "def": "series", "options": [{"value": "series", "label": "Seri"}, {"value": "parallel", "label": "Paralel"}], "desc": "Dua resistor ideal."}];

export const duration=()=>10,check=()=>null;
export const columns=[{key:'t',label:'t',unit:'s',dec:2},{key:'I',label:'I total',unit:'A',dec:3},{key:'Q',label:'Muatan lewat',unit:'C',dec:3},{key:'E',label:'Energi',unit:'J',dec:2}];
export function quantities(p){const R=p.mode==='series'?p.R1+p.R2:p.R1*p.R2/(p.R1+p.R2),I=p.V/R;return {R,I,P:p.V*I,I1:p.mode==='series'?I:p.V/p.R1,I2:p.mode==='series'?I:p.V/p.R2}}
export function at(p,t){const {I,P}=quantities(p);return {t,I,Q:I*t,E:P*t}}
export const results=p=>{const q=quantities(p);return [{key:'R',label:'Hambatan pengganti',symbol:'R',unit:'Ω',value:q.R},{key:'I',label:'Arus total',symbol:'I',unit:'A',value:q.I},{key:'P',label:'Daya total',symbol:'P',unit:'W',value:q.P}]};
