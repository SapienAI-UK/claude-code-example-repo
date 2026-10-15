# 05 · Apply the Gapwatch brand

**Shows:** skills (automatic triggering, reference files loaded on demand)

## Goal

Turn the deliberately plain UI into the Gapwatch brand: calm, legible, and with status you can read at a glance.

## Context

- Global styles: `src/app/globals.css`; page styles in `*.module.css`
- Layout and header: `src/app/layout.tsx`, `src/app/Header.tsx`
- Live board: `src/app/LiveBoard.tsx`; trends: `src/app/trends/`

**Prerequisite:** exercise 04. Until the brand skill is fixed, Claude won't use it.

## Requirements

- Design tokens defined once as CSS custom properties and used everywhere
- Brand typeface loaded properly in Next.js
- Status shown as a reusable badge with icon, label and colour
- Line identification uses line colours, kept separate from status colours
- Live board ordering and summary line as the brand guidelines describe
- Copy (headings, empty states, errors, buttons) follows the brand voice

## Acceptance criteria

- [ ] No raw hex colours outside the token definitions
- [ ] Every status on the board has an icon and a text label, not just a colour
- [ ] All text meets WCAG AA contrast
- [ ] Disrupted lines appear first on the live board, with a one-line summary above
- [ ] Trends bars and tables follow the brand's chart and table guidance
- [ ] Login, board, trends and admin pages all look consistent
- [ ] `npm test`, `npm run lint` and `npm run build` pass

## Out of scope

- New features or data
- Dark mode

## Try it

> "Apply our brand to the app."

Take a screenshot of each page **before** you start, so you can compare. Start `npm run dev` early: trends only has data once the poller has run for a while.

## Watch for

- You never named the brand guidelines. Does Claude announce that it's using the `brand-guidelines` skill?
- Which reference files does it open (`tokens.md`, `components.md`, `voice.md`), and when? It should load each only when needed.
- Two sources shape this work: the skill (the brand, portable) and `.claude/rules/web-ui.md` (how this repo builds UI). Which decisions came from which?
- Compare the live board with your screenshot from exercise 02. What changed about how status is shown?
- **Optional experiment:** temporarily move `.claude/skills/brand-guidelines` out of the repo, run the same prompt on a fresh branch, and compare the results.
