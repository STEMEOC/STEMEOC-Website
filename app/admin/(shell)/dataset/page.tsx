import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { PROGRAM_PAGES, type ProgramEvent } from "@/lib/program-pages";
import { EVENT_NOTES, type DatasetRow, type EventNote } from "@/lib/event-dataset";
import { PageHeader } from "@/components/admin/PageHeader";
import { DatasetUpload } from "@/components/admin/DatasetUpload";
import { StatBoxes } from "@/components/StatBoxes";

export const metadata: Metadata = { title: "Dataset" };

type Upload = { rows: unknown; fileName: string; uploadedBy: string | null; updatedAt: Date };

export default async function AdminDatasetPage() {
  const [programs, uploads] = await Promise.all([
    prisma.program.findMany({ select: { slug: true, title: true } }),
    prisma.eventDataset.findMany(),
  ]);
  const titles = new Map(programs.map((p) => [p.slug, p.title]));
  const uploaded = new Map(uploads.map((u) => [u.key, u]));
  const groups = Object.entries(PROGRAM_PAGES).filter(([, page]) => page.events?.length);
  const eventOptions = groups.flatMap(([slug, page]) =>
    page.events!.map((e) => ({ key: `${slug}/${e.slug}`, label: e.title })),
  );
  const flagCount = Object.values(EVENT_NOTES).reduce((sum, n) => sum + (n.flags?.length ?? 0), 0);

  return (
    <div>
      <PageHeader
        eyebrow="Internal"
        title="Dataset"
        description="Every event's numbers as they show on the website, with sources and things to check. Admins only."
      />

      {/* summary */}
      <dl className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
          { label: "Programs", value: groups.length },
          { label: "Events", value: eventOptions.length },
          { label: "CSV uploads", value: uploads.length },
          { label: "To check", value: flagCount, alert: flagCount > 0 },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-navy/15 bg-white px-5 py-4">
            <dt className="text-sm text-navy/60">{s.label}</dt>
            <dd className={`mt-1 text-3xl font-extrabold tabular-nums ${s.alert ? "text-red" : "text-navy"}`}>{s.value}</dd>
          </div>
        ))}
      </dl>

      {/* jump nav */}
      <nav className="mt-6 flex flex-wrap gap-2 text-sm">
        {groups.map(([slug]) => (
          <a key={slug} href={`#${slug}`} className="rounded-lg border border-navy/15 bg-white px-3 py-1.5 font-semibold text-navy hover:border-navy">
            {titles.get(slug) ?? slug}
          </a>
        ))}
      </nav>

      <DatasetUpload events={eventOptions} />

      {groups.map(([slug, page]) => (
        <section key={slug} id={slug} className="mt-14 scroll-mt-6">
          <h2 className="border-b border-navy/15 pb-3 font-display text-3xl font-bold text-navy">{titles.get(slug) ?? slug}</h2>
          <div className="mt-6 space-y-6">
            {page.events!.map((event) => (
              <EventCard
                key={event.slug}
                slug={slug}
                event={event}
                note={EVENT_NOTES[`${slug}/${event.slug}`]}
                upload={uploaded.get(`${slug}/${event.slug}`)}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

function EventCard({ slug, event, note, upload }: { slug: string; event: ProgramEvent; note?: EventNote; upload?: Upload }) {
  const participation = (upload?.rows as DatasetRow[] | undefined) ?? event.participation;
  const total = participation?.reduce((sum, p) => sum + p.count, 0) ?? 0;
  const max = Math.max(...(participation ?? []).map((p) => p.count), 1);
  const unit = upload ? "total" : (event.participationUnit ?? "teams");

  return (
    <article className="overflow-hidden rounded-xl border border-navy/15 bg-white">
      {/* header */}
      <header className="flex flex-wrap items-center gap-5 border-b border-navy/10 bg-paper p-5 md:p-6">
        {event.image && (
          <div className="relative size-20 shrink-0 overflow-hidden rounded-lg bg-white">
            <Image src={event.image} alt="" fill sizes="80px" className={event.imageContain ? "object-contain p-1" : "object-cover"} />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold uppercase tracking-wider text-blue">{event.year}</p>
          <h3 className="mt-0.5 font-display text-xl font-bold text-navy md:text-2xl">{event.title}</h3>
          <p className="mt-1 text-sm text-navy/65">
            {event.date}
            {event.venue && ` · ${event.venue}`}
          </p>
        </div>
        <Link
          href={`/projects/${slug}/${event.slug}`}
          target="_blank"
          className="rounded-lg bg-navy px-4 py-2 text-sm font-bold text-white hover:bg-blue-deep"
        >
          Open page ↗
        </Link>
      </header>

      {note?.flags && note.flags.length > 0 && (
        <ul className="space-y-1 border-b border-red/20 bg-red/5 px-5 py-3 text-sm font-semibold text-red md:px-6">
          {note.flags.map((f) => (
            <li key={f}>⚠ {f}</li>
          ))}
        </ul>
      )}

      <div className="grid gap-8 p-5 md:p-6 lg:grid-cols-2 lg:gap-10">
        <div className="space-y-8">
          {event.stats && event.stats.length > 0 && <StatBoxes stats={event.stats} />}

          {/* participation */}
          <div>
            <div className="flex items-baseline justify-between gap-4">
              <h4 className="font-bold text-navy">Who took part</h4>
              {participation && (
                <p className="text-sm text-navy/60">
                  <span className="font-bold tabular-nums text-navy">{total.toLocaleString("en-US")}</span> {unit}
                </p>
              )}
            </div>
            {upload && (
              <p className="mt-1 text-xs text-blue">
                From CSV {upload.updatedAt.toLocaleDateString("en-GB")} · {upload.fileName}
                {upload.uploadedBy && ` · ${upload.uploadedBy}`}
              </p>
            )}
            {participation?.length ? (
              <dl className="mt-4 space-y-3">
                {participation.map((row) => (
                  <div key={row.category} className="grid grid-cols-[9rem_1fr_3.5rem] items-center gap-3 text-sm">
                    <dt className="truncate text-navy">{row.category}</dt>
                    <dd className="h-2.5 overflow-hidden rounded-full bg-navy/10">
                      <span className="block h-full rounded-full bg-navy" style={{ width: `${(row.count / max) * 100}%` }} />
                    </dd>
                    <dd className="text-right font-bold tabular-nums text-navy">{row.count.toLocaleString("en-US")}</dd>
                  </div>
                ))}
              </dl>
            ) : (
              <p className="mt-3 text-sm text-navy/40">No numbers yet</p>
            )}
          </div>
        </div>

        <div className="space-y-8">
          {/* winners */}
          <div>
            <h4 className="font-bold text-navy">Champions</h4>
            {event.winners ? (
              <div className="mt-3 divide-y divide-navy/10 border-y border-navy/10">
                {event.winners.groups.map((g) => (
                  <div key={`${g.category}-${g.division}`} className="py-3 text-sm">
                    <p className="font-bold text-navy">
                      {g.category}
                      {g.division && <span className="font-normal text-navy/55"> · {g.division}</span>}
                    </p>
                    <ul className="mt-1 space-y-0.5 text-navy/75">
                      {g.teams.map((t, i) => (
                        <li key={i}>
                          {t.place && <span className="font-semibold text-navy">{t.place}: </span>}
                          {t.name ?? t.members?.join(", ") ?? "—"}
                          {(t.school || t.country) && <span className="text-navy/50"> · {t.school ?? t.country}</span>}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-3 text-sm text-navy/40">No winners listed</p>
            )}
          </div>

          {/* source */}
          <div>
            <h4 className="font-bold text-navy">Source</h4>
            <p className="mt-1 text-sm text-navy/70">{note?.source ?? "Not recorded"}</p>
          </div>
        </div>
      </div>
    </article>
  );
}
