import { eq } from "drizzle-orm";
import { getDb, type Db } from "../client";
import { appSettings, statusSnapshots, type NewSnapshot } from "../schema";

// 8 bound columns per row; SQLite allows at most 32,766 variables per statement.
const INSERT_CHUNK = 1000;

const DEMO_ACTIVE_KEY = "demo_active";

export function hasSyntheticRows(db: Db = getDb()): boolean {
  const row = db
    .select({ id: statusSnapshots.id })
    .from(statusSnapshots)
    .where(eq(statusSnapshots.isSynthetic, true))
    .limit(1)
    .get();
  return row !== undefined;
}

function setDemoActive(active: boolean, db: Db): void {
  db.insert(appSettings)
    .values({ key: DEMO_ACTIVE_KEY, value: active ? "1" : "0" })
    .onConflictDoUpdate({ target: appSettings.key, set: { value: active ? "1" : "0" } })
    .run();
}

/**
 * Demo mode: generated rows exist and the admin has chosen to show them.
 * While on, polling is paused and every read sees only generated rows;
 * otherwise reads see only real rows, so kept demo rows stay out of the way.
 */
export function isDemoMode(db: Db = getDb()): boolean {
  const setting = db
    .select({ value: appSettings.value })
    .from(appSettings)
    .where(eq(appSettings.key, DEMO_ACTIVE_KEY))
    .get();
  return setting?.value === "1" && hasSyntheticRows(db);
}

/** Switches between demo and live data without deleting anything. Demo can only be switched on while generated rows exist. */
export function setDemoMode(active: boolean, db: Db = getDb()): boolean {
  if (active && !hasSyntheticRows(db)) return false;
  setDemoActive(active, db);
  return true;
}

/** Condition that limits a query to the rows the app is currently showing. */
export function visibleRows(db: Db) {
  return eq(statusSnapshots.isSynthetic, isDemoMode(db));
}

/** Removes generated rows only (real polled rows are left alone) and returns to live data. */
export function deleteSyntheticRows(db: Db = getDb()): number {
  return db.transaction((tx) => {
    const deleted = tx
      .delete(statusSnapshots)
      .where(eq(statusSnapshots.isSynthetic, true))
      .run().changes;
    setDemoActive(false, tx as unknown as Db);
    return deleted;
  });
}

/**
 * Swaps all generated rows for `rows` and switches demo mode on, in one transaction, so a failure
 * leaves the previous demo data intact. `rows` is consumed lazily because a
 * 90-day history is around a million rows.
 */
export function replaceSyntheticRows(rows: Iterable<NewSnapshot>, db: Db = getDb()): number {
  return db.transaction((tx) => {
    tx.delete(statusSnapshots).where(eq(statusSnapshots.isSynthetic, true)).run();

    let inserted = 0;
    let chunk: NewSnapshot[] = [];
    const flush = () => {
      if (chunk.length === 0) return;
      tx.insert(statusSnapshots).values(chunk).run();
      inserted += chunk.length;
      chunk = [];
    };

    for (const row of rows) {
      chunk.push({ ...row, isSynthetic: true });
      if (chunk.length === INSERT_CHUNK) flush();
    }
    flush();

    setDemoActive(true, tx as unknown as Db);
    return inserted;
  });
}
