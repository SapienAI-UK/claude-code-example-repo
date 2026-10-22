import { describe, expect, it } from "vitest";
import { isDisrupted } from "@/lib/tfl/severity";
import { DEMO_DAYS, generateSnapshots, type DemoLine } from "./generate";

const LINES: DemoLine[] = [
  { lineId: "bakerloo", lineName: "Bakerloo", mode: "tube" },
  { lineId: "central", lineName: "Central", mode: "tube" },
  { lineId: "jubilee", lineName: "Jubilee", mode: "tube" },
  { lineId: "dlr", lineName: "DLR", mode: "dlr" },
  { lineId: "elizabeth", lineName: "Elizabeth line", mode: "elizabeth-line" },
];
// A Wednesday in winter, so London time equals UTC.
const NOW = new Date("2026-01-14T12:00:00.000Z");

const rows = (seed?: string) => [...generateSnapshots({ lines: LINES, seed, now: NOW })];

describe("generateSnapshots", () => {
  const all = rows("test-seed");

  it("produces one row per line every two minutes for 90 days", () => {
    expect(all).toHaveLength(LINES.length * DEMO_DAYS * 720);
    const central = all.filter((r) => r.lineId === "central");
    expect(central[0].polledAt).toBe("2025-10-16T12:02:00.000Z");
    expect(central.at(-1)!.polledAt).toBe(NOW.toISOString());
    const gaps = new Set(
      central.slice(1).map((r, i) => Date.parse(r.polledAt) - Date.parse(central[i].polledAt)),
    );
    expect([...gaps]).toEqual([120_000]);
  });

  it("marks every row as synthetic", () => {
    expect(all.every((r) => r.isSynthetic)).toBe(true);
  });

  it("is repeatable for the same seed and differs for another", () => {
    expect(rows("test-seed")).toEqual(all);
    expect(rows("other-seed")).not.toEqual(all);
  });

  it("does not depend on which other lines are polled", () => {
    const alone = [
      ...generateSnapshots({ lines: [LINES[1], LINES[0]], seed: "test-seed", now: NOW }),
    ].filter((r) => r.lineId === "central" && !r.reason?.includes("signal failure at"));
    const together = all.filter((r) => r.lineId === "central" && !r.reason?.includes("signal failure at"));
    expect(alone.map((r) => r.statusSeverity)).toEqual(together.map((r) => r.statusSeverity));
  });

  it("is more disrupted in weekday rush hours than mid-morning off-peak", () => {
    const share = (hours: number[]) => {
      const sample = all.filter((r) => {
        const d = new Date(r.polledAt);
        const weekday = d.getUTCDay() >= 1 && d.getUTCDay() <= 5;
        return weekday && hours.includes(d.getUTCHours());
      });
      return sample.filter((r) => isDisrupted(r.statusSeverity)).length / sample.length;
    };
    expect(share([7, 8, 9, 16, 17, 18])).toBeGreaterThan(share([11, 12, 13, 14]) * 1.5);
  });

  it("has lines of clearly different reliability", () => {
    const shares = LINES.map((line) => {
      const own = all.filter((r) => r.lineId === line.lineId);
      return own.filter((r) => isDisrupted(r.statusSeverity)).length / own.length;
    });
    expect(Math.max(...shares)).toBeGreaterThan(Math.min(...shares) * 1.3);
  });

  it("closes rail lines overnight with a service-closed status", () => {
    const overnight = all.filter((r) => r.mode === "tube" && new Date(r.polledAt).getUTCHours() === 3);
    expect(overnight.length).toBeGreaterThan(0);
    expect(overnight.every((r) => r.statusSeverity === 20)).toBe(true);
  });

  it("gives every disruption a reason and good service none", () => {
    for (const r of all) {
      if (isDisrupted(r.statusSeverity)) expect(r.reason).toBeTruthy();
      if (r.statusSeverity === 10) expect(r.reason).toBeNull();
    }
  });

  it("ends with several lines sharing one cause", () => {
    const lastSlot = all.filter((r) => r.polledAt === NOW.toISOString());
    const affected = lastSlot.filter((r) => r.statusSeverity === 6 && r.reason?.includes("signal failure"));
    expect(affected.length).toBeGreaterThanOrEqual(2);
    expect(new Set(affected.map((r) => r.reason)).size).toBe(1);
  });

  it("always ends with a spread of statuses across different lines", () => {
    const lines = [
      ...LINES,
      { lineId: "northern", lineName: "Northern", mode: "tube" },
      { lineId: "victoria", lineName: "Victoria", mode: "tube" },
      { lineId: "mildmay", lineName: "Mildmay", mode: "overground" },
    ];
    for (const seed of ["a", "b", "c", "test-seed"]) {
      const last = [...generateSnapshots({ lines, seed, now: NOW })].filter(
        (r) => r.polledAt === NOW.toISOString(),
      );
      const severities = new Set(last.map((r) => r.statusSeverity));
      for (const expected of [3, 5, 6, 7, 9]) expect(severities).toContain(expected);
      expect(last.some((r) => r.statusSeverity === 10)).toBe(true);
    }
  });

  it("copes with very few lines", () => {
    const few = [...generateSnapshots({ lines: LINES.slice(0, 2), seed: "x", now: NOW })];
    expect(few).toHaveLength(2 * DEMO_DAYS * 720);
  });

  describe("related lines", () => {
    const related: DemoLine[] = [
      { lineId: "circle", lineName: "Circle", mode: "tube" },
      { lineId: "district", lineName: "District", mode: "tube" },
      { lineId: "hammersmith-city", lineName: "Hammersmith & City", mode: "tube" },
      { lineId: "metropolitan", lineName: "Metropolitan", mode: "tube" },
      { lineId: "central", lineName: "Central", mode: "tube" },
    ];
    const subSurface = new Set(["circle", "district", "hammersmith-city", "metropolitan"]);
    const out = [...generateSnapshots({ lines: related, seed: "link", now: NOW })];
    const knockOns = out.filter((r) => r.reason?.includes("due to an earlier"));

    it("gives knock-on delays on related lines that cite the original line and cause", () => {
      expect(knockOns.length).toBeGreaterThan(100);
      for (const r of knockOns) {
        expect(subSurface.has(r.lineId)).toBe(true);
        const match = r.reason!.match(/earlier (.+) at (.+) on the (.+)\.$/);
        expect(match).not.toBeNull();
        const source = out.find(
          (o) =>
            o.lineName === match![3] &&
            o.reason?.includes(`due to a ${match![1]} at ${match![2]}.`) &&
            Math.abs(Date.parse(o.polledAt) - Date.parse(r.polledAt)) <= 60 * 120_000,
        );
        expect(source).toBeDefined();
      }
    });

    it("never links unrelated lines", () => {
      expect(out.filter((r) => r.lineId === "central" && r.reason?.includes("earlier"))).toEqual([]);
    });
  });
});
