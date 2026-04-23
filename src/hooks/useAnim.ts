import { useEffect, useState, type RefObject } from 'react';

export function useMousePos(ref?: RefObject<HTMLElement>) {
  const [pos, setPos] = useState({ x: -9999, y: -9999, inside: false });
  useEffect(() => {
    const el = ref?.current ?? window;
    const onMove = (e: Event) => {
      const ev = e as MouseEvent;
      const target = ref?.current;
      if (target) {
        const r = target.getBoundingClientRect();
        setPos({ x: ev.clientX - r.left, y: ev.clientY - r.top, inside: true });
      } else {
        setPos({ x: ev.clientX, y: ev.clientY, inside: true });
      }
    };
    const onLeave = () => setPos((p) => ({ ...p, inside: false }));
    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
    return () => {
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
    };
  }, [ref]);
  return pos;
}

export function useInViewOnce<T extends HTMLElement>(
  ref: RefObject<T>,
  opts: { rootMargin?: string; threshold?: number } = {}
) {
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || seen) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(true);
          obs.disconnect();
        }
      },
      { rootMargin: opts.rootMargin || '-10% 0px -10% 0px', threshold: opts.threshold ?? 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [ref, seen, opts.rootMargin, opts.threshold]);
  return seen;
}

/** Auto-reveal: fades in sections/articles/headings when scrolled into view. */
export function useAutoScrollReveal<T extends HTMLElement>(rootRef: RefObject<T>) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const targets = Array.from(
      root.querySelectorAll<HTMLElement>('section, article, h1, h2, h3, .reveal')
    );
    const ease = 'cubic-bezier(.22,.9,.3,1)';
    targets.forEach((el) => {
      if (el.dataset.revealInit) return;
      el.dataset.revealInit = '1';
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = `opacity 600ms ${ease}, transform 600ms ${ease}`;
      el.style.willChange = 'opacity, transform';
    });
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            const delay = (i % 4) * 60;
            setTimeout(() => {
              el.style.opacity = '1';
              el.style.transform = 'translateY(0)';
            }, delay);
            obs.unobserve(el);
          }
        });
      },
      { rootMargin: '-8% 0px -8% 0px', threshold: 0.08 }
    );
    targets.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [rootRef]);
}
