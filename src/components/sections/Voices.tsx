import { useEffect, useRef, useState } from 'react';
import { useLang } from '../../i18n/LanguageContext';
import { voices } from '../../data/voices';
import { SectionLabel } from '../ui/SectionLabel';
import { ConfirmPopup } from '../ui/ConfirmPopup';

const LINE = 'rgba(255,255,255,0.12)';
const AUTOPLAY_SPEED = 42;
const DRAG_THRESHOLD_PX = 16;
const INERTIA_FALLOFF = 3.2;
const SWIPE_DIRECTION_MIN_VELOCITY = 40;

export function Voices() {
  const { t, lang } = useLang();
  const trackRef = useRef<HTMLDivElement | null>(null);
  const lastFrameRef = useRef(0);
  const offsetRef = useRef(0);
  const pointerIdRef = useRef<number | null>(null);
  const dragStartXRef = useRef(0);
  const dragStartYRef = useRef(0);
  const dragStartOffsetRef = useRef(0);
  const lastPointerXRef = useRef(0);
  const lastPointerYRef = useRef(0);
  const lastPointerTimeRef = useRef(0);
  const isDraggingRef = useRef(false);
  const isHoveringRef = useRef(false);
  const hoverResumeSpeedRef = useRef(AUTOPLAY_SPEED);
  const didDragRef = useRef(false);
  const inertiaVelocityRef = useRef(0);
  const autoplaySpeedRef = useRef(AUTOPLAY_SPEED);
  const suppressClickUntilRef = useRef(0);
  const sectionRef = useRef<HTMLElement>(null);
  const isVisibleRef = useRef(true);
  const [isDragging, setIsDragging] = useState(false);
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const glowRafRef = useRef(0);
  const hoveredCardElRef = useRef<HTMLElement | null>(null);
  const glowTargetRef = useRef<{ x: number; y: number; w: number; h: number; active: boolean }>({ x: 0, y: 0, w: 0, h: 0, active: false });
  const glowCurrentRef = useRef<{ x: number; y: number; w: number; h: number; opacity: number }>({ x: 0, y: 0, w: 0, h: 0, opacity: 0 });
  const marqueeVoices = [...voices, ...voices];

  const [liPopup, setLiPopup] = useState<{
    open: boolean; url: string; name: string; anchorEl: HTMLElement | null;
  }>({ open: false, url: '', name: '', anchorEl: null });

  const openLiPopup = (url: string, name: string, el: HTMLElement) => {
    setLiPopup({ open: true, url, name, anchorEl: el });
  };
  const closeLiPopup = () => setLiPopup(s => ({ ...s, open: false }));

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let raf = 0;

    const loop = (time: number) => {
      if (!lastFrameRef.current) lastFrameRef.current = time;
      const dt = Math.min((time - lastFrameRef.current) / 1000, 0.032);
      lastFrameRef.current = time;

      if (isVisibleRef.current) {
        const loopWidth = track.scrollWidth / 2;
        if (loopWidth > 0 && !isDraggingRef.current) {
          offsetRef.current += (autoplaySpeedRef.current + inertiaVelocityRef.current) * dt;
          inertiaVelocityRef.current *= Math.exp(-INERTIA_FALLOFF * dt);
          if (Math.abs(inertiaVelocityRef.current) < 4) inertiaVelocityRef.current = 0;
        }

        if (loopWidth > 0) {
          if (offsetRef.current >= loopWidth) offsetRef.current -= loopWidth;
          if (offsetRef.current < 0) offsetRef.current += loopWidth;
        }

        track.style.transform = `translateX(${-offsetRef.current}px)`;
      }
      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      lastFrameRef.current = 0;
    };
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const obs = new IntersectionObserver(
      ([entry]) => { isVisibleRef.current = entry.isIntersecting; },
      { threshold: 0 }
    );
    obs.observe(section);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    return () => {
      document.body.classList.remove('voice-card-hovered');
      cancelAnimationFrame(glowRafRef.current);
    };
  }, []);

  useEffect(() => {
    const animate = () => {
      const t = glowTargetRef.current;
      const c = glowCurrentRef.current;
      const el = glowRef.current;
      if (!el) { glowRafRef.current = requestAnimationFrame(animate); return; }

      // Continuously update target from the live card position (handles dragging)
      if (t.active && hoveredCardElRef.current) {
        const r = hoveredCardElRef.current.getBoundingClientRect();
        t.x = r.left;
        t.y = r.top;
        t.w = r.width;
        t.h = r.height;
      }

      const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
      const opacityTarget = t.active ? 1 : 0;
      c.opacity = lerp(c.opacity, opacityTarget, 0.1);
      if (t.active) {
        c.x = lerp(c.x, t.x, 0.18);
        c.y = lerp(c.y, t.y, 0.18);
        c.w = lerp(c.w, t.w, 0.18);
        c.h = lerp(c.h, t.h, 0.18);
      }

      el.style.opacity = String(Math.round(c.opacity * 1000) / 1000);
      el.style.left = `${c.x - 6}px`;
      el.style.top = `${c.y - 6}px`;
      el.style.width = `${c.w + 12}px`;
      el.style.height = `${c.h + 12}px`;

      glowRafRef.current = requestAnimationFrame(animate);
    };
    glowRafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(glowRafRef.current);
  }, []);

  const startDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    pointerIdRef.current = e.pointerId;
    didDragRef.current = false;
    inertiaVelocityRef.current = 0;
    dragStartXRef.current = e.clientX;
    dragStartYRef.current = e.clientY;
    dragStartOffsetRef.current = offsetRef.current;
    lastPointerXRef.current = e.clientX;
    lastPointerYRef.current = e.clientY;
    lastPointerTimeRef.current = e.timeStamp;
  };

  const moveDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    if (pointerIdRef.current !== e.pointerId) return;

    const dx = e.clientX - dragStartXRef.current;
    const dy = e.clientY - dragStartYRef.current;
    if (!didDragRef.current && Math.abs(dx) >= DRAG_THRESHOLD_PX && Math.abs(dx) > Math.abs(dy) + 2) {
      didDragRef.current = true;
      isDraggingRef.current = true;
      setIsDragging(true);
      e.currentTarget.setPointerCapture(e.pointerId);
    }

    if (didDragRef.current) {
      offsetRef.current = dragStartOffsetRef.current - dx;
      const dt = (e.timeStamp - lastPointerTimeRef.current) / 1000;
      if (dt > 0) {
        const pointerDx = e.clientX - lastPointerXRef.current;
        const sampleVelocity = -(pointerDx / dt);
        inertiaVelocityRef.current = inertiaVelocityRef.current * 0.35 + sampleVelocity * 0.65;
      }
    }

    lastPointerXRef.current = e.clientX;
    lastPointerYRef.current = e.clientY;
    lastPointerTimeRef.current = e.timeStamp;
  };

  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    if (pointerIdRef.current !== e.pointerId) return;

    if (didDragRef.current) {
      isDraggingRef.current = false;
      setIsDragging(false);
      const totalDx = lastPointerXRef.current - dragStartXRef.current;
      const velocity = inertiaVelocityRef.current;
      let direction = 0;

      if (Math.abs(velocity) >= SWIPE_DIRECTION_MIN_VELOCITY) {
        direction = Math.sign(velocity);
      } else if (Math.abs(totalDx) >= DRAG_THRESHOLD_PX) {
        direction = -Math.sign(totalDx);
      }

      if (direction !== 0) {
        autoplaySpeedRef.current = direction * Math.abs(AUTOPLAY_SPEED);
      }

      suppressClickUntilRef.current = Date.now() + 260;
    } else {
      inertiaVelocityRef.current = 0;
    }

    pointerIdRef.current = null;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {
        // ignore release errors from edge cases
      }
    }
  };

  const cancelDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    if (pointerIdRef.current !== e.pointerId) return;
    isDraggingRef.current = false;
    setIsDragging(false);
    pointerIdRef.current = null;
    inertiaVelocityRef.current = 0;
  };

  const pauseAutoplayOnHover = () => {
    if (isHoveringRef.current) return;
    isHoveringRef.current = true;
    hoverResumeSpeedRef.current = autoplaySpeedRef.current === 0 ? AUTOPLAY_SPEED : autoplaySpeedRef.current;
    autoplaySpeedRef.current = 0;
    inertiaVelocityRef.current = 0;
  };

  const resumeAutoplayAfterHover = () => {
    if (!isHoveringRef.current) return;
    isHoveringRef.current = false;
    autoplaySpeedRef.current = hoverResumeSpeedRef.current || AUTOPLAY_SPEED;
  };

  return (
    <section className="voices-section" ref={sectionRef} style={{ padding: '40px 40px', position: 'relative', zIndex: 1 }}>
      <div style={{ maxWidth: 1180, margin: '0 auto' }}>
        <SectionLabel n={t('voices.index')} text={t('voices.label')} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16, color: 'rgba(255,255,255,0.5)' }}>
          <h2 style={{
            fontSize: 'clamp(40px, 6vw, 72px)', fontWeight: 800, lineHeight: 1,
            margin: 0, letterSpacing: '-0.03em', color: '#fff',
          }}>
            {t('voices.title')}
          </h2>
        </div>

        <div
          className={`voices-marquee-viewport${isDragging ? ' is-dragging' : ''}`}
          style={{ marginTop: 40 }}
          onPointerDown={startDrag}
          onPointerMove={moveDrag}
          onPointerUp={endDrag}
          onPointerCancel={cancelDrag}
          onMouseEnter={pauseAutoplayOnHover}
          onMouseLeave={resumeAutoplayAfterHover}
        >
          <div
            ref={trackRef}
            className="voices-marquee-track"
          >
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
                onMouseEnter={(e) => {
                  setHoveredCardId(`${v.id}-${i}`);
                  document.body.classList.add('voice-card-hovered');
                  hoveredCardElRef.current = e.currentTarget as HTMLElement;
                  const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
                  glowTargetRef.current = { x: r.left, y: r.top, w: r.width, h: r.height, active: true };
                  glowCurrentRef.current.x = r.left;
                  glowCurrentRef.current.y = r.top;
                  glowCurrentRef.current.w = r.width;
                  glowCurrentRef.current.h = r.height;
                }}
                onMouseLeave={() => {
                  setHoveredCardId(null);
                  document.body.classList.remove('voice-card-hovered');
                  hoveredCardElRef.current = null;
                  glowTargetRef.current.active = false;
                }}
                onClick={(e) => {
                  if (!v.profileUrl || v.wink) return;
                  if (Date.now() < suppressClickUntilRef.current) return;
                  openLiPopup(v.profileUrl, v.sender, e.currentTarget as HTMLElement);
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
                <div
                  className="voice-avatar"
                  style={{
                  width: 48, height: 48, borderRadius: '50%',
                  background: v.avatar.color, color: '#000',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'var(--ff-mono)', fontWeight: 700, fontSize: 14,
                  border: '2px solid #000',
                  overflow: 'hidden',
                  }}
                >
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
                  <div className="voice-card-meta" style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 6 }}>
                    <span style={{ fontWeight: 700, fontSize: 15 }}>{v.sender}</span>
                    <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>{v.handle}</span>
                    {v.wink && <span style={{ fontSize: 13 }} title="AI-generated">😉</span>}
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
                  <div className="voice-card-stats" style={{ display: 'flex', gap: 20, color: 'rgba(255,255,255,0.55)', fontSize: 13 }}>
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
          touch-action: pan-y;
          cursor: grab;
          user-select: none;
        }
        .voices-marquee-viewport.is-dragging {
          cursor: grabbing;
        }
        .voices-marquee-track {
          display: flex;
          gap: 16px;
          width: max-content;
          will-change: transform;
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
        @media (max-width: 860px) {
          .voices-section {
            padding: 28px 20px !important;
          }
          .voices-marquee-track {
            gap: 12px;
          }
          .voice-card {
            width: min(84vw, 460px) !important;
          }
        }
        @media (max-width: 640px) {
          .voices-marquee-viewport {
            width: 100%;
            margin-left: 0;
            transform: none;
            mask-image: none;
          }
          .voices-marquee-track {
            gap: 10px;
          }
          .voice-card {
            width: min(86vw, 360px) !important;
            min-height: 230px;
            grid-template-columns: 1fr !important;
            gap: 12px !important;
            padding: 16px !important;
          }
          .voice-avatar {
            width: 44px !important;
            height: 44px !important;
          }
          .voice-card-copy {
            min-width: 0;
          }
          .voice-card-meta {
            gap: 6px !important;
          }
          .voice-card-stats {
            display: none !important;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .voice-card:hover {
            transform: none !important;
            box-shadow: none;
          }
        }
      `}</style>

      <div
        ref={glowRef}
        aria-hidden
        style={{
          position: 'fixed',
          borderRadius: 24,
          pointerEvents: 'none',
          zIndex: 9999,
          opacity: 0,
          boxShadow: '0 0 0 1px rgba(255,178,122,0.25), 0 0 32px 8px rgba(255,178,122,0.3), 0 0 80px 20px rgba(255,178,122,0.14)',
          animation: hoveredCardId ? 'element-aura-breathe 3.2s ease-in-out infinite' : 'none',
        }}
      />
      <ConfirmPopup
        isOpen={liPopup.open}
        anchorEl={liPopup.anchorEl}
        icon="💼"
        title={t('popup.liTitle')}
        message={
          lang === 'de'
            ? `Du wirst zum LinkedIn-Profil von ${liPopup.name} weitergeleitet.`
            : `You'll be redirected to ${liPopup.name}'s LinkedIn profile.`
        }
        confirmLabel={t('popup.liConfirmBtn')}
        cancelLabel={t('popup.cancel')}
        confirmHref={liPopup.url}
        onConfirm={closeLiPopup}
        onCancel={closeLiPopup}
      />
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
