import { and, asc, count, eq, max } from "drizzle-orm";
import { getDb, type Db } from "../client";
import { visibleRows } from "./demo";
import { statusSnapshots, type NewSnapshot, type Snapshot } from "../schema";

export function insertSnapshots(rows: NewSnapshot[], db: Db = getDb()): number {
  if (rows.length === 0) return 0;
  db.insert(statusSnapshots).values(rows).run();
  return rows.length;
}

/** Rows from the most recent poll. */
export function getLatestStatuses(db: Db = getDb()): Snapshot[] {
  const visible = visibleRows(db);
  const latest = db
    .select({ polledAt: max(statusSnapshots.polledAt) })
    .from(statusSnapshots)
    .where(visible)
    .get();

  if (!latest?.polledAt) return [];

  return db
    .select()
    .from(statusSnapshots)
    .where(and(visible, eq(statusSnapshots.polledAt, latest.polledAt)))
    .orderBy(asc(statusSnapshots.lineName))
    .all();
}

export function getSnapshotStats(db: Db = getDb()) {
  const visible = visibleRows(db);
  const total = db.select({ n: count() }).from(statusSnapshots).where(visible).get()?.n ?? 0;
  const lastPolledAt =
    db
      .select({ polledAt: max(statusSnapshots.polledAt) })
      .from(statusSnapshots)
      .where(visible)
      .get()?.polledAt ?? null;

  return { total, lastPolledAt };
}

/** Distinct lines seen so far, for filter dropdowns. */
export function getKnownLines(db: Db = getDb()) {
  return db
    .selectDistinct({ lineId: statusSnapshots.lineId, lineName: statusSnapshots.lineName })
    .from(statusSnapshots)
    .where(visibleRows(db))
    .orderBy(asc(statusSnapshots.lineName))
    .all();
}
