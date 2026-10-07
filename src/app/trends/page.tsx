import Link from "next/link";
import { getKnownLines } from "@/db/queries/status";
import {
  getDisruptionByHour,
  getDisruptionByLine,
  getDisruptionByWeekday,
  type BucketDisruption,
} from "@/db/queries/trends";
import { requirePageRole } from "@/lib/auth";
import styles from "./trends.module.css";

export const dynamic = "force-dynamic";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function percent(disrupted: number, samples: number): number {
  return samples === 0 ? 0 : Math.round((disrupted / samples) * 100);
}

function Bars({ rows, label }: { rows: BucketDisruption[]; label: (bucket: number) => string }) {
  return (
    <table>
      <tbody>
        {rows.map((row) => {
          const pct = percent(row.disrupted, row.samples);
          return (
            <tr key={row.bucket}>
              <td className={styles.label}>{label(row.bucket)}</td>
              <td>
                <div className={styles.bar} style={{ width: `${pct}%` }} />
              </td>
              <td className={styles.value}>{pct}%</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default async function TrendsPage({ searchParams }: PageProps<"/trends">) {
  await requirePageRole("viewer");

  const { line } = await searchParams;
  const filter = { line: typeof line === "string" && line ? line : undefined };

  const byLine = getDisruptionByLine(filter);
  const byHour = getDisruptionByHour(filter);
  const byWeekday = getDisruptionByWeekday(filter);
  const lines = getKnownLines();

  if (byLine.length === 0 && !filter.line) {
    return (
      <main>
        <h1>Disruption trends</h1>
        <div className="panel">
          <p>No history yet.</p>
          <p className="muted">
            The poller adds a snapshot every 2 minutes, so trends fill in over time. To explore
            the page straight away, see <strong>Exercise 1</strong> in the README (
            <code>specs/01-demo-history.md</code>).
          </p>
        </div>
      </main>
    );
  }

  return (
    <main>
      <h1>Disruption trends</h1>
      <p className="muted">Last 30 days. Times are UTC.</p>

      <form className={styles.filter}>
        <label>
          Line
          <select name="line" defaultValue={filter.line ?? ""}>
            <option value="">All lines</option>
            {lines.map((l) => (
              <option key={l.lineId} value={l.lineId}>
                {l.lineName}
              </option>
            ))}
          </select>
        </label>
        <button type="submit">Apply</button>
        {filter.line && <Link href="/trends">Clear</Link>}
      </form>

      <h2>Most disrupted lines</h2>
      <table>
        <thead>
          <tr>
            <th>Line</th>
            <th>Mode</th>
            <th>Disrupted</th>
            <th>Samples</th>
          </tr>
        </thead>
        <tbody>
          {byLine.map((row) => (
            <tr key={row.lineId}>
              <td>{row.lineName}</td>
              <td className="muted">{row.mode}</td>
              <td>{percent(row.disrupted, row.samples)}%</td>
              <td className="muted">{row.samples}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>By hour of day</h2>
      <Bars rows={byHour} label={(h) => `${String(h).padStart(2, "0")}:00`} />

      <h2>By weekday</h2>
      <Bars rows={byWeekday} label={(d) => WEEKDAYS[d]} />
    </main>
  );
}
