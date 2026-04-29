import { useEffect, useRef } from 'react';

/**
 * Teal spotlight cursor that follows the mouse and grows over clickable elements.
 * – Idea 6: color shifts from teal to soft neutral/white over interactive elements
 * – Idea 2: adds `spotlight-near` class to body so .cta-fx buttons can glow
 */
const isTouch = window.matchMedia('(pointer: coarse)').matches;

export function Spotlight() {
  const tealRef = useRef<HTMLDivElement>(null);
  const whiteRef = useRef<HTMLDivElement>(null);
  const posRef = useRef({ x: -400, y: -400, tx: -400, ty: -400, scale: 1, ts: 1, c: 0, tc: 0, h: 0, th: 0, p: 0, tp: 0 });
  const runnerFadeRef = useRef(0);

  useEffect(() => {
    if (isTouch) return;
    const INTERACTIVE_SELECTOR = 'a, button, input, textarea, select, [role="button"], .cta-fx';
    const NODE_REFRESH_MS = 1200;
    const RECT_REFRESH_MS = 220;
    const PROX_REFRESH_MS = 55;
    let interactiveNodes: HTMLElement[] = [];
    let interactiveRects: DOMRect[] = [];
    let lastNodeRefresh = 0;
    let lastRectRefresh = 0;
    let lastProxRefresh = 0;

    const isClickable = (el: HTMLElement | null): boolean => {
      while (el && el !== document.body) {
        const tag = el.tagName;
        if (tag === 'A' || tag === 'BUTTON' || tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return true;
        const cs = window.getComputedStyle(el);
        if (cs && cs.cursor === 'pointer') return true;
        el = el.parentElement;
      }
      return false;
    };

    const refreshNodes = () => {
      interactiveNodes = Array.from(document.querySelectorAll<HTMLElement>(INTERACTIVE_SELECTOR)).slice(0, 180);
    };

    const refreshRects = () => {
      interactiveRects = [];
      for (const node of interactiveNodes) {
        const r = node.getBoundingClientRect();
        if (r.width && r.height) interactiveRects.push(r);
      }
    };

    const refreshTargets = (now: number) => {
      if (!interactiveNodes.length || now - lastNodeRefresh > NODE_REFRESH_MS) {
        refreshNodes();
        lastNodeRefresh = now;
        lastRectRefresh = 0;
      }
      if (!interactiveRects.length || now - lastRectRefresh > RECT_REFRESH_MS) {
        refreshRects();
        lastRectRefresh = now;
      }
    };

    const closestInteractiveDistance = (x: number, y: number): number => {
      let min = Number.POSITIVE_INFINITY;

      for (const r of interactiveRects) {
        const dx = x < r.left ? r.left - x : x > r.right ? x - r.right : 0;
        const dy = y < r.top ? r.top - y : y > r.bottom ? y - r.bottom : 0;
        const d = Math.hypot(dx, dy);
        if (d < min) min = d;
      }

      return min;
    };

    const onMove = (e: MouseEvent) => {
      const clickable = isClickable(e.target as HTMLElement);
      posRef.current.tx = e.clientX;
      posRef.current.ty = e.clientY;
      posRef.current.th = clickable ? 1 : 0;
    };

    const onScrollOrResize = () => {
      lastRectRefresh = 0;
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('scroll', onScrollOrResize, { passive: true });
    window.addEventListener('resize', onScrollOrResize);

    refreshNodes();
    refreshRects();
    let raf = 0;

    const loop = (now: number) => {
      const p = posRef.current;
      p.x += (p.tx - p.x) * 0.28;
      p.y += (p.ty - p.y) * 0.28;

      // Idea 5: proximity-based intensity to improve visibility near interactive elements.
      if (now - lastProxRefresh > PROX_REFRESH_MS) {
        refreshTargets(now);
        const d = closestInteractiveDistance(p.x, p.y);
        p.tp = Math.max(0, 1 - d / 190);
        lastProxRefresh = now;
      }
      p.h += (p.th - p.h) * 0.2;
      p.p += (p.tp - p.p) * 0.1;
      const influenceTarget = Math.max(p.h, p.p * 0.92);
      p.ts = 1 + influenceTarget * 0.7;
      p.tc = influenceTarget;

      // Grow fast, shrink slow
      const scaleRate = p.ts > p.scale ? 0.14 : 0.012;
      p.scale += (p.ts - p.scale) * scaleRate;
      // Color: shift to orange fast, back to teal slow
      const colorRate = p.tc > p.c ? 0.08 : 0.008;
      p.c += (p.tc - p.c) * colorRate;

      const size = 320 * p.scale;
      const transform = `translate3d(${p.x - size / 2}px, ${p.y - size / 2}px, 0)`;
      const baseOpacity = Math.min(1, 0.8 + (p.scale - 1) * 0.3);

      const rfTarget = document.body.classList.contains('runner-hovered') || document.body.classList.contains('contact-form-hovered') || document.body.classList.contains('nav-hovered') || document.body.classList.contains('about-photo-hovered') || document.body.classList.contains('projects-card-hovered') || document.body.classList.contains('popup-hovered') ? 1 : 0;
      runnerFadeRef.current += (rfTarget - runnerFadeRef.current) * 0.08;
      const rfMult = 1 - runnerFadeRef.current;

      if (tealRef.current) {
        tealRef.current.style.transform = transform;
        tealRef.current.style.width = size + 'px';
        tealRef.current.style.height = size + 'px';
        tealRef.current.style.opacity = String(baseOpacity * (1 - p.c * 0.92) * rfMult);
      }

      if (whiteRef.current) {
        whiteRef.current.style.transform = transform;
        whiteRef.current.style.width = size + 'px';
        whiteRef.current.style.height = size + 'px';
        whiteRef.current.style.opacity = String(baseOpacity * p.c * 0.55 * rfMult);
      }

      document.body.style.setProperty('--spotlight-prox', p.c.toFixed(3));
      document.body.style.setProperty('--spotlight-x', `${p.x.toFixed(1)}px`);
      document.body.style.setProperty('--spotlight-y', `${p.y.toFixed(1)}px`);
      if (p.c > 0.03) {
        document.body.classList.add('spotlight-near');
      } else {
        document.body.classList.remove('spotlight-near');
      }

      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('scroll', onScrollOrResize);
      window.removeEventListener('resize', onScrollOrResize);
      document.body.classList.remove('spotlight-near');
      document.body.style.removeProperty('--spotlight-prox');
      document.body.style.removeProperty('--spotlight-x');
      document.body.style.removeProperty('--spotlight-y');
    };
  }, []);

  if (isTouch) return null;

  const sharedStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: 320,
    height: 320,
    pointerEvents: 'none',
    zIndex: 5,
    filter: 'blur(14px)',
    mixBlendMode: 'screen',
    willChange: 'transform, width, height, opacity',
  };

  return (
    <>
      <div
        ref={tealRef}
        aria-hidden
        style={{
          ...sharedStyle,
          background: 'radial-gradient(circle at center, #3DCFB6ee 0%, #3DCFB688 25%, #3DCFB633 55%, transparent 75%)',
        }}
      />
      <div
        ref={whiteRef}
        aria-hidden
        style={{
          ...sharedStyle,
          // Ring shape in peach/orange — transparent core keeps button crisp, ring glows around it
          background: 'radial-gradient(circle at center, transparent 0%, transparent 18%, #FFB27Acc 34%, #FFB27A66 50%, transparent 68%)',
          opacity: 0,
        }}
      />
    </>
  );
}
