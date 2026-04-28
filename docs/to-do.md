# To-Do: Verbesserungen für maximale Employer-Impression

Ziel: Die Seite soll bei Recruitern und Teamleads sofort überzeugen –
durch Glaubwürdigkeit, klare Botschaft, technische Sauberkeit und Professionalität.

Priorität: 🔴 Hoch (sofort) · 🟡 Mittel (bald) · 🟢 Nice-to-have

---

## 🔴 Kritisch / Glaubwürdigkeit

### 1. Bug: Pokédex-Stack ist falsch
**Datei:** `src/data/projects.ts` – Projekt `bubble` (Pokédex)  
Die Beschreibung nennt "React, React Router, Tailwind", aber der Stack-Array enthält nur `['JavaScript', 'HTML', 'CSS']`.  
→ Stack auf `['React', 'TypeScript', 'Tailwind', 'React Router']` korrigieren.

### 2. "Altes Portfolio" entfernen oder umformulieren
Ein altes Portfolio als Projekt zu zeigen wirkt wie Füllmaterial.  
Optionen:
- **Ersetzen** durch ein aktuelleres Projekt (z.B. das Backend/Server-Setup oder ein Native-App-Screen)
- **Umformulieren** zu "Skills-Demo – Angular vs. React": Direkter Vergleich zeigt Framework-Vielseitigkeit

### 3. "GitHub Repository" ist kein Projekt
Karte 04 ist nur ein Link zum GitHub-Profil, kein eigenes Projekt.  
→ Ersetzen durch ein echtes Projekt (Habit-Tracker App, Bewerbungsapp oder Server-Backend)  
→ Oder als "Mehr Projekte auf GitHub" in der Intro-Section einbauen und die Karte rausnehmen.

### 4. KI-Testimonials klar als solche kennzeichnen
GitHub Copilot und Claude Code als "Voices" wirken potenziell unehrlich.  
→ Option A: Disclaimer-Badge "AI-generated" unter den Karten  
→ Option B: Diese beiden Karten entfernen und durch weitere echte Personen ersetzen  
→ Option C: Sektion in "Werkzeuge, die mit mir arbeiten" umbenennen und visuell trennen

### 5. Open Graph / Meta Tags fehlen
Bei LinkedIn-Shares oder Slack-Links erscheint kein Preview-Bild.  
→ `<meta property="og:image">`, `og:title`, `og:description` in `index.html` ergänzen  
→ Ein ansprechendes Social-Preview-Bild (1200x630px) erstellen

---

## 🟡 Inhalt & Botschaft

### 6. Hero-Blurb konkretisieren
"Web, Apps und alles dazwischen" ist vage. Arbeitgeber wollen wissen: Was genau?  
→ Konkreter werden: Z.B. "React-Frontends, REST-APIs, Angular SPAs und alles dazwischen"  
→ Oder auf eine Stärke fokussieren: "Spezialisiert auf moderne React- und Angular-Anwendungen"

### 7. "JUNIOR DEV" abschwächen / umformulieren
Die große Sticker-Aufschrift "JUNIOR DEV 2026" ist das Erste, was man in der About-Card sieht.  
Das setzt sofort niedrige Erwartungen – bevor jemand den Inhalt liest.  
→ Option: Sticker auf "DEV 2026" oder "FRONTEND DEV" ändern, "Junior" in den Fließtext verlagern  
→ Man kann Junior sein, ohne es als größtes visuelles Element zu zeigen

### 8. About-Section: Ausbildung/Werdegang fehlt
Wo hat Jannik programmieren gelernt? Bootcamp? Selbststudium? Studium?  
→ 1-2 Sätze ergänzen: "Ich habe X bei Y gelernt und seitdem..."  
→ Das beantwortet eine der ersten Fragen von Recruitern

### 9. Voices: Testimonial-Texte ausbauen
Aktuelle Texte sind kurz und sehr generisch ("strukturiert, präzise, lösungsorientiert").  
→ Konkrete Beispiele einbauen: "Ich habe mit Jannik an [Projekt] gearbeitet und beeindruckt war ich von..."  
→ Das macht den Unterschied zwischen wirkungslosen und überzeugenden Referenzen

### 10. Contact-Blurb fokussieren
"Denke pragmatisch mit" ist gut, aber der Rest ist sehr allgemein.  
→ Klarer formulieren, was Jannik einbringt: Junior-Energie, Lernbereitschaft, echte Projekte im Portfolio  
→ Vermeiden: "ich melde mich innerhalb von 24 Stunden" klingt wie ein Support-Bot, besser: "Ich freue mich auf deine Nachricht."

---

## 🟡 Design & UX

### 11. Kein Light Mode
Die Seite ist rein dunkel. Einige Arbeitgeber schauen in hellen Büros auf hellen Bildschirmen.  
→ Light-Mode-Toggle hinzufügen (neben Lang-Toggle im Header)  
→ Alternativ: Sicherstellen, dass Kontraste auch auf mittelhellem Bildschirm ausreichend sind

### 12. CV-Download sichtbarer platzieren
Der CV-Download ist im Header – gut – aber bei Mobile komprimiert er sich ins Hamburger-Menü.  
→ Auf Mobile: Floating "CV ↓"-Button oder prominenten Link in der Hero-Section  
→ Im Hero: Dritter Button "CV herunterladen" neben den beiden CTAs

### 13. Fehlende "zuletzt aktualisiert"-Information
Arbeitgeber wollen wissen, ob die Seite aktuell ist.  
→ Im Footer: "Zuletzt aktualisiert: April 2026" oder "Portfolio 2026" sichtbarer machen  
→ Projekte mit "NEUES PROJEKT" Badge für aktuelle Arbeiten

### 14. Skill-Level-Balken ohne Prozentzahl
Die Level-Balken zeigen 50–85%, aber im UI ist keine Zahl sichtbar.  
→ Tooltip oder Zahl beim Hover anzeigen: "80% — 2 Jahre Erfahrung"  
→ Oder Bezeichnungen nutzen: "Grundkenntnisse / Fortgeschritten / Experte" statt Balken

### 15. Runner-Game: Kein Hinweis im Scrollfluss
Viele Besucher werden die Runner-Section scrollen, ohne zu spielen.  
→ Auffälligeren "PLAY"-Call-to-Action gestalten  
→ Oder kurzen Text: "Ich habe auch ein Flappy-Bird gebaut – versuch's!"

---

## 🟡 Technisches

### 16. Fehlende `<title>` und `<meta description>` Variationen
Aktuell ist der Page-Title statisch. Für SEO und professionellen ersten Eindruck:  
→ `<title>Jannik Hoff – Frontend Developer | hoffja.de</title>`  
→ `<meta name="description" content="Junior Frontend Developer aus Saarlouis. React, Angular, TypeScript. Jetzt verfügbar.">`

### 17. JSON-LD Schema prüfen/erweitern
`index.html` enthält JSON-LD – gut! Aber ist es aktuell?  
→ `Person`-Schema: Fähigkeiten, Jobstatus, URL prüfen  
→ `sameAs`-Links: GitHub, LinkedIn ergänzen

### 18. n8n und Docker: Icons fehlen
`icon: null` bei n8n, Docker, Figma, Sonstiges.  
→ SVG-Icons aus offiziellen Quellen einbinden (alle haben freie Icons)  
→ Gleiche Qualitätsstufe wie bei HTML/CSS/JavaScript-Kacheln

### 19. Pokédex-Bild heißt "bubble.png" 
Der Image-Key `/assets/projects/bubble.png` lässt keinen Rückschluss auf das Projekt zu.  
→ Umbenennen: `pokedex.png` (konsistenter mit Projektname)

### 20. Accessibility: Runner-Game
Ein Canvas-Game ohne Alt-Text oder Aria-Label ist für Screen-Reader unsichtbar.  
→ `aria-label="Flappy Bird-style Browserspiel"` auf den Game-Container  
→ `role="application"` und kurze Beschreibung

---

## 🟢 Nice-to-Have

### 21. Animated Page Transition
Beim Wechsel der Sprache (DE/EN) gibt es keinen visuellen Übergang.  
→ Kurzes Fade-Out/In der Inhalte beim Sprachwechsel

### 22. "Verfügbar ab sofort" oder Datum eintragen
"Offen für Arbeit" im Hero ist gut, aber unpräzise.  
→ "Verfügbar ab sofort" oder "ab Mai 2026" – konkrete Info für HR-Entscheidungen

### 23. Projekt-Filter nach Technologie
Bei 8 Projekten kann man nach Stack filtern (React/Angular/etc.).  
→ Filter-Pills über dem Karussell: "Alle / React / Angular / JS"

### 24. Analytics einbinden
Ohne Analytics weißt du nicht, wie lange Besucher auf der Seite sind, wo sie abspringen, welche Sprache sie nutzen.  
→ Einfaches Privacy-freundliches Tool: Plausible, Umami oder Fathom (DSGVO-konform)

### 25. Social Sharing: "Share this portfolio" Button
→ LinkedIn-Share-Button im Hero oder Footer  
→ "Check out my portfolio" – Arbeitgeber teilen manchmal Kandidaten intern

---

## Zusammenfassung der wichtigsten 5 Punkte

1. **Pokédex-Stack korrigieren** (Fehler!)
2. **"GitHub Repository" Karte ersetzen** (kein echtes Projekt)  
3. **Open Graph Meta-Tags ergänzen** (LinkedIn-Sharing)
4. **"JUNIOR DEV" Sticker entschärfen** (erster visueller Eindruck)
5. **KI-Testimonials kennzeichnen** (Glaubwürdigkeit)
