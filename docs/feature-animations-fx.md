# Feature: Animationen & visuelle Effekte

**Dateien:**  
- `src/styles/global.css` — CSS-Keyframes & Transitions  
- `src/styles/tokens.css` — Design-Tokens  
- `src/components/fx/GradientBlobs.tsx` — Hintergrund-Blobs  
- `src/components/fx/Spotlight.tsx` — Maus-Spotlight  
- `src/components/fx/ScrollbarController.tsx` — Scrollbar-Farbe  
- `src/hooks/useAnim.ts` — Animation-Utilities

## CSS-Keyframes

| Name                  | Effekt                                         | Verwendet in      |
|-----------------------|------------------------------------------------|-------------------|
| `vc-float`            | Sanftes Auf-und-Ab-Wogen                       | Hero Orbs         |
| `vc-spin`             | Endlose Rotation                               | About Sticker     |
| `vc-marquee`          | Horizontaler Endlos-Scroll                     | Ticker Banner     |
| `vc-pulse-ring`       | Pulsierender Ring nach außen                   | Skills Growth     |
| `vc-blink`            | Blinken (opacity)                              | diverse           |
| `vc-cta-shimmer`      | Lichtreflex über CTA-Buttons                   | Hero Buttons      |
| `pc-swipe-in-left`    | Einblenden von links                           | Projects Carousel |
| `pc-swipe-in-right`   | Einblenden von rechts                          | Projects Carousel |
| `runner-ready-*`      | Ready-State-Animation im Game                  | Runner            |

## React-basierte Effekte

### GradientBlobs
- 3 fixe, unscharfe Radial-Gradienten im Hintergrund (teal, lilac, peach)
- `position: fixed`, hinter allen Inhalten
- Langsame CSS-Animation (float/pulse), subtil

### Spotlight
- Folgt dem Mauszeiger als teal-farbener Leuchtkreis
- Wird größer über klickbaren Elementen (hover-Detektion)
- Pointer-Events: none (blockiert keine Interaktion)
- `mousemove` → `translate3d` für GPU-Beschleunigung

### ScrollbarController
- Berechnet basierend auf Scroll-Position, welche Section aktiv ist
- Blended Scrollbar-Farbe zwischen Section-Themen
- Nutzt CSS Custom Property: `--scrollbar-color`

## Custom Hooks (`useAnim.ts`)

### `useMousePos(ref)`
- Tracked `mousemove` auf gegebenem Element
- Gibt `{ x, y, inside }` zurück
- `inside: false` → neutrale Position (kein Parallax-Drift)

### `useInViewOnce(ref, options)`
- Einmaliger `IntersectionObserver`
- Gibt `boolean` zurück (sichtbar = true, bleibt true)
- Verwendet für Scroll-Reveal-Animationen

### `useAutoScrollReveal()`
- Staggered Fade-In aller Sections beim Scrollen
- Index-basierte Verzögerung (`i * 0.1s`)

## Scroll-Reveal-Prinzip
- Sections starten mit `opacity: 0, translateY: 20px`
- Beim ersten In-View-Moment: `opacity: 1, translateY: 0`
- Transition: 600ms ease-out
- Nur einmal abgespielt (kein Reset beim Scrollen)

## Performance-Hinweise
- `will-change: transform` auf animierten Elementen
- `transform` statt `top/left` für GPU-Layer
- `requestAnimationFrame` in Game-Loop und Spotlight
- Keine Layout-Thrashing-Risiken durch Transforms-only-Animationen
