---
name: brand-guidelines
description: Gapwatch brand guidelines covering colours, typography, status badges, line identifiers, charts and tone of voice. Use whenever creating or changing Gapwatch UI (pages, components, CSS, charts, empty states) or writing any user-facing text such as status messages, errors, labels or buttons.
---

# Gapwatch brand guidelines

Gapwatch helps London commuters decide, at a glance, whether their journey is OK. Everything should feel **calm, clear and trustworthy**, like a good station announcement, not an alarm.

## Core rules (always apply)

1. **Status first.** The most important information on any screen is "is my line OK?" Make status scannable before anything else.
2. **Never colour alone.** Every status shows an icon **and** a text label as well as its colour. Users may be colour-blind, in bright sunlight, or on a greyscale e-reader.
3. **Status colours ≠ line colours.** The four status colours (plus neutral "closed") are only used for status. TfL line colours are only used to *identify* a line (a small stripe or dot), never to signal status.
4. **Contrast:** all text meets WCAG AA (4.5:1 for body text, 3:1 for large text and icons).
5. **Use the tokens.** All colours, radii and spacing come from CSS custom properties defined once in `src/app/globals.css` (`--gw-*`). No raw hex values in components.
6. **Calm voice.** Plain British English, specific, no exclamation marks, no emoji, no jokes about delays.

## When to read the reference files

- Setting up or changing colours, type, spacing: [references/tokens.md](references/tokens.md) (has the exact values and the CSS to paste)
- Building status badges, line identifiers, tables, charts, header, empty states: [references/components.md](references/components.md)
- Writing any copy (status text, reasons, errors, buttons, empty states): [references/voice.md](references/voice.md)

## Quick checklist before you finish

- [ ] Tokens defined in `globals.css` and used everywhere (search for stray `#` hex values)
- [ ] Every status badge has an icon, a label, and a status colour
- [ ] Line colours appear only as identifiers
- [ ] Copy follows the voice guide
- [ ] Contrast checked for any new colour pairing
