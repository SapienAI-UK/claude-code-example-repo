# 16 · Write your own spec

**Shows:** spec-driven development from both sides

## Goal

Use Claude to *write* a spec, not just implement one, and then hand that spec to a fresh session to build.

## Context

- Template: `specs/_template.md`
- Existing specs in `specs/` as examples
- The app's current features and rules: `AGENTS.md`

## Requirements

- Pick a feature. Suggestions:
  - **Line detail page:** `/lines/[id]` with current status, the last 24 hours as a timeline, and that line's disruption trend
  - **Disruption alerts:** highlight lines whose status got worse since the previous poll
  - **Weekly summary:** a page summarising last week's most disrupted lines and times
- Have Claude interview you about the feature before writing (ask it to ask you questions).
- The spec follows the template. Acceptance criteria are concrete and testable, and "Watch for" covers Claude's behaviour, not the code answer.
- Save it as `specs/17-<name>.md`.
- Then start a **new** Claude session and ask it to implement the spec.

## Acceptance criteria

- [ ] `specs/17-<name>.md` exists and follows the template
- [ ] Every acceptance criterion can be checked by a test or by looking at the app
- [ ] A fresh session implemented it from the spec alone
- [ ] You've noted anything the implementing session misunderstood, and improved the spec

## Out of scope

- Perfect specs. The point is to learn what makes a spec easy for an agent to follow.

## Try it

> "I want to add a line detail page. Interview me with a few questions, then write a spec in specs/ using the template."

## Watch for

- What did the implementing session get wrong? That usually points to something the spec left implicit.
- Specs are context too. A good spec is the same kind of writing as a good `AGENTS.md`: specific, testable, and with pointers rather than prose.
