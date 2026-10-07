import { NextResponse, type NextRequest } from "next/server";
import {
  getDisruptionByHour,
  getDisruptionByLine,
  getDisruptionByWeekday,
} from "@/db/queries/trends";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const filter = {
    line: params.get("line") ?? undefined,
    days: params.has("days") ? Number(params.get("days")) : undefined,
  };

  return NextResponse.json({
    byLine: getDisruptionByLine(filter),
    byHour: getDisruptionByHour(filter),
    byWeekday: getDisruptionByWeekday(filter),
  });
}
