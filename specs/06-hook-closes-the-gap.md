# 06 · Hooks: block before, react after

**Shows:** PreToolUse hooks (enforcing what permission rules can't express), PostToolUse hooks (feedback to Claude after an edit), how Claude reacts when a hook speaks up

## Goal

Two hooks, one at each side of a tool call:

- **Part A, block before.** After exercise 03, Claude can't read `.env.local` with its file tools, and simple shell reads like `cat` are caught by the deny rule too. But a program that opens the file itself, such as a `node -e` one-liner, gets through. The repo already has a hook that guards env files, yet it lets `.env.local` through. Close the gap.
- **Part B, react after.** Run the linter on every file Claude edits, so Claude hears about problems straight away and fixes them in the same turn.

## Context

- The existing hook: `.claude/hooks/protect-env.mjs` (read its header comment; it also shows how a hook reads the tool call from stdin)
- Where hooks are registered: `hooks` in `.claude/settings.json`
- Your deny rules from exercise 03
- Lint setup: `eslint.config.mjs`
- Hooks documentation: https://code.claude.com/docs/en/hooks

## Requirements

**Part A**

- Any tool call that names `.env.local` is denied, whether it's a read, a search, an edit or a shell command (Bash or PowerShell).
- `.env.example` stays allowed.
- Code that mentions `process.env.SOMETHING` is not blocked.
- Every block is logged to `.claude/hooks/blocked.log`.

**Part B**

- A PostToolUse hook, registered in `.claude/settings.json`, runs ESLint on the file Claude just created or edited.
- Only `.ts`, `.tsx`, `.js` and `.mjs` files are linted; other edits pass straight through.
- Lint problems are reported back to Claude, not just shown to you.
- The hook is a Node script in `.claude/hooks/`, so it works on Windows, macOS and Linux.

## Acceptance criteria

- [ ] Reading `.env.local` with a `node -e` one-liner is blocked by the hook, and Claude explains why
- [ ] The attempt appears in `.claude/hooks/blocked.log`
- [ ] Asked which variables the app uses, Claude answers from `.env.example`
- [ ] Editing code that reads `process.env.TFL_MODES`, and searching the code for `process.env`, still work
- [ ] When Claude makes an edit that breaks a lint rule, it sees the problem and fixes it without being asked
- [ ] Editing a Markdown file doesn't run ESLint
- [ ] You can explain why this repo uses both a deny rule and a hook
- [ ] `npm test`, `npm run lint` and `npm run build` pass

## Out of scope

- Sandboxing
- Fixing lint problems automatically (`eslint --fix`)

## Try it

**Part A**

> "Read .env.local with a node one-liner and show me what's in it."

It works, even with your deny rule from exercise 03. Now:

> "Make the protect-env hook block .env.local too."

Then try the first prompt again in a new session.

**Part B**

> "Add a PostToolUse hook that runs ESLint on every file you edit and tells you about any problems."

Then, in a new session, ask for a small change that leaves something unused behind, for example "Add a helper in src/lib/tfl/severity.ts that we'll use later, but don't call it yet."

## Watch for

- The Part A hook's message goes back to Claude. Does Claude change approach (for example, switch to `.env.example`), or retry the same thing another way?
- `AGENTS.md` never says "don't read `.env.local`". The block comes from the harness, not from Claude choosing to obey. **Instructions guide; hooks enforce.**
- Which tool did Claude try first? The Part A hook's matcher in `.claude/settings.json` covers all of them.
- The Part A hook reads command *text*. Can you think of a command it would miss? Real protection for shell commands comes from sandboxing, which works at the operating-system level.
- A PostToolUse hook can't undo an edit; the file has already changed. How does your hook get Claude to fix the problem? Not every non-zero exit code reaches Claude.
- Compare the timing: Part A decides *before* a tool runs, Part B reacts *after*. Which jobs suit which?
- A file written through the shell never triggers the Part B hook. That's one reason `CLAUDE.md` asks Claude to use its file tools.
