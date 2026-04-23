const TEAL = '#3DCFB6';

export function SectionLabel({ n, text }: { n: string; text: string }) {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 12,
      padding: '6px 14px', marginBottom: 20,
      background: 'rgba(61,207,182,0.1)', border: `1px solid ${TEAL}44`, borderRadius: 999,
      fontFamily: 'var(--ff-mono)', fontSize: 12, color: TEAL, letterSpacing: '0.1em',
    }}>
      <span>{n}</span>
      <span style={{ width: 1, height: 10, background: TEAL, opacity: 0.5 }} />
      <span>{(text || '').toUpperCase()}</span>
    </div>
  );
}
