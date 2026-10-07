"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { checkCredentials } from "@/lib/auth/credentials";
import { createSessionToken, SESSION_COOKIE, SESSION_TTL_SECONDS } from "@/lib/auth/session";

export type LoginState = { error?: string };

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  const role = checkCredentials(username, password);
  if (!role) return { error: "That username and password don't match." };

  (await cookies()).set(SESSION_COOKIE, createSessionToken(username, role), {
    path: "/",
    sameSite: "lax",
    maxAge: SESSION_TTL_SECONDS,
  });
  redirect("/");
}

export async function logout() {
  (await cookies()).delete(SESSION_COOKIE);
  redirect("/login");
}
