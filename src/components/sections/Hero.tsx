import { useRef } from 'react';
import { useLang } from '../../i18n/LanguageContext';
import { useInViewOnce, useMousePos } from '../../hooks/useAnim';

const TEAL   = '#3DCFB6';
const PEACH  = '#FFB27A';
const LILAC  = '#B8A4FF';
const YELLOW = '#F4E06D';
const PINK   = '#FF6D8A';
const SKY    = '#6EB3FF';

type Orb = { label: string; color: string; x: string; y: string; size: number };

const orbs: Orb[] = [
  { label: 'Angular',  color: TEAL,   x: '6%',  y: '18%', size: 86 },
  { label: 'React',    color: LILAC,  x: '88%', y: '14%', size: 74 },
  { label: 'TS',       color: PEACH,  x: '14%', y: '72%', size: 64 },
  { label: 'Firebase', color: YELLOW, x: '84%', y: '74%', size: 78 },
  { label: 'n8n',      color: PINK,   x: '22%', y: '42%', size: 58 },
  { label: 'Docker',   color: SKY,    x: '78%', y: '44%', size: 68 },
  { label: 'Git',      color: PEACH,  x: '4%',  y: '52%', size: 52 },
  { label: 'Scrum',    color: LILAC,  x: '94%', y: '54%', size: 48 },
  { label: 'REST',     color: TEAL,   x: '30%', y: '14%', size: 54 },
  { label: 'CSS',      color: YELLOW, x: '70%', y: '18%', size: 46 },
  { label: '{ }',      color: TEAL,   x: '44%', y: '90%', size: 52 },
  { label: '</>',      color: PINK,   x: '58%', y: '92%', size: 44 },
];

const btnPrimary: React.CSSProperties = {
  padding: '14px 26px', background: TEAL, color: '#000',
  borderRadius: 999, fontWeight: 700, textDecoration: 'none', fontSize: 15,
  border: '2px solid #000',
  boxShadow: '4px 4px 0 #000',
  transition: 'transform 150ms ease, box-shadow 150ms ease',
  display: 'inline-block',
};
const btnGhost: React.CSSProperties = {
  padding: '14px 26px', background: PEACH, color: '#000',
  borderRadius: 999, fontWeight: 700, textDecoration: 'none', fontSize: 15,
  border: '2px solid #000',
  boxShadow: '4px 4px 0 #000',
  transition: 'transform 150ms ease, box-shadow 150ms ease',
  display: 'inline-block',
};

export function Hero() {
  const { t } = useLang();
  const ref = useRef<HTMLElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const mouse = useMousePos(ref);
  const ctasInView = useInViewOnce(ctaRef, { rootMargin: '-20% 0px -20% 0px', threshold: 0.2 });
  const blurb = t('hero.blurb');
  const heroName = 'Jannik Hoff';
  const hasLeadingName = blurb.startsWith(heroName);

  return (
    <section
      id="top"
      ref={ref}
      style={{
        position: 'relative', zIndex: 1,
        minHeight: '88vh', padding: '80px 40px',
        overflowX: 'clip',
        display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
        textAlign: 'center',
      }}
    >
      {orbs.map((o, i) => {
        const width  = ref.current?.offsetWidth  ?? 0;
        const height = ref.current?.offsetHeight ?? 0;
        const cx = width  * (parseFloat(o.x) / 100);
        const cy = height * (parseFloat(o.y) / 100);
        const dx = mouse.inside ? (mouse.x - cx) * 0.03 : 0;
        const dy = mouse.inside ? (mouse.y - cy) * 0.03 : 0;
        return (
          <div
            key={i}
            style={{
              position: 'absolute', top: o.y, left: o.x, width: o.size, height: o.size,
              borderRadius: '50%',
              background: o.color, color: '#000',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 700, fontSize: o.size * 0.22,
              fontFamily: 'var(--ff-mono)',
              transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) rotate(${i * 17 - 20}deg)`,
              transition: 'transform 600ms cubic-bezier(0.2, 0.8, 0.2, 1)',
              boxShadow: `0 20px 50px ${o.color}40`,
              animation: `vc-float ${4 + i * 0.6}s ease-in-out infinite ${i * 0.3}s`,
            }}
          >
            {o.label}
          </div>
        );
      })}

      <div style={{ position: 'relative', zIndex: 2, maxWidth: 1000 }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 10,
          padding: '8px 16px', borderRadius: 999,
          background: 'rgba(61,207,182,0.12)', border: `1px solid ${TEAL}33`,
          fontSize: 13, color: TEAL, marginBottom: 32,
        }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: TEAL, boxShadow: `0 0 8px ${TEAL}` }} />
          {t('hero.status')}
        </div>

        <h1 style={{
          fontFamily: 'var(--ff-sans)',
          fontSize: 'clamp(72px, 13vw, 180px)',
          fontWeight: 800, lineHeight: 0.95, letterSpacing: '-0.03em',
          margin: '0 0 24px',
        }}>
          {t('hero.title1')}{' '}
          <span style={{
            display: 'inline-block', background: TEAL, color: '#000',
            padding: '0 20px', borderRadius: 12, transform: 'rotate(-2deg)',
          }}>{t('hero.titleAccent')}</span>
          {t('hero.titleEnd')}
        </h1>

        <p style={{
          fontSize: 20, maxWidth: 640, margin: '0 auto 40px',
          color: 'rgba(255,255,255,0.7)', lineHeight: 1.55,
        }}>
          {hasLeadingName ? (
            <>
              <span style={{
                color: '#fff',
                fontWeight: 800,
                textShadow: `0 0 22px ${TEAL}33`,
              }}>{heroName}</span>
              {blurb.slice(heroName.length)}
            </>
          ) : blurb}
        </p>

        <div ref={ctaRef} style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
          <div className={`cta-enter cta-enter-left ${ctasInView ? 'cta-in' : ''}`}>
            <a href="#projects" className="cta-fx cta-teal" style={btnPrimary}>{t('hero.workCta')} →</a>
          </div>
          <div className={`cta-enter cta-enter-right ${ctasInView ? 'cta-in' : ''}`}>
            <a href="#contact" className="cta-fx cta-peach" style={btnGhost}>{t('hero.contactCta')}</a>
          </div>
        </div>
      </div>
    </section>
  );
}
