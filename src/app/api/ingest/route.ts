import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { pollOnce } from "@/lib/poller";

/** Triggers an immediate poll ("Poll now" on the admin page). */
export async function POST() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  try {
    const stored = await pollOnce();
    return NextResponse.json({ stored });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Poll failed";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
