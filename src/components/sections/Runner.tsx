import { useEffect, useRef, useState, useCallback } from 'react';
import { useLang } from '../../i18n/LanguageContext';
import { useIsPhone } from '../../hooks/useIsPhone';
import { ShopPopup } from '../ui/ShopPopup';

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
const BIRD_IMG = '/assets/aboutme/avatar.jpg';
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
const TOTAL_POINTS_KEY      = 'portfolio.runner.totalPointsEarned';
const DISTANCE_HIGHSCORE_KEY = 'portfolio.runner.distanceHighscore';
const OWNED_SKINS_KEY        = 'portfolio.runner.ownedSkins';
const ACTIVE_SKIN_KEY        = 'portfolio.runner.activeSkin';
const SKIN_PRICE             = 150;

const SKINS = [
  { id: 1, name: 'SPEEDER', color: '#3DCFB6',                price: 0   },
  { id: 2, name: 'INFERNO', color: '#FFB27A',                price: 50  },
  { id: 3, name: 'GALAXY',  color: '#B8A4FF',                price: 150 },
  { id: 4, name: 'CHUNK',   color: '#F4E06D',                price: 150 },
  { id: 5, name: 'STEALTH', color: 'rgba(255,255,255,0.72)', price: 150 },
] as const;

// All per-frame visual game state in one object — mutated directly in the RAF loop,
// a single setTick triggers the re-render instead of 6+ individual setState calls.
type GameFrame = {
  birdY: number;
  pipes: Pipe[];
  pickups: PointPickup[];
  particles: Particle[];
  clouds: Cloud[];
  hills: Hill[];
  score: number;
  pointsCaught: number;
};

const INITIAL_CLOUDS: Cloud[] = [
  { x: 120, y: 28, w: 60, speed: 14 },
  { x: 420, y: 52, w: 42, speed: 10 },
  { x: 720, y: 20, w: 72, speed: 18 },
];

const INITIAL_HILLS: Hill[] = [
  { x: 0,   w: 300, h: 50 },
  { x: 340, w: 380, h: 70 },
  { x: 760, w: 320, h: 40 },
];

function makeInitialFrame(): GameFrame {
  return {
    birdY: WORLD_H * 0.5,
    pipes: [],
    pickups: [],
    particles: [],
    clouds: INITIAL_CLOUDS.map((c) => ({ ...c })),
    hills: INITIAL_HILLS.map((h) => ({ ...h })),
    score: 0,
    pointsCaught: 0,
  };
}

export function Runner() {
  const { t, lang } = useLang();
  const [totalPointsEarned, setTotalPointsEarned] = useState(() => {
    if (typeof window === 'undefined') return 0;
    return parseInt(window.localStorage.getItem(TOTAL_POINTS_KEY) || '0', 10) || 0;
  });
  const [distanceHighscore, setDistanceHighscore] = useState(() => {
    if (typeof window === 'undefined') return 0;
    return parseInt(window.localStorage.getItem(DISTANCE_HIGHSCORE_KEY) || '0', 10) || 0;
  });
  const [status, setStatus] = useState<'ready' | 'running' | 'gameover'>('ready');
  const isPhone = useIsPhone();
  const [mobileBtnPressed, setMobileBtnPressed] = useState(false);
  const [mobileRipples, setMobileRipples] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const [glowActive, setGlowActive] = useState(false);
  const [ownedSkins, setOwnedSkins] = useState<number[]>(() => {
    if (typeof window === 'undefined') return [1];
    try { const s = window.localStorage.getItem(OWNED_SKINS_KEY); return s ? JSON.parse(s) : [1]; }
    catch { return [1]; }
  });
  const [activeSkin, setActiveSkin] = useState<number>(() => {
    if (typeof window === 'undefined') return 1;
    return parseInt(window.localStorage.getItem(ACTIVE_SKIN_KEY) || '1', 10) || 1;
  });
  const [shopOpen, setShopOpen] = useState(false);
  const [shopAnchorEl, setShopAnchorEl] = useState<HTMLElement | null>(null);
  const [displayedPoints, setDisplayedPoints] = useState(() => {
    if (typeof window === 'undefined') return 0;
    return parseInt(window.localStorage.getItem(TOTAL_POINTS_KEY) || '0', 10) || 0;
  });
  const [isCountingDown, setIsCountingDown] = useState(false);

  // Single ref holds all per-frame visual state; setTick triggers the one re-render per frame.
  const frameRef = useRef<GameFrame>(makeInitialFrame());
  const [, setTick] = useState(0);

  useEffect(() => {
    return () => { document.body.classList.remove('runner-hovered'); };
  }, []);

  const vyRef = useRef(0);
  const lastRef = useRef(0);
  const runningRef = useRef(false);
  const waitingFirstFlapRef = useRef(false);
  const [waitingFirstFlap, setWaitingFirstFlap] = useState(false);
  const countdownRafRef = useRef(0);
  const distRef = useRef(0);
  const speedRef = useRef(170);
  const sessionCommittedRef = useRef(false);

  runningRef.current = status === 'running';

  const makePickupForPipe = useCallback((pipe: Pipe): PointPickup => ({
    id: Math.random(),
    x: pipe.x + PIPE_W * 0.5,
    y: pipe.gapY + pipe.gapH * 0.5,
  }), []);

  const flap = useCallback(() => {
    if (!runningRef.current) return;
    if (waitingFirstFlapRef.current) {
      waitingFirstFlapRef.current = false;
      setWaitingFirstFlap(false);
    }
    vyRef.current = -320;
    const f = frameRef.current;
    f.particles = [
      ...f.particles,
      ...Array.from({ length: 7 }, (_, i) => ({
        id: Math.random() + i,
        x: BIRD_X - 8,
        y: f.birdY,
        vx: -80 - Math.random() * 120,
        vy: (Math.random() - 0.5) * 120,
        life: 0.5,
        color: [TEAL, PEACH, YELLOW][i % 3],
      })),
    ];
    setTick((n) => n + 1);
  }, []);

  const start = useCallback(() => {
    distRef.current = 0;
    speedRef.current = 118;
    sessionCommittedRef.current = false;
    vyRef.current = 0;
    waitingFirstFlapRef.current = true;
    setWaitingFirstFlap(true);
    setShopOpen(false);
    const firstGapH = 126;
    const firstGapY = 8 + Math.random() * (WORLD_H - 16 - firstGapH);
    const initialPipe: Pipe = { id: Math.random(), x: 650, gapY: firstGapY, gapH: firstGapH };
    frameRef.current = {
      birdY: WORLD_H * 0.5,
      pipes: [initialPipe],
      pickups: [{ id: Math.random(), x: initialPipe.x + PIPE_W * 0.5, y: initialPipe.gapY + initialPipe.gapH * 0.5 }],
      particles: [],
      clouds: INITIAL_CLOUDS.map((c) => ({ ...c })),
      hills: INITIAL_HILLS.map((h) => ({ ...h })),
      score: 0,
      pointsCaught: 0,
    };
    setStatus('running');
  }, []);

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
      const next = prev + frameRef.current.pointsCaught;
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

      if (waitingFirstFlapRef.current) {
        raf = requestAnimationFrame(loop);
        return;
      }

      const f = frameRef.current;

      // Physics
      vyRef.current += 1250 * dt;
      let ny = f.birdY + vyRef.current * dt;
      if (ny < BIRD_HALF) {
        ny = BIRD_HALF;
        if (vyRef.current < 0) vyRef.current = 0;
      }
      if (ny >= WORLD_H - BIRD_HALF) {
        f.birdY = WORLD_H - BIRD_HALF;
        setTick((n) => n + 1);
        endGame();
        return;
      }
      f.birdY = ny;

      // Speed
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
      const speed = (Math.min(185, speedRef.current + f.score * 0.14)) * speedMultiplier;

      // Clouds
      f.clouds = f.clouds.map((c) => {
        let nx = c.x - c.speed * dt;
        if (nx < -c.w) nx = WORLD_W + Math.random() * 220;
        return { ...c, x: nx };
      });

      // Hills
      f.hills = f.hills.map((h) => {
        let nx = h.x - (speed * 0.35) * dt;
        if (nx + h.w < 0) nx = WORLD_W + Math.random() * 260;
        return { ...h, x: nx };
      });

      // Pipes & pickups computed together — no nested setState
      const movedPipes = f.pipes.map((p) => ({ ...p, x: p.x - speed * dt })).filter((p) => p.x + PIPE_W > -20);
      const tail = movedPipes[movedPipes.length - 1];
      const spacing = 290 + Math.random() * 130;
      const spawned: Pipe[] = [];
      if (!tail || tail.x < WORLD_W - spacing) {
        const progress = Math.min(1, f.score / 220);
        const gapH = 124 - progress * 8;
        const gapY = 8 + Math.random() * (WORLD_H - 16 - gapH);
        const pipe = { id: Math.random(), x: WORLD_W + 24, gapY, gapH };
        movedPipes.push(pipe);
        spawned.push(pipe);
      }
      f.pipes = movedPipes;

      if (spawned.length > 0) {
        f.pickups = [
          ...f.pickups.filter((pickup) => pickup.x + PICKUP_HALF > -16),
          ...spawned.map(makePickupForPipe),
        ];
      } else {
        f.pickups = f.pickups
          .map((pickup) => ({ ...pickup, x: pickup.x - speed * dt }))
          .filter((pickup) => pickup.x + PICKUP_HALF > -16);
      }

      // Particles
      f.particles = f.particles
        .map((p) => ({
          ...p,
          x: p.x + p.vx * dt,
          y: p.y + p.vy * dt,
          vy: p.vy + 260 * dt,
          life: p.life - dt,
        }))
        .filter((p) => p.life > 0);

      // Distance & score
      distRef.current += speed * dt;
      f.score = Math.floor(distRef.current / 10);

      // Collision detection — runs in same tick as physics, no separate effect needed
      const birdLeft = BIRD_X - BIRD_HALF;
      const birdRight = BIRD_X + BIRD_HALF;
      const birdTop = f.birdY - BIRD_HALF;
      const birdBottom = f.birdY + BIRD_HALF;

      let collided = false;
      let passBurst = 0;

      for (const p of f.pipes) {
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
        f.pipes = f.pipes.map((p) =>
          !p.passed && p.x + PIPE_W < BIRD_X - BIRD_HALF ? { ...p, passed: true } : p
        );
        f.particles = [
          ...f.particles,
          ...Array.from({ length: passBurst * 7 }, (_, i) => ({
            id: Math.random() + i,
            x: BIRD_X,
            y: f.birdY,
            vx: (Math.random() - 0.5) * 200,
            vy: (Math.random() - 0.5) * 200,
            life: 0.35 + Math.random() * 0.25,
            color: [TEAL, PEACH, YELLOW, LILAC][i % 4],
          })),
        ];
      }

      const collected = f.pickups.filter((pickup) => {
        const overlapX = birdRight >= pickup.x - PICKUP_HALF && birdLeft <= pickup.x + PICKUP_HALF;
        const overlapY = birdBottom >= pickup.y - PICKUP_HALF && birdTop <= pickup.y + PICKUP_HALF;
        return overlapX && overlapY;
      });

      if (collected.length > 0) {
        f.pickups = f.pickups.filter((pickup) => !collected.some((c) => c.id === pickup.id));
        f.pointsCaught += collected.length * PICKUP_BONUS;
        f.particles = [
          ...f.particles,
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
        ];
      }

      // Single re-render for the entire frame
      setTick((n) => n + 1);

      if (collided) {
        endGame();
        return;
      }

      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [status, endGame, makePickupForPipe]);

  const handlePress = () => {
    if (status === 'ready') {
      start();
      return;
    }
    if (status === 'gameover') return;
    flap();
  };

  const handleMobileAction = useCallback(() => {
    if (status === 'ready') {
      start();
      return;
    }
    if (status === 'gameover') {
      start();
      return;
    }
    flap();
  }, [flap, start, status]);

  const mobileActionLabel = status === 'running'
    ? t('runner.actionJump')
    : status === 'gameover'
      ? t('runner.actionRestart')
      : t('runner.actionStart');

  const skyGradient = `linear-gradient(180deg,
    rgba(61,207,182,0.10) 0%,
    rgba(184,164,255,0.10) 45%,
    rgba(255,178,122,0.10) 100%)`;

  const f = frameRef.current;
  const liveTotalPoints = totalPointsEarned + (sessionCommittedRef.current ? 0 : f.pointsCaught);
  const liveDistanceHighscore = Math.max(distanceHighscore, f.score);
  const readyAccentGradient = `linear-gradient(135deg, ${TEAL}, ${LILAC} 55%, ${PEACH})`;

  // Sync displayedPoints when totalPointsEarned changes outside a purchase (e.g. after a game)
  useEffect(() => {
    if (!isCountingDown) setDisplayedPoints(totalPointsEarned);
  }, [totalPointsEarned, isCountingDown]);

  // Cleanup countdown RAF on unmount
  useEffect(() => {
    return () => { if (countdownRafRef.current) cancelAnimationFrame(countdownRafRef.current); };
  }, []);

  const selectSkin = (id: number) => {
    setActiveSkin(id);
    if (typeof window !== 'undefined') window.localStorage.setItem(ACTIVE_SKIN_KEY, String(id));
  };

  const animateCountdown = (from: number, to: number) => {
    if (countdownRafRef.current) cancelAnimationFrame(countdownRafRef.current);
    const duration = 3000;
    const startTime = performance.now();
    setIsCountingDown(true);
    const step = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      setDisplayedPoints(Math.round(from - (from - to) * progress));
      if (progress < 1) {
        countdownRafRef.current = requestAnimationFrame(step);
      } else {
        setIsCountingDown(false);
      }
    };
    countdownRafRef.current = requestAnimationFrame(step);
  };

  const buySkin = (id: number) => {
    const skin = SKINS.find((s) => s.id === id);
    if (!skin || skin.price === 0 || ownedSkins.includes(id)) return;
    if (totalPointsEarned < skin.price) return;
    const next = totalPointsEarned - skin.price;
    setTotalPointsEarned(next);
    if (typeof window !== 'undefined') window.localStorage.setItem(TOTAL_POINTS_KEY, String(next));
    const newOwned = [...ownedSkins, id];
    setOwnedSkins(newOwned);
    if (typeof window !== 'undefined') window.localStorage.setItem(OWNED_SKINS_KEY, JSON.stringify(newOwned));
    animateCountdown(totalPointsEarned, next);
    selectSkin(id);
  };

  const renderRocket = () => {
    const rot = Math.max(-28, Math.min(32, vyRef.current * 0.05));
    const wrapper: React.CSSProperties = {
      position: 'absolute',
      top: f.birdY - BIRD_HALF,
      left: BIRD_X - BIRD_HALF,
      width: BIRD_SIZE,
      height: BIRD_SIZE,
      transform: `rotate(${rot}deg)`,
      transition: 'transform 80ms ease',
    };

    // Design 1 — SPEEDER: teal, slim swept silhouette, clean flame
    if (activeSkin === 1) return (
      <div style={wrapper}>
        <div style={{ position: 'absolute', right: -13, top: '50%', transform: 'translateY(-50%)', width: 0, height: 0, borderTop: '7px solid transparent', borderBottom: '7px solid transparent', borderLeft: `13px solid ${TEAL}`, filter: `drop-shadow(0 0 5px ${TEAL})` }} />
        <div style={{ position: 'absolute', left: 2, top: -6, width: 11, height: 7, background: TEAL, clipPath: 'polygon(0% 100%, 100% 100%, 38% 0%)', opacity: 0.88 }} />
        <div style={{ position: 'absolute', left: 2, bottom: -6, width: 11, height: 7, background: TEAL, clipPath: 'polygon(0% 0%, 100% 0%, 38% 100%)', opacity: 0.88 }} />
        <div style={{ position: 'absolute', left: -20, top: '50%', transform: 'translateY(-50%)', width: 18, height: 14, background: `radial-gradient(ellipse at right, ${YELLOW}EE 0%, ${PEACH}99 50%, transparent 100%)`, borderRadius: '50%', filter: 'blur(2.5px)' }} />
        <div style={{ position: 'absolute', left: -11, top: '50%', transform: 'translateY(-50%)', width: 9, height: 7, background: `radial-gradient(ellipse at right, #fff 0%, ${YELLOW} 55%, transparent 100%)`, borderRadius: '50%' }} />
        <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: `url(${BIRD_IMG}) center/cover no-repeat, ${TEAL}`, border: `2px solid ${TEAL}`, boxShadow: `0 0 16px ${TEAL}AA, 0 0 3px #000`, zIndex: 1 }} />
      </div>
    );

    // Design 2 — INFERNO: peach, fat nose, compact angled fins + back spike, huge flame
    if (activeSkin === 2) return (
      <div style={wrapper}>
        <div style={{ position: 'absolute', right: -8, top: '50%', transform: 'translateY(-50%)', width: 0, height: 0, borderTop: '11px solid transparent', borderBottom: '11px solid transparent', borderLeft: `8px solid ${PEACH}`, filter: `drop-shadow(0 0 7px ${PEACH})` }} />
        <div style={{ position: 'absolute', left: 1, top: -5, width: 13, height: 7, background: PEACH, clipPath: 'polygon(0% 100%, 92% 100%, 18% 0%)', opacity: 0.92 }} />
        <div style={{ position: 'absolute', left: 1, bottom: -5, width: 13, height: 7, background: PEACH, clipPath: 'polygon(0% 0%, 92% 0%, 18% 100%)', opacity: 0.92 }} />
        <div style={{ position: 'absolute', left: -5, top: '50%', transform: 'translateY(-50%)', width: 8, height: 11, background: PEACH, clipPath: 'polygon(100% 0%, 100% 100%, 0% 50%)', opacity: 0.7 }} />
        <div style={{ position: 'absolute', left: -28, top: '50%', transform: 'translateY(-50%)', width: 26, height: 22, background: `radial-gradient(ellipse at right, ${YELLOW}FF 0%, ${PEACH}BB 38%, transparent 100%)`, borderRadius: '50%', filter: 'blur(3.5px)' }} />
        <div style={{ position: 'absolute', left: -17, top: '50%', transform: 'translateY(-50%)', width: 15, height: 13, background: `radial-gradient(ellipse at right, #fff 0%, ${YELLOW} 45%, ${PEACH}88 100%)`, borderRadius: '50%', filter: 'blur(1px)' }} />
        <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: `url(${BIRD_IMG}) center/cover no-repeat, ${PEACH}`, border: `2px solid ${PEACH}`, boxShadow: `0 0 18px ${PEACH}BB, 0 0 3px #000`, zIndex: 1 }} />
      </div>
    );

    // Design 3 — GALAXY: lilac, needle nose + ring, slim blade fins flush to body, purple wisp
    if (activeSkin === 3) return (
      <div style={wrapper}>
        <div style={{ position: 'absolute', right: -19, top: '50%', transform: 'translateY(-50%)', width: 0, height: 0, borderTop: '5px solid transparent', borderBottom: '5px solid transparent', borderLeft: `19px solid ${LILAC}`, filter: `drop-shadow(0 0 6px ${LILAC})` }} />
        <div style={{ position: 'absolute', right: -6, top: '50%', transform: 'translateY(-50%)', width: 3, height: 13, borderRadius: 2, background: `${LILAC}CC`, zIndex: 2 }} />
        <div style={{ position: 'absolute', left: 2, top: -4, width: 15, height: 5, background: LILAC, clipPath: 'polygon(0% 100%, 100% 60%, 75% 0%, 0% 30%)', opacity: 0.85 }} />
        <div style={{ position: 'absolute', left: 2, bottom: -4, width: 15, height: 5, background: LILAC, clipPath: 'polygon(0% 0%, 100% 40%, 75% 100%, 0% 70%)', opacity: 0.85 }} />
        <div style={{ position: 'absolute', left: -22, top: '50%', transform: 'translateY(-50%)', width: 20, height: 11, background: `radial-gradient(ellipse at right, #fff 0%, ${LILAC}FF 30%, ${LILAC}33 70%, transparent 100%)`, borderRadius: '50%', filter: 'blur(2.5px)' }} />
        <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: `url(${BIRD_IMG}) center/cover no-repeat, ${LILAC}`, border: `2px solid ${LILAC}`, boxShadow: `0 0 18px ${LILAC}BB, 0 0 3px #000`, zIndex: 1 }} />
      </div>
    );

    // Design 4 — CHUNK: yellow, rectangular nose cap, compact blocky fins, thick warm flame
    if (activeSkin === 4) return (
      <div style={wrapper}>
        <div style={{ position: 'absolute', right: -11, top: '50%', transform: 'translateY(-50%)', width: 11, height: 18, background: YELLOW, borderRadius: '0 5px 5px 0', border: '1px solid rgba(0,0,0,0.45)', boxShadow: `0 0 9px ${YELLOW}99` }} />
        <div style={{ position: 'absolute', left: 1, top: -5, width: 12, height: 7, background: YELLOW, borderRadius: '2px 2px 0 0', border: '1px solid rgba(0,0,0,0.35)', boxShadow: `0 0 6px ${YELLOW}77` }} />
        <div style={{ position: 'absolute', left: 1, bottom: -5, width: 12, height: 7, background: YELLOW, borderRadius: '0 0 2px 2px', border: '1px solid rgba(0,0,0,0.35)', boxShadow: `0 0 6px ${YELLOW}77` }} />
        <div style={{ position: 'absolute', left: -20, top: '50%', transform: 'translateY(-50%)', width: 18, height: 20, background: `radial-gradient(ellipse at right, #fff 0%, ${YELLOW}FF 35%, ${PEACH}BB 65%, transparent 100%)`, borderRadius: '40%', filter: 'blur(1.5px)' }} />
        <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: `url(${BIRD_IMG}) center/cover no-repeat, ${YELLOW}`, border: `2px solid ${YELLOW}`, boxShadow: `0 0 18px ${YELLOW}BB, 0 0 3px #000`, zIndex: 1 }} />
      </div>
    );

    // Design 5 — STEALTH: dark/white, needle nose, delta wings, cold blue flame
    return (
      <div style={wrapper}>
        <div style={{ position: 'absolute', right: -20, top: '50%', transform: 'translateY(-50%)', width: 0, height: 0, borderTop: '3px solid transparent', borderBottom: '3px solid transparent', borderLeft: '20px solid rgba(255,255,255,0.88)', filter: 'drop-shadow(0 0 3px rgba(255,255,255,0.5))' }} />
        <div style={{ position: 'absolute', left: -3, top: -10, width: 22, height: 10, background: 'rgba(255,255,255,0.08)', clipPath: 'polygon(0% 100%, 100% 100%, 12% 0%)', border: '1px solid rgba(255,255,255,0.20)' }} />
        <div style={{ position: 'absolute', left: -3, bottom: -10, width: 22, height: 10, background: 'rgba(255,255,255,0.08)', clipPath: 'polygon(0% 0%, 100% 0%, 12% 100%)', border: '1px solid rgba(255,255,255,0.20)' }} />
        <div style={{ position: 'absolute', left: -15, top: '50%', transform: 'translateY(-50%)', width: 13, height: 9, background: 'radial-gradient(ellipse at right, #fff 0%, rgba(130,210,255,0.9) 40%, transparent 100%)', borderRadius: '50%', filter: 'blur(1.5px)' }} />
        <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: `url(${BIRD_IMG}) center/cover no-repeat, rgba(12,14,22,0.95)`, border: '2px solid rgba(255,255,255,0.5)', boxShadow: '0 0 12px rgba(255,255,255,0.2), 0 0 3px #000', zIndex: 1 }} />
      </div>
    );
  };

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

        @keyframes runner-ready-spark {
          0%, 100% { transform: scale(0.92); opacity: 0.45; }
          50% { transform: scale(1.12); opacity: 1; }
        }

        @keyframes runner-mobile-ripple {
          0% {
            transform: translate(-50%, -50%) scale(0.2);
            opacity: 0.5;
          }
          100% {
            transform: translate(-50%, -50%) scale(2.2);
            opacity: 0;
          }
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
          .runner-mobile-controls {
            padding: 18px 12px 0;
          }
        }

        .runner-tap-surface,
        .runner-mobile-action-btn {
          -webkit-tap-highlight-color: transparent;
          -webkit-touch-callout: none;
          user-select: none;
          -webkit-user-select: none;
          outline: none;
        }

        .runner-tap-surface:focus,
        .runner-tap-surface:focus-visible,
        .runner-mobile-action-btn:focus,
        .runner-mobile-action-btn:focus-visible {
          outline: none;
          box-shadow: none;
        }

        @keyframes runner-points-counting {
          0%, 100% { transform: scale(1); }
          50%       { transform: scale(1.22); }
        }
      `}</style>
      <div className="runner-shell" style={{ maxWidth: 1180, margin: '0 auto' }}>
        <div className="runner-meta" style={{ fontSize: 13, color: DIM, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ width: 24, height: 1, background: TEAL }} />
          <span>{t('runner.distanceHighscore')}</span>
          <span style={{ color: TEAL, fontFamily: 'var(--ff-mono)', fontWeight: 700 }}>{liveDistanceHighscore}</span>
          <span>{t('runner.totalPointsEarned')}</span>
          <span style={{
            color: YELLOW,
            fontFamily: 'var(--ff-mono)',
            fontWeight: 700,
            display: 'inline-block',
            animation: isCountingDown ? 'runner-points-counting 0.55s ease-in-out infinite' : 'none',
          }}>{isCountingDown ? displayedPoints : liveTotalPoints}</span>
        </div>

        <div
          style={{ position: 'relative' }}
          onMouseEnter={() => { setGlowActive(true); document.body.classList.add('runner-hovered'); }}
          onMouseLeave={() => { setGlowActive(false); document.body.classList.remove('runner-hovered'); }}
        >
          <div
            aria-hidden
            style={{
              position: 'absolute',
              inset: -6,
              borderRadius: 28,
              pointerEvents: 'none',
              zIndex: 10,
              opacity: glowActive ? 1 : 0,
              transition: 'opacity 0.4s ease',
              boxShadow: '0 0 0 1px rgba(255,178,122,0.25), 0 0 32px 8px rgba(255,178,122,0.3), 0 0 80px 20px rgba(255,178,122,0.14)',
              animation: glowActive ? 'element-aura-breathe 3.2s ease-in-out infinite' : 'none',
            }}
          />
          <div
          className="runner-arena runner-tap-surface"
          onPointerDown={handlePress}
          onKeyDown={(e) => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); handlePress(); } }}
          role="button"
          tabIndex={0}
          style={{
            position: 'relative', height: 200, borderRadius: 22,
            background: skyGradient,
            border: `1px solid ${LINE}`, overflow: 'hidden', cursor: 'pointer',
            userSelect: 'none',
            touchAction: 'manipulation',
            WebkitTapHighlightColor: 'transparent',
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

          {f.clouds.map((c, i) => (
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

          {f.hills.map((h, i) => (
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
              {t('runner.distance')}: <span style={{ color: TEAL, fontSize: 18, fontWeight: 700 }}>{String(f.score).padStart(3, '0')}m</span>
            </div>
            <div style={{ color: DIM }}>
              {t('runner.points')}: <span style={{ color: YELLOW, fontSize: 14, fontWeight: 700 }}>{f.pointsCaught}</span>
            </div>
          </div>

          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, height: 2,
            background: TEAL, opacity: 0.5,
            boxShadow: `0 0 8px ${TEAL}77`,
          }} />

          {renderRocket()}

          {f.pipes.map((p) => (
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

          {f.pipes.map((p) => (
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

          {f.pickups.map((pickup) => (
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

          {f.particles.map((p) => (
            <div key={p.id} style={{
              position: 'absolute', top: p.y, left: p.x,
              width: 4, height: 4, borderRadius: '50%', background: p.color,
              opacity: Math.min(1, p.life * 2),
              pointerEvents: 'none',
            }} />
          ))}

          {status === 'ready' && !shopOpen && (
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
                  textShadow: 'none',
                }}>
                  <span>{t('runner.ready')}</span>
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
              <button
                type="button"
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => { setShopAnchorEl(e.currentTarget); setShopOpen(true); }}
                style={{
                  position: 'absolute', bottom: 12, right: 12,
                  padding: '4px 11px', borderRadius: 999,
                  fontFamily: 'var(--ff-mono)', fontSize: 9, fontWeight: 700, letterSpacing: '0.16em',
                  cursor: 'pointer', border: `1px solid ${TEAL}`,
                  background: 'transparent', color: TEAL,
                }}
              >
                SHOP
              </button>
            </div>
          )}

          {status === 'running' && waitingFirstFlap && (
            <div style={{
              position: 'absolute', inset: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              pointerEvents: 'none',
            }}>
              <div style={{
                fontFamily: 'var(--ff-mono)',
                fontSize: 13,
                fontWeight: 700,
                color: TEAL,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                textShadow: `0 0 14px ${TEAL}99`,
                animation: 'vc-blink 1.1s ease-in-out infinite',
              }}>
                CLICK · TAP TO FLY
              </div>
            </div>
          )}

          {status === 'gameover' && !shopOpen && (
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
                <div style={{ fontSize: 24, fontWeight: 800, marginBottom: 4 }}>{f.score}m</div>
                <div style={{ fontSize: 12, color: DIM, marginBottom: 12 }}>
                  CLICK · TAP
                </div>
                {!isPhone && (
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
                )}
              </div>
              <button
                type="button"
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => { setShopAnchorEl(e.currentTarget); setShopOpen(true); }}
                style={{
                  position: 'absolute', bottom: 12, right: 12,
                  padding: '4px 11px', borderRadius: 999,
                  fontFamily: 'var(--ff-mono)', fontSize: 9, fontWeight: 700, letterSpacing: '0.16em',
                  cursor: 'pointer', border: `1px solid ${TEAL}`,
                  background: 'transparent', color: TEAL,
                }}
              >
                SHOP
              </button>
            </div>
          )}

        </div>

        </div>

        {isPhone && (
          <div className="runner-mobile-controls" style={{ width: '100%' }}>
            <div style={{
              padding: '16px 14px 22px',
              borderRadius: 20,
              background: 'linear-gradient(145deg, rgba(61,207,182,0.16), rgba(184,164,255,0.14) 58%, rgba(255,178,122,0.15))',
              border: `1px solid ${LINE}`,
              boxShadow: '0 16px 38px rgba(0,0,0,0.24)',
            }}>
              <button
                className="runner-mobile-action-btn"
                type="button"
                onPointerDown={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const id = Date.now() + Math.random();
                  setMobileBtnPressed(true);
                  setMobileRipples((prev) => [...prev, {
                    id,
                    x: e.clientX - rect.left,
                    y: e.clientY - rect.top,
                  }]);
                  window.setTimeout(() => {
                    setMobileRipples((prev) => prev.filter((r) => r.id !== id));
                  }, 520);
                }}
                onPointerUp={() => setMobileBtnPressed(false)}
                onPointerCancel={() => setMobileBtnPressed(false)}
                onPointerLeave={() => setMobileBtnPressed(false)}
                onClick={handleMobileAction}
                style={{
                  position: 'relative',
                  width: '100%',
                  minHeight: 82,
                  borderRadius: 18,
                  border: '2px solid rgba(0,0,0,0.72)',
                  color: '#06100d',
                  background: readyAccentGradient,
                  boxShadow: mobileBtnPressed
                    ? '0 3px 0 rgba(0,0,0,0.5), 0 8px 16px rgba(0,0,0,0.2), inset 0 0 0 1px rgba(255,255,255,0.2)'
                    : '0 8px 0 rgba(0,0,0,0.45), 0 14px 28px rgba(0,0,0,0.28), inset 0 0 0 1px rgba(255,255,255,0.2)',
                  transform: mobileBtnPressed ? 'scale(0.96)' : 'scale(1)',
                  transition: 'transform 140ms cubic-bezier(.22,.9,.3,1), box-shadow 140ms ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  touchAction: 'manipulation',
                  WebkitTapHighlightColor: 'transparent',
                  WebkitTouchCallout: 'none',
                  userSelect: 'none',
                  WebkitUserSelect: 'none',
                  outline: 'none',
                }}
              >
                {mobileRipples.map((ripple) => (
                  <span
                    key={ripple.id}
                    aria-hidden
                    style={{
                      position: 'absolute',
                      left: ripple.x,
                      top: ripple.y,
                      width: 36,
                      height: 36,
                      borderRadius: '50%',
                      border: '2px solid rgba(255,255,255,0.72)',
                      pointerEvents: 'none',
                      animation: 'runner-mobile-ripple 520ms ease-out forwards',
                    }}
                  />
                ))}
                <span style={{
                  position: 'relative',
                  zIndex: 1,
                  fontFamily: 'var(--ff-mono)',
                  fontSize: 18,
                  fontWeight: 800,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                }}>
                  {mobileActionLabel}
                </span>
              </button>
            </div>
          </div>
        )}
      </div>

      <ShopPopup
        isOpen={shopOpen && (status === 'ready' || status === 'gameover')}
        anchorEl={shopAnchorEl}
        skins={SKINS}
        ownedSkins={ownedSkins}
        activeSkin={activeSkin}
        totalPointsEarned={totalPointsEarned}
        displayedPoints={displayedPoints}
        isCountingDown={isCountingDown}
        onBuy={buySkin}
        onSelect={selectSkin}
        onClose={() => setShopOpen(false)}
      />
    </section>
  );
}
