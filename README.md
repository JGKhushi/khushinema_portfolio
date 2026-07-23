# Khushi Nema — Portfolio

A production-grade personal portfolio built as a full-stack application, not just a static page. The site demonstrates the exact stack it describes: a React + TypeScript front-end, an authenticated Node/Express REST API, and MongoDB — with an admin dashboard behind a login for managing content and contact messages.

**Live:** _add your deployed URL here_

---

## Highlights

- **Full-stack, not static** — content is served from a database via a single `/api/v1/overview` endpoint, with a bundled snapshot fallback so the site renders instantly even if the API is asleep.
- **Admin dashboard** (`/admin`) — JWT-authenticated area to read contact-form submissions and edit every content collection live (profile, projects, experience, skills, education, achievements).
- **Design** — dark, motion-rich UI with Framer Motion, a spotlight/aurora system, scroll-driven reveals and a fully responsive layout.
- **Resilient** — graceful API fallback, defensive rendering, rate limiting, Helmet, CORS, and a spam-honeypot on the contact form.

## Tech stack

| Layer | Tech |
|-------|------|
| Front-end | React 18, TypeScript, Vite, Tailwind CSS, Framer Motion, Lucide |
| Back-end | Node.js, Express, MongoDB, Mongoose, JWT, Zod |
| Tooling | ESLint, Playwright (backend project tests), Postman |

## Project structure

```
portfolio/
├── frontend/   # React + Vite single-page app (public site + /admin dashboard)
└── backend/    # Express REST API + MongoDB models, auth, seed
```

## Getting started

### 1. Backend

```bash
cd backend
cp .env.example .env          # fill in MONGO_URI, JWT_SECRET, admin credentials
npm install
npm run seed:fresh            # seeds content + creates the admin user
npm run dev                   # API on http://localhost:5000
```

### 2. Front-end

```bash
cd frontend
npm install
npm run dev                   # site on http://localhost:5173
```

The dev server proxies `/api` to the backend, so no CORS setup is needed locally.

### Admin dashboard

Visit `http://localhost:5173/admin` and sign in with the admin credentials from `backend/.env`.

## Deployment

- **Front-end** → Vercel / Netlify (static build: `npm run build`)
- **Back-end** → Render / Railway
- **Database** → MongoDB Atlas (free M0)

Set `VITE_API_BASE` on the front-end to the deployed API URL, and configure `CORS_ORIGINS` on the backend to the deployed site.

---

Built by **Khushi Nema** · [GitHub](https://github.com/JGKhushi) · [LinkedIn](https://linkedin.com/in/jgkhushi-nema)
