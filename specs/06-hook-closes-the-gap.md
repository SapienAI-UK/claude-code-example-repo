# 06 · Close the gap with a hook

**Shows:** PreToolUse hooks, enforcing what permission rules can't express, how Claude reacts when a tool call is denied

## Goal

After exercise 03, Claude's file tools can't read `.env.local`, but a shell command still can. The repo already has a hook that guards env files, yet it lets `.env.local` through. Close the gap.

## Context

- The hook: `.claude/hooks/protect-env.mjs` (read its header comment)
- Where it's registered: `hooks` in `.claude/settings.json`
- Your deny rules from exercise 03
- Hooks documentation: https://code.claude.com/docs/en/hooks

## Requirements

- Any tool call that names `.env.local` is denied, whether it's a read, a search, an edit or a shell command (Bash or PowerShell).
- `.env.example` stays allowed.
- Code that mentions `process.env.SOMETHING` is not blocked.
- Every block is logged to `.claude/hooks/blocked.log`.

## Acceptance criteria

- [ ] Asking Claude to print `.env.local` with the terminal is blocked, and Claude explains why
- [ ] The attempt appears in `.claude/hooks/blocked.log`
- [ ] Asked which variables the app uses, Claude answers from `.env.example`
- [ ] Editing code that reads `process.env.TFL_MODES` still works
- [ ] You can explain why this repo uses both a deny rule and a hook

## Out of scope

- Writing a new hook from scratch
- Sandboxing

## Try it

> "Use the terminal to print .env.local."

It works. Now:

> "Make the protect-env hook block .env.local too."

Then try the first prompt again in a new session.

## Watch for

- The hook's message goes back to Claude. Does Claude change approach (for example, switch to `.env.example`), or retry the same thing another way?
- `AGENTS.md` never says "don't read `.env.local`". The block comes from the harness, not from Claude choosing to obey. **Instructions guide; hooks enforce.**
- Which tool did Claude try first? The hook's matcher in `.claude/settings.json` covers all of them.
