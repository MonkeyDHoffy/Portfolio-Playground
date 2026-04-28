# Feature: Internationalisierung (DE / EN)

**Dateien:**  
- `src/i18n/LanguageContext.tsx` — Globaler Sprach-State  
- `src/i18n/translations.ts` — Alle Übersetzungen  
- `src/components/layout/LangToggle.tsx` — Umschalter im Header

## Zweck
Vollständig zweisprachige Seite (Deutsch / Englisch) ohne Page-Reload. Ermöglicht Ansprache sowohl lokaler als auch internationaler Arbeitgeber.

## Sprachdetektions-Reihenfolge
1. URL-Parameter: `?lang=en` oder `?lang=de`
2. `localStorage` Key: `jh.lang`
3. Browser-Sprache (`navigator.language`)
4. Fallback: Deutsch (`de`)

## Übersetzte Bereiche

| Bereich     | Schlüssel     | Vollständig |
|-------------|---------------|-------------|
| Navigation  | `nav.*`       | ✅          |
| Hero        | `hero.*`      | ✅          |
| About       | `about.*`     | ✅          |
| Skills      | `skills.*`    | ✅          |
| Projekte    | `projects.*`  | ✅          |
| Voices      | `voices.*`    | ✅          |
| Runner      | `runner.*`    | ✅          |
| Kontakt     | `contact.*`   | ✅          |
| Footer      | `footer.*`    | ✅          |

## Daten-Ebene
Nicht nur UI-Labels, sondern auch:
- `projects[].description` — individuell pro Sprache
- `projects[].tag` — Kurzbeschreibung pro Sprache
- `skills[].note` + `skills[].noteShort` — Skill-Beschreibungen
- `voices[].text` + `voices[].when` — Testimonial-Texte + Zeitstempel

## Technische Umsetzung

### Context API
```typescript
// LanguageContext.tsx
const LanguageContext = createContext<LanguageContextType>(...);
export const useLang = () => useContext(LanguageContext);
```

### Translation-Zugriff
```typescript
const { t, lang } = useLang();
t('hero.blurb')  // gibt string für aktuelle Sprache zurück
```

### Persistenz
- Sprachwahl wird in `localStorage` gespeichert
- Bleibt beim nächsten Besuch erhalten

## LangToggle (UI)
- Positioniert im Header, rechts der Navigation
- Zeigt aktive Sprache klar an (DE / EN)
- Umschalten ohne Seitenneuladung (reiner State-Wechsel)

## Design-Entscheidungen
- Deutsche Standardsprache (Zielmarkt primär deutschsprachig)
- Alle Inhalte vollständig übersetzt – keine Mischsprache
- Skill-Beschreibungen haben kurze + lange Variante (`note` / `noteShort`) für Desktop vs. Mobile
