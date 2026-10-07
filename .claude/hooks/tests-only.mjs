#!/usr/bin/env node
/**
 * PreToolUse hook for the test-engineer subagent only (wired up in
 * .claude/agents/test-engineer.md). Lets it write test files and fixtures,
 * and denies edits to application code, so bugs get reported, not "fixed"
 * by the tester.
 */

const TEST_FILE = /(\.test\.tsx?$)|((^|[\\/])tests[\\/])/;

let raw = "";
for await (const chunk of process.stdin) raw += chunk;

let event;
try {
  event = JSON.parse(raw);
} catch {
  process.exit(0);
}

const filePath = event.tool_input?.file_path;
if (typeof filePath !== "string" || TEST_FILE.test(filePath)) process.exit(0);

console.log(
  JSON.stringify({
    hookSpecificOutput: {
      hookEventName: "PreToolUse",
      permissionDecision: "deny",
      permissionDecisionReason:
        `test-engineer may only write test files (*.test.ts) and files under tests/. ` +
        `${filePath} is application code: report the bug with the failing test instead of changing it.`,
    },
  }),
);
