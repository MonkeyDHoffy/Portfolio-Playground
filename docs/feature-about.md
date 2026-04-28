# Feature: About Section

**Datei:** `src/components/sections/About.tsx`

## Zweck
Kurze, persönliche Vorstellung von Jannik Hoff – wer er ist, wie er denkt, was ihn antreibt. Soll menschlich und sympathisch wirken.

## Inhalt
- **Sektion-Label:** "01 — Wer ich bin"
- **Titel:** "Hey, ich bin Jannik."
- **Fließtext (p1):** Leidenschaft für Frontend + Backend, Freude am Bauen echter Projekte
- **3 Info-Cards:**
  - 📍 Standort + Offenheit für Remote/Umzug
  - 🧠 Lernbereitschaft und Growth-Mindset
  - 🚀 Aktive Eigenentwicklung und laufendes Portfolio
- **Flip Card:** Vorderseite (Avatar/Illustration), Rückseite (echtes Foto)
- **Rotating Sticker:** "JUNIOR DEV 2026" dreht sich animiert auf der Karte

## Interaktive Elemente

### 3D Flip Card
- CSS 3D-Transform mit `rotateY(180deg)` auf Hover/Click
- `backface-visibility: hidden` auf Vorder- und Rückseite
- Transition: 600ms cubic-bezier
- **Mobile:** Tap löst Flip aus (kein Hover verfügbar)

### Rotating Sticker
- CSS `vc-spin` Keyframe-Animation (unendlich)
- Positioniert absolut über der Karte
- Erscheint wie ein echter Aufkleber

### Hover-Animation (Text)
- Intro-Text skaliert minimal beim Hover der Karte
- Übergang fühlt sich lebendig an

## Technische Details
- Kein eigener State nötig – rein CSS-gesteuerte Flip-Animation
- Info-Cards nutzen `flexbox` mit `gap`
- Emoji-Icons in Cards für visuelle Lockerung

## Design-Entscheidungen
- Authentisches Foto auf der Kartenrückseite stärkt Vertrauen
- "JUNIOR DEV 2026" Sticker ist ehrlich und humorvoll positioniert
- Drei konkrete Info-Punkte statt langer Fließtexte – scannbar für Recruiter
