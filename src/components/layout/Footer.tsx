import { useLang } from '../../i18n/LanguageContext';

export function Footer() {
  const { t } = useLang();
  return (
    <footer style={{
      padding: '32px 40px', borderTop: '1px solid rgba(255,255,255,0.12)',
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      fontSize: 13, color: 'rgba(255,255,255,0.55)', position: 'relative', zIndex: 1,
      flexWrap: 'wrap', gap: 16,
    }}>
      <span>{t('footer.copyright')}</span>
      <span style={{ color: 'var(--teal)' }}>{t('footer.made')}</span>
    </footer>
  );
}
