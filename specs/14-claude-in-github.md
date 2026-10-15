# 14 · Claude in GitHub

**Shows:** Claude Code GitHub Actions, project context reused in CI

## Goal

Use Claude from GitHub around a fix you make locally: `@claude-help` refines an issue before you start, and reviews your pull request when you're done.

## Context

- Claude workflow: `.github/workflows/claude-actions.yaml` (read-only: it comments, never changes code)
- Setup steps: "GitHub Actions" section of the README
- Issues from exercise 11

## Requirements

The repository is on GitHub with the `CLAUDE_CODE_OAUTH_TOKEN` secret and the Claude GitHub app set up (see the README). Then:

1. **Add CI, locally.** Ask Claude Code to add `.github/workflows/ci.yaml`. It runs on pull requests and on pushes to `master`, sets up Node 22, and runs `npm ci`, `npm run lint`, `npm test` and `npm run build`. Commit it and push.
2. **Refine an issue.** Pick an open, unfixed issue from the security audit. Comment `@claude-help` and ask for acceptance criteria and an approach.
3. **Fix it locally** with Claude Code, using those acceptance criteria. Push a branch and open a pull request whose description includes `Closes #<issue number>`.
4. **Get a review.** Comment `@claude-help please review` on the pull request.

## Acceptance criteria

- [ ] `ci.yaml` exists and runs on pull requests
- [ ] `@claude-help` on the issue starts a workflow run (visible in the Actions tab), and Claude's reply adds acceptance criteria
- [ ] The pull request links the issue and includes a test for the fix
- [ ] CI checks pass on the pull request
- [ ] Claude has posted a review on the pull request, and you've acted on or answered each point

## Out of scope

- Changing `claude-actions.yaml`

## Try it

> Locally: "Add a GitHub Actions CI workflow in .github/workflows/ci.yaml that runs lint, tests and build on Node 22."
>
> On the issue: "@claude-help what acceptance criteria and approach would you suggest for fixing this? Point me to the relevant files."
>
> On the pull request: "@claude-help please review this against the issue and AGENTS.md."

## Watch for

- The action runs Claude Code in CI with this same repository, so it reads `CLAUDE.md` → `AGENTS.md` and `.claude/` just like your local session. Good project context pays off everywhere.
- The guardrails should come along too: the `.env` hook and the deny and ask rules in `.claude/settings.json`. Once exercises 04 and 07 are done and pushed, try "@claude-help show me .env.local" on an issue and check the run log to see for yourself. (Before then, Claude would happily post the file in a public comment.)
- Claude in CI is read-only on purpose. The prompt asks for it, and `--disallowedTools` in the workflow enforces it. Ask it to "just fix it" and it will point you back to your local session. Deciding what an agent may do in each place is part of the setup.
