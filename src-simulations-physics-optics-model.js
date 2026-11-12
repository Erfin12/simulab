/* © 2026 Erfin. All rights reserved. See LICENSE. */
export const params=[{"key": "f", "symbol": "f", "label": "Jarak fokus", "unit": "cm", "min": 5, "max": 40, "step": 1, "def": 15, "desc": "Lensa tipis cembung."}, {"key": "d", "symbol": "dₒ", "label": "Jarak benda", "unit": "cm", "min": 5, "max": 120, "step": 1, "def": 45, "desc": "Jarak diukur dari pusat lensa."}, {"key": "height", "symbol": "hₒ", "label": "Tinggi benda", "unit": "cm", "min": 1, "max": 10, "step": 1, "def": 5, "desc": "Tinggi positif di atas sumbu."}];

export const duration=()=>8;
export const check=p=>Math.abs(p.d-p.f)<0.5?'Benda di fokus: bayangan di tak hingga. Geser jarak benda minimal 0,5 cm dari fokus.':null;
export const columns=[{key:'t',label:'Waktu jejak',unit:'s',dec:2},{key:'di',label:'Jarak bayangan',unit:'cm',dec:2},{key:'m',label:'Perbesaran',unit:'',dec:3},{key:'hi',label:'Tinggi bayangan',unit:'cm',dec:2}];
export function at(p,t){const di=p.f*p.d/(p.d-p.f),m=-di/p.d;return {t,di,m,hi:m*p.height}}
export const results=p=>{const s=at(p,8);return [{key:'di',label:'Jarak bayangan',symbol:'dᵢ',unit:'cm',value:s.di},{key:'m',label:'Perbesaran bertanda',symbol:'M',unit:'',value:s.m},{key:'hi',label:'Tinggi bayangan',symbol:'hᵢ',unit:'cm',value:s.hi}]};
