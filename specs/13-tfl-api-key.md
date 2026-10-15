# 13 · Use the TfL app key when there is one

**Shows:** working with blocked secrets, server-side-only config

## Goal

Use a TfL app key, if one is configured, for higher rate limits, while the app keeps working out of the box without one.

## Context

- TfL client: `src/lib/tfl/client.ts`
- API notes (authentication section): `docs/tfl-api.md`
- Variable reference: `.env.example`

## Requirements

- When `TFL_APP_KEY` is set and non-empty, every TfL request includes it as TfL expects.
- When it's unset or empty, behaviour is exactly as today (anonymous requests).
- The key is only ever read and used on the server.
- The admin page shows whether a key is configured (yes/no), never the key itself.

## Acceptance criteria

- [ ] Requests include the key when it is set (covered by a test with mocked `fetch`)
- [ ] Requests are unchanged when it is not set (covered by a test)
- [ ] The key never reaches the browser: not in client bundles, API responses or page HTML
- [ ] The key never appears in logs or error messages
- [ ] `.env.example` and `docs/tfl-api.md` describe the final behaviour
- [ ] `npm test`, `npm run lint` and `npm run build` pass

## Out of scope

- Retry or back-off on rate-limit errors
- Key rotation

## Try it

> "Implement specs/13-tfl-api-key.md."

To try it for real, register at https://api-portal.tfl.gov.uk and paste your key into `.env.local` **yourself**.

## Watch for

- If you've done exercises 04 and 07, Claude can't open `.env.local`. How does it work out the variable name and format? It should use `.env.example` and the docs.
- Watch for the classic Next.js mistake of exposing a secret to the browser. Does Claude avoid it, and does it explain why?
- How does the test prove the key is sent without making a real network call?
