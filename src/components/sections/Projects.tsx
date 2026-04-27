import { useState } from 'react';
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
  const count = projects.length;

  const go = (dir: -1 | 1) => setActive((a) => (a + dir + count) % count);
  const toggleFlip = (key: string) => setFlipped((s) => {
    const n = new Set(s);
    if (n.has(key)) n.delete(key); else n.add(key);
    return n;
  });

  return (
    <section id="projects" style={{ padding: 'clamp(48px, 8vw, 64px) 40px', position: 'relative', zIndex: 1 }}>
      <div style={{ maxWidth: 1240, margin: '0 auto' }}>
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
        <p style={{ maxWidth: 600, fontSize: 17, color: 'rgba(255,255,255,0.7)', margin: '0 0 48px' }}>
          {t('projects.intro')} <span style={{ color: TEAL }}>{t('projects.clickHint')}</span>
        </p>

        <div style={{ position: 'relative' }}>
          {/* Stage */}
          <div
            className="pc-stage"
            style={{
              position: 'relative',
              height: 620,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              perspective: 1400,
            }}
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
              return (
                <div
                  key={p.key}
                  className={`pc-card ${abs === 0 ? 'pc-card-active' : 'pc-card-side'}`}
                  style={{
                    position: 'absolute',
                    width: 360,
                    aspectRatio: '3/4',
                    transform: `translateX(${translateX}px) scale(${scale}) rotateY(${rotateY}deg) rotate(${abs === 0 ? rot : 0}deg)`,
                    opacity,
                    zIndex,
                    transition: 'transform 600ms cubic-bezier(.22,.9,.3,1), opacity 400ms ease',
                    pointerEvents: abs > 1 ? 'none' : 'auto',
                    filter: abs === 0 ? 'none' : 'brightness(0.55) saturate(0.9)',
                    cursor: abs === 0 ? 'pointer' : 'pointer',
                  }}
                  onClick={() => {
                    if (abs === 0) toggleFlip(p.key);
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
                        color: '#000', fontFamily: 'var(--ff-mono)', fontSize: 11, fontWeight: 600,
                      }}>
                        <span>{p.index} · {p.year}</span>
                        <span style={{ padding: '3px 8px', background: 'rgba(0,0,0,0.1)', borderRadius: 999 }}>
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
                        <a href={p.live} target="_blank" rel="noreferrer" style={{
                          flex: 1, padding: '10px 14px', background: color, color: '#000', borderRadius: 10,
                          fontWeight: 700, fontSize: 13, textDecoration: 'none', textAlign: 'center',
                        }}>{t('projects.liveDemo')} ↗</a>
                        <a href={p.github} target="_blank" rel="noreferrer" style={{
                          flex: 1, padding: '10px 14px', background: 'transparent', color: '#fff',
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
            <button onClick={() => go(-1)} aria-label={t('projects.prev')} style={navBtn}>←</button>
            <div style={{ display: 'flex', gap: 8 }}>
              {projects.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
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
            <button onClick={() => go(1)} aria-label={t('projects.next')} style={navBtn}>→</button>
          </div>
        </div>
      </div>
      <style>{`
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
        @media (max-width: 560px) {
          .pc-stage { height: 560px !important; }
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
  width: 44, height: 44, borderRadius: 999,
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.18)',
  color: '#fff', fontSize: 18, cursor: 'pointer',
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
  transition: 'all 150ms ease',
};
