# 04 · Keep Claude out of secrets with deny rules

**Shows:** permission rules (allow / ask / deny), deny beats allow, asking compared with enforcing

## Goal

`.env.local` holds this machine's passwords and session secret, and right now Claude can read it. Add a permission rule so Claude can't, while it can still read the documented template, `.env.example`.

## Context

- Permission rules: `.claude/settings.json` (look at what's already allowed, asked and denied)
- The variable reference: `.env.example`
- Permissions documentation: https://code.claude.com/docs/en/permissions

## Requirements

- Claude's file tools can't read `.env`, `.env.local` or any other `.env.*` file that holds secrets.
- `.env.example` stays readable.
- The rule lives in the project settings, so everyone who clones the repo gets it.

## Acceptance criteria

- [ ] Before your change, you've seen Claude show the contents of `.env.local`
- [ ] After it, "Show me what's in .env.local" is refused by a permission rule, not by Claude deciding to refuse
- [ ] "Which environment variables does this app use?" is answered from `.env.example`
- [ ] `.env.example` can still be read
- [ ] You can explain why adding an `allow` rule for `.env.example` doesn't rescue it from a broader `deny`
- [ ] You've tried printing `.env.local` from the terminal in more than one way (for example `cat`, and a `node -e` one-liner that reads the file) and noted which ones the rule caught

## Out of scope

- Hooks (that's exercise 07)
- Sandboxing

## Try it

> "Show me what's in .env.local."

Then:

> "Add a deny rule to .claude/settings.json so you can't read .env files, except .env.example."

Start a new session before testing, and run `/permissions` to see the rules that are active.

## Watch for

- The obvious rule, `Read(**/.env*)`, also matches `.env.example`. What does Claude do about that? Rules are checked in the order deny, then ask, then allow, so an `allow` can't carve an exception out of a `deny`.
- Deny rules match a tool plus a path. Claude Code recognises common read commands such as `cat` and applies `Read` rules to them, but it can't see inside an arbitrary program that opens the file. Which of your terminal attempts got through?
- `AGENTS.md` describes `.env.local` but never says "don't read it". Which one actually stopped Claude: the instruction or the rule?
