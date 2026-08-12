"use client";

import { useActionState, useEffect, useRef } from "react";
import { Lock, X } from "@phosphor-icons/react/dist/ssr";
import { changePassword, type ChangePasswordState } from "@/lib/actions/profile";

const initialState: ChangePasswordState = {};

export function ChangePasswordModal() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, pending] = useActionState(changePassword, initialState);

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
      dialogRef.current?.close();
    }
  }, [state]);

  return (
    <>
      <button
        type="button"
        onClick={() => dialogRef.current?.showModal()}
        className="inline-flex shrink-0 items-center gap-2 rounded-xl border-2 border-ink/10 px-4 py-2.5 text-sm font-bold text-ink transition-colors hover:border-blue hover:text-blue"
      >
        <Lock size={15} weight="bold" />
        Change password
      </button>

      <dialog
        ref={dialogRef}
        onClick={(e) => {
          if (e.target === dialogRef.current) dialogRef.current?.close();
        }}
        className="m-auto w-full max-w-sm rounded-[1.75rem] border-2 border-ink/10 bg-paper p-0 shadow-pop backdrop:bg-ink/40"
      >
        <form ref={formRef} action={formAction} className="space-y-5 p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl font-bold text-ink">Change password</h2>
            <button
              type="button"
              aria-label="Close"
              onClick={() => dialogRef.current?.close()}
              className="flex h-8 w-8 items-center justify-center rounded-full text-ink/40 transition-colors hover:bg-ink/5 hover:text-ink"
            >
              <X size={16} weight="bold" />
            </button>
          </div>

          <div>
            <label htmlFor="currentPassword" className="text-sm font-bold text-ink">Current password</label>
            <input
              id="currentPassword"
              name="currentPassword"
              type="password"
              autoComplete="current-password"
              required
              className="mt-2 w-full rounded-xl border-2 border-ink/10 bg-paper-dim px-4 py-2.5 text-sm outline-none focus:border-blue"
            />
          </div>

          <div>
            <label htmlFor="newPassword" className="text-sm font-bold text-ink">New password</label>
            <input
              id="newPassword"
              name="newPassword"
              type="password"
              autoComplete="new-password"
              minLength={8}
              required
              className="mt-2 w-full rounded-xl border-2 border-ink/10 bg-paper-dim px-4 py-2.5 text-sm outline-none focus:border-blue"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="text-sm font-bold text-ink">Confirm new password</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              minLength={8}
              required
              className="mt-2 w-full rounded-xl border-2 border-ink/10 bg-paper-dim px-4 py-2.5 text-sm outline-none focus:border-blue"
            />
          </div>

          {state.error && <p className="text-sm font-bold text-red">{state.error}</p>}

          <button
            type="submit"
            disabled={pending}
            className="shadow-pop-hover w-full rounded-2xl bg-blue px-6 py-3 text-sm font-bold text-paper shadow-pop-sm disabled:opacity-60"
          >
            {pending ? "Updating…" : "Update password"}
          </button>
        </form>
      </dialog>
    </>
  );
}
