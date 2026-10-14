---
paths:
  - "src/app/**/*.tsx"
  - "src/app/**/*.css"
---

How we build the UI in this repository.

- **Server components by default.** Pages read data directly from `src/db/queries/*` on the server. Add `"use client"` only for interactivity (forms with state, timers, buttons that call APIs), and keep those components small.
- **Client components fetch through API routes**, never by importing database or server-only modules.
- **Auth first.** The first line of every protected page is `await requirePageRole("viewer" | "admin")`.
- **Dynamic pages** that show live data export `const dynamic = "force-dynamic"`.
- **Styling is plain CSS.** Global element styles and shared utility classes (`.muted`, `.panel`, `.stack`) live in `src/app/globals.css`. Page- or component-specific styles go in a CSS module next to the component (`trends.module.css`). No inline styles except for data-driven values (for example a bar's width).
- **Brand tokens** are CSS custom properties (`--gw-*`) defined once at the top of `src/app/globals.css`. Components use `var(--gw-...)`, so raw hex values appear only in that definition block.
- **The typeface** loads with `next/font/google` in `src/app/layout.tsx` (`variable: "--font-atkinson"`, class on `<html>`), and `--gw-font` points at `var(--font-atkinson)`.
- **Status categories come from `categorise()`** in `src/lib/tfl/severity.ts`. Render status through one shared badge component (for example `src/app/components/StatusBadge.tsx`) that takes a severity.
- **Charts are CSS bars** (a `div` whose width is the value). The app has no chart library.
- **Accessibility:**
  - use semantic HTML (`table` for tabular data, `label` wrapping inputs, one `h1` per page)
  - every form control has a label
  - use `role="alert"` for errors
- **Dates and numbers** are formatted with the `en-GB` locale. Times stored in the database are UTC.
