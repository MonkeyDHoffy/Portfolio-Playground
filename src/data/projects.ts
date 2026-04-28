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
  live?: string;
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
    stack: ['React', 'TypeScript', 'Tailwind', 'React Router'],
    image: '/assets/projects/bubble.png',
    live: 'https://pokedex.hoffja.de',
    github: 'https://github.com/MonkeyDHoffy/Pok-dex',
  },
  {
    key: 'github-profile',
    index: '04',
    title: 'GitHub Repository',
    year: '2026',
    tag: {
      de: 'Viele Projekte und laufend neue Updates',
      en: 'Many projects with frequent new updates',
    },
    description: {
      de: 'Hier findest du eine Übersicht meiner Repositories mit unterschiedlichen Projekten. Ich erweitere mein GitHub-Profil laufend um neue Arbeiten und Verbesserungen.',
      en: 'This profile gives an overview of my repositories across different project types. I continuously add new work and improvements to keep it growing.',
    },
    stack: ['GitHub', 'Open Source', 'TypeScript'],
    image: '/assets/projects/gitprofile.png',
    github: 'https://github.com/MonkeyDHoffy',
  },
  {
    key: 'old-portfolio',
    index: '05',
    title: 'Altes Portfolio',
    year: '2023',
    tag: {
      de: 'Portfolio in Angular und React',
      en: 'Portfolio built in Angular and React',
    },
    description: {
      de: 'Ein früheres Portfolio-Projekt, das ich in zwei Varianten umgesetzt habe: einmal mit Angular und einmal mit React. Die Live-Demo zeigt die Angular-Version.',
      en: 'An earlier portfolio project that I built in two versions: one with Angular and one with React. The live demo currently shows the Angular version.',
    },
    stack: ['Angular', 'React', 'TypeScript', 'SCSS'],
    image: '/assets/projects/oldportfolio.png',
    live: 'https://angular.hoffja.de',
    github: 'https://github.com/MonkeyDHoffy',
  },
  {
    key: 'pollapp',
    index: '06',
    title: 'PollApp',
    year: '2026',
    tag: {
      de: 'Web-App für Umfragen und Sharing',
      en: 'Web app for creating and sharing polls',
    },
    description: {
      de: 'Webanwendung zum Erstellen und Teilen von Umfragen. Hauptsächlich entwickelt mit TypeScript, Angular und Supabase.',
      en: 'Web application for creating and sharing polls. Primarily built with TypeScript, Angular, and Supabase.',
    },
    stack: ['TypeScript', 'Angular', 'Supabase'],
    image: '/assets/projects/pollapp.png',
    live: 'https://pollapp.hoffja.de',
    github: 'https://github.com/MonkeyDHoffy/PollApp',
  },
  {
    key: 'memory',
    index: '07',
    title: 'Memory',
    year: '2024',
    tag: {
      de: 'Memory-Spiel als Webanwendung',
      en: 'Memory game as a web application',
    },
    description: {
      de: 'Interaktive Memory-Webanwendung mit Angular. Fokus auf sauberes State-Handling, Spiel-Logik und eine schnelle, responsive User Experience.',
      en: 'Interactive memory web app built with Angular. Focused on clean state handling, game logic, and a fast responsive user experience.',
    },
    stack: ['Angular', 'TypeScript', 'SCSS'],
    image: '/assets/projects/memory.png',
    live: 'https://memory.hoffja.de',
    github: 'https://github.com/MonkeyDHoffy/Memory-with-angular',
  },
  {
    key: 'misc-lab',
    index: '08',
    title: 'Specials',
    year: '2026',
    tag: {
      de: 'Specials',
      en: 'Specials',
    },
    description: {
      de: 'Ich tüftel oft an privaten Projekten und experimentiere aktuell mit React-Native-Apps, zum Beispiel einem Habit-Tracker-Game und einer Bewerbungsapp. Außerdem habe ich bereits das Backend für meinen eigenen Server mit Docker-Containern aufgebaut, über den ich meine Websites verwalte. Hier entstehen oft neue Projekte, bevor sie offiziell live gehen. Wenn du sehen willst, woran ich gerade arbeite, schau am besten regelmäßig in mein GitHub-Repository.',
      en: 'I often tinker with private projects and I am currently building React Native apps, including a habit tracker game and a job application app. I also built the backend for my own server using Docker containers to manage and host my websites. New projects often start here before they officially go live. If you want to see what I am currently working on, the best place to check is my GitHub repository.',
    },
    stack: ['React Native', 'TypeScript', 'Docker', 'Backend'],
    image: '/assets/aboutme/thedeveloper.jpg',
    github: 'https://github.com/MonkeyDHoffy',
  },
];
