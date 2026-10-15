# 11 · Security audit

**Shows:** read-only subagents, delegation and handoff, `gh` behind permission prompts

## Goal

Find out how well the app follows its own security rules, and turn every confirmed problem into a tracked GitHub issue.

## Context

- The rules the app is supposed to follow: `AGENTS.md`, `src/db/AGENTS.md`, `docs/database.md`
- The reviewer: `.claude/agents/security-reviewer.md`
- Built-in alternative: the `/security-review` command

## Requirements

- Use the **security-reviewer** subagent to audit the whole app.
- The audit makes **no code changes**.
- Create one GitHub issue per **confirmed** finding. Each issue has:
  - a title
  - a severity label
  - the `file:line` evidence
  - the rule it breaks
  - a suggested fix
- Suspected (unconfirmed) findings go in a single summary comment or issue, not one each.

## Acceptance criteria

- [ ] A review table with severity, location, evidence and the rule broken for each finding
- [ ] One GitHub issue per confirmed finding, labelled by severity
- [ ] `git status` shows no changes to application code
- [ ] (Optional) You've compared the result with the built-in `/security-review`

## Out of scope

- Fixing anything (that's exercise 12)

## Try it

> "Use the security-reviewer agent to audit the app against our documented rules, then file each confirmed finding as a GitHub issue."

Requires the GitHub CLI (`gh auth login`) and a GitHub remote for this repo.

## Watch for

- The subagent runs in its own context with only Read, Grep and Glob. It *can't* change code, even if it wanted to.
- The handoff: the subagent reports, then the main agent decides what to do with the report.
- Every `gh` command triggers a permission prompt (configured in `.claude/settings.json`), so you stay in control of what gets published.
- How does a custom reviewer that knows *your* rules compare with the generic `/security-review`?
- You may have spotted some flaws already, in earlier plans or answers. Does the reviewer find more, and does it confirm or reject what you'd seen?
