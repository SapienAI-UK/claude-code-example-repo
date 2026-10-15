# 08 · Add bus routes

**Shows:** planning with an interview, a plan saved to a file, tests first, a Stop hook as a quality gate, review in a fresh session, nested context files

## Goal

Turn on London buses, then make the board and trends usable with hundreds of routes instead of about 19 lines, and understand what that costs in storage. Turning buses on is the easy part (exercise 02); coping with the consequences is the work.

## Context

- Mode configuration: `TFL_MODES` in `.env.example`, and `src/lib/tfl/client.ts`
- TfL notes on modes and bus volume: `docs/tfl-api.md`
- Live board: `src/app/LiveBoard.tsx`; trends: `src/app/trends/` and `src/db/queries/trends.ts`
- Hooks documentation (Stop hooks): https://code.claude.com/docs/en/hooks

**Prerequisite:** install the grill-me skill for yourself before you start. Builds on exercise 02 (adding a transport mode).

## Requirements

- The live board stays usable with hundreds of routes:
  - search by route number or name
  - filter by mode
  - disrupted routes first
- Trends can be grouped or filtered by mode.
- Storage growth is considered: buses multiply the number of rows per poll. Document the impact and any mitigation.
- Brand guidelines still apply.
- A **Stop hook** in `.claude/settings.json` runs the tests whenever Claude finishes a response, and sends Claude back to work if they fail. It stays in place for later exercises.

## Acceptance criteria

- [ ] With `bus` enabled, board search and mode filter work, and the page stays responsive with all bus routes
- [ ] Disrupted routes appear first
- [ ] Trends support filtering by mode
- [ ] Storage impact and mitigation are written up in `docs/database.md`
- [ ] Tests cover the new filtering and grouping logic, and were written before the code they test
- [ ] The Stop hook stops Claude finishing while tests fail (you've seen it send Claude back at least once)
- [ ] A fresh session has marked every acceptance criterion met or not met, with evidence
- [ ] `npm test`, `npm run lint` and `npm run build` pass

## Out of scope

- Bus stop arrivals or predictions
- Maps

## Try it

1. **Turn on buses.** Add `bus` to `TFL_MODES` in `.env.local` (do it yourself if you've done exercise 07, which stops Claude touching that file). Look at the board after the next poll.
2. **Gate.** "Add a Stop hook to .claude/settings.json that runs the tests when you finish, and sends you back to work if they fail."
3. **Plan.** In plan mode: "Use grill-me to interview me about specs/08-bus-routes.md, then plan it. Add your answers and the plan to specs/08-bus-routes.md, under a new '## Plan' section."
4. **Build.** `/clear`, then: "Implement specs/08-bus-routes.md, following its Plan section. Tests first: have the test-engineer write failing tests for the acceptance criteria before you change app code."
5. **Review.** In a **new** session: "Review the bus routes work against specs/08-bus-routes.md. For each acceptance criterion, say met or not met, with evidence. Don't change any code."

## Watch for

- Which questions does grill-me ask that you hadn't thought about? Does the plan identify the performance and storage risks before any code is written?
- The plan survives `/clear` because it's written into the spec. What else would you have lost? Open the spec afterwards: is it now enough for a fresh session to carry on from?
- Which model and effort level suit each phase: planning, building, reviewing?
- When Claude opens `src/db/queries/trends.ts`, does `src/db/AGENTS.md` load, and with it the database guide it `@`-imports?
- If Claude stops even though a test fails, look at how your hook reports the failure. Not every non-zero exit code blocks.
- Lint runs after each edit (exercise 07), tests at the end of each turn. Why put them at different points?
- Does the fresh session find anything the building session missed?
- Does the brand skill trigger again for the new search and filter UI?
- If you've done exercise 07, Claude can't touch `.env.local`. Does it ask you to change it rather than trying to work around the hook?
