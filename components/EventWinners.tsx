import Image from "next/image";
import { Trophy } from "@phosphor-icons/react/dist/ssr";
import type { Winners } from "@/lib/program-pages";
import { Reveal } from "@/components/motion/Reveal";
import { WinnersBoard } from "@/components/WinnersBoard";

/**
 * Winners of one edition: award-ceremony photos, then the winning teams in
 * a tab per category (see WinnersBoard).
 */
export function EventWinners({
  winners,
  title,
  teamsLabel,
  categoryImages = {},
}: {
  winners: Winners;
  title: string;
  /** e.g. "winning teams", shown with the count in each card header. */
  teamsLabel: string;
  /** Category name (lowercase) → banner photo. */
  categoryImages?: Record<string, string>;
}) {
  const [lead, ...rest] = winners.photos ?? [];

  return (
    <section className="bg-navy text-white">
      <div className="container-site py-16 md:py-24">
        <div className={lead && rest.length === 0 ? "grid items-center gap-10 lg:grid-cols-2 lg:gap-16" : ""}>
          <Reveal>
            <h2 className="flex items-center gap-3 font-display text-3xl font-bold uppercase md:text-4xl">
              <Trophy size={36} weight="duotone" className="shrink-0" />
              {title}
            </h2>
            {winners.intro && (
              <p className="mt-4 max-w-3xl text-base leading-relaxed text-white/80 md:text-lg">{winners.intro}</p>
            )}
          </Reveal>
          {lead && rest.length === 0 && (
            <Reveal delay={0.1}>
              <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-white/5">
                <Image src={lead.src} alt={lead.alt} fill sizes="(max-width: 1024px) 100vw, 640px" className="object-cover" />
              </div>
            </Reveal>
          )}
        </div>

        {lead && rest.length > 0 && (
          <ul className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 md:mt-12 md:gap-4 lg:grid-cols-5">
            {[lead, ...rest].slice(0, 5).map((photo, i) => (
              <li key={photo.src} className={i === 4 ? "hidden lg:block" : i === 3 ? "sm:hidden lg:block" : ""}>
                <Reveal scroll={i * 0.1}>
                  <div className="group relative aspect-[4/3] overflow-hidden rounded-xl bg-white/5">
                    <Image
                      src={photo.src}
                      alt={photo.alt}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 260px"
                      className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                    />
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>
        )}

        <WinnersBoard groups={winners.groups} teamsLabel={teamsLabel} categoryImages={categoryImages} />
      </div>
    </section>
  );
}
