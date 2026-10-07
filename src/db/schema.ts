import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

/**
 * One row per line per poll. The poller writes a full set of rows every
 * two minutes, so "share of samples that were disrupted" is a fair proxy
 * for "share of time disrupted".
 */
export const statusSnapshots = sqliteTable(
  "status_snapshots",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    lineId: text("line_id").notNull(),
    lineName: text("line_name").notNull(),
    mode: text("mode").notNull(),
    statusSeverity: integer("status_severity").notNull(),
    statusDescription: text("status_description").notNull(),
    reason: text("reason"),
    isSynthetic: integer("is_synthetic", { mode: "boolean" }).notNull().default(false),
    /** ISO-8601 UTC, e.g. 2026-10-06T08:14:00.000Z */
    polledAt: text("polled_at").notNull(),
  },
  (t) => [
    index("idx_snapshots_polled_at").on(t.polledAt),
    index("idx_snapshots_line_id").on(t.lineId),
  ],
);

export type Snapshot = typeof statusSnapshots.$inferSelect;
export type NewSnapshot = typeof statusSnapshots.$inferInsert;
