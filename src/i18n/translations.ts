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
    status:      { de: 'Offen für Arbeit', en: 'Open to work' },
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
    flipCard: { de: 'Porträt umdrehen', en: 'Flip portrait' },
    stickerA: { de: 'DEVELOPER', en: 'DEVELOPER' },
    stickerB: { de: '2026',     en: '2026' },
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
    learningBack:  {
      de: 'Ich arbeite mich schnell und strukturiert in neue Themen ein und lerne gezielt die Technologien, die für Ihr Team relevant sind.',
      en: 'I ramp up quickly in new domains and intentionally learn the technologies that matter for your team.',
    },
  },

  projects: {
    label: { de: 'Portfolio', en: 'Portfolio' },
    index: { de: '03', en: '03' },
    titleA: { de: 'Meine', en: 'My' },
    titleB: { de: 'Projekte', en: 'projects' },
    intro: {
      de: 'Hier findest du eine Auswahl meiner Arbeiten. Ich habe Spaß daran, ständig Neues auszuprobieren und an verschiedenen Projekten zu arbeiten. Die aktuellste Übersicht findest du immer auf meinem GitHub.',
      en: 'Here is a selection of my work. I enjoy constantly trying new things and building different projects. You will always find the most up-to-date overview on my GitHub.',
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
    demo: { de: 'Demo-Voices', en: 'Demo voices' },
    reply: { de: 'Antworten', en: 'Reply' },
    repost: { de: 'Teilen', en: 'Repost' },
    like:   { de: 'Gefällt mir', en: 'Like' },
    leverLabel: { de: 'Carousel-Hebel', en: 'Carousel lever' },
    leverReverse: { de: 'Links', en: 'Left' },
    leverStop: { de: 'Stopp', en: 'Stop' },
    leverForward: { de: 'Rechts', en: 'Right' },
    leverHint: { de: 'Nach links für rückwärts, mittig zum Stoppen, nach rechts für mehr Zug.', en: 'Left for reverse, center to stop, right for more pull.' },
    leverStopAction: { de: 'Anhalten', en: 'Stop' },
  },

  runner: {
    hint:     { de: 'Pause zum Spielen — Space, Klick oder Tap zum Flattern', en: 'Pause to play — Space, click, or tap to flap' },
    totalPointsEarned: { de: 'total points earned:', en: 'total points earned:' },
    distanceHighscore: { de: 'distance highscore:', en: 'distance highscore:' },
    distance: { de: 'DISTANZ', en: 'DISTANCE' },
    points:   { de: 'POINTS', en: 'POINTS' },
    score:    { de: 'SCORE', en: 'SCORE' },
    best:     { de: 'BEST',  en: 'BEST' },
    restart:  { de: 'Noch mal?', en: 'Try again?' },
    gameOver: { de: 'GAME OVER', en: 'GAME OVER' },
    ready:    { de: 'Klick zum Starten', en: 'Click to start' },
    actionStart:   { de: 'Spiel starten', en: 'Start run' },
    actionJump:    { de: 'Jump', en: 'Jump' },
    actionRestart: { de: 'Restart', en: 'Restart' },
  },

  contact: {
    label: { de: 'Kontaktiere mich', en: 'Contact me' },
    index: { de: '05', en: '05' },
    titleA: { de: "Lass uns", en: "Let's" },
    titleB: { de: 'zusammenarbeiten', en: 'work together' },
    blurb: {
      de: 'Erzähl mir kurz von deinem Projekt, deinem Team oder der Rolle. Ich arbeite mich schnell in neue Themen ein, denke pragmatisch mit und freue mich darauf, mich in einem starken Team weiterzuentwickeln.',
      en: 'Tell me a bit about your project, team, or role. I ramp up quickly in new areas, think pragmatically, and look forward to growing within a strong team.',
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

  popup: {
    cancel:       { de: 'Abbrechen',   en: 'Cancel' },
    cvTitle:      { de: 'CV herunterladen', en: 'Download CV' },
    cvMessage:    { de: 'Möchtest du meinen Lebenslauf als PDF herunterladen?', en: 'Would you like to download my CV as a PDF?' },
    cvConfirm:    { de: 'Herunterladen ↓', en: 'Download ↓' },
    liTitle:      { de: 'LinkedIn öffnen', en: 'Open LinkedIn' },
    liConfirmBtn: { de: 'Profil öffnen →', en: 'Open profile →' },
  },

  footer: {
    copyright: { de: '© Jannik Hoff 2026', en: '© Jannik Hoff 2026' },
    made:      { de: 'Saarlouis', en: 'Saarlouis' },
  },
} satisfies Record<string, Record<string, Str | Record<string, Str>>>;

export type TranslationKey = string;
