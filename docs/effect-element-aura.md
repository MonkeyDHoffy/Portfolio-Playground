# Element Aura

Ein sanft pulsierender orangener Leuchtring, der ein Element beim Hovern umrahmt. Gleichzeitig blendet der globale Spotlight-Cursor aus, sodass die volle Aufmerksamkeit auf dem Element liegt. Beim Verlassen kehrt beides sanft zurück.

---

## Visuelles Ergebnis

- Hover-Start: Orangener Glow-Ring blendet in ~400ms ein
- Aktiv: Ring atmet sanft (Pulsfrequenz ~3.2s, `ease-in-out`)
- Hover-Ende: Glow blendet aus, Spotlight kehrt zurück
- Spotlight: faded über die RAF-Schleife (~400ms), kein abruptes Umschalten

---

## Benötigte Teile

### 1. Body-Klasse als Signal (`runner-hovered` → allgemein: `<element>-hovered`)

Der Hover-State wird als CSS-Klasse auf `document.body` gesetzt. Das erlaubt anderen Systemen (z.B. Spotlight) darauf zu reagieren, ohne direkte Props oder Events.

```tsx
onMouseEnter={() => {
  setGlowActive(true);
  document.body.classList.add('element-hovered'); // beliebiger Name
}}
onMouseLeave={() => {
  setGlowActive(false);
  document.body.classList.remove('element-hovered');
}}
```

Cleanup beim Unmount nicht vergessen:
```tsx
useEffect(() => {
  return () => { document.body.classList.remove('element-hovered'); };
}, []);
```

---

### 2. State

```tsx
const [glowActive, setGlowActive] = useState(false);
```

---

### 3. Wrapper-Struktur

Das Element wird in einen relativen Wrapper eingebettet. Der Glow-Ring ist ein `aria-hidden` Div mit `position: absolute; inset: -6px` — **außerhalb** des eigentlichen Elements, damit kein Overflow-Clipping den Effekt abschneidet.

```tsx
<div
  style={{ position: 'relative' }}
  onMouseEnter={...}
  onMouseLeave={...}
>
  {/* Glow Ring */}
  <div
    aria-hidden
    style={{
      position: 'absolute',
      inset: -6,                        // wie weit der Glow über das Element ragt
      borderRadius: 28,                 // an border-radius des Elements anpassen (+6px)
      pointerEvents: 'none',
      zIndex: 10,
      opacity: glowActive ? 1 : 0,
      transition: 'opacity 0.4s ease',  // sanftes Ein-/Ausblenden
      boxShadow: '0 0 0 1px rgba(255,178,122,0.25), 0 0 32px 8px rgba(255,178,122,0.3), 0 0 80px 20px rgba(255,178,122,0.14)',
      animation: glowActive ? 'element-aura-breathe 3.2s ease-in-out infinite' : 'none',
    }}
  />

  {/* Das eigentliche Element */}
  <div style={{ borderRadius: 22, overflow: 'hidden', ... }}>
    ...
  </div>
</div>
```

> **Wichtig:** `overflow: hidden` darf **nicht** auf dem Wrapper liegen, sonst wird der Glow abgeschnitten. Nur auf dem inneren Element.

---

### 4. Keyframe-Animation (`@keyframes element-aura-breathe`)

```css
@keyframes element-aura-breathe {
  0%, 100% {
    box-shadow:
      0 0 0 1px rgba(255,178,122,0.18),
      0 0 24px 4px rgba(255,178,122,0.22),
      0 0 60px 12px rgba(255,178,122,0.1);
  }
  50% {
    box-shadow:
      0 0 0 1px rgba(255,178,122,0.38),
      0 0 44px 12px rgba(255,178,122,0.4),
      0 0 100px 28px rgba(255,178,122,0.18);
  }
}
```

In React kann das inline als `<style>` Tag im JSX platziert werden (z.B. direkt vor dem return), oder in `global.css`.

**Empfehlung für Farbanpassung:**
- Orange/Peach: `rgba(255, 178, 122, ...)` → `var(--peach)`
- Teal: `rgba(61, 207, 182, ...)` → `var(--teal)`
- Lilac: `rgba(184, 164, 255, ...)` → `var(--lilac)`

---

### 5. Spotlight ausblenden während Hover

In `Spotlight.tsx` wird ein `runnerFadeRef` (allgemein: `elementFadeRef`) im RAF-Loop geführt. Der Wert wird sanft auf 0 oder 1 interpoliert, basierend auf der Body-Klasse.

```tsx
const runnerFadeRef = useRef(0); // im Spotlight-Komponenten-Scope

// im RAF-Loop:
const rfTarget = document.body.classList.contains('element-hovered') ? 1 : 0;
runnerFadeRef.current += (rfTarget - runnerFadeRef.current) * 0.08; // ~400ms bei 60fps
const rfMult = 1 - runnerFadeRef.current;

// rfMult dann als Multiplikator auf tealRef.opacity und whiteRef.opacity anwenden:
tealRef.current.style.opacity = String(baseOpacity * (1 - p.c * 0.92) * rfMult);
whiteRef.current.style.opacity = String(baseOpacity * p.c * 0.55 * rfMult);
```

**Interpolationsgeschwindigkeit:**
- `0.08` ≈ 400ms fade (sanft)
- `0.14` ≈ 250ms fade (schneller)
- `0.04` ≈ 800ms fade (sehr langsam)

---

## Anpassungsparameter auf einen Blick

| Parameter | Aktueller Wert | Effekt |
|---|---|---|
| `inset` auf Glow-Ring | `-6px` | Wie weit der Ring über das Element ragt |
| `borderRadius` Glow-Ring | `28px` | Immer ~6px mehr als das innere Element |
| `transition: opacity` | `0.4s ease` | Ein-/Ausblende-Geschwindigkeit des Rings |
| Pulsfrequenz | `3.2s` | Langsamer = ruhiger, schneller = energischer |
| `box-shadow` Intensität (50%-Keyframe) | `0.38 / 0.4 / 0.18` | Wie stark der Peak-Glow leuchtet |
| RAF lerp-Faktor Spotlight | `0.08` | Ausblend-Geschwindigkeit des Spotlights |

---

## Wo aktuell verwendet

- `src/components/sections/Runner.tsx` — Runner-Arena (`runner-hovered`)

---

## Erweiterung auf weitere Elemente

1. Neue Body-Klasse wählen (z.B. `card-hovered`, `hero-hovered`)
2. State + Cleanup-Effect in der Komponente anlegen
3. Wrapper-Div mit `onMouseEnter`/`onMouseLeave` um das Element legen
4. Glow-Ring-Div als ersten Child einfügen (mit angepasstem `borderRadius`)
5. In `Spotlight.tsx`: neuen `fooFadeRef` anlegen (oder die bestehende Logik auf `.contains('runner-hovered') || .contains('card-hovered')` erweitern)
