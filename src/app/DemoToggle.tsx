"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

/** Admin switch between demo and live data; nothing is deleted either way. */
export function DemoToggle({ active }: { active: boolean }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function toggle() {
    setPending(true);
    setError(null);
    const res = await fetch("/api/demo", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !active }),
    });
    if (!res.ok) setError((await res.json()).error ?? "Switch failed");
    setPending(false);
    router.refresh();
  }

  return (
    <span className="demo-toggle">
      <button
        type="button"
        role="switch"
        aria-checked={active}
        aria-label="Show demo data"
        className="switch"
        onClick={toggle}
        disabled={pending}
      />
      <span>{active ? "Demo data" : "Live data"}</span>
      {error && <span className="error">{error}</span>}
    </span>
  );
}
