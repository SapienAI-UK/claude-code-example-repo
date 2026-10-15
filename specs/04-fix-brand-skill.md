# 04 · Fix the brand skill, then make it yours

**Shows:** skills (how `SKILL.md` frontmatter and `description` decide when a skill is used, reference files loaded on demand), editing a skill

## Goal

The repo ships a Gapwatch brand skill. In exercise 02 you did UI work and it never kicked in. Find out why and fix it, then adapt the skill with a preference of your own.

## Context

- The skill: `.claude/skills/brand-guidelines/` (`SKILL.md` plus `references/`)
- Skills documentation: https://code.claude.com/docs/en/skills

## Requirements

- Claude picks the skill on its own for UI work, user-facing copy and anything else that carries the brand, without being told its name.
- The skill stays portable: it should work just as well in Claude chat for slides or a document. No file paths, routes or component names from this repo. How *this repo* builds UI belongs in `.claude/rules/web-ui.md`.
- `SKILL.md` stays short. Detail stays in `references/` and is read only when needed.
- Add one preference of your own (a colour, a voice rule, a component rule) in the file where it belongs.

## Acceptance criteria

- [ ] You can name every reason the skill didn't trigger (there's more than one)
- [ ] In a fresh session, a UI or copy request makes Claude use the skill without being told its name
- [ ] Typing `/brand-guidelines` still works
- [ ] Your preference is in the right file and shows up in Claude's output
- [ ] The skill contains no file paths, routes or component names from this repo

## Out of scope

- Applying the brand to the app (that's exercise 05)

## Try it

> "The brand-guidelines skill didn't trigger when you worked on the live board. Why not? Fix it."

Then:

> "Add to the brand skill: <your preference>."

Test it in a fresh session with a UI or copy request that doesn't mention the brand, for example "Write the empty-state message for the trends page."

## Watch for

- Before a skill runs, Claude sees only its name and `description`. What does that mean for how you write the description?
- Frontmatter can do more than describe a skill. Which field decides whether Claude may use it on its own?
- Once the skill triggers, which reference files does Claude open, and when? Is any of them skipped because the task didn't need it?
- Where did your preference end up: `SKILL.md` (always applies) or a reference file (read on demand)? Why?
