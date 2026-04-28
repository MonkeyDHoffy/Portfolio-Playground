# Feature: Projects Section

**Datei:** `src/components/sections/Projects.tsx`  
**Daten:** `src/data/projects.ts`

## Zweck
Präsentation von 8 eigenen Projekten als interaktives 3D-Karussell mit Flip-Detail-Ansicht.

## Projekte im Überblick

| Nr | Titel              | Jahr | Tech-Stack                              | Live | GitHub |
|----|--------------------|------|-----------------------------------------|------|--------|
| 01 | Join               | 2024 | Angular, TypeScript, HTML, CSS, Firebase | ✅   | ✅     |
| 02 | El Pollo Loco      | 2024 | HTML, CSS, JavaScript                   | ✅   | ✅     |
| 03 | Pokédex            | 2025 | JavaScript, HTML, CSS                   | ✅   | ✅     |
| 04 | GitHub Repository  | 2026 | GitHub, Open Source, TypeScript         | —    | ✅     |
| 05 | Altes Portfolio    | 2023 | Angular, React, TypeScript, SCSS        | ✅   | ✅     |
| 06 | PollApp            | 2026 | TypeScript, Angular, Supabase           | ✅   | ✅     |
| 07 | Memory             | 2024 | Angular, TypeScript, SCSS              | ✅   | ✅     |
| 08 | Specials           | 2026 | React Native, TypeScript, Docker, Backend| —   | ✅     |

## Karussell-Mechanik

### Desktop
- Aktive Karte: zentral, volle Größe
- Nebenkarten: seitlich versetzt, perspektivisch verkleinert, halbtransparent
- Prev/Next-Buttons mit CSS-Übergang (slide + 3D-Perspective)
- Dot-Navigation unter dem Karussell (8 Punkte)

### Mobile
- Horizontales Swipe-Gesture mit Touch-Events
- Threshold-basierte Navigationserkennung
- Inertia: leichter Schwung nach Swipe-Ende
- `pc-swipe-in-left` / `pc-swipe-in-right` CSS-Keyframes

## Flip-Interaktion
- Klick auf Karte dreht sie um (Y-Achse, 600ms)
- **Vorderseite:** Projekt-Bild, Titel, Jahr, Tag-Badge, Tech-Stack-Pills
- **Rückseite:** Beschreibung (DE/EN), Live-Demo-Button, GitHub-Button
- Flip-Hint: "Klick eine Karte zum Umdrehen."

## Technische Details
- `useState` für aktiven Index + Flip-State
- `useCallback` für Prev/Next-Handler
- Touch-Start/End Delta für Swipe-Richtungserkennung
- CSS `perspective: 1200px` auf Wrapper-Div

## Projekt-Datenstruktur
```typescript
type Project = {
  key: string;
  index: string;
  title: string;
  year: string;
  tag: Record<Lang, string>;
  description: Record<Lang, string>;
  stack: string[];
  image: string;
  live?: string;
  github: string;
};
```

## Design-Entscheidungen
- 3D-Karussell hebt sich von statischen Grid-Galerien ab – zeigt UI-Kompetenz
- Flip-Mechanismus spart Platz und macht Detailinfos interaktiv erlebbar
- Jede Karte enthält klare Links zu Live-Demo und Source-Code
