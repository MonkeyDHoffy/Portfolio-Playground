import { useLang } from '../../i18n/LanguageContext';

export function Ticker() {
  const { t } = useLang();
  const items = [t('hero.tickerA'), t('hero.tickerB'), t('hero.tickerC')];
  const loop = [...items, ...items, ...items, ...items];
  return (
    <div style={{
      padding: '16px 0', overflow: 'hidden',
      background: 'var(--teal)', color: '#000',
      transform: 'rotate(-1.2deg)', margin: '40px -4vw',
      position: 'relative', zIndex: 1,
    }}>
      <div style={{ display: 'flex', gap: 48, animation: 'vc-marquee 24s linear infinite', whiteSpace: 'nowrap' }}>
        {loop.map((item, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 48 }}>
            <span style={{ fontSize: 22, fontWeight: 700 }}>{item}</span>
            <span style={{ fontSize: 24 }}>★</span>
          </div>
        ))}
      </div>
    </div>
  );
}
