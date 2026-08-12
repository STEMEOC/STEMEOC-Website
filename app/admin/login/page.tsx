import type { Metadata } from "next";
import { LoginForm } from "@/components/LoginForm";

export const metadata: Metadata = { title: "Admin Login" };

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-6">
      <div className="w-full max-w-sm">
        <div className="mb-4 flex justify-center gap-2">
          {["var(--color-blue)", "var(--color-red)", "var(--color-green)", "var(--color-orange)"].map((c) => (
            <div key={c} className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: c }} />
          ))}
        </div>
        <p className="font-mono-label text-center text-xs uppercase text-orange">
          STEMEOC Admin
        </p>
        <h1 className="mt-3 text-center font-display text-2xl font-semibold text-paper">
          Sign in to the dashboard
        </h1>
        <div className="mt-8 rounded-3xl bg-ink-soft p-8">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
