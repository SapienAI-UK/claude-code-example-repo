# 12 · Fix findings test first, two at once

**Shows:** the test-engineer subagent, subagent-scoped hooks, a two-agent red/green loop, worktrees for parallel sessions

## Goal

Fix two confirmed findings from the security audit at the same time, each in its own worktree, in a way that proves each fix works and stops the bug coming back.

## Context

- Your findings from exercise 11 (GitHub issues or the review table)
- The tester: `.claude/agents/test-engineer.md`
- Testing conventions: `docs/database.md` ("Testing with an in-memory database")
- Worktrees documentation: https://code.claude.com/docs/en/worktrees

## Requirements

- Pick **two** confirmed findings whose fixes touch **different files**, ideally the most severe access-control or injection issues.
- Run each fix in its own worktree and branch, with its own Claude session, at the same time (for example `claude --worktree fix-<issue>`).
- In each session:
  - **Red:** the test-engineer writes a test that demonstrates the problem, and you see it **fail**.
  - **Green:** the main agent fixes the application code until that test (and all the others) pass.
  - The tester never edits application code, and the implementer never weakens the test.
  - Commit with a message that references the issue (e.g. `Fixes #3`).
- Merge both branches.

## Acceptance criteria

- [ ] Two branches, each with a new test that failed before the fix (you saw the failing run)
- [ ] Each fix is in application code, and its new test now passes
- [ ] No existing test was removed, skipped or loosened
- [ ] Each commit message references its issue
- [ ] Your main checkout had no changes while the two sessions ran
- [ ] Both branches are merged, and `npm test`, `npm run lint` and `npm run build` pass

## Out of scope

- Fixing every finding (repeat the loop for the rest)

## Try it

In two terminals:

> `claude --worktree fix-<issue A>` → "Take issue #A. First have the test-engineer write a failing test that proves it, then fix it, then have the test-engineer confirm everything passes."
>
> `claude --worktree fix-<issue B>` → the same for issue #B.

## Watch for

- The test-engineer has a **hook in its own frontmatter** that blocks edits outside test files. If it tries to "helpfully" fix the bug, watch the hook stop it.
- The test-engineer runs on a different model (`model: sonnet`) from the security reviewer (`model: opus`): fast iteration vs deep analysis.
- Each session sees only its own checkout. Neither can trip over the other's half-finished changes.
- `git commit` asks for permission first. That's the `ask` rule in `.claude/settings.json`.
- What happens when you merge the second branch? Picking findings in different files is what keeps this easy.
