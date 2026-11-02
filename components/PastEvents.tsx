import Link from "next/link";
import Image from "next/image";
import type { ProgramEvent } from "@/lib/program-pages";
import { Reveal } from "@/components/motion/Reveal";

/** Two-column list of a program's editions; each card opens its event page. */
export function PastEvents({
  programSlug,
  events,
  title,
  logo,
}: {
  programSlug: string;
  events: ProgramEvent[];
  title: string;
  /** Shown on cards without an image. */
  logo: string | null;
}) {
  if (events.length === 0) return null;
  return (
    <section className="container-site py-16 md:py-24">
      <Reveal>
        <h2 className="font-display text-3xl font-bold md:text-4xl">{title}</h2>
      </Reveal>
      <ul className="mt-10 grid gap-6 md:grid-cols-2 md:gap-8">
        {events.map((event, i) => {
          const src = event.image ?? logo;
          return (
            <li key={event.slug}>
              <Reveal scroll={(i % 2) * 0.16} className="h-full">
                <Link
                  href={`/projects/${programSlug}/${event.slug}`}
                  className="group grid h-full grid-cols-[2fr_3fr] overflow-hidden rounded-2xl bg-white shadow-[0_18px_40px_-28px_rgb(5_19_59/0.55)] ring-1 ring-navy/10 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1"
                >
                  <div className={`relative min-h-44 overflow-hidden ${event.imageContain ? "bg-paper" : "bg-navy"}`}>
                    {src && (
                      <Image
                        src={src}
                        alt=""
                        fill
                        sizes="(max-width: 768px) 40vw, 240px"
                        className={`transition-transform duration-700 group-hover:scale-105 ${
                          event.image && !event.imageContain ? "object-cover" : "object-contain p-4"
                        }`}
                      />
                    )}
                  </div>
                  <div className="flex flex-col p-5 md:p-6">
                    <span className="self-start rounded-full border border-navy/20 px-3 py-0.5 text-xs font-bold">{event.year}</span>
                    <h3 className="mt-3 font-body text-sm font-bold uppercase leading-snug md:text-base">{event.title}</h3>
                    <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-navy/70">{event.summary}</p>
                    <p className="mt-3 text-xs text-navy/50">{event.date}</p>
                  </div>
                </Link>
              </Reveal>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
