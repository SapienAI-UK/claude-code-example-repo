# TfL Unified API notes

Gapwatch uses one endpoint of the free [TfL Unified API](https://api.tfl.gov.uk).

## Line status by mode

```
GET https://api.tfl.gov.uk/Line/Mode/{modes}/Status
```

- `{modes}` is a comma-separated list, e.g. `tube,dlr,overground,elizabeth-line`. Gapwatch reads it from `TFL_MODES` (see `.env.example`), defaulting to those four.
- Other useful modes: `tram`, `bus`, `river-bus`, `cable-car`. Valid values: `GET /Line/Meta/Modes`.
- Response: an array of lines. Each has `id`, `name`, `modeName` and `lineStatuses[]`. A line can report **several statuses at once** (e.g. minor delays on one section and part suspension on another); Gapwatch keeps the worst. See `src/lib/tfl/parse.ts`.
- `bus` returns hundreds of routes, so the UI needs search or filtering before enabling it.

A trimmed real response lives in `tests/fixtures/tfl-status.json`.

## Severity codes

`statusSeverity` is a number. Lower is generally worse, but not strictly, so Gapwatch maps codes to categories in `src/lib/tfl/severity.ts`:

| Category | Codes | Examples |
|----------|-------|----------|
| good | 10, 18, 19 | Good Service, No Issues, Information |
| minor | 0, 7, 8, 9, 12, 13, 14, 15, 17 | Minor Delays, Reduced Service |
| severe | 5, 6, 11 | Severe Delays, Part Closure |
| suspended | 2, 3, 16 | Suspended, Part Suspended, Not Running |
| closed | 1, 4, 20 | Planned Closure, Service Closed (overnight) |

"Disrupted" means minor, severe or suspended. Scheduled closures don't count. Full list: `GET /Line/Meta/Severity`.

## Authentication and rate limits

- The API works **without a key**, but anonymous requests are rate-limited more tightly.
- A free **app key** from https://api-portal.tfl.gov.uk raises the limit. It's sent as the `app_key` query parameter.
- `TFL_APP_KEY` is documented in `.env.example`. The client doesn't send it yet (see `specs/06-tfl-api-key.md`).
- The key must only ever be used server-side.

Polling every 2 minutes is about 720 requests a day, comfortably within anonymous limits.

## Gotchas

- Overnight, many lines report `Service Closed` (20). That's normal, not a disruption.
- `reason` text often repeats the line name and may have trailing whitespace; we trim it.
- Line names can change (e.g. the London Overground lines were renamed in 2024). Store `line_id` as the stable key.
