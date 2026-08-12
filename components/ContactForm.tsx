"use client";

import { useActionState } from "react";
import { submitContactForm, type ContactFormState } from "@/lib/actions/contact";

const initialState: ContactFormState = { status: "idle" };

type ContactFormLabels = {
  name: string;
  email: string;
  message: string;
  sending: string;
  sendMessage: string;
};

export function ContactForm({ labels }: { labels: ContactFormLabels }) {
  const [state, formAction, pending] = useActionState(submitContactForm, initialState);

  if (state.status === "success") {
    return (
      <div className="rounded-3xl bg-green/10 p-8 font-semibold text-green">
        {state.message}
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-6">
      <div>
        <label htmlFor="name" className="text-sm font-bold">{labels.name}</label>
        <input
          id="name"
          name="name"
          type="text"
          required
          className="mt-2 w-full rounded-2xl border-2 border-ink/15 bg-paper px-4 py-3 text-sm outline-none focus:border-blue"
        />
        {state.fieldErrors?.name && (
          <p className="mt-1 text-sm text-red">{state.fieldErrors.name}</p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="text-sm font-bold">{labels.email}</label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="mt-2 w-full rounded-2xl border-2 border-ink/15 bg-paper px-4 py-3 text-sm outline-none focus:border-blue"
        />
        {state.fieldErrors?.email && (
          <p className="mt-1 text-sm text-red">{state.fieldErrors.email}</p>
        )}
      </div>

      <div>
        <label htmlFor="message" className="text-sm font-bold">{labels.message}</label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          className="mt-2 w-full rounded-2xl border-2 border-ink/15 bg-paper px-4 py-3 text-sm outline-none focus:border-blue"
        />
        {state.fieldErrors?.message && (
          <p className="mt-1 text-sm text-red">{state.fieldErrors.message}</p>
        )}
      </div>

      {state.status === "error" && !state.fieldErrors && (
        <p className="text-sm text-red">{state.message}</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-blue px-7 py-3.5 text-sm font-bold text-paper transition-transform hover:-translate-y-0.5 disabled:opacity-60"
      >
        {pending ? labels.sending : labels.sendMessage}
      </button>
    </form>
  );
}
