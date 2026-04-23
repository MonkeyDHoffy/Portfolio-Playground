/**
 * Three fixed, blurred gradient blobs behind the content.
 * 1:1 port of VC_GradientBlobs.
 */
export function GradientBlobs() {
  return (
    <div aria-hidden style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: '10%', left: '-5%', width: 500, height: 500, borderRadius: '50%', background: '#3DCFB6', filter: 'blur(140px)', opacity: 0.25 }} />
      <div style={{ position: 'absolute', top: '40%', right: '-5%', width: 420, height: 420, borderRadius: '50%', background: '#B8A4FF', filter: 'blur(140px)', opacity: 0.18 }} />
      <div style={{ position: 'absolute', bottom: '10%', left: '30%', width: 380, height: 380, borderRadius: '50%', background: '#FFB27A', filter: 'blur(140px)', opacity: 0.18 }} />
    </div>
  );
}
