# STEMEOC Website

Rebuild of the STEM Education Organization of Cambodia website: Next.js (App Router) + PostgreSQL (via Prisma) + Redis (caching & rate limiting), with a custom admin dashboard for managing site content.

## Stack

- **Next.js 16** (App Router, React 19, TypeScript)
- **Tailwind CSS v4**
- **PostgreSQL** via **Prisma ORM**
- **Redis** (`ioredis`) for read caching and rate limiting
- **Auth.js (NextAuth v5)** for admin authentication
- **Zod** for input validation

## Getting Started (local dev)

1. Copy the env file and adjust if needed:
   ```bash
   cp .env.example .env
   ```
2. Start Postgres + Redis:
   ```bash
   docker compose up -d
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Run migrations and seed sample data (including a first admin login):
   ```bash
   npx prisma migrate dev
   npx prisma db seed
   ```
5. Start the dev server:
   ```bash
   npm run dev
   ```
   Visit http://localhost:3000 for the public site and http://localhost:3000/admin for the admin dashboard (seeded credentials are printed by the seed script).

## Useful commands

- `npx prisma studio` — browse/edit the database with a GUI
- `npx prisma migrate dev` — create/apply a migration after editing `prisma/schema.prisma`
- `docker compose down` — stop Postgres/Redis (add `-v` to also wipe volumes/data)
- `npm run build` — production build

## Project layout

```
app/(public)   Public-facing site (home, about, projects, news, contact)
app/admin      Authenticated admin dashboard (CRUD for content)
app/api        Route handlers (auth, contact form)
lib/           Prisma client, Redis client, cache helper, rate limiter, auth config
prisma/        Schema, migrations, seed script
```
