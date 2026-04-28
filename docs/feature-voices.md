# Feature: Voices Section (Testimonials)

**Datei:** `src/components/sections/Voices.tsx`  
**Daten:** `src/data/voices.ts`

## Zweck
Soziale Bestätigung durch Testimonials im Stil eines Social-Media-Feeds. Zeigt, wie andere Jannik einschätzen.

## Testimonials im Überblick

| Person           | Handle        | Herkunft          | LinkedIn | Kernaussage                                  |
|------------------|---------------|-------------------|----------|----------------------------------------------|
| GitHub Copilot   | @copilot      | KI-Tool           | —        | "Klarer Code, gute Tests, professionell."     |
| Alexander Schulz | @alex_s       | Reale Person      | ✅       | "Zuverlässig, performant, reibungslos."       |
| Till Ganster     | @tillganster  | Reale Person      | ✅       | "Strukturiert, präzise, clean architecture." |
| Nicolas Tran     | @nico_t       | Reale Person      | ✅       | "Steile Lernkurve, lösungsorientiert."       |
| Claude Code      | @claudecode   | KI-Tool           | —        | "Produktiv, fokussiert, Tooling sinnvoll."   |

## Karussell-Mechanik

### Auto-Scroll
- Horizontales Auto-Scrolling mit konfigurierbarer Geschwindigkeit
- Pause wenn Maus über Karussell (hover detection)
- Resume nach Maus-Verlassen

### Drag / Swipe Control
- Pointer-Events: `pointerdown`, `pointermove`, `pointerup`
- Drag-Detektion mit Minimal-Threshold (verhindert versehentliches Drag)
- **Inertia:** Nach Loslassen läuft Scroll noch etwas weiter (Momentum Decay)
- Unterscheidung Drag vs. Klick (kein Klick-Event bei Drag)

### Carousel Lever (Steuerhebel)
- Visueller Schalter: Links / Stopp / Rechts
- Steuert Richtung und Geschwindigkeit des Auto-Scrolls
- Label: "Carousel-Hebel" / "Carousel lever"
- Hint-Text erklärt die Bedienung

### Edge Fade
- CSS `mask-image` mit linearem Verlauf an beiden Seiten
- Karten verschwinden weich am Rand, kein harter Abschnitt

## Karten-Aufbau (Social Post-Stil)
- Avatar (Initialen-Fallback oder Foto)
- Name + Handle + Zeitstempel
- Testimonial-Text (DE/EN)
- Social-Stats: Likes, Reposts, Replies (rein dekorativ)
- LinkedIn-Profillink für verifizierbare Personen (öffnet extern)

## Technische Details
- `useRef` auf Scroll-Container für programmatisches Scrollen
- `requestAnimationFrame`-Loop für smooth Auto-Scroll
- `pointerCapture` für zuverlässiges Drag-Tracking außerhalb des Elements
- Momentum-Faktor: exponentieller Decay nach Pointer-Release

## Design-Entscheidungen
- Social-Media-Ästhetik macht Testimonials nahbar und modern
- Reale LinkedIn-Profile der echten Personen sind verknüpft
- KI-Tools (Copilot, Claude Code) als "Testimonials" sind humorvoll, aber klar als solche erkennbar
- Interaktives Karussell verhindert statische, uninspirierte Testimonial-Layouts
