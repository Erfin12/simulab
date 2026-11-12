/* © 2026 Erfin. All rights reserved. See LICENSE. */
// Penyimpanan lokal (IndexedDB). Data hanya ada di perangkat ini dan tidak disinkronkan.
// Jika IndexedDB tidak tersedia (mis. mode privat tertentu), jatuh ke memori dan memberi tahu pengguna.
const DB_NAME = 'simulab', DB_VER = 1;
const STORES = { experiments: { keyPath: 'id' }, progress: { keyPath: 'simId' }, activity: { keyPath: 'id', autoIncrement: true }, favorites: { keyPath: 'key' }, settings: { keyPath: 'key' } };
let dbp = null; export let persistent = true;
const mem = Object.fromEntries(Object.keys(STORES).map((s) => [s, new Map()])); let memId = 1;

function open() {
  if (dbp) return dbp;
  dbp = new Promise((res) => {
    try {
      const rq = indexedDB.open(DB_NAME, DB_VER);
      rq.onupgradeneeded = () => { const db = rq.result; for (const [n, o] of Object.entries(STORES)) if (!db.objectStoreNames.contains(n)) db.createObjectStore(n, o); };
      rq.onsuccess = () => res(rq.result);
      rq.onerror = () => { persistent = false; res(null); };
      rq.onblocked = () => { persistent = false; res(null); };
    } catch { persistent = false; res(null); }
  });
  return dbp;
}
function tx(store, mode, fn) {
  return open().then((db) => {
    if (!db) return memOp(store, fn);
    return new Promise((res, rej) => {
      const t = db.transaction(store, mode); const st = t.objectStore(store); let out;
      try { out = fn(st); } catch (e) { rej(e); return; }
      t.oncomplete = () => res(out && 'result' in out ? out.result : out);
      t.onerror = () => rej(t.error); t.onabort = () => rej(t.error);
    });
  });
}
// Operasi memori meniru API objectStore minimal yang kita pakai.
function memOp(store, fn) {
  const m = mem[store], kp = STORES[store].keyPath;
  const fake = {
    put: (v) => { if (STORES[store].autoIncrement && v[kp] == null) v[kp] = memId++; m.set(v[kp], structuredClone(v)); return { result: v[kp] }; },
    add: (v) => fake.put(v), delete: (k) => { m.delete(k); return {}; }, clear: () => { m.clear(); return {}; },
    get: (k) => ({ result: m.has(k) ? structuredClone(m.get(k)) : undefined }),
    getAll: () => ({ result: [...m.values()].map((v) => structuredClone(v)) }),
  };
  const o = fn(fake); return Promise.resolve(o && 'result' in o ? o.result : o);
}
const reqVal = (r) => (r && typeof r === 'object' && 'result' in r ? r : r);
const p = (store, mode, fn) => tx(store, mode, (s) => { const r = fn(s); return r; });

export async function init() { await open(); return persistent; }
export const getAll = (store) => tx(store, 'readonly', (s) => s.getAll());
export const get = (store, key) => tx(store, 'readonly', (s) => s.get(key));
export const put = (store, val) => tx(store, 'readwrite', (s) => s.put(val));
export const del = (store, key) => tx(store, 'readwrite', (s) => s.delete(key));
export const clearStore = (store) => tx(store, 'readwrite', (s) => s.clear());

// ---- Pengaturan
export async function getSetting(key, def) { const r = await get('settings', key); return r ? r.value : def; }
export const setSetting = (key, value) => put('settings', { key, value });

// ---- Eksperimen tersimpan
const uid = () => 'exp-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
export async function saveExperiment(e) { const rec = { ...e, id: e.id || uid(), createdAt: e.createdAt || Date.now() }; await put('experiments', rec); await logActivity('save', rec.simId, rec.name); return rec; }
export async function listExperiments() { return (await getAll('experiments')).sort((a, b) => b.createdAt - a.createdAt); }
export const getExperiment = (id) => get('experiments', id);
export async function deleteExperiment(id, name) { await del('experiments', id); await logActivity('delete', null, name); }

// ---- Favorit
export async function listFavorites() { return (await getAll('favorites')).map((f) => f.key); }
export async function toggleFavorite(key) { const cur = await get('favorites', key); if (cur) { await del('favorites', key); return false; } await put('favorites', { key }); return true; }

// ---- Progres per simulasi
const emptyProgress = (simId) => ({ simId, opened: 0, runs: 0, challenges: [], seconds: 0, lastAt: 0, firstAt: 0 });
export async function getProgress(simId) { return (await get('progress', simId)) || emptyProgress(simId); }
export const allProgress = () => getAll('progress');
export async function updateProgress(simId, fn) { const cur = await getProgress(simId); fn(cur); cur.lastAt = Date.now(); if (!cur.firstAt) cur.firstAt = cur.lastAt; await put('progress', cur); return cur; }

// ---- Aktivitas
export async function logActivity(type, simId, label) {
  await put('activity', { type, simId: simId || null, label: label || '', ts: Date.now() });
  const all = await getAll('activity');
  if (all.length > 300) { all.sort((a, b) => a.ts - b.ts); for (const a of all.slice(0, all.length - 300)) await del('activity', a.id); }
}
export async function listActivity(limit = 50) { return (await getAll('activity')).sort((a, b) => b.ts - a.ts).slice(0, limit); }

// ---- Cadangan / pemulihan seluruh data
export async function exportAll() {
  const out = { app: 'SIMULAB', version: 1, exportedAt: new Date().toISOString() };
  for (const s of Object.keys(STORES)) out[s] = await getAll(s);
  return out;
}
export async function importAll(data) {
  if (!data || data.app !== 'SIMULAB' || typeof data !== 'object') throw new Error('Berkas bukan cadangan SIMULAB.');
  let n = 0;
  for (const s of ['experiments', 'progress', 'favorites', 'settings', 'activity']) {
    if (!Array.isArray(data[s])) continue;
    for (const rec of data[s]) { if (rec && typeof rec === 'object') { if (s === 'activity') delete rec.id; await put(s, rec); n++; } }
  }
  return n;
}
export async function wipe() { for (const s of Object.keys(STORES)) await clearStore(s); }
