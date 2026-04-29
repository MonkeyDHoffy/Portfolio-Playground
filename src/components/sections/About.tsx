import { useEffect, useRef, useState } from 'react';
import { useLang } from '../../i18n/LanguageContext';
import { SectionLabel } from '../ui/SectionLabel';

const TEAL  = '#3DCFB6';
const PEACH = '#FFB27A';
const LILAC = '#B8A4FF';
const YELLOW = '#F4E06D';
const LINE = 'rgba(255,255,255,0.12)';
const FLIP_DURATION_MS = 700;

let aboutAutoFlipDone = false;

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
              position: 'absolute', top: -20, right: -20, zIndex: 20,
              width: 100, height: 100, borderRadius: '50%', background: YELLOW, color: '#000',
              display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center',
              fontSize: 12, fontWeight: 700, lineHeight: 1.2,
              transform: 'rotate(12deg)',
              animation: 'vc-spin 12s linear infinite',
              pointerEvents: 'none',
            }}>
              <span style={{ transform: 'rotate(-12deg)', padding: 8 }}>
                {t('about.stickerA')}<br />{t('about.stickerB')}
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
        .about-photo-trigger {
          width: 100%;
          padding: 0;
          border: 0;
          background: transparent;
          text-align: left;
          perspective: 1200px;
          cursor: pointer;
          transition: none;
          touch-action: manipulation;
        }
        .about-photo-trigger:focus-visible {
          outline: 2px solid ${TEAL};
          outline-offset: 8px;
        }
        @keyframes about-element-aura-breathe {
          0%, 100% {
            box-shadow:
              0 0 0 1px rgba(255,178,122,0.18),
              0 0 24px 4px rgba(255,178,122,0.22),
              0 0 60px 12px rgba(255,178,122,0.1);
          }
          50% {
            box-shadow:
              0 0 0 1px rgba(255,178,122,0.38),
              0 0 44px 12px rgba(255,178,122,0.4),
              0 0 100px 28px rgba(255,178,122,0.18);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .about-intro-hover,
          .about-photo-trigger {
            transition: none !important;
          }
        }
        @media (max-width: 860px) {
          .about-grid { grid-template-columns: 1fr !important; gap: 48px !important; }
        }
      `}</style>
    </section>
  );
}

function AboutPhotoFlip() {
  const { t } = useLang();
  const cardRef = useRef<HTMLButtonElement | null>(null);
  const [flipped, setFlipped] = useState(() => aboutAutoFlipDone);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [auraActive, setAuraActive] = useState(false);
  const [desktopAuraEnabled, setDesktopAuraEnabled] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;

    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setReducedMotion(media.matches);
    sync();

    media.addEventListener('change', sync);
    return () => media.removeEventListener('change', sync);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;

    const media = window.matchMedia('(hover: hover) and (pointer: fine)');
    const sync = () => {
      const enabled = media.matches;
      setDesktopAuraEnabled(enabled);
      if (!enabled) {
        setAuraActive(false);
        document.body.classList.remove('about-photo-hovered');
      }
    };
    sync();

    media.addEventListener('change', sync);
    return () => media.removeEventListener('change', sync);
  }, []);

  useEffect(() => {
    return () => {
      document.body.classList.remove('about-photo-hovered');
    };
  }, []);

  useEffect(() => {
    const card = cardRef.current;
    if (!card || aboutAutoFlipDone) return;

    const checkAutoFlip = () => {
      if (aboutAutoFlipDone) return;

      const rect = card.getBoundingClientRect();
      const isVisible = rect.bottom > 0 && rect.top < window.innerHeight;
      if (!isVisible) return;

      const cardCenterY = rect.top + rect.height / 2;
      const viewportCenterY = window.innerHeight / 2;
      const centeredEnough = Math.abs(cardCenterY - viewportCenterY) <= 60;
      if (!centeredEnough) return;

      aboutAutoFlipDone = true;
      setFlipped(true);
      window.removeEventListener('scroll', checkAutoFlip);
      window.removeEventListener('resize', checkAutoFlip);
    };

    window.addEventListener('scroll', checkAutoFlip, { passive: true });
    window.addEventListener('resize', checkAutoFlip);
    checkAutoFlip();

    return () => {
      window.removeEventListener('scroll', checkAutoFlip);
      window.removeEventListener('resize', checkAutoFlip);
    };
  }, []);

  const toggleFlipped = () => setFlipped((value) => !value);

  const activateAura = () => {
    if (!desktopAuraEnabled) return;
    setAuraActive(true);
    document.body.classList.add('about-photo-hovered');
  };

  const deactivateAura = () => {
    setAuraActive(false);
    document.body.classList.remove('about-photo-hovered');
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    toggleFlipped();
  };

  return (
    <div
      style={{
        position: 'relative',
        transform: 'rotate(-2deg)',
      }}
    >
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: -4,
          borderRadius: 28,
          pointerEvents: 'none',
          zIndex: 1,
          opacity: auraActive ? 1 : 0,
          transition: 'opacity 400ms ease',
          boxShadow: '0 0 0 1px rgba(255,178,122,0.25), 0 0 32px 8px rgba(255,178,122,0.3), 0 0 80px 20px rgba(255,178,122,0.14)',
          animation: auraActive && !reducedMotion ? 'about-element-aura-breathe 3.2s ease-in-out infinite' : 'none',
        }}
      />
      <button
        ref={cardRef}
        type="button"
        className="about-photo-trigger"
        aria-label={t('about.flipCard')}
        aria-pressed={flipped}
        onClick={toggleFlipped}
        onKeyDown={handleKeyDown}
        onMouseEnter={activateAura}
        onMouseLeave={deactivateAura}
        style={{
          display: 'block',
          position: 'relative',
          zIndex: 2,
        }}
      >
        <div style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '3/4',
          transformStyle: 'preserve-3d',
          transition: reducedMotion ? 'none' : `transform ${FLIP_DURATION_MS}ms cubic-bezier(0.3, 0.7, 0.2, 1)`,
          transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          borderRadius: 24,
          boxShadow: `0 20px 60px ${TEAL}30`,
        }}>
          {/* Vorderseite: thedeveloper */}
          <div style={{
            position: 'absolute', inset: 0,
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
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
          {/* Rückseite: Cartoon */}
          <div style={{
            position: 'absolute', inset: 0,
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            borderRadius: 24, overflow: 'hidden',
            border: `3px solid ${PEACH}`,
          }}>
            <img
              src="/assets/aboutme/avatar.jpg"
              alt="Jannik Cartoon"
              loading="lazy"
              style={{
                width: '100%', height: '100%', objectFit: 'cover',
                display: 'block',
              }}
            />
          </div>
        </div>
      </button>
    </div>
  );
}
