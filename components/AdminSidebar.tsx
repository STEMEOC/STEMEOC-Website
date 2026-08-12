"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Gauge, Newspaper, UsersThree, GraduationCap, Handshake, Microphone, ClipboardText, SignOut, PencilSimple } from "@phosphor-icons/react/dist/ssr";
import { logoutAction } from "@/lib/actions/auth";

const NAV_ITEMS = [
  { href: "/admin/dashboard", label: "Dashboard", icon: Gauge, color: "var(--color-orange)" },
  { href: "/admin/news", label: "News", icon: Newspaper, color: "var(--color-green)" },
  { href: "/admin/team", label: "Team", icon: UsersThree, color: "var(--color-blue)" },
  { href: "/admin/programs", label: "Programs", icon: GraduationCap, color: "var(--color-red)" },
  { href: "/admin/partners", label: "Partners", icon: Handshake, color: "var(--color-orange)" },
  { href: "/admin/podcast", label: "Podcast", icon: Microphone, color: "var(--color-green)" },
  { href: "/admin/forms", label: "Forms", icon: ClipboardText, color: "var(--color-blue)" },
];

const BRAND_COLORS = ["var(--color-blue)", "var(--color-red)", "var(--color-green)", "var(--color-orange)"];

export function AdminSidebar({ userName, avatarUrl }: { userName: string; avatarUrl: string | null }) {
  const pathname = usePathname();
  const initial = userName.trim().charAt(0).toUpperCase() || "A";

  return (
    <aside className="relative flex w-72 shrink-0 flex-col justify-between overflow-hidden border-r-2 border-ink/10 bg-paper px-5 py-8">
      <div
        className="dot-field pointer-events-none absolute -right-10 -top-10 h-40 w-40 text-ink/[0.06]"
        aria-hidden="true"
      />

      <div className="relative">
        <Link href="/admin/dashboard" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-xl">
            <Image src="/STEM-logo.png" alt="" width={36} height={36} className="h-full w-full object-cover" />
          </span>
          <span className="flex flex-col leading-none">
            <span className="font-display text-lg font-bold text-ink">STEMEOC</span>
            <span className="mt-1 w-fit rounded-full bg-ink px-2 py-0.5 font-mono-label text-[9px] text-paper">
              Admin
            </span>
          </span>
        </Link>

        <div className="relative mt-7 flex flex-col items-center rounded-2xl border-2 border-ink/10 bg-paper px-3 py-5">
          <Link
            href="/admin/profile"
            aria-label="Edit profile"
            className="absolute right-2.5 top-2.5 flex h-7 w-7 items-center justify-center rounded-full text-ink/30 transition-colors hover:bg-blue/10 hover:text-blue"
          >
            <PencilSimple size={13} weight="bold" />
          </Link>
          <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-orange text-xl font-bold text-ink">
            {avatarUrl ? (
              <Image src={avatarUrl} alt="" width={56} height={56} className="h-full w-full object-cover" />
            ) : (
              initial
            )}
          </div>
          <p className="mt-3 max-w-full truncate text-sm font-bold text-ink">{userName}</p>
          <form action={logoutAction} className="mt-2">
            <button
              type="submit"
              className="flex items-center gap-1.5 rounded-full px-3 py-1.5 font-mono-label text-[10px] uppercase text-ink/40 transition-colors hover:bg-red/10 hover:text-red"
            >
              <SignOut size={13} weight="bold" />
              Sign out
            </button>
          </form>
        </div>

        <nav className="mt-7 space-y-1.5">
          {NAV_ITEMS.map((item) => {
            const active = pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold transition-all duration-200 ${
                  active
                    ? "-translate-x-0.5 text-paper shadow-pop-sm"
                    : "text-ink/50 hover:translate-x-0.5 hover:bg-ink/5 hover:text-ink"
                }`}
                style={active ? { backgroundColor: item.color } : undefined}
              >
                <span
                  className="flex h-8 w-8 items-center justify-center rounded-lg"
                  style={{
                    backgroundColor: active ? "rgba(255,255,255,0.2)" : "transparent",
                  }}
                >
                  <Icon size={16} weight="bold" />
                </span>
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="relative grid grid-cols-4 overflow-hidden rounded-full">
        {BRAND_COLORS.map((c) => (
          <div key={c} className="h-1.5" style={{ backgroundColor: c }} />
        ))}
      </div>
    </aside>
  );
}
