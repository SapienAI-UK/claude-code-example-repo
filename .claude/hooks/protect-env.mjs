#!/usr/bin/env node
/**
 * PreToolUse hook: stops Claude from reading or touching env files that hold secrets.
 *
 * Claude Code sends the pending tool call as JSON on stdin. We look at every
 * field that can name a file or run a command, and deny the call if it
 * mentions a `.env` or `.env.*` file that isn't listed in ALLOWED below.
 *
 * Why a hook as well as `permissions.deny`? Deny rules match tool + path
 * patterns. A hook is code: it sees every tool (including shell commands in
 * any form), can explain itself to Claude, and can log what it blocked.
 */
import { appendFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ALLOWED = new Set([".env.example", ".env.local"]);

// `.env` or `.env.something`, in any case, not preceded by a word character or `$`
// (avoids false hits like `process.env.FOO`) and not followed by one (`.envrc`).
const ENV_FILE = /(?<![\w$])(\.env(?:\.[\w-]+)*)(?![\w-])/gi;

const FIELDS = ["file_path", "path", "pattern", "glob", "command", "notebook_path"];

// Search patterns are regex or glob text, where `\.` is just an escaped dot: without
// this, `process\.env` would look like a `.env` file. Paths keep their backslashes,
// so Windows paths such as `src\.env.production` are still caught.
const PATTERN_FIELDS = new Set(["pattern", "glob"]);

function findBlocked(toolInput) {
  for (const field of FIELDS) {
    const raw = toolInput?.[field];
    if (typeof raw !== "string") continue;
    const value = PATTERN_FIELDS.has(field) ? raw.replaceAll("\\.", ".") : raw;
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
