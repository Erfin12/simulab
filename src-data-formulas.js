/* © 2026 Erfin. All rights reserved. See LICENSE. */
// Perpustakaan rumus. Contoh soal dihitung langsung oleh fungsi f(), jadi angkanya tidak diketik manual.
export const FORMULA_CATS = ['Gerak', 'Gaya', 'Energi', 'Gelombang', 'Listrik', 'Fluida', 'Matematika', 'Kimia', 'Biologi'];
const F = (cat, name, eq, symbols, q, f, unit, sim, dec = 2) => ({ cat, name, eq, symbols, ex: { q, f, unit, dec }, sim });
export const FORMULAS = [
  F('Gerak', 'Kecepatan rata-rata', 'v̄ = Δx / t', [['v̄', 'kecepatan rata-rata', 'm/s'], ['Δx', 'perpindahan', 'm'], ['t', 'selang waktu', 's']], 'Benda berpindah 120 m dalam 15 s. Kecepatan rata-ratanya?', () => 120 / 15, 'm/s', 'linear-motion'),
  F('Gerak', 'Kecepatan GLBB', 'v = v<sub>0</sub> + a·t', [['v', 'kecepatan akhir', 'm/s'], ['v₀', 'kecepatan awal', 'm/s'], ['a', 'percepatan', 'm/s²'], ['t', 'waktu', 's']], 'Mobil 5 m/s dipercepat 2 m/s² selama 3 s. Kecepatan akhir?', () => 5 + 2 * 3, 'm/s', 'linear-motion'),
  F('Gerak', 'Posisi GLBB', 'x = x<sub>0</sub> + v<sub>0</sub>·t + ½·a·t²', [['x', 'posisi', 'm'], ['x₀', 'posisi awal', 'm'], ['v₀', 'kecepatan awal', 'm/s'], ['a', 'percepatan', 'm/s²'], ['t', 'waktu', 's']], 'x₀ = 2 m, v₀ = 4 m/s, a = 2 m/s², t = 6 s. Posisi akhir?', () => 2 + 4 * 6 + 0.5 * 2 * 36, 'm', 'linear-motion'),
  F('Gerak', 'Kecepatan tanpa waktu', 'v² = v<sub>0</sub>² + 2·a·Δx', [['v', 'kecepatan akhir', 'm/s'], ['v₀', 'kecepatan awal', 'm/s'], ['a', 'percepatan', 'm/s²'], ['Δx', 'perpindahan', 'm']], 'Dari diam, a = 3 m/s² sejauh 24 m. Kecepatan akhir?', () => Math.sqrt(0 + 2 * 3 * 24), 'm/s', 'linear-motion'),
  F('Gerak', 'Waktu jatuh bebas', 't = √(2h / g)', [['t', 'waktu jatuh', 's'], ['h', 'ketinggian', 'm'], ['g', 'percepatan gravitasi', 'm/s²']], 'Benda jatuh dari 45 m dengan g = 10 m/s². Waktu jatuh?', () => Math.sqrt((2 * 45) / 10), 's', 'free-fall'),
  F('Gaya', 'Hukum II Newton', 'ΣF = m·a', [['ΣF', 'gaya total', 'N'], ['m', 'massa', 'kg'], ['a', 'percepatan', 'm/s²']], 'Benda 5 kg mendapat gaya total 20 N. Percepatannya?', () => 20 / 5, 'm/s²', 'newton-law'),
  F('Gaya', 'Berat', 'w = m·g', [['w', 'berat', 'N'], ['m', 'massa', 'kg'], ['g', 'percepatan gravitasi', 'm/s²']], 'Massa 60 kg di Bumi (g = 9,81 m/s²). Beratnya?', () => 60 * 9.81, 'N', 'free-fall'),
  F('Gaya', 'Gaya gesek', 'f = μ·N', [['f', 'gaya gesek', 'N'], ['μ', 'koefisien gesek', '–'], ['N', 'gaya normal', 'N']], 'μ = 0,2 dan N = 98,1 N. Gaya gesek?', () => 0.2 * 98.1, 'N', 'newton-law'),
  F('Gaya', 'Momentum', 'p = m·v', [['p', 'momentum', 'kg·m/s'], ['m', 'massa', 'kg'], ['v', 'kecepatan', 'm/s']], 'Benda 3 kg bergerak 4 m/s. Momentumnya?', () => 3 * 4, 'kg·m/s', null),
  F('Energi', 'Energi kinetik', 'Ek = ½·m·v²', [['Ek', 'energi kinetik', 'J'], ['m', 'massa', 'kg'], ['v', 'kecepatan', 'm/s']], 'Benda 2 kg bergerak 6 m/s. Energi kinetiknya?', () => 0.5 * 2 * 36, 'J', 'energy'),
  F('Energi', 'Energi potensial gravitasi', 'Ep = m·g·h', [['Ep', 'energi potensial', 'J'], ['m', 'massa', 'kg'], ['g', 'percepatan gravitasi', 'm/s²'], ['h', 'ketinggian', 'm']], 'Benda 2 kg pada 10 m, g = 9,81 m/s². Ep?', () => 2 * 9.81 * 10, 'J', 'energy'),
  F('Energi', 'Energi mekanik', 'Em = Ek + Ep', [['Em', 'energi mekanik', 'J'], ['Ek', 'energi kinetik', 'J'], ['Ep', 'energi potensial', 'J']], 'Ek = 64 J dan Ep = 196,2 J. Em?', () => 64 + 196.2, 'J', 'energy'),
  F('Energi', 'Usaha', 'W = F·s·cos θ', [['W', 'usaha', 'J'], ['F', 'gaya', 'N'], ['s', 'perpindahan', 'm'], ['θ', 'sudut gaya terhadap perpindahan', '°']], 'F = 10 N searah gerak sejauh 5 m. Usaha?', () => 10 * 5 * Math.cos(0), 'J', null),
  F('Energi', 'Daya', 'P = W / t', [['P', 'daya', 'W'], ['W', 'usaha', 'J'], ['t', 'waktu', 's']], 'Usaha 600 J dalam 20 s. Daya?', () => 600 / 20, 'W', null),
  F('Gelombang', 'Cepat rambat', 'v = f·λ', [['v', 'cepat rambat', 'm/s'], ['f', 'frekuensi', 'Hz'], ['λ', 'panjang gelombang', 'm']], 'f = 2 Hz dan λ = 3 m. Cepat rambat?', () => 2 * 3, 'm/s', 'waves'),
  F('Gelombang', 'Periode dan frekuensi', 'T = 1 / f', [['T', 'periode', 's'], ['f', 'frekuensi', 'Hz']], 'Frekuensi 0,5 Hz. Periodenya?', () => 1 / 0.5, 's', 'waves'),
  F('Gelombang', 'Simpangan gelombang', 'y = A·sin(k·x − ω·t)', [['y', 'simpangan', 'm'], ['A', 'amplitudo', 'm'], ['k', 'bilangan gelombang = 2π/λ', 'rad/m'], ['ω', 'frekuensi sudut = 2πf', 'rad/s']], 'A = 1 m, λ = 4 m, f = 0,5 Hz, di x = 1 m, t = 0. Simpangan?', () => Math.sin(((2 * Math.PI) / 4) * 1), 'm', 'waves'),
  F('Gelombang', 'Periode pegas', 'T = 2π·√(m / k)', [['T', 'periode getaran', 's'], ['m', 'massa', 'kg'], ['k', 'konstanta pegas', 'N/m']], 'm = 0,5 kg dan k = 50 N/m. Periode?', () => 2 * Math.PI * Math.sqrt(0.5 / 50), 's', null),
  F('Listrik', 'Hukum Ohm', 'V = I·R', [['V', 'tegangan', 'V'], ['I', 'kuat arus', 'A'], ['R', 'hambatan', 'Ω']], 'I = 2 A dan R = 6 Ω. Tegangan?', () => 2 * 6, 'V', null),
  F('Listrik', 'Daya listrik', 'P = V·I', [['P', 'daya', 'W'], ['V', 'tegangan', 'V'], ['I', 'kuat arus', 'A']], 'V = 220 V dan I = 0,5 A. Daya?', () => 220 * 0.5, 'W', null),
  F('Listrik', 'Hambatan seri', 'R<sub>s</sub> = R<sub>1</sub> + R<sub>2</sub> + …', [['Rs', 'hambatan pengganti seri', 'Ω'], ['R₁, R₂', 'hambatan tiap komponen', 'Ω']], 'R₁ = 4 Ω dan R₂ = 6 Ω seri. Rs?', () => 4 + 6, 'Ω', null),
  F('Listrik', 'Hambatan paralel', '1 / R<sub>p</sub> = 1 / R<sub>1</sub> + 1 / R<sub>2</sub> + …', [['Rp', 'hambatan pengganti paralel', 'Ω'], ['R₁, R₂', 'hambatan tiap cabang', 'Ω']], 'R₁ = 6 Ω dan R₂ = 3 Ω paralel. Rp?', () => 1 / (1 / 6 + 1 / 3), 'Ω', null),
  F('Fluida', 'Tekanan', 'P = F / A', [['P', 'tekanan', 'Pa'], ['F', 'gaya', 'N'], ['A', 'luas bidang', 'm²']], 'Gaya 200 N pada luas 0,5 m². Tekanan?', () => 200 / 0.5, 'Pa', null),
  F('Fluida', 'Tekanan hidrostatik', 'P<sub>h</sub> = ρ·g·h', [['Ph', 'tekanan hidrostatik', 'Pa'], ['ρ', 'massa jenis fluida', 'kg/m³'], ['g', 'percepatan gravitasi', 'm/s²'], ['h', 'kedalaman', 'm']], 'Air (1000 kg/m³) pada kedalaman 5 m, g = 10 m/s². Ph?', () => 1000 * 10 * 5, 'Pa', null),
  F('Fluida', 'Gaya apung (Archimedes)', 'F<sub>A</sub> = ρ·g·V', [['FA', 'gaya apung', 'N'], ['ρ', 'massa jenis fluida', 'kg/m³'], ['g', 'percepatan gravitasi', 'm/s²'], ['V', 'volume benda tercelup', 'm³']], 'Benda 0,002 m³ tercelup penuh di air, g = 10 m/s². Gaya apung?', () => 1000 * 10 * 0.002, 'N', null),
  F('Fluida', 'Massa jenis', 'ρ = m / V', [['ρ', 'massa jenis', 'kg/m³'], ['m', 'massa', 'kg'], ['V', 'volume', 'm³']], 'Massa 2,7 kg, volume 0,001 m³. Massa jenis?', () => 2.7 / 0.001, 'kg/m³', null),
  F('Fluida', 'Persamaan kontinuitas', 'A<sub>1</sub>·v<sub>1</sub> = A<sub>2</sub>·v<sub>2</sub>', [['A', 'luas penampang', 'm²'], ['v', 'kecepatan aliran', 'm/s']], 'A₁ = 4 cm², v₁ = 2 m/s, A₂ = 1 cm². v₂?', () => (4 * 2) / 1, 'm/s', null),
].map((f, i) => ({ ...f, id: 'f' + i }));

FORMULAS.push(
 F('Matematika','Fungsi kuadrat','y = ax² + bx + c',[['a,b,c','koefisien','tanpa satuan'],['x,y','variabel','tanpa satuan']],'a=1, b=-2, c=-3, x=5. Nilai y?',()=>25-10-3,'','quadratic'),
 F('Matematika','Lingkaran trigonometri','x = r cos θ; y = r sin θ',[['r','radius','tanpa satuan'],['θ','sudut','°']],'r=2, θ=90°. Koordinat y?',()=>2*Math.sin(Math.PI/2),'','trigonometry'),
 F('Kimia','Waktu paruh orde satu','t½ = ln(2)/k',[['t½','waktu paruh','s'],['k','konstanta laju','s⁻¹']],'k=0,2 s⁻¹. Waktu paruh?',()=>Math.log(2)/.2,'s','reaction-rate'),
 F('Kimia','Volume ekuivalen','Vₑ = CₐVₐ/Cᵦ',[['Cₐ,Cᵦ','konsentrasi asam/basa','mol/L'],['Vₐ,Vₑ','volume asam/ekuivalen','mL']],'Asam 25 mL 0,1 M, basa 0,1 M. Volume ekuivalen?',()=>.1*25/.1,'mL','titration'),
 F('Biologi','Pertumbuhan logistik','dN/dt = rN(1 − N/K)',[['N,K','populasi / daya dukung','individu'],['r','laju intrinsik','hari⁻¹']],'r=0,3, N=500, K=1000. Laju pertumbuhan?',()=>.3*500*(1-500/1000),'individu/hari','population'),
 F('Biologi','Michaelis-Menten','v = Vmax[S]/(Km + [S])',[['v,Vmax','laju / laju maksimum','µmol/min'],['S,Km','substrat / konstanta Michaelis','mmol/L']],'Vmax=100, Km=2, S=2. Laju awal?',()=>100*2/(2+2),'µmol/min','enzyme')
);
