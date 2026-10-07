import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { LoginForm } from "./LoginForm";

export default async function LoginPage() {
  if (await getSession()) redirect("/");

  return (
    <main className="narrow">
      <h1>Sign in</h1>
      <p className="muted">Use the viewer or admin account from your env file.</p>
      <LoginForm />
    </main>
  );
}
