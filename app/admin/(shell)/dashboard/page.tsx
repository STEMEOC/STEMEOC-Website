import type { Metadata } from "next";
import Link from "next/link";
import { Newspaper, UsersThree, GraduationCap, Handshake, Microphone, ChatCircleText } from "@phosphor-icons/react/dist/ssr";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = { title: "Dashboard" };

export default async function AdminDashboardPage() {
  const session = await auth();
  const firstName = (session?.user?.name ?? session?.user?.email ?? "there").split(" ")[0].split("@")[0];

  const [newsCount, teamCount, programCount, partnerCount, episodeCount, submissionCount] = await Promise.all([
    prisma.newsPost.count(),
    prisma.teamMember.count(),
    prisma.program.count(),
    prisma.partner.count(),
    prisma.podcastEpisode.count(),
    prisma.contactSubmission.count(),
  ]);

  const cards = [
    { label: "News Posts", count: newsCount, href: "/admin/news", color: "var(--color-green)", icon: Newspaper },
    { label: "Team Members", count: teamCount, href: "/admin/team", color: "var(--color-blue)", icon: UsersThree },
    { label: "Programs", count: programCount, href: "/admin/programs", color: "var(--color-red)", icon: GraduationCap },
    { label: "Partners", count: partnerCount, href: "/admin/partners", color: "var(--color-orange)", icon: Handshake },
    { label: "Podcast Episodes", count: episodeCount, href: "/admin/podcast", color: "var(--color-green)", icon: Microphone },
    { label: "Contact Submissions", count: submissionCount, href: "#", color: "var(--color-blue)", icon: ChatCircleText },
  ];

  return (
    <div>
      <div className="relative overflow-hidden rounded-[2rem] bg-ink px-8 py-10 sm:px-10">
        <div className="animate-float-a absolute -right-10 -top-16 h-56 w-56 rounded-full bg-orange/20 blur-2xl" aria-hidden="true" />
        <div className="animate-float-b absolute -bottom-20 left-1/3 h-48 w-48 rounded-full bg-blue/20 blur-2xl" aria-hidden="true" />
        <div className="dot-field pointer-events-none absolute -right-6 -bottom-6 h-32 w-32 text-paper/[0.08]" aria-hidden="true" />

        <div className="relative">
          <p className="inline-flex items-center gap-1.5 font-mono-label text-xs uppercase text-orange">
            <span className="h-1.5 w-1.5 rounded-full bg-orange" />
            Overview
          </p>
          <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-paper sm:text-4xl">
            Welcome back, {firstName}!
          </h1>
          <p className="mt-2 max-w-xl text-sm text-paper/60">
            Here&apos;s what&apos;s live on the site. Public pages cache for 5 minutes and update immediately on
            publish or edit.
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card, i) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.label}
              href={card.href}
              className="shadow-pop-hover group relative flex flex-col overflow-hidden rounded-[2rem] p-6 shadow-pop-sm"
              style={{
                backgroundColor: card.color,
                transform: i % 2 === 0 ? "rotate(-0.4deg)" : "rotate(0.4deg)",
              }}
            >
              <div
                className="dot-field pointer-events-none absolute -right-4 -top-4 h-24 w-24 text-white/10"
                aria-hidden="true"
              />
              <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20">
                <Icon size={24} weight="bold" className="text-paper" />
              </div>
              <p className="relative mt-5 font-display text-4xl font-bold text-paper">{card.count}</p>
              <p className="relative mt-1 text-sm font-bold text-paper/80">{card.label}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
