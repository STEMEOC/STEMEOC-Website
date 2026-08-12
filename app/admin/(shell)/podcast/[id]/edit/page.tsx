import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PodcastEpisodeForm } from "@/components/admin/PodcastEpisodeForm";
import { updatePodcastEpisode } from "@/lib/actions/podcast";

export const metadata: Metadata = { title: "Edit Episode" };

export default async function EditPodcastEpisodePage({ params }: PageProps<"/admin/podcast/[id]/edit">) {
  const { id } = await params;
  const episode = await prisma.podcastEpisode.findUnique({ where: { id } });
  if (!episode) notFound();

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold text-ink">Edit Episode</h1>
      <div className="mt-8">
        <PodcastEpisodeForm action={updatePodcastEpisode.bind(null, id)} episode={episode} />
      </div>
    </div>
  );
}
