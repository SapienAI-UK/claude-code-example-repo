import { getDb, type Db } from "@/db/client";
import { insertSnapshots } from "@/db/queries/status";
import { isDemoMode } from "@/db/queries/demo";
import { fetchLineStatuses } from "./tfl/client";

export const POLL_INTERVAL_MS = 2 * 60 * 1000;

declare global {
  var __gapwatchPollerStarted: boolean | undefined;
}

/**
 * Fetches current line statuses from TfL and stores one row per line.
 * Stores nothing while demo data exists: this is the one place every poll
 * (timer and manual) goes through, so no real row can mix into the demo history.
 */
export async function pollOnce(db: Db = getDb()): Promise<number> {
  if (isDemoMode(db)) return 0;

  const statuses = await fetchLineStatuses();
  const polledAt = new Date().toISOString();
  return insertSnapshots(
    statuses.map((status) => ({ ...status, polledAt })),
    db,
  );
}

/**
 * Starts polling for as long as the server runs. Called once from
 * instrumentation.ts; the global flag stops dev hot reloads from
 * starting a second timer.
 */
export function startPoller(): void {
  if (globalThis.__gapwatchPollerStarted) return;
  globalThis.__gapwatchPollerStarted = true;

  const run = () =>
    pollOnce()
      .then((stored) => console.log(`[poller] stored ${stored} line statuses`))
      .catch((err) =>
        console.error(
          "[poller] poll failed:",
          err instanceof Error ? err.message : err,
          "- has `npm run db:migrate` been run?",
        ),
      );

  void run();
  setInterval(run, POLL_INTERVAL_MS);
}
