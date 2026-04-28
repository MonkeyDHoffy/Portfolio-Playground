import type { Lang } from '../i18n/translations';

export type Skill = {
  label: string;
  icon: string | null;
  years: number;
  level: number;
  color: string;
  span: 1 | 2;
  note: Record<Lang, string>;
  noteShort?: Record<Lang, string>;
};

const TEAL   = '#3DCFB6';
const PEACH  = '#FFB27A';
const LILAC  = '#B8A4FF';
const YELLOW = '#F4E06D';
const PINK   = '#FF6D8A';
const SKY    = '#6EB3FF';

export const skills: Skill[] = [
  { label: 'HTML',       icon: '/assets/skills/html.png',       years: 2, level: 85, color: PEACH,  span: 1, note: { de: 'HTML strukturiert Inhalte semantisch und bildet das Grundgerüst jeder Webseite.', en: 'HTML structures content semantically and forms the foundation of every website.' }, noteShort: { de: 'Semantische Struktur als Basis jeder Seite.', en: 'Semantic structure as the base of every page.' } },
  { label: 'CSS',        icon: '/assets/skills/css.png',        years: 2, level: 82, color: SKY,    span: 1, note: { de: 'CSS steuert Layout, Farben, Typografie und Animationen für das visuelle Design.', en: 'CSS controls layout, colors, typography, and animations for visual design.' }, noteShort: { de: 'Layouts, Farben und Animationen für das UI.', en: 'Layouts, colors, and animations for UI design.' } },
  { label: 'JavaScript', icon: '/assets/skills/javascript.png', years: 2, level: 80, color: YELLOW, span: 2, note: { de: 'JavaScript macht Webseiten interaktiv und steuert Logik direkt im Browser.', en: 'JavaScript makes websites interactive and runs logic directly in the browser.' }, noteShort: { de: 'Interaktivität und Browser-Logik für dynamische UIs.', en: 'Interactivity and browser logic for dynamic UIs.' } },
  { label: 'TypeScript', icon: '/assets/skills/typescript.png', years: 1, level: 70, color: SKY,    span: 1, note: { de: 'TypeScript erweitert JavaScript um Typen und reduziert Fehler schon beim Entwickeln.', en: 'TypeScript adds types to JavaScript and reduces errors during development.' }, noteShort: { de: 'Typen für stabileren, besser wartbaren Code.', en: 'Types for safer, more maintainable code.' } },
  { label: 'Angular',    icon: '/assets/skills/angular.png',    years: 1, level: 75, color: PINK,   span: 2, note: { de: 'Angular ist ein Framework für große, strukturierte Single-Page-Webanwendungen.', en: 'Angular is a framework for large, structured single-page web applications.' }, noteShort: { de: 'Framework für strukturierte, größere SPAs.', en: 'Framework for structured, larger SPAs.' } },
  { label: 'React',      icon: '/assets/skills/react.png',      years: 1, level: 65, color: TEAL,   span: 1, note: { de: 'React baut Benutzeroberflächen aus wiederverwendbaren Komponenten und State-Logik.', en: 'React builds UIs from reusable components and state-driven logic.' }, noteShort: { de: 'Komponentenbasiertes UI mit klarer State-Logik.', en: 'Component-based UI with clear state logic.' } },
  { label: 'Firebase',   icon: '/assets/skills/firebase.png',   years: 1, level: 60, color: YELLOW, span: 1, note: { de: 'Firebase bietet Backend-Dienste wie Authentifizierung, Datenbank und Hosting aus einer Hand.', en: 'Firebase provides backend services like auth, database, and hosting in one platform.' }, noteShort: { de: 'Auth, Datenbank und Hosting in einer Plattform.', en: 'Auth, database, and hosting in one platform.' } },
  { label: 'Git',        icon: '/assets/skills/git.png',        years: 2, level: 75, color: PEACH,  span: 1, note: { de: 'Git versioniert Code, erleichtert Zusammenarbeit und hält Änderungen nachvollziehbar.', en: 'Git versions code, improves collaboration, and keeps changes traceable.' }, noteShort: { de: 'Versionierung und saubere Zusammenarbeit im Team.', en: 'Version control and smooth team collaboration.' } },
  { label: 'REST-API',   icon: '/assets/skills/api.png',        years: 1, level: 65, color: LILAC,  span: 1, note: { de: 'REST-APIs verbinden Frontend und Backend über standardisierte HTTP-Endpunkte.', en: 'REST APIs connect frontend and backend through standardized HTTP endpoints.' }, noteShort: { de: 'Saubere Verbindung zwischen Frontend und Backend.', en: 'Clean integration between frontend and backend.' } },
  { label: 'Scrum',      icon: '/assets/skills/scrum.png',      years: 1, level: 60, color: LILAC,  span: 1, note: { de: 'Scrum ist ein agiles Vorgehensmodell mit Sprints, Rollen und regelmäßigen Reviews.', en: 'Scrum is an agile framework with sprints, roles, and regular reviews.' }, noteShort: { de: 'Agiles Arbeiten mit Sprints und regelmäßigen Reviews.', en: 'Agile delivery with sprints and regular reviews.' } },
  { label: 'n8n',        icon: null,                             years: 1, level: 55, color: PINK,   span: 1, note: { de: 'n8n automatisiert Workflows, indem Apps über visuelle Flows verbunden werden.', en: 'n8n automates workflows by connecting apps through visual flows.' }, noteShort: { de: 'Workflow-Automation über visuelle Flows.', en: 'Workflow automation through visual flows.' } },
  { label: 'Docker',     icon: null,                             years: 1, level: 50, color: SKY,    span: 1, note: { de: 'Docker kapselt Anwendungen in Container für konsistente Umgebungen auf jedem System.', en: 'Docker packages applications in containers for consistent environments on any system.' }, noteShort: { de: 'Container für konsistente Deployments auf jedem System.', en: 'Containers for consistent deployments on any system.' } },
  { label: 'Figma',      icon: null,                             years: 2, level: 70, color: LILAC,  span: 1, note: { de: 'Figma ist ein Tool für UI-Design, Prototyping und Team-Kollaboration.', en: 'Figma is a tool for UI design, prototyping, and team collaboration.' }, noteShort: { de: 'UI-Design, Prototyping und Kollaboration im Team.', en: 'UI design, prototyping, and team collaboration.' } },
  { label: 'Sonstiges',  icon: null,                             years: 1, level: 60, color: TEAL,   span: 2, note: { de: 'Tailwind, Bootstrap, Supabase, Vite und React Native gehören ebenfalls zu meinen Praxis-Tools. Zusätzlich habe ich Erfahrung im KI-gestützten Programmieren (u. a. mit Copilot und Claude Code) und nutze die Tools verantwortungsvoll für schnellere Umsetzung, sauberen Code und bessere Dokumentation.', en: 'I have also worked with Tailwind, Bootstrap, Supabase, Vite, and React Native. In addition, I have experience with AI-assisted programming (including Copilot and Claude Code) and use these tools responsibly for faster implementation, clean code, and better documentation.' }, noteShort: { de: 'Weitere Praxis-Tools plus KI-gestütztes Programmieren mit Copilot und Claude Code.', en: 'Additional tools plus AI-assisted programming with Copilot and Claude Code.' } },
];

export const growthSkill = {
  label: 'Growth',
  title: 'Python · Django',
};
