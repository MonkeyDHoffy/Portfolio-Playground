import { useLang } from '../../i18n/LanguageContext';
import { LangToggle } from './LangToggle';

const LINE = 'rgba(255,255,255,0.12)';

const navLink: React.CSSProperties = { color: '#fff', textDecoration: 'none', opacity: 0.8 };
const iconLink: React.CSSProperties = {
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
  width: 34, height: 34, borderRadius: 999,
  color: '#fff', opacity: 0.75,
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.12)',
  transition: 'all 150ms ease',
  textDecoration: 'none',
};

export function Header() {
  const { t } = useLang();
  return (
    <nav
      style={{
        position: 'sticky', top: 20, zIndex: 30, margin: '20px 24px 0',
        padding: '12px 20px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'rgba(15,15,15,0.7)', backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: `1px solid ${LINE}`, borderRadius: 999,
      }}
    >
      <a href="#top" style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#fff', textDecoration: 'none' }}>
        <span style={{
          width: 28, height: 28, borderRadius: 8, background: 'var(--teal)',
          color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: 800, fontSize: 14, transform: 'rotate(-6deg)',
        }}>J</span>
        <span style={{ fontWeight: 700, fontSize: 15 }}>jannik.hoff</span>
      </a>
      <div style={{ display: 'flex', gap: 28, fontSize: 13, fontWeight: 500 }} className="nav-links">
        <a href="#about" style={navLink}>{t('nav.about')}</a>
        <a href="#skills" style={navLink}>{t('nav.skills')}</a>
        <a href="#projects" style={navLink}>{t('nav.projects')}</a>
        <a href="#contact" style={navLink}>{t('nav.contact')}</a>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <a href="https://github.com/MonkeyDHoffy" target="_blank" rel="noreferrer" aria-label="GitHub" style={iconLink}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.26.82-.577 0-.285-.01-1.04-.015-2.04-3.338.725-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.73.083-.73 1.205.085 1.84 1.238 1.84 1.238 1.07 1.835 2.807 1.305 3.492.998.108-.776.42-1.305.763-1.605-2.665-.3-5.467-1.332-5.467-5.93 0-1.31.47-2.38 1.236-3.22-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.3 1.23.96-.267 1.98-.4 3-.405 1.02.005 2.04.138 3 .405 2.29-1.552 3.297-1.23 3.297-1.23.654 1.652.243 2.873.12 3.176.77.84 1.233 1.91 1.233 3.22 0 4.61-2.807 5.625-5.48 5.92.43.37.814 1.102.814 2.222 0 1.606-.015 2.9-.015 3.293 0 .32.217.695.825.577C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z"/>
          </svg>
        </a>
        <a href="https://www.linkedin.com/in/jannik-hoff/" target="_blank" rel="noreferrer" aria-label="LinkedIn" style={iconLink}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.024-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.047c.476-.9 1.637-1.852 3.37-1.852 3.602 0 4.268 2.37 4.268 5.455v6.288zM5.337 7.433a2.063 2.063 0 01-2.063-2.064 2.063 2.063 0 112.063 2.064zM6.813 20.452H3.859V9h2.954v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451c.979 0 1.778-.773 1.778-1.729V1.729C24 .774 23.2 0 22.222 0h.003z"/>
          </svg>
        </a>
        <span style={{ width: 1, height: 18, background: LINE }} />
        <LangToggle />
      </div>
      <style>{`
        @media (max-width: 780px) {
          .nav-links { display: none !important; }
        }
      `}</style>
    </nav>
  );
}
