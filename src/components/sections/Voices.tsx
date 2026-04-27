import { useLang } from '../../i18n/LanguageContext';
import { voices } from '../../data/voices';
import { SectionLabel } from '../ui/SectionLabel';

const LINE = 'rgba(255,255,255,0.12)';

export function Voices() {
  const { t, lang } = useLang();
  const marqueeVoices = [...voices, ...voices];
  return (
    <section style={{ padding: '120px 40px', position: 'relative', zIndex: 1 }}>
      <div style={{ maxWidth: 1180, margin: '0 auto' }}>
        <SectionLabel n={t('voices.index')} text={t('voices.label')} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16, color: 'rgba(255,255,255,0.5)' }}>
          <h2 style={{
            fontSize: 'clamp(40px, 6vw, 72px)', fontWeight: 800, lineHeight: 1,
            margin: 0, letterSpacing: '-0.03em', color: '#fff',
          }}>
            {t('voices.title')}
          </h2>
          <span style={{
            fontFamily: 'var(--ff-mono)',
            fontSize: 11,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.5)',
            border: `1px solid ${LINE}`,
            borderRadius: 999,
            padding: '4px 10px',
            marginTop: 8,
          }}>
            {t('voices.demo')}
          </span>
        </div>

        <div className="voices-marquee-viewport" style={{ marginTop: 40 }}>
          <div className="voices-marquee-track">
            {marqueeVoices.map((v, i) => (
              <article
                key={`${v.id}-${i}`}
                className={`voice-card${v.profileUrl ? ' voice-card-link' : ''}`}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '48px 1fr',
                  gap: 14,
                  padding: 18,
                  background: 'rgba(255,255,255,0.03)',
                  border: `1px solid ${LINE}`,
                  borderRadius: 18,
                  transition: 'background 220ms ease, transform 220ms ease, box-shadow 220ms ease',
                  width: 'min(560px, 70vw)',
                  transform: `rotate(${((i % 4) - 1.5) * 0.35}deg)`,
                  position: 'relative',
                  flexShrink: 0,
                }}
                onClick={() => {
                  if (!v.profileUrl) return;
                  window.open(v.profileUrl, '_blank', 'noopener,noreferrer');
                }}
              >
                <div style={{
                  position: 'absolute',
                  top: -7,
                  left: 24,
                  width: 56,
                  height: 14,
                  borderRadius: 4,
                  background: 'rgba(244,224,109,0.7)',
                  border: '1px dashed rgba(0,0,0,0.25)',
                  opacity: 0.62,
                  pointerEvents: 'none',
                }} />
                <div style={{
                  width: 48, height: 48, borderRadius: '50%',
                  background: v.avatar.color, color: '#000',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'var(--ff-mono)', fontWeight: 700, fontSize: 14,
                  border: '2px solid #000',
                  overflow: 'hidden',
                }}>
                  {v.avatar.image ? (
                    <img
                      src={v.avatar.image}
                      alt={v.sender}
                      loading="lazy"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    v.avatar.initials
                  )}
                </div>
                <div className="voice-card-copy" style={{ transformOrigin: 'left center', transition: 'transform 220ms ease' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 6 }}>
                    <span style={{ fontWeight: 700, fontSize: 15 }}>{v.sender}</span>
                    <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>{v.handle}</span>
                    <span style={{ color: 'rgba(255,255,255,0.35)' }}>·</span>
                    <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>{v.when[lang]}</span>
                    {v.profileUrl && (
                      <span style={{ color: 'var(--sky)', fontSize: 12, fontWeight: 700 }}>
                        LinkedIn
                      </span>
                    )}
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
      </div>
      <style>{`
        .voices-marquee-viewport {
          width: calc(100vw - 80px);
          margin-left: 50%;
          transform: translateX(-50%);
          overflow: hidden;
          mask-image: linear-gradient(to right, transparent 0%, #000 8%, #000 92%, transparent 100%);
        }
        .voices-marquee-track {
          display: flex;
          gap: 16px;
          width: max-content;
          animation: vc-voices-marquee 72s linear infinite;
          will-change: transform;
        }
        .voices-marquee-viewport:hover .voices-marquee-track,
        .voices-marquee-viewport:focus-within .voices-marquee-track {
          animation-play-state: paused;
        }
        .voice-card:hover {
          background: rgba(255,255,255,0.06) !important;
          transform: scale(1.03) !important;
          box-shadow: 0 14px 36px rgba(0,0,0,0.35), 0 0 22px rgba(61,207,182,0.18);
        }
        .voice-card-link {
          cursor: pointer;
        }
        .voice-card:hover .voice-card-copy {
          transform: scale(1.04);
        }
        @keyframes vc-voices-marquee {
          from { transform: translateX(0); }
          to { transform: translateX(calc(-50% - 8px)); }
        }
        @media (max-width: 860px) {
          .voices-marquee-track {
            gap: 12px;
            animation-duration: 60s;
          }
          .voice-card {
            width: min(84vw, 460px) !important;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .voices-marquee-track {
            animation: none;
          }
          .voice-card:hover {
            transform: none !important;
            box-shadow: none;
          }
        }
      `}</style>
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
