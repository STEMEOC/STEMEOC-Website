import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { PROGRAM_PAGES } from "@/lib/program-pages";
import { EVENT_NOTES, type DatasetRow } from "@/lib/event-dataset";
import { PageHeader } from "@/components/admin/PageHeader";
import { DatasetUpload } from "@/components/admin/DatasetUpload";

export const metadata: Metadata = { title: "Dataset" };

export default async function AdminDatasetPage() {
  const [programs, uploads] = await Promise.all([
    prisma.program.findMany({ select: { slug: true, title: true } }),
    prisma.eventDataset.findMany(),
  ]);
  const titles = new Map(programs.map((p) => [p.slug, p.title]));
  const uploaded = new Map(uploads.map((u) => [u.key, u]));
  const eventOptions = Object.entries(PROGRAM_PAGES).flatMap(([slug, page]) =>
    (page.events ?? []).map((e) => ({ key: `${slug}/${e.slug}`, label: e.title })),
  );

  return (
    <div>
      <PageHeader
        eyebrow="Internal"
        title="Dataset"
        description="Numbers for every event, with sources and things to check. Admins only."
      />

      <DatasetUpload events={eventOptions} />
      {Object.entries(PROGRAM_PAGES)
        .filter(([, page]) => page.events?.length)
        .map(([slug, page]) => (
          <section key={slug} className="mt-10">
            <h2 className="font-display text-2xl font-bold text-navy">{titles.get(slug) ?? slug}</h2>
            <div className="mt-4 overflow-x-auto rounded-[2rem] bg-paper shadow-sm ring-1 ring-black/5">
              <table className="w-full min-w-[960px] text-left text-sm">
                <thead className="bg-paper-dim text-xs uppercase text-ink/50">
                  <tr>
                    <th className="px-6 py-4 font-bold">Event</th>
                    <th className="px-6 py-4 font-bold">Stats</th>
                    <th className="px-6 py-4 font-bold">Participation</th>
                    <th className="px-6 py-4 font-bold">Winners</th>
                    <th className="px-6 py-4 font-bold">Source / to check</th>
                  </tr>
                </thead>
                <tbody>
                  {page.events!.map((event) => {
                    const note = EVENT_NOTES[`${slug}/${event.slug}`];
                    const upload = uploaded.get(`${slug}/${event.slug}`);
                    const participation = (upload?.rows as DatasetRow[] | undefined) ?? event.participation;
                    const total = participation?.reduce((sum, p) => sum + p.count, 0);
                    const winnerTeams = event.winners?.groups.reduce((sum, g) => sum + g.teams.length, 0);
                    return (
                      <tr key={event.slug} className="border-t border-ink/5 align-top">
                        <td className="px-6 py-4">
                          <Link
                            href={`/projects/${slug}/${event.slug}`}
                            target="_blank"
                            className="font-bold text-ink hover:text-blue"
                          >
                            {event.title}
                          </Link>
                          <p className="mt-1 text-ink/60">{event.date}</p>
                          {event.venue && <p className="text-ink/60">{event.venue}</p>}
                        </td>
                        <td className="px-6 py-4">
                          {event.stats?.map((s) => (
                            <p key={s.label}>
                              <span className="font-bold tabular-nums text-ink">{s.value}</span>{" "}
                              <span className="text-ink/60">{s.label}</span>
                            </p>
                          )) ?? <span className="text-ink/40">—</span>}
                        </td>
                        <td className="px-6 py-4">
                          {participation ? (
                            <>
                              <p className="font-bold tabular-nums text-ink">
                                {total!.toLocaleString("en-US")} {upload ? "total" : (event.participationUnit ?? "teams")}
                              </p>
                              {upload && (
                                <p className="text-xs text-blue">
                                  Uploaded {upload.updatedAt.toLocaleDateString("en-GB")} · {upload.fileName}
                                  {upload.uploadedBy && ` · ${upload.uploadedBy}`}
                                </p>
                              )}
                              {participation.map((p) => (
                                <p key={p.category} className="text-ink/60">
                                  {p.category}: <span className="tabular-nums">{p.count.toLocaleString("en-US")}</span>
                                </p>
                              ))}
                            </>
                          ) : (
                            <span className="text-ink/40">—</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {event.winners ? (
                            <>
                              <p className="font-bold tabular-nums text-ink">{winnerTeams} teams</p>
                              <p className="text-ink/60">{event.winners.groups.length} categories</p>
                            </>
                          ) : (
                            <span className="text-ink/40">—</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {note?.source && <p className="text-ink/70">{note.source}</p>}
                          {note?.flags?.map((f) => (
                            <p key={f} className="mt-1 font-semibold text-red">
                              {f}
                            </p>
                          ))}
                          {!note && <span className="text-ink/40">—</span>}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        ))}
    </div>
  );
}
