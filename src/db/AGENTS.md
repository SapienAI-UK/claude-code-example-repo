# Database layer

SQLite through Drizzle ORM. Full guide: @../../docs/database.md

Rules that always apply here:

- **Parameterise everything.** Build queries with Drizzle's query builder or the `sql` tagged template, which binds values safely. Never pass request input into `sql.raw()` or into SQL assembled with string concatenation or template literals.
- **Schema changes go through migrations.** Edit `schema.ts`, then run `npm run db:generate -- --name <change>`. Never edit a migration in `drizzle/` once it exists.
- **Times are UTC ISO-8601 strings** (`new Date().toISOString()`).
- Query functions take an optional `db` argument (defaulting to `getDb()`) so tests can pass an in-memory database.
