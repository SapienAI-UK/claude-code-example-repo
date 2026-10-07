# Gapwatch

Live London line status and disruption trends. A Next.js app that polls the TfL Unified API every 2 minutes, stores snapshots in SQLite, and shows a live board and historical trends behind a simple two-role login.

## Stack

Next.js 16 (App Router, `src/proxy.ts`), TypeScript, React 19, plain CSS (`globals.css` + CSS modules), Drizzle ORM + better-sqlite3, Vitest.

## Commands

- `npm run dev`: dev server on http://localhost:3000 (also starts the poller)
- `npm test`: run Vitest once
- `npm run lint`: ESLint
- `npm run build`: production build (also type-checks)
- `npm run db:generate -- --name <change>`: create a migration after editing `src/db/schema.ts`
- `npm run db:migrate`: apply migrations to `data/gapwatch.db`

## Where things live

- `src/app/`: pages (`/`, `/trends`, `/admin`, `/login`) and API routes (`src/app/api/*/route.ts`)
- `src/lib/auth/`: sessions, credentials, `requireRole()` and `requirePageRole()`
- `src/lib/tfl/`: TfL client, response parsing, severity categories
- `src/lib/poller.ts` and `src/instrumentation.ts`: the 2-minute background poll
- `src/db/`: schema, connection and queries (has its own `AGENTS.md`)
- `src/proxy.ts`: redirects signed-out visitors to `/login`
- `specs/`: exercises written as specs. Work from these when asked to implement one.
- `docs/`: longer guides. Read them when the task needs them (see "Further reading").

## Environment

Every variable the app reads is documented in `.env.example`. Use it to learn variable names and meanings.

## Rules

- **Every API route handler calls `requireRole()`** with the minimum role it needs, before doing any work. Every page calls `requirePageRole()`. Don't rely on `src/proxy.ts` for authorisation.
- **Secrets stay on the server.** Never expose a secret through a `NEXT_PUBLIC_` variable, a client component, or an API response.
- **Done means green:** `npm test`, `npm run lint` and `npm run build` all pass.
- When implementing a spec, satisfy every acceptance criterion and tick the boxes in the spec file.
- Keep changes focused; don't refactor unrelated code.

## Web UI conventions

@docs/web-ui.md

## Further reading (open when relevant)

- [docs/database.md](docs/database.md): schema, migrations, query patterns, testing with an in-memory database
- [docs/tfl-api.md](docs/tfl-api.md): TfL endpoints, modes, severity codes, rate limits
