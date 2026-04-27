import { useState } from 'react';
import { useLang } from '../../i18n/LanguageContext';
import { SectionLabel } from '../ui/SectionLabel';

const TEAL  = '#3DCFB6';
const PEACH = '#FFB27A';
const LILAC = '#B8A4FF';
const YELLOW = '#F4E06D';
const LINE = 'rgba(255,255,255,0.12)';

export function About() {
  const { t } = useLang();
  const items = [
    { emoji: '📍', color: TEAL,  text: t('about.location') },
    { emoji: '🧠', color: LILAC, text: t('about.cognition') },
    { emoji: '🛠', color: PEACH, text: t('about.releases') },
  ];
  return (
    <section id="about" style={{ padding: 'clamp(48px, 8vw, 64px) 40px', position: 'relative', zIndex: 1 }}>
      <div style={{ maxWidth: 1180, margin: '0 auto' }}>
        <SectionLabel n={t('about.index')} text={t('about.label')} />
        <div
          className="about-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1.5fr',
            gap: 80,
            alignItems: 'start',
          }}
        >
          <div style={{ position: 'relative' }}>
            <div style={{
              position: 'absolute', top: -20, right: -20, zIndex: 2,
              width: 100, height: 100, borderRadius: '50%', background: YELLOW, color: '#000',
              display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center',
              fontSize: 12, fontWeight: 700, lineHeight: 1.2,
              transform: 'rotate(12deg)',
              animation: 'vc-spin 12s linear infinite',
            }}>
              <span style={{ transform: 'rotate(-12deg)', padding: 8 }}>
                {t('about.stickerA')}<br />{t('about.stickerB')}<br />{t('about.stickerC')}
              </span>
            </div>
            <AboutPhotoFlip />
          </div>
          <div>
            <h2 style={{
              fontSize: 'clamp(40px, 6vw, 88px)', fontWeight: 800, lineHeight: 1,
              letterSpacing: '-0.03em', margin: '0 0 32px',
            }}>
              {t('about.title')}
            </h2>
            <p
              className="about-intro-hover"
              style={{ fontSize: 19, lineHeight: 1.55, margin: '0 0 24px', color: 'rgba(255,255,255,0.85)' }}
            >
              {t('about.p1')}
            </p>
            <div style={{ display: 'grid', gap: 16, marginTop: 32 }}>
              {items.map((it, i) => (
                <div key={i} style={{
                  display: 'flex', gap: 16, padding: 16,
                  background: 'rgba(255,255,255,0.03)',
                  border: `1px solid ${LINE}`, borderRadius: 14,
                  transform: `rotate(${(i - 1) * 0.5}deg)`,
                }}>
                  <div style={{
                    flexShrink: 0, width: 44, height: 44, borderRadius: 12,
                    background: it.color, color: '#000',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22,
                  }}>{it.emoji}</div>
                  <p style={{ margin: 0, fontSize: 14, lineHeight: 1.55, color: 'rgba(255,255,255,0.85)' }}>{it.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <style>{`
        .about-intro-hover {
          transition: color 220ms ease, transform 220ms ease;
          transform-origin: left center;
        }
        .about-intro-hover:hover {
          color: #fff;
          transform: scale(1.015);
        }
        @media (max-width: 860px) {
          .about-grid { grid-template-columns: 1fr !important; gap: 48px !important; }
        }
      `}</style>
    </section>
  );
}

function AboutPhotoFlip() {
  const [hover, setHover] = useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        perspective: 1200,
        cursor: 'pointer',
        transform: 'rotate(-2deg)',
      }}
    >
      <div style={{
        position: 'relative',
        width: '100%',
        aspectRatio: '3/4',
        transformStyle: 'preserve-3d',
        transition: 'transform 620ms cubic-bezier(0.3, 0.7, 0.2, 1)',
        transform: hover ? 'rotateY(180deg)' : 'rotateY(0deg)',
        borderRadius: 24,
        boxShadow: `0 20px 60px ${TEAL}30`,
      }}>
        {/* Vorderseite: Cartoon */}
        <div style={{
          position: 'absolute', inset: 0,
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
          borderRadius: 24, overflow: 'hidden',
          border: `3px solid ${PEACH}`,
        }}>
          <img
            src="/assets/aboutme/avatar.png"
            alt="Jannik Cartoon"
            loading="lazy"
            style={{
              width: '100%', height: '100%', objectFit: 'cover',
              display: 'block',
            }}
          />
        </div>
        {/* Rückseite: echtes Foto */}
        <div style={{
          position: 'absolute', inset: 0,
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
          transform: 'rotateY(180deg)',
          borderRadius: 24, overflow: 'hidden',
          border: `3px solid ${TEAL}`,
        }}>
          <img
            src="/assets/aboutme/thedeveloper.jpg"
            alt="Jannik"
            loading="lazy"
            style={{
              width: '100%', height: '100%', objectFit: 'cover',
              filter: 'grayscale(30%) contrast(1.05)', display: 'block',
            }}
          />
        </div>
      </div>
    </div>
  );
}
