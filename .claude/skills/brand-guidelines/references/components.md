# Components

## Status badge

The single most important component. Used on the live board and anywhere a status appears.

- A pill (`--gw-radius-pill`) with the status background, the status colour for text and icon, `--gw-space-1` vertical and `--gw-space-3` horizontal padding, `--gw-text-sm`, bold.
- Structure: `[icon] Label`. The icon is decorative (`aria-hidden="true"`), and the label carries the meaning.
- Icons are simple shapes, 16px, in the status colour. On the web, inline SVG with `currentColor` does this without an icon library.
- Labels use sentence case ("Minor delays", not "Minor Delays"), even though TfL sends title case.

```
 ┌──────────────────┐
 │ ⚠ Minor delays   │   amber text on pale amber, pill
 └──────────────────┘
```

## Line identifier

- The line name in `--gw-ink`, bold, with a 4px stripe in the TfL line colour on the left edge of the row or card.
- Mode (tube, dlr...) as small muted text below or beside it, displayed as "Tube", "DLR", "Overground", "Elizabeth line".

## Live board

- Sort disrupted lines **to the top** (suspended, then severe, then minor), then good service, then closed. Within a group, alphabetical.
- Show a summary line above the board: "All lines running normally" or "3 lines have disruption".
- Each row shows the line identifier, the status badge, and the reason (muted, `--gw-text-sm`). Hide the reason for good service.
- "Last updated 08:14" in muted text, 24-hour time.

## Tables

- `--gw-surface` background, `--gw-border` row dividers, no vertical lines.
- Header row in `--gw-ink-muted`, bold, `--gw-text-sm`, no background fill.
- Numeric columns right-aligned with tabular numbers.

## Charts (trends page)

- Simple horizontal bars.
- Bars use `--gw-accent`. Don't use status colours for aggregates; a percentage isn't a status.
- Always show the value as text next to the bar ("14%").
- Label the time basis ("Times are UTC") near the chart.

## Header

- `--gw-ink` background with white text. "Gapwatch" wordmark in bold on the left; nav on the right.
- The current page is marked with an underline in `--gw-accent-on-dark` and `aria-current="page"`.

## Buttons and forms

- Primary: `--gw-accent` background, `--gw-accent-ink` text, `--gw-radius`.
- Secondary: `--gw-surface` with a `--gw-border` border.
- Visible focus ring: 2px `--gw-accent` outline with a 2px offset. Never remove focus outlines.

## Empty states

- A calm panel (`--gw-surface`, `--gw-border`, `--gw-radius`) with one sentence saying what's missing and one saying what to do next. Optional simple line icon. No illustrations of sad trains.
