import type { Lang } from '../i18n/translations';

export type Skill = {
  label: string;
  icon: string | null;
  years: number;
  level: number;
  color: string;
  span: 1 | 2;
  note: Record<Lang, string>;
};

const TEAL   = '#3DCFB6';
const PEACH  = '#FFB27A';
const LILAC  = '#B8A4FF';
const YELLOW = '#F4E06D';
const PINK   = '#FF6D8A';
const SKY    = '#6EB3FF';

export const skills: Skill[] = [
  { label: 'HTML',       icon: '/assets/skills/html.png',       years: 2, level: 85, color: PEACH,  span: 1, note: { de: 'Semantisch, zugänglich, solide.',       en: 'Semantic, accessible, solid.' } },
  { label: 'CSS',        icon: '/assets/skills/css.png',        years: 2, level: 82, color: SKY,    span: 1, note: { de: 'Grid, Flex, Animationen.',              en: 'Grid, flex, animations.' } },
  { label: 'JavaScript', icon: '/assets/skills/javascript.png', years: 2, level: 80, color: YELLOW, span: 2, note: { de: 'Mein tägliches Brot seit 2 Jahren.',    en: 'My daily bread for 2 years.' } },
  { label: 'TypeScript', icon: '/assets/skills/typescript.png', years: 1, level: 70, color: SKY,    span: 1, note: { de: 'Typsicher und aufgeräumt.',             en: 'Type-safe and tidy.' } },
  { label: 'Angular',    icon: '/assets/skills/angular.png',    years: 1, level: 75, color: PINK,   span: 2, note: { de: 'Meine Haupt-Waffe bei großen Apps.',    en: 'My main weapon on big apps.' } },
  { label: 'React',      icon: '/assets/skills/react.png',      years: 1, level: 65, color: TEAL,   span: 1, note: { de: 'Für alles Schnelle und Spielerische.',  en: 'For everything fast and playful.' } },
  { label: 'Firebase',   icon: '/assets/skills/firebase.png',   years: 1, level: 60, color: YELLOW, span: 1, note: { de: 'Auth, Firestore, Hosting.',             en: 'Auth, Firestore, hosting.' } },
  { label: 'Git',        icon: '/assets/skills/git.png',        years: 2, level: 75, color: PEACH,  span: 1, note: { de: 'Saubere Commits, klare Branches.',      en: 'Clean commits, clear branches.' } },
  { label: 'REST-API',   icon: '/assets/skills/api.png',        years: 1, level: 65, color: LILAC,  span: 1, note: { de: 'Clean fetch, clean errors.',            en: 'Clean fetch, clean errors.' } },
  { label: 'Scrum',      icon: '/assets/skills/scrum.png',      years: 1, level: 60, color: LILAC,  span: 1, note: { de: 'Stand-ups, Sprints, Retros.',           en: 'Stand-ups, sprints, retros.' } },
  { label: 'n8n',        icon: null,                             years: 1, level: 55, color: PINK,   span: 1, note: { de: 'Automation-Flows.',                     en: 'Automation flows.' } },
  { label: 'Docker',     icon: null,                             years: 1, level: 50, color: SKY,    span: 1, note: { de: 'Lokale Dev-Umgebungen.',                en: 'Local dev environments.' } },
  { label: 'Figma',      icon: null,                             years: 2, level: 70, color: LILAC,  span: 1, note: { de: 'Design → Code Handoff.',                en: 'Design → code handoff.' } },
];

export const growthSkill = {
  label: 'Growth',
  title: 'Python · Django',
};
