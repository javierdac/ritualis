# Ritualis

A system to facilitate **all Scrum ceremonies** (Daily, Planning, Review,
Retro, Refinement) with a library of dynamics, a facilitator mode with timer,
live shared sessions, and management of projects, teams, and people.

## Stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **MongoDB** + **Mongoose**
- **Auth.js v5** (credentials, open registration)
- **shadcn/ui** + Tailwind CSS v4 — light/dark theme
- **Zod** for validation

## Data model

```
User (login)
  ├── Projects
  ├── Teams         (M:N with projects)
  └── People        (M:N with teams)
         └── Notes  (per person)

Dynamics  → seed (17) + user-created, tagged by ceremony
Ceremonies → each one independent, with its own set of dynamics
Sessions  → live rooms shareable by code (/s/CODE)
```

## Getting started

Requires MongoDB running locally at `mongodb://127.0.0.1:27017`.

```bash
npm install
npm run seed     # loads the 17 base dynamics into Mongo
npm run dev      # http://localhost:3000
```

Copy `.env.example` to `.env.local` and fill in:

```
MONGODB_URI=mongodb://127.0.0.1:27017/ritualis
AUTH_SECRET=<generated with: openssl rand -base64 32>
AUTH_TRUST_HOST=true
```

### Test user

```
test@ritualis.dev / secret123
```

Or sign up for a new account at `/register`.

## Project structure

- `app/(auth)/` — login and registration
- `app/app/` — protected area (dashboard, ceremonies, dynamics, CRUD screens)
- `app/s/[code]/` — live session room, joinable by code
- `app/api/` — auth, dynamics, and live session endpoints
- `lib/models.ts` — Mongoose schemas
- `lib/data.ts` — reads (server components)
- `lib/actions/` — server actions (CRUD)
- `proxy.ts` — auth middleware protecting everything but static assets
- `scripts/seed.ts` — dynamics seed (`npm run seed`)

## Deployment

The app is deployed on Vercel: **https://ritualis.vercel.app**.

Required environment variables in production (Vercel → Settings →
Environment Variables, or `vercel env add`):

- `MONGODB_URI` — a production MongoDB connection string (e.g. MongoDB
  Atlas: `mongodb+srv://…`). Remember to allow Vercel's IPs or use
  `0.0.0.0/0` with strong credentials.
- `AUTH_SECRET` — generate a fresh one with `openssl rand -base64 32`
  (don't reuse the local one).
- `AUTH_TRUST_HOST=true`

After the first deploy, seed the base dynamics against the production
database: `MONGODB_URI=<prod-uri> npm run seed`.
