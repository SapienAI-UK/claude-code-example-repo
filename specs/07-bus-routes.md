# 07 · Add bus routes

**Level:** advanced · **Shows:** env-driven config, planning a larger change, reusing the brand skill

## Goal

Let Gapwatch track London buses alongside rail, without making the board unusable.

## Context

- Mode configuration: `TFL_MODES` in `.env.example`, and `src/lib/tfl/client.ts`
- TfL notes on modes and bus volume: `docs/tfl-api.md`
- Live board: `src/app/LiveBoard.tsx`; trends: `src/app/trends/` and `src/db/queries/trends.ts`

## Requirements

- Buses are enabled through configuration, not code changes to the mode list.
- The live board stays usable with hundreds of routes:
  - search by route number or name
  - filter by mode
  - disrupted routes first
- Trends can be grouped or filtered by mode.
- Storage growth is considered: buses multiply the number of rows per poll. Document the impact and any mitigation.
- Brand guidelines still apply (if spec 02 is done).

## Acceptance criteria

- [ ] Adding `bus` to `TFL_MODES` is the only change needed to start tracking buses
- [ ] Board search and mode filter work, and the page stays responsive with all bus routes
- [ ] Trends support filtering by mode
- [ ] Storage impact is written up in `docs/database.md`
- [ ] Tests cover the new filtering and grouping logic
- [ ] `npm test`, `npm run lint` and `npm run build` pass

## Out of scope

- Bus stop arrivals or predictions
- Maps

## Try it

> "Plan how to implement specs/07-bus-routes.md. Show me the plan before changing anything."

Remember to add `bus` to `TFL_MODES` in `.env.local` yourself. Claude can't edit that file.

## Watch for

- A change this size is worth planning first. Does the plan identify the performance and storage risks before writing code?
- Does the brand skill trigger again for the new search and filter UI?
- Does Claude remind you to update `.env.local` (which it can't touch) rather than trying to work around the hook?
