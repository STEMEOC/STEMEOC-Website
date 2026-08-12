import type { Metadata } from "next";
import { Microphone } from "@phosphor-icons/react/dist/ssr";
import { prisma } from "@/lib/prisma";
import { deletePodcastEpisode } from "@/lib/actions/podcast";
import { PageHeader } from "@/components/admin/PageHeader";
import { StatusPill } from "@/components/admin/StatusPill";
import { RowActions } from "@/components/admin/RowActions";

export const metadata: Metadata = { title: "Podcast" };

export default async function AdminPodcastPage() {
  const episodes = await prisma.podcastEpisode.findMany({ orderBy: { order: "desc" } });

  return (
    <div>
      <PageHeader
        eyebrow="Content"
        title="Podcast"
        cta={{ label: "Add Episode", href: "/admin/podcast/new", icon: <Microphone size={16} weight="bold" /> }}
      />

      <div className="mt-8 overflow-hidden rounded-[2rem] bg-paper shadow-sm ring-1 ring-black/5">
        <table className="w-full text-left text-sm">
          <thead className="bg-paper-dim text-xs uppercase text-ink/50">
            <tr>
              <th className="px-6 py-4 font-bold">Ep</th>
              <th className="px-6 py-4 font-bold">Title</th>
              <th className="px-6 py-4 font-bold">Status</th>
              <th className="px-6 py-4" />
            </tr>
          </thead>
          <tbody>
            {episodes.map((episode) => (
              <tr key={episode.id} className="border-t border-ink/5 transition-colors hover:bg-paper-dim">
                <td className="px-6 py-4 text-ink/60">{String(episode.order).padStart(2, "0")}</td>
                <td className="px-6 py-4 font-bold text-ink">{episode.title}</td>
                <td className="px-6 py-4">
                  <StatusPill active={episode.published} onLabel="Published" offLabel="Hidden" />
                </td>
                <td className="px-6 py-4">
                  <RowActions
                    editHref={`/admin/podcast/${episode.id}/edit`}
                    onDelete={deletePodcastEpisode.bind(null, episode.id)}
                  />
                </td>
              </tr>
            ))}
            {episodes.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-10 text-center text-ink/50">
                  No podcast episodes yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
