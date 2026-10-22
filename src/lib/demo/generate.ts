import type { NewSnapshot } from "@/db/schema";
import { POLL_INTERVAL_MS } from "@/lib/poller";

export const DEMO_DAYS = 90;
export const DEFAULT_SEED = "gapwatch-demo";

export type DemoLine = { lineId: string; lineName: string; mode: string };

export type GenerateOptions = {
  lines: DemoLine[];
  seed?: string;
  /** Window ends at the latest poll slot at or before this time. */
  now?: Date;
};

const SLOTS = (DEMO_DAYS * 24 * 60 * 60 * 1000) / POLL_INTERVAL_MS;
/** Length of the "happening now" incident, in poll slots (one hour). */
const SCENARIO_SLOTS = 30;

/** Modes that stop running overnight; buses, river buses and cable cars are treated as always on. */
const OVERNIGHT_CLOSED_MODES = new Set(["tube", "dlr", "overground", "elizabeth-line", "tram"]);
const OVERNIGHT_HOURS = new Set([1, 2, 3, 4]);
const RUSH_HOURS = new Set([7, 8, 9, 16, 17, 18]);
const WEEKDAYS = new Set(["Mon", "Tue", "Wed", "Thu", "Fri"]);

const DESCRIPTIONS: Record<number, string> = {
  3: "Part Suspended",
  5: "Part Closure",
  6: "Severe Delays",
  7: "Reduced Service",
  9: "Minor Delays",
  10: "Good Service",
  20: "Service Closed",
};

// Cumulative weights; severity codes follow src/lib/tfl/severity.ts.
const SEVERITY_MIX: { upTo: number; severity: number }[] = [
  { upTo: 0.6, severity: 9 },
  { upTo: 0.8, severity: 6 },
  { upTo: 0.88, severity: 7 },
  { upTo: 0.95, severity: 5 },
  { upTo: 1, severity: 3 },
];

const LOCATIONS = [
  "Baker Street",
  "Stratford",
  "Bank",
  "King's Cross",
  "Waterloo",
  "Canary Wharf",
  "Victoria",
  "Paddington",
  "Whitechapel",
  "Clapham Junction",
];

const REASON_TEMPLATES: Record<number, string[]> = {
  9: [
    "Minor delays due to a faulty train at {place}.",
    "Minor delays due to customer action at {place}.",
    "Minor delays while we deal with a trespasser on the track near {place}.",
    "Minor delays due to a points failure at {place}.",
  ],
  6: [
    "Severe delays due to a signal failure at {place}.",
    "Severe delays due to a track fault near {place}.",
    "Severe delays due to a power supply problem at {place}.",
    "Severe delays due to an unwell passenger at {place}.",
  ],
  7: [
    "Reduced service due to train crew availability.",
    "Reduced service while a faulty train is removed at {place}.",
  ],
  5: [
    "Part closure due to planned engineering works between {place} and {place2}.",
    "Part closure due to a fire alert at {place}.",
  ],
  3: [
    "Part suspended due to a signal failure at {place}.",
    "Part suspended due to flooding near {place}.",
    "Part suspended due to a person ill on a train at {place}.",
  ],
};

/** mulberry32: small, fast, good enough for demo data. */
function createRng(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** FNV-1a, so each line gets its own stream that doesn't depend on the other lines. */
function hash(text: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

const londonParts = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Europe/London",
  hour: "numeric",
  hourCycle: "h23",
  weekday: "short",
});

type Slot = { polledAt: string; hour: number; weekday: boolean };

/** Computed once and shared by every line; formatting a million timestamps would be slow. */
function buildSlots(now: Date): Slot[] {
  const last = Math.floor(now.getTime() / POLL_INTERVAL_MS) * POLL_INTERVAL_MS;
  const slots: Slot[] = [];
  for (let i = SLOTS - 1; i >= 0; i--) {
    const at = new Date(last - i * POLL_INTERVAL_MS);
    const parts = londonParts.formatToParts(at);
    const hour = Number(parts.find((p) => p.type === "hour")!.value);
    const weekday = WEEKDAYS.has(parts.find((p) => p.type === "weekday")!.value);
    slots.push({ polledAt: at.toISOString(), hour, weekday });
  }
  return slots;
}

function pick<T>(rng: () => number, items: T[]): T {
  return items[Math.floor(rng() * items.length)];
}

function makeReason(rng: () => number, severity: number): string {
  const place = pick(rng, LOCATIONS);
  const place2 = pick(
    rng,
    LOCATIONS.filter((l) => l !== place),
  );
  return pick(rng, REASON_TEMPLATES[severity])
    .replace("{place}", place)
    .replace("{place2}", place2);
}

function pickSeverity(rng: () => number): number {
  const roll = rng();
  return SEVERITY_MIX.find((entry) => roll < entry.upTo)!.severity;
}

/** Lines that share track, so one failure on one tends to hit the others too. */
const RELATED_LINE_GROUPS = [
  ["circle", "district", "hammersmith-city", "metropolitan"], // shared sub-surface track
  ["bakerloo", "lioness"], // shared track between Queen's Park and Harrow & Wealdstone
];

/** Chance multiplier for an incident starting in this slot: worse in weekday rush hours, quieter at weekends. */
function incidentPressure(slot: Slot): number {
  let pressure = 1;
  if (RUSH_HOURS.has(slot.hour) && slot.weekday) pressure *= 3;
  else if (RUSH_HOURS.has(slot.hour)) pressure *= 1.3;
  if (!slot.weekday) pressure *= 0.6;
  return pressure;
}

const CAUSES = [
  "signal failure",
  "faulty train",
  "track fault",
  "power supply problem",
  "customer incident",
];
const PRIMARY_PREFIX: Record<number, string> = {
  6: "Severe delays",
  9: "Minor delays",
  3: "Part suspended",
  7: "Reduced service",
};
// Per poll slot; applied on top of the weekday/rush pressure and split across lines in the group.
const GROUP_INCIDENT_CHANCE = 0.0005;

type Incident = { severity: number; reason: string };
type LinkedEvent = { lineId: string; start: number; end: number; incident: Incident };

/**
 * One cause hits a primary line, and the lines it shares track with get
 * knock-on minor delays a few minutes later that cite the original cause.
 */
function buildLinkedEvents(lines: DemoLine[], slots: Slot[], seed: string): Map<string, LinkedEvent[]> {
  const byLine = new Map<string, LinkedEvent[]>();
  const present = new Map(lines.map((line) => [line.lineId, line]));

  for (const ids of RELATED_LINE_GROUPS) {
    const group = ids.flatMap((id) => present.get(id) ?? []);
    if (group.length < 2) continue;

    const rng = createRng(hash(`${seed}:group:${ids[0]}`));
    let busyUntil = 0;
    for (let i = 0; i < slots.length; i++) {
      if (i < busyUntil || rng() >= GROUP_INCIDENT_CHANCE * incidentPressure(slots[i])) continue;

      const primary = pick(rng, group);
      const severity = pick(rng, [6, 6, 9, 3, 7]);
      const cause = pick(rng, CAUSES);
      const place = pick(rng, LOCATIONS);
      const length = 6 + Math.floor(rng() * 50);
      busyUntil = i + length;

      const add = (line: DemoLine, start: number, incident: Incident) => {
        const events = byLine.get(line.lineId) ?? [];
        events.push({ lineId: line.lineId, start, end: Math.min(start + length, slots.length), incident });
        byLine.set(line.lineId, events);
      };

      add(primary, i, {
        severity,
        reason: `${PRIMARY_PREFIX[severity]} on the ${primary.lineName} due to a ${cause} at ${place}.`,
      });
      for (const other of group) {
        if (other === primary || rng() >= 0.75) continue;
        add(other, i + 1 + Math.floor(rng() * 4), {
          severity: 9,
          reason: `Minor delays on the ${other.lineName} due to an earlier ${cause} at ${place} on the ${primary.lineName}.`,
        });
      }
    }
  }
  return byLine;
}

/** Statuses forced onto other lines "right now", so the board never shows only good service. */
const SPREAD_SEVERITIES = [9, 7, 5, 3];

/**
 * What is happening in the final hour: two related lines share a single
 * cause, and a few other lines each get a different status.
 */
function pickScenario(lines: DemoLine[], seed: string): Map<string, Incident> {
  const rng = createRng(hash(`${seed}:scenario`));
  const sorted = [...lines].sort((a, b) => a.lineId.localeCompare(b.lineId));
  const byMode = new Map<string, DemoLine[]>();
  for (const line of sorted) {
    if (!OVERNIGHT_CLOSED_MODES.has(line.mode)) continue;
    byMode.set(line.mode, [...(byMode.get(line.mode) ?? []), line]);
  }
  const related = RELATED_LINE_GROUPS.map((ids) =>
    sorted.filter((line) => ids.includes(line.lineId)),
  ).filter((group) => group.length >= 2);
  const sameMode = [...byMode.values()].filter((group) => group.length >= 2);
  const candidates = related.length > 0 ? related : sameMode;
  const group = candidates.length > 0 ? pick(rng, candidates) : sorted;
  const first = Math.floor(rng() * Math.max(group.length - 1, 1));
  const affected = group.slice(first, first + 2);

  const place = pick(rng, LOCATIONS);
  const names = affected.map((line) => line.lineName).join(" and ");
  const shared: Incident = {
    severity: 6,
    reason: `Severe delays on the ${names} due to a signal failure at ${place}.`,
  };
  const incidents = new Map(affected.map((line) => [line.lineId, shared]));

  // Fisher-Yates over the remaining lines, so which lines are hit varies by seed.
  const others = sorted.filter((line) => !incidents.has(line.lineId));
  for (let i = others.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [others[i], others[j]] = [others[j], others[i]];
  }
  SPREAD_SEVERITIES.forEach((severity, i) => {
    if (others[i]) incidents.set(others[i].lineId, { severity, reason: makeReason(rng, severity) });
  });

  return incidents;
}

/**
 * Yields one row per line per two minutes for the last 90 days, shaped like
 * the poller's output. The same seed, lines and (two-minute-rounded) end time
 * always give the same rows. Lazy because the full set is around a million rows.
 */
export function* generateSnapshots({
  lines,
  seed = DEFAULT_SEED,
  now = new Date(),
}: GenerateOptions): Generator<NewSnapshot> {
  const slots = buildSlots(now);
  const scenario = pickScenario(lines, seed);
  const linked = buildLinkedEvents(lines, slots, seed);

  for (const line of lines) {
    const rng = createRng(hash(`${seed}:${line.lineId}`));
    // Squared so most lines are fine and a few are noticeably worse.
    const reliability = 0.4 + rng() * rng() * 3;
    const closesOvernight = OVERNIGHT_CLOSED_MODES.has(line.mode);
    const incident = scenario.get(line.lineId);
    const overlay = new Map<number, Incident>();
    for (const event of linked.get(line.lineId) ?? []) {
      for (let i = event.start; i < event.end; i++) overlay.set(i, event.incident);
    }

    let episodeSlotsLeft = 0;
    let episodeSeverity = 10;
    let episodeReason: string | null = null;

    for (let i = 0; i < slots.length; i++) {
      const slot = slots[i];
      let severity = 10;
      let reason: string | null = null;

      if (closesOvernight && OVERNIGHT_HOURS.has(slot.hour)) {
        episodeSlotsLeft = 0;
        severity = 20;
      } else {
        if (episodeSlotsLeft === 0) {
          const startChance = 0.0015 * reliability * incidentPressure(slot);

          if (rng() < startChance) {
            episodeSeverity = pickSeverity(rng);
            episodeReason = makeReason(rng, episodeSeverity);
            // 10 minutes to two hours.
            episodeSlotsLeft = 5 + Math.floor(rng() * 56);
          }
        }
        if (episodeSlotsLeft > 0) {
          severity = episodeSeverity;
          reason = episodeReason;
          episodeSlotsLeft--;
        }
      }

      const linkedIncident = overlay.get(i);
      if (linkedIncident && !(closesOvernight && OVERNIGHT_HOURS.has(slot.hour))) {
        severity = linkedIncident.severity;
        reason = linkedIncident.reason;
      }

      if (incident && i >= slots.length - SCENARIO_SLOTS) {
        severity = incident.severity;
        reason = incident.reason;
      }

      yield {
        lineId: line.lineId,
        lineName: line.lineName,
        mode: line.mode,
        statusSeverity: severity,
        statusDescription: DESCRIPTIONS[severity],
        reason,
        isSynthetic: true,
        polledAt: slot.polledAt,
      };
    }
  }
}
