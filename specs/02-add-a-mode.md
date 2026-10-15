# 02 · Add a transport mode

**Shows:** Claude reading local configuration, checking a fact against a live API, a permission prompt for a web fetch, running checks after a config change

## Goal

Gapwatch polls the Tube, DLR, Overground and Elizabeth line. Add trams through configuration alone, so they appear on the live board.

## Context

- Which modes are polled: `TFL_MODES` (documented in `.env.example`, set in `.env.local`)
- TfL notes on modes: `docs/tfl-api.md` ("Line status by mode")

## Requirements

- Add `tram` (or another small mode of your choice) to `TFL_MODES` in `.env.local`.
- Check that the mode name is valid with TfL's API before using it.
- No code changes.

## Acceptance criteria

- [ ] Trams appear on the live board after the next poll (or after "Poll now" on the admin page)
- [ ] The mode name was checked against TfL's API
- [ ] `git status` shows no changes to code
- [ ] `npm test`, `npm run lint` and `npm run build` pass

## Out of scope

- Buses (that's exercise 08)
- Any change to how the board looks

## Try it

> "Which transport modes does the board show right now? Add trams."

Then, on a fresh branch or after undoing the change:

> "Before you change anything, check the mode name against TfL's API, then add trams."

## Watch for

- Claude reads `.env.local` without any trouble. Remember that when you get to exercise 04.
- `curl` is denied in `.claude/settings.json`. Which tool does Claude use to fetch TfL's API, and does it ask you first?
- Does Claude run the tests, lint and build after a change that only touches configuration? Where did it learn that's expected?
- Ask for `bus` instead of trams. Does Claude warn you before adding it, and where does that warning come from?
- Did the board pick up the new mode without restarting `npm run dev`?
