import { useEffect } from 'react';

const THEMES = {
  top: [
    [61, 207, 182],
    [184, 164, 255],
    [255, 178, 122],
  ],
  about: [
    [184, 164, 255],
    [61, 207, 182],
    [110, 179, 255],
  ],
  skills: [
    [244, 224, 109],
    [61, 207, 182],
    [184, 164, 255],
  ],
  projects: [
    [255, 178, 122],
    [184, 164, 255],
    [255, 109, 138],
  ],
  contact: [
    [61, 207, 182],
    [255, 178, 122],
    [244, 224, 109],
  ],
} as const;

const SECTION_ORDER = ['top', 'about', 'skills', 'projects', 'contact'] as const;

const mix = (a: readonly number[], b: readonly number[], t: number) => {
  const r = Math.round(a[0] + (b[0] - a[0]) * t);
  const g = Math.round(a[1] + (b[1] - a[1]) * t);
  const bl = Math.round(a[2] + (b[2] - a[2]) * t);
  return `rgb(${r}, ${g}, ${bl})`;
};

const smoothstep = (t: number) => {
  const clamped = Math.max(0, Math.min(1, t));
  return clamped * clamped * (3 - 2 * clamped);
};

export function ScrollbarController() {
  useEffect(() => {
    const sectionNodes = SECTION_ORDER
      .map((id) => ({ id, el: document.getElementById(id) }))
      .filter((s): s is { id: typeof SECTION_ORDER[number]; el: HTMLElement } => Boolean(s.el))
      .sort((a, b) => a.el.offsetTop - b.el.offsetTop);

    let lastY = window.scrollY;
    let lastTime = performance.now();
    let scrollingTimer: number | undefined;

    const updateScrollbar = () => {
      const doc = document.documentElement;
      const markerY = window.scrollY + window.innerHeight * 0.45;

      let activeIdx = 0;
      for (let i = 0; i < sectionNodes.length; i += 1) {
        if (markerY >= sectionNodes[i].el.offsetTop) activeIdx = i;
      }

      const current = sectionNodes[activeIdx]?.id ?? 'top';
      const next = sectionNodes[Math.min(activeIdx + 1, sectionNodes.length - 1)]?.id ?? current;
      const currentTop = sectionNodes[activeIdx]?.el.offsetTop ?? 0;
      const nextTop = sectionNodes[Math.min(activeIdx + 1, sectionNodes.length - 1)]?.el.offsetTop ?? currentTop + 1;
      const mixT = smoothstep((markerY - currentTop) / Math.max(1, nextTop - currentTop));

      doc.style.setProperty('--scrollbar-c1', mix(THEMES[current][0], THEMES[next][0], mixT));
      doc.style.setProperty('--scrollbar-c2', mix(THEMES[current][1], THEMES[next][1], mixT));
      doc.style.setProperty('--scrollbar-c3', mix(THEMES[current][2], THEMES[next][2], mixT));

      const now = performance.now();
      const dy = window.scrollY - lastY;
      const dt = Math.max(16, now - lastTime);
      const velocity = dy / dt;
      const glow = Math.max(0.16, Math.min(0.8, 0.16 + Math.abs(velocity) * 1.35));
      doc.style.setProperty('--scrollbar-glow', String(glow));

      lastY = window.scrollY;
      lastTime = now;
      doc.classList.add('is-scrolling');
      if (scrollingTimer) window.clearTimeout(scrollingTimer);
      scrollingTimer = window.setTimeout(() => {
        doc.classList.remove('is-scrolling');
      }, 150);
    };

    updateScrollbar();
    window.addEventListener('scroll', updateScrollbar, { passive: true });
    window.addEventListener('resize', updateScrollbar);
    return () => {
      window.removeEventListener('scroll', updateScrollbar);
      window.removeEventListener('resize', updateScrollbar);
      if (scrollingTimer) window.clearTimeout(scrollingTimer);
      document.documentElement.classList.remove('is-scrolling');
    };
  }, []);

  return null;
}
