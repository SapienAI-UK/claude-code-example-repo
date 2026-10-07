import { getSnapshotStats } from "@/db/queries/status";
import { requirePageRole } from "@/lib/auth";
import { getModes } from "@/lib/tfl/client";
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
          <tr>
            <th>Synthetic snapshots</th>
            <td>{stats.synthetic.toLocaleString("en-GB")}</td>
          </tr>
        </tbody>
      </table>

      <h2>Actions</h2>
      <PollNowButton />
    </main>
  );
}
