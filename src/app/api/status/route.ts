import { NextResponse } from "next/server";
import { getLatestStatuses } from "@/db/queries/status";
import { requireRole } from "@/lib/auth";

export async function GET() {
  const auth = await requireRole("viewer");
  if (!auth.ok) return auth.response;

  const lines = getLatestStatuses();
  return NextResponse.json({ polledAt: lines[0]?.polledAt ?? null, lines });
}
