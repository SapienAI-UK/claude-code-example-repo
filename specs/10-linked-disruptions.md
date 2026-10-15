# 10 · Linked disruptions

**Shows:** planning with an interview, a plan saved to a file, tests first, a Stop hook as a quality gate, review in a fresh session, schema changes through migrations

## Goal

Show when several lines share one cause, for example a single signal failure that delays two lines, with an admin deciding which suggested links are real.

## Context

- Database layer, schema and migrations: `src/db/` (has its own `AGENTS.md`)
- Where each line's `reason` text comes from: `src/lib/tfl/parse.ts`
- Admin page: `src/app/admin/`; live board: `src/app/LiveBoard.tsx`
- The auth rules: `AGENTS.md`
- Hooks documentation (Stop hooks): https://code.claude.com/docs/en/hooks

**Prerequisites:**

- The grill-me skill, installed for yourself.
- The Stop hook from exercise 08. If you skipped 08, step 1 below adds it.
- Optional: do exercise 09 first, so there's a shared-cause scenario to link straight away. Live data works too, if you're lucky.

## Requirements

- **Links table:** a new table, added through a migration, records which lines' reports share a cause.
- **Matching rule:** decides which reports within 30 minutes of each other share a cause, based on their `reason` text. Document the rule.
- **Evidence:** every link keeps the quoted `reason` from each report it links.
- **Admin review:** admins confirm or dismiss suggested links.
- **On the board:** confirmed links show on the live board for everyone signed in. Suggested links only appear in admin review.
- Works with or without buses, and with live or demo data.

## Acceptance criteria

- [ ] Only admins can confirm or dismiss a link (UI and API); a viewer is refused
- [ ] Each link shows evidence quoted from each report
- [ ] Confirmed links appear on the live board; dismissed ones don't
- [ ] The schema change is a new migration
- [ ] Tests cover the matching rule and were written before it
- [ ] The Stop hook sent Claude back at least once
- [ ] A fresh session has marked every acceptance criterion met or not met, with evidence
- [ ] `npm test`, `npm run lint` and `npm run build` pass

## Out of scope

- Alerts
- Predicting disruptions

## Try it

Use the same flow as exercise 08, **including grill-me: interview first, then plan.**

1. **Gate.** Check the Stop hook from exercise 08 is in `.claude/settings.json`. If not: "Add a Stop hook to .claude/settings.json that runs the tests when you finish, and sends you back to work if they fail."
2. **Plan.** In plan mode: "Use grill-me to interview me about specs/10-linked-disruptions.md, then plan it. Add your answers and the plan to specs/10-linked-disruptions.md, under a new '## Plan' section."
3. **Build.** `/clear`, then: "Implement specs/10-linked-disruptions.md, following its Plan section. Tests first: have the test-engineer write failing tests for the matching rule before you change app code."
4. **Review.** In a **new** session: "Review the linked disruptions work against specs/10-linked-disruptions.md. For each acceptance criterion, say met or not met, with evidence. Don't change any code."

## Watch for

- Does grill-me ask different questions for a data-model feature than it did for bus routes?
- The Stop hook you built in exercise 08 now guards this build without anyone mentioning it.
- When Claude adds the table, does it follow the migration rules in `src/db/AGENTS.md` (never edit an existing migration)?
- Does the new API route call `requireRole("admin")` before doing any work?
- Real TfL data rarely contains shared causes. How does the test-engineer get test data that does?
