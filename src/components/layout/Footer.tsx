import { useLang } from '../../i18n/LanguageContext';

const LINE = 'rgba(255,255,255,0.12)';

export function Footer() {
  const { t, lang } = useLang();
  const roleText = lang === 'de' ? 'Softwaredeveloper' : 'Software Developer';

  return (
    <footer
      className="site-footer"
      style={{
        padding: '32px 40px',
        borderTop: `1px solid ${LINE}`,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: 13,
        color: 'rgba(255,255,255,0.55)',
        position: 'relative',
        zIndex: 1,
        flexWrap: 'wrap',
        gap: 16,
      }}
    >
      <div className="footer-left" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <img
          src="/jhicon.png"
          alt="HOFFJA"
          style={{ width: 26, height: 26, objectFit: 'cover', display: 'block', flexShrink: 0 }}
        />
        <div style={{ display: 'grid', gap: 6 }}>
          <span>{t('footer.copyright')}</span>
          <span style={{ color: 'rgba(255,255,255,0.82)', fontSize: 12, letterSpacing: '0.02em' }}>{roleText}</span>
        </div>
      </div>

      <div className="footer-right" style={{ display: 'grid', gap: 10, justifyItems: 'end' }}>
        <div className="footer-social" style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          <a href="mailto:hoffjannik95@gmail.com" className="footer-chip" aria-label="Mail">
            <span className="footer-chip-icon">@</span>
            <span>Mail</span>
          </a>
          <a href="https://github.com/MonkeyDHoffy" target="_blank" rel="noreferrer" className="footer-chip" aria-label="GitHub">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.26.82-.577 0-.285-.01-1.04-.015-2.04-3.338.725-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.73.083-.73 1.205.085 1.84 1.238 1.84 1.238 1.07 1.835 2.807 1.305 3.492.998.108-.776.42-1.305.763-1.605-2.665-.3-5.467-1.332-5.467-5.93 0-1.31.47-2.38 1.236-3.22-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.3 1.23.96-.267 1.98-.4 3-.405 1.02.005 2.04.138 3 .405 2.29-1.552 3.297-1.23 3.297-1.23.654 1.652.243 2.873.12 3.176.77.84 1.233 1.91 1.233 3.22 0 4.61-2.807 5.625-5.48 5.92.43.37.814 1.102.814 2.222 0 1.606-.015 2.9-.015 3.293 0 .32.217.695.825.577C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z" />
            </svg>
            <span>GitHub</span>
          </a>
          <a href="https://www.linkedin.com/in/jannik-hoff/" target="_blank" rel="noreferrer" className="footer-chip" aria-label="LinkedIn">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.024-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.047c.476-.9 1.637-1.852 3.37-1.852 3.602 0 4.268 2.37 4.268 5.455v6.288zM5.337 7.433a2.063 2.063 0 01-2.063-2.064 2.063 2.063 0 112.063 2.064zM6.813 20.452H3.859V9h2.954v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451c.979 0 1.778-.773 1.778-1.729V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
            <span>LinkedIn</span>
          </a>
        </div>

        <div className="footer-legal" style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          <span style={{ color: 'var(--teal)' }}>{t('footer.made')}</span>
          <a href="/datenschutz/index.html" className="footer-legal-link">
            {lang === 'de' ? 'Datenschutz' : 'Privacy'}
          </a>
          <a href="/impressum/index.html" className="footer-legal-link">
            {lang === 'de' ? 'Impressum' : 'Legal Notice'}
          </a>
        </div>
      </div>

      <style>{`
        .footer-chip {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 7px 10px;
          border-radius: 999px;
          border: 1px solid ${LINE};
          color: rgba(255,255,255,0.9);
          text-decoration: none;
          font-size: 12px;
          line-height: 1;
          background: rgba(255,255,255,0.03);
          transition: transform 180ms ease, border-color 180ms ease, color 180ms ease;
        }
        .footer-chip:hover {
          transform: translateY(-1px);
          color: #fff;
          border-color: rgba(61,207,182,0.45);
        }
        .footer-chip-icon {
          font-family: var(--ff-mono);
          font-size: 12px;
          font-weight: 700;
          color: var(--teal);
        }
        .footer-legal-link {
          color: inherit;
          text-decoration: none;
          transition: color 180ms ease;
        }
        .footer-legal-link:hover {
          color: rgba(255,255,255,0.9);
        }
        @media (max-width: 860px) {
          .site-footer {
            align-items: flex-start;
          }
          .footer-right {
            width: 100%;
            justify-items: start !important;
            order: 1;
          }
          .footer-social,
          .footer-legal {
            justify-content: flex-start !important;
          }
          .footer-left {
            order: 2;
          }
          .footer-legal {
            font-size: 12px;
          }
        }
      `}</style>
    </footer>
  );
}
