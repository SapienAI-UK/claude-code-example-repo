import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import { beforeEach, describe, expect, it } from "vitest";
import { createDb, type Db } from "../client";
import type { NewSnapshot } from "../schema";
import {
  deleteSyntheticRows,
  hasSyntheticRows,
  isDemoMode,
  replaceSyntheticRows,
  setDemoMode,
} from "./demo";
import { getKnownLines, getLatestStatuses, getSnapshotStats, insertSnapshots } from "./status";
import { getDisruptionByLine } from "./trends";

const row = (polledAt: string, lineId = "central"): NewSnapshot => ({
  lineId,
  lineName: lineId,
  mode: "tube",
  statusSeverity: 10,
  statusDescription: "Good Service",
  reason: null,
  polledAt,
});

let db: Db;
beforeEach(() => {
  db = createDb(":memory:");
  migrate(db, { migrationsFolder: "drizzle" });
});

describe("demo rows", () => {
  it("reports whether any generated rows exist", () => {
    insertSnapshots([row("2026-01-01T00:00:00.000Z")], db);
    expect(hasSyntheticRows(db)).toBe(false);
    replaceSyntheticRows([row("2026-01-02T00:00:00.000Z")], db);
    expect(hasSyntheticRows(db)).toBe(true);
  });

  it("inserts rows marked synthetic, across chunk boundaries", () => {
    const many = Array.from({ length: 2500 }, (_, i) =>
      row(new Date(Date.UTC(2026, 0, 1, 0, i * 2)).toISOString()),
    );
    expect(replaceSyntheticRows(many, db)).toBe(2500);
    expect(getSnapshotStats(db).total).toBe(2500);
    expect(hasSyntheticRows(db)).toBe(true);
  });

  it("replaces rather than doubles when run again", () => {
    const set = [row("2026-01-02T00:00:00.000Z"), row("2026-01-02T00:02:00.000Z")];
    replaceSyntheticRows(set, db);
    replaceSyntheticRows(set, db);
    expect(getSnapshotStats(db).total).toBe(2);
  });

  it("clears only generated rows", () => {
    insertSnapshots([row("2026-01-01T00:00:00.000Z"), row("2026-01-01T00:02:00.000Z")], db);
    replaceSyntheticRows([row("2026-01-02T00:00:00.000Z")], db);

    expect(deleteSyntheticRows(db)).toBe(1);
    expect(hasSyntheticRows(db)).toBe(false);
    expect(getSnapshotStats(db).total).toBe(2);
  });

  it("leaves existing demo rows alone if the new set fails midway", () => {
    replaceSyntheticRows([row("2026-01-02T00:00:00.000Z")], db);
    function* broken() {
      yield row("2026-01-03T00:00:00.000Z");
      throw new Error("boom");
    }
    expect(() => replaceSyntheticRows(broken(), db)).toThrow("boom");
    expect(getSnapshotStats(db).total).toBe(1);
    expect(getSnapshotStats(db).lastPolledAt).toBe("2026-01-02T00:00:00.000Z");
  });

  it("generating switches demo mode on and clearing switches it off", () => {
    expect(isDemoMode(db)).toBe(false);
    replaceSyntheticRows([row("2026-01-02T00:00:00.000Z")], db);
    expect(isDemoMode(db)).toBe(true);
    deleteSyntheticRows(db);
    expect(isDemoMode(db)).toBe(false);
  });

  it("refuses to switch demo mode on when there is no demo data", () => {
    expect(setDemoMode(true, db)).toBe(false);
    expect(isDemoMode(db)).toBe(false);
  });
});

describe("switching between demo and live", () => {
  const now = new Date().toISOString();

  beforeEach(() => {
    insertSnapshots([row(now, "live-line")], db);
    replaceSyntheticRows([row(now, "demo-line")], db);
  });

  it("shows only demo rows while demo mode is on", () => {
    expect(getLatestStatuses(db).map((r) => r.lineId)).toEqual(["demo-line"]);
    expect(getKnownLines(db).map((l) => l.lineId)).toEqual(["demo-line"]);
    expect(getDisruptionByLine({}, db).map((l) => l.lineId)).toEqual(["demo-line"]);
    expect(getSnapshotStats(db).total).toBe(1);
  });

  it("shows only live rows after switching back, and keeps the demo rows", () => {
    expect(setDemoMode(false, db)).toBe(true);
    expect(getLatestStatuses(db).map((r) => r.lineId)).toEqual(["live-line"]);
    expect(getKnownLines(db).map((l) => l.lineId)).toEqual(["live-line"]);
    expect(getDisruptionByLine({}, db).map((l) => l.lineId)).toEqual(["live-line"]);
    expect(hasSyntheticRows(db)).toBe(true);

    expect(setDemoMode(true, db)).toBe(true);
    expect(getLatestStatuses(db).map((r) => r.lineId)).toEqual(["demo-line"]);
  });

  it("treats a line filter as a value, not SQL", () => {
    expect(getDisruptionByLine({ line: "x' OR '1'='1" }, db)).toEqual([]);
  });
});
