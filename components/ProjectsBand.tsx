import Link from "next/link";
import Image from "next/image";
import { programLogo } from "@/lib/brand";

type Program = { id: string; slug: string; title: string; coverImageUrl: string | null };

/**
 * Slanted navy title tab above a navy band of notched program cards that
 * scrolls sideways. Used for "Projects" on the home page and "More projects"
 * on a program page.
 */
export function ProjectsBand({
  title,
  detailLabel,
  programs,
}: {
  title: string;
  detailLabel: string;
  programs: Program[];
}) {
  if (programs.length === 0) return null;

  return (
    <section>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 w-[85%] bg-navy tab-slant-top [--slant:4rem] md:w-[45%] md:[--slant:7rem]" />
        <h2 className="container-site relative py-6 font-display text-3xl font-bold uppercase text-white md:py-7 md:text-4xl">
          {title}
        </h2>
      </div>
      <div className="bg-navy pb-16 pt-10 md:pb-20">
        <ul className="container-site flex snap-x snap-mandatory scroll-px-(--gutter) gap-6 overflow-x-auto pb-6 scrollbar-rail md:gap-8">
          {programs.map((program) => {
            const logo = programLogo(program);
            const src = logo ?? program.coverImageUrl;
            return (
              <li key={program.id} className="w-72 shrink-0 snap-start md:w-[22rem]">
                <Link
                  href={`/projects/${program.slug}`}
                  className="group relative block transition-[scale] duration-150 active:scale-[0.98]" aria-label={program.title}>
                  <div className="card-notch relative aspect-[405/331] bg-white transition-transform duration-300 group-hover:-translate-y-1">
                    {src ? (
                      <Image
                        src={src}
                        alt=""
                        fill
                        className={logo ? "object-contain p-8 pb-14 md:p-10 md:pb-16" : "object-cover"}
                        sizes="352px"
                      />
                    ) : (
                      <span className="absolute inset-0 flex items-center justify-center p-8 pb-14 text-center font-display text-2xl font-bold text-navy">
                        {program.title}
                      </span>
                    )}
                  </div>
                  <span className="absolute bottom-[0.5%] right-[1.5%] flex h-[10%] w-[28%] items-center justify-center rounded-full border border-white text-xs font-bold uppercase text-white transition-[color,background-color,translate] duration-300 group-hover:-translate-y-1 group-hover:bg-white group-hover:text-navy md:text-sm">
                    {detailLabel}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
