/* © 2026 Erfin. All rights reserved. See LICENSE. */
// Eksperimen siap pakai: membuka simulasi dengan nilai parameter yang sudah diatur.
export const PRESETS = [
  { id: 'glb-5', sim: 'linear-motion', title: 'GLB: kecepatan tetap 5 m/s', desc: 'Percepatan nol. Grafik x–t lurus, v–t mendatar.', level: 'Mudah', params: { x0: 0, v: 5, a: 0, T: 10 } },
  { id: 'glbb-start', sim: 'linear-motion', title: 'GLBB: mulai dari diam', desc: 'Percepatan 2 m/s². Grafik x–t melengkung.', level: 'Mudah', params: { x0: 0, v: 0, a: 2, T: 8 } },
  { id: 'glbb-brake', sim: 'linear-motion', title: 'GLBB: pengereman', desc: 'Mobil 20 m/s direm 4 m/s² dan berhenti pada t = 5 s.', level: 'Menengah', params: { x0: 0, v: 20, a: -4, T: 5 } },
  { id: 'glbb-turn', sim: 'linear-motion', title: 'Benda berbalik arah', desc: 'Perpindahan nol, tetapi jarak tempuh tidak nol.', level: 'Lanjut', params: { x0: 0, v: 10, a: -4, T: 5 } },
  { id: 'ff-earth', sim: 'free-fall', title: 'Jatuh di Bumi dari 20 m', desc: 'g = 9,81 m/s². Benda 1 kg dan pembanding 1 kg.', level: 'Mudah', params: { h: 20, g: 9.81, m: 1 } },
  { id: 'ff-heavy', sim: 'free-fall', title: 'Benda berat vs ringan', desc: 'Massa 100 kg melawan 1 kg: tetap jatuh bersamaan.', level: 'Mudah', params: { h: 20, g: 9.81, m: 100 } },
  { id: 'ff-moon', sim: 'free-fall', title: 'Jatuh di Bulan', desc: 'g = 1,62 m/s²: jatuh lebih lambat.', level: 'Mudah', params: { h: 20, g: 1.62, m: 1 } },
  { id: 'ff-mars', sim: 'free-fall', title: 'Jatuh di Mars', desc: 'g = 3,71 m/s².', level: 'Menengah', params: { h: 20, g: 3.71, m: 1 } },
  { id: 'ff-jupiter', sim: 'free-fall', title: 'Jatuh di Jupiter', desc: 'g = 24,79 m/s²: waktu jatuh sangat singkat.', level: 'Menengah', params: { h: 100, g: 24.79, m: 1 } },
  { id: 'nw-smooth', sim: 'newton-law', title: 'Dorong di lantai licin', desc: 'm = 5 kg, F = 20 N, tanpa gesekan: a = 4 m/s².', level: 'Mudah', params: { m: 5, F: 20, mu: 0, T: 6 } },
  { id: 'nw-friction', sim: 'newton-law', title: 'Dorong dengan gesekan', desc: 'm = 10 kg, F = 60 N, μ = 0,2.', level: 'Menengah', params: { m: 10, F: 60, mu: 0.2, T: 5 } },
  { id: 'nw-stuck', sim: 'newton-law', title: 'Gaya tidak cukup (Hukum I)', desc: 'F lebih kecil dari gesekan maksimum: benda diam.', level: 'Menengah', params: { m: 10, F: 10, mu: 0.2, T: 5 } },
  { id: 'nw-light', sim: 'newton-law', title: 'Benda ringan, gaya sama', desc: 'm = 1 kg, F = 20 N: percepatan besar.', level: 'Mudah', params: { m: 1, F: 20, mu: 0, T: 4 } },
  { id: 'en-drop', sim: 'energy', title: 'Benda dilepas dari 20 m', desc: 'Ep berubah penuh menjadi Ek.', level: 'Mudah', params: { m: 1, h0: 20, v0: 0, g: 9.81 } },
  { id: 'en-throw', sim: 'energy', title: 'Lemparan dari tanah', desc: 'Mulai dengan Ek penuh, naik sampai Ek = 0.', level: 'Menengah', params: { m: 1, h0: 0, v0: 15, g: 9.81 } },
  { id: 'en-roof', sim: 'energy', title: 'Dilempar dari atap', desc: 'Ek dan Ep awal sama-sama tidak nol.', level: 'Menengah', params: { m: 2, h0: 10, v0: 8, g: 9.81 } },
  { id: 'en-moon', sim: 'energy', title: 'Lemparan di Bulan', desc: 'g kecil: benda naik jauh lebih tinggi.', level: 'Lanjut', params: { m: 1, h0: 0, v0: 10, g: 1.62 } },
  { id: 'wv-default', sim: 'waves', title: 'Gelombang dasar', desc: 'f = 0,5 Hz, λ = 4 m, v = 2 m/s.', level: 'Mudah', params: { A: 1, f: 0.5, lambda: 4, mode: 'v', xp: 5 } },
  { id: 'wv-high', sim: 'waves', title: 'Frekuensi tinggi', desc: 'f = 2 Hz, λ = 1,5 m: gelombang rapat dan cepat bergetar.', level: 'Menengah', params: { A: 0.8, f: 2, lambda: 1.5, mode: 'v', xp: 5 } },
  { id: 'wv-medium', sim: 'waves', title: 'Medium sama, frekuensi berubah', desc: 'v tetap 3 m/s, λ dihitung dari f.', level: 'Lanjut', params: { A: 1, f: 1, v: 3, mode: 'lambda', xp: 5 } },
{"id": "circuits-0", "sim": "circuits", "title": "Seri 12 V", "desc": "Baca batas model pada materi.", "level": "Menengah", "params": {"V": 12, "R1": 10, "R2": 20, "mode": "series"}},
{"id": "circuits-1", "sim": "circuits", "title": "Paralel 12 V", "desc": "Baca batas model pada materi.", "level": "Menengah", "params": {"V": 12, "R1": 10, "R2": 20, "mode": "parallel"}},
{"id": "optics-2", "sim": "optics", "title": "Benda di dua fokus", "desc": "Baca batas model pada materi.", "level": "Menengah", "params": {"f": 15, "d": 30, "height": 5}},
{"id": "optics-3", "sim": "optics", "title": "Bayangan maya", "desc": "Baca batas model pada materi.", "level": "Menengah", "params": {"f": 15, "d": 10, "height": 5}},
{"id": "archimedes-4", "sim": "archimedes", "title": "Benda ringan di air", "desc": "Baca batas model pada materi.", "level": "Menengah", "params": {"rho": 1000, "body": 800, "volume": 2, "fraction": 100, "g": 9.8}},
{"id": "archimedes-5", "sim": "archimedes", "title": "Benda lebih rapat", "desc": "Baca batas model pada materi.", "level": "Menengah", "params": {"rho": 1000, "body": 2000, "volume": 2, "fraction": 100, "g": 9.8}},
{"id": "expansion-6", "sim": "expansion", "title": "Baja ideal dipanaskan", "desc": "Baca batas model pada materi.", "level": "Menengah", "params": {"L0": 1, "alpha": 12, "T0": 20, "Tf": 120}},
{"id": "expansion-7", "sim": "expansion", "title": "Batang didinginkan", "desc": "Baca batas model pada materi.", "level": "Menengah", "params": {"L0": 1, "alpha": 24, "T0": 80, "Tf": 20}}
];

PRESETS.push(
{"id": "quad-bowl", "sim": "quadratic", "title": "Parabola ke atas", "desc": "Puncak di (1, -4).", "level": "Menengah", "params": {"a": 1, "b": -2, "c": -3, "R": 5}},
{"id": "quad-linear", "sim": "quadratic", "title": "Batas linear", "desc": "a = 0: turunan konstan.", "level": "Menengah", "params": {"a": 0, "b": 2, "c": 1, "R": 5}},
{"id": "trig-quarter", "sim": "trigonometry", "title": "Seperempat putaran", "desc": "Sudut 90°: sin = 1.", "level": "Menengah", "params": {"r": 1, "angle": 90}},
{"id": "trig-two", "sim": "trigonometry", "title": "Dua putaran", "desc": "Lihat periodisitas 360°.", "level": "Menengah", "params": {"r": 1, "angle": 720}},
{"id": "rate-fast", "sim": "reaction-rate", "title": "Reaksi cepat", "desc": "k = 0,5 s⁻¹.", "level": "Menengah", "params": {"C0": 1, "k": 0.5, "T": 10}},
{"id": "rate-slow", "sim": "reaction-rate", "title": "Reaksi lambat", "desc": "k = 0,05 s⁻¹.", "level": "Menengah", "params": {"C0": 1, "k": 0.05, "T": 20}},
{"id": "tit-neutral", "sim": "titration", "title": "Berhenti di ekuivalen", "desc": "25 mL asam dan basa sama konsentrasi.", "level": "Menengah", "params": {"Ca": 0.1, "Va": 25, "Cb": 0.1, "Vmax": 25}},
{"id": "tit-excess", "sim": "titration", "title": "Basa berlebih", "desc": "Amati lonjakan pH setelah ekuivalen.", "level": "Menengah", "params": {"Ca": 0.1, "Va": 25, "Cb": 0.1, "Vmax": 50}},
{"id": "pop-balanced", "sim": "population", "title": "Populasi seimbang", "desc": "N₀ = K: tidak bertambah.", "level": "Menengah", "params": {"N0": 500, "K": 500, "r": 0.3, "T": 20}},
{"id": "pop-decline", "sim": "population", "title": "Di atas daya dukung", "desc": "Populasi menurun menuju K.", "level": "Menengah", "params": {"N0": 500, "K": 200, "r": 0.3, "T": 15}},
{"id": "enz-half", "sim": "enzyme", "title": "Titik setengah maksimum", "desc": "[S] = Km: v = Vmax/2.", "level": "Menengah", "params": {"Vmax": 100, "Km": 2, "Smax": 2}},
{"id": "enz-saturated", "sim": "enzyme", "title": "Menuju jenuh", "desc": "Substrat banyak, enzim mendekati Vmax.", "level": "Menengah", "params": {"Vmax": 100, "Km": 1, "Smax": 30}}
);
