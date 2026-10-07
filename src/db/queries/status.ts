import { and, asc, count, eq, max } from "drizzle-orm";
import { getDb, type Db } from "../client";
import { statusSnapshots, type NewSnapshot, type Snapshot } from "../schema";

export function insertSnapshots(rows: NewSnapshot[], db: Db = getDb()): number {
  if (rows.length === 0) return 0;
  db.insert(statusSnapshots).values(rows).run();
  return rows.length;
}

/** Rows from the most recent real (non-synthetic) poll. */
export function getLatestStatuses(db: Db = getDb()): Snapshot[] {
  const latest = db
    .select({ polledAt: max(statusSnapshots.polledAt) })
    .from(statusSnapshots)
    .where(eq(statusSnapshots.isSynthetic, false))
    .get();

  if (!latest?.polledAt) return [];

  return db
    .select()
    .from(statusSnapshots)
    .where(
      and(
        eq(statusSnapshots.polledAt, latest.polledAt),
        eq(statusSnapshots.isSynthetic, false),
      ),
    )
    .orderBy(asc(statusSnapshots.lineName))
    .all();
}

export function getSnapshotStats(db: Db = getDb()) {
  const total = db.select({ n: count() }).from(statusSnapshots).get()?.n ?? 0;
  const synthetic =
    db
      .select({ n: count() })
      .from(statusSnapshots)
      .where(eq(statusSnapshots.isSynthetic, true))
      .get()?.n ?? 0;
  const lastPolledAt =
    db
      .select({ polledAt: max(statusSnapshots.polledAt) })
      .from(statusSnapshots)
      .where(eq(statusSnapshots.isSynthetic, false))
      .get()?.polledAt ?? null;

  return { total, synthetic, lastPolledAt };
}

/** Distinct lines seen so far, for filter dropdowns. */
export function getKnownLines(db: Db = getDb()) {
  return db
    .selectDistinct({ lineId: statusSnapshots.lineId, lineName: statusSnapshots.lineName })
    .from(statusSnapshots)
    .orderBy(asc(statusSnapshots.lineName))
    .all();
}
