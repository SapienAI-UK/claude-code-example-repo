# 02 · Make disruption stand out

**Shows:** path-scoped rules in `.claude/rules/`, context that loads only when it's needed

## Goal

Right now every line on the live board looks the same, whether it has a good service or is suspended. Make disrupted lines easy to spot at a glance.

## Context

- Live board: `src/app/LiveBoard.tsx` and its styles
- Status severity helpers: `src/lib/tfl/`

## Requirements

- Lines look visibly different depending on how disrupted they are.
- Reuse the app's existing severity categories. Don't add a second mapping from TfL severity codes.
- Follow the repo's UI conventions.

## Acceptance criteria

- [ ] Good service, minor disruption, severe disruption, suspended and closed lines each look different
- [ ] The category comes from the existing severity helper; no severity codes are listed in UI code
- [ ] Styles live in a CSS file, not inline styles
- [ ] `npm test`, `npm run lint` and `npm run build` pass

## Out of scope

- Restyling the rest of the app
- Changing the order of the board

## Try it

> "Make disrupted lines stand out on the live board."

If every line has a good service right now, ask Claude how you can see the other states without waiting for a real disruption.

When you're done, take a screenshot of the board and keep it. You'll need it later.

## Watch for

- You never mentioned `.claude/rules/web-ui.md`. Does it load when Claude opens `LiveBoard.tsx`? Run `/memory` or `/context` to see what's loaded.
- Look at the `paths:` frontmatter at the top of that rule. Compare it with `AGENTS.md`, which loads in every session.
- `AGENTS.md` deliberately doesn't link to this rule, so you can see path-based loading on its own. The trade-off: `.claude/rules/` is Claude Code only, so other agents that read `AGENTS.md` won't discover these rules. In your own repo you'd usually add a plain link as well.
- Which of Claude's decisions trace back to the rule, and which did it make up itself? Note the colours and wording it chose.
