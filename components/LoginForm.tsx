"use client";

import { useActionState, useState } from "react";
import { loginAction, type LoginState } from "@/lib/actions/auth";

const initialState: LoginState = {};

const labelClass = "text-base font-semibold text-navy";
const inputClass =
  "mt-2.5 h-16 w-full rounded-2xl border-2 border-navy/15 bg-paper-dim px-5 text-lg text-navy outline-none transition-[border-color,background-color,box-shadow] focus:border-navy focus:bg-white focus:ring-4 focus:ring-blue/15";

export function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, initialState);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form action={formAction} className="space-y-7">
      <div>
        <label htmlFor="email" className={labelClass}>Email</label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          autoFocus
          className={inputClass}
        />
      </div>
      <div>
        <label htmlFor="password" className={labelClass}>Password</label>
        <div className="relative">
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            required
            className={`${inputClass} pr-24`}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            aria-pressed={showPassword}
            aria-controls="password"
            className="absolute bottom-0 right-3 flex h-16 items-center px-3 text-sm font-bold uppercase tracking-wide text-blue hover:text-navy"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
      </div>

      {state.error && (
        <p role="alert" className="rounded-2xl border border-red/30 bg-red/5 px-5 py-4 text-base text-red">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="group flex h-16 w-full items-center justify-center gap-3 rounded-full bg-navy px-8 text-lg font-bold uppercase tracking-wide text-white transition-[background-color,scale] hover:bg-blue-deep active:scale-[0.98] disabled:opacity-60"
      >
        {pending ? "Signing in…" : "Sign in"}
        {!pending && (
          <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
        )}
      </button>
    </form>
  );
}
