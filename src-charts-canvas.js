/* © 2026 Erfin. All rights reserved. See LICENSE. */
export function theme() {
  const cs = getComputedStyle(document.documentElement);
  const g = (n) => cs.getPropertyValue(n).trim();
  return { bg: g('--bg'), card: g('--card'), card2: g('--card2'), text: g('--text'), text2: g('--text2'), border: g('--border'), primary: g('--primary'), secondary: g('--secondary'), ok: g('--ok'), warn: g('--warn'), bad: g('--bad'), violet: g('--violet') };
}
// Sesuaikan ukuran kanvas dengan elemen (DPR dibatasi 2 agar ringan di HP).
export function fit(canvas) {
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  const r = canvas.getBoundingClientRect();
  const w = Math.max(10, Math.round(r.width)), hgt = Math.max(10, Math.round(r.height));
  if (canvas.width !== Math.round(w * dpr) || canvas.height !== Math.round(hgt * dpr)) { canvas.width = Math.round(w * dpr); canvas.height = Math.round(hgt * dpr); }
  const ctx = canvas.getContext('2d');
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { ctx, w, h: hgt };
}
export function arrow(ctx, x1, y1, x2, y2, color, width = 3) {
  const dx = x2 - x1, dy = y2 - y1, len = Math.hypot(dx, dy);
  if (len < 2) return;
  const ux = dx / len, uy = dy / len, head = Math.min(10, len * 0.5);
  ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = width; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2 - ux * head * 0.6, y2 - uy * head * 0.6); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x2, y2); ctx.lineTo(x2 - ux * head - uy * head * 0.5, y2 - uy * head + ux * head * 0.5); ctx.lineTo(x2 - ux * head + uy * head * 0.5, y2 - uy * head - ux * head * 0.5); ctx.closePath(); ctx.fill();
}
export function text(ctx, s, x, y, { color, size = 12, align = 'left', weight = 500, base = 'alphabetic' } = {}) {
  ctx.fillStyle = color; ctx.font = `${weight} ${size}px system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`; ctx.textAlign = align; ctx.textBaseline = base; ctx.fillText(s, x, y);
}
export function niceTicks(lo, hi, n = 5) {
  if (!(hi > lo)) { hi = lo + 1; }
  const raw = (hi - lo) / n, pow = Math.pow(10, Math.floor(Math.log10(raw))), f = raw / pow;
  const step = (f < 1.5 ? 1 : f < 3 ? 2 : f < 7 ? 5 : 10) * pow;
  const a = Math.floor(lo / step + 1e-9) * step, b = Math.ceil(hi / step - 1e-9) * step;
  const ticks = []; for (let v = a; v <= b + step * 1e-6; v += step) ticks.push(Math.abs(v) < step * 1e-9 ? 0 : v);
  return { ticks, lo: a, hi: b, step };
}
