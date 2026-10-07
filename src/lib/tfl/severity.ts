/**
 * TfL reports a numeric statusSeverity per line. We collapse those into a
 * handful of categories the UI and trends understand.
 * Reference: https://api.tfl.gov.uk/Line/Meta/Severity
 */
export type StatusCategory = "good" | "minor" | "severe" | "suspended" | "closed";

const CATEGORY_BY_SEVERITY: Record<number, StatusCategory> = {
  0: "minor", // Special Service
  1: "closed", // Closed
  2: "suspended", // Suspended
  3: "suspended", // Part Suspended
  4: "closed", // Planned Closure
  5: "severe", // Part Closure
  6: "severe", // Severe Delays
  7: "minor", // Reduced Service
  8: "minor", // Bus Service
  9: "minor", // Minor Delays
  10: "good", // Good Service
  11: "severe", // Part Closed
  12: "minor", // Exit Only
  13: "minor", // No Step Free Access
  14: "minor", // Change of frequency
  15: "minor", // Diverted
  16: "suspended", // Not Running
  17: "minor", // Issues Reported
  18: "good", // No Issues
  19: "good", // Information
  20: "closed", // Service Closed (e.g. overnight)
};

/** Lower rank = worse for passengers. */
const RANK: Record<StatusCategory, number> = {
  suspended: 0,
  severe: 1,
  minor: 2,
  closed: 3,
  good: 4,
};

export function categorise(severity: number): StatusCategory {
  return CATEGORY_BY_SEVERITY[severity] ?? "minor";
}

export function isDisrupted(severity: number): boolean {
  const category = categorise(severity);
  return category === "minor" || category === "severe" || category === "suspended";
}

export function compareSeverity(a: number, b: number): number {
  return RANK[categorise(a)] - RANK[categorise(b)];
}

/** Severities that do not count as a disruption (good service or a scheduled closure). */
export const NON_DISRUPTED_SEVERITIES = Object.keys(CATEGORY_BY_SEVERITY)
  .map(Number)
  .filter((severity) => !isDisrupted(severity));
