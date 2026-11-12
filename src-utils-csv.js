/* © 2026 Erfin. All rights reserved. See LICENSE. */
import { csvCell, fixed } from './src-utils-format.js';
// CSV dari eksperimen tersimpan: blok metadata + parameter + hasil, lalu tabel pengamatan. Semua angka berasal dari data eksperimen.
export function buildCsv(rec, paramDefs) {
  const L = []; const line = (...c) => L.push(c.map(csvCell).join(','));
  line('SIMULAB', 'Laporan eksperimen'); line('Nama', rec.name); line('Simulasi', rec.simTitle); line('Tanggal', new Date(rec.createdAt).toISOString());
  line(); line('Parameter', 'Simbol', 'Nilai', 'Satuan');
  for (const d of paramDefs) line(d.label, d.symbol || '', d.type === 'select' ? rec.params[d.key] : fixed(rec.params[d.key], 6), d.unit || '');
  line(); line('Hasil perhitungan', 'Simbol', 'Nilai', 'Satuan');
  for (const r of rec.results || []) line(r.label, r.symbol, fixed(r.value, 6), r.unit);
  line(); line('Tabel pengamatan');
  if (rec.observations && rec.observations.length) {
    line(...rec.columns.map((c) => c.label + (c.unit ? ` (${c.unit})` : '')));
    for (const o of rec.observations) line(...rec.columns.map((c) => fixed(o[c.key], 6)));
  } else line('(belum ada data pengamatan: simulasi tidak dijalankan sebelum disimpan)');
  return '\ufeff' + L.join('\r\n') + '\r\n';
}
