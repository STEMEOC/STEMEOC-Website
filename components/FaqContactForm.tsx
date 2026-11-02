"use client";

import { useActionState, useState } from "react";
import { submitContactForm, type ContactFormState } from "@/lib/actions/contact";

const initialState: ContactFormState = { status: "idle" };

type FaqContactFormProps = {
  labels: {
    readonly firstName: string;
    readonly lastName: string;
    readonly email: string;
    readonly topic: string;
    readonly topicPlaceholder: string;
    readonly message: string;
    readonly send: string;
    readonly sending: string;
    readonly topics: readonly { readonly value: string; readonly label: string }[];
  };
};

export function FaqContactForm({ labels }: FaqContactFormProps) {
  const [state, formAction, pending] = useActionState(submitContactForm, initialState);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [topic, setTopic] = useState("");
  const [userMessage, setUserMessage] = useState("");

  if (state.status === "success") {
    return (
      <div className="flex h-full min-h-[320px] flex-col items-center justify-center rounded-3xl bg-green/10 p-8 text-center text-green">
        <span className="text-3xl">✓</span>
        <p className="mt-3 text-lg font-bold">Message Sent Successfully</p>
        <p className="mt-1 text-sm text-green/80">
          {state.message ?? "Thank you for reaching out. We will get back to you shortly."}
        </p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="mt-6 rounded-full bg-green px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-green/90"
        >
          Send another message
        </button>
      </div>
    );
  }

  const combinedName = `${firstName.trim()} ${lastName.trim()}`.trim();
  const formattedMessage = topic ? `[Topic: ${topic}]\n\n${userMessage.trim()}` : userMessage.trim();

  return (
    <form action={formAction} className="space-y-4 md:space-y-5">
      {/* Hidden inputs to feed standard backend ContactSchema */}
      <input type="hidden" name="name" value={combinedName || "Guest"} />
      <input type="hidden" name="message" value={formattedMessage} />

      <div className="grid gap-4 sm:grid-cols-2 md:gap-5">
        {/* Left Column of inputs */}
        <div className="space-y-4 md:space-y-5">
          <div>
            <label htmlFor="faq-first-name" className="block text-xs font-bold uppercase tracking-wider text-navy/80">
              {labels.firstName}
            </label>
            <input
              id="faq-first-name"
              type="text"
              required
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="mt-1.5 w-full rounded-2xl border border-transparent bg-[#f0f4f9] px-4 py-3 text-sm text-navy outline-none transition-all focus:border-navy/30 focus:bg-white"
            />
          </div>

          <div>
            <label htmlFor="faq-last-name" className="block text-xs font-bold uppercase tracking-wider text-navy/80">
              {labels.lastName}
            </label>
            <input
              id="faq-last-name"
              type="text"
              required
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="mt-1.5 w-full rounded-2xl border border-transparent bg-[#f0f4f9] px-4 py-3 text-sm text-navy outline-none transition-all focus:border-navy/30 focus:bg-white"
            />
          </div>

          <div>
            <label htmlFor="faq-email" className="block text-xs font-bold uppercase tracking-wider text-navy/80">
              {labels.email}
            </label>
            <input
              id="faq-email"
              name="email"
              type="email"
              required
              className="mt-1.5 w-full rounded-2xl border border-transparent bg-[#f0f4f9] px-4 py-3 text-sm text-navy outline-none transition-all focus:border-navy/30 focus:bg-white"
            />
            {state.fieldErrors?.email && (
              <p className="mt-1 text-xs font-semibold text-red">{state.fieldErrors.email}</p>
            )}
          </div>
        </div>

        {/* Right Column of inputs */}
        <div className="flex flex-col space-y-4 md:space-y-5">
          <div>
            <label htmlFor="faq-topic" className="block text-xs font-bold uppercase tracking-wider text-navy/80">
              {labels.topic}
            </label>
            <div className="relative mt-1.5">
              <select
                id="faq-topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full appearance-none rounded-2xl border border-transparent bg-[#f0f4f9] px-4 py-3 text-sm text-navy outline-none transition-all focus:border-navy/30 focus:bg-white"
              >
                <option value="">{labels.topicPlaceholder}</option>
                {labels.topics.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-xs text-navy/60">
                ▼
              </div>
            </div>
          </div>

          <div className="flex flex-1 flex-col">
            <label htmlFor="faq-message" className="block text-xs font-bold uppercase tracking-wider text-navy/80">
              {labels.message}
            </label>
            <textarea
              id="faq-message"
              required
              rows={4}
              value={userMessage}
              onChange={(e) => setUserMessage(e.target.value)}
              className="mt-1.5 min-h-28 flex-1 w-full resize-none rounded-2xl border border-transparent bg-[#f0f4f9] px-4 py-3 text-sm text-navy outline-none transition-all focus:border-navy/30 focus:bg-white"
            />
            {state.fieldErrors?.message && (
              <p className="mt-1 text-xs font-semibold text-red">{state.fieldErrors.message}</p>
            )}
          </div>
        </div>
      </div>

      {state.status === "error" && !state.fieldErrors && (
        <p className="text-sm font-semibold text-red">{state.message}</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-navy py-4 text-center font-display text-base font-bold text-white shadow-md press transition-all hover:bg-blue-deep hover:shadow-xl disabled:opacity-60"
      >
        {pending ? labels.sending : labels.send}
      </button>
    </form>
  );
}
