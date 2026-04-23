import { useLang } from '../../i18n/LanguageContext';
import { voices } from '../../data/voices';
import { SectionLabel } from '../ui/SectionLabel';

const LINE = 'rgba(255,255,255,0.12)';

export function Voices() {
  const { t, lang } = useLang();
  return (
    <section style={{ padding: '120px 40px', position: 'relative', zIndex: 1 }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <SectionLabel n={t('voices.index')} text={t('voices.label')} />
        <h2 style={{
          fontSize: 'clamp(40px, 6vw, 72px)', fontWeight: 800, lineHeight: 1,
          margin: '0 0 60px', letterSpacing: '-0.03em',
        }}>
          {t('voices.title')}
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {voices.map((v) => (
            <article key={v.id} style={{
              display: 'grid',
              gridTemplateColumns: '48px 1fr',
              gap: 14,
              padding: 18,
              background: 'rgba(255,255,255,0.03)',
              border: `1px solid ${LINE}`,
              borderRadius: 18,
              transition: 'background 200ms ease, transform 200ms ease',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}>
              <div style={{
                width: 48, height: 48, borderRadius: '50%',
                background: v.avatar.color, color: '#000',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'var(--ff-mono)', fontWeight: 700, fontSize: 14,
                border: '2px solid #000',
              }}>
                {v.avatar.initials}
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 6 }}>
                  <span style={{ fontWeight: 700, fontSize: 15 }}>{v.sender}</span>
                  <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>{v.handle}</span>
                  <span style={{ color: 'rgba(255,255,255,0.35)' }}>·</span>
                  <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>{v.when[lang]}</span>
                </div>
                <p style={{ margin: '0 0 12px', fontSize: 15.5, lineHeight: 1.5, color: 'rgba(255,255,255,0.9)' }}>
                  {v.text[lang]}
                </p>
                <div style={{ display: 'flex', gap: 20, color: 'rgba(255,255,255,0.55)', fontSize: 13 }}>
                  <Stat icon="💬" count={v.replies} label={t('voices.reply')} />
                  <Stat icon="↻" count={v.reposts} label={t('voices.repost')} />
                  <Stat icon="♡" count={v.likes} label={t('voices.like')} color="#FF6D8A" />
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Stat({ icon, count, label, color }: { icon: string; count: number; label: string; color?: string }) {
  return (
    <span
      aria-label={label}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        cursor: 'pointer', transition: 'color 150ms ease',
      }}
      onMouseEnter={(e) => { if (color) e.currentTarget.style.color = color; }}
      onMouseLeave={(e) => { e.currentTarget.style.color = ''; }}
    >
      <span style={{ fontSize: 14 }}>{icon}</span>
      <span>{count}</span>
    </span>
  );
}
