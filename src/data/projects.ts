import type { Lang } from '../i18n/translations';

export type Project = {
  key: string;
  index: string;
  title: string;
  year: string;
  tag: Record<Lang, string>;
  description: Record<Lang, string>;
  stack: string[];
  image: string;
  live: string;
  github: string;
};

export const projects: Project[] = [
  {
    key: 'join',
    index: '01',
    title: 'Join',
    year: '2024',
    tag: { de: 'Kanban Task Manager', en: 'Kanban Task Manager' },
    description: {
      de: 'Task-Manager, inspiriert vom Kanban-System. Erstelle und organisiere Aufgaben per Drag-and-Drop und weise Benutzer sowie Kategorien zu.',
      en: 'Task manager inspired by Kanban. Create and organize tasks via drag-and-drop, assign users and categories.',
    },
    stack: ['Angular', 'TypeScript', 'HTML', 'CSS', 'Firebase'],
    image: '/assets/projects/join.png',
    live: 'https://join.hoffja.de',
    github: 'https://github.com/MonkeyDHoffy/Join-a-project-management-tool',
  },
  {
    key: 'pollo',
    index: '02',
    title: 'El Pollo Loco',
    year: '2024',
    tag: { de: 'Jump & Run Browser-Spiel', en: 'Jump & Run Browser Game' },
    description: {
      de: 'Jump-, Run- und Throw-Spiel auf objektorientierter Basis. Hilf Pepe, Münzen und Tabasco zu finden, um gegen die verrückte Henne zu kämpfen.',
      en: 'Object-oriented jump, run and throw game. Help Pepe collect coins and Tabasco to fight the crazy hen.',
    },
    stack: ['HTML', 'CSS', 'JavaScript'],
    image: '/assets/projects/pollo.png',
    live: 'https://pollo.hoffja.de',
    github: 'https://github.com/MonkeyDHoffy/El-Pollo-Loco',
  },
  {
    key: 'bubble',
    index: '03',
    title: 'Pokédex',
    year: '2025',
    tag: { de: 'React SPA mit PokéAPI', en: 'React SPA with PokéAPI' },
    description: {
      de: 'Single-Page-App mit React, React Router und Tailwind. Lädt PokéAPI-Daten dynamisch, cached sie und stellt gefilterte Views bereit.',
      en: 'Single-page app built with React, React Router, and Tailwind. Consumes PokéAPI, caches responses, renders filterable data views.',
    },
    stack: ['JavaScript', 'HTML', 'CSS'],
    image: '/assets/projects/bubble.png',
    live: 'https://pokedex.hoffja.de',
    github: 'https://github.com/MonkeyDHoffy/Pok-dex',
  },
];
