import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

const TEAL = '#3DCFB6';
const POPUP_WIDTH = 296;
const POPUP_GAP = 10;
const MOBILE_BP = 860;

export type ConfirmPopupProps = {
  /** Whether the popup is visible. */
  isOpen: boolean;
  /** The element the popup anchors to on desktop (used for position calculation). */
  anchorEl: HTMLElement | null;
  /** Bold heading shown at the top of the popup. */
  title: string;
  /** Body text describing the action. */
  message: string;
  /** Label for the confirm (right) button. */
  confirmLabel: string;
  /** Label for the cancel (left) button. */
  cancelLabel: string;
  /** Optional emoji or icon shown next to the title. */
  icon?: string;
  /** If set, the confirm button becomes an anchor tag pointing to this URL. */
  confirmHref?: string;
  /** When true the confirm anchor uses the download attribute instead of target="_blank". */
  confirmDownload?: boolean;
  /** Called when the user clicks confirm. Also called on link-style confirm before navigation. */
  onConfirm?: () => void;
  /** Called on cancel click, backdrop click, or Escape key. */
  onCancel: () => void;
};

export function ConfirmPopup({
  isOpen,
  anchorEl,
  title,
  message,
  confirmLabel,
  cancelLabel,
  icon,
  confirmHref,
  confirmDownload,
  onConfirm,
  onCancel,
}: ConfirmPopupProps) {
  const popupRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onCancel(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onCancel]);

  useEffect(() => {
    if (isOpen) popupRef.current?.focus();
    else document.body.classList.remove('popup-hovered');
  }, [isOpen]);

  if (!isOpen || typeof document === 'undefined') return null;

  const isMobile = window.innerWidth <= MOBILE_BP;

  // Desktop: compute position from anchor element
  let dtTop = 80;
  let dtLeft = 80;
  if (!isMobile && anchorEl) {
    const rect = anchorEl.getBoundingClientRect();
    const winW = window.innerWidth;
    const winH = window.innerHeight;

    dtTop  = rect.bottom + POPUP_GAP;
    dtLeft = rect.left;

    // Clamp right edge
    if (dtLeft + POPUP_WIDTH > winW - 16) dtLeft = rect.right - POPUP_WIDTH;
    dtLeft = Math.max(16, Math.min(dtLeft, winW - POPUP_WIDTH - 16));

    // If popup overflows bottom, show above anchor
    if (dtTop + 210 > winH - 16) {
      dtTop = Math.max(16, rect.top - 210 - POPUP_GAP);
    }
  }

  const positionerStyle: React.CSSProperties = isMobile
    ? {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: `min(${POPUP_WIDTH}px, calc(100vw - 32px))`,
        zIndex: 200,
      }
    : {
        position: 'fixed',
        top: dtTop,
        left: dtLeft,
        width: POPUP_WIDTH,
        zIndex: 200,
      };

  return createPortal(
    <>
      {/* Backdrop — transparent on desktop (click-outside), blurred on mobile */}
      <button
        type="button"
        aria-label="Schließen"
        onClick={onCancel}
        style={{
          position: 'fixed', inset: 0,
          zIndex: 199,
          border: 0, padding: 0, margin: 0,
          cursor: 'default',
          background: isMobile ? 'rgba(0,0,0,0.52)' : 'transparent',
          backdropFilter: isMobile ? 'blur(4px)' : 'none',
          WebkitBackdropFilter: isMobile ? 'blur(4px)' : 'none',
        }}
      />

      {/* Positioner — handles centering without conflicting with animation transform */}
      <div style={positionerStyle}>
        <div
          ref={popupRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="cpop-title"
          tabIndex={-1}
          onMouseEnter={() => { setHovered(true); document.body.classList.add('popup-hovered'); }}
          onMouseLeave={() => { setHovered(false); document.body.classList.remove('popup-hovered'); }}
          style={{
            position: 'relative',
            background: '#16161A',
            border: '2px solid #000',
            boxShadow: '5px 5px 0 #000',
            borderRadius: 18,
            padding: '22px 20px 16px',
            outline: 'none',
            animation: 'cpop-in 170ms cubic-bezier(0.22, 0.9, 0.3, 1) both',
          }}
        >
          {/* Element aura on hover */}
          <div aria-hidden style={{
            position: 'absolute',
            inset: -6,
            borderRadius: 24,
            pointerEvents: 'none',
            zIndex: 0,
            opacity: hovered ? 1 : 0,
            transition: 'opacity 0.4s ease',
            boxShadow: '0 0 0 1px rgba(255,178,122,0.25), 0 0 32px 8px rgba(255,178,122,0.3), 0 0 80px 20px rgba(255,178,122,0.14)',
            animation: hovered ? 'element-aura-breathe 3.2s ease-in-out infinite' : 'none',
          }} />

          {/* Decorative tape strip */}
          <div aria-hidden style={{
            position: 'absolute', top: -7, left: '50%',
            transform: 'translateX(-50%) rotate(-2deg)',
            width: 52, height: 13,
            background: 'rgba(244,224,109,0.65)',
            border: '1px dashed rgba(0,0,0,0.25)',
            borderRadius: 3,
            pointerEvents: 'none',
          }} />

          {/* Title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 10 }}>
            {icon && <span aria-hidden style={{ fontSize: 20, lineHeight: 1, flexShrink: 0 }}>{icon}</span>}
            <strong
              id="cpop-title"
              style={{ fontSize: 15, fontWeight: 800, letterSpacing: '-0.01em', lineHeight: 1.2 }}
            >
              {title}
            </strong>
          </div>

          {/* Message */}
          <p style={{ margin: '0 0 18px', fontSize: 13.5, lineHeight: 1.55, color: 'rgba(255,255,255,0.7)' }}>
            {message}
          </p>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <button onClick={onCancel} className="cpop-btn-cancel cta-fx cta-peach">
              {cancelLabel}
            </button>
            {confirmHref ? (
              <a
                href={confirmHref}
                download={confirmDownload ? '' : undefined}
                target={confirmDownload ? undefined : '_blank'}
                rel={confirmDownload ? undefined : 'noopener noreferrer'}
                onClick={onConfirm}
                className="cpop-btn-confirm cta-fx cta-teal"
              >
                {confirmLabel}
              </a>
            ) : (
              <button onClick={onConfirm} className="cpop-btn-confirm cta-fx cta-teal">
                {confirmLabel}
              </button>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes cpop-in {
          from { opacity: 0; transform: translateY(8px) scale(0.95); }
          to   { opacity: 1; transform: translateY(0)  scale(1); }
        }
        .cpop-btn-cancel {
          display: inline-flex;
          align-items: center;
          padding: 8px 15px;
          border-radius: 999px;
          border: 2px solid #000;
          box-shadow: 3px 3px 0 #000;
          background: #FFB27A;
          color: #000;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          text-decoration: none;
          transition: transform 150ms ease, box-shadow 150ms ease;
          font-family: inherit;
        }
        .cpop-btn-confirm {
          display: inline-flex;
          align-items: center;
          padding: 8px 15px;
          border-radius: 999px;
          border: 2px solid #000;
          box-shadow: 3px 3px 0 #000;
          background: ${TEAL};
          color: #000;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          text-decoration: none;
          transition: transform 150ms ease, box-shadow 150ms ease;
          font-family: inherit;
        }
        @media (prefers-reduced-motion: reduce) {
          .cpop-in { animation: none !important; }
        }
      `}</style>
    </>,
    document.body,
  );
}
