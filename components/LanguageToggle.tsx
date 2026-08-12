"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { LOCALE_COOKIE, type Locale } from "@/lib/i18n/shared";

export function LanguageToggle({ locale }: { locale: Locale }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function setLocale(next: Locale) {
    if (next === locale) return;
    document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=31536000`;
    startTransition(() => router.refresh());
  }

  return (
    <div
      className="flex items-center gap-0.5 rounded-full border border-ink/15 p-0.5 text-xs font-bold"
      aria-label="Language"
      aria-busy={pending}
    >
      <button
        type="button"
        onClick={() => setLocale("en")}
        aria-pressed={locale === "en"}
        className={`rounded-full px-2.5 py-1 transition-colors ${
          locale === "en" ? "bg-blue text-paper" : "text-ink/60 hover:text-ink"
        }`}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => setLocale("km")}
        aria-pressed={locale === "km"}
        className={`rounded-full px-2.5 py-1 font-khmer transition-colors ${
          locale === "km" ? "bg-blue text-paper" : "text-ink/60 hover:text-ink"
        }`}
      >
        ខ្មែរ
      </button>
    </div>
  );
}
