import { useEffect, useMemo, useRef, type CSSProperties } from 'react';

type SpotlightReactiveTextProps = {
  text: string;
  className?: string;
  style?: CSSProperties;
  radius?: number;
};

const BASE_A = '#3DCFB6';
const BASE_B = '#B8A4FF';
const WARM_A = '#FFB27A';
const WARM_B = '#FFC091';

function mixHex(a: string, b: string, t: number): string {
  const aNum = parseInt(a.slice(1), 16);
  const bNum = parseInt(b.slice(1), 16);

  const ar = (aNum >> 16) & 0xff;
  const ag = (aNum >> 8) & 0xff;
  const ab = aNum & 0xff;
  const br = (bNum >> 16) & 0xff;
  const bg = (bNum >> 8) & 0xff;
  const bb = bNum & 0xff;

  const r = Math.round(ar + (br - ar) * t);
  const g = Math.round(ag + (bg - ag) * t);
  const bch = Math.round(ab + (bb - ab) * t);

  return `rgb(${r}, ${g}, ${bch})`;
}

function gradientFor(mix: number): string {
  if (mix <= 0.001) {
    return `linear-gradient(90deg, ${BASE_A}, ${BASE_B})`;
  }
  const left = mixHex(BASE_A, WARM_A, mix);
  const right = mixHex(BASE_B, WARM_B, mix);
  return `linear-gradient(90deg, ${left}, ${right})`;
}

function glowFor(mix: number): string {
  const inner = 6 + mix * 18;
  const outer = 16 + mix * 36;
  const a = (0.05 + mix * 0.31).toFixed(3);
  const b = (0.025 + mix * 0.22).toFixed(3);
  return `0 0 ${inner.toFixed(1)}px rgba(255, 178, 122, ${a}), 0 0 ${outer.toFixed(1)}px rgba(255, 207, 164, ${b})`;
}

export function SpotlightReactiveText({
  text,
  className,
  style,
  radius = 260,
}: SpotlightReactiveTextProps) {
  const chars = useMemo(() => Array.from(text), [text]);
  const wordRef = useRef<HTMLElement | null>(null);
  const charRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const centersRef = useRef<{ x: number; y: number; offsetX: number; active: boolean }[]>([]);
  const mixRef = useRef<number[]>([]);
  const wordWidthRef = useRef(0);

  useEffect(() => {
    charRefs.current = charRefs.current.slice(0, chars.length);
    mixRef.current = Array(chars.length).fill(0);

    const measure = () => {
      const wordRect = wordRef.current?.getBoundingClientRect();
      wordWidthRef.current = wordRect?.width ?? 0;

      centersRef.current = charRefs.current.map((node, i) => {
        const isSpace = chars[i] === ' ';
        if (!node || isSpace || !wordRect) return { x: 0, y: 0, offsetX: 0, active: false };
        const r = node.getBoundingClientRect();
        return {
          x: r.left + r.width * 0.5,
          y: r.top + r.height * 0.5,
          offsetX: r.left - wordRect.left,
          active: true,
        };
      });
    };

    measure();

    if (window.matchMedia('(pointer: coarse)').matches) return;

    let raf = 0;
    let measureRaf = 0;

    const scheduleMeasure = () => {
      if (measureRaf) return;
      measureRaf = window.requestAnimationFrame(() => {
        measureRaf = 0;
        measure();
      });
    };

    const onViewportChange = () => scheduleMeasure();

    window.addEventListener('resize', onViewportChange);
    window.addEventListener('scroll', onViewportChange, { passive: true });

    const ro = new ResizeObserver(() => scheduleMeasure());
    for (const node of charRefs.current) {
      if (node) ro.observe(node);
    }

    const loop = () => {
      const sx = parseFloat(getComputedStyle(document.body).getPropertyValue('--spotlight-x'));
      const sy = parseFloat(getComputedStyle(document.body).getPropertyValue('--spotlight-y'));
      const hasCursor = Number.isFinite(sx) && Number.isFinite(sy);

      for (let i = 0; i < chars.length; i += 1) {
        const node = charRefs.current[i];
        const center = centersRef.current[i];
        if (!node || !center?.active) continue;

        const prev = mixRef.current[i] ?? 0;
        let target = 0;

        if (hasCursor) {
          const dx = center.x - sx;
          const dy = center.y - sy;
          const d = Math.hypot(dx, dy);
          const raw = Math.max(0, 1 - d / radius);
          const smooth = raw * raw * (3 - 2 * raw);
          target = Math.min(1, smooth * 1.18);
        }

        const next = prev + (target - prev) * 0.24;
        mixRef.current[i] = next;

        if (Math.abs(next - prev) > 0.01) {
          node.style.backgroundImage = gradientFor(next);
          if (wordWidthRef.current > 0) {
            node.style.backgroundSize = `${wordWidthRef.current.toFixed(2)}px 100%`;
            node.style.backgroundPosition = `${(-center.offsetX).toFixed(2)}px 0px`;
          }
          node.style.textShadow = glowFor(next);
          node.style.filter = `brightness(${(1 + next * 0.2).toFixed(3)}) saturate(${(1 + next * 0.36).toFixed(3)})`;
        }
      }

      raf = window.requestAnimationFrame(loop);
    };

    raf = window.requestAnimationFrame(loop);

    return () => {
      window.cancelAnimationFrame(raf);
      if (measureRaf) window.cancelAnimationFrame(measureRaf);
      window.removeEventListener('resize', onViewportChange);
      window.removeEventListener('scroll', onViewportChange);
      ro.disconnect();
    };
  }, [chars, radius]);

  return (
    <em
      className={className}
      ref={(node) => {
        wordRef.current = node;
      }}
      style={{
        fontStyle: 'italic',
        fontWeight: 400,
        display: 'inline',
        lineHeight: 1.14,
        overflow: 'visible',
        whiteSpace: 'nowrap',
        ...style,
      }}
    >
      {chars.map((ch, i) => (
        <span
          key={`${ch}-${i}`}
          ref={(node) => {
            charRefs.current[i] = node;
          }}
          style={{
            display: 'inline-block',
            backgroundImage: gradientFor(0),
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundRepeat: 'no-repeat',
            overflow: 'visible',
            lineHeight: '1.14',
            paddingBottom: '0.075em',
            paddingLeft: '0.045em',
            paddingRight: '0.045em',
            marginLeft: '-0.045em',
            marginRight: '-0.045em',
            textShadow: glowFor(0),
            filter: 'brightness(1) saturate(1)',
          }}
        >
          {ch}
        </span>
      ))}
    </em>
  );
}