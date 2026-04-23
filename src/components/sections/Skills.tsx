import { useState } from 'react';
import { useLang } from '../../i18n/LanguageContext';
import { skills as allSkills } from '../../data/skills';
import { SectionLabel } from '../ui/SectionLabel';

const TEAL  = '#3DCFB6';
const LILAC = '#B8A4FF';

export function Skills() {
  const { t, lang } = useLang();
  return (
    <section id="skills" style={{ padding: '120px 40px', position: 'relative', zIndex: 1 }}>
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
            <SkillTile key={s.label} skill={s} index={i} lang={lang} />
          ))}
          <GrowthTile label={t('skills.learningLabel')} sub={t('skills.learningSub')} />
        </div>
      </div>
      <style>{`
        @media (max-width: 860px) {
          .skills-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </section>
  );
}

type Skill = typeof allSkills[number];

function SkillTile({ skill, index, lang }: { skill: Skill; index: number; lang: 'de' | 'en' }) {
  const [hover, setHover] = useState(false);
  const color = skill.color;
  const span = skill.span;
  const rot = (index % 2 ? 1 : -1) * 0.8;
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        gridColumn: `span ${span}`,
        perspective: 1000,
        transition: 'transform 300ms ease',
        transform: `rotate(${rot}deg) ${hover ? 'translateY(-6px)' : ''}`,
        cursor: 'pointer',
      }}
    >
      <div style={{
        position: 'relative', width: '100%', height: '100%',
        transformStyle: 'preserve-3d',
        transition: 'transform 500ms cubic-bezier(0.3, 0.7, 0.2, 1)',
        transform: hover ? 'rotateY(180deg)' : 'rotateY(0deg)',
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
          {hover && (
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
          borderRadius: 18, padding: 22,
          background: color,
          border: '2px solid #000',
          boxShadow: '5px 5px 0 #000',
          display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        }}>
          <div style={{
            fontFamily: 'var(--ff-mono)', fontSize: 11, color: '#000', opacity: 0.7,
            display: 'flex', justifyContent: 'space-between',
          }}>
            <span>/ {skill.label.toLowerCase()}</span>
            <span>{skill.level}%</span>
          </div>
          <div style={{ fontSize: 15, fontWeight: 600, color: '#000', lineHeight: 1.35 }}>
            {skill.note[lang]}
          </div>
        </div>
      </div>
    </div>
  );
}

function GrowthTile({ label, sub }: { label: string; sub: string }) {
  return (
    <div style={{
      gridColumn: 'span 2', gridRow: 'span 1',
      position: 'relative',
      borderRadius: 18, padding: 24,
      background: `linear-gradient(135deg, ${TEAL}, ${LILAC})`,
      border: '2px solid #000',
      boxShadow: '6px 6px 0 #000',
      transform: 'rotate(-1deg)',
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
  );
}
