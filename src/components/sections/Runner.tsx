import { useEffect, useRef, useState, useCallback } from 'react';
import { useLang } from '../../i18n/LanguageContext';

const TEAL   = '#3DCFB6';
const PEACH  = '#FFB27A';
const YELLOW = '#F4E06D';
const LILAC  = '#B8A4FF';
const LINE   = 'rgba(255,255,255,0.12)';
const DIM    = 'rgba(255,255,255,0.55)';

type Obstacle = { id: number; x: number; h: number; passed?: boolean; hit?: boolean };
type Coin     = { id: number; x: number; y: number; taken?: boolean };
type Particle = { id: number; x: number; y: number; vx: number; vy: number; life: number; color: string };
type Cloud    = { x: number; y: number; w: number; speed: number };
type Hill     = { x: number; w: number; h: number };

const BEST_KEY = 'jh.runner.best';

export function Runner() {
  const { t } = useLang();
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(() => {
    if (typeof window === 'undefined') return 0;
    return parseInt(window.localStorage.getItem(BEST_KEY) || '0', 10) || 0;
  });
  const [running, setRunning] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [y, setY] = useState(0);
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [coins, setCoins] = useState<Coin[]>([]);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [clouds, setClouds] = useState<Cloud[]>([
    { x: 120, y: 28, w: 60, speed: 14 },
    { x: 420, y: 52, w: 42, speed: 10 },
    { x: 720, y: 20, w: 72, speed: 18 },
  ]);
  const [hills, setHills] = useState<Hill[]>([
    { x: 0,   w: 300, h: 50 },
    { x: 340, w: 380, h: 70 },
    { x: 760, w: 320, h: 40 },
  ]);

  const vyRef = useRef(0);
  const lastRef = useRef(0);
  const runningRef = useRef(false);
  const canJumpRef = useRef(true);
  const scoreRef = useRef(0);
  const yRef = useRef(0);

  runningRef.current = running;
  scoreRef.current = score;
  yRef.current = y;

  const jump = useCallback(() => {
    if (!runningRef.current) return;
    if (!canJumpRef.current) return;
    vyRef.current = 720;
    canJumpRef.current = false;
    // burst particles on jump
    setParticles((ps) => [
      ...ps,
      ...Array.from({ length: 8 }, (_, i) => ({
        id: Math.random() + i,
        x: 58,
        y: 16,
        vx: (Math.random() - 0.5) * 140,
        vy: Math.random() * 120,
        life: 0.5,
        color: [TEAL, PEACH, YELLOW][i % 3],
      })),
    ]);
  }, []);

  const start = useCallback(() => {
    setScore(0);
    setY(0);
    vyRef.current = 0;
    canJumpRef.current = true;
    setObstacles([{ id: 1, x: 700, h: 20 }]);
    setCoins([{ id: 10, x: 1000, y: 50 }]);
    setParticles([]);
    setGameOver(false);
    setRunning(true);
  }, []);

  const endGame = useCallback(() => {
    setRunning(false);
    setGameOver(true);
    setBest((b) => {
      const nb = Math.max(b, scoreRef.current);
      if (typeof window !== 'undefined') window.localStorage.setItem(BEST_KEY, String(nb));
      return nb;
    });
  }, []);

  // Keyboard: Space / Up / W
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') {
        if (!runningRef.current && !gameOver) { start(); e.preventDefault(); return; }
        if (runningRef.current) { jump(); e.preventDefault(); }
      }
      if (e.code === 'Enter' && gameOver) { start(); e.preventDefault(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [jump, start, gameOver]);

  // Main loop
  useEffect(() => {
    if (!running) return;
    let raf = 0;
    lastRef.current = 0;
    const loop = (tm: number) => {
      if (!lastRef.current) lastRef.current = tm;
      const dt = Math.min((tm - lastRef.current) / 1000, 0.032);
      lastRef.current = tm;

      // gravity
      vyRef.current -= 1800 * dt;
      setY((py) => {
        let ny = py + vyRef.current * dt;
        if (ny <= 0) {
          ny = 0;
          vyRef.current = 0;
          canJumpRef.current = true;
        }
        if (ny >= 95) ny = 95;
        return ny;
      });

      const speed = 200 + scoreRef.current * 12;

      // clouds & hills (parallax)
      setClouds((cs) => cs.map((c) => {
        let nx = c.x - c.speed * dt;
        if (nx < -c.w) nx = 960 + Math.random() * 200;
        return { ...c, x: nx };
      }));
      setHills((hs) => hs.map((h) => {
        let nx = h.x - (speed * 0.35) * dt;
        if (nx + h.w < 0) nx = 960 + Math.random() * 200;
        return { ...h, x: nx };
      }));

      // obstacles
      setObstacles((obs) => {
        let next = obs.map((o) => ({ ...o, x: o.x - speed * dt })).filter((o) => o.x > -30);
        const tail = next[next.length - 1];
        const spacing = 320 + Math.random() * 180;
        if (!tail || tail.x < 700 - spacing) {
          next.push({ id: Math.random(), x: 720, h: 20 + Math.random() * 16 });
        }
        return next;
      });

      // coins
      setCoins((cs) => {
        let next = cs.map((c) => ({ ...c, x: c.x - speed * dt })).filter((c) => c.x > -20);
        const tail = next[next.length - 1];
        if (!tail || tail.x < 700 - 280 - Math.random() * 200) {
          next.push({ id: Math.random(), x: 750, y: 40 + Math.random() * 50 });
        }
        return next;
      });

      // particles
      setParticles((ps) =>
        ps
          .map((p) => ({
            ...p,
            x: p.x + p.vx * dt,
            y: p.y + p.vy * dt,
            vy: p.vy - 400 * dt,
            life: p.life - dt,
          }))
          .filter((p) => p.life > 0)
      );

      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [running]);

  // Collision + scoring
  useEffect(() => {
    if (!running) return;
    const playerLeft = 50, playerRight = 64, playerBottom = 10 + y, playerTop = 26 + y;
    // obstacles
    let pointsThisFrame = 0;
    let hit = false;
    setObstacles((obs) => obs.map((o) => {
      if (!o.passed && o.x + 10 < 50) { pointsThisFrame += 1; return { ...o, passed: true }; }
      const overlapX = playerRight > o.x && playerLeft < o.x + 10;
      const overlapY = playerBottom < (10 + o.h) && playerTop > 10;
      if (!o.hit && overlapX && overlapY) { hit = true; return { ...o, hit: true }; }
      return o;
    }));
    // coins
    setCoins((cs) => cs.map((c) => {
      if (c.taken) return c;
      const overlapX = playerRight > c.x && playerLeft < c.x + 16;
      const overlapY = playerTop > c.y && playerBottom < c.y + 16;
      if (overlapX && overlapY) {
        pointsThisFrame += 3;
        setParticles((ps) => [
          ...ps,
          ...Array.from({ length: 10 }, (_, i) => ({
            id: Math.random() + i,
            x: c.x + 8,
            y: c.y + 8,
            vx: (Math.random() - 0.5) * 180,
            vy: (Math.random() - 0.3) * 160,
            life: 0.6,
            color: YELLOW,
          })),
        ]);
        return { ...c, taken: true, x: -999 };
      }
      return c;
    }));
    if (pointsThisFrame > 0) setScore((s) => s + pointsThisFrame);
    if (hit) endGame();
  }, [y, obstacles.map((o) => Math.round(o.x)).join(','), coins.map((c) => Math.round(c.x)).join(','), running, endGame]);

  const handleClick = () => {
    if (!running && !gameOver) { start(); return; }
    if (gameOver) { start(); return; }
    jump();
  };

  const groundY = 16; // px from bottom
  const skyGradient = `linear-gradient(180deg,
    rgba(61,207,182,0.10) 0%,
    rgba(184,164,255,0.10) 45%,
    rgba(255,178,122,0.10) 100%)`;

  return (
    <section style={{ padding: '40px 40px 80px', position: 'relative', zIndex: 1 }}>
      <div style={{ maxWidth: 1180, margin: '0 auto' }}>
        <div style={{ fontSize: 13, color: DIM, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ width: 24, height: 1, background: TEAL }} />
          {t('runner.hint')}
        </div>

        <div
          onClick={handleClick}
          role="button"
          tabIndex={0}
          style={{
            position: 'relative', height: 200, borderRadius: 22,
            background: skyGradient,
            border: `1px solid ${LINE}`, overflow: 'hidden', cursor: 'pointer',
            userSelect: 'none',
          }}
        >
          {/* Stars */}
          {Array.from({ length: 18 }).map((_, i) => (
            <div key={`s${i}`} aria-hidden style={{
              position: 'absolute',
              top: 10 + (i * 37) % 90,
              left: (i * 53) % 960,
              width: 2, height: 2, borderRadius: '50%', background: 'rgba(255,255,255,0.3)',
              opacity: 0.5 + ((i * 7) % 5) / 10,
            }} />
          ))}

          {/* Clouds */}
          {clouds.map((c, i) => (
            <div key={`c${i}`} aria-hidden style={{
              position: 'absolute',
              top: c.y,
              left: c.x,
              width: c.w, height: c.w * 0.35,
              background: 'rgba(255,255,255,0.07)',
              borderRadius: 999,
              filter: 'blur(1px)',
            }} />
          ))}

          {/* Hills (parallax) */}
          {hills.map((h, i) => (
            <div key={`h${i}`} aria-hidden style={{
              position: 'absolute',
              bottom: groundY,
              left: h.x,
              width: h.w, height: h.h,
              background: `linear-gradient(180deg, ${LILAC}22, ${LILAC}08)`,
              borderTopLeftRadius: '50% 100%',
              borderTopRightRadius: '50% 100%',
            }} />
          ))}

          {/* HUD */}
          <div style={{
            position: 'absolute', top: 16, left: 20, display: 'flex', gap: 18,
            fontFamily: 'var(--ff-mono)', fontSize: 11,
          }}>
            <div style={{ color: DIM }}>
              {t('runner.score')}: <span style={{ color: TEAL, fontSize: 18, fontWeight: 700 }}>{String(score).padStart(3, '0')}</span>
            </div>
            <div style={{ color: DIM }}>
              {t('runner.best')}: <span style={{ color: YELLOW, fontSize: 14, fontWeight: 700 }}>{String(best).padStart(3, '0')}</span>
            </div>
          </div>

          {/* Ground line */}
          <div style={{
            position: 'absolute', bottom: groundY, left: 0, right: 0, height: 1,
            background: TEAL, opacity: 0.5,
            boxShadow: `0 0 8px ${TEAL}77`,
          }} />
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, height: groundY,
            background: 'linear-gradient(180deg, rgba(61,207,182,0.06), transparent)',
          }} />

          {/* Player */}
          <div style={{
            position: 'absolute', bottom: groundY + y, left: 50,
            width: 14, height: 16, borderRadius: 4,
            background: TEAL,
            boxShadow: `0 0 20px ${TEAL}, 0 0 4px ${TEAL}`,
            transform: `rotate(${Math.min(30, vyRef.current * 0.02)}deg)`,
            transition: 'transform 80ms ease',
          }}>
            {/* trail */}
            <div style={{
              position: 'absolute', left: -6, top: 4, width: 6, height: 8,
              background: `linear-gradient(90deg, transparent, ${TEAL}88)`,
              borderRadius: 4,
            }} />
          </div>

          {/* Obstacles */}
          {obstacles.map((o) => (
            <div key={o.id} style={{
              position: 'absolute', bottom: groundY, left: o.x,
              width: 10, height: o.h, background: PEACH, borderRadius: 2,
              boxShadow: `0 0 12px ${PEACH}80`,
            }}>
              <div style={{
                position: 'absolute', top: -2, left: 0, right: 0, height: 3,
                background: '#000', borderRadius: 2, opacity: 0.25,
              }} />
            </div>
          ))}

          {/* Coins */}
          {coins.map((c) => !c.taken && (
            <div key={c.id} style={{
              position: 'absolute', bottom: groundY + c.y, left: c.x,
              width: 16, height: 16, borderRadius: '50%',
              background: YELLOW,
              border: '2px solid #000',
              boxShadow: `0 0 18px ${YELLOW}99`,
              animation: 'vc-spin 1.2s linear infinite',
            }}>
              <div style={{
                position: 'absolute', inset: 3, borderRadius: '50%',
                background: '#000', opacity: 0.2,
              }} />
            </div>
          ))}

          {/* Particles */}
          {particles.map((p) => (
            <div key={p.id} style={{
              position: 'absolute', bottom: groundY + p.y, left: p.x,
              width: 4, height: 4, borderRadius: '50%', background: p.color,
              opacity: Math.min(1, p.life * 2),
              pointerEvents: 'none',
            }} />
          ))}

          {/* Ready overlay */}
          {!running && !gameOver && (
            <div style={{
              position: 'absolute', inset: 0, display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              background: 'rgba(15,15,15,0.35)', backdropFilter: 'blur(2px)',
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  fontFamily: 'var(--ff-mono)', fontSize: 14, color: TEAL, letterSpacing: '0.1em',
                  marginBottom: 6,
                }}>▶ {t('runner.ready')}</div>
                <div style={{ fontSize: 11, color: DIM, fontFamily: 'var(--ff-mono)' }}>
                  SPACE · CLICK · TAP
                </div>
              </div>
            </div>
          )}

          {/* Game over overlay */}
          {gameOver && (
            <div style={{
              position: 'absolute', inset: 0, display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              background: 'rgba(15,15,15,0.55)', backdropFilter: 'blur(3px)',
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  fontFamily: 'var(--ff-mono)', fontSize: 13, color: PEACH, letterSpacing: '0.25em',
                  marginBottom: 8, animation: 'vc-blink 1s infinite',
                }}>{t('runner.gameOver')}</div>
                <div style={{ fontSize: 24, fontWeight: 800, marginBottom: 4 }}>{score}</div>
                <div style={{ fontSize: 12, color: DIM, marginBottom: 12 }}>
                  {t('runner.best')}: {best}
                </div>
                <div style={{
                  display: 'inline-block',
                  padding: '8px 16px', borderRadius: 999,
                  background: TEAL, color: '#000',
                  border: '2px solid #000', boxShadow: '3px 3px 0 #000',
                  fontSize: 13, fontWeight: 700,
                }}>{t('runner.restart')} ↵</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
