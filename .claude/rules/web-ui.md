---
paths:
  - "src/app/**/*.tsx"
  - "src/app/**/*.css"
---

How we build the UI. This file covers engineering conventions only. For how Gapwatch should *look and sound* (colours, type, status badges, copy), use the `brand-guidelines` skill.

- **Server components by default.** Pages read data directly from `src/db/queries/*` on the server. Add `"use client"` only for interactivity (forms with state, timers, buttons that call APIs), and keep those components small.
- **Client components fetch through API routes**, never by importing database or server-only modules.
- **Auth first.** The first line of every protected page is `await requirePageRole("viewer" | "admin")`.
- **Dynamic pages** that show live data export `const dynamic = "force-dynamic"`.
- **Styling is plain CSS.** Global element styles and shared utility classes (`.muted`, `.panel`, `.stack`) live in `src/app/globals.css`. Page- or component-specific styles go in a CSS module next to the component (`trends.module.css`). No inline styles except for data-driven values (for example a bar's width).
- **Accessibility:**
  - use semantic HTML (`table` for tabular data, `label` wrapping inputs, one `h1` per page)
  - every form control has a label
  - use `role="alert"` for errors
  - never convey meaning by colour alone
- **Dates and numbers** are formatted with the `en-GB` locale. Times stored in the database are UTC; say so in the UI when showing raw hours.
- **Empty states** explain why there's nothing yet and what to do next.
