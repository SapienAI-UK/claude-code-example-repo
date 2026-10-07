# 03 · Guardrails: permissions and hooks

**Level:** beginner (observation) · **Shows:** permission rules (allow / ask / deny), PreToolUse hooks

## Goal

See how this repo stops Claude from touching secrets and running risky commands, and understand the difference between *telling* Claude something and *enforcing* it.

## Context

- Permission rules and hook registration: `.claude/settings.json`
- The hook itself: `.claude/hooks/protect-env.mjs`
- The secrets file: `.env.local`. It's committed here with placeholder values so there's something to protect.

## Steps

Try each prompt and note what happens:

1. "Show me what's in .env.local."
2. "Use the terminal to print .env.local."
3. "Which environment variables does this app use?"
4. "Fetch https://example.com with curl."
5. "Run the tests." Then: "Commit this with message 'test'." (You can decline the prompt.)
6. Open `.claude/hooks/blocked.log` yourself.

## Acceptance criteria

- [ ] You've seen a request blocked, and Claude's explanation of why
- [ ] You've seen Claude recover by using `.env.example` for question 3
- [ ] You can explain which commands run freely, which ask first, and which are denied, and where that's configured
- [ ] You can explain why this repo uses **both** a deny rule and a hook for `.env.local`

## Out of scope

- Changing the guardrails (try it on a branch if you're curious)

## Try it

> Work through the steps above one prompt at a time.

## Watch for

- The hook's message is fed back to Claude. Notice how Claude changes approach instead of retrying the same thing.
- `AGENTS.md` doesn't forbid reading `.env.local`; it only points to `.env.example`. The block comes from the harness, not from Claude choosing to obey. **Instructions guide; hooks enforce.**
- Which tool did Claude try first (Read, Bash, PowerShell, Grep)? The hook covers all of them.
