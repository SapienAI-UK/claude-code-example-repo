"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function PollNowButton() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function pollNow() {
    setPending(true);
    setMessage(null);
    const res = await fetch("/api/ingest", { method: "POST" });
    const body = await res.json();
    setMessage(res.ok ? `Stored ${body.stored} line statuses.` : `Poll failed: ${body.error}`);
    setPending(false);
    router.refresh();
  }

  return (
    <div className="stack" style={{ alignItems: "flex-start" }}>
      <button onClick={pollNow} disabled={pending}>
        {pending ? "Polling..." : "Poll now"}
      </button>
      {message && <p className="muted">{message}</p>}
    </div>
  );
}
