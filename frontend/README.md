# Khushi Nema — Portfolio (Frontend)

A world-class, single-page portfolio built with **React + TypeScript + Vite + Tailwind CSS + Framer Motion**. It consumes the Express/MongoDB API in [`../backend`](../backend) via a single `/api/v1/overview` request, and falls back to a bundled content snapshot so it renders instantly even when the backend is offline.

## Highlights

- **Progressive data loading** — renders from a bundled snapshot immediately, then swaps in live API data with no layout shift.
- **Motion & polish** — animated aurora background, scroll progress bar, pointer glow, staggered scroll reveals, magnetic nav pill, spotlight cards.
- **Sections** — Hero (rotating roles, live terminal, stat grid), About, Experience timeline (with product workstreams), filterable Projects grid + detail modals, rated Skills, Education & Achievements, working Contact form (posts to the API, gracefully falls back to `mailto:`).
- **Production-ready** — strict TypeScript, responsive down to mobile, SEO + Open Graph meta, accessible (keyboard, reduced-motion, ARIA), custom favicon & OG image.

## Run locally

```bash
npm install
npm run dev        # http://localhost:5173  (proxies /api → http://localhost:5000)
```

Start the backend in another terminal (see `../backend/README` — `npm run seed:fresh && npm run dev`) to see live data. Without it, the bundled snapshot is used automatically.

## Build & preview

```bash
npm run build      # type-checks then bundles to dist/
npm run preview    # serve the production build
```

## Configuration

- `VITE_API_BASE` — API base URL (default `/api/v1`). In dev, Vite proxies `/api` to `localhost:5000`; in production point this at your deployed backend. See `.env.example`.

## Structure

```
src/
├─ components/   Reusable UI: Navigation, Background, Reveal, SpotlightCard, ProjectModal, …
├─ sections/     Page sections: Hero, About, Experience, Projects, Skills, Education, Contact, Footer
├─ hooks/        useOverview (data), useActiveSection (scroll spy)
├─ lib/          types, api client, icon map
├─ data/         fallback.ts — bundled content snapshot (mirrors backend seed)
└─ styles/       Tailwind + global CSS
```

## Editing content

The live site reads from the backend, so update [`../backend/src/seed/data.js`](../backend/src/seed/data.js) and re-seed. Keep [`src/data/fallback.ts`](src/data/fallback.ts) in sync so the offline snapshot stays accurate.
