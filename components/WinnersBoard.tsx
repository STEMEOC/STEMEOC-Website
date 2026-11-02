import Image from "next/image";
import { GraduationCap, Medal, UsersThree } from "@phosphor-icons/react/dist/ssr";
import type { WinnerTeam } from "@/lib/program-pages";
import { schoolLogo } from "@/lib/brand";

// The logo's four colors, for teams whose school has no logo.
export const BADGE_TONES = [
  "bg-blue/10 text-blue-deep",
  "bg-red/10 text-red",
  "bg-green/10 text-green",
  "bg-orange/15 text-[#b8650a]",
] as const;

function initials(text: string) {
  const words = text.replace(/[^\p{L}\p{N}\s]/gu, " ").split(/\s+/).filter(Boolean);
  return (words.length > 1 ? words[0][0] + words[1][0] : (words[0] ?? "").slice(0, 2)).toUpperCase();
}

export function TeamCard({ team, tone }: { team: WinnerTeam; tone: string }) {
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
