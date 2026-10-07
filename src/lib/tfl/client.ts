import { parseLineStatuses, type LineStatus, type TflLine } from "./parse";

const TFL_BASE_URL = "https://api.tfl.gov.uk";
export const DEFAULT_MODES = "tube,dlr,overground,elizabeth-line";

/** Comma-separated TfL modes to poll, from TFL_MODES (see .env.example). */
export function getModes(): string {
  return process.env.TFL_MODES?.trim() || DEFAULT_MODES;
}

export async function fetchLineStatuses(modes: string = getModes()): Promise<LineStatus[]> {
  const modePath = modes
    .split(",")
    .map((mode) => encodeURIComponent(mode.trim()))
    .filter(Boolean)
    .join(",");

  const res = await fetch(`${TFL_BASE_URL}/Line/Mode/${modePath}/Status`, {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`TfL API responded ${res.status} ${res.statusText}`);
  }

  return parseLineStatuses((await res.json()) as TflLine[]);
}
