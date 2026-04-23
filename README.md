# Portfolioplayground — Jannik Hoff

Personal portfolio site. **Vite + React 18 + TypeScript**, zero runtime dependencies beyond React.

Design direction — **"C Playground"**: dark canvas (`#0F0F0F`), teal / peach / lilac / yellow accents, Karla + Fira Code, sticker-style buttons with hard black shadows, a teal spotlight cursor, physics-driven orbs in the hero, a flippable bento grid of skills, a 3D carousel of projects, a social-feed of voices, and a mini parallax jump-runner game.

---

## Quick start

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # typecheck + production build → dist/
npm run preview  # preview the production build
```

Requires Node 18+ (Node 20+ recommended).

---

## Tech stack

| Concern      | Tool                                                                                           |
| ------------ | ---------------------------------------------------------------------------------------------- |
| Build        | Vite 5                                                                                         |
| UI           | React 18 + TypeScript (strict)                                                                 |
| Styling      | Inline styles + CSS variables (token-driven) — no CSS framework, no runtime CSS-in-JS          |
| i18n         | Custom context (`src/i18n/`) — DE / EN, persisted to `localStorage`, overridable via `?lang=`  |
| Contact form | `POST https://api.hoffja.de/api/send-mail` (existing FastAPI deployment)                       |
| Fonts        | Karla + Fira Code — Google Fonts, preconnected                                                 |

No Tailwind, no UI kit, no animation library — every effect is hand-written to keep the bundle small.

---

## Project structure

```
src/
├── main.tsx                    # entry, mounts <App/>
├── App.tsx                     # composes layout + sections
├── styles/
│   ├── tokens.css              # color / type / spacing / radius tokens
│   └── global.css              # resets, keyframes, scroll-reveal base
├── hooks/
│   └── useAnim.ts              # useMousePos, useInViewOnce, useAutoScrollReveal
├── i18n/
│   ├── translations.ts         # DE/EN strings
│   └── LanguageContext.tsx     # useLang(), toggle, persistence
├── data/
│   ├── projects.ts             # Join · El Pollo Loco · Pokédex
│   ├── skills.ts               # bento skill list + growth tile
│   └── voices.ts               # social-feed testimonials
└── components/
    ├── layout/
    │   ├── Header.tsx          # sticky pill nav + GitHub + LinkedIn + lang toggle
    │   ├── Footer.tsx
    │   └── LangToggle.tsx      # DE ⇄ EN pill switch
    ├── fx/
    │   ├── GradientBlobs.tsx   # fixed blurred color blobs
    │   └── Spotlight.tsx       # teal cursor follower (fine-pointer only)
    ├── ui/
    │   └── SectionLabel.tsx    # "01 · WHO I AM" pill
    └── sections/
        ├── Hero.tsx            # 12 floating orbs + "good vibes" headline
        ├── Ticker.tsx          # rotating teal marquee band
        ├── About.tsx           # polaroid + JUNIOR-DEV-2026 sticker + info cards
        ├── Skills.tsx          # bento flip tiles + growth tile
        ├── Projects.tsx        # 3D carousel + flip cards + prev/next + dots
        ├── Voices.tsx          # Twitter-style feed (like / repost / reply)
        ├── Runner.tsx          # endless-runner mini game (parallax + coins + particles + best score)
        └── Contact.tsx         # form + honeypot + toast
```

Each section keeps its visuals local (inline `style` + occasional scoped `<style>` block for media queries and keyframes) so a single file tells the whole story of a section.

---

## Before launching

1. **`public/og-image.png`** — OpenGraph preview, 1200×630. Referenced from `index.html`.
2. **Testimonials** — `src/data/voices.ts` ships with playful placeholders (GitHub Copilot, ChatGPT, Visual Studio Code, colleagues). Replace with real quotes when you have them, or keep the joke.
3. **Email address** — `hoffjannik95@gmail.com` appears in `Contact.tsx` and in the JSON-LD schema in `index.html`. Update if it changes.

---

## Customization

- **Palette:** `src/styles/tokens.css`. Teal / peach / lilac / yellow / pink / sky are defined once and reused everywhere.
- **Fonts:** loaded in `index.html`. Swap the Google Fonts URL, then update `--ff-sans` / `--ff-mono` in `tokens.css`.
- **Language default:** `detectInitialLang()` in `src/i18n/LanguageContext.tsx`. Order: URL `?lang=`, localStorage, browser `navigator.language`, then fallback `de`.
- **API endpoint:** `API_ENDPOINT` constant at the top of `src/components/sections/Contact.tsx`.
- **High-score key:** Runner persists its best score under `jh.runner.best` in localStorage.

---

## Accessibility & motion

- `:focus-visible` outlines on every interactive element (see `global.css`).
- Lang toggle writes `document.documentElement.lang` on change.
- Spotlight cursor + background blobs are `aria-hidden`.
- Contact form has associated placeholders, a honeypot field, and an `aria-live` toast.
- `prefers-reduced-motion` globally shortens animations to 0.01ms (see `global.css`) and the Spotlight still renders but won't tween.
- Runner is fully keyboard-accessible: Space / ↑ / W to jump and start, Enter to restart after Game Over.

---

## Deploying

Output lands in `dist/`. Any static host works:

- **Netlify / Vercel / Cloudflare Pages** — point to the repo, build command `npm run build`, publish directory `dist`.
- **Self-hosted** — `npm run build` then serve `dist/` behind nginx / Caddy. The contact form hits `api.hoffja.de` directly, so no backend proxy is required.
- **SPA routing** is not used — no rewrite rules needed.

---

## License

All content © Jannik Hoff. Code is MIT-style for reference / reuse; please ask before lifting the design system wholesale.
