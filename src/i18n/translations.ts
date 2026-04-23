export type Lang = 'de' | 'en';

type Str = Record<Lang, string>;

export const translations = {
  nav: {
    about:    { de: 'Über mich',  en: 'About me' },
    skills:   { de: 'Fähigkeiten', en: 'Skills' },
    projects: { de: 'Projekte',   en: 'Projects' },
    contact:  { de: 'Kontakt',    en: 'Contact' },
  },

  hero: {
    status:      { de: 'Offen für neue Rollen', en: 'Open to roles' },
    title1:      { de: 'Software mit', en: 'Software with' },
    titleAccent: { de: 'good vibes', en: 'good vibes' },
    titleEnd:    { de: '.', en: '.' },
    blurb: {
      de: 'Jannik Hoff — Entwickler aus Saarlouis. Web, Apps und alles dazwischen — mit der festen Überzeugung, dass gute Interfaces sich gut anfühlen müssen.',
      en: 'Jannik Hoff — developer based in Saarlouis. Web, apps, and everything in between — with a stubborn belief that good interfaces should feel good too.',
    },
    workCta:    { de: 'Meine Projekte', en: 'Check my work' },
    contactCta: { de: 'Kontaktier mich', en: 'Contact Me' },
    tickerA:    { de: 'Verfügbar für Remote-Arbeit', en: 'Available for remote work' },
    tickerB:    { de: 'Softwareentwickler', en: 'Software Developer' },
    tickerC:    { de: 'Ansässig in Saarlouis', en: 'Based in Saarlouis' },
  },

  about: {
    label: { de: 'Wer ich bin', en: 'Who I Am' },
    index: { de: '01', en: '01' },
    title: { de: 'Hey, ich bin Jannik.', en: "Hey, I'm Jannik." },
    p1: {
      de: 'Hey, ich bin Jannik – leidenschaftlicher Softwareentwickler mit starkem Interesse an modernen Frontend- und Backend-Technologien. Mich motiviert, reale, funktionale Projekte von Grund auf zu bauen und sie kontinuierlich zu verbessern – Ideen in laufende Anwendungen zu verwandeln treibt mich an.',
      en: "Hey, I'm Jannik — a passionate software developer with a strong interest in modern frontend and backend technologies. Building real, functional projects from scratch and improving them continuously motivates me to turn ideas into working applications.",
    },
    location: {
      de: 'Ansässig in Deutschland; offen für Remote-Arbeit und bei der passenden Gelegenheit auch für einen Umzug.',
      en: 'Based in Germany; open to remote work and relocation for the right opportunity.',
    },
    cognition: {
      de: 'Offen und lernbereit: Ich probiere neue Tools aus und sehe Lernen als festen Bestandteil meiner Entwicklung.',
      en: 'Open-minded and eager to learn: I explore new tools and treat continuous learning as core to my growth.',
    },
    releases: {
      de: 'Ich baue aktiv an eigenen Projekten, erkunde neue Werkzeuge und erweitere mein Portfolio laufend.',
      en: 'I actively work on personal projects, explore new tools, and keep expanding my portfolio.',
    },
    stickerA: { de: 'JUNIOR', en: 'JUNIOR' },
    stickerB: { de: 'DEV',    en: 'DEV' },
    stickerC: { de: '2026',   en: '2026' },
  },

  skills: {
    label: { de: 'Technologien', en: 'Technologies' },
    index: { de: '02', en: '02' },
    titleA: { de: 'Mein', en: 'My' },
    titleB: { de: 'Werkzeugkasten', en: 'toolkit' },
    intro: {
      de: 'Hands-on Erfahrung mit modernen Webtechnologien. Ich baue interaktive, responsive UIs und verbinde sie mit klarer Logik.',
      en: 'Hands-on experience with modern web technologies. I build interactive, responsive UIs and connect them with clean logic.',
    },
    hoverTip: { de: 'Hover zum Umdrehen.', en: 'Hover to flip.' },
    learningLabel: { de: 'LERNE GERADE', en: 'CURRENTLY LEARNING' },
    learningSub:   { de: 'Es gibt immer was Neues zu lernen.', en: 'Always something new to learn.' },
  },

  projects: {
    label: { de: 'Portfolio', en: 'Portfolio' },
    index: { de: '03', en: '03' },
    titleA: { de: 'Sachen die ich', en: "Things I've" },
    titleB: { de: 'gebaut habe', en: 'built' },
    intro: {
      de: 'Hier findest du eine Auswahl meiner Arbeiten – interagiere mit den Projekten, um meine Skills im Einsatz zu sehen.',
      en: 'Explore a selection of my work — interact with projects to see my skills in action.',
    },
    clickHint: { de: 'Klick eine Karte zum Umdrehen.', en: 'Click a card to flip.' },
    flip:      { de: 'UMDREHEN', en: 'FLIP' },
    liveDemo:  { de: 'Live Demo', en: 'Live Demo' },
    prev:      { de: 'Vorheriges', en: 'Previous' },
    next:      { de: 'Nächstes',   en: 'Next' },
  },

  voices: {
    label: { de: 'stimmen', en: 'voices' },
    index: { de: '04', en: '04' },
    title: { de: 'Was andere sagen.', en: 'What others say.' },
    reply: { de: 'Antworten', en: 'Reply' },
    repost: { de: 'Teilen', en: 'Repost' },
    like:   { de: 'Gefällt mir', en: 'Like' },
  },

  runner: {
    hint:     { de: 'Pause zum Spielen — Space oder Klick zum Springen', en: 'Pause to play — Space or click to jump' },
    score:    { de: 'SCORE', en: 'SCORE' },
    best:     { de: 'BEST',  en: 'BEST' },
    restart:  { de: 'Noch mal?', en: 'Try again?' },
    gameOver: { de: 'GAME OVER', en: 'GAME OVER' },
    ready:    { de: 'Klick zum Starten', en: 'Click to start' },
  },

  contact: {
    label: { de: 'Kontaktiere mich', en: 'Contact me' },
    index: { de: '05', en: '05' },
    titleA: { de: "Lass uns", en: "Let's" },
    titleB: { de: 'zusammenarbeiten', en: 'work together' },
    blurb: {
      de: 'Beschreibe kurz dein Projekt oder die Rolle. Ich bringe mich pragmatisch ein und liefere zuverlässig.',
      en: 'Describe your project or the role. I contribute pragmatically and deliver reliably.',
    },
    sayHello: { de: 'Sag Hallo →', en: 'Say Hello →' },
    form: {
      namePh:    { de: 'Dein Name', en: 'Your name' },
      emailPh:   { de: 'deine@email.de', en: 'you@email.com' },
      messagePh: { de: 'Hallo Jannik, ich interessiere mich für…', en: 'Hi Jannik, I’m interested in…' },
      submit:    { de: 'Sag Hallo :)', en: 'Say Hello :)' },
      sending:   { de: 'Wird gesendet…', en: 'Sending…' },
      success:   { de: 'Nachricht gesendet — ich melde mich innerhalb von 24 Stunden.', en: "Message sent — I'll reply within 24 hours." },
      error:     { de: 'Hmm, da ist was schiefgelaufen. Versuch es gleich nochmal oder schreib mir direkt per Mail.', en: 'Hmm, something went wrong. Please try again shortly or email me directly.' },
      statusOk:  { de: 'Nachricht gesendet', en: 'Message sent' },
      statusErr: { de: 'Etwas ging schief', en: 'Something went wrong' },
      dismiss:   { de: 'Schließen', en: 'Dismiss' },
    },
  },

  footer: {
    copyright: { de: '© Jannik Hoff 2026', en: '© Jannik Hoff 2026' },
    made:      { de: 'Saarlouis', en: 'Saarlouis' },
  },
} satisfies Record<string, Record<string, Str | Record<string, Str>>>;

export type TranslationKey = string;
