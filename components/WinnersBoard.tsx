import Image from "next/image";
import { GraduationCap, Medal, Trophy, UsersThree } from "@phosphor-icons/react/dist/ssr";
import type { WinnerGroup, WinnerTeam } from "@/lib/program-pages";
import { schoolLogo } from "@/lib/brand";
import { DrawLine, FadeUp, MaskText, PopIn, StaggerGroup } from "@/components/motion/Stagger";
import { ScrollCard, ScrollMarquee } from "@/components/motion/ScrollHeavy";

// Cards per row on large screens; cards later in a row land a little later.
const COLUMNS = 3;

// The logo's four colors, for teams whose school has no logo.
const BADGE_TONES = [
  "bg-blue/10 text-blue-deep",
  "bg-red/10 text-red",
  "bg-green/10 text-green",
  "bg-orange/15 text-[#b8650a]",
] as const;

function initials(text: string) {
  const words = text.replace(/[^\p{L}\p{N}\s]/gu, " ").split(/\s+/).filter(Boolean);
  return (words.length > 1 ? words[0][0] + words[1][0] : (words[0] ?? "").slice(0, 2)).toUpperCase();
}

function TeamCard({ team, tone }: { team: WinnerTeam; tone: string }) {
  const title = team.name ?? (team.members ? undefined : team.school);
  const logo = schoolLogo(team.school);
  const showSchool = team.school && title !== team.school;

  return (
    <article className="group flex h-full flex-col rounded-2xl bg-white p-5 text-navy shadow-[0_24px_50px_-32px_rgb(0_0_0/0.8)] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 md:p-6">
      <div className="flex items-start gap-4">
        {logo ? (
          <span className="relative size-14 shrink-0 overflow-hidden rounded-2xl bg-white ring-1 ring-navy/10">
            <Image src={logo} alt="" fill sizes="56px" className="object-contain p-1.5" />
          </span>
        ) : (
          <span
            aria-hidden
            className={`flex size-14 shrink-0 items-center justify-center rounded-2xl font-body text-base font-extrabold ${tone}`}
          >
            {title ? initials(title) : <UsersThree size={24} weight="bold" />}
          </span>
        )}
        <div className="min-w-0 flex-1">
          {team.place && (
            <p className="mb-1.5 inline-flex items-center gap-1 rounded-full bg-orange/15 px-2.5 py-0.5 text-[0.7rem] font-bold uppercase tracking-wide text-[#8a4b06]">
              <Medal size={12} weight="fill" />
              {team.place}
            </p>
          )}
          {title ? (
            <h4 className="font-body text-lg font-bold leading-snug">{title}</h4>
          ) : (
            <h4 className="font-body text-base font-semibold leading-snug">{team.members?.join(", ")}</h4>
          )}
          {team.country && <p className="mt-0.5 text-sm text-navy/55">{team.country}</p>}
          {showSchool && (
            <p className="mt-1 flex items-start gap-1.5 text-sm leading-snug text-navy/60">
              <GraduationCap size={15} className="mt-0.5 shrink-0" />
              {team.school}
            </p>
          )}
        </div>
      </div>

      {title && team.members && (
        <ul className="mt-5 space-y-2 border-t border-navy/10 pt-4 text-sm">
          {team.members.map((m) => (
            <li key={m} className="flex items-center gap-2.5">
              <span aria-hidden className="size-1.5 shrink-0 rounded-full bg-navy/30" />
              {m}
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}

/**
 * All winning teams, grouped by category. Divisions (Elementary, Senior...)
 * of the same category sit under that category's heading.
 */
export function WinnersBoard({
  groups,
  teamsLabel,
  categoryImages = {},
}: {
  groups: WinnerGroup[];
  teamsLabel: string;
  categoryImages?: Record<string, string>;
}) {
  const categories = Array.from(new Set(groups.map((g) => g.category)));

  return (
    <div className="mt-12 space-y-14 md:mt-16 md:space-y-20">
      {categories.map((category) => {
        const inCategory = groups.filter((g) => g.category === category);
        const count = inCategory.reduce((n, g) => n + g.teams.length, 0);
        const image = categoryImages[category.toLowerCase()];
        return (
          <section key={category} className="relative">
            <ScrollMarquee text={category} className="absolute -left-4 -top-10 right-0 md:-top-16" />
            <StaggerGroup className="relative flex items-center gap-4" stagger={0.12}>
              <PopIn className="relative block size-14 shrink-0 overflow-hidden rounded-full bg-white/10 ring-2 ring-white/25 md:size-16">
                {image ? (
                  <Image src={image} alt="" fill sizes="64px" className="object-cover" />
                ) : (
                  <Trophy size={28} weight="duotone" className="absolute inset-0 m-auto" />
                )}
              </PopIn>
              <div>
                <h3 className="font-display text-2xl font-bold md:text-3xl">
                  <MaskText>{category}</MaskText>
                </h3>
                <FadeUp className="text-sm text-white/60">
                  {count} {teamsLabel}
                </FadeUp>
              </div>
            </StaggerGroup>

            <div className="mt-6 space-y-8 md:mt-8">
              {inCategory.map((group, g) => (
                <StaggerGroup key={`${group.division ?? g}`}>
                  {group.division && (
                    <p className="mb-4 flex items-center gap-3 text-sm font-bold uppercase tracking-[0.18em] text-white/70">
                      <FadeUp>{group.division}</FadeUp>
                      <DrawLine className="block h-px flex-1 bg-white/15" />
                    </p>
                  )}
                  <ul className="grid gap-4 [perspective:1400px] sm:grid-cols-2 lg:grid-cols-3 md:gap-6">
                    {group.teams.map((team, t) => (
                      <li key={t}>
                        <ScrollCard lag={(t % COLUMNS) * 0.16} className="h-full">
                          <TeamCard team={team} tone={BADGE_TONES[t % BADGE_TONES.length]} />
                        </ScrollCard>
                      </li>
                    ))}
                  </ul>
                </StaggerGroup>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
