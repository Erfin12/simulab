/* © 2026 Erfin. All rights reserved. See LICENSE. */
export function num(v, d = 2) {
  if (v === null || v === undefined || !Number.isFinite(v)) return '–';
  if (Object.is(v, -0)) v = 0;
  return v.toLocaleString('id-ID', { minimumFractionDigits: 0, maximumFractionDigits: d });
}
export function fixed(v, d = 3) { // untuk CSV: titik desimal
  if (!Number.isFinite(v)) return '';
  const r = Number(v.toFixed(d));
  return String(Object.is(r, -0) ? 0 : r);
}
export function dur(sec) {
  sec = Math.max(0, Math.round(sec));
  if (sec < 60) return sec + ' dtk';
  const m = Math.floor(sec / 60);
  if (m < 60) return m + ' mnt ' + (sec % 60) + ' dtk';
  return Math.floor(m / 60) + ' j ' + (m % 60) + ' mnt';
}
export function dateTime(ts) {
  return new Date(ts).toLocaleString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}
export function dateStamp(ts = Date.now()) {
  const d = new Date(ts); const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}-${p(d.getHours())}${p(d.getMinutes())}`;
}
export function csvCell(v) {
  const s = String(v ?? '');
  return /[",\n;]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
}
