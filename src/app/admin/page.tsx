import { getSnapshotStats } from "@/db/queries/status";
import { requirePageRole } from "@/lib/auth";
import { hasSyntheticRows, isDemoMode } from "@/db/queries/demo";
import { getModes } from "@/lib/tfl/client";
import { DemoToggle } from "../DemoToggle";
import { DemoDataActions } from "./DemoDataActions";
import { PollNowButton } from "./PollNowButton";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  await requirePageRole("admin");
  const stats = getSnapshotStats();

  return (
    <main>
      <h1>Admin</h1>

      <table>
        <tbody>
          <tr>
            <th>Modes polled</th>
            <td>{getModes()}</td>
          </tr>
          <tr>
            <th>Last poll</th>
            <td>
              {stats.lastPolledAt
                ? new Date(stats.lastPolledAt).toLocaleString("en-GB")
                : "Not yet"}
            </td>
          </tr>
          <tr>
            <th>Snapshots stored</th>
            <td>{stats.total.toLocaleString("en-GB")}</td>
          </tr>
        </tbody>
      </table>

      <h2>Actions</h2>
      <PollNowButton />

      <h2>Demo data</h2>
      {hasSyntheticRows() && <DemoToggle active={isDemoMode()} />}
      <DemoDataActions hasDemoData={hasSyntheticRows()} />
    </main>
  );
}
