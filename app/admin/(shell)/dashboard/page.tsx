import type { Metadata } from "next";
import Link from "next/link";
import {
  Newspaper,
  UsersThree,
  GraduationCap,
  Handshake,
  Microphone,
  ChatCircleText,
  Plus,
  ArrowRight,
} from "@phosphor-icons/react/dist/ssr";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { StatusPill } from "@/components/admin/StatusPill";

export const metadata: Metadata = { title: "Dashboard" };

const dateFormat = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric" });

export default async function AdminDashboardPage() {
  const session = await auth();
  const name = session?.user?.name ?? session?.user?.email?.split("@")[0] ?? "there";

  const [
    newsCount,
    newsPublished,
    teamCount,
    programCount,
    partnerCount,
    episodeCount,
    submissionCount,
    recentNews,
    recentMessages,
  ] = await Promise.all([
    prisma.newsPost.count(),
    prisma.newsPost.count({ where: { published: true } }),
    prisma.teamMember.count(),
    prisma.program.count(),
    prisma.partner.count(),
    prisma.podcastEpisode.count(),
    prisma.contactSubmission.count(),
    prisma.newsPost.findMany({
      orderBy: { updatedAt: "desc" },
      take: 5,
      select: { id: true, title: true, published: true, updatedAt: true },
    }),
    prisma.contactSubmission.findMany({
      orderBy: { createdAt: "desc" },
      take: 4,
      select: { id: true, name: true, email: true, message: true, createdAt: true },
    }),
  ]);

  const stats = [
    { label: "News posts", count: newsCount, note: `${newsPublished} published`, href: "/admin/news", icon: Newspaper, accent: "bg-green" },
    { label: "Programs", count: programCount, href: "/admin/programs", icon: GraduationCap, accent: "bg-red" },
    { label: "Podcast episodes", count: episodeCount, href: "/admin/podcast", icon: Microphone, accent: "bg-orange" },
    { label: "Team members", count: teamCount, href: "/admin/team", icon: UsersThree, accent: "bg-blue" },
    { label: "Partners", count: partnerCount, href: "/admin/partners", icon: Handshake, accent: "bg-green" },
    { label: "Messages", count: submissionCount, note: "From the contact form", href: "/admin/messages", icon: ChatCircleText, accent: "bg-orange" },
  ];

  const quickActions = [
    { label: "New post", href: "/admin/news/new" },
    { label: "New episode", href: "/admin/podcast/new" },
    { label: "New program", href: "/admin/programs/new" },
  ];

  return (
    <div className="mx-auto max-w-[90rem]">
      {/* Greeting */}
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="font-mono-label text-sm uppercase tracking-[0.15em] text-navy/50">
            {dateFormat.format(new Date())}
          </p>
          <h1 className="mt-2 font-display text-4xl font-bold text-navy lg:text-6xl">Welcome back, {name}</h1>
          <p className="mt-3 max-w-2xl text-lg text-navy/65">
            Here&apos;s what&apos;s on the site. Changes go live as soon as you publish.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          {quickActions.map((a, i) => (
            <Link
              key={a.href}
              href={a.href}
              className={`flex h-13 items-center gap-2 rounded-full px-6 text-base font-bold transition-colors ${
                i === 0
                  ? "bg-navy text-white hover:bg-blue-deep"
                  : "border-2 border-navy/15 bg-white text-navy hover:border-navy"
              }`}
            >
              <Plus size={18} weight="bold" />
              {a.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Stats */}
      <ul className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {stats.map((s) => {
          const Icon = s.icon;
          const body = (
            <>
              <span className={`absolute inset-y-0 left-0 w-1.5 ${s.accent}`} aria-hidden />
              <div className="flex items-start justify-between">
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-navy text-white">
                  <Icon size={28} />
                </span>
                {s.href && (
                  <ArrowRight
                    size={22}
                    className="text-navy/30 transition-[color,translate] group-hover:translate-x-1 group-hover:text-navy"
                  />
                )}
              </div>
              <p className="mt-6 font-display text-5xl font-bold leading-none text-navy lg:text-6xl">{s.count}</p>
              <p className="mt-2 text-lg font-semibold text-navy">{s.label}</p>
              {s.note && <p className="mt-0.5 text-base text-navy/55">{s.note}</p>}
            </>
          );
          const cls =
            "group relative block h-full overflow-hidden rounded-3xl bg-white p-7 ring-1 ring-navy/10 transition-shadow";
          return (
            <li key={s.label}>
              {s.href ? (
                <Link href={s.href} className={`${cls} hover:shadow-xl hover:shadow-navy/10`}>
                  {body}
                </Link>
              ) : (
                <div className={cls}>{body}</div>
              )}
            </li>
          );
        })}
      </ul>

      {/* Activity */}
      <div className="mt-10 grid gap-5 xl:grid-cols-5">
        <section className="rounded-3xl bg-white ring-1 ring-navy/10 xl:col-span-3">
          <header className="flex items-center justify-between border-b border-navy/10 px-7 py-5">
            <h2 className="font-display text-2xl font-bold text-navy">Recent news</h2>
            <Link href="/admin/news" className="text-base font-semibold text-blue hover:text-navy">
              View all
            </Link>
          </header>
          {recentNews.length > 0 ? (
            <ul>
              {recentNews.map((post) => (
                <li key={post.id} className="border-b border-navy/5 last:border-0">
                  <Link
                    href={`/admin/news/${post.id}/edit`}
                    className="flex items-center gap-5 px-7 py-4 transition-colors hover:bg-paper-dim"
                  >
                    <span className="min-w-0 flex-1 truncate text-base font-semibold text-navy">{post.title}</span>
                    <StatusPill active={post.published} onLabel="Published" offLabel="Draft" />
                    <span className="hidden w-28 shrink-0 text-right text-sm text-navy/50 sm:block">
                      {dateFormat.format(post.updatedAt)}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="px-7 py-12 text-center text-base text-navy/50">No news posts yet.</p>
          )}
        </section>

        <section className="rounded-3xl bg-white ring-1 ring-navy/10 xl:col-span-2">
          <header className="flex items-center justify-between border-b border-navy/10 px-7 py-5">
            <h2 className="font-display text-2xl font-bold text-navy">Latest messages</h2>
            <Link href="/admin/messages" className="text-base font-semibold text-blue hover:text-navy">
              View all
            </Link>
          </header>
          {recentMessages.length > 0 ? (
            <ul>
              {recentMessages.map((m) => (
                <li key={m.id} className="border-b border-navy/5 px-7 py-4 last:border-0">
                  <div className="flex items-baseline justify-between gap-3">
                    <p className="truncate text-base font-semibold text-navy">{m.name}</p>
                    <span className="shrink-0 text-sm text-navy/50">{dateFormat.format(m.createdAt)}</span>
                  </div>
                  <a href={`mailto:${m.email}`} className="text-sm text-blue hover:underline">
                    {m.email}
                  </a>
                  <p className="mt-1 line-clamp-2 text-base text-navy/65">{m.message}</p>
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-7 py-12 text-center">
              <ChatCircleText size={36} className="mx-auto text-navy/25" />
              <p className="mt-3 text-base text-navy/50">No messages yet. Contact form messages will show here.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
