import { getLatestStatuses } from "@/db/queries/status";
import { isDemoMode } from "@/db/queries/demo";
import { requirePageRole } from "@/lib/auth";
import { LiveBoard } from "./LiveBoard";

export const dynamic = "force-dynamic";

export default async function BoardPage() {
  await requirePageRole("viewer");
  const lines = getLatestStatuses();

  return (
    <main>
      <h1>Live line status</h1>
      {/* LiveBoard keeps its own copy of the rows, so remount it when the data source changes. */}
      <LiveBoard key={isDemoMode() ? "demo" : "live"} initialLines={lines} />
    </main>
  );
}
