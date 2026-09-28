import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import type { ProgramEvent } from "@/lib/program-pages";
import { Reveal } from "@/components/motion/Reveal";

/**
 * Grid of a program's editions (CRO 2026, 2025, 2024...). Each card opens
 * that edition's page at /projects/[program]/[event].
 */
export function EventCards({
  programSlug,
  events,
  title,
  intro,
  viewLabel,
  logo,
}: {
  programSlug: string;
  events: ProgramEvent[];
  title: string;
  intro?: string;
  viewLabel: string;
  /** Shown on cards without a photo. */
  logo?: string | null;
}) {
  if (events.length === 0) return null;
  return (
    <section className="container-site py-16 md:py-24">
      <Reveal>
        <h2 className="font-display text-3xl font-bold uppercase md:text-4xl">{title}</h2>
        {intro && <p className="mt-3 text-base text-navy/70 md:text-lg">{intro}</p>}
      </Reveal>
      <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 md:mt-12 md:gap-8">
        {events.map((event, i) => (
          <li key={event.slug}>
            <Reveal scroll={(i % 3) * 0.16} className="h-full">
              <Link
                href={`/projects/${programSlug}/${event.slug}`}
                className="group flex h-full flex-col overflow-hidden rounded-2xl bg-white ring-1 ring-navy/10 transition-[transform,box-shadow] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1.5 hover:shadow-[0_28px_60px_-30px_rgb(5_19_59/0.45)]"
              >
                <div className={`relative aspect-[16/10] overflow-hidden ${event.imageContain ? "bg-paper" : "bg-navy"}`}>
                  {event.image ? (
                    <Image
                      src={event.image}
                      alt=""
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 420px"
                      className={`transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105 ${
                        event.imageContain ? "object-contain p-3" : "object-cover"
                      }`}
                    />
                  ) : logo ? (
                    <Image src={logo} alt="" fill sizes="300px" className="object-contain p-10 brightness-0 invert" />
                  ) : null}
                  <span className="absolute left-4 top-4 rounded-full bg-white px-3.5 py-1 text-sm font-extrabold text-navy shadow-sm">
                    {event.year}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-5 md:p-6">
                  <p className="text-xs font-bold uppercase tracking-wide text-navy/55">{event.date}</p>
                  <h3 className="mt-2 font-body text-lg font-bold leading-snug md:text-xl">{event.title}</h3>
                  <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-navy/70">{event.summary}</p>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold uppercase">
                    {viewLabel}
                    <ArrowUpRight
                      size={16}
                      weight="bold"
                      className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    />
                  </span>
                </div>
              </Link>
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  );
}
