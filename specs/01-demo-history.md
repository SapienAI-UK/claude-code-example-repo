# 01 · Generate demo history

**Level:** beginner · **Shows:** nested context files, following linked docs, plan mode

## Goal

An admin can fill the database with realistic synthetic history, so the trends page is worth exploring without waiting weeks, and can remove it again cleanly.

## Context

- Admin page: `src/app/admin/`
- Database layer and its conventions: `src/db/`
- Severity categories and real line ids: `src/lib/tfl/`

## Requirements

- Add two actions to the admin page: **Generate demo history** and **Clear demo data**.
- Generated data looks like the real poller ran for the last **90 days**: one row per line every 2 minutes, using the lines the app actually polls.
- Patterns should be plausible enough to make the trends page interesting:
  - more disruption in the weekday rush hours (07:00–10:00, 16:00–19:00 London time)
  - some lines noticeably less reliable than others
  - overnight closures where appropriate
  - believable `reason` text for disruptions
- Generation must finish in a reasonable time (under ~30 seconds) and must not block other requests for long.
- Both actions are available to admins only.

## Acceptance criteria

- [ ] Admin page shows both actions with clear labels and a confirmation step for Clear
- [ ] After generating, `/trends` shows populated tables for line, hour and weekday
- [ ] Every generated row is distinguishable from real polled data
- [ ] Clear removes only generated rows; real polled rows survive
- [ ] Live board still shows only real, current data
- [ ] A viewer cannot trigger either action (UI or API)
- [ ] Tests cover generation and clearing against an in-memory database
- [ ] `npm test`, `npm run lint` and `npm run build` pass

## Out of scope

- Styling beyond the existing plain look (that's spec 02)
- Changing the trends queries

## Try it

> "Implement specs/01-demo-history.md. Start in plan mode."

(Press Shift+Tab to cycle into plan mode, or start the prompt with "plan first".)

## Watch for

- When Claude opens files in `src/db/`, does it pick up `src/db/AGENTS.md` without being told? Does it then follow the link to `docs/database.md`?
- Does the plan mention the database conventions (how synthetic rows are marked, batching, UTC) before writing code?
- How does Claude decide where the new API route or server action goes, and does it follow the auth rule in `AGENTS.md`?
