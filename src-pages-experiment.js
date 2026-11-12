/* © 2026 Erfin. All rights reserved. See LICENSE. */
import {makeAssessment} from './src-learning-assessment.js';
import {createPoe} from './src-learning-poe-ui.js';
import {speechControls} from './src-accessibility-speech.js';
import { h, esc, clear, toast, modal } from './src-utils-dom.js';
import { num, dateTime, dateStamp } from './src-utils-format.js';
import { parseInput, defaults, sanitize, niceStep } from './src-utils-validate.js';
import { SimRunner } from './src-engines-engine.js';
import { Chart, sample } from './src-charts-chart.js';
import { fit, theme } from './src-charts-canvas.js';
import * as store from './src-storage-db.js';
import { icon } from './src-components-icons.js';
import { simById } from './src-data-registry.js';
import { PRESETS } from './src-data-presets.js';

const MAX_ROWS = 200, MAX_COMPARE = 5;

export async function render(ctx) {
  const meta = simById(ctx.segs[0]);
  if (!meta) return ctx.notFound();
  const def = (await meta.load()).default; const model = def.model;
  const paramDefs = model.params; const infinite = !!model.infinite;
  let p = defaults(paramDefs); let loadedNote = null; let rows = []; let nextK = 0;
  if (ctx.query.get('preset')) { const pr = PRESETS.find((x) => x.id === ctx.query.get('preset') && x.sim === meta.id); if (pr) { p = sanitize(paramDefs, { ...p, ...pr.params }); loadedNote = `Eksperimen siap pakai dimuat: ${pr.title}.`; } }
  if (ctx.query.get('load')) { const rec = await store.getExperiment(ctx.query.get('load')); if (rec && rec.simId === meta.id) { p = sanitize(paramDefs, rec.params); rows = Array.isArray(rec.observations) ? rec.observations.slice(0, MAX_ROWS) : []; loadedNote = `Dimuat dari simpanan "${rec.name}" (${dateTime(rec.createdAt)}). Tabel pengamatan di bawah adalah data tersimpan.`; } }

  let poe=null; let th = theme(); let completed = false; let compares = []; let progress = await store.getProgress(meta.id);
  const doneChallenges = new Set(progress.challenges || []);
  store.updateProgress(meta.id, (x) => { x.opened++; }); store.logActivity('open', meta.id, def.title);
  const stepSize = () => (infinite ? 0.25 : niceStep(model.duration(p)));
  const resultsObj = () => Object.fromEntries(model.results(p).map((r) => [r.key, r.value]));
  const err = () => model.check(p);

  // ---------- Elemen dasar
  const canvas = h('canvas', { class: 'viz', role: 'img', 'aria-label': `Visualisasi simulasi ${def.title}` });
  const alertBox = h('div', { class: 'alert warn', role: 'alert', hidden: true });
  const btnStart = h('button', { class: 'btn btn-primary', type: 'button' }, icon('play', 18), h('span', null, 'Start'));
  const btnPause = h('button', { class: 'btn', type: 'button', disabled: true }, icon('pause', 18), h('span', null, 'Pause'));
  const btnReset = h('button', { class: 'btn', type: 'button' }, icon('reset', 18), h('span', null, 'Reset'));
  const speedSel = h('select', { 'aria-label': 'Kecepatan simulasi', class: 'select-sm' }, [0.25, 0.5, 1, 2].map((v) => h('option', { value: v, selected: v === 1 }, v + '×')));
  const live = h('div', { class: 'tiles', 'aria-live': 'off' });
  const liveVals = {};
  for (const c of model.columns) { const v = h('b', null, '–'); liveVals[c.key] = v; live.append(h('div', { class: 'tile' }, h('span', { class: 'tile-l' }, c.label + (c.unit ? ` (${c.unit})` : '')), v)); }
  const statusEl = h('span', { class: 'chip', id: 'sim-status' }, 'Siap');

  const timeline = h('input', {type:'range',id:'sim-timeline',min:0,max:1000,step:1,value:0,'aria-label':'Jelajah waktu simulasi'});
  const timeLabel = h('span', {class:'muted small'}, '0%');
  timeline.addEventListener('input',()=>{
    if(err() || !poe?.canStart && poe?.state!=='kesimpulan') return; poe.reopen(); rows=[];nextK=0;completed=false;renderTable();
    const D=Number.isFinite(model.duration(p))?model.duration(p):Math.max(4,2/model.effective(p).f);
    runner.seek(D*Number(timeline.value)/1000); renderResults();
    noteEl.hidden=false; noteEl.textContent='Jelajah waktu: tabel dihitung ulang dari model sampai titik ini, bukan pengukuran dunia nyata.';
  });
  function downloadCanvas(cv,name){
    const out=document.createElement('canvas');out.width=cv.width;out.height=cv.height;
    const c=out.getContext('2d');c.fillStyle=th.card;c.fillRect(0,0,out.width,out.height);c.drawImage(cv,0,0);
    out.toBlob(blob=>{if(!blob){toast('Gagal membuat gambar.','bad');return}const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name+'.png';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)});
  }
  // ---------- Kontrol variabel
  const ctlWrap = h('div', { class: 'controls' }); const inputs = {};
  for (const d of paramDefs) {
    const msg = h('small', { class: 'ctl-msg', role: 'status' });
    let row;
    if (d.type === 'select') {
      const sel = h('select', { id: 'c-' + d.key, 'aria-label': d.label }, d.options.map((o) => h('option', { value: o.value, selected: o.value === p[d.key] }, o.label)));
      sel.addEventListener('change', () => { p[d.key] = sel.value; syncDisabled(); changed(); });
      inputs[d.key] = { sel, msg };
      row = h('div', { class: 'ctl' }, h('label', { for: 'c-' + d.key, class: 'ctl-l' }, h('span', null, d.label)), sel, h('small', { class: 'ctl-d' }, d.desc));
    } else {
      const rng = h('input', { type: 'range', min: d.min, max: d.max, step: d.step, value: p[d.key], 'aria-label': d.label + ' (penggeser)' });
      const numIn = h('input', { type: 'text', inputmode: 'decimal', value: String(p[d.key]).replace('.', ','), id: 'c-' + d.key, 'aria-label': d.label, class: 'num-in', autocomplete: 'off' });
      rng.addEventListener('input', () => { p[d.key] = Number(rng.value); numIn.value = String(p[d.key]).replace('.', ','); numIn.classList.remove('invalid'); msg.textContent = ''; changed(); });
      const commit = () => {
        const r = parseInput(numIn.value, d);
        if (!r.ok) { numIn.classList.add('invalid'); msg.textContent = r.msg + ' Nilai sebelumnya dipertahankan.'; return; }
        numIn.classList.remove('invalid'); msg.textContent = r.clamped ? r.msg : ''; p[d.key] = r.value; rng.value = r.value; numIn.value = String(r.value).replace('.', ','); changed();
      };
      numIn.addEventListener('change', commit); numIn.addEventListener('keydown', (e) => { if (e.key === 'Enter') commit(); });
      inputs[d.key] = { rng, numIn, msg };
      row = h('div', { class: 'ctl' }, h('label', { for: 'c-' + d.key, class: 'ctl-l' }, h('span', null, h('b', { class: 'sym' }, d.symbol), ' ' + d.label), h('span', { class: 'unit' }, d.unit)), h('div', { class: 'ctl-in' }, rng, numIn), h('small', { class: 'ctl-d' }, `${d.desc} (${d.min} – ${d.max} ${d.unit})`), msg);
    }
    ctlWrap.append(row);
  }
  function syncDisabled() { // variabel turunan pada gelombang tidak diisi manual
    if (!paramDefs.some((d) => d.key === 'mode')) return;
    for (const k of ['v', 'lambda', 'f']) { const i = inputs[k]; if (!i) continue; const off = p.mode === k; i.rng.disabled = off; i.numIn.disabled = off; if (off) { const e = model.effective(p); i.rng.value = e[k]; i.numIn.value = String(+e[k].toFixed(3)).replace('.', ','); } }
  }
  function pushToInputs() { for (const d of paramDefs) { const i = inputs[d.key]; if (d.type === 'select') i.sel.value = p[d.key]; else { i.rng.value = p[d.key]; i.numIn.value = String(p[d.key]).replace('.', ','); i.numIn.classList.remove('invalid'); i.msg.textContent = ''; } } syncDisabled(); }

  // ---------- Grafik
  const chartCards = def.charts.map((c) => { const cv = h('canvas', { class: 'chart', role: 'img', 'aria-label': 'Grafik ' + c.title }); const chart = new Chart(cv, { xLabel: c.xLabel, yLabel: c.yLabel }); return { c, cv, chart, card: h('div', { class: 'card chart-card' }, h('div',{class:'row-between'},h('h4', null, c.title),h('button',{class:'btn-icon',type:'button','aria-label':'Unduh grafik '+c.title,onclick:()=>downloadCanvas(cv,meta.id+'-'+c.id)},icon('download',18))), cv) }; });
  const faintCache = {};
  function chartData(cc, t) {
    const c = cc.c; const key = c.id + JSON.stringify(p);
    const col = (n) => th[n];
    if (c.kind === 'static') {
      const [a, b] = c.xDomain(p, t);
      const series = c.series.map((s) => ({ label: s.label, color: col(s.color), pts: sample((x) => s.fn(p, x, t), a, b, 200) }));
      return { xDomain: [a, b], yDomain: c.yFixed ? c.yFixed(p) : undefined, series, marker: c.marker ? c.marker(p, t).map((m) => ({ ...m, color: col(m.color) })) : [] };
    }
    const [a, b] = c.xDomain(p, t); const D = model.duration(p);
    const series = [];
    let yDomain = c.yFixed ? c.yFixed(p) : undefined;
    if (Number.isFinite(D)) {
      if (!faintCache[key]) { faintCache[key] = c.series.map((s) => sample((x) => s.fn(p, x), a, b, 160)); if (!yDomain) { let lo = Infinity, hi = -Infinity; for (const pts of faintCache[key]) for (const q of pts) { lo = Math.min(lo, q[1]); hi = Math.max(hi, q[1]); } faintCache[key].y = [lo, hi]; } }
      c.series.forEach((s, i) => series.push({ color: col(s.color), pts: faintCache[key][i], faint: true }));
      if (!yDomain) { const [lo, hi] = faintCache[key].y; const pad = (hi - lo || 1) * 0.06; yDomain = [lo - pad, hi + pad]; }
    }
    const tEnd = Math.min(t, b);
    c.series.forEach((s) => series.push({ label: s.label, color: col(s.color), pts: t > a ? sample((x) => s.fn(p, x), a, tEnd, Math.min(200, Math.max(2, Math.round((tEnd - a) * 40)))) : [] }));
    const marker = t >= a ? c.series.map((s) => ({ x: Math.min(t, b), y: s.fn(p, Math.min(t, b)), color: col(s.color) })) : [];
    return { xDomain: [a, b], yDomain, series, marker };
  }
  let lastChartTs = 0;
  function drawCharts(t, force) { const now = performance.now(); if (!force && now - lastChartTs < 33) return; lastChartTs = now; for (const cc of chartCards) cc.chart.draw(chartData(cc, t)); }

  // ---------- Tabel pengamatan
  const tbody = h('tbody'); const tableWrap = h('div', { class: 'table-wrap' }, h('table', { class: 'tbl' }, h('thead', null, h('tr', null, model.columns.map((c) => h('th', null, c.label + (c.unit ? ` (${c.unit})` : ''))))), tbody));
  const emptyRow = () => h('tr', null, h('td', { colspan: model.columns.length, class: 'muted' }, 'Belum ada data. Tekan Start untuk mulai mencatat pengamatan.'));
  const addRow = (r) => h('tr', null, model.columns.map((c) => h('td', null, num(r[c.key], c.dec))));
  function renderTable() { clear(tbody); if (!rows.length) tbody.append(emptyRow()); else rows.forEach((r) => tbody.append(addRow(r))); rowCount.textContent = rows.length ? `${rows.length} baris` : ''; }
  const rowCount = h('span', { class: 'muted small' });
  function pushRow(r) { if (!rows.length) clear(tbody); rows.push(r); tbody.append(addRow(r)); if (rows.length > MAX_ROWS) { rows.shift(); tbody.removeChild(tbody.firstChild); } rowCount.textContent = `${rows.length} baris`; tableWrap.scrollTop = tableWrap.scrollHeight; }
  function record(t, final) {
    const st = stepSize();
    while (nextK * st <= t + 1e-9) { pushRow(model.at(p, nextK * st)); nextK++; }
    if (final && (!rows.length || rows[rows.length - 1].t < t - 1e-9)) pushRow(model.at(p, t));
  }

  // ---------- Hasil, kesimpulan
  const resultsBox = h('div', { class: 'card' }); const concBox = h('div', { class: 'card' });
  function renderResults() {
    clear(resultsBox); clear(concBox);
    if (!completed) {
      resultsBox.append(h('h3', null, 'Hasil perhitungan'), h('p', { class: 'muted' }, infinite ? 'Jalankan simulasi selama satu periode agar hasil perhitungan dan kesimpulan muncul.' : 'Jalankan simulasi sampai selesai untuk melihat hasil perhitungan akhir dan kesimpulan.'));
      concBox.append(h('h3', null, 'Kesimpulan'), h('p', { class: 'muted' }, 'Kesimpulan untuk variabel yang Anda pilih muncul setelah simulasi selesai, supaya Anda sempat membuat prediksi sendiri dulu.'));
      return;
    }
    const r = model.results(p);
    resultsBox.append(h('h3', null, 'Hasil perhitungan'), h('div', { class: 'tiles' }, r.map((x) => h('div', { class: 'tile' }, h('span', { class: 'tile-l' }, `${x.label} (${x.symbol})`), h('b', null, `${num(x.value, 3)} ${x.unit}`)))), h('p', { class: 'muted small' }, 'Dihitung dari rumus untuk variabel saat ini.'));
    concBox.append(h('h3', null, 'Kesimpulan'), h('p', null, def.conclude(p, r)), h('p', { class: 'muted small' }, 'Disusun otomatis dari nilai variabel dan hasil perhitungan percobaan ini.'));
  }

  // ---------- Frame & kontrol simulasi
  const runner = new SimRunner({ getDuration: () => model.duration(p), onFrame, onEnd, onState });
  function paintViz(t) {
    const { ctx: c, w, h: hh } = fit(canvas); c.clearRect(0, 0, w, hh);
    if (err()) { c.fillStyle = th.text2; c.font = '600 14px system-ui'; c.textAlign = 'center'; c.fillText('Visualisasi dijeda: periksa nilai variabel', w / 2, hh / 2); return; }
    def.draw({ ctx: c, w, h: hh, th }, p, model.at(p, t), t);
  }
  function updateLive(t) { if (err()) return; const s = model.at(p, t); for (const c of model.columns) liveVals[c.key].textContent = num(s[c.key], c.dec); }
  function onFrame(t) {
    if (err()) { paintViz(t); return; }
    paintViz(t); updateLive(t);
    const end=Number.isFinite(model.duration(p))?model.duration(p):Math.max(4,2/model.effective(p).f);
    const pct=Math.min(100,t/end*100);timeline.value=Math.round(pct*10);timeLabel.textContent=Math.round(pct)+'%';
    if (t > 0) record(t, false);
    drawCharts(t, t === 0 || !runner.running);
    if (!infinite) return;
    if (!completed && t >= 1 / model.effective(p).f) markComplete();
  }
  function onEnd() { record(runner.t, true); markComplete(); }
  function markComplete() {
    if (completed) return; completed = true; renderResults(); poe?.complete(model.results(p));
    store.updateProgress(meta.id, (x) => { x.runs++; }); store.logActivity('run', meta.id, def.title);
  }
  function onState(s) {
    const lbl = { idle: 'Siap', running: 'Berjalan', paused: 'Dijeda', 'auto-paused': 'Dijeda (tab tidak aktif)', ended: 'Selesai' }[s] || s; statusEl.textContent = lbl; statusEl.dataset.state = s;
    const running = s === 'running';
    btnStart.disabled = running || !!err() || !poe?.canStart; timeline.disabled=!!err() || poe?.state==='prediksi'; btnPause.disabled = !running;
    btnStart.querySelector('span').textContent = s === 'paused' || s === 'auto-paused' ? 'Resume' : 'Start';
  }
  btnStart.addEventListener('click', () => { if (err() || !poe?.canStart) return; if (runner.ended) resetRun(); else if (!runner.running && runner.t === 0 && rows.length) { rows = []; nextK = 0; noteEl.hidden = true; renderTable(); } runner.start(); });
  btnPause.addEventListener('click', () => runner.pause());
  btnReset.addEventListener('click', () => resetRun());
  speedSel.addEventListener('change', () => { runner.speed = Number(speedSel.value); });
  function resetRun() { poe?.reset(); runner.reset(); rows = []; nextK = 0; completed = false; loadedNote = null; noteEl.hidden = true; renderTable(); renderResults(); }
  const onKey = (e) => {
    if (document.querySelector('.modal-wrap') || /^(INPUT|SELECT|TEXTAREA|BUTTON|A|SUMMARY)$/.test(document.activeElement && document.activeElement.tagName)) return;
    if (e.key === ' ') { e.preventDefault(); if (runner.running) runner.pause(); else btnStart.click(); }
    else if (e.key.toLowerCase() === 'r') resetRun();
  };
  document.addEventListener('keydown', onKey);

  function changed() {
    syncDisabled(); const e = err();
    alertBox.hidden = !e; alertBox.textContent = e || '';
    if (e && runner.running) runner.pause();

    resetRun(); onState('idle');
  }

  // ---------- Tantangan
  const chBox = h('div', { class: 'ch-list' });
  function renderChallenges() {
    clear(chBox);
    for (const c of def.challenges) {
      const msg = h('div', { class: 'ch-msg', role: 'status' }); const expl = h('details', { class: 'ch-expl', hidden: true }, h('summary', null, 'Pembahasan'), h('p', { html: esc(c.explain) }));
      const typeName = { target: 'Capai target', predict: 'Prediksi', choice: 'Pilihan', compare: 'Bandingkan' }[c.type];
      const badge = h('span', { class: 'chip ' + (doneChallenges.has(c.id) ? 'ok' : '') }, doneChallenges.has(c.id) ? 'Selesai' : typeName);
      let body = []; let get = () => ({});
      if (c.type === 'predict') {
        const inp = h('input', { type: 'text', inputmode: 'decimal', class: 'num-in', 'aria-label': c.input.label, placeholder: c.input.label });
        body = [h('div', { class: 'row-gap' }, h('button', { class: 'btn btn-sm', type: 'button', onclick: () => { p = sanitize(paramDefs, { ...defaults(paramDefs), ...c.setup }); pushToInputs(); changed(); toast('Variabel diatur sesuai soal. Prediksi dulu, lalu jalankan simulasi.'); } }, 'Pakai soal ini')), h('div', { class: 'row-gap' }, inp, h('span', { class: 'unit' }, c.input.unit))];
        get = () => { const v = Number(String(inp.value).trim().replace(',', '.')); return { answer: inp.value.trim() === '' || !Number.isFinite(v) ? NaN : v }; };
      } else if (c.type === 'choice') {
        const name = 'ch-' + c.id; const radios = c.options.map((o, i) => h('label', { class: 'radio' }, h('input', { type: 'radio', name, value: i }), h('span', null, o)));
        body = [h('div', { class: 'radios' }, radios)]; get = () => { const el = chBox.querySelector(`input[name="${name}"]:checked`); return { choice: el ? Number(el.value) : null }; };
      }
      const btn = h('button', { class: 'btn btn-primary btn-sm', type: 'button', onclick: async () => {
        const g = get(); let res;
        if (c.type === 'predict') { if (!Number.isFinite(g.answer)) { msg.className = 'ch-msg bad'; msg.textContent = 'Isi prediksi dengan angka dulu.'; return; } const pp = sanitize(paramDefs, { ...defaults(paramDefs), ...c.setup }); const correct = Object.fromEntries(model.results(pp).map((r) => [r.key, r.value])); const want = c.answer(correct); const ok = Math.abs(g.answer - want) <= Math.max(1e-6, c.tol * Math.abs(want)); res = ok ? { ok: true } : { ok: false, msg: `Belum tepat (jawaban Anda ${num(g.answer, 3)} ${c.input.unit}). Nilai yang benar ≈ ${num(want, 3)} ${c.input.unit}.` }; }
        else if (c.type === 'choice') { if (g.choice === null) { msg.className = 'ch-msg bad'; msg.textContent = 'Pilih salah satu jawaban dulu.'; return; } res = g.choice === c.correct ? { ok: true } : { ok: false, msg: 'Belum tepat. Baca pembahasan, lalu coba lagi.' }; }
        else res = c.check({ p, r: resultsObj(), compares });
        msg.className = 'ch-msg ' + (res.ok ? 'ok' : 'bad'); msg.textContent = res.ok ? 'Benar. Tantangan selesai.' : res.msg || 'Belum memenuhi syarat.';
        expl.hidden = !(res.ok || c.type === 'predict' || c.type === 'choice'); if (res.ok) expl.hidden = false;
        if (res.ok && !doneChallenges.has(c.id)) { doneChallenges.add(c.id); await store.updateProgress(meta.id, (x) => { if (!x.challenges.includes(c.id)) x.challenges.push(c.id); }); store.logActivity('challenge', meta.id, c.title); badge.textContent = 'Selesai'; badge.classList.add('ok'); }
      } }, c.type === 'predict' ? 'Periksa jawaban' : 'Periksa');
      chBox.append(h('div', { class: 'card ch' }, h('div', { class: 'ch-h' }, h('h4', null, c.title), badge), h('p', null, c.text), body, h('div', { class: 'row-gap' }, btn), msg, expl));
    }
  }

  // ---------- Perbandingan
  const cmpBox = h('div', { class: 'table-wrap' });
  function renderCompare() {
    clear(cmpBox);
    if (!compares.length) { cmpBox.append(h('p', { class: 'muted' }, 'Belum ada percobaan yang dibandingkan. Atur variabel, lalu tekan "Tambahkan percobaan ini".')); return; }
    const pk = paramDefs.filter((d) => d.type !== 'select' || true); const rk = model.results(p);
    cmpBox.append(h('table', { class: 'tbl' }, h('thead', null, h('tr', null, h('th', null, '#'), pk.map((d) => h('th', null, d.symbol || 'mode')), rk.map((r) => h('th', null, `${r.symbol} (${r.unit})`)), h('th', null, ''))),
      h('tbody', null, compares.map((c, i) => h('tr', null, h('td', null, i + 1), pk.map((d) => h('td', null, d.type === 'select' ? c.params[d.key] : num(c.params[d.key], 3))), rk.map((r) => h('td', null, num(c.results[r.key], 3))), h('td', null, h('button', { class: 'btn-icon', type: 'button', 'aria-label': 'Hapus baris ' + (i + 1), onclick: () => { compares.splice(i, 1); renderCompare(); } }, icon('close', 16))))))));
  }
  const btnAddCmp = h('button', { class: 'btn', type: 'button', onclick: () => { if (err()) { toast('Perbaiki nilai variabel dulu.', 'warn'); return; } if (compares.length >= MAX_COMPARE) { toast(`Maksimum ${MAX_COMPARE} percobaan.`, 'warn'); return; } compares.push({ params: { ...p }, results: resultsObj() }); renderCompare(); toast('Ditambahkan ke perbandingan.'); } }, icon('plus', 18), h('span', null, 'Tambahkan percobaan ini'));

  // ---------- Simpan
  const savedLink = h('a', { class: 'btn-link', hidden: true }, 'Lihat laporan');
  const btnSave = h('button', { class: 'btn btn-primary', type: 'button', onclick: async () => {
    if (err()) { toast('Perbaiki nilai variabel dulu.', 'warn'); return; }
    const input = h('input', { type: 'text', class: 'full', maxlength: 80, value: `${def.title} – ${new Date().toLocaleDateString('id-ID')}`, 'aria-label': 'Nama eksperimen' });
    const warn = rows.length ? null : h('p', { class: 'muted small' }, 'Belum ada data pengamatan (simulasi belum dijalankan). Yang tersimpan: variabel dan hasil perhitungan.');
    const name = await modal({ title: 'Simpan eksperimen', body: h('div', null, h('label', { class: 'ctl-l' }, 'Nama eksperimen'), input, warn, h('p', { class: 'muted small' }, 'Disimpan di perangkat ini (IndexedDB). Tidak otomatis tersinkron ke perangkat lain.')), actions: [{ label: 'Batal', value: null }, { label: 'Simpan', primary: true, onClick: () => (input.value.trim() ? input.value.trim() : false) }] });
    if (!name) return;
    const rec = await store.saveExperiment({ simId: meta.id, simTitle: def.title, name, params: { ...p }, columns: model.columns, observations: rows.map((r) => ({ ...r })), results: model.results(p), completed, poe:poe.snapshot(), challenges: [...doneChallenges] });
    savedLink.href = '#/reports/' + rec.id; savedLink.hidden = false; toast('Eksperimen tersimpan.', 'ok');
  } }, icon('save', 18), h('span', null, 'Simpan Eksperimen'));

  // ---------- Materi
  const symRows = [...paramDefs.filter((d) => d.type !== 'select').map((d) => [d.symbol, d.label, d.unit || '–']), ...model.results(defaults(paramDefs)).map((r) => [r.symbol, r.label, r.unit || '–'])];
  const seen = new Set(); const symUnique = symRows.filter((r) => (seen.has(r[0]) ? false : seen.add(r[0])));
  const wide = false; // materi tertutup: simulasi tampil lebih dulu
  const materi = h('div', { class: 'materi' },
    h('details', { open: wide }, h('summary', null, 'Tujuan pembelajaran'), h('ul', null, def.objectives.map((o) => h('li', null, o)))),
    h('details', { open: wide }, h('summary', null, 'Dasar teori'), def.theory.map((t) => h('p', { html: t }))),
    h('details', { open: wide }, h('summary', null, 'Rumus yang digunakan'), h('ul', { class: 'formulas' }, def.formulas.map((f) => h('li', null, h('span', { class: 'eq', html: f.eq }), h('small', null, ' ' + f.note)))), h('h5', null, 'Simbol, satuan, dan artinya'), h('div', { class: 'table-wrap' }, h('table', { class: 'tbl' }, h('thead', null, h('tr', null, ['Simbol', 'Besaran', 'Satuan'].map((x) => h('th', null, x)))), h('tbody', null, symUnique.map((r) => h('tr', null, r.map((x) => h('td', null, x)))))))));

  // ---------- Presets & favorit
  const myPresets = PRESETS.filter((x) => x.sim === meta.id);
  const presetBar = h('div', { class: 'preset-bar' }, h('span', { class: 'muted small' }, 'Eksperimen siap pakai:'), myPresets.map((pr) => h('button', { class: 'chip-btn', type: 'button', title: pr.desc, onclick: () => { p = sanitize(paramDefs, { ...defaults(paramDefs), ...pr.params }); pushToInputs(); changed(); toast('Dimuat: ' + pr.title); } }, pr.title)));
  const favBtn = h('button', { class: 'btn-icon fav', type: 'button', 'aria-label': 'Tandai favorit', 'aria-pressed': 'false' }, icon('star', 20));
  store.listFavorites().then((f) => { const on = f.includes('sim:' + meta.id); favBtn.setAttribute('aria-pressed', String(on)); });
  favBtn.addEventListener('click', async () => { const on = await store.toggleFavorite('sim:' + meta.id); favBtn.setAttribute('aria-pressed', String(on)); toast(on ? 'Ditambahkan ke favorit.' : 'Dihapus dari favorit.'); });
  const noteEl = h('div', { class: 'alert info', hidden: !loadedNote }, loadedNote || '');

  // ---------- POE dan suara. Alur dipasang pada semua 11 simulasi.
  poe=await createPoe({id:meta.id,title:def.title,onChange:()=>onState(runner.running?'running':runner.ended?'ended':runner.t>0?'paused':'idle')});
  poe.setResetHandler(()=>resetRun());
  const materialSpeech=speechControls(()=>[def.title,...def.objectives,...def.theory.map(x=>{const d=document.createElement('div');d.innerHTML=x;return d.textContent})].join('. '),'Bacakan materi');

  const assessment=await makeAssessment(meta,def,()=>({params:{...p},results:model.results(p),completed,error:err(),poe:poe.snapshot(),graph:chartCards[0]?.cv}));

  // ---------- Rangkai halaman
  const el = h('div', { class: 'page exp' },
    h('div', { class: 'page-h' }, h('div', null, h('div', { class: 'crumb' }, h('a', { href: '#/lab/'+meta.lab }, meta.labName), ' / ', def.title), h('h1', null, def.title), h('p', { class: 'lead' }, def.description)), h('div', { class: 'row-gap' }, h('span', { class: 'chip' }, meta.level), favBtn)),
    h('nav',{class:'experiment-nav','aria-label':'Bagian eksperimen'},
      ...[['poe','Alur belajar'],['visual','Simulasi'],['graphs','Grafik'],['observations','Data'],['learning','Materi'],['assessment','Latihan & Bagikan'],['challenges','Tantangan']].map(([id,label])=>h('button',{class:'chip-btn',type:'button',onclick:()=>el.querySelector('#'+id).scrollIntoView({block:'start'})},label)),
      h('button',{class:'chip-btn focus-toggle',type:'button','aria-pressed':'false',onclick:e=>{const on=el.classList.toggle('focus-mode');e.currentTarget.setAttribute('aria-pressed',String(on));e.currentTarget.textContent=on?'Keluar fokus':'Mode fokus';window.dispatchEvent(new Event('resize'))}},'Mode fokus')),
    poe.el,
    h('div', { class: 'lab-grid',id:'visual' },
      h('div', { class: 'lab-main' }, h('div', { class: 'card viz-card' },h('div',{class:'viz-heading'},h('span',null,meta.labName+' / Live Canvas'),h('button',{class:'btn-icon',type:'button','aria-label':'Unduh visualisasi PNG',onclick:()=>downloadCanvas(canvas,meta.id+'-visualisasi')},icon('download',18))),canvas), alertBox, h('div', { class: 'transport' }, btnStart, btnPause, btnReset, h('label', { class: 'speed' }, h('span', null, 'Kecepatan'), speedSel), statusEl), h('div',{class:'timeline'},h('label',{for:'sim-timeline'},'Jelajah waktu'),timeline,timeLabel), h('p', { class: 'muted small kbd-hint' }, 'Pintasan: Spasi = Start/Pause, R = Reset.'), live),
      h('div', { class: 'lab-side card' }, h('h3', null, 'Kontrol variabel'), presetBar, ctlWrap, h('p', { class: 'muted small' }, 'Mengubah variabel mengatur ulang percobaan dan tahap prediksi agar hasilnya selalu konsisten.'))),
    noteEl, resultsBox,
    h('section', {id:'graphs'}, h('h3', { class: 'sec' }, 'Grafik'), h('p',{class:'muted small'},'Grafik waktu: garis putus-putus adalah prediksi model lengkap; garis penuh menunjukkan interval yang sudah diamati. Grafik sapuan parameter menampilkan seluruh kurva dengan titik pengamatan.'), h('div', { class: 'grid2' }, chartCards.map((c) => c.card))),
    h('section', { class: 'card',id:'observations' }, h('div', { class: 'row-between' }, h('h3', null, 'Hasil pengamatan'), rowCount), tableWrap),
    concBox, h('section',{id:'learning'},h('h3',{class:'sec'},'Materi & rumus'),materialSpeech.el,materi),
    h('section', null, h('h3', { class: 'sec' }, 'Bandingkan percobaan'), h('div', { class: 'card' }, h('div', { class: 'row-gap' }, btnAddCmp), cmpBox)),
    assessment,
    h('section', {id:'challenges'}, h('h3', { class: 'sec' }, 'Tantangan eksperimen'), chBox),
    h('section', { class: 'card save-card' }, h('div', null, h('h3', null, 'Simpan hasil'), h('p', { class: 'muted' }, 'Simpan variabel dan tabel pengamatan untuk dibuka lagi, diekspor ke CSV, atau dicetak sebagai laporan. Data tersimpan hanya di perangkat ini.')), h('div', { class: 'row-gap' }, btnSave, savedLink)));

  // ---------- Inisialisasi
  renderTable(); renderResults(); renderChallenges(); renderCompare(); pushToInputs();
  if (rows.length) { /* data tersimpan ditampilkan; mulai baru saat Start/Reset */ completed = false; }
  const ro = new ResizeObserver(() => paintViz(runner.t)); ro.observe(canvas);
  const onTheme = () => { th = theme(); paintViz(runner.t); drawCharts(runner.t, true); };
  window.addEventListener('themechange', onTheme);
  const firstPaint = () => { alertBox.hidden = !err(); alertBox.textContent = err() || ''; onFrame(0); onState('idle'); };
  requestAnimationFrame(firstPaint);
  const timer = setInterval(() => { if (!document.hidden) store.updateProgress(meta.id, (x) => { x.seconds += 5; }); }, 5000);
  if (rows.length) { /* tabel tersimpan sudah dirender */ }
  return {
    el, title: def.title,
    destroy() { poe.destroy(); materialSpeech.destroy(); runner.destroy(); ro.disconnect(); clearInterval(timer); document.removeEventListener('keydown', onKey); window.removeEventListener('themechange', onTheme); chartCards.forEach((c) => c.chart.destroy()); },
    api: { runner, poe, get p() { return p; }, setParams(o) { p = sanitize(paramDefs, { ...p, ...o }); pushToInputs(); changed(); }, get rows() { return rows; }, get completed() { return completed; }, def },
  };
}
