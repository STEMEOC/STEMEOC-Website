"use client";

import { useActionState } from "react";
import { loginAction, type LoginState } from "@/lib/actions/auth";

const initialState: LoginState = {};

export function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, initialState);

  return (
    <form action={formAction} className="space-y-5">
      <div>
        <label htmlFor="email" className="text-sm font-medium text-paper/80">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="mt-2 w-full rounded-2xl border-2 border-paper/20 bg-ink px-4 py-3 text-sm text-paper outline-none focus:border-orange"
        />
      </div>
      <div>
        <label htmlFor="password" className="text-sm font-medium text-paper/80">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          required
          className="mt-2 w-full rounded-2xl border-2 border-paper/20 bg-ink px-4 py-3 text-sm text-paper outline-none focus:border-orange"
        />
      </div>

      {state.error && <p className="text-sm text-red">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-orange px-6 py-3 text-sm font-bold text-ink transition-transform hover:-translate-y-0.5 disabled:opacity-60"
      >
        {pending ? "Signing in" : "Sign in"}
      </button>
    </form>
  );
}
