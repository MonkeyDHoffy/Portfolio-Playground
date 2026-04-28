import type { Lang } from '../i18n/translations';

export type Voice = {
  id: string;
  sender: string;
  handle: string;
  avatar: { initials: string; color: string; image?: string };
  profileUrl?: string;
  when: Record<Lang, string>;
  text: Record<Lang, string>;
  likes: number;
  reposts: number;
  replies: number;
};

export const voices: Voice[] = [
  {
    id: 'copilot',
    avatar: { initials: 'GC', color: '#6EB3FF', image: '/assets/voices/copilot.png' },
    sender: 'GitHub Copilot',
    handle: '@copilot',
    when: { de: 'vor 2h', en: '2h' },
    text: {
      de: 'Klarer Code, gute Tests und sinnvolle Komponenten. Jannik Hoffs Frontend-Workflows sind effizient und professionell.',
      en: "Clear code, solid tests, and well-structured components. Jannik's frontend workflows are efficient and professional.",
    },
    likes: 142, reposts: 28, replies: 7,
  },
  {
    id: 'alex',
    sender: 'Alexander Schulz',
    handle: '@alex_s',
    avatar: { initials: 'AS', color: '#FFB27A', image: '/assets/voices/schulz.jpg' },
    profileUrl: 'https://www.linkedin.com/in/alexander-schulz-aa012a209/',
    when: { de: 'gestern', en: 'yesterday' },
    text: {
      de: 'Zuverlässig, performant und gut gepflegt. Jannik hält sein Dev-Setup schlank und sorgt für reibungslose Workflows.',
      en: 'Reliable, performant, and well maintained. Jannik keeps his dev setup lean and ensures smooth workflows.',
    },
    likes: 58, reposts: 9, replies: 12,
  },
  {
    id: 'gpt',
    sender: 'Till Ganster',
    handle: '@tillganster',
    avatar: { initials: 'TG', color: '#3DCFB6', image: '/assets/voices/till.jpg' },
    profileUrl: 'https://www.linkedin.com/in/till-ganster-179854197/',
    when: { de: 'vor 4h', en: '4h' },
    text: {
      de: 'Strukturiert, präzise und lösungsorientiert. Jannik kombiniert saubere Architektur mit solider UX.',
      en: 'Structured, precise, solution-oriented. Jannik combines clean architecture with solid UX.',
    },
    likes: 203, reposts: 44, replies: 15,
  },
  {
    id: 'nico',
    sender: 'Nicolas Tran',
    handle: '@nico_t',
    avatar: { initials: 'NT', color: '#B8A4FF', image: '/assets/voices/tran.jpg' },
    profileUrl: 'https://www.linkedin.com/in/lenitran/',
    when: { de: 'vor 3 Tagen', en: '3d' },
    text: {
      de: 'Jannik kombiniert eine steile Lernkurve mit beneidenswerter Zielstrebigkeit. Er wartet nicht auf Lösungen, er erarbeitet sie sich.',
      en: 'Jannik combines a steep learning curve with admirable determination. He never waits for solutions — he creates them.',
    },
    likes: 87, reposts: 14, replies: 6,
  },
  {
    id: 'vscode',
    sender: 'Claude Code',
    handle: '@claudecode',
    avatar: { initials: 'CC', color: '#F4E06D' },
    when: { de: 'vor 1h', en: '1h' },
    text: {
      de: 'Produktiv, fokussiert und schnell. Er nutzt das Tooling sinnvoll und hält das Projekt sauber.',
      en: 'Productive, focused, fast. He uses the tooling effectively and keeps the project clean.',
    },
    likes: 176, reposts: 33, replies: 4,
  },
];
