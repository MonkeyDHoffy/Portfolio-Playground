# Feature: Skills Section

**Datei:** `src/components/sections/Skills.tsx`  
**Daten:** `src/data/skills.ts`

## Zweck
Visualisierung des Tech-Stacks mit Erfahrungsgrad. Jede Karte zeigt Tool + Einschätzung, flip enthüllt eine kurze Beschreibung.

## Skills-Übersicht (13 + 1 Growth)

| Skill       | Level | Jahre | Farbe  | Grid-Span |
|-------------|-------|-------|--------|-----------|
| HTML        | 85%   | 2     | Peach  | 1         |
| CSS         | 82%   | 2     | Sky    | 1         |
| JavaScript  | 80%   | 2     | Yellow | **2**     |
| TypeScript  | 70%   | 1     | Sky    | 1         |
| Angular     | 75%   | 1     | Pink   | **2**     |
| React       | 65%   | 1     | Teal   | 1         |
| Firebase    | 60%   | 1     | Yellow | 1         |
| Git         | 75%   | 2     | Peach  | 1         |
| REST-API    | 65%   | 1     | Lilac  | 1         |
| Scrum       | 60%   | 1     | Lilac  | 1         |
| n8n         | 55%   | 1     | Pink   | 1         |
| Docker      | 50%   | 1     | Sky    | 1         |
| Figma       | 70%   | 2     | Lilac  | 1         |
| Sonstiges   | 60%   | 1     | Teal   | **2**     |
| **Growth**  | —     | —     | —      | Sonderkachel |

## Grid-Layout
- Desktop: 4 Spalten, `auto-rows: 180px`
- Mobile (< 860px): 2 Spalten
- Breitere Karten (span:2) betonen Haupt-Skills

## Interaktive Elemente

### Flip Cards (Desktop)
- Hover dreht Karte um 180° (CSS 3D)
- Vorderseite: Icon, Name, Level-Balken (animiert), Jahreszahl
- Rückseite: Kurzbeschreibung, nochmals Skill-Name

### Mobile Bottom Sheet
- Tap auf Karte öffnet kein direktes Flip
- Stattdessen: "More"-Button öffnet ein Bottom Sheet mit der vollen Beschreibung
- Bottom Sheet schiebt sich von unten ein

### Growth Tile
- Sonderkachel für Python/Django (aktuell im Lernen)
- Pulsierender Ring-Effekt (`vc-pulse-ring`)
- Rückseite: Botschaft zur Lernbereitschaft (Arbeitgeber-relevant)

## Technische Details
- `useRef`, CSS `--flipped` Custom Property für State
- Mobile-Detection via Window-Width in `useEffect`
- `will-change: transform` für GPU-Beschleunigung

## Design-Entscheidungen
- Level-Balken als visuelle Kurzinfo, ohne genaue Prozentzahl im UI
- "Sonstiges"-Kachel deckt Tailwind, Supabase, Vite, React Native + KI-Tools ab
- Growth-Kachel zeigt Lernbereitschaft – direkt für Arbeitgeber formuliert
