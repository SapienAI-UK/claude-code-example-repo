import { isDemoMode } from "@/db/queries/demo";
import { getSession } from "@/lib/auth";

export async function DemoBanner() {
  if (!(await getSession()) || !isDemoMode()) return null;

  return (
    <div className="demo-banner" role="status">
      <strong>Demo data is showing.</strong> Live polling is paused until an admin switches back to
      live data.
    </div>
  );
}
