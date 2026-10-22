"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function DemoDataActions({ hasDemoData }: { hasDemoData: boolean }) {
  const router = useRouter();
  const [pending, setPending] = useState<"generate" | "clear" | null>(null);
  const [seed, setSeed] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  async function generate() {
    setPending("generate");
    setMessage(null);
    const res = await fetch("/api/demo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ seed }),
    });
    const body = await res.json();
    setMessage(
      res.ok
        ? `Generated ${body.rows.toLocaleString("en-GB")} demo rows (seed "${body.seed}").`
        : `Generate failed: ${body.error}`,
    );
    setPending(null);
    router.refresh();
  }

  async function clear() {
    if (!window.confirm("Clear all demo data? Real polled data is kept and live polling resumes. Use the Demo data switch instead to keep it.")) {
      return;
    }
    setPending("clear");
    setMessage(null);
    const res = await fetch("/api/demo", { method: "DELETE" });
    const body = await res.json();
    setMessage(
      res.ok
        ? `Cleared ${body.deleted.toLocaleString("en-GB")} demo rows.`
        : `Clear failed: ${body.error}`,
    );
    setPending(null);
    router.refresh();
  }

  return (
    <div className="stack" style={{ alignItems: "flex-start" }}>
      <label className="stack" style={{ gap: 4 }}>
        <span>Seed (optional)</span>
        <input
          value={seed}
          onChange={(event) => setSeed(event.target.value)}
          placeholder="Leave blank for the default seed"
          maxLength={64}
          disabled={pending !== null}
        />
      </label>
      <button onClick={generate} disabled={pending !== null}>
        {pending === "generate" ? "Generating..." : "Generate demo data"}
      </button>
      <button onClick={clear} disabled={pending !== null || !hasDemoData}>
        {pending === "clear" ? "Clearing..." : "Clear demo data"}
      </button>
      {message && <p className="muted">{message}</p>}
    </div>
  );
}
