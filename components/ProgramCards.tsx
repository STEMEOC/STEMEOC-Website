import Link from "next/link";
import Image from "next/image";
import { programLogo } from "@/lib/brand";
import { Reveal } from "@/components/motion/Reveal";
import { ScrollRow } from "@/components/ScrollRow";

type Program = { id: string; slug: string; title: string; coverImageUrl: string | null };

// Logo colors, in Figma order, for the card backs.
const PROGRAM_COLORS = ["bg-green", "bg-red", "bg-orange", "bg-blue"];

/** Notched program cards, 3 at a time with arrows. Home "Programs" and "More projects". */
export function ProgramCards({
  programs,
  detailLabel,
  labels,
  className = "",
}: {
  programs: Program[];
  detailLabel: string;
  labels: { prev: string; next: string };
  className?: string;
}) {
  return (
    <ScrollRow className={`gap-6 lg:gap-8 ${className}`} labels={labels}>
      {programs.map((program, i) => {
        const logo = programLogo(program);
        const src = logo ?? program.coverImageUrl;
        return (
          <li key={program.id} className="w-[80%] shrink-0 snap-start sm:w-[calc((100%-1.5rem)/2)] lg:w-[calc((100%-4rem)/3)]">
            <Reveal scroll={(i % 3) * 0.1}>
              <Link href={`/projects/${program.slug}`} className="group relative block aspect-[495/415]" aria-label={program.title}>
                <span className={`card-notch absolute left-[4.6%] top-[4.6%] h-[91%] w-[93.4%] ${PROGRAM_COLORS[i % 4]}`} />
                <span className="absolute left-[1.2%] top-0 h-[91%] w-[93.4%] drop-shadow-[0_4px_12px_rgb(0_0_0/0.12)] transition-transform duration-300 group-hover:-translate-y-1">
                  <span className="card-notch relative block size-full bg-white">
                    {src ? (
                      <Image
                        src={src}
                        alt=""
                        fill
                        className={logo ? "object-contain p-[12%] pb-[20%]" : "object-cover"}
                        sizes="(max-width: 640px) 80vw, (max-width: 1024px) 45vw, 520px"
                      />
                    ) : (
                      <span className="absolute inset-0 flex items-center justify-center p-8 pb-14 text-center font-display text-2xl font-bold">
                        {program.title}
                      </span>
                    )}
                  </span>
                </span>
                <span className="absolute left-[68.7%] top-[85.6%] flex h-[9.3%] w-[26%] items-center justify-center rounded-full border border-navy bg-white text-xs font-bold uppercase lg:text-sm transition-colors duration-300 group-hover:bg-navy group-hover:text-white">
                  {detailLabel}
                </span>
              </Link>
            </Reveal>
          </li>
        );
      })}
    </ScrollRow>
  );
}
