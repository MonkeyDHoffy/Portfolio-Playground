import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useLang } from '../../i18n/LanguageContext';
import { skills as allSkills } from '../../data/skills';
import { SectionLabel } from '../ui/SectionLabel';

const TEAL  = '#3DCFB6';
const LILAC = '#B8A4FF';

export function Skills() {
  const { t, lang } = useLang();
  const [isPhone, setIsPhone] = useState(() => window.innerWidth <= 860);

  useEffect(() => {
    const onResize = () => setIsPhone(window.innerWidth <= 860);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return (
    <section id="skills" style={{ padding: 'clamp(48px, 8vw, 64px) 40px', position: 'relative', zIndex: 1 }}>
      <div style={{ maxWidth: 1180, margin: '0 auto' }}>
        <SectionLabel n={t('skills.index')} text={t('skills.label')} />
        <h2 style={{
          fontSize: 'clamp(40px, 6vw, 88px)', fontWeight: 800, lineHeight: 1,
          letterSpacing: '-0.03em', margin: '0 0 20px',
        }}>
          {t('skills.titleA')}{' '}
          <em style={{
            fontStyle: 'italic', fontWeight: 400,
            background: `linear-gradient(90deg, ${TEAL}, ${LILAC})`,
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>{t('skills.titleB')}</em>.
        </h2>
        <p style={{ maxWidth: 560, fontSize: 17, color: 'rgba(255,255,255,0.7)', lineHeight: 1.55, margin: '0 0 60px' }}>
          {t('skills.intro')} <span style={{ color: TEAL }}>{t('skills.hoverTip')}</span>
        </p>
        <div
          className="skills-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gridAutoRows: '180px',
            gap: 16,
          }}
        >
          {allSkills.map((s, i) => (
            <SkillTile key={s.label} skill={s} index={i} lang={lang} isPhone={isPhone} />
          ))}
          <GrowthTile label={t('skills.learningLabel')} sub={t('skills.learningSub')} backText={t('skills.learningBack')} />
        </div>
      </div>
      <style>{`
        .skills-back-note-clamp {
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 4;
          overflow: hidden;
        }
        .skills-sheet-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.62);
          backdrop-filter: blur(3px);
          z-index: 80;
          display: block;
        }
        .skills-sheet {
          position: absolute;
          left: 10px;
          right: 10px;
          bottom: 0;
          width: min(720px, calc(100% - 20px));
          margin-inline: auto;
          border-radius: 18px 18px 12px 12px;
          background: #16161A;
          border: 2px solid #000;
          box-shadow: 0 -4px 18px rgba(0,0,0,0.32);
          padding: 16px 16px calc(18px + env(safe-area-inset-bottom));
          transform: translateY(18px);
          animation: skills-sheet-in 220ms cubic-bezier(0.22, 0.9, 0.3, 1) forwards;
        }
        .skills-sheet-handle {
          width: 44px;
          height: 5px;
          border-radius: 999px;
          margin: 0 auto 10px;
          background: rgba(255,255,255,0.25);
        }
        @keyframes skills-sheet-in {
          from { transform: translateY(18px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @media (max-width: 860px) {
          .skills-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .skills-back-note-clamp {
            -webkit-line-clamp: 3;
          }
        }
      `}</style>
    </section>
  );
}

type Skill = typeof allSkills[number];

function SkillTile({
  skill,
  index,
  lang,
  isPhone,
}: {
  skill: Skill;
  index: number;
  lang: 'de' | 'en';
  isPhone: boolean;
}) {
  const [hover, setHover] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const color = skill.color;
  const span = skill.span;
  const rot = (index % 2 ? 1 : -1) * 0.8;
  const showBack = isPhone ? flipped : hover;
  const shortNote = skill.noteShort?.[lang] ?? skill.note[lang];

  useEffect(() => {
    if (!isPhone) {
      setFlipped(false);
      setSheetOpen(false);
    }
  }, [isPhone]);

  useEffect(() => {
    if (!sheetOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [sheetOpen]);

  return (
    <>
      <div
        onMouseEnter={() => {
          if (!isPhone) setHover(true);
        }}
        onMouseLeave={() => {
          if (!isPhone) setHover(false);
        }}
        onClick={() => {
          if (isPhone) setFlipped((v) => !v);
        }}
        style={{
          gridColumn: `span ${span}`,
          perspective: 1000,
          transition: 'transform 300ms ease',
          transform: `rotate(${rot}deg) ${(hover && !isPhone) ? 'translateY(-6px)' : ''}`,
          cursor: 'pointer',
        }}
      >
        <div style={{
          position: 'relative', width: '100%', height: '100%',
          transformStyle: 'preserve-3d',
          transition: 'transform 500ms cubic-bezier(0.3, 0.7, 0.2, 1)',
          transform: showBack ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}>
        {/* Front */}
        <div style={{
          position: 'absolute', inset: 0, backfaceVisibility: 'hidden',
          borderRadius: 18, padding: 20,
          background: '#16161A',
          border: '2px solid #000',
          boxShadow: '5px 5px 0 #000',
          display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
          overflow: 'hidden',
        }}>
          {showBack && (
            <div style={{
              position: 'absolute', top: -8, left: '50%', transform: 'translateX(-50%) rotate(-4deg)',
              width: 60, height: 18,
              background: 'rgba(244,224,109,0.7)',
              border: '1px dashed rgba(0,0,0,0.3)',
              pointerEvents: 'none', zIndex: 2,
            }} />
          )}
          <div style={{
            position: 'absolute', top: 14, right: 14,
            padding: '4px 10px', borderRadius: 999,
            background: color, color: '#000',
            border: '2px solid #000',
            fontFamily: 'var(--ff-mono)',
            fontSize: 11, fontWeight: 700, letterSpacing: '0.02em',
            zIndex: 1,
          }}>
            {skill.years}y
          </div>
          <div style={{
            width: 48, height: 48, borderRadius: 12,
            background: color,
            border: '2px solid #000',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 22, fontWeight: 800, color: '#000',
          }}>
            {skill.icon
              ? <img src={skill.icon} alt="" loading="lazy" style={{ width: 30, height: 30, objectFit: 'contain' }} />
              : <span>{skill.label[0]}</span>}
          </div>
          <div>
            <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.01em' }}>{skill.label}</div>
            <div style={{
              marginTop: 8, height: 6, borderRadius: 999,
              background: 'rgba(255,255,255,0.08)', overflow: 'hidden',
              border: '1px solid rgba(255,255,255,0.1)',
            }}>
              <div style={{ width: `${skill.level}%`, height: '100%', background: color }} />
            </div>
          </div>
        </div>
        {/* Back */}
        <div style={{
          position: 'absolute', inset: 0, backfaceVisibility: 'hidden',
          transform: 'rotateY(180deg)',
          borderRadius: 18, padding: isPhone ? 18 : 22,
          background: color,
          border: '2px solid #000',
          boxShadow: '5px 5px 0 #000',
          display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
          gap: 10,
        }}>
          <div style={{
            fontFamily: 'var(--ff-mono)', fontSize: 11, color: '#000', opacity: 0.7,
            display: 'flex', justifyContent: 'space-between',
          }}>
            <span>/ {skill.label.toLowerCase()}</span>
            <span>{skill.level}%</span>
          </div>
          <div
            className={isPhone ? 'skills-back-note-clamp' : undefined}
            style={{ fontSize: isPhone ? 14 : 15, fontWeight: 600, color: '#000', lineHeight: 1.35 }}
          >
            {isPhone ? shortNote : skill.note[lang]}
          </div>
          {isPhone && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSheetOpen(true);
              }}
              style={{
                alignSelf: 'flex-start',
                padding: '6px 12px',
                borderRadius: 999,
                border: '1px solid rgba(0,0,0,0.4)',
                background: 'rgba(0,0,0,0.12)',
                color: '#000',
                fontWeight: 700,
                fontSize: 12,
                cursor: 'pointer',
              }}
            >
              {lang === 'de' ? 'Mehr' : 'More'}
            </button>
          )}
        </div>
      </div>
      </div>

      {isPhone && sheetOpen && typeof document !== 'undefined' && createPortal(
        <div
          className="skills-sheet-overlay"
          onClick={() => setSheetOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label={lang === 'de' ? `${skill.label} Details` : `${skill.label} details`}
        >
          <div className="skills-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="skills-sheet-handle" />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <strong style={{ fontSize: 18 }}>{skill.label}</strong>
              <button
                onClick={() => setSheetOpen(false)}
                style={{
                  border: '1px solid rgba(255,255,255,0.18)',
                  background: 'rgba(255,255,255,0.06)',
                  color: '#fff',
                  padding: '4px 10px',
                  borderRadius: 999,
                  fontSize: 12,
                  cursor: 'pointer',
                }}
              >
                {lang === 'de' ? 'Schließen' : 'Close'}
              </button>
            </div>
            <div style={{ fontSize: 15, lineHeight: 1.55, color: 'rgba(255,255,255,0.86)' }}>
              {skill.note[lang]}
            </div>
          </div>
        </div>,
        document.body,
      )}
    </>
  );
}

function GrowthTile({ label, sub, backText }: { label: string; sub: string; backText: string }) {
  const [hover, setHover] = useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        gridColumn: 'span 2',
        gridRow: 'span 1',
        perspective: 1000,
        transition: 'transform 300ms ease',
        transform: `rotate(-1deg) ${hover ? 'translateY(-6px)' : ''}`,
        cursor: 'pointer',
      }}
    >
      <div style={{
        position: 'relative', width: '100%', height: '100%',
        transformStyle: 'preserve-3d',
        transition: 'transform 500ms cubic-bezier(0.3, 0.7, 0.2, 1)',
        transform: hover ? 'rotateY(180deg)' : 'rotateY(0deg)',
      }}>
        <div style={{
          position: 'absolute', inset: 0, backfaceVisibility: 'hidden',
          borderRadius: 18, padding: 24,
          background: `linear-gradient(135deg, ${TEAL}, ${LILAC})`,
          border: '2px solid #000',
          boxShadow: '6px 6px 0 #000',
          display: 'flex', alignItems: 'center', gap: 20,
          overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: 20, right: 20, width: 14, height: 14 }}>
            <div style={{
              position: 'absolute', inset: 0, borderRadius: '50%',
              background: '#fff', opacity: 0.8,
              animation: 'vc-pulse-ring 1.6s ease-out infinite',
            }} />
            <div style={{ position: 'absolute', inset: 3, borderRadius: '50%', background: '#fff' }} />
          </div>
          <div style={{
            flexShrink: 0, width: 72, height: 72, borderRadius: 16,
            background: '#000', color: '#fff',
            border: '2px solid #000',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 40, fontWeight: 800,
          }}>∞</div>
          <div style={{ color: '#000' }}>
            <div style={{
              display: 'inline-block',
              padding: '3px 10px', marginBottom: 8,
              background: '#000', color: '#fff',
              fontFamily: 'var(--ff-mono)', fontSize: 10, fontWeight: 700,
              letterSpacing: '0.15em', borderRadius: 999,
            }}>
              {label}
            </div>
            <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.01em', lineHeight: 1.1 }}>
              Python · Django
            </div>
            <div style={{ fontSize: 14, marginTop: 6, color: 'rgba(0,0,0,0.7)', fontWeight: 500 }}>
              {sub}
            </div>
          </div>
        </div>
        <div style={{
          position: 'absolute', inset: 0, backfaceVisibility: 'hidden',
          transform: 'rotateY(180deg)',
          borderRadius: 18, padding: 22,
          background: `linear-gradient(135deg, ${LILAC}, ${TEAL})`,
          border: '2px solid #000',
          boxShadow: '6px 6px 0 #000',
          display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        }}>
          <div style={{
            fontFamily: 'var(--ff-mono)', fontSize: 11, color: '#000', opacity: 0.72,
            display: 'flex', justifyContent: 'space-between',
          }}>
            <span>/ growth-mode</span>
            <span>open</span>
          </div>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#000', lineHeight: 1.4 }}>
            {backText}
          </div>
        </div>
      </div>
    </div>
  );
}
