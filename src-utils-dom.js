/* © 2026 Erfin. All rights reserved. See LICENSE. */
// Pembantu DOM kecil. Semua teks dari pengguna harus lewat textContent / esc().
export function h(tag, props, ...kids) {
  const el = document.createElement(tag);
  if (props) {
    for (const [k, v] of Object.entries(props)) {
      if (v == null || v === false) continue;
      if (k === 'class') el.className = v;
      else if (k === 'html') el.innerHTML = v;
      else if (k === 'text') el.textContent = v;
      else if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2).toLowerCase(), v);
      else if (k === 'value' || k === 'checked' || k === 'disabled' || k === 'selected') el[k] = v;
      else if (v === true) el.setAttribute(k, '');
      else el.setAttribute(k, String(v));
    }
  }
  append(el, kids);
  return el;
}
function append(el, kids) {
  for (const k of kids.flat(Infinity)) {
    if (k == null || k === false) continue;
    el.append(k instanceof Node ? k : document.createTextNode(String(k)));
  }
}
export function esc(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
export function clear(el) { while (el.firstChild) el.removeChild(el.firstChild); return el; }
export function $(sel, root = document) { return root.querySelector(sel); }
export function $$(sel, root = document) { return [...root.querySelectorAll(sel)]; }

let toastTimer;
export function toast(msg, kind = 'info') {
  let box = document.getElementById('toast');
  if (!box) { box = h('div', { id: 'toast', role: 'status', 'aria-live': 'polite' }); document.body.append(box); }
  box.className = 'toast show ' + kind;
  box.textContent = msg;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => box.classList.remove('show'), 3200);
}

export function download(filename, text, mime = 'text/plain') {
  const blob = new Blob([text], { type: mime + ';charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = h('a', { href: url, download: filename });
  document.body.append(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

// Dialog modal sederhana (pengganti prompt()).
export function modal({ title, body, actions }) {
  return new Promise((resolve) => {
    const prev = document.activeElement;
    const close = (v) => { wrap.remove(); document.removeEventListener('keydown', onKey); if (prev && prev.focus) prev.focus(); resolve(v); };
    const onKey = (e) => { if (e.key === 'Escape'){e.stopPropagation();close(null)} if(e.key==='Tab'){const items=[...wrap.querySelectorAll('button,input,select,textarea,a[href]')].filter(x=>!x.disabled&&!x.hidden),first=items[0],last=items[items.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last?.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first?.focus()}} };
    const btns = actions.map((a) => h('button', { class: 'btn ' + (a.primary ? 'btn-primary' : 'btn-ghost'), type: 'button', onclick: () => { const r = a.onClick ? a.onClick() : a.value; if (r !== false) close(r === undefined ? a.value : r); } }, a.label));
    const wrap = h('div', { class: 'modal-wrap', onclick: (e) => { if (e.target === wrap) close(null); } },
      h('div', { class: 'modal card', role: 'dialog', 'aria-modal': 'true', 'aria-label': title },
        h('h3', null, title), body, h('div', { class: 'modal-actions' }, btns)));
    document.body.append(wrap);
    document.addEventListener('keydown', onKey);
    const f = wrap.querySelector('input,button'); if (f) f.focus();
  });
}
