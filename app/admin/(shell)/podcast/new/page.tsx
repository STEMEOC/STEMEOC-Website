import type { Metadata } from "next";
import { PodcastEpisodeForm } from "@/components/admin/PodcastEpisodeForm";
import { createPodcastEpisode } from "@/lib/actions/podcast";

export const metadata: Metadata = { title: "Add Episode" };

export default function NewPodcastEpisodePage() {
  return (
    <div>
      <h1 className="font-display text-3xl font-semibold text-ink">Add Episode</h1>
      <div className="mt-8">
        <PodcastEpisodeForm action={createPodcastEpisode} />
      </div>
    </div>
  );
}
