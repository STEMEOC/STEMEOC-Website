"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  SquaresFour,
  Newspaper,
  UsersThree,
  GraduationCap,
  Handshake,
  Microphone,
  ClipboardText,
  ChatCircleText,
  SignOut,
  ArrowSquareOut,
  Question,
} from "@phosphor-icons/react/dist/ssr";
import { logoutAction } from "@/lib/actions/auth";

const NAV_GROUPS = [
  {
    label: null,
    items: [{ href: "/admin/dashboard", label: "Dashboard", icon: SquaresFour }],
  },
  {
    label: "Content",
    items: [
      { href: "/admin/news", label: "News", icon: Newspaper },
      { href: "/admin/programs", label: "Programs", icon: GraduationCap },
      { href: "/admin/podcast", label: "Podcast", icon: Microphone },
    ],
  },
  {
    label: "Responses",
    items: [
      { href: "/admin/messages", label: "Messages", icon: ChatCircleText },
      { href: "/admin/forms", label: "Forms", icon: ClipboardText },
    ],
  },
  {
    label: "People",
    items: [
      { href: "/admin/team", label: "Team", icon: UsersThree },
      { href: "/admin/partners", label: "Partners", icon: Handshake },
    ],
  },
];

const LOGO_COLORS = ["bg-green", "bg-orange", "bg-red", "bg-blue"];

/** Navy admin sidebar, in the same colors as the public site's header. */
export function AdminSidebar({ userName, avatarUrl }: { userName: string; avatarUrl: string | null }) {
  const pathname = usePathname();
  const initial = userName.trim().charAt(0).toUpperCase() || "A";

  return (
    <aside className="sticky top-0 flex h-screen w-80 shrink-0 flex-col bg-navy text-white">
      <div className="grid grid-cols-4" aria-hidden>
        {LOGO_COLORS.map((c) => (
          <span key={c} className={`h-1.5 ${c}`} />
        ))}
      </div>

      <Link href="/admin/dashboard" className="flex items-center gap-4 px-7 pb-8 pt-8">
        <Image src="/brand/logo-mark.png" alt="" width={400} height={395} className="h-14 w-auto" priority />
        <span className="flex flex-col">
          <span className="font-display text-2xl font-bold leading-none">STEMEOC</span>
          <span className="font-mono-label mt-1.5 text-xs uppercase tracking-[0.2em] text-orange">Admin</span>
        </span>
      </Link>

      <nav className="flex-1 overflow-y-auto px-4">
        {NAV_GROUPS.map((group, gi) => (
          <div key={gi} className={gi > 0 ? "mt-7" : undefined}>
            {group.label && (
              <p className="font-mono-label mb-2 px-4 text-xs uppercase tracking-[0.15em] text-white/40">
                {group.label}
              </p>
            )}
            <ul className="space-y-1">
              {group.items.map((item) => {
                const active = pathname.startsWith(item.href);
                const Icon = item.icon;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={`flex h-13 items-center gap-4 rounded-2xl px-4 text-base font-semibold transition-colors ${
                        active ? "bg-white text-navy" : "text-white/70 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      <Icon size={22} weight={active ? "fill" : "regular"} />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="space-y-1 border-t border-white/10 px-4 py-5">
        <Link
          href="/admin/help"
          aria-current={pathname.startsWith("/admin/help") ? "page" : undefined}
          className={`flex h-12 items-center gap-4 rounded-2xl px-4 text-base font-semibold transition-colors ${
            pathname.startsWith("/admin/help")
              ? "bg-white text-navy"
              : "text-white/70 hover:bg-white/10 hover:text-white"
          }`}
        >
          <Question size={22} weight={pathname.startsWith("/admin/help") ? "fill" : "regular"} />
          Help
        </Link>
        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          className="flex h-12 items-center gap-4 rounded-2xl px-4 text-base font-semibold text-white/70 transition-colors hover:bg-white/10 hover:text-white"
        >
          <ArrowSquareOut size={22} />
          View website
        </a>

        <div className="!mt-3 flex items-center gap-3 rounded-2xl bg-white/[0.06] p-3">
          <Link
            href="/admin/profile"
            className="flex min-w-0 flex-1 items-center gap-3 rounded-xl transition-opacity hover:opacity-80"
            aria-label={`${userName}, edit profile`}
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-orange text-lg font-bold text-navy">
              {avatarUrl ? (
                <Image src={avatarUrl} alt="" width={44} height={44} className="h-full w-full object-cover" />
              ) : (
                initial
              )}
            </span>
            <span className="min-w-0">
              <span className="block truncate text-base font-bold">{userName}</span>
              <span className="block text-sm text-white/50">Edit profile</span>
            </span>
          </Link>
          <form action={logoutAction}>
            <button
              type="submit"
              aria-label="Sign out"
              title="Sign out"
              className="flex h-10 w-10 items-center justify-center rounded-xl text-white/60 transition-colors hover:bg-red hover:text-white"
            >
              <SignOut size={20} />
            </button>
          </form>
        </div>
      </div>
    </aside>
  );
}
