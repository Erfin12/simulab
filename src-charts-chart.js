/* © 2026 Erfin. All rights reserved. See LICENSE. */
import { fit, theme, text, niceTicks } from './src-charts-canvas.js';
import { num } from './src-utils-format.js';

// Grafik garis Canvas ringan. draw({xDomain, yDomain?, series:[{pts,color,label,faint,dash}], marker:[{x,y,color}]})
export class Chart {
  constructor(canvas, { xLabel, yLabel, title }) {
    this.canvas = canvas; this.xLabel = xLabel; this.yLabel = yLabel; this.title = title; this.last = null;
    this.ro = new ResizeObserver(() => { if (this.last) this.draw(this.last); });
    this.ro.observe(canvas);
    this._th = () => { if (this.last) this.draw(this.last); };
    window.addEventListener('themechange', this._th);
    this._print=()=>{this.printing=true;if(this.last)this.draw(this.last)};this._after=()=>{this.printing=false;if(this.last)this.draw(this.last)};window.addEventListener('beforeprint',this._print);window.addEventListener('afterprint',this._after);
  }
  destroy() { this.ro.disconnect(); window.removeEventListener('themechange', this._th);window.removeEventListener('beforeprint',this._print);window.removeEventListener('afterprint',this._after); }
  draw(d) {
    this.last = d;
    const { ctx, w, h } = fit(this.canvas); const th = this.printing?{...theme(),text:'#182233',text2:'#344054',border:'#cbd2dc',card:'#ffffff'}:theme();
    ctx.clearRect(0, 0, w, h);
    const m = { l: 68, r: 12, t: 12, b: 40 };
    const pw = w - m.l - m.r, ph = h - m.t - m.b;
    if (pw < 20 || ph < 20) return;
    let [x0, x1] = d.xDomain;
    let yLo = Infinity, yHi = -Infinity;
    if (d.yDomain) [yLo, yHi] = d.yDomain;
    else for (const s of d.series) for (const p of s.pts) { if (Number.isFinite(p[1])) { yLo = Math.min(yLo, p[1]); yHi = Math.max(yHi, p[1]); } }
    if (!Number.isFinite(yLo)) { yLo = 0; yHi = 1; }
    if (yHi - yLo < 1e-9) { yLo -= 1; yHi += 1; }
    const pad = (yHi - yLo) * 0.06; if (!d.yDomain) { yLo -= pad; yHi += pad; }
    const yt = niceTicks(yLo, yHi, Math.max(3, Math.floor(ph / 45)));
    const xt = niceTicks(x0, x1, Math.max(3, Math.floor(pw / 80)));
    const X = (v) => m.l + ((v - x0) / (x1 - x0 || 1)) * pw;
    const Y = (v) => m.t + ph - ((v - yt.lo) / (yt.hi - yt.lo || 1)) * ph;
    ctx.lineWidth = 1; ctx.strokeStyle = th.border; ctx.fillStyle = th.text2;
    for (const t of yt.ticks) { const y = Math.round(Y(t)) + 0.5; ctx.beginPath(); ctx.moveTo(m.l, y); ctx.lineTo(w - m.r, y); ctx.stroke(); text(ctx, num(t,Math.min(7,Math.max(3,Math.ceil(-Math.log10(Math.abs(yt.ticks[1]-yt.ticks[0])||1))+1))), m.l - 6, y + 4, { color: th.text2, size: 11, align: 'right' }); }
    for (const t of xt.ticks) { if (t < x0 - 1e-9 || t > x1 + 1e-9) continue; const x = Math.round(X(t)) + 0.5; ctx.beginPath(); ctx.moveTo(x, m.t); ctx.lineTo(x, m.t + ph); ctx.stroke(); text(ctx, num(t, 3), x, m.t + ph + 15, { color: th.text2, size: 11, align: 'center' }); }
    // sumbu nol
    if (yt.lo < 0 && yt.hi > 0) { ctx.strokeStyle = th.text2; ctx.globalAlpha = 0.5; const y = Math.round(Y(0)) + 0.5; ctx.beginPath(); ctx.moveTo(m.l, y); ctx.lineTo(w - m.r, y); ctx.stroke(); ctx.globalAlpha = 1; }
    text(ctx, this.xLabel, m.l + pw / 2, h - 6, { color: th.text2, size: 12, align: 'center' });
    ctx.save(); ctx.translate(12, m.t + ph / 2); ctx.rotate(-Math.PI / 2); text(ctx, this.yLabel, 0, 0, { color: th.text2, size: 12, align: 'center' }); ctx.restore();
    ctx.save(); ctx.beginPath(); ctx.rect(m.l, m.t, pw, ph); ctx.clip();
    for (const s of d.series) {
      if (!s.pts.length) continue;
      ctx.strokeStyle = s.color; ctx.lineWidth = s.faint ? 1.5 : 2.5; ctx.globalAlpha = s.faint ? 0.35 : 1; ctx.setLineDash(s.dash || (s.faint ? [5, 4] : []));
      ctx.lineJoin = 'round'; ctx.beginPath();
      s.pts.forEach((p, i) => { const px = X(p[0]), py = Y(p[1]); i ? ctx.lineTo(px, py) : ctx.moveTo(px, py); });
      ctx.stroke();
    }
    ctx.restore(); ctx.globalAlpha = 1; ctx.setLineDash([]);
    for (const mk of d.marker || []) {
      if (!Number.isFinite(mk.x) || !Number.isFinite(mk.y)) continue;
      ctx.fillStyle = mk.color; ctx.strokeStyle = th.card; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(X(mk.x), Y(mk.y), 5, 0, 7); ctx.fill(); ctx.stroke();
    }
    // legenda
    let lx = m.l + 8; const named = d.series.filter((s) => s.label && !s.faint);
    named.forEach((s) => { ctx.fillStyle = s.color; ctx.fillRect(lx, m.t + 6, 12, 3); text(ctx, s.label, lx + 16, m.t + 12, { color: th.text, size: 11 }); lx += 24 + ctx.measureText(s.label).width; });
  }
}
// Ambil sampel fungsi f(x) pada [a,b].
export function sample(f, a, b, n = 160) {
  const pts = []; if (!(b > a)) return [[a, f(a)]];
  for (let i = 0; i <= n; i++) { const x = a + ((b - a) * i) / n; pts.push([x, f(x)]); }
  return pts;
}
