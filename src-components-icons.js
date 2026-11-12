/* © 2026 Erfin. All rights reserved. See LICENSE. */
const I = {
  home: '<path d="M3 11l9-8 9 8M5 10v10h14V10M10 20v-6h4v6"/>',
  compass: '<path d="M12 3a9 9 0 100 18 9 9 0 000-18zM15.5 8.5l-2 5-5 2 2-5z"/>',
  flask: '<path d="M9 3h6M10 3v6L4.5 19a1.5 1.5 0 001.3 2.2h12.4a1.5 1.5 0 001.3-2.2L14 9V3"/>',
  progress: '<path d="M4 20V10M10 20V4M16 20v-8M22 20H2"/>',
  atom: '<ellipse cx="12" cy="12" rx="10" ry="4"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)"/><circle cx="12" cy="12" r="1.2"/>',
  math: '<path d="M5 7h14M9 7v12M15 7v12"/>',
  chem: '<path d="M9 3v5l-5 9a3 3 0 002.6 4.5h10.8A3 3 0 0020 17l-5-9V3M8 3h8M7.5 14h9"/>',
  bio: '<path d="M5 21c0-9 5-15 15-16 0 10-6 16-15 16zM5 21c3-5 6-8 10-10"/>',
  formula: '<path d="M9 4c-2 0-3 1-3 3v3H4m2 0h3m-3 0v8M14 10l6 8m0-8l-6 8"/>',
  library: '<path d="M4 5a2 2 0 012-2h13v16H6a2 2 0 00-2 2zM4 21V5M8 7h7"/>',
  graph: '<path d="M3 3v18h18M7 15l4-5 3 3 5-7"/>',
  report: '<path d="M7 3h7l5 5v13H7zM14 3v5h5M10 13h6M10 17h6"/>',
  docs: '<path d="M4 4h16v16H4zM8 9h8M8 13h8M8 17h5"/>',
  settings: '<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9L7 7M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1"/>',
  info: '<path d="M12 3a9 9 0 100 18 9 9 0 000-18zM12 11v6M12 7.5v.01"/>',
  menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  moon: '<path d="M20 14.5A8 8 0 019.5 4a8 8 0 1010.5 10.5z"/>',
  play: '<path d="M7 4l13 8-13 8z" fill="currentColor"/>',
  pause: '<path d="M8 4v16M16 4v16"/>',
  reset: '<path d="M3 12a9 9 0 109-9 9 9 0 00-6.7 3L3 8M3 3v5h5"/>',
  star: '<path d="M12 3l2.8 5.7 6.2.9-4.5 4.4 1 6.2L12 17.3 6.5 20.2l1-6.2L3 9.6l6.2-.9z"/>',
  save: '<path d="M5 3h12l2 2v16H5zM8 3v6h8V3M8 21v-7h8v7"/>',
  download: '<path d="M12 3v12M7 10l5 5 5-5M4 21h16"/>',
  upload: '<path d="M12 17V5M7 10l5-5 5 5M4 21h16"/>',
  trash: '<path d="M4 7h16M9 7V4h6v3M6 7l1 14h10l1-14M10 11v6M14 11v6"/>',
  search: '<path d="M11 4a7 7 0 100 14 7 7 0 000-14zM21 21l-5-5"/>',
  close: '<path d="M6 6l12 12M18 6L6 18"/>',
  check: '<path d="M5 12l5 5 9-10"/>',
  print: '<path d="M7 9V3h10v6M7 17H4v-7h16v7h-3M7 14h10v7H7z"/>',
  chevron: '<path d="M9 6l6 6-6 6"/>',
  trophy: '<path d="M8 4h8v6a4 4 0 01-8 0zM8 6H4v2a4 4 0 004 4M16 6h4v2a4 4 0 01-4 4M12 14v4M8 21h8"/>',
  lock: '<path d="M6 11h12v10H6zM8 11V8a4 4 0 018 0v3"/>',
  target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  more: '<path d="M5 12h.01M12 12h.01M19 12h.01"/>',
};
export function icon(name, size = 20) {
  const s = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  s.setAttribute('viewBox', '0 0 24 24'); s.setAttribute('width', size); s.setAttribute('height', size);
  s.setAttribute('fill', 'none'); s.setAttribute('stroke', 'currentColor'); s.setAttribute('stroke-width', '1.8');
  s.setAttribute('stroke-linecap', 'round'); s.setAttribute('stroke-linejoin', 'round'); s.setAttribute('aria-hidden', 'true'); s.setAttribute('class', 'ico');
  s.innerHTML = I[name] || I.info;
  return s;
}
