import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import { SESSION_COOKIE, verifySession, type Role, type Session } from "./session";

export type { Role, Session } from "./session";

const ROLE_RANK: Record<Role, number> = { viewer: 1, admin: 2 };

export function hasRole(session: Session, role: Role): boolean {
  return ROLE_RANK[session.role] >= ROLE_RANK[role];
}

export async function getSession(): Promise<Session | null> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  return token ? verifySession(token) : null;
}

type AuthResult = { ok: true; session: Session } | { ok: false; response: NextResponse };

/**
 * Call at the top of every API route handler:
 *
 *   const auth = await requireRole("admin");
 *   if (!auth.ok) return auth.response;
 */
export async function requireRole(role: Role): Promise<AuthResult> {
  const session = await getSession();
  if (!session) {
    return { ok: false, response: NextResponse.json({ error: "Not signed in" }, { status: 401 }) };
  }
  if (!hasRole(session, role)) {
    return { ok: false, response: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }
  return { ok: true, session };
}

/** Call at the top of every page that needs a signed-in user. */
export async function requirePageRole(role: Role): Promise<Session> {
  const session = await getSession();
  if (!session) redirect("/login");
  if (!hasRole(session, role)) redirect("/");
  return session;
}
