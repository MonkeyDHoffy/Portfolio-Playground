import { useEffect, useRef, useState, useCallback } from 'react';
import { useLang } from '../../i18n/LanguageContext';

const TEAL   = '#3DCFB6';
const PEACH  = '#FFB27A';
const YELLOW = '#F4E06D';
const LILAC  = '#B8A4FF';
const LINE   = 'rgba(255,255,255,0.12)';
const DIM    = 'rgba(255,255,255,0.55)';

type Pipe = { id: number; x: number; gapY: number; gapH: number; passed?: boolean };
type PointPickup = { id: number; x: number; y: number };
type Particle = { id: number; x: number; y: number; vx: number; vy: number; life: number; color: string };
type Cloud    = { x: number; y: number; w: number; speed: number };
type Hill     = { x: number; w: number; h: number };

const WORLD_W = 960;
const WORLD_H = 200;
const PIPE_W = 30;
const BIRD_X = 140;
const BIRD_SIZE = 30;
const BIRD_HALF = BIRD_SIZE / 2;
const BIRD_IMG = '/assets/aboutme/avatar.png';
const PICKUP_SIZE = 18;
const PICKUP_HALF = PICKUP_SIZE / 2;
const PICKUP_BONUS = 1;
const PIPE_SPEED_PHASE_SWITCH_DISTANCE_M = 1600;
const PIPE_SPEED_PHASE_TWO_SWITCH_DISTANCE_M = 2600;
const PIPE_SPEED_STEP_DISTANCE_M = 70;
const PIPE_SPEED_STEP_MULT = 0.08;
const PIPE_SPEED_LATE_STEP_DISTANCE_M = 80;
const PIPE_SPEED_LATE_STEP_MULT = 0.03;
const PIPE_SPEED_ULTRA_LATE_STEP_DISTANCE_M = 100;
const PIPE_SPEED_ULTRA_LATE_STEP_MULT = 0.01;
const TOTAL_POINTS_KEY = 'portfolio.runner.totalPointsEarned';
const DISTANCE_HIGHSCORE_KEY = 'portfolio.runner.distanceHighscore';

export function Runner() {
  const { t, lang } = useLang();
  const [score, setScore] = useState(0);
  const [totalPointsEarned, setTotalPointsEarned] = useState(() => {
    if (typeof window === 'undefined') return 0;
    return parseInt(window.localStorage.getItem(TOTAL_POINTS_KEY) || '0', 10) || 0;
  });
  const [distanceHighscore, setDistanceHighscore] = useState(() => {
    if (typeof window === 'undefined') return 0;
    return parseInt(window.localStorage.getItem(DISTANCE_HIGHSCORE_KEY) || '0', 10) || 0;
  });
  const [status, setStatus] = useState<'ready' | 'running' | 'gameover'>('ready');
  const [birdY, setBirdY] = useState(WORLD_H * 0.5);
  const [pipes, setPipes] = useState<Pipe[]>([]);
  const [pickups, setPickups] = useState<PointPickup[]>([]);
  const [pointsCaught, setPointsCaught] = useState(0);
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
  const birdYRef = useRef(WORLD_H * 0.5);
  const lastRef = useRef(0);
  const runningRef = useRef(false);
  const scoreRef = useRef(0);
  const pointsCaughtRef = useRef(0);
  const distRef = useRef(0);
  const speedRef = useRef(170);
  const sessionCommittedRef = useRef(false);

  const makePickupForPipe = useCallback((pipe: Pipe): PointPickup => ({
    id: Math.random(),
    x: pipe.x + PIPE_W * 0.5,
    y: pipe.gapY + pipe.gapH * 0.5,
  }), []);

  runningRef.current = status === 'running';
  scoreRef.current = score;
  pointsCaughtRef.current = pointsCaught;
  birdYRef.current = birdY;

  const flap = useCallback(() => {
    if (!runningRef.current) return;
    vyRef.current = -320;
    setParticles((ps) => [
      ...ps,
      ...Array.from({ length: 7 }, (_, i) => ({
        id: Math.random() + i,
        x: BIRD_X - 8,
        y: birdYRef.current,
        vx: -80 - Math.random() * 120,
        vy: (Math.random() - 0.5) * 120,
        life: 0.5,
        color: [TEAL, PEACH, YELLOW][i % 3],
      })),
    ]);
  }, []);

  const seedPipes = () => {
    const firstGapH = 126;
    const firstGapY = 8 + Math.random() * (WORLD_H - 16 - firstGapH);
    return [{ id: Math.random(), x: 650, gapY: firstGapY, gapH: firstGapH }];
  };

  const start = useCallback(() => {
    setScore(0);
    setPointsCaught(0);
    distRef.current = 0;
    speedRef.current = 118;
    sessionCommittedRef.current = false;
    setBirdY(WORLD_H * 0.5);
    vyRef.current = 0;
    const initialPipes = seedPipes();
    setPipes(initialPipes);
    setPickups(initialPipes.map(makePickupForPipe));
    setParticles([]);
    setStatus('running');
  }, [makePickupForPipe]);

  const endGame = useCallback(() => {
    setStatus('gameover');
  }, []);

  useEffect(() => {
    if (status !== 'gameover' || sessionCommittedRef.current) return;
    sessionCommittedRef.current = true;
    const sessionDistance = Math.floor(distRef.current / 10);
    const isNewHighscore = sessionDistance > distanceHighscore;

    if (isNewHighscore) {
      const message = lang === 'de'
        ? `Hallo Jannik, ich habe gerade einen Highscore von ${sessionDistance} erreicht. Gerne würde ich auch deine Skills noch besser kennenlernen und gemeinsam etwas entwickeln ;)`
        : `Hi Jannik, I just explored your portfolio and reached a highscore of ${sessionDistance}. I'd love to get to know your skills even better and build something together ;)`;

      window.dispatchEvent(new CustomEvent('runner:send-highscore', {
        detail: {
          message,
          speedMs: 30,
          focusField: true,
          scrollToContact: true,
        },
      }));
    }

    setTotalPointsEarned((prev) => {
      const next = prev + pointsCaughtRef.current;
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(TOTAL_POINTS_KEY, String(next));
      }
      return next;
    });

    setDistanceHighscore((prev) => {
      const next = Math.max(prev, sessionDistance);
      if (next > prev && typeof window !== 'undefined') {
        window.localStorage.setItem(DISTANCE_HIGHSCORE_KEY, String(next));
      }
      return next;
    });
  }, [status, distanceHighscore, lang]);

  useEffect(() => {
    if (status !== 'running') return;
    let raf = 0;
    lastRef.current = 0;
    const loop = (tm: number) => {
      if (!lastRef.current) lastRef.current = tm;
      const dt = Math.min((tm - lastRef.current) / 1000, 0.032);
      lastRef.current = tm;

      vyRef.current += 1250 * dt;
      let ny = birdYRef.current + vyRef.current * dt;
      if (ny < BIRD_HALF) {
        ny = BIRD_HALF;
        if (vyRef.current < 0) vyRef.current = 0;
      }
      if (ny >= WORLD_H - BIRD_HALF) {
        ny = WORLD_H - BIRD_HALF;
        birdYRef.current = ny;
        setBirdY(ny);
        endGame();
        return;
      }
      birdYRef.current = ny;
      setBirdY(ny);

      const distanceMeters = Math.floor(distRef.current / 10);
      const earlyTierCap = Math.floor(PIPE_SPEED_PHASE_SWITCH_DISTANCE_M / PIPE_SPEED_STEP_DISTANCE_M);
      const earlyMultiplierAtCap = 1 + earlyTierCap * PIPE_SPEED_STEP_MULT;
      const lateTierCap = Math.floor((PIPE_SPEED_PHASE_TWO_SWITCH_DISTANCE_M - PIPE_SPEED_PHASE_SWITCH_DISTANCE_M) / PIPE_SPEED_LATE_STEP_DISTANCE_M);
      const lateMultiplierAtCap = earlyMultiplierAtCap + lateTierCap * PIPE_SPEED_LATE_STEP_MULT;
      const speedMultiplier = distanceMeters < PIPE_SPEED_PHASE_SWITCH_DISTANCE_M
        ? (1 + Math.floor(distanceMeters / PIPE_SPEED_STEP_DISTANCE_M) * PIPE_SPEED_STEP_MULT)
        : distanceMeters < PIPE_SPEED_PHASE_TWO_SWITCH_DISTANCE_M
          ? (earlyMultiplierAtCap + Math.floor((distanceMeters - PIPE_SPEED_PHASE_SWITCH_DISTANCE_M) / PIPE_SPEED_LATE_STEP_DISTANCE_M) * PIPE_SPEED_LATE_STEP_MULT)
          : (lateMultiplierAtCap + Math.floor((distanceMeters - PIPE_SPEED_PHASE_TWO_SWITCH_DISTANCE_M) / PIPE_SPEED_ULTRA_LATE_STEP_DISTANCE_M) * PIPE_SPEED_ULTRA_LATE_STEP_MULT);
      const speed = (Math.min(185, speedRef.current + scoreRef.current * 0.14)) * speedMultiplier;

      setClouds((cs) => cs.map((c) => {
        let nx = c.x - c.speed * dt;
        if (nx < -c.w) nx = WORLD_W + Math.random() * 220;
        return { ...c, x: nx };
      }));
      setHills((hs) => hs.map((h) => {
        let nx = h.x - (speed * 0.35) * dt;
        if (nx + h.w < 0) nx = WORLD_W + Math.random() * 260;
        return { ...h, x: nx };
      }));

      setPipes((prev) => {
        const moved = prev.map((p) => ({ ...p, x: p.x - speed * dt })).filter((p) => p.x + PIPE_W > -20);
        const tail = moved[moved.length - 1];
        const spacing = 290 + Math.random() * 130;
        const spawned: Pipe[] = [];
        if (!tail || tail.x < WORLD_W - spacing) {
          const progress = Math.min(1, scoreRef.current / 220);
          const gapH = 124 - progress * 8;
          const gapY = 8 + Math.random() * (WORLD_H - 16 - gapH);
          const pipe = { id: Math.random(), x: WORLD_W + 24, gapY, gapH };
          moved.push(pipe);
          spawned.push(pipe);
        }

        if (spawned.length > 0) {
          setPickups((prevPickups) => [
            ...prevPickups.filter((pickup) => pickup.x + PICKUP_HALF > -16),
            ...spawned.map(makePickupForPipe),
          ]);
        } else {
          setPickups((prevPickups) => prevPickups
            .map((pickup) => ({ ...pickup, x: pickup.x - speed * dt }))
            .filter((pickup) => pickup.x + PICKUP_HALF > -16)
          );
        }
        return moved;
      });

      setParticles((ps) =>
        ps
          .map((p) => ({
            ...p,
            x: p.x + p.vx * dt,
            y: p.y + p.vy * dt,
            vy: p.vy + 260 * dt,
            life: p.life - dt,
          }))
          .filter((p) => p.life > 0)
      );

      distRef.current += speed * dt;
          setScore(Math.floor(distRef.current / 10));

      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [status, endGame]);

  useEffect(() => {
    if (status !== 'running') return;

    const birdLeft = BIRD_X - BIRD_HALF;
    const birdRight = BIRD_X + BIRD_HALF;
    const birdTop = birdY - BIRD_HALF;
    const birdBottom = birdY + BIRD_HALF;

    let collided = false;
    let passBurst = 0;

    for (const p of pipes) {
      if (!p.passed && p.x + PIPE_W < BIRD_X - BIRD_HALF) {
        passBurst += 1;
      }

      const overlapX = birdRight >= p.x && birdLeft <= p.x + PIPE_W;
      if (!overlapX) continue;

      const gapTop = p.gapY;
      const gapBottom = p.gapY + p.gapH;
      if (birdTop <= gapTop || birdBottom >= gapBottom) {
        collided = true;
        break;
      }
    }

    if (passBurst > 0) {
      setPipes((prev) => prev.map((p) =>
        !p.passed && p.x + PIPE_W < BIRD_X - BIRD_HALF ? { ...p, passed: true } : p
      ));
    }

    if (passBurst > 0) {
      setParticles((ps) => [
        ...ps,
        ...Array.from({ length: passBurst * 7 }, (_, i) => ({
          id: Math.random() + i,
          x: BIRD_X,
          y: birdY,
          vx: (Math.random() - 0.5) * 200,
          vy: (Math.random() - 0.5) * 200,
          life: 0.35 + Math.random() * 0.25,
          color: [TEAL, PEACH, YELLOW, LILAC][i % 4],
        })),
      ]);
    }

    const collected = pickups.filter((pickup) => {
      const overlapX = birdRight >= pickup.x - PICKUP_HALF && birdLeft <= pickup.x + PICKUP_HALF;
      const overlapY = birdBottom >= pickup.y - PICKUP_HALF && birdTop <= pickup.y + PICKUP_HALF;
      return overlapX && overlapY;
    });

    if (collected.length > 0) {
      setPickups((prev) => prev.filter((pickup) => !collected.some((c) => c.id === pickup.id)));
      const collectedPoints = collected.length * PICKUP_BONUS;
      setPointsCaught((n) => n + collectedPoints);
      setParticles((ps) => [
        ...ps,
        ...collected.flatMap((pickup, pickupIndex) =>
          Array.from({ length: 10 }, (_, i) => ({
            id: Math.random() + pickupIndex + i,
            x: pickup.x,
            y: pickup.y,
            vx: (Math.random() - 0.5) * 220,
            vy: (Math.random() - 0.5) * 220,
            life: 0.4 + Math.random() * 0.2,
            color: [YELLOW, PEACH, TEAL][i % 3],
          }))
        ),
      ]);
    }

    if (collided) endGame();
  }, [
    birdY,
    pipes.map((p) => `${Math.round(p.x)}:${Math.round(p.gapY)}`).join(','),
    pickups.map((pickup) => `${Math.round(pickup.x)}:${Math.round(pickup.y)}`).join(','),
    status,
    endGame,
  ]);

  const handlePress = () => {
    if (status === 'ready') {
      start();
      return;
    }
    if (status === 'gameover') return;
    flap();
  };

  const skyGradient = `linear-gradient(180deg,
    rgba(61,207,182,0.10) 0%,
    rgba(184,164,255,0.10) 45%,
    rgba(255,178,122,0.10) 100%)`;
  const liveTotalPoints = totalPointsEarned + (sessionCommittedRef.current ? 0 : pointsCaught);
  const liveDistanceHighscore = Math.max(distanceHighscore, score);
  const readyAccentGradient = `linear-gradient(135deg, ${TEAL}, ${LILAC} 55%, ${PEACH})`;

  return (
    <section className="runner-section" style={{ padding: '40px 40px 80px', position: 'relative', zIndex: 1 }}>
      <style>{`
        @keyframes runner-ready-bob {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-5px) scale(1.04); }
        }

        @keyframes runner-ready-glow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(61, 207, 182, 0.18), 0 18px 40px rgba(0, 0, 0, 0.22); }
          50% { box-shadow: 0 0 0 12px rgba(61, 207, 182, 0.04), 0 24px 56px rgba(61, 207, 182, 0.18); }
        }

        @keyframes runner-ready-arrow {
          0%, 100% { transform: translateX(0); opacity: 0.72; }
          50% { transform: translateX(8px); opacity: 1; }
        }

        @keyframes runner-ready-sheen {
          0% { transform: translateX(-140%) skewX(-18deg); opacity: 0; }
          20% { opacity: 0.55; }
          60% { opacity: 0.15; }
          100% { transform: translateX(180%) skewX(-18deg); opacity: 0; }
        }

        @keyframes runner-ready-spark {
          0%, 100% { transform: scale(0.92); opacity: 0.45; }
          50% { transform: scale(1.12); opacity: 1; }
        }

        @media (max-width: 860px) {
          .runner-section {
            padding-left: 0 !important;
            padding-right: 0 !important;
          }
          .runner-shell {
            max-width: none !important;
          }
          .runner-meta {
            padding: 0 12px;
          }
          .runner-arena {
            border-left: 0 !important;
            border-right: 0 !important;
            border-radius: 0 !important;
          }
        }
      `}</style>
      <div className="runner-shell" style={{ maxWidth: 1180, margin: '0 auto' }}>
        <div className="runner-meta" style={{ fontSize: 13, color: DIM, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ width: 24, height: 1, background: TEAL }} />
          <span>{t('runner.distanceHighscore')}</span>
          <span style={{ color: TEAL, fontFamily: 'var(--ff-mono)', fontWeight: 700 }}>{liveDistanceHighscore}</span>
          <span>{t('runner.totalPointsEarned')}</span>
          <span style={{ color: YELLOW, fontFamily: 'var(--ff-mono)', fontWeight: 700 }}>{liveTotalPoints}</span>
        </div>

        <div
          className="runner-arena"
          onPointerDown={handlePress}
          role="button"
          tabIndex={0}
          style={{
            position: 'relative', height: 200, borderRadius: 22,
            background: skyGradient,
            border: `1px solid ${LINE}`, overflow: 'hidden', cursor: 'pointer',
            userSelect: 'none',
            touchAction: 'manipulation',
          }}
        >
          {Array.from({ length: 18 }).map((_, i) => (
            <div key={`s${i}`} aria-hidden style={{
              position: 'absolute',
              top: 10 + (i * 37) % 90,
              left: (i * 53) % WORLD_W,
              width: 2, height: 2, borderRadius: '50%', background: 'rgba(255,255,255,0.3)',
              opacity: 0.5 + ((i * 7) % 5) / 10,
            }} />
          ))}

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

          {hills.map((h, i) => (
            <div key={`h${i}`} aria-hidden style={{
              position: 'absolute',
              bottom: 0,
              left: h.x,
              width: h.w, height: h.h,
              background: `linear-gradient(180deg, ${LILAC}22, ${LILAC}08)`,
              borderTopLeftRadius: '50% 100%',
              borderTopRightRadius: '50% 100%',
            }} />
          ))}

          <div style={{
            position: 'absolute', top: 16, left: 20, display: 'flex', gap: 18,
            fontFamily: 'var(--ff-mono)', fontSize: 11,
          }}>
            <div style={{ color: DIM }}>
              {t('runner.distance')}: <span style={{ color: TEAL, fontSize: 18, fontWeight: 700 }}>{String(score).padStart(3, '0')}m</span>
            </div>
            <div style={{ color: DIM }}>
              {t('runner.points')}: <span style={{ color: YELLOW, fontSize: 14, fontWeight: 700 }}>{pointsCaught}</span>
            </div>
          </div>

          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, height: 2,
            background: TEAL, opacity: 0.5,
            boxShadow: `0 0 8px ${TEAL}77`,
          }} />

          <div style={{
            position: 'absolute',
            top: birdY - BIRD_HALF,
            left: BIRD_X - BIRD_HALF,
            width: BIRD_SIZE,
            height: BIRD_SIZE,
            borderRadius: '50%',
            background: `url(${BIRD_IMG}) center/cover no-repeat, ${TEAL}`,
            border: `2px solid ${TEAL}`,
            boxShadow: `0 0 16px ${TEAL}AA, 0 0 3px #000`,
            transform: `rotate(${Math.max(-28, Math.min(32, vyRef.current * 0.05))}deg)`,
            transition: 'transform 80ms ease',
          }}>
            <div style={{
              position: 'absolute', left: -9, top: 10, width: 8, height: 8,
              background: `linear-gradient(90deg, transparent, ${TEAL}88)`,
              borderRadius: '50%',
            }} />
          </div>

          {pipes.map((p) => (
            <div key={`top-${p.id}`} style={{
              position: 'absolute',
              top: 0,
              left: p.x,
              width: PIPE_W,
              height: p.gapY,
              background: `linear-gradient(180deg, ${PEACH}EE, ${YELLOW}AA)`,
              border: `1px solid ${PEACH}AA`,
              borderTopLeftRadius: 0,
              borderTopRightRadius: 0,
              borderBottomLeftRadius: 10,
              borderBottomRightRadius: 10,
              boxShadow: `0 0 18px ${PEACH}66`,
            }}>
              <div style={{
                position: 'absolute', bottom: -5, left: -3, right: -3, height: 8,
                borderRadius: 8,
                background: `linear-gradient(180deg, ${YELLOW}CC, ${PEACH}CC)`,
              }} />
            </div>
          ))}

          {pipes.map((p) => (
            <div key={`bottom-${p.id}`} style={{
              position: 'absolute',
              top: p.gapY + p.gapH,
              left: p.x,
              width: PIPE_W,
              bottom: 0,
              background: `linear-gradient(180deg, ${PEACH}EE, ${YELLOW}AA)`,
              border: `1px solid ${PEACH}AA`,
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
              borderBottomLeftRadius: 0,
              borderBottomRightRadius: 0,
              boxShadow: `0 0 18px ${PEACH}66`,
            }}>
              <div style={{
                position: 'absolute', top: -5, left: -3, right: -3, height: 8,
                borderRadius: 8,
                background: `linear-gradient(180deg, ${YELLOW}CC, ${PEACH}CC)`,
              }} />
            </div>
          ))}

          {pickups.map((pickup) => (
            <div key={pickup.id} style={{
              position: 'absolute',
              top: pickup.y - PICKUP_HALF,
              left: pickup.x - PICKUP_HALF,
              width: PICKUP_SIZE,
              height: PICKUP_SIZE,
              borderRadius: '50%',
              background: `radial-gradient(circle at 30% 30%, #fff7b8, ${YELLOW} 45%, ${PEACH})`,
              border: '1px solid rgba(0,0,0,0.55)',
              boxShadow: `0 0 14px ${YELLOW}99`,
            }}>
              <div style={{
                position: 'absolute',
                inset: 4,
                borderRadius: '50%',
                border: '1px solid rgba(0,0,0,0.28)',
              }} />
            </div>
          ))}

          {particles.map((p) => (
            <div key={p.id} style={{
              position: 'absolute', top: p.y, left: p.x,
              width: 4, height: 4, borderRadius: '50%', background: p.color,
              opacity: Math.min(1, p.life * 2),
              pointerEvents: 'none',
            }} />
          ))}

          {status === 'ready' && (
            <div style={{
              position: 'absolute', inset: 0, display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              background: 'radial-gradient(circle at center, rgba(61,207,182,0.08), rgba(15,15,15,0.52) 70%)', backdropFilter: 'blur(3px)',
            }}>
              <div style={{
                position: 'relative',
                minWidth: 250,
                padding: '10px 20px',
                textAlign: 'center',
                overflow: 'hidden',
                animation: 'runner-ready-bob 2.1s ease-in-out infinite',
              }}>
                <div aria-hidden style={{
                  position: 'absolute',
                  inset: '-20% auto -20% -35%',
                  width: '45%',
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.22), transparent)',
                  animation: 'runner-ready-sheen 2.8s ease-in-out infinite',
                }} />
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '5px 10px',
                  marginBottom: 10,
                  borderRadius: 999,
                  fontFamily: 'var(--ff-mono)',
                  fontSize: 10,
                  letterSpacing: '0.18em',
                  color: '#08110f',
                  background: readyAccentGradient,
                  boxShadow: `0 0 18px ${TEAL}44`,
                }}>
                  <span aria-hidden style={{
                    width: 7,
                    height: 7,
                    borderRadius: '50%',
                    background: '#08110f',
                    animation: 'runner-ready-spark 1s ease-in-out infinite',
                  }} />
                  START RUN
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 10,
                  marginBottom: 8,
                  fontFamily: 'var(--ff-mono)',
                  fontSize: 16,
                  fontWeight: 700,
                  color: TEAL,
                  letterSpacing: '0.08em',
                  textShadow: `0 0 18px ${TEAL}55`,
                }}>
                  <span aria-hidden style={{
                    display: 'inline-block',
                    fontSize: 18,
                    animation: 'runner-ready-arrow 1s ease-in-out infinite',
                  }}>▶</span>
                  <span>{t('runner.ready')}</span>
                  <span aria-hidden style={{
                    display: 'inline-block',
                    fontSize: 18,
                    animation: 'runner-ready-arrow 1s ease-in-out infinite',
                    animationDelay: '0.16s',
                  }}>▶</span>
                </div>
                <div style={{
                  fontSize: 11,
                  color: 'rgba(255,255,255,0.78)',
                  fontFamily: 'var(--ff-mono)',
                  letterSpacing: '0.12em',
                }}>
                  CLICK · TAP
                </div>
              </div>
            </div>
          )}

          {status === 'gameover' && (
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
                <div style={{ fontSize: 24, fontWeight: 800, marginBottom: 4 }}>{score}m</div>
                <div style={{ fontSize: 12, color: DIM, marginBottom: 12 }}>
                  CLICK · TAP
                </div>
                <button
                  type="button"
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={() => start()}
                  style={{
                    padding: '8px 16px', borderRadius: 999,
                    background: TEAL, color: '#000',
                    border: '2px solid #000', boxShadow: '3px 3px 0 #000',
                    fontSize: 13, fontWeight: 700, cursor: 'pointer',
                  }}
                >{t('runner.restart')} ↵</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
