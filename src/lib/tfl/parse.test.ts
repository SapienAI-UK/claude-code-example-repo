import { describe, expect, it } from "vitest";
import fixture from "../../../tests/fixtures/tfl-status.json";
import { parseLineStatuses, type TflLine } from "./parse";
import { categorise, isDisrupted } from "./severity";

describe("parseLineStatuses (smoke test)", () => {
  const statuses = parseLineStatuses(fixture as TflLine[]);

  it("returns one status per line", () => {
    expect(statuses.map((s) => s.lineId)).toEqual([
      "bakerloo",
      "central",
      "district",
      "dlr",
      "elizabeth",
      "mildmay",
    ]);
  });

  it("keeps the worst status when a line reports several", () => {
    const district = statuses.find((s) => s.lineId === "district");
    expect(district?.statusDescription).toBe("Part Suspended");
    expect(categorise(district!.statusSeverity)).toBe("suspended");
  });

  it("does not count good service or overnight closure as disruption", () => {
    expect(isDisrupted(10)).toBe(false);
    expect(isDisrupted(20)).toBe(false);
    expect(isDisrupted(9)).toBe(true);
  });
});
