import { getLatestStatuses } from "@/db/queries/status";
import { requirePageRole } from "@/lib/auth";
import { LiveBoard } from "./LiveBoard";

export const dynamic = "force-dynamic";

export default async function BoardPage() {
  await requirePageRole("viewer");
  const lines = getLatestStatuses();

  return (
    <main>
      <h1>Live line status</h1>
      <LiveBoard initialLines={lines} />
    </main>
  );
}
