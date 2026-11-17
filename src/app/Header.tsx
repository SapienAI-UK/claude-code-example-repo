import Link from "next/link";
import { hasSyntheticRows, isDemoMode } from "@/db/queries/demo";
import { getSession, hasRole } from "@/lib/auth";
import { DemoToggle } from "./DemoToggle";
import { logout } from "./login/actions";

export async function Header() {
  const session = await getSession();

  return (
    <header className="site-header">
      <Link href="/" className="brand">
        Gapwatch
      </Link>
      {session && (
        <nav>
          <Link href="/">Live board</Link>
          <Link href="/trends">Trends</Link>
          {hasRole(session, "admin") && <Link href="/admin">Admin</Link>}
          {hasRole(session, "admin") && hasSyntheticRows() && <DemoToggle active={isDemoMode()} />}
          <span className="muted">
            {session.username} ({session.role})
          </span>
          <form action={logout}>
            <button type="submit" className="link-button">
              Sign out
            </button>
          </form>
        </nav>
      )}
    </header>
  );
}
