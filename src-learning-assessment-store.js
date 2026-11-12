/* © 2026 Erfin. All rights reserved. See LICENSE. */
import * as store from './src-storage-db.js';
let bankPromise;
export const getBank=()=>bankPromise||(bankPromise=fetch('./src-data-questions.json').then(r=>{if(!r.ok)throw Error('Bank soal tidak tersedia');return r.json()}));
const KEY='classroom:works';
export async function readWorks(){const a=await store.getSetting(KEY,[]);return Array.isArray(a)?a:[]}
export const writeWorks=a=>store.setSetting(KEY,a.slice(-500));
export async function validateWork(x){const bank=await getBank();return !!(x&&x.schema==='simulab-work-3'&&typeof x.id==='string'&&x.id.length<100&&bank[x.simId]&&typeof x.alias==='string'&&x.alias.length<=50&&typeof x.group==='string'&&x.group.length<=50&&typeof x.prediction==='string'&&x.prediction.length<=1200&&typeof x.explanation==='string'&&x.explanation.length<=1200&&Number.isInteger(x.score)&&x.score>=0&&x.score<=2&&x.total===2&&typeof x.date==='string'&&x.date.length<60&&Array.isArray(x.answers)&&x.answers.length===2&&x.answers.every(n=>Number.isInteger(n)&&n>=0&&n<3)&&x.score===bank[x.simId].reduce((s,q,i)=>s+(q[2]===x.answers[i]?1:0),0)&&Array.isArray(x.observation)&&x.observation.length<30&&x.observation.every(r=>typeof r.label==='string'&&r.label.length<100&&Number.isFinite(r.value)&&typeof r.unit==='string'&&r.unit.length<30))}
