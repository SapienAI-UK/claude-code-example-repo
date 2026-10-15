# 07 · Add bus routes

**Shows:** planning with an interview, a plan saved to a file, tests first, a Stop hook as a quality gate, review in a fresh session, nested context files

## Goal

Let Gapwatch track London buses alongside rail, without making the board unusable.

## Context

- Mode configuration: `TFL_MODES` in `.env.example`, and `src/lib/tfl/client.ts`
- TfL notes on modes and bus volume: `docs/tfl-api.md`
- Live board: `src/app/LiveBoard.tsx`; trends: `src/app/trends/` and `src/db/queries/trends.ts`
- Hooks documentation (Stop hooks): https://code.claude.com/docs/en/hooks

**Prerequisite:** install the grill-me skill for yourself before you start.

## Requirements

- Buses are enabled through configuration, not code changes to the mode list.
- The live board stays usable with hundreds of routes:
  - search by route number or name
  - filter by mode
  - disrupted routes first
- Trends can be grouped or filtered by mode.
- Storage growth is considered: buses multiply the number of rows per poll. Document the impact and any mitigation.
- Brand guidelines still apply.
- A **Stop hook** in `.claude/settings.json` runs the tests whenever Claude finishes a response, and sends Claude back to work if they fail.

## Acceptance criteria

- [ ] Adding `bus` to `TFL_MODES` is the only change needed to start tracking buses
- [ ] Board search and mode filter work, and the page stays responsive with all bus routes
- [ ] Trends support filtering by mode
- [ ] Storage impact is written up in `docs/database.md`
- [ ] Tests cover the new filtering and grouping logic, and were written before the code they test
- [ ] The Stop hook stops Claude finishing while tests fail (you've seen it send Claude back at least once)
- [ ] A fresh session has marked every acceptance criterion met or not met, with evidence
- [ ] `npm test`, `npm run lint` and `npm run build` pass

## Out of scope

- Bus stop arrivals or predictions
- Maps

## Try it

1. **Gate first.** "Add a Stop hook to .claude/settings.json that runs the tests when you finish, and sends you back to work if they fail."
2. **Plan.** In plan mode: "Use grill-me to interview me about specs/07-bus-routes.md, then plan it. Save the plan to plans/07-bus-routes.md."
3. **Build.** `/clear`, then: "Implement plans/07-bus-routes.md. Tests first: have the test-engineer write failing tests for the acceptance criteria before you change app code."
4. **Review.** In a **new** session: "Review the bus routes work against specs/07-bus-routes.md. For each acceptance criterion, say met or not met, with evidence. Don't change any code."

Remember to add `bus` to `TFL_MODES` in `.env.local` yourself.

## Watch for

- Which questions does grill-me ask that you hadn't thought about? Does the plan identify the performance and storage risks before any code is written?
- The plan survives `/clear` because it's a file. What else would you have lost?
- Which model and effort level suit each phase: planning, building, reviewing?
- When Claude opens `src/db/queries/trends.ts`, does `src/db/AGENTS.md` load, and with it the database guide it `@`-imports?
- If Claude stops even though a test fails, look at how your hook reports the failure. Not every non-zero exit code blocks.
- Lint runs after each edit (exercise 06), tests at the end of each turn. Why put them at different points?
- Does the fresh session find anything the building session missed?
- Does the brand skill trigger again for the new search and filter UI?
- If you've done exercise 06, Claude can't touch `.env.local`. Does it ask you to change it rather than trying to work around the hook?
