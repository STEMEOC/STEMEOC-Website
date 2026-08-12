import type { ReactNode } from "react";
import type { FormLayout, FormTheme } from "@prisma/client";

function hexToRgba(hex: string, alpha: number): string {
  const num = parseInt(hex.replace("#", ""), 16);
  const r = (num >> 16) & 0xff;
  const g = (num >> 8) & 0xff;
  const b = num & 0xff;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function FormStyleFrame({
  accentColor,
  layout,
  theme,
  eyebrow = "Application",
  title,
  description,
  coverImageUrl,
  children,
}: {
  accentColor: string;
  layout: FormLayout;
  theme: FormTheme;
  eyebrow?: string;
  title: string;
  description?: string | null;
  coverImageUrl?: string | null;
  children: ReactNode;
}) {
  const dark = theme === "DARK";
  const cardBg = dark ? "bg-[#12141c]" : "bg-paper";
  const textColor = dark ? "text-paper" : "text-ink";

  if (layout === "COVER") {
    return (
      <div className={`overflow-hidden rounded-[2rem] shadow-xl ring-1 ring-black/5 ${cardBg}`}>
        <div
          className="relative flex min-h-[220px] items-end bg-cover bg-center px-8 py-10 text-white md:px-10"
          style={{
            backgroundColor: accentColor,
            backgroundImage: coverImageUrl ? `url(${coverImageUrl})` : undefined,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/0" />
          <div className="relative">
            <p className="font-mono-label text-xs uppercase text-white/70">{eyebrow}</p>
            <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight md:text-3xl">
              {title || "Untitled form"}
            </h2>
            {description && <p className="mt-3 leading-relaxed text-white/80">{description}</p>}
          </div>
        </div>
        <div className={`p-8 md:p-10 ${textColor}`}>{children}</div>
      </div>
    );
  }

  if (layout === "SIDEBAR") {
    return (
      <div className={`flex overflow-hidden rounded-[2rem] shadow-xl ring-1 ring-black/5 ${cardBg}`}>
        <span className="w-2.5 shrink-0 md:w-3" style={{ backgroundColor: accentColor }} />
        <div className={`flex-1 p-8 md:p-10 ${textColor}`}>
          <p className="font-mono-label text-xs uppercase opacity-40">{eyebrow}</p>
          <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight md:text-3xl">
            {title || "Untitled form"}
          </h2>
          {description && <p className="mt-3 leading-relaxed opacity-70">{description}</p>}
          <div className="mt-8">{children}</div>
        </div>
      </div>
    );
  }

  if (layout === "DUOTONE") {
    return (
      <div className={`overflow-hidden rounded-[2rem] shadow-xl ring-1 ring-black/5 ${cardBg}`}>
        <div
          className="px-8 pb-8 pt-10 md:px-10"
          style={{ backgroundImage: `linear-gradient(180deg, ${hexToRgba(accentColor, dark ? 0.3 : 0.14)}, transparent)` }}
        >
          <p className="font-mono-label text-xs font-bold uppercase" style={{ color: accentColor }}>
            {eyebrow}
          </p>
          <h2 className={`mt-2 font-display text-2xl font-semibold tracking-tight md:text-3xl ${textColor}`}>
            {title || "Untitled form"}
          </h2>
          {description && <p className={`mt-3 leading-relaxed opacity-70 ${textColor}`}>{description}</p>}
        </div>
        <div className={`px-8 pb-8 md:px-10 md:pb-10 ${textColor}`}>{children}</div>
      </div>
    );
  }

  if (layout === "FRAMED") {
    return (
      <div
        className={`rounded-[2rem] p-8 md:p-10 ${textColor}`}
        style={{
          backgroundColor: hexToRgba(accentColor, dark ? 0.1 : 0.05),
          boxShadow: `inset 0 0 0 1.5px ${hexToRgba(accentColor, 0.35)}`,
        }}
      >
        <span
          className="mb-4 flex h-9 w-9 items-center justify-center rounded-xl text-sm font-bold text-white"
          style={{ backgroundColor: accentColor }}
        >
          {(title || "U").trim().charAt(0).toUpperCase()}
        </span>
        <p className="font-mono-label text-xs uppercase opacity-40">{eyebrow}</p>
        <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight md:text-3xl">
          {title || "Untitled form"}
        </h2>
        {description && <p className="mt-3 leading-relaxed opacity-70">{description}</p>}
        <div className="mt-8">{children}</div>
      </div>
    );
  }

  if (layout === "BADGE") {
    return (
      <div className={`rounded-[2rem] p-8 shadow-xl ring-1 ring-black/5 md:p-10 ${cardBg} ${textColor}`}>
        <span
          className="inline-flex items-center rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white"
          style={{ backgroundColor: accentColor }}
        >
          {eyebrow}
        </span>
        <h2 className="mt-3 font-display text-2xl font-semibold tracking-tight md:text-3xl">
          {title || "Untitled form"}
        </h2>
        {description && <p className="mt-3 leading-relaxed opacity-70">{description}</p>}
        <div className="mt-8">{children}</div>
      </div>
    );
  }

  if (layout === "BOLD") {
    return (
      <div className={`overflow-hidden rounded-[2rem] shadow-xl ring-1 ring-black/5 ${cardBg}`}>
        <div className="px-8 py-10 text-white md:px-10" style={{ backgroundColor: accentColor }}>
          <p className="font-mono-label text-xs uppercase text-white/70">{eyebrow}</p>
          <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight md:text-3xl">
            {title || "Untitled form"}
          </h2>
          {description && <p className="mt-3 leading-relaxed text-white/80">{description}</p>}
        </div>
        <div className={`p-8 md:p-10 ${textColor}`}>{children}</div>
      </div>
    );
  }

  if (layout === "MINIMAL") {
    return (
      <div className={textColor}>
        <span className="mb-4 inline-block h-1 w-12 rounded-full" style={{ backgroundColor: accentColor }} />
        <p className="font-mono-label text-xs uppercase opacity-40">{eyebrow}</p>
        <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight md:text-3xl">
          {title || "Untitled form"}
        </h2>
        {description && <p className="mt-3 leading-relaxed opacity-70">{description}</p>}
        <div className="mt-8">{children}</div>
      </div>
    );
  }

  return (
    <div className={`rounded-[2rem] p-8 shadow-xl ring-1 ring-black/5 md:p-10 ${cardBg} ${textColor}`}>
      <p className="font-mono-label text-xs uppercase opacity-40">{eyebrow}</p>
      <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight md:text-3xl">
        {title || "Untitled form"}
      </h2>
      {description && <p className="mt-3 leading-relaxed opacity-70">{description}</p>}
      <div className="mt-8">{children}</div>
    </div>
  );
}
