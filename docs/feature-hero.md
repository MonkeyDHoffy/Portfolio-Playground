# Feature: Hero Section

**Datei:** `src/components/sections/Hero.tsx`

## Zweck
Die Hero-Section ist der erste Eindruck der Seite. Sie vermittelt Name, Positionierung und verfügbare CTAs – direkt und visuell stark.

## Inhalt
- **Status-Badge:** "Offen für Arbeit" / "Open to work" (grüner Puls-Dot, teal-farbig)
- **Haupttitel:** "Software mit *good vibes*." (riesige Schrift, clamp 72px–180px)
- **Subtext:** Kurze Vorstellung als Entwickler aus Saarlouis
- **CTAs:** "Meine Projekte →" (teal) und "Kontaktier mich" (peach)

## Interaktive Elemente

### Floating Orbs (12 Stück)
Runde Kreise mit Tech-Labels schweben um den Titelbereich:
- Angular, React, TS, Firebase, n8n, Docker, Git, Scrum, REST, CSS, { }, </>
- **Parallax:** Orbs folgen dem Mauszeiger mit leichter Verzögerung (`0.03` Multiplikator)
- **Float-Animation:** CSS-Keyframe `vc-float`, gestaffelt per Orb (4–10s Dauer)
- **Rotation:** Jeder Orb leicht verdreht (`i * 17 - 20` Grad)

### CTA-Scroll-Reveal
- `useInViewOnce` Hook mit `IntersectionObserver`
- Buttons gleiten beim ersten Sichtbarwerden von links/rechts ein
- CSS-Klassen: `cta-enter`, `cta-enter-left`, `cta-enter-right`, `cta-in`

## Technische Details
- `useMousePos()` Hook tracked Mausposition relativ zur Section
- `useInViewOnce()` Hook für einmalige Einblend-Animation der CTAs
- Button-Styles: Inline-Styles mit `boxShadow: '4px 4px 0 #000'` (Neo-Brutalist)
- Responsive: `padding: '80px 40px'`, Orbs nutzen `%`-Positionen

## Design-Entscheidungen
- Sehr große Typographie macht den ersten Eindruck dominant und selbstbewusst
- "good vibes" als rotiertes Teal-Highlight ist das visuelle Markenzeichen der Seite
- Name im Blurb-Text wird **fett + glowing** hervorgehoben (Name-Detection via `startsWith`)
