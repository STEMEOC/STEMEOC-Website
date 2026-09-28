import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTeamMemberBySlug, teamMemberSlug } from "@/lib/content";
import { EASTER_EGGS } from "@/lib/easter-egg";
import { getGeniusLyrics } from "@/lib/genius";
import { getDictionary } from "@/lib/i18n";
import { Reveal } from "@/components/motion/Reveal";
import { TeamCard } from "@/components/TeamCard";
import { TeamProfileCard } from "@/components/TeamProfileCard";
import { PageTransition } from "@/components/motion/PageTransition";

const MORE_COUNT = 4;

function paragraphs(text: string) {
  return text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}

export async function generateMetadata({ params }: PageProps<"/team/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const found = await getTeamMemberBySlug(slug);
  if (!found) return {};
  const { member } = found;
  return {
    title: member.name,
    description: paragraphs(member.bio)[0]?.slice(0, 160) ?? member.role,
  };
}

// Layout follows the expanded "Team01" card in Figma. That card also has
// Telegram/email icons and a "Job Description" block; TeamMember has no
// fields for those yet, so they are left out.
export default async function TeamMemberPage({ params }: PageProps<"/team/[slug]">) {
  const { slug } = await params;
  const [found, { dict }] = await Promise.all([getTeamMemberBySlug(slug), getDictionary()]);
  if (!found) notFound();

  const { member, index, team } = found;
  const bio = paragraphs(member.bio);
  const easterEgg = EASTER_EGGS[teamMemberSlug(member)];
  const easterEggLyrics = easterEgg ? await getGeniusLyrics(easterEgg.geniusSongId) : null;

  // The next few teammates, wrapping around, so every profile leads somewhere new.
  const more = Array.from(
    { length: Math.min(MORE_COUNT, team.length - 1) },
    (_, k) => team[(index + 1 + k) % team.length]
  );

  return (
    <PageTransition>
      {/* Profile card */}
      <section className="container-site py-12 md:py-20">
        <TeamProfileCard
          member={{ name: member.name, role: member.role, photoUrl: member.photoUrl, bio }}
          aboutLabel={dict.team.aboutMe}
          backLabel={dict.team.backToTeam}
          backHref="/about#team"
          easterEgg={easterEgg}
          easterEggLyrics={easterEggLyrics}
        />
      </section>

      {/* Keep browsing: the next few teammates */}
      {more.length > 0 && (
        <section className="container-site pb-24 md:pb-32">
          <Reveal>
            <h2 className="text-center font-display text-3xl font-bold uppercase md:text-4xl">{dict.team.moreTitle}</h2>
          </Reveal>
          <div className="mt-12 grid grid-cols-2 gap-x-5 gap-y-10 text-black md:grid-cols-4 md:gap-x-8">
            {more.map((m, i) => (
              <Reveal key={m.id} scroll={(i % 4) * 0.12}>
                <TeamCard member={m} />
              </Reveal>
            ))}
          </div>
        </section>
      )}
    </PageTransition>
  );
}
