#!/usr/bin/env node
/**
 * PreToolUse hook: stops Claude from reading or touching secret env files.
 *
 * Claude Code sends the pending tool call as JSON on stdin. We look at every
 * field that can name a file or run a command, and deny the call if it
 * mentions `.env`, `.env.local` or any other `.env.*` file, except the
 * documented template `.env.example`.
 *
 * Why a hook as well as `permissions.deny`? Deny rules match tool + path
 * patterns. A hook is code: it sees every tool (including shell commands in
 * any form), can explain itself to Claude, and can log what it blocked.
 */
import { appendFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ALLOWED = new Set([".env.example"]);

// `.env` or `.env.something`, at the start or after a path separator, quote,
// whitespace or shell operator. Avoids false hits like `process.env.FOO`.
const ENV_FILE = /(?:^|[\s/\\"'`=<>(|;,*])(\.env(?:\.[\w-]+)*)/g;

const FIELDS = ["file_path", "path", "pattern", "glob", "command", "notebook_path"];

function findBlocked(toolInput) {
  for (const field of FIELDS) {
    const value = toolInput?.[field];
    if (typeof value !== "string") continue;
    for (const match of value.matchAll(ENV_FILE)) {
      if (!ALLOWED.has(match[1])) return { field, file: match[1], value };
    }
  }
  return null;
}

function log(line) {
  try {
    const logFile = join(dirname(fileURLToPath(import.meta.url)), "blocked.log");
    appendFileSync(logFile, line + "\n");
  } catch {
    // Logging is best-effort; never let it break the hook.
  }
}

let raw = "";
for await (const chunk of process.stdin) raw += chunk;

let event;
try {
  event = JSON.parse(raw);
} catch {
  // Unreadable input: allow the call rather than break every tool.
  process.exit(0);
}

const hit = findBlocked(event.tool_input);
if (!hit) process.exit(0);

log(
  `${new Date().toISOString()}  ${event.tool_name}  ${hit.field}=${JSON.stringify(hit.value).slice(0, 200)}`,
);

console.log(
  JSON.stringify({
    hookSpecificOutput: {
      hookEventName: "PreToolUse",
      permissionDecision: "deny",
      permissionDecisionReason:
        `Blocked by .claude/hooks/protect-env.mjs: ${hit.file} holds secrets and must not be ` +
        "read, searched, edited or printed. For variable names and what they do, read " +
        ".env.example instead. If the user needs a value changed, ask them to edit the file.",
    },
  }),
);
