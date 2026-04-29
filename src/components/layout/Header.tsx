import { useEffect, useRef, useState } from 'react';
import { useLang } from '../../i18n/LanguageContext';
import { LangToggle } from './LangToggle';
import { ConfirmPopup } from '../ui/ConfirmPopup';

const LINE = 'rgba(255,255,255,0.12)';

const NAV_IDS = ['about', 'skills', 'projects', 'contact'] as const;

const navLink: React.CSSProperties = {
  color: '#fff',
  textDecoration: 'none',
  opacity: 0.8,
  position: 'relative',
  paddingBottom: 3,
};
const iconLink: React.CSSProperties = {
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
  width: 34, height: 34, borderRadius: 999,
  color: '#fff', opacity: 0.75,
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.12)',
  transition: 'transform 180ms ease, box-shadow 180ms ease, opacity 180ms ease, background-color 180ms ease, border-color 180ms ease',
  textDecoration: 'none',
};
const cvLink: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: 34,
  padding: '0 12px',
  borderRadius: 999,
  color: '#000',
  fontFamily: 'var(--ff-mono)',
  fontSize: 12,
  fontWeight: 700,
  letterSpacing: '0.05em',
  background: 'var(--teal)',
  border: '1px solid rgba(0,0,0,0.7)',
  textDecoration: 'none',
  position: 'relative',
  overflow: 'hidden',
  transition: 'transform 180ms ease, box-shadow 180ms ease, filter 180ms ease',
};

export function Header() {
  const { t } = useLang();
  const [activeNav, setActiveNav] = useState<string>('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [isCompact, setIsCompact] = useState(() => window.innerWidth <= 860);
  const [navGlow, setNavGlow] = useState(false);
  const navRef = useRef<HTMLElement | null>(null);
  const [cvPopupOpen, setCvPopupOpen] = useState(false);
  const [cvAnchorEl, setCvAnchorEl] = useState<HTMLElement | null>(null);

  const openCvPopup = (e: React.MouseEvent<HTMLButtonElement>) => {
    setCvAnchorEl(e.currentTarget);
    setCvPopupOpen(true);
  };

  useEffect(() => {
    return () => { document.body.classList.remove('nav-hovered'); };
  }, []);

  useEffect(() => {
    const updateActive = () => {
      const markerY = window.scrollY + window.innerHeight * 0.45;
      let current = NAV_IDS[0] as string;

      NAV_IDS.forEach((id) => {
        const el = document.getElementById(id);
        if (!el) return;
        if (markerY >= el.offsetTop - 12) current = id;
      });

      setActiveNav(current);
    };

    const updateCompact = () => setIsCompact(window.innerWidth <= 860);
    const handleResize = () => { updateActive(); updateCompact(); };

    updateActive();
    updateCompact();
    window.addEventListener('scroll', updateActive, { passive: true });
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('scroll', updateActive);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (!menuOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };

    const onPointerDown = (e: MouseEvent) => {
      if (!navRef.current) return;
      if (!navRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('mousedown', onPointerDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('mousedown', onPointerDown);
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!isCompact) setMenuOpen(false);
  }, [isCompact]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      {isCompact && menuOpen && (
        <button
          type="button"
          aria-label="Menü schließen"
          className="mobile-nav-backdrop"
          onClick={closeMenu}
        />
      )}
      <nav
        ref={navRef}
        onMouseEnter={() => { setNavGlow(true); document.body.classList.add('nav-hovered'); }}
        onMouseLeave={() => { setNavGlow(false); document.body.classList.remove('nav-hovered'); }}
        style={{
          position: 'sticky', top: 20, zIndex: 30, margin: '20px clamp(12px, 4vw, 24px) 0',
          padding: isCompact ? '12px 14px' : '12px 20px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: 'rgba(15,15,15,0.7)', backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: `1px solid ${LINE}`, borderRadius: 999,
          gap: 12,
        }}
      >
        <div
          aria-hidden
          style={{
            position: 'absolute',
            inset: -6,
            borderRadius: 1005,
            pointerEvents: 'none',
            zIndex: 10,
            opacity: navGlow ? 1 : 0,
            transition: 'opacity 0.4s ease',
            boxShadow: '0 0 0 1px rgba(255,178,122,0.25), 0 0 32px 8px rgba(255,178,122,0.3), 0 0 80px 20px rgba(255,178,122,0.14)',
            animation: navGlow ? 'element-aura-breathe 3.2s ease-in-out infinite' : 'none',
          }}
        />
      <a href="#top" style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#fff', textDecoration: 'none', minWidth: 0 }}>
        <img
          src="/jhicon.png"
          alt="JH"
          style={{
            width: 28,
            height: 28,
            objectFit: 'cover',
            display: 'block',
          }}
        />
        <span style={{ fontWeight: 800, fontSize: 17, whiteSpace: 'nowrap', letterSpacing: '0.03em' }}>HOFFJA</span>
      </a>
      {isCompact ? (
        <button
          type="button"
          aria-label={menuOpen ? 'Menü schließen' : 'Menü öffnen'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
          className="menu-toggle"
          style={{
            width: 38,
            height: 38,
            borderRadius: 999,
            border: `1px solid ${LINE}`,
            background: 'rgba(255,255,255,0.05)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 0,
            flexShrink: 0,
          }}
        >
          <span className={`menu-toggle-bars${menuOpen ? ' is-open' : ''}`} aria-hidden>
            <span />
            <span />
            <span />
          </span>
        </button>
      ) : (
        <>
          <div style={{ display: 'flex', gap: 28, fontSize: 13, fontWeight: 500 }} className="nav-links">
            <a href="#about" className={`nav-link${activeNav === 'about' ? ' nav-link-active' : ''}`} style={navLink} aria-current={activeNav === 'about' ? 'page' : undefined}>{t('nav.about')}</a>
            <a href="#skills" className={`nav-link${activeNav === 'skills' ? ' nav-link-active' : ''}`} style={navLink} aria-current={activeNav === 'skills' ? 'page' : undefined}>{t('nav.skills')}</a>
            <a href="#projects" className={`nav-link${activeNav === 'projects' ? ' nav-link-active' : ''}`} style={navLink} aria-current={activeNav === 'projects' ? 'page' : undefined}>{t('nav.projects')}</a>
            <a href="#contact" className={`nav-link${activeNav === 'contact' ? ' nav-link-active' : ''}`} style={navLink} aria-current={activeNav === 'contact' ? 'page' : undefined}>{t('nav.contact')}</a>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <button type="button" onClick={openCvPopup} className="cv-download" style={{ ...cvLink, cursor: 'pointer' }}>
              CV ↓
            </button>
            <a href="https://github.com/MonkeyDHoffy" target="_blank" rel="noreferrer" aria-label="GitHub" className="social-link" style={iconLink}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.26.82-.577 0-.285-.01-1.04-.015-2.04-3.338.725-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.73.083-.73 1.205.085 1.84 1.238 1.84 1.238 1.07 1.835 2.807 1.305 3.492.998.108-.776.42-1.305.763-1.605-2.665-.3-5.467-1.332-5.467-5.93 0-1.31.47-2.38 1.236-3.22-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.3 1.23.96-.267 1.98-.4 3-.405 1.02.005 2.04.138 3 .405 2.29-1.552 3.297-1.23 3.297-1.23.654 1.652.243 2.873.12 3.176.77.84 1.233 1.91 1.233 3.22 0 4.61-2.807 5.625-5.48 5.92.43.37.814 1.102.814 2.222 0 1.606-.015 2.9-.015 3.293 0 .32.217.695.825.577C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z"/>
              </svg>
            </a>
            <a href="https://www.linkedin.com/in/jannik-hoff/" target="_blank" rel="noreferrer" aria-label="LinkedIn" className="social-link" style={iconLink}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.024-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.047c.476-.9 1.637-1.852 3.37-1.852 3.602 0 4.268 2.37 4.268 5.455v6.288zM5.337 7.433a2.063 2.063 0 01-2.063-2.064 2.063 2.063 0 112.063 2.064zM6.813 20.452H3.859V9h2.954v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451c.979 0 1.778-.773 1.778-1.729V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
            <span style={{ width: 1, height: 18, background: LINE }} />
            <LangToggle />
          </div>
        </>
      )}
      {isCompact && (
        <div className={`mobile-nav-panel${menuOpen ? ' is-open' : ''}`}>
          <a href="#about" onClick={closeMenu} className={`mobile-nav-link${activeNav === 'about' ? ' is-active' : ''}`}>{t('nav.about')}</a>
          <a href="#skills" onClick={closeMenu} className={`mobile-nav-link${activeNav === 'skills' ? ' is-active' : ''}`}>{t('nav.skills')}</a>
          <a href="#projects" onClick={closeMenu} className={`mobile-nav-link${activeNav === 'projects' ? ' is-active' : ''}`}>{t('nav.projects')}</a>
          <a href="#contact" onClick={closeMenu} className={`mobile-nav-link${activeNav === 'contact' ? ' is-active' : ''}`}>{t('nav.contact')}</a>
          <button
            type="button"
            className="mobile-nav-action mobile-nav-cv"
            onClick={(e) => { openCvPopup(e); closeMenu(); }}
            style={{ cursor: 'pointer' }}
          >
            CV herunterladen
          </button>
          <div className="mobile-nav-actions">
            <a href="https://github.com/MonkeyDHoffy" target="_blank" rel="noreferrer" aria-label="GitHub" className="social-link" style={iconLink} onClick={closeMenu}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.26.82-.577 0-.285-.01-1.04-.015-2.04-3.338.725-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.73.083-.73 1.205.085 1.84 1.238 1.84 1.238 1.07 1.835 2.807 1.305 3.492.998.108-.776.42-1.305.763-1.605-2.665-.3-5.467-1.332-5.467-5.93 0-1.31.47-2.38 1.236-3.22-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.3 1.23.96-.267 1.98-.4 3-.405 1.02.005 2.04.138 3 .405 2.29-1.552 3.297-1.23 3.297-1.23.654 1.652.243 2.873.12 3.176.77.84 1.233 1.91 1.233 3.22 0 4.61-2.807 5.625-5.48 5.92.43.37.814 1.102.814 2.222 0 1.606-.015 2.9-.015 3.293 0 .32.217.695.825.577C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z"/>
              </svg>
            </a>
            <a href="https://www.linkedin.com/in/jannik-hoff/" target="_blank" rel="noreferrer" aria-label="LinkedIn" className="social-link" style={iconLink} onClick={closeMenu}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.024-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.047c.476-.9 1.637-1.852 3.37-1.852 3.602 0 4.268 2.37 4.268 5.455v6.288zM5.337 7.433a2.063 2.063 0 01-2.063-2.064 2.063 2.063 0 112.063 2.064zM6.813 20.452H3.859V9h2.954v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451c.979 0 1.778-.773 1.778-1.729V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
            <span style={{ width: 1, height: 18, background: LINE }} />
            <div onClick={closeMenu}><LangToggle /></div>
          </div>
        </div>
      )}
      <style>{`
        .mobile-nav-backdrop {
          position: fixed;
          inset: 0;
          z-index: 29;
          border: 0;
          padding: 0;
          margin: 0;
          width: 100%;
          background: rgba(6, 7, 8, 0.48);
          backdrop-filter: blur(3px);
          -webkit-backdrop-filter: blur(3px);
        }
        nav {
          position: relative;
        }
        .nav-link {
          transition: color 240ms ease, opacity 240ms ease;
        }
        .nav-link::after {
          content: '';
          position: absolute;
          left: 0;
          right: 0;
          bottom: -2px;
          height: 2px;
          border-radius: 999;
          background: rgba(61, 207, 182, 0.9);
          transform: scaleX(0);
          transform-origin: left center;
          opacity: 0;
          transition: transform 240ms cubic-bezier(.22,.9,.3,1), opacity 240ms ease;
        }
        .nav-link:hover,
        .nav-link:focus-visible {
          color: #fff;
          opacity: 0.98 !important;
        }
        .nav-link:hover::after,
        .nav-link:focus-visible::after,
        .nav-link-active::after {
          transform: scaleX(1);
          opacity: 1;
        }
        .nav-link-active {
          color: #c7fff5;
          opacity: 1 !important;
        }
        .social-link:hover,
        .social-link:focus-visible {
          transform: scale(1.14);
          opacity: 1;
          background: rgba(61, 207, 182, 0.2) !important;
          border-color: rgba(61, 207, 182, 0.7) !important;
          box-shadow: 0 0 0 1px rgba(0,0,0,0.5), 0 0 16px rgba(61, 207, 182, 0.6);
        }
        .social-link:focus-visible {
          outline: 2px solid rgba(61, 207, 182, 0.9);
          outline-offset: 2px;
        }
        .cv-download:hover,
        .cv-download:focus-visible {
          transform: translateY(-1px) scale(1.04);
          filter: saturate(1.08);
          box-shadow: 0 0 0 1px rgba(0,0,0,0.75), 0 0 14px rgba(61, 207, 182, 0.45);
        }
        .cv-download::after {
          content: '';
          position: absolute;
          top: -130%;
          left: -40%;
          width: 36%;
          height: 360%;
          background: linear-gradient(112deg, transparent 0%, rgba(255,255,255,0.1) 42%, rgba(255,255,255,0.32) 50%, rgba(255,255,255,0.1) 58%, transparent 100%);
          transform: rotate(18deg) translateX(-320%);
          opacity: 0;
          pointer-events: none;
          will-change: transform, opacity;
        }
        .cv-download:hover::after,
        .cv-download:focus-visible::after {
          opacity: 0.9;
          animation: cv-shimmer 1280ms cubic-bezier(0.25, 0.7, 0.3, 1) infinite;
        }
        .cv-download:focus-visible {
          outline: 2px solid rgba(61, 207, 182, 0.95);
          outline-offset: 2px;
        }
        .menu-toggle-bars {
          display: inline-flex;
          flex-direction: column;
          gap: 4px;
        }
        .menu-toggle-bars span {
          display: block;
          width: 16px;
          height: 1.8px;
          border-radius: 999px;
          background: rgba(255,255,255,0.92);
          transition: transform 220ms cubic-bezier(.22,.9,.3,1), opacity 220ms ease;
          transform-origin: center;
        }
        .menu-toggle-bars.is-open span:nth-child(1) {
          transform: translateY(5.8px) rotate(45deg);
        }
        .menu-toggle-bars.is-open span:nth-child(2) {
          opacity: 0;
        }
        .menu-toggle-bars.is-open span:nth-child(3) {
          transform: translateY(-5.8px) rotate(-45deg);
        }
        .mobile-nav-panel {
          position: absolute;
          top: calc(100% + 10px);
          left: auto;
          right: 0;
          width: min(92vw, 520px);
          display: grid;
          gap: 10px;
          padding: 14px;
          border-radius: 18px;
          border: 1px solid rgba(255,255,255,0.14);
          background:
            radial-gradient(120% 140% at 0% 0%, rgba(61, 207, 182, 0.12), transparent 55%),
            linear-gradient(180deg, rgba(14,14,16,0.98), rgba(10,10,12,0.98));
          box-shadow: 0 18px 40px rgba(0,0,0,0.45), 0 0 0 1px rgba(0,0,0,0.45);
          opacity: 0;
          transform: translateY(-8px) scale(0.98);
          pointer-events: none;
          transition: opacity 220ms ease, transform 220ms cubic-bezier(.22,.9,.3,1);
        }
        .mobile-nav-panel.is-open {
          opacity: 1;
          transform: translateY(0) scale(1);
          pointer-events: auto;
        }
        .mobile-nav-link {
          display: block;
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.03);
          padding: 12px 14px;
          text-decoration: none;
          color: rgba(255,255,255,0.85);
          font-weight: 600;
          letter-spacing: 0.01em;
          transition: border-color 180ms ease, background-color 180ms ease, color 180ms ease;
        }
        .mobile-nav-link.is-active,
        .mobile-nav-link:hover,
        .mobile-nav-link:focus-visible {
          border-color: rgba(61, 207, 182, 0.65);
          background: rgba(61, 207, 182, 0.14);
          color: #ddfff8;
        }
        .mobile-nav-action {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 999px;
          text-decoration: none;
          font-family: var(--ff-mono);
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.05em;
        }
        .mobile-nav-cv {
          height: 38px;
          background: var(--teal);
          color: #000;
          border: 1px solid rgba(0,0,0,0.7);
        }
        .mobile-nav-actions {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 14px;
          padding-top: 2px;
        }
        @media (prefers-reduced-motion: reduce) {
          .nav-link,
          .nav-link::after,
          .social-link,
          .cv-download,
          .mobile-nav-panel,
          .menu-toggle-bars span {
            transition: none;
          }
        }
        @keyframes element-aura-breathe {
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
        @keyframes cv-shimmer {
          0% {
            transform: rotate(18deg) translateX(-320%);
            opacity: 0;
          }
          12% {
            opacity: 0.9;
          }
          86% {
            opacity: 0.9;
          }
          100% {
            transform: rotate(18deg) translateX(640%);
            opacity: 0;
          }
        }
        @media (max-width: 860px) {
          .nav-links { display: none !important; }
        }
        @media (max-width: 560px) {
          .mobile-nav-panel {
            left: 0;
            right: 0;
            width: auto;
          }
        }
      `}</style>
      </nav>

      <ConfirmPopup
        isOpen={cvPopupOpen}
        anchorEl={cvAnchorEl}
        icon="📄"
        title={t('popup.cvTitle')}
        message={t('popup.cvMessage')}
        confirmLabel={t('popup.cvConfirm')}
        cancelLabel={t('popup.cancel')}
        confirmHref="/assets/cv/Jannik_Hoff_Lebenslauf.pdf"
        confirmDownload
        onConfirm={() => setCvPopupOpen(false)}
        onCancel={() => setCvPopupOpen(false)}
      />
    </>
  );
}
