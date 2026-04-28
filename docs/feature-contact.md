# Feature: Contact Section

**Datei:** `src/components/sections/Contact.tsx`

## Zweck
Direkte Kontaktaufnahme per Formular oder über Social-Links. Niedrige Einstiegshürde, klare Handlungsaufforderung.

## Inhalt
- **Sektion-Label:** "05 — Kontaktiere mich"
- **Titel:** "Lass uns zusammenarbeiten" / "Let's work together"
- **Blurb:** Einladung, kurz über Projekt/Team/Rolle zu schreiben; Lernbereitschaft betont
- **Direkt-Links:** E-Mail, LinkedIn, GitHub (alle mit farbigen Hover-Gradient-Effekten)
- **Kontaktformular:** Name, E-Mail, Nachricht + Submit

## Formular-Felder
| Feld        | Placeholder                             | Validierung                |
|-------------|-----------------------------------------|----------------------------|
| Name        | "Dein Name"                             | Pflichtfeld (trimmed)      |
| E-Mail      | "deine@email.de"                        | Pflicht + Regex-Validierung|
| Nachricht   | "Hallo Jannik, ich interessiere mich…"  | Pflichtfeld (trimmed)      |
| Honeypot    | (verstecktes Feld, kein Label)          | Anti-Spam                  |

## Formular-Logik

### Validierung
- Alle Felder werden beim Submit geprüft
- E-Mail: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
- Fehler-State pro Feld mit rotem Highlight
- Fehler werden gelöscht, sobald der Nutzer tippt

### API-Integration
- Endpoint: `https://api.hoffja.de/api/send-mail`
- Method: `POST`, Body: JSON (`{ name, email, message }`)
- Headers: `Content-Type: application/json`
- Success → Toast "Nachricht gesendet" (grün)
- Error → Toast "Etwas ging schief" (rot)

### Submit-State
- Button zeigt "Wird gesendet…" während API-Call
- Disabled-State während Versand (verhindert Doppel-Submit)

### Toast-Notification
- Erscheint oben (vermutlich fixed/absolute positioniert)
- Enthält Dismiss-Button
- Success: "Nachricht gesendet — ich melde mich innerhalb von 24 Stunden."
- Error: "Hmm, da ist was schiefgelaufen. Versuch es gleich nochmal oder schreib mir direkt per Mail."

## Game-Integration (Runner → Contact)
- Lauscht auf Custom Event: `runner:send-highscore`
- Bei neuem Highscore im Runner-Game wird automatisch:
  1. Scroll zum Contact-Abschnitt
  2. Nachrichtenfeld wird per Typing-Animation befüllt (Zeichen für Zeichen)
  3. Personalisierter Glückwunsch-Text mit Highscore

## Technische Details
- `useState` für Formfeld-Werte, Fehler-States, Sende-Status, Toast-Status
- `useEffect` für Event-Listener auf `runner:send-highscore`
- `useRef` für Typing-Animation-Timer-Cleanup
- Honeypot-Feld: `display: none` via CSS

## Design-Entscheidungen
- Mehrere Kontaktwege (Formular + direkte Links) für verschiedene Präferenzen
- 24h-Rückmeldungsversprechen signalisiert Professionalität
- Typing-Animation als spielerische Brücke zwischen Runner-Game und Kontaktformular
