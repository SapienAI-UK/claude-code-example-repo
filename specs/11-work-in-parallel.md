# 11 · Work in parallel

**Shows:** handing side work to a subagent, worktree subagents building two versions in parallel, rewind, a final judge run

## Goal

Exercise 10 put linked disruptions on the live board, but the view is basic. Improve it by trying two designs side by side without them clashing, keep the better one, and undo what you don't want.

## Context

- Where exercise 10's view lives: `src/app/LiveBoard.tsx`
- The side-research agent: `.claude/agents/docs-researcher.md`
- The judge: `.claude/agents/spec-judge.md`
- Subagents documentation (`isolation: worktree`): https://code.claude.com/docs/en/sub-agents
- Rewind documentation: https://code.claude.com/docs/en/checkpointing

**Prerequisite:** exercise 10 done and **merged into your default branch**. Worktree subagents start from the default branch, not from the branch you're on.

## Requirements

- A documentation question is answered by the docs-researcher agent, not in your main session.
- Two improved designs of the linked-lines view are built in parallel by subagents, each in its own worktree:
  - **A:** a badge on each linked line
  - **B:** a side panel listing shared causes
- Both follow the brand guidelines.
- You compare both, merge one and discard the other.
- Exercise 10's behaviour still holds: confirmed links are shown, dismissed ones aren't, and only admins confirm.
- A restyle you didn't want is rolled back with rewind.

## Acceptance criteria

- [ ] The docs question came back as a short, sourced summary from the docs-researcher
- [ ] Two worktree branches existed at the same time (`git worktree list`), one was merged and the other discarded
- [ ] The chosen design is on the live board
- [ ] The unwanted restyle was undone with rewind, not by hand
- [ ] The spec-judge says ready against specs 10 and 11
- [ ] `npm test`, `npm run lint` and `npm run build` pass

## Out of scope

- New linked-disruption behaviour (matching, admin review)
- Dark mode

## Try it

1. **Delegate.** "Use the docs-researcher agent to find out how `isolation: worktree` works for subagents."
2. **Two versions.** "The linked-disruptions view on the live board works but looks basic. Use two subagents with worktree isolation in parallel to improve it. One shows a badge on each linked line, the other a side panel listing shared causes. Both follow our brand." Review each branch, then merge one.
3. **Rewind.** In your main session (not a subagent): "Restyle the live board boldly." Then press Esc twice (or `/rewind`) and choose **Restore code**.
4. **Judge.** "Use the spec-judge agent to review this against specs/10-linked-disruptions.md and specs/11-work-in-parallel.md."

## Watch for

- How much did the docs-researcher read, and how much came back? Your main session's context only grew by the summary.
- Where did the worktrees land, and what are their branches called?
- Each subagent changed `LiveBoard.tsx` in its own worktree. Why didn't they clash?
- Does the brand skill trigger inside each subagent?
- The lint and Stop hooks keep running while the subagents work.
- Rewind covers edits Claude made with its file tools in this session. It doesn't cover shell commands or a subagent's edits; for those you need git. That's why step 3 happens in the main session.
