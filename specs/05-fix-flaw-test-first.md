# 05 · Fix a finding, test first

**Level:** intermediate · **Shows:** the test-engineer subagent, subagent-scoped hooks, a two-agent red/green loop

## Goal

Fix one confirmed finding from the security audit in a way that proves the fix works and stops the bug coming back.

## Context

- Your findings from spec 04 (GitHub issues or the review table)
- The tester: `.claude/agents/test-engineer.md`
- Testing conventions: `docs/database.md` ("Testing with an in-memory database")

## Requirements

- Pick **one** confirmed finding, ideally the highest-severity access-control or injection issue.
- **Red:** the test-engineer writes a test that demonstrates the problem, and you see it **fail**.
- **Green:** the main agent fixes the application code until that test (and all others) pass.
- The tester never edits application code, and the implementer never weakens the test.
- Commit the change with a message that references the issue (e.g. `Fixes #3`).

## Acceptance criteria

- [ ] A new test exists that failed before the fix (you saw the failing run)
- [ ] The fix is in application code, and the new test now passes
- [ ] No existing test was removed, skipped or loosened
- [ ] The commit message references the issue
- [ ] `npm test`, `npm run lint` and `npm run build` pass

## Out of scope

- Fixing every finding at once (repeat the loop for others)

## Try it

> "Take issue #N. First have the test-engineer write a failing test that proves it, then fix it, then have the test-engineer confirm everything passes."

## Watch for

- The test-engineer has a **hook in its own frontmatter** that blocks edits outside test files. If it tries to "helpfully" fix the bug, watch the hook stop it.
- The test-engineer runs on a different model (`model: sonnet`) from the security reviewer (`model: opus`): fast iteration vs deep analysis.
- `git commit` asks for permission first. That's the `ask` rule in `.claude/settings.json`.
