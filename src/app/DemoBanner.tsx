import { isDemoMode } from "@/db/queries/demo";

export function DemoBanner() {
  if (!isDemoMode()) return null;

  return (
    <div className="demo-banner" role="status">
      <strong>Demo data is showing.</strong> Live polling is paused until an admin switches back to
      live data.
    </div>
  );
}
