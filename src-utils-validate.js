/* © 2026 Erfin. All rights reserved. See LICENSE. */
// Validasi nilai masukan terhadap definisi parameter ({min,max,def,...}).
export function parseInput(raw, def) {
  if (typeof raw === 'string') raw = raw.trim().replace(',', '.');
  if (raw === '' || raw === null || raw === undefined) return { ok: false, msg: 'Isi angka terlebih dahulu.' };
  const v = Number(raw);
  if (!Number.isFinite(v)) return { ok: false, msg: 'Masukan bukan angka yang valid.' };
  if (v < def.min) return { ok: true, value: def.min, clamped: true, msg: `Dibatasi ke nilai minimum ${def.min} ${def.unit}.` };
  if (v > def.max) return { ok: true, value: def.max, clamped: true, msg: `Dibatasi ke nilai maksimum ${def.max} ${def.unit}.` };
  return { ok: true, value: v };
}
export function defaults(params) {
  const o = {};
  for (const d of params) o[d.key] = d.def;
  return o;
}
// Membersihkan objek parameter (mis. dari penyimpanan/URL): angka tidak valid kembali ke default.
export function sanitize(params, raw) {
  const o = defaults(params);
  if (!raw || typeof raw !== 'object') return o;
  for (const d of params) {
    if (!(d.key in raw)) continue;
    if (d.type === 'select') { if (d.options.some((x) => x.value === raw[d.key])) o[d.key] = raw[d.key]; continue; }
    const r = parseInput(raw[d.key], d);
    if (r.ok) o[d.key] = r.value;
  }
  return o;
}
export function niceStep(dur) {
  const steps = [0.05, 0.1, 0.2, 0.25, 0.5, 1, 2, 5, 10];
  if (!Number.isFinite(dur)) return 0.25;
  const want = dur / 20;
  return steps.find((s) => s >= want) || 10;
}
