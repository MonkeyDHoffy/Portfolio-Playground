# Feature: Runner (Flappy Bird-Style Game)

**Datei:** `src/components/sections/Runner.tsx`

## Zweck
Einzigartiges, interaktives Highlight der Seite. Demonstriert technisches Können (Canvas, Game-Loop, Physics) und macht die Portfolio-Erfahrung unvergesslich.

## Spielmechanik

### Grundprinzip
- Flappy-Bird-Style: Vogel fliegt nach oben (Klick/Space/Tap), fällt sonst durch Schwerkraft
- Bird-Sprite: Avatar-Bild (`/assets/aboutme/...`)
- Hindernisse: Vertikal platzierte Pipe-Paare mit randomisierten Lücken
- Collectibles: Gelbe Pickup-Orbs zwischen Pipes (+1 Punkt)

### Steuerung
- **Space-Taste:** Flattern
- **Mausklick:** Flattern
- **Touch (Tap):** Flattern

### Spielzustände
| State     | Beschreibung                                      |
|-----------|---------------------------------------------------|
| `ready`   | Pulsierender "Klick zum Starten"-Prompt           |
| `running` | Aktives Spiel                                     |
| `dead`    | Game-Over-Overlay mit Statistiken + Restart       |

## Scoring
- **Distance:** Meter zurückgelegter Strecke (kontinuierlich)
- **Points:** Punkte durch Pickup-Orbs (+1 pro Pickup)
- **Highscore:** Wird in `localStorage` gespeichert (Distance + Points getrennt)
- Bei neuem Highscore → dispatcht `runner:send-highscore` Custom Event

## Schwierigkeits-Scaling
- 3 Difficulty-Phasen basierend auf Distanz:
  - Phase 1: Standard-Speed
  - Phase 2: +X% Speed Multiplier
  - Phase 3: +XX% Speed Multiplier
- Pipe-Gap-Größe kann optional abnehmen
- Pickup-Spawn-Rate bleibt konstant

## Visuelle Effekte

### Partikel-System
- Explosion bei Pipe-Passage (Score-Feedback)
- Glitzer-Effekt bei Pickup-Sammlung
- Partikel: Kreis-Shapes, randomisierte Richtung, Fade-Out

### Animations
- `runner-ready-*` CSS-Keyframes für Ready-State-UI
- Bird-Sprite rotiert basierend auf Vertikalgeschwindigkeit
- Pipes scrollen von rechts nach links

### UI-Overlays
- **Ready-State:** Pulsierender Ring, zentrierter Prompt
- **Game-Over:** Score-Zusammenfassung, Highscore-Vergleich, "Noch mal?"-Button
- **HUD (während Spiel):** Distance + Points oben eingeblendet

## Technische Details
- HTML5 Canvas oder DOM-basierte Simulation (kein externes Game-Framework)
- `requestAnimationFrame` Game-Loop
- `localStorage` Schlüssel: `jh_runner_best_dist`, `jh_runner_best_pts` (o.ä.)
- `window.dispatchEvent(new CustomEvent('runner:send-highscore', { detail: { ... } }))` bei neuem Highscore

## Contact-Integration
Wenn neuer Highscore → Custom Event → `Contact.tsx` reagiert:
1. Scroll zur Contact-Section
2. Nachrichten-Textarea wird per Typing-Animation befüllt
3. Personalisierter Text mit Highscore-Daten

## Design-Entscheidungen
- Nur eine Mini-Section (kein Vollbild-Game), bleibt in den Seitenfluss integriert
- Kein separates Navigations-Item für das Game
- Bird-Sprite als Avatar macht das Game persönlich und witzig
- Verbindung zum Kontaktformular motiviert zum Spielen UND Kontaktieren
