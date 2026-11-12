/* © 2026 Erfin. All rights reserved. See LICENSE. */
// Mesin simulasi: waktu simulasi dihitung dari delta time (bukan jumlah frame).
// Perhitungan fisika ada di model.js tiap simulasi; mesin ini hanya mengatur waktu.
export class SimRunner {
  constructor({ getDuration, onFrame, onEnd, onState }) {
    this.getDuration = getDuration; this.onFrame = onFrame; this.onEnd = onEnd || (() => {}); this.onState = onState || (() => {});
    this.t = 0; this.speed = 1; this.running = false; this.ended = false; this.raf = 0; this.last = 0;
    this._tick = this._tick.bind(this);
    this._vis = () => { if (document.hidden && this.running) { this.pause(); this.autoPaused = true; this.onState('auto-paused'); } };
    document.addEventListener('visibilitychange', this._vis);
  }
  start() {
    if (this.running) return;
    if (this.ended) this.reset();
    this.running = true; this.autoPaused = false; this.last = performance.now();
    this.raf = requestAnimationFrame(this._tick);
    this.onState('running');
  }
  pause() {
    if (!this.running) return;
    this.running = false; cancelAnimationFrame(this.raf); this.onState('paused');
  }
  resume() { this.start(); }
  seek(t) {
    this.pause(); const D=this.getDuration(); this.t=Math.max(0,Math.min(D,t));
    this.ended=this.t>=D; this.onFrame(this.t); if(this.ended)this.onEnd();
    this.onState(this.ended?'ended':this.t===0?'idle':'paused');
  }
  reset() {
    this.running = false; cancelAnimationFrame(this.raf);
    this.t = 0; this.ended = false; this.onFrame(0); this.onState('idle');
  }
  _tick(now) {
    if (!this.running) return;
    const dt = Math.min(0.1, Math.max(0, (now - this.last) / 1000)); // batasi lonjakan saat tab lambat
    this.last = now;
    this.step(dt * this.speed);
    if (this.running) this.raf = requestAnimationFrame(this._tick);
  }
  // Satu langkah waktu simulasi. Dipakai rAF dan juga pengujian (deterministik).
  step(dt) {
    const D = this.getDuration();
    this.t += dt;
    if (this.t >= D) { this.t = D; this.running = false; this.ended = true; cancelAnimationFrame(this.raf); this.onFrame(this.t); this.onEnd(); this.onState('ended'); return; }
    this.onFrame(this.t);
  }
  destroy() { cancelAnimationFrame(this.raf); this.running = false; document.removeEventListener('visibilitychange', this._vis); }
}
