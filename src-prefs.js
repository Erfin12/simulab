/* © 2026 Erfin. All rights reserved. See LICENSE. */
// Preferensi kecil (tema, gerak) di localStorage agar bisa diterapkan sebelum cat pertama.
export const installPrompt = { event: null };
const get = (k, d) => { try { return localStorage.getItem(k) || d; } catch { return d; } };
const set = (k, v) => { try { localStorage.setItem(k, v); } catch { /* abaikan */ } };
export const getTheme = () => get('simulab.theme', matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
export function applyTheme(t, animate) {
  const root = document.documentElement;
  if (animate && root.dataset.motion !== 'reduce') { root.classList.add('theme-anim'); setTimeout(() => root.classList.remove('theme-anim'), 400); }
  root.dataset.theme = t; document.querySelector('meta[name=theme-color]')?.setAttribute('content', t === 'dark' ? '#0B1020' : '#F5F7FB');
  window.dispatchEvent(new Event('themechange'));
}
export function setTheme(t) { set('simulab.theme', t); applyTheme(t, true); }
export const getMotion = () => get('simulab.motion', 'system');
export function applyMotion(m) { const root = document.documentElement; if (m === 'system') delete root.dataset.motion; else root.dataset.motion = m === 'reduce' ? 'reduce' : 'full'; }
export function setMotion(m) { set('simulab.motion', m); applyMotion(m); }
