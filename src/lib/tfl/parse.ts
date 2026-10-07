import { compareSeverity } from "./severity";

/** The subset of the TfL /Line/Mode/{modes}/Status response we use. */
export type TflLine = {
  id: string;
  name: string;
  modeName: string;
  lineStatuses: {
    statusSeverity: number;
    statusSeverityDescription: string;
    reason?: string;
  }[];
};

export type LineStatus = {
  lineId: string;
  lineName: string;
  mode: string;
  statusSeverity: number;
  statusDescription: string;
  reason: string | null;
};

/** A line can report several statuses at once; we keep the worst one. */
export function parseLineStatuses(lines: TflLine[]): LineStatus[] {
  return lines.map((line) => {
    const worst = [...line.lineStatuses].sort((a, b) =>
      compareSeverity(a.statusSeverity, b.statusSeverity),
    )[0];

    return {
      lineId: line.id,
      lineName: line.name,
      mode: line.modeName,
      statusSeverity: worst?.statusSeverity ?? 10,
      statusDescription: worst?.statusSeverityDescription ?? "Good Service",
      reason: worst?.reason?.trim() || null,
    };
  });
}
