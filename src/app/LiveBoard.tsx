"use client";

import { useEffect, useState } from "react";
import type { Snapshot } from "@/db/schema";
import styles from "./board.module.css";

const REFRESH_MS = 60 * 1000;

export function LiveBoard({ initialLines }: { initialLines: Snapshot[] }) {
  const [lines, setLines] = useState(initialLines);

  useEffect(() => {
    const id = setInterval(async () => {
      const res = await fetch("/api/status");
      if (res.ok) setLines((await res.json()).lines);
    }, REFRESH_MS);
    return () => clearInterval(id);
  }, []);

  if (lines.length === 0) {
    return (
      <p className="muted">
        Waiting for the first poll. The server polls TfL every 2 minutes; refresh in a moment.
      </p>
    );
  }

  return (
    <>
      <p className="muted">
        Last updated {new Date(lines[0].polledAt).toLocaleTimeString("en-GB")}
      </p>
      <table>
        <thead>
          <tr>
            <th>Line</th>
            <th>Mode</th>
            <th>Status</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          {lines.map((line) => (
            <tr key={line.lineId}>
              <td>{line.lineName}</td>
              <td className="muted">{line.mode}</td>
              <td>
                <span className={styles.status}>{line.statusDescription}</span>
              </td>
              <td className={styles.reason}>{line.reason ?? "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
