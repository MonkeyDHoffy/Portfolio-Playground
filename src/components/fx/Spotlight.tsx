import { useEffect, useRef } from 'react';

/**
 * Teal spotlight cursor that follows the mouse and grows over clickable elements.
 * 1:1 port of VC_Spotlight from variant-c.jsx.
 */
export function Spotlight() {
  const ref = useRef<HTMLDivElement>(null);
  const posRef = useRef({ x: -400, y: -400, tx: -400, ty: -400, scale: 1, ts: 1 });

  useEffect(() => {
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
    const onMove = (e: MouseEvent) => {
      posRef.current.tx = e.clientX;
      posRef.current.ty = e.clientY;
      posRef.current.ts = isClickable(e.target as HTMLElement) ? 1.7 : 1;
    };
    window.addEventListener('mousemove', onMove);
    let raf = 0;
    const loop = () => {
      const p = posRef.current;
      p.x += (p.tx - p.x) * 0.22;
      p.y += (p.ty - p.y) * 0.22;
      p.scale += (p.ts - p.scale) * 0.14;
      if (ref.current) {
        const size = 320 * p.scale;
        ref.current.style.transform = `translate3d(${p.x - size / 2}px, ${p.y - size / 2}px, 0)`;
        ref.current.style.width = size + 'px';
        ref.current.style.height = size + 'px';
        ref.current.style.opacity = String(Math.min(1, 0.8 + (p.scale - 1) * 0.3));
      }
      raf = requestAnimationFrame(loop);
    };
    loop();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: 320,
        height: 320,
        pointerEvents: 'none',
        zIndex: 5,
        background:
          'radial-gradient(circle at center, #3DCFB6ee 0%, #3DCFB688 25%, #3DCFB633 55%, transparent 75%)',
        filter: 'blur(14px)',
        mixBlendMode: 'screen',
        transition: 'opacity 200ms ease',
        willChange: 'transform, width, height',
      }}
    />
  );
}
