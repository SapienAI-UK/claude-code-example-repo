import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createDb, type Db } from "@/db/client";
import { deleteSyntheticRows, replaceSyntheticRows, setDemoMode } from "@/db/queries/demo";
import { getSnapshotStats } from "@/db/queries/status";
import { pollOnce } from "./poller";

const fetchLineStatuses = vi.hoisted(() => vi.fn());
vi.mock("./tfl/client", () => ({ fetchLineStatuses }));

const live = [
  {
    lineId: "central",
    lineName: "Central",
    mode: "tube",
    statusSeverity: 10,
    statusDescription: "Good Service",
    reason: null,
  },
];

let db: Db;
beforeEach(() => {
  fetchLineStatuses.mockReset().mockResolvedValue(live);
  db = createDb(":memory:");
  migrate(db, { migrationsFolder: "drizzle" });
});

describe("pollOnce", () => {
  it("stores a poll when no demo data exists", async () => {
    expect(await pollOnce(db)).toBe(1);
    expect(getSnapshotStats(db).total).toBe(1);
  });

  it("pauses while demo data exists, without calling TfL", async () => {
    replaceSyntheticRows(
      [{ ...live[0], polledAt: "2026-01-02T00:00:00.000Z" }],
      db,
    );
    expect(await pollOnce(db)).toBe(0);
    expect(fetchLineStatuses).not.toHaveBeenCalled();
    expect(getSnapshotStats(db).total).toBe(1);
  });

  it("resumes once the demo data is cleared", async () => {
    replaceSyntheticRows([{ ...live[0], polledAt: "2026-01-02T00:00:00.000Z" }], db);
    deleteSyntheticRows(db);
    expect(await pollOnce(db)).toBe(1);
    expect(getSnapshotStats(db).total).toBe(1);
  });

  it("resumes when switched back to live data, keeping the demo rows", async () => {
    replaceSyntheticRows([{ ...live[0], polledAt: "2026-01-02T00:00:00.000Z" }], db);
    setDemoMode(false, db);
    expect(await pollOnce(db)).toBe(1);
    expect(getSnapshotStats(db).total).toBe(1);
  });
});
