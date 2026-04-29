# Feature: Spotlight (Proximity + Ring + CTA Boost)

**Dateien:**
- `src/components/fx/Spotlight.tsx` - Spotlight-Logik, Mouse-Tracking, Proximity-Berechnung
- `src/styles/global.css` - CTA-Glow via `--spotlight-prox`, Shimmer-Loop auf Hover

## Zweck
Das Spotlight verbessert die visuelle Fuehrung des Cursors, ohne Text/Buttons unleserlich zu machen.

## Kernverhalten
- Grundzustand: Teal-Spotlight folgt dem Cursor
- Interaktive Naehe: Spotlight vergroessert sich stufenlos bei Naehe zu klickbaren Elementen
- Pointer-Zustand: Bei `cursor: pointer` wechselt die Farbe in einen orangenen Ring
- Ring-Form: Transparenter Kern + leuchtender Ring, damit der Button-Kern klar bleibt
- Rueckgang: Das Zurueckschliessen ist bewusst langsamer als das Aufgehen

## Technische Umsetzung

### 1) Zwei Spotlight-Layer
In `Spotlight.tsx` werden zwei Layer gleichzeitig gerendert:
- Teal-Layer (`tealRef`) - Basislicht
- Orange-Ring-Layer (`whiteRef`) - aktiviert bei Interaktion/Naehe

Beide Layer:
- `position: fixed`
- `pointer-events: none`
- `mix-blend-mode: screen`
- `filter: blur(...)`

### 2) Distanzbasierte Intensitaet (Idee 5)
Die Funktion `closestInteractiveDistance(...)` misst die Distanz vom Cursor zur naechsten interaktiven Flaeche:
- Selektorbasis: `a, button, input, textarea, select, [role="button"], .cta-fx`
- Aus Distanz wird ein Zielwert `tp` in [0..1]
- Dieser Wert steuert stufenlos Skalierung und Farbwechsel

### 3) Pointer-Hover und Proximity werden kombiniert
Interner Einfluss wird aus zwei Signalen gebildet:
- `h` = direkter Pointer-Hit (schnell)
- `p` = Naehe zu Interaktiven (weicher Verlauf)

Daraus wird ein kombiniertes Ziel berechnet:
- Groesse: `ts = 1 + influence * 0.7`
- Farbphase: `tc = influence`

### 4) Asymmetrische Dynamik
- Aufgehen: schnell
- Zurueckfallen: langsam

So wirkt das Spotlight lebendig und nicht hektisch.

### 5) CTA-Verstaerkung ueber CSS-Variable
`Spotlight.tsx` setzt pro Frame:
- `document.body.style.setProperty('--spotlight-prox', p.c.toFixed(3))`

`global.css` nutzt den Wert fuer dynamische Sichtbarkeit:
- `brightness(...)` steigt mit `--spotlight-prox`
- `drop-shadow(...)` wird staerker bei Naehe

## CTA-Shimmer
Die CTA-Glanzanimation laeuft bei `:hover`/`:focus-visible` im Loop:
- Keyframe: `vc-cta-shimmer`
- Animation: `1100ms linear infinite`

## Accessibility
- Spotlight ist `aria-hidden`
- Keine Interaktion wird blockiert (`pointer-events: none`)
- Fokuszustand bleibt ueber `:focus-visible` sichtbar
- Bei `prefers-reduced-motion` sind CTA-Effekte reduziert

## Tuning-Parameter
In `src/components/fx/Spotlight.tsx` kannst du Verhalten feinjustieren:
- Proximity-Reichweite: `1 - d / 190` (190 = Radius)
- Wachstum: `scaleRate` (hoch fuer schnelleres Oeffnen)
- Rueckgang: `scaleRate` im else-Zweig (niedriger = langsamer)
- Farbwechsel: `colorRate` (hin/zurueck getrennt)
- Ring-Intensitaet: Opacity-Multiplikatoren am Orange-Layer

In `src/styles/global.css`:
- `--spotlight-prox` in `brightness(...)`
- `drop-shadow(...)` Radius/Farbstaerke
- Shimmer-Geschwindigkeit (`vc-cta-shimmer`)

## Ergebnis
Das Feature macht interaktive Elemente trotz Spotlight besser lesbar:
- Kein milchiger Overlay-Kern auf Buttons
- Stufenloser Glow bei Annaeherung
- Klareres, hochwertigeres Hover-Feedback
