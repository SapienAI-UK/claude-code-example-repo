# Database guide

Gapwatch stores TfL status snapshots in a local SQLite file, `data/gapwatch.db` (gitignored). Access goes through [Drizzle ORM](https://orm.drizzle.team) with the `better-sqlite3` driver, which is synchronous: queries end in `.all()`, `.get()` or `.run()`.

## Files

| File | Purpose |
|------|---------|
| `src/db/config.ts` | Database path and migrations folder |
| `src/db/schema.ts` | Table definitions (source of truth for the schema) |
| `src/db/client.ts` | `getDb()` shared connection; `createDb(path)` for tests |
| `src/db/queries/status.ts` | Inserts, latest statuses, admin stats |
| `src/db/queries/trends.ts` | Aggregations for the trends page and `/api/history` |
| `drizzle/` | Generated SQL migrations. Never edit by hand |

## The `status_snapshots` table

One row per line per poll. The poller inserts a full set (about 19 lines for the default modes) every 2 minutes.

| Column | Type | Notes |
|--------|------|-------|
| `id` | integer | primary key |
| `line_id` | text | TfL line id, e.g. `central`, `elizabeth` |
| `line_name` | text | display name, e.g. `Elizabeth line` |
| `mode` | text | `tube`, `dlr`, `overground`, `elizabeth-line`, ... |
| `status_severity` | integer | TfL severity code (see [tfl-api.md](tfl-api.md)) |
| `status_description` | text | e.g. `Minor Delays` |
| `reason` | text, nullable | TfL's free-text explanation |
| `is_synthetic` | boolean (0/1) | `true` for generated demo data |
| `polled_at` | text | ISO-8601 UTC timestamp, e.g. `2026-10-06T08:14:00.000Z` |

"Share of samples disrupted" is used as a proxy for "share of time disrupted", which works because polling is regular.

## Synthetic (demo) data

Real history takes weeks to build up, so demo data may be generated (see `specs/01-demo-history.md`). Conventions:

- Every generated row sets `is_synthetic = true`.
- Generated rows mimic real polling: one row per line every 2 minutes, real line ids and names, and plausible severities and reasons.
- Live views (`getLatestStatuses`, "last poll" in admin) **exclude** synthetic rows. Trends **include** them.
- Clearing demo data deletes `WHERE is_synthetic = 1` only, never real rows.
- Insert in batches inside a transaction; 90 days of data is roughly 1.2 million rows.

## Writing queries

Prefer the query builder:

```ts
db.select().from(statusSnapshots).where(eq(statusSnapshots.lineId, lineId)).all();
```

For aggregations, use the `sql` tagged template. Interpolated values become bound parameters:

```ts
db.all(sql`SELECT COUNT(*) AS n FROM status_snapshots WHERE line_id = ${lineId}`);
```

Compose fragments with `sql` too (`sql.join`, nested `sql` templates). `sql.raw()` inserts text **unescaped**. Use it only for trusted constants written in code, and never with anything derived from a request.

Every query function takes `db: Db = getDb()` as its last parameter so tests can inject a database.

## Migrations

1. Edit `src/db/schema.ts`.
2. `npm run db:generate -- --name short_description` writes a new SQL file to `drizzle/`.
3. Review the generated SQL.
4. `npm run db:migrate` applies it to `data/gapwatch.db`.

Never edit or delete a migration that already exists; add a new one instead.

## Testing with an in-memory database

```ts
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import { createDb } from "@/db/client";

const db = createDb(":memory:");
migrate(db, { migrationsFolder: "drizzle" });
// insertSnapshots([...], db); getDisruptionByLine({}, db) ...
```

Each test file gets its own database, so tests never touch `data/gapwatch.db`.
