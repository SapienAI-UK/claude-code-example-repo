#!/usr/bin/env node
/**
 * PreToolUse hook for the test-engineer subagent only (wired up in
 * .claude/agents/test-engineer.md). Lets it write test files and fixtures,
 * and denies edits to application code, so bugs get reported, not "fixed"
 * by the tester.
 *
 * It also checks Bash: the tester needs it to run the tests, but a shell
 * command (`sed -i`, `echo >`) could change application code without ever
 * naming a file the Write/Edit check sees. So Bash may only run the tests
 * and read-only git commands.
 */

const TEST_FILE = /(\.test\.tsx?$)|((^|[\\/])tests[\\/])/;

// Watch mode (`npm run test:watch`, bare `npx vitest`) never exits, so only one-off runs.
const ALLOWED_COMMAND = /^\s*(npm test|npm run test|npx vitest run|git (diff|log|status|show))(\s|$)/;

// Chaining, piping, redirection and substitution could smuggle a write in
// after an allowed command, and `--output` options write files too.
const UNSAFE = /[;&|<>`]|\$\(|--output/;

let raw = "";
for await (const chunk of process.stdin) raw += chunk;

let event;
try {
  event = JSON.parse(raw);
} catch {
  process.exit(0);
}

function deny(reason) {
  console.log(
    JSON.stringify({
      hookSpecificOutput: {
        hookEventName: "PreToolUse",
        permissionDecision: "deny",
        permissionDecisionReason: reason,
      },
    }),
  );
  process.exit(0);
}

const command = event.tool_input?.command;
if (typeof command === "string") {
  if (ALLOWED_COMMAND.test(command) && !UNSAFE.test(command)) process.exit(0);
  deny(
    "test-engineer may only run the tests (`npm test`, `npx vitest run ...`) and read-only git " +
      "commands, one at a time, with no pipes or redirects. Write test files with the Write and " +
      "Edit tools, and report bugs in application code instead of changing it.",
  );
}

const filePath = event.tool_input?.file_path;
if (typeof filePath !== "string" || TEST_FILE.test(filePath)) process.exit(0);

deny(
  `test-engineer may only write test files (*.test.ts) and files under tests/. ` +
    `${filePath} is application code: report the bug with the failing test instead of changing it.`,
);
