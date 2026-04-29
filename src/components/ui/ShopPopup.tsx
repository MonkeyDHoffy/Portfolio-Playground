import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

const TEAL   = '#3DCFB6';
const YELLOW = '#F4E06D';
const LINE   = 'rgba(255,255,255,0.12)';
const DIM    = 'rgba(255,255,255,0.55)';

const POPUP_WIDTH = 360;
const POPUP_GAP   = 10;
const MOBILE_BP   = 860;
// Estimated popup height for overflow check (header + 5 rows + padding)
const POPUP_HEIGHT_EST = 340;

export type SkinEntry = {
  readonly id: number;
  readonly name: string;
  readonly color: string;
  readonly price: number;
};

export type ShopPopupProps = {
  isOpen: boolean;
  anchorEl: HTMLElement | null;
  skins: readonly SkinEntry[];
  ownedSkins: number[];
  activeSkin: number;
  totalPointsEarned: number;
  displayedPoints: number;
  isCountingDown: boolean;
  onBuy: (id: number) => void;
  onSelect: (id: number) => void;
  onClose: () => void;
};

export function ShopPopup({
  isOpen,
  anchorEl,
  skins,
  ownedSkins,
  activeSkin,
  totalPointsEarned,
  displayedPoints,
  isCountingDown,
  onBuy,
  onSelect,
  onClose,
}: ShopPopupProps) {
  const popupRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) popupRef.current?.focus();
    else document.body.classList.remove('popup-hovered');
  }, [isOpen]);

  if (!isOpen || typeof document === 'undefined') return null;

  const isMobile = window.innerWidth <= MOBILE_BP;

  let dtTop  = 80;
  let dtLeft = 80;
  if (!isMobile && anchorEl) {
    const rect = anchorEl.getBoundingClientRect();
    const winW = window.innerWidth;
    const winH = window.innerHeight;

    dtTop  = rect.bottom + POPUP_GAP;
    dtLeft = rect.left;

    if (dtLeft + POPUP_WIDTH > winW - 16) dtLeft = rect.right - POPUP_WIDTH;
    dtLeft = Math.max(16, Math.min(dtLeft, winW - POPUP_WIDTH - 16));

    if (dtTop + POPUP_HEIGHT_EST > winH - 16) {
      dtTop = Math.max(16, rect.top - POPUP_HEIGHT_EST - POPUP_GAP);
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
        onClick={onClose}
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

      {/* Positioner */}
      <div style={positionerStyle}>
        <div
          ref={popupRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="shop-title"
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
            position: 'absolute', inset: -6, borderRadius: 24,
            pointerEvents: 'none', zIndex: 0,
            opacity: hovered ? 1 : 0, transition: 'opacity 0.4s ease',
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
            borderRadius: 3, pointerEvents: 'none',
          }} />

          {/* Header */}
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
            marginBottom: 16, position: 'relative', zIndex: 1,
          }}>
            <div>
              <strong id="shop-title" style={{ fontSize: 15, fontWeight: 800, letterSpacing: '-0.01em', display: 'block', marginBottom: 4 }}>
                Skin Shop
              </strong>
              <span style={{ fontFamily: 'var(--ff-mono)', fontSize: 11, color: DIM }}>
                Balance:{' '}
                <span style={{
                  color: YELLOW, display: 'inline-block',
                  animation: isCountingDown ? 'shop-points-counting 0.55s ease-in-out infinite' : 'none',
                }}>
                  {displayedPoints}
                </span>{' '}pts
              </span>
            </div>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '4px 10px', borderRadius: 999, cursor: 'pointer',
                fontFamily: 'var(--ff-mono)', fontSize: 11, fontWeight: 700,
                border: `1px solid ${LINE}`, background: 'transparent', color: DIM,
                flexShrink: 0, marginLeft: 8,
              }}
            >✕</button>
          </div>

          {/* Skin list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, position: 'relative', zIndex: 1 }}>
            {skins.map((skin) => {
              const owned     = ownedSkins.includes(skin.id);
              const active    = activeSkin === skin.id;
              const canAfford = totalPointsEarned >= skin.price;
              const clickable = owned || (!owned && skin.price > 0 && canAfford);
              return (
                <div
                  key={skin.id}
                  onClick={() => { if (owned) onSelect(skin.id); else onBuy(skin.id); }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '10px 14px', minHeight: 48, borderRadius: 10,
                    border: `1px solid ${active ? skin.color + '55' : 'rgba(255,255,255,0.08)'}`,
                    background: active ? skin.color + '10' : 'rgba(255,255,255,0.03)',
                    cursor: clickable ? 'pointer' : 'default',
                    opacity: !owned && skin.price > 0 && !canAfford ? 0.4 : 1,
                    transition: 'border-color 0.15s, background 0.15s',
                    WebkitTapHighlightColor: 'transparent',
                  }}
                >
                  <div style={{
                    width: 10, height: 10, borderRadius: '50%', flexShrink: 0,
                    background: skin.color,
                    boxShadow: active ? `0 0 8px ${skin.color}` : 'none',
                  }} />
                  <span style={{
                    fontFamily: 'var(--ff-mono)', fontSize: 11, fontWeight: 700,
                    letterSpacing: '0.1em', flex: 1,
                    color: active ? skin.color : 'rgba(255,255,255,0.85)',
                  }}>
                    {skin.name}
                  </span>
                  <span style={{
                    fontFamily: 'var(--ff-mono)', fontSize: 10, letterSpacing: '0.08em',
                    color: skin.price === 0
                      ? 'rgba(255,255,255,0.3)'
                      : owned ? 'rgba(255,255,255,0.3)'
                      : canAfford ? YELLOW
                      : 'rgba(255,255,255,0.22)',
                    marginRight: 12,
                  }}>
                    {skin.price === 0 ? 'FREE' : owned ? 'OWNED' : `${skin.price} PTS`}
                  </span>
                  <span style={{
                    fontFamily: 'var(--ff-mono)', fontSize: 10, fontWeight: 700,
                    letterSpacing: '0.08em', minWidth: 52, textAlign: 'right',
                    color: active ? skin.color
                      : owned ? 'rgba(255,255,255,0.5)'
                      : canAfford ? TEAL
                      : 'rgba(255,255,255,0.18)',
                  }}>
                    {active ? '■ ACTIVE'
                      : owned ? 'EQUIP'
                      : skin.price > 0 && canAfford ? 'BUY'
                      : '—'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes shop-points-counting {
          0%, 100% { transform: scale(1); }
          50%       { transform: scale(1.22); }
        }
      `}</style>
    </>,
    document.body,
  );
}
