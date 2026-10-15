#!/usr/bin/env node
/**
 * PreToolUse hook for the spec-judge subagent only (wired up in
 * .claude/agents/spec-judge.md). The judge needs Bash to read the diff and
 * run the checks, but "never edit files" in its prompt is only an
 * instruction. This hook makes it true: Bash may run the checks and
 * read-only git commands, nothing else.
 */

const ALLOWED = /^\s*(npm (test|run (lint|build))|git (diff|log|status|show))(\s|$)/;

// Chaining, piping, redirection and substitution could smuggle a write in
// after an allowed command (`git diff > out.txt`, `npm test && rm ...`), and
// `--output` options (`git diff --output=`, Vitest's `--outputFile`) write files too.
const UNSAFE = /[;&|<>`]|\$\(|--output/;

let raw = "";
for await (const chunk of process.stdin) raw += chunk;

let event;
try {
  event = JSON.parse(raw);
} catch {
  process.exit(0);
}

const command = event.tool_input?.command;
if (typeof command !== "string") process.exit(0);
if (ALLOWED.test(command) && !UNSAFE.test(command)) process.exit(0);

console.log(
  JSON.stringify({
    hookSpecificOutput: {
      hookEventName: "PreToolUse",
      permissionDecision: "deny",
      permissionDecisionReason:
        "spec-judge may only run `npm test`, `npm run lint`, `npm run build` and read-only git " +
        "commands (`git diff`, `log`, `status`, `show`), one at a time, with no pipes or " +
        "redirects. Report what you found instead of changing anything.",
    },
  }),
);
