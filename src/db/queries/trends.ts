import { sql, type SQL } from "drizzle-orm";
import { NON_DISRUPTED_SEVERITIES } from "@/lib/tfl/severity";
import { getDb, type Db } from "../client";

export type TrendFilter = {
  /** TfL line id, e.g. "central". Omit for all lines. */
  line?: string;
  /** Look-back window in days. */
  days?: number;
};

export type LineDisruption = {
  lineId: string;
  lineName: string;
  mode: string;
  samples: number;
  disrupted: number;
};

export type BucketDisruption = {
  bucket: number;
  samples: number;
  disrupted: number;
};

const DEFAULT_DAYS = 30;

const disruptedCase = sql.raw(
  `CASE WHEN status_severity IN (${NON_DISRUPTED_SEVERITIES.join(", ")}) THEN 0 ELSE 1 END`,
);

function buildWhere({ line, days }: TrendFilter): SQL {
  const lookBack = Number.isFinite(days) && days! > 0 ? days! : DEFAULT_DAYS;
  const since = new Date(Date.now() - lookBack * 24 * 60 * 60 * 1000).toISOString();

  const conditions = [`polled_at >= '${since}'`];
  if (line) conditions.push(`line_id = '${line}'`);

  return sql.raw(`WHERE ${conditions.join(" AND ")}`);
}

/** Lines ranked by share of samples that were disrupted. */
export function getDisruptionByLine(filter: TrendFilter = {}, db: Db = getDb()): LineDisruption[] {
  return db.all<LineDisruption>(sql`
    SELECT line_id AS lineId,
           line_name AS lineName,
           mode,
           COUNT(*) AS samples,
           SUM(${disruptedCase}) AS disrupted
    FROM status_snapshots
    ${buildWhere(filter)}
    GROUP BY line_id
    ORDER BY CAST(SUM(${disruptedCase}) AS REAL) / COUNT(*) DESC, line_name
  `);
}

/** Disruption by hour of day (0-23, UTC). */
export function getDisruptionByHour(filter: TrendFilter = {}, db: Db = getDb()): BucketDisruption[] {
  return db.all<BucketDisruption>(sql`
    SELECT CAST(strftime('%H', polled_at) AS INTEGER) AS bucket,
           COUNT(*) AS samples,
           SUM(${disruptedCase}) AS disrupted
    FROM status_snapshots
    ${buildWhere(filter)}
    GROUP BY bucket
    ORDER BY bucket
  `);
}

/** Disruption by weekday (0 = Sunday ... 6 = Saturday, UTC). */
export function getDisruptionByWeekday(
  filter: TrendFilter = {},
  db: Db = getDb(),
): BucketDisruption[] {
  return db.all<BucketDisruption>(sql`
    SELECT CAST(strftime('%w', polled_at) AS INTEGER) AS bucket,
           COUNT(*) AS samples,
           SUM(${disruptedCase}) AS disrupted
    FROM status_snapshots
    ${buildWhere(filter)}
    GROUP BY bucket
    ORDER BY bucket
  `);
}
