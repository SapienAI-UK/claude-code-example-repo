import type { Role } from "./session";

/** Checks a login against the two accounts configured in env. */
export function checkCredentials(username: string, password: string): Role | null {
  if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
    return "admin";
  }
  if (username === process.env.VIEWER_USERNAME && password === process.env.VIEWER_PASSWORD) {
    return "viewer";
  }
  return null;
}
