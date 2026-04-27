import { useLang } from '../../i18n/LanguageContext';

export function Footer() {
  const { t, lang } = useLang();
  return (
    <footer style={{
      padding: '32px 40px', borderTop: '1px solid rgba(255,255,255,0.12)',
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      fontSize: 13, color: 'rgba(255,255,255,0.55)', position: 'relative', zIndex: 1,
      flexWrap: 'wrap', gap: 16,
    }}>
      <span>{t('footer.copyright')}</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
        <span style={{ color: 'var(--teal)' }}>{t('footer.made')}</span>
        <a
          href="/datenschutz/index.html"
          style={{ color: 'inherit', textDecoration: 'none' }}
        >
          {lang === 'de' ? 'Datenschutz' : 'Privacy'}
        </a>
        <a
          href="/impressum/index.html"
          style={{ color: 'inherit', textDecoration: 'none' }}
        >
          {lang === 'de' ? 'Impressum' : 'Legal Notice'}
        </a>
      </div>
    </footer>
  );
}
