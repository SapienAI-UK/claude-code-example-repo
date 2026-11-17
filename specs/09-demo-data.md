# 09 · Demo data (optional)

**Shows:** plan mode on a multi-file change, asking Claude to question you first, nested context files, the auth rules, changing background behaviour safely

## Goal

Real history takes weeks to build up, and disruptions that share a cause are rare. Let an admin load realistic demo data, so the trends page and linked disruptions (exercise 10) have something to show, then clear it and get back to live data cleanly.

## Context

- Admin page: `src/app/admin/`
- Database layer and its conventions: `src/db/`
- The background poll: `src/lib/poller.ts`
- Severity categories and real line ids: `src/lib/tfl/`

## Requirements

- Add two actions to the admin page: **Generate demo data** and **Clear demo data**. Both are for admins only.
- Generated history looks like the real poller ran for the last **90 days**: one row per line every 2 minutes, using the lines the app actually polls. Patterns are plausible enough to make trends interesting:
  - more disruption in the weekday rush hours (07:00–10:00, 16:00–19:00 London time)
  - some lines noticeably less reliable than others
  - overnight closures where appropriate
  - believable `reason` text for disruptions
- It also includes a **current scenario** in which several lines share one cause (for example, one signal failure affecting two lines).
- Generation is repeatable: the same seed always produces the same data.
- **Demo mode:** while generated rows exist and the admin has chosen to show them (generating switches it on):
  - live polling is paused
  - the board, trends and history show only the demo data
  - every page shows a clear banner saying that demo data is showing and live polling is paused
- Admins can switch between demo and live data without deleting anything. Live mode shows only real rows, and polling resumes.
- When the demo data is cleared, polling resumes and the board returns to live data.

## Acceptance criteria

- [ ] The admin page shows both actions with clear labels, and Clear asks for confirmation
- [ ] A viewer can't trigger either action (UI or API)
- [x] After generating, `/trends` shows populated tables for line, hour and weekday
- [ ] After generating, the board shows the current scenario, and every page shows the demo banner
- [x] No real polls are stored while demo data exists
- [x] Clear removes only generated rows; real polled rows survive
- [ ] After clearing, the banner disappears and live polling resumes
- [x] Switching to live data shows only real rows and resumes polling, keeping the demo rows; switching back shows the demo data again
- [x] Generating twice with the same seed gives the same data
- [x] Tests cover generating, clearing and the pause decision against an in-memory database
- [x] `npm test`, `npm run lint` and `npm run build` pass

## Out of scope

- Styling beyond the existing look
- Changing what the trends queries compute (they only gain the demo/live row filter)

## Try it

> "Implement specs/09-demo-data.md. Ask me questions one at a time before you plan."

Start in plan mode (Shift+Tab).

## Watch for

- When Claude opens files in `src/db/`, does it pick up `src/db/AGENTS.md` without being told, and with it the database guide that file imports?
- Which questions does Claude ask before planning? Did any of them change the plan?
- How does the plan handle inserting around a million rows (batching, transactions)?
- Where does Claude put the "pause polling" decision, and does it explain why there?
- Does the new route or server action follow the auth rule in `AGENTS.md`?
