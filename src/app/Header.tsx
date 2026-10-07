import Link from "next/link";
import { getSession, hasRole } from "@/lib/auth";
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
