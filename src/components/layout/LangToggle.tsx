import { useLang } from '../../i18n/LanguageContext';

export function LangToggle() {
  const { lang, toggle } = useLang();
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Language"
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 8,
        fontFamily: "var(--ff-mono)", fontSize: 12, letterSpacing: '0.08em',
        color: 'inherit', background: 'transparent', border: 'none',
        cursor: 'pointer', padding: 0,
      }}
    >
      <span style={{ opacity: lang === 'de' ? 1 : 0.4 }}>DE</span>
      <span style={{
        width: 22, height: 12, borderRadius: 999,
        background: 'rgba(255,255,255,0.1)',
        border: '1px solid rgba(255,255,255,0.2)',
        position: 'relative',
      }}>
        <span style={{
          position: 'absolute', top: 1, left: lang === 'de' ? 1 : 11,
          width: 8, height: 8, borderRadius: 999,
          background: 'var(--teal)', transition: 'left 200ms ease',
        }} />
      </span>
      <span style={{ opacity: lang === 'en' ? 1 : 0.4 }}>EN</span>
    </button>
  );
}
