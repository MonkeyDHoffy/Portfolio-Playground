import { useEffect, useRef, useState } from 'react';
import { useLang } from '../../i18n/LanguageContext';
import { projects } from '../../data/projects';
import { SectionLabel } from '../ui/SectionLabel';
import { SpotlightReactiveText } from '../ui/SpotlightReactiveText';
import { useIsPhone } from '../../hooks/useIsPhone';

const TEAL  = '#3DCFB6';
const PEACH = '#FFB27A';
const LILAC = '#B8A4FF';
const LINE  = 'rgba(255,255,255,0.12)';
const COLORS = [TEAL, PEACH, LILAC];

const navCtaStyle: React.CSSProperties = {
  width: 52,
  height: 36,
  padding: 0,
  background: PEACH,
  color: '#000',
  borderRadius: 999,
  border: '2px solid #000',
  boxShadow: '3px 3px 0 #000',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  lineHeight: 1,
};

export function Projects() {
  const { t, lang } = useLang();
  const [active, setActive] = useState(0);
  const [flipped, setFlipped] = useState<Set<string>>(new Set());
  const isPhone = useIsPhone();
  const [swipeAnim, setSwipeAnim] = useState<'left' | 'right' | null>(null);
  const count = projects.length;
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const touchDelta = useRef({ x: 0, y: 0 });
  const suppressTapUntil = useRef(0);
  const SWIPE_THRESHOLD = 56;
  const SWIPE_LOCK_RATIO = 1.15;

  useEffect(() => {
    return () => {
      document.body.classList.remove('projects-card-hovered');
    };
  }, []);

  const go = (dir: -1 | 1) => setActive((a) => (a + dir + count) % count);
  const toggleFlip = (key: string) => setFlipped((s) => {
    const n = new Set(s);
    if (n.has(key)) n.delete(key); else n.add(key);
    return n;
  });

  const onTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isPhone || e.touches.length !== 1) return;
    const t = e.touches[0];
    touchStart.current = { x: t.clientX, y: t.clientY };
    touchDelta.current = { x: 0, y: 0 };
  };

  const onTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isPhone || !touchStart.current || e.touches.length !== 1) return;
    const t = e.touches[0];
    const dx = t.clientX - touchStart.current.x;
    const dy = t.clientY - touchStart.current.y;
    touchDelta.current = { x: dx, y: dy };

    // Lock vertical page scroll only during clear horizontal swipes.
    if (Math.abs(dx) > Math.abs(dy) * SWIPE_LOCK_RATIO) {
      e.preventDefault();
    }
  };

  const onTouchEnd = () => {
    if (!isPhone || !touchStart.current) return;
    const { x: dx, y: dy } = touchDelta.current;

    if (Math.abs(dx) >= SWIPE_THRESHOLD && Math.abs(dx) > Math.abs(dy) * SWIPE_LOCK_RATIO) {
      setSwipeAnim(dx < 0 ? 'left' : 'right');
      go(dx < 0 ? 1 : -1);
      suppressTapUntil.current = Date.now() + 320;
    }

    touchStart.current = null;
    touchDelta.current = { x: 0, y: 0 };
  };

  return (
    <section id="projects" className="projects-section" style={{ padding: 'clamp(48px, 8vw, 64px) clamp(16px, 5vw, 40px)', position: 'relative', zIndex: 1 }}>
      <div style={{ maxWidth: 1240, margin: '0 auto' }}>
        <div style={{ maxWidth: 'var(--maxw)', margin: '0 auto 48px' }}>
          <SectionLabel n={t('projects.index')} text={t('projects.label')} />
          <h2 style={{
            fontSize: 'clamp(40px, 6vw, 88px)', fontWeight: 800, lineHeight: 1,
            letterSpacing: '-0.03em', margin: '0 0 20px',
          }}>
            {t('projects.titleA')}{' '}
            <SpotlightReactiveText text={t('projects.titleB')} radius={260} />.
          </h2>
          <p style={{ maxWidth: 600, fontSize: 17, color: 'rgba(255,255,255,0.7)', margin: 0 }}>
            {t('projects.intro')} <span style={{ color: TEAL }}>{t('projects.clickHint')}</span>
          </p>
        </div>

        <div style={{ position: 'relative' }}>
          {/* Stage */}
          <div
            className="pc-stage"
            style={{
              position: 'relative',
              height: isPhone ? 540 : 620,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              perspective: isPhone ? 900 : 1400,
              overflow: 'hidden',
              touchAction: isPhone ? 'pan-y' : 'auto',
            }}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            onTouchCancel={onTouchEnd}
          >
            {projects.map((p, i) => {
              const offset = ((i - active + count) % count);
              // map [0, count-1] → signed offset around center
              const signed = offset > count / 2 ? offset - count : offset;
              const abs = Math.abs(signed);
              const translateX = signed * 360;
              const scale = abs === 0 ? 1 : 0.82;
              const rotateY = signed * -14;
              const opacity = abs > 1 ? 0 : 1;
              const zIndex = 10 - abs;
              const rot = [-3, 2, -1.5][i % 3];
              const color = COLORS[i % COLORS.length];
              const isFlipped = flipped.has(p.key);
              const isActive = abs === 0;
              return (
                <div
                  key={p.key}
                  className={`pc-card ${isActive ? 'pc-card-active' : 'pc-card-side'}${isPhone ? ' pc-card-mobile' : ''}`}
                  style={{
                    position: isPhone ? 'relative' : 'absolute',
                    width: isPhone ? 'min(100%, 360px)' : 360,
                    maxWidth: isPhone ? '100%' : undefined,
                    aspectRatio: '3/4',
                    transform: isPhone
                      ? `scale(1) rotate(${isActive ? rot * 0.35 : 0}deg)`
                      : `translateX(${translateX}px) scale(${scale}) rotateY(${rotateY}deg) rotate(${isActive ? rot : 0}deg)`,
                    opacity: isPhone ? (isActive ? 1 : 0) : opacity,
                    zIndex: isPhone ? (isActive ? 10 : 0) : zIndex,
                    transition: 'transform 600ms cubic-bezier(.22,.9,.3,1), opacity 400ms ease',
                    animation: isPhone && isActive && swipeAnim
                      ? `${swipeAnim === 'left' ? 'pc-swipe-in-left' : 'pc-swipe-in-right'} 320ms cubic-bezier(.22,.9,.3,1)`
                      : undefined,
                    pointerEvents: isPhone ? (isActive ? 'auto' : 'none') : (abs > 1 ? 'none' : 'auto'),
                    filter: isPhone ? 'none' : (isActive ? 'none' : 'brightness(0.55) saturate(0.9)'),
                    cursor: 'pointer',
                    display: isPhone ? (isActive ? 'block' : 'none') : 'block',
                    margin: isPhone ? '0 auto' : undefined,
                  }}
                  onAnimationEnd={() => {
                    if (swipeAnim) setSwipeAnim(null);
                  }}
                  onClick={() => {
                    if (Date.now() < suppressTapUntil.current) return;
                    if (isActive) toggleFlip(p.key);
                    else setActive(i);
                  }}
                  onMouseEnter={() => {
                    if (!isPhone) document.body.classList.add('projects-card-hovered');
                  }}
                  onMouseLeave={() => {
                    document.body.classList.remove('projects-card-hovered');
                  }}
                >
                  <div className="pc-card-aura" aria-hidden />
                  <div style={{
                    position: 'relative', width: '100%', height: '100%',
                    transformStyle: 'preserve-3d',
                    transition: 'transform 600ms cubic-bezier(0.3, 0.7, 0.2, 1)',
                    transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                    zIndex: 2,
                  }}>
                    {/* Front */}
                    <div className="pc-front" style={{
                      position: 'absolute', inset: 0, backfaceVisibility: 'hidden',
                      borderRadius: 20, overflow: 'hidden',
                      background: color,
                      border: '2px solid #000',
                      boxShadow: '6px 6px 0 #000',
                      display: 'flex', flexDirection: 'column',
                    }}>
                      <div style={{
                        padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        color: '#000', fontFamily: 'var(--ff-mono)', fontSize: 14, fontWeight: 700,
                      }}>
                        <span style={{ fontSize: 24, letterSpacing: '0.06em', fontWeight: 900, lineHeight: 1 }}>{p.index}</span>
                        <span style={{ padding: '8px 14px', fontSize: 16, letterSpacing: '0.04em', background: 'rgba(0,0,0,0.1)', borderRadius: 999, fontWeight: 900, lineHeight: 1 }}>
                          ↻ {t('projects.flip')}
                        </span>
                      </div>
                      <div style={{ flex: 1, padding: '0 20px 20px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                        <div style={{ borderRadius: 14, overflow: 'hidden', marginBottom: 16, border: '1px solid rgba(0,0,0,0.15)' }}>
                          <img src={p.image} alt={p.title} loading="lazy" style={{
                            width: '100%', aspectRatio: '4/3', objectFit: 'cover', display: 'block',
                          }} />
                        </div>
                        <div style={{ color: '#000' }}>
                          <h3 style={{ fontSize: 32, fontWeight: 800, margin: '0 0 4px', letterSpacing: '-0.02em' }}>{p.title}</h3>
                          <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: 'rgba(0,0,0,0.75)' }}>{p.tag[lang]}</p>
                        </div>
                      </div>
                    </div>
                    {/* Back */}
                    <div style={{
                      position: 'absolute', inset: 0, backfaceVisibility: 'hidden',
                      transform: 'rotateY(180deg)',
                      borderRadius: 20, overflow: 'hidden',
                      background: '#1a1a1a', border: `2px solid ${color}`,
                      padding: 24,
                      display: 'flex', flexDirection: 'column',
                    }}>
                      <div style={{
                        fontFamily: 'var(--ff-mono)', fontSize: 11, color, marginBottom: 16,
                        display: 'flex', justifyContent: 'space-between',
                      }}>
                        <span>/ {p.title.toLowerCase()}</span>
                        <span>{p.index}</span>
                      </div>
                      <h3 style={{ fontSize: 26, fontWeight: 800, margin: '0 0 16px' }}>{p.title}</h3>
                      <p style={{ fontSize: 14, lineHeight: 1.6, color: 'rgba(255,255,255,0.8)', margin: '0 0 20px', flex: 1 }}>
                        {p.description[lang]}
                      </p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 20 }}>
                        {p.stack.map((tech) => (
                          <span key={tech} style={{
                            fontFamily: 'var(--ff-mono)', fontSize: 10,
                            padding: '3px 8px', borderRadius: 999,
                            background: `${color}22`, color,
                            border: `1px solid ${color}55`,
                          }}>{tech}</span>
                        ))}
                      </div>
                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }} onClick={(e) => e.stopPropagation()}>
                        {p.live && (
                          <a href={p.live} target="_blank" rel="noreferrer" style={{
                            flex: 1, padding: '10px 14px', background: color, color: '#000', borderRadius: 10,
                            fontWeight: 700, fontSize: 13, textDecoration: 'none', textAlign: 'center',
                          }}>{t('projects.liveDemo')} ↗</a>
                        )}
                        <a href={p.github} target="_blank" rel="noreferrer" style={{
                          flex: p.live ? 1 : '1 1 100%', padding: '10px 14px', background: 'transparent', color: '#fff',
                          border: `1px solid ${LINE}`, borderRadius: 10,
                          fontWeight: 600, fontSize: 13, textDecoration: 'none', textAlign: 'center',
                        }}>GitHub</a>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Nav */}
          <div style={{
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            gap: 16, marginTop: 24,
          }}>
            <button
              onMouseDown={(e) => e.preventDefault()}
              onClick={(e) => {
                go(-1);
                e.currentTarget.blur();
              }}
              aria-label={t('projects.prev')}
              className="cta-fx cta-peach nav-cta-arrow"
              style={navCtaStyle}
            ><span className="triangle triangle-left" /></button>
            <div style={{ display: 'flex', gap: 8 }}>
              {projects.map((_, i) => (
                <button
                  key={i}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={(e) => {
                    setActive(i);
                    e.currentTarget.blur();
                  }}
                  aria-label={`Go to project ${i + 1}`}
                  style={{
                    width: i === active ? 28 : 10, height: 10, borderRadius: 999,
                    background: i === active ? TEAL : 'rgba(255,255,255,0.25)',
                    border: 'none', cursor: 'pointer',
                    transition: 'all 250ms ease',
                  }}
                />
              ))}
            </div>
            <button
              onMouseDown={(e) => e.preventDefault()}
              onClick={(e) => {
                go(1);
                e.currentTarget.blur();
              }}
              aria-label={t('projects.next')}
              className="cta-fx cta-peach nav-cta-arrow"
              style={navCtaStyle}
            ><span className="triangle triangle-right" /></button>
          </div>
        </div>
      </div>
      <style>{`
        .triangle {
          display: block;
          width: 0;
          height: 0;
          border-top: 6px solid transparent;
          border-bottom: 6px solid transparent;
        }
        .triangle-left {
          border-right: 9px solid currentColor;
          margin-right: 1px;
        }
        .triangle-right {
          border-left: 9px solid currentColor;
          margin-left: 1px;
        }
        .nav-cta-arrow:focus-visible {
          outline: 2px solid #3DCFB6;
          outline-offset: 2px;
        }
        .pc-front::after {
          content: '';
          position: absolute;
          top: -135%;
          left: -56%;
          width: 22%;
          height: 380%;
          background: linear-gradient(112deg, transparent 0%, rgba(255,255,255,0.1) 42%, rgba(255,255,255,0.34) 50%, rgba(255,255,255,0.1) 58%, transparent 100%);
          transform: rotate(18deg) translateX(-340%);
          pointer-events: none;
          z-index: 3;
          opacity: 0;
          will-change: transform, opacity;
        }
        .pc-card:hover {
          animation: vc-project-card-wobble 480ms ease;
        }
        .pc-card-aura {
          position: absolute;
          inset: -4px;
          border-radius: 24px;
          pointer-events: none;
          z-index: 1;
          opacity: 0;
          transition: opacity 400ms ease;
          box-shadow: 0 0 0 1px rgba(255,178,122,0.25), 0 0 32px 8px rgba(255,178,122,0.3), 0 0 80px 20px rgba(255,178,122,0.14);
        }
        .pc-card:hover .pc-front::after {
          opacity: 0.96;
          animation: vc-project-card-shimmer 1360ms cubic-bezier(0.25, 0.7, 0.3, 1) infinite;
        }
        @media (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference) {
          .pc-card:hover .pc-card-aura {
            opacity: 1;
            animation: element-aura-breathe 3.2s ease-in-out infinite;
          }
        }
        .pc-card-side:hover {
          filter: brightness(0.9) saturate(1) !important;
        }
        @keyframes vc-project-card-wobble {
          0% { rotate: 0deg; }
          24% { rotate: -1.1deg; }
          48% { rotate: 0.9deg; }
          72% { rotate: -0.45deg; }
          100% { rotate: 0deg; }
        }
        @keyframes vc-project-card-shimmer {
          0% {
            transform: rotate(18deg) translateX(-340%);
            opacity: 0;
          }
          12% {
            opacity: 0.96;
          }
          86% {
            opacity: 0.96;
          }
          100% {
            transform: rotate(18deg) translateX(760%);
            opacity: 0;
          }
        }
        @keyframes pc-swipe-in-left {
          from {
            transform: translateX(52px) scale(0.98);
            opacity: 0.55;
          }
          to {
            transform: translateX(0) scale(1);
            opacity: 1;
          }
        }
        @keyframes pc-swipe-in-right {
          from {
            transform: translateX(-52px) scale(0.98);
            opacity: 0.55;
          }
          to {
            transform: translateX(0) scale(1);
            opacity: 1;
          }
        }
        @media (max-width: 860px) {
          .projects-section {
            overflow-x: clip;
          }
          .pc-stage {
            height: 540px !important;
          }
          .pc-card-mobile {
            width: min(100%, 360px) !important;
          }
        }
        @media (max-width: 560px) {
          .pc-stage {
            height: 520px !important;
          }
          .pc-card-mobile {
            width: min(100%, 332px) !important;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .pc-card:hover {
            animation: none;
          }
          .pc-card-aura,
          .pc-card:hover .pc-card-aura {
            animation: none !important;
            transition: none !important;
          }
          .pc-front::after,
          .pc-card:hover .pc-front::after {
            display: none;
            animation: none;
          }
        }
      `}</style>
    </section>
  );
}
