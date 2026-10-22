import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth";
import { pollOnce } from "@/lib/poller";

/** Triggers an immediate poll ("Poll now" on the admin page). */
export async function POST() {
  const auth = await requireRole("admin");
  if (!auth.ok) return auth.response;

  try {
    const stored = await pollOnce();
    return NextResponse.json({ stored });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Poll failed";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
