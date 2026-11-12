/* © 2026 Erfin. All rights reserved. See LICENSE. */
import {h,toast} from './src-utils-dom.js';
import * as store from './src-storage-db.js';
export const normalizeScale=value=>Math.min(2,Math.max(1,Number(value)||1));
let current={scale:1,contrast:false};
export function applyAccessibility(prefs){current={scale:normalizeScale(prefs?.scale),contrast:prefs?.contrast===true};const root=document.documentElement;root.style.setProperty('--font-scale',String(current.scale));root.dataset.contrast=current.contrast?'high':'normal';root.dataset.largeText=current.scale>=1.5?'true':'false';window.dispatchEvent(new Event('themechange'));window.dispatchEvent(new Event('resize'))}
export async function initAccessibility(){try{applyAccessibility(await store.getSetting('accessibility',{scale:1,contrast:false}))}catch{applyAccessibility(current)}}
export function accessibilityPanel(){
 const output=h('output',{'aria-live':'polite'},Math.round(current.scale*100)+'%');
 const range=h('input',{id:'font-scale',type:'range',min:1,max:2,step:.1,value:current.scale,'aria-label':'Skala ukuran huruf'});
 const contrast=h('input',{id:'high-contrast',type:'checkbox',checked:current.contrast});
 let timer;function change(){applyAccessibility({scale:range.value,contrast:contrast.checked});output.textContent=Math.round(current.scale*100)+'%';clearTimeout(timer);timer=setTimeout(()=>store.setSetting('accessibility',{...current}).catch(()=>toast('Pengaturan gagal disimpan.','warn')),250)}
 range.addEventListener('input',change);contrast.addEventListener('change',change);
 const reset=h('button',{class:'btn',type:'button',onclick:()=>{range.value=1;contrast.checked=false;change()}},'Reset ukuran & kontras');
 return h('section',{class:'card doc accessibility-panel'},h('h3',null,'Aksesibilitas'),h('label',{for:'font-scale'},'Ukuran huruf 100%-200%'),h('div',{class:'row-gap wrap'},range,output),h('label',{class:'a11y-check',for:'high-contrast'},contrast,'Kontras tinggi'),h('p',{class:'muted small'},'Tab untuk berpindah. Enter atau Spasi untuk tombol. Di slider: panah untuk mengubah nilai, Enter/Spasi untuk menaikkan satu langkah, Shift+Spasi untuk menurunkan. Ukuran dan kontras disimpan di perangkat ini.'),h('p',{class:'muted small'},'Tombol Bacakan ada pada halaman simulasi. Suara memakai Web Speech API dan bergantung suara lokal yang terpasang. Dukungan tidak sama di setiap perangkat.'),reset);
}
// Slider native sudah mendukung panah/Home/End. Tambahan Enter/Spasi tidak
// mengganti semantik native, dan tidak menelan Spasi pada tombol atau textarea.
export function installRangeKeys(){const handler=e=>{const el=e.target;if(!(el instanceof HTMLInputElement)||el.type!=='range'||el.disabled||![' ','Enter'].includes(e.key))return;e.preventDefault();const step=Number(el.step)||1;el.value=String(Math.max(Number(el.min)||0,Math.min(Number(el.max)||100,Number(el.value)+(e.shiftKey?-step:step))));el.dispatchEvent(new Event('input',{bubbles:true}));el.dispatchEvent(new Event('change',{bubbles:true}))};document.addEventListener('keydown',handler);return ()=>document.removeEventListener('keydown',handler)}
