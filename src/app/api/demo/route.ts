import { NextResponse } from "next/server";
import { deleteSyntheticRows, isDemoMode, replaceSyntheticRows, setDemoMode } from "@/db/queries/demo";
import { requireRole } from "@/lib/auth";
import { DEFAULT_SEED, generateSnapshots } from "@/lib/demo/generate";
import { fetchLineStatuses } from "@/lib/tfl/client";

// Each line adds ~65k rows, so a bus-sized line set would run to tens of millions.
const MAX_LINES = 100;
const MAX_SEED_LENGTH = 64;

/** Generates 90 days of demo history, replacing any existing demo rows. */
export async function POST(request: Request) {
  const auth = await requireRole("admin");
  if (!auth.ok) return auth.response;

  const body = (await request.json().catch(() => ({}))) as { seed?: unknown };
  let seed = DEFAULT_SEED;
  if (body.seed !== undefined && body.seed !== "") {
    if (typeof body.seed !== "string" || body.seed.length > MAX_SEED_LENGTH) {
      return NextResponse.json(
        { error: `Seed must be text of at most ${MAX_SEED_LENGTH} characters` },
        { status: 400 },
      );
    }
    seed = body.seed;
  }

  let lines;
  try {
    lines = (await fetchLineStatuses()).map(({ lineId, lineName, mode }) => ({
      lineId,
      lineName,
      mode,
    }));
  } catch (err) {
    const message = err instanceof Error ? err.message : "Could not load lines from TfL";
    return NextResponse.json({ error: message }, { status: 502 });
  }
  if (lines.length === 0) {
    return NextResponse.json({ error: "TfL returned no lines" }, { status: 502 });
  }
  if (lines.length > MAX_LINES) {
    return NextResponse.json(
      { error: `${lines.length} lines is too many for demo data (limit ${MAX_LINES}). Check TFL_MODES.` },
      { status: 400 },
    );
  }

  const rows = replaceSyntheticRows(generateSnapshots({ lines, seed }));
  return NextResponse.json({ rows, seed });
}

/** Removes generated rows only; real polled rows survive. */
export async function DELETE() {
  const auth = await requireRole("admin");
  if (!auth.ok) return auth.response;

  return NextResponse.json({ deleted: deleteSyntheticRows() });
}

/** Switches between demo and live data without deleting either. */
export async function PATCH(request: Request) {
  const auth = await requireRole("admin");
  if (!auth.ok) return auth.response;

  const body = (await request.json().catch(() => ({}))) as { active?: unknown };
  if (typeof body.active !== "boolean") {
    return NextResponse.json({ error: "active must be true or false" }, { status: 400 });
  }
  if (!setDemoMode(body.active)) {
    return NextResponse.json({ error: "No demo data to show. Generate it first." }, { status: 409 });
  }
  return NextResponse.json({ active: isDemoMode() });
}
