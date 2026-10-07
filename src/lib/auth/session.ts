import { createHmac, timingSafeEqual } from "node:crypto";

export type Role = "viewer" | "admin";

export type Session = {
  username: string;
  role: Role;
  /** Unix time in milliseconds. */
  expiresAt: number;
};

export const SESSION_COOKIE = "gw_session";
export const SESSION_TTL_SECONDS = 8 * 60 * 60;

function getSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error("SESSION_SECRET is not set (see .env.example)");
  return secret;
}

function sign(payload: string): string {
  return createHmac("sha256", getSecret()).update(payload).digest("base64url");
}

export function createSessionToken(username: string, role: Role): string {
  const session: Session = {
    username,
    role,
    expiresAt: Date.now() + SESSION_TTL_SECONDS * 1000,
  };
  const payload = Buffer.from(JSON.stringify(session)).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

export function verifySession(token: string): Session | null {
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;

  const expected = Buffer.from(sign(payload));
  const actual = Buffer.from(signature);
  if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) return null;

  try {
    const session = JSON.parse(Buffer.from(payload, "base64url").toString()) as Session;
    return session.expiresAt > Date.now() ? session : null;
  } catch {
    return null;
  }
}
