import { mkdirSync } from "node:fs";
import { dirname } from "node:path";
import Database from "better-sqlite3";
import { drizzle, type BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import { DB_PATH } from "./config";
import * as schema from "./schema";

export type Db = BetterSQLite3Database<typeof schema>;

declare global {
  var __gapwatchDb: Db | undefined;
}

/** Opens a database. Pass ":memory:" in tests. */
export function createDb(path: string = DB_PATH): Db {
  if (path !== ":memory:") mkdirSync(dirname(path), { recursive: true });
  const sqlite = new Database(path);
  sqlite.pragma("journal_mode = WAL");
  return drizzle({ client: sqlite, schema });
}

/** Shared app connection, reused across hot reloads in dev. */
export function getDb(): Db {
  globalThis.__gapwatchDb ??= createDb();
  return globalThis.__gapwatchDb;
}
