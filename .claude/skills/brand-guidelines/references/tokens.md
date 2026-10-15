# Design tokens

The hex values are the brand palette for any medium (slides, documents, web). On the web, define them once in the global stylesheet, then use `var(--gw-...)` everywhere.

```css
:root {
  /* Surfaces and text */
  --gw-ink: #14213d;          /* primary text, header background */
  --gw-ink-muted: #4f5a6e;    /* secondary text (AA on paper and surface) */
  --gw-paper: #f6f4ef;        /* page background, warm off-white */
  --gw-surface: #ffffff;      /* cards, tables */
  --gw-border: #d9d4c7;
  --gw-accent: #0f6e63;       /* links, focus rings, primary buttons */
  --gw-accent-ink: #ffffff;   /* text on accent */
  --gw-accent-on-dark: #4fb3a6; /* accent on --gw-ink backgrounds (6.3:1) */

  /* Status: text/icon colour + tinted background */
  --gw-good: #1b6b44;       --gw-good-bg: #e2f2e9;
  --gw-minor: #7a5000;      --gw-minor-bg: #fdf0d2;
  --gw-severe: #a3231b;     --gw-severe-bg: #fbe3e1;
  --gw-suspended: #5a2a85;  --gw-suspended-bg: #efe5f7;
  --gw-closed: #4f5a6e;     --gw-closed-bg: #eceef1;

  /* Shape and rhythm */
  --gw-radius: 6px;
  --gw-radius-pill: 999px;
  --gw-space-1: 4px;
  --gw-space-2: 8px;
  --gw-space-3: 12px;
  --gw-space-4: 16px;
  --gw-space-6: 24px;
  --gw-space-8: 32px;

  /* Type */
  --gw-font: "Atkinson Hyperlegible", system-ui, sans-serif;
  --gw-text-sm: 0.875rem;
  --gw-text-base: 1rem;
  --gw-text-lg: 1.25rem;
  --gw-text-xl: 1.75rem;
}
```

## Typography

- **Typeface:** [Atkinson Hyperlegible](https://fonts.google.com/specimen/Atkinson+Hyperlegible), designed for maximum legibility. Weights 400 and 700 only. Where it isn't available (for example in some slide tools), use the system sans-serif.
- Body is 1rem/1.5. Headings are bold, in `--gw-ink`, no all-caps.
- Numbers in tables and charts use `font-variant-numeric: tabular-nums` so columns line up.

## Status palette

| Category | Text/icon | Background | Icon | Label examples |
|----------|-----------|------------|------|----------------|
| good | `--gw-good` | `--gw-good-bg` | ✓ check | Good service |
| minor | `--gw-minor` | `--gw-minor-bg` | ! in triangle | Minor delays, Reduced service |
| severe | `--gw-severe` | `--gw-severe-bg` | !! in triangle | Severe delays, Part closure |
| suspended | `--gw-suspended` | `--gw-suspended-bg` | ⊘ no-entry | Suspended, Part suspended |
| closed | `--gw-closed` | `--gw-closed-bg` | ☾ moon | Closed, Planned closure |

All text/background pairs above meet WCAG AA.

## TfL line colours (identification only)

Used as a 4px left stripe or a small dot next to the line name. These are approximations for a training app; check TfL's published colour standards before using them in production.

| Line | Colour | Line | Colour |
|------|--------|------|--------|
| Bakerloo | `#B36305` | Northern | `#000000` |
| Central | `#E32017` | Piccadilly | `#003688` |
| Circle | `#FFD300` | Victoria | `#0098D4` |
| District | `#00782A` | Waterloo & City | `#95CDBA` |
| Hammersmith & City | `#F3A9BB` | DLR | `#00A4A7` |
| Jubilee | `#A0A5A9` | Elizabeth line | `#6950A1` |
| Metropolitan | `#9B0056` | Liberty | `#61686B` |
| Lioness | `#FFA600` | Mildmay | `#006FE6` |
| Suffragette | `#18A95D` | Weaver | `#9B0058` |
| Windrush | `#DC241F` | | |

Liberty, Lioness, Mildmay, Suffragette, Weaver and Windrush are the London Overground lines (named in November 2024); TfL reports each one separately, so each gets its own colour.

Unknown lines fall back to `--gw-border`.
