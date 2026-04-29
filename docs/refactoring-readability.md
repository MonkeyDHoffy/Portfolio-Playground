# Refactoring — Code-Lesbarkeit

Datum: 2026-04-29  
Branch: main  
Ziel: Code lesbarer und wartbarer machen, ohne den visuellen Output zu verändern.

---

## Was wurde geändert

### 1. `useIsPhone()` Hook — `src/hooks/useIsPhone.ts` (neu)

**Problem:** Das Pattern

```ts
const [isPhone, setIsPhone] = useState(() => window.innerWidth <= 860);
useEffect(() => {
  const onResize = () => setIsPhone(window.innerWidth <= 860);
  window.addEventListener('resize', onResize);
  return () => window.removeEventListener('resize', onResize);
}, []);
```

war identisch in **drei** Komponenten kopiert: `Header.tsx` (als `isCompact`), `Runner.tsx`, `Projects.tsx`.

**Fix:** Zentraler Hook in `src/hooks/useIsPhone.ts`. Alle drei Komponenten nutzen jetzt `const isPhone = useIsPhone()` — eine Zeile statt sieben, drei weniger separate Event-Listener.

---

### 2. Contact.tsx — Dreifacher Linkstil extrahiert

**Problem:** Das Style-Objekt für die Kontakt-Links (MAIL, LINKEDIN, GITHUB) war **drei Mal** identisch inline im JSX wiederholt — je ~20 Zeilen. Insgesamt ~60 Zeilen Wiederholung.

**Fix:** Extrahiert in zwei Konstanten oberhalb der Komponente:

```ts
const contactLinkStyle: React.CSSProperties = { ... };
const onContactLinkEnter = (e) => { ... };
const onContactLinkLeave = (e) => { ... };
```

Jeder Link ist jetzt eine überschaubare Zeile:

```tsx
<a href="..." style={contactLinkStyle} onMouseEnter={onContactLinkEnter} onMouseLeave={onContactLinkLeave}>
```

---

### 3. Contact.tsx — Sechstes Duplikat des Aura-Keyframes entfernt

**Problem:** Der `@keyframes element-aura-breathe` Block war bereits in `global.css` definiert worden, stand aber in `Contact.tsx` noch als sechste Kopie.

**Fix:** Lokale Definition entfernt — `global.css` wird von allen Komponenten genutzt.

---

### 4. JSDoc — Öffentliche Typen und Hooks dokumentiert

Ziel: IDE-Tooltips beim Hover über Props/Typen, verständliche Verträge zwischen Komponenten.

| Datei | Was dokumentiert wurde |
|---|---|
| `ConfirmPopup.tsx` | Alle Props in `ConfirmPopupProps` mit Einzelbeschreibung |
| `Contact.tsx` | `RunnerSendHighscoreEventDetail` (Cross-Komponenten-Event-Vertrag), `FormErrors`, `Field`-Props |
| `voices.ts` | `Voice` Typ — `wink`, `profileUrl`, `handle` erklärt |
| `useAnim.ts` | `useMousePos` (Return-Wert), `useInViewOnce` (Fire-once-Verhalten) |
| `useIsPhone.ts` | Hook-Beschreibung, Breakpoint, reaktives Verhalten |

---

## Was JSDoc ist

JSDoc sind `/** ... */`-Kommentare direkt über einer Funktion, einem Typ oder einer Variable. IDEs (VS Code, WebStorm) zeigen diese als Tooltip beim Hover an — ohne dass man die Datei öffnen muss.

```ts
/**
 * Returns `true` once the element has entered the viewport.
 * Disconnects after first intersection — fires exactly once per mount.
 */
export function useInViewOnce<T extends HTMLElement>(ref, opts) { ... }
```

In TypeScript braucht man JSDoc **nur wo der Typ nicht selbst erklärt** — für offensichtliche Props wie `isOpen: boolean` reicht der Typ. Für nicht-offensichtliche Verträge wie `wink?: boolean` (AI-generiert, kein Klick) ist JSDoc der richtige Ort.

---

## Commit-Übersicht

| Commit | Beschreibung |
|---|---|
| `ea02ef2` | `useIsPhone()` Hook extrahiert, 3× Resize-Pattern entfernt |
| `6f0f142` | Contact.tsx: Linkstil dedupliziert, 6. Aura-Keyframe entfernt |
| `b5358cd` | JSDoc auf öffentliche Typen, Hooks und Utility-Funktionen |
