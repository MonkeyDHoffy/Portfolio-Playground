import { useEffect, useRef, useState } from 'react';
import { useLang } from '../../i18n/LanguageContext';
import { projects } from '../../data/projects';
import { SectionLabel } from '../ui/SectionLabel';

const TEAL  = '#3DCFB6';
const PEACH = '#FFB27A';
const LILAC = '#B8A4FF';
const LINE  = 'rgba(255,255,255,0.12)';
const COLORS = [TEAL, PEACH, LILAC];

export function Projects() {
  const { t, lang } = useLang();
  const [active, setActive] = useState(0);
  const [flipped, setFlipped] = useState<Set<string>>(new Set());
  const [isPhone, setIsPhone] = useState(() => window.innerWidth <= 860);
  const [swipeAnim, setSwipeAnim] = useState<'left' | 'right' | null>(null);
  const count = projects.length;
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const touchDelta = useRef({ x: 0, y: 0 });
  const suppressTapUntil = useRef(0);
  const SWIPE_THRESHOLD = 56;
  const SWIPE_LOCK_RATIO = 1.15;

  useEffect(() => {
    const onResize = () => setIsPhone(window.innerWidth <= 860);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
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
            <em style={{
              fontStyle: 'italic', fontWeight: 400,
              background: `linear-gradient(90deg, ${TEAL}, ${LILAC})`,
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>{t('projects.titleB')}</em>.
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
                >
                  <div style={{
                    position: 'relative', width: '100%', height: '100%',
                    transformStyle: 'preserve-3d',
                    transition: 'transform 600ms cubic-bezier(0.3, 0.7, 0.2, 1)',
                    transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
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
              className="nav-btn"
            ><span style={{ display:'block', width:0, height:0, borderTop:'6px solid transparent', borderBottom:'6px solid transparent', borderRight:'9px solid currentColor', marginRight:1 }} /></button>
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
              className="nav-btn"
            ><span style={{ display:'block', width:0, height:0, borderTop:'6px solid transparent', borderBottom:'6px solid transparent', borderLeft:'9px solid currentColor', marginLeft:1 }} /></button>
          </div>
        </div>
      </div>
      <style>{`
        .pc-front::after {
          .nav-btn {
            width: 44px; height: 44px; border-radius: 999px;
            background: transparent;
            border: 1px solid rgba(255,255,255,0.18);
            color: rgba(255,255,255,0.45);
            cursor: pointer;
            display: inline-flex; align-items: center; justify-content: center;
            transition: all 150ms ease;
          }
          .nav-btn:hover {
            background: rgba(61,207,182,0.1);
            border-color: #3DCFB6;
            color: #3DCFB6;
          }
          .pc-front::after {
          content: '';
          position: absolute;
          top: -120%;
          left: -42%;
          width: 26%;
          height: 340%;
          background: linear-gradient(115deg, transparent 0%, rgba(255,255,255,0.14) 45%, rgba(255,255,255,0.46) 50%, rgba(255,255,255,0.14) 55%, transparent 100%);
          transform: rotate(18deg) translateX(-260%);
          pointer-events: none;
          z-index: 3;
          opacity: 0;
        }
        .pc-card:hover {
          animation: vc-project-card-wobble 480ms ease;
        }
        .pc-card:hover .pc-front::after {
          opacity: 1;
          animation: vc-project-card-shimmer 680ms ease;
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
          from { transform: rotate(18deg) translateX(-260%); }
          to   { transform: rotate(18deg) translateX(520%); }
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

const navBtn: React.CSSProperties = {
  width: 44,
  height: 44,
  borderRadius: 999,
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.18)',
  color: '#fff',
  fontSize: 18,
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'all 150ms ease',
};
