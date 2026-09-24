import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getTeamMemberBySlug } from "@/lib/content";
import { getDictionary } from "@/lib/i18n";
import { Reveal } from "@/components/motion/Reveal";
import { TeamCard } from "@/components/TeamCard";
import { PageTransition } from "@/components/motion/PageTransition";

const ACCENT_COLORS = ["var(--color-blue)", "var(--color-red)", "var(--color-green)", "var(--color-orange)"];
const MORE_COUNT = 4;

const LONG_LEAD = 220;

function paragraphs(text: string) {
  return text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}

/**
 * Splits a bio into a short hero lead and the body below it. A long opening
 * paragraph gives up only its first sentence to the hero, so the hero stays
 * compact even when the whole bio is one block of text.
 */
function splitBio(bio: string) {
  const [first = "", ...others] = paragraphs(bio);
  const sentence = first.length > LONG_LEAD ? first.match(/^(.+?[.!?])\s+(?=[A-Z"“])/) : null;
  if (!sentence) return { lead: first, rest: others };
  return { lead: sentence[1], rest: [first.slice(sentence[0].length), ...others] };
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

export default async function TeamMemberPage({ params }: PageProps<"/team/[slug]">) {
  const { slug } = await params;
  const [found, { dict }] = await Promise.all([getTeamMemberBySlug(slug), getDictionary()]);
  if (!found) notFound();

  const { member, index, team } = found;
  const color = ACCENT_COLORS[index % ACCENT_COLORS.length];
  const { lead, rest } = splitBio(member.bio);
  // Alternate backgrounds: navy hero, paper bio, navy "more". Without a bio
  // section the "more" section takes the paper background instead.
  const moreOnPaper = rest.length === 0;

  // The next few teammates, wrapping around, so every profile leads somewhere new.
  const more = Array.from({ length: Math.min(MORE_COUNT, team.length - 1) }, (_, k) => {
    const i = (index + 1 + k) % team.length;
    return { member: team[i], color: ACCENT_COLORS[i % ACCENT_COLORS.length] };
  });

  return (
    <PageTransition>
      {/* Hero: portrait + name on the site's dark navy backdrop */}
      <section className="relative overflow-hidden bg-[#0b1f3d]">
        <div className="pointer-events-none absolute -right-1/4 top-[-45%] h-[140%] w-[150%] rotate-[-6deg] rounded-[45%] bg-[#123162]" />
        <div className="pointer-events-none absolute -right-1/3 top-[-55%] h-[140%] w-[160%] rotate-[-4deg] rounded-[45%] bg-[#0e2750]" />

        <div className="relative mx-auto max-w-6xl px-6 pb-20 pt-10 md:pb-28">
          <Link
            href="/about#team"
            className="group inline-flex items-center gap-2 text-sm font-bold text-white/60 transition-colors hover:text-white"
          >
            <span className="transition-transform duration-300 group-hover:-translate-x-1">&larr;</span>
            {dict.team.backToTeam}
          </Link>

          <div className="mt-10 grid items-center gap-12 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-16">
            <Reveal className="relative mx-auto w-full max-w-sm md:max-w-none">
              {/* Flat brand-color block behind the photo, offset like a sticker */}
              <div
                className="absolute inset-0 translate-x-4 translate-y-4 rounded-3xl"
                style={{ backgroundColor: color }}
              />
              <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-ink-soft">
                {member.photoUrl && (
                  <Image
                    src={member.photoUrl}
                    alt={member.name}
                    fill
                    priority
                    className="object-cover"
                    sizes="(max-width: 768px) 384px, 460px"
                  />
                )}
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <p className="font-mono-label text-xs font-semibold uppercase" style={{ color }}>
                {member.role}
              </p>
              <h1 className="mt-4 font-display text-4xl font-semibold leading-[1.05] tracking-tight text-white md:text-6xl">
                {member.name}
              </h1>
              {lead && <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/70">{lead}</p>}
            </Reveal>
          </div>
        </div>
      </section>

      {/* Rest of the bio */}
      {rest.length > 0 && (
        <section className="bg-paper py-20">
          <Reveal className="mx-auto max-w-2xl px-6">
            <p className="font-mono-label text-xs uppercase text-ink/40">
              {dict.team.about} {member.name.split(" ")[0]}
            </p>
            <div className="mt-3 h-1 w-12 rounded-full" style={{ backgroundColor: color }} />
            <div className="mt-8 space-y-6 text-lg leading-relaxed text-ink/75">
              {rest.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </Reveal>
        </section>
      )}

      {/* Keep browsing: the next few teammates */}
      {more.length > 0 && (
        <section className={`py-20 ${moreOnPaper ? "bg-paper" : "bg-[#0b1f3d]"}`}>
          <div className="mx-auto max-w-6xl px-6">
            <Reveal className="text-center">
              <p className={`font-mono-label text-xs uppercase ${moreOnPaper ? "text-ink/40" : "text-white/50"}`}>
                {dict.team.moreEyebrow}
              </p>
              <h2
                className={`mt-3 font-display text-3xl font-semibold tracking-tight md:text-4xl ${moreOnPaper ? "text-ink" : "text-white"}`}
              >
                {dict.team.moreTitle}
              </h2>
            </Reveal>

            <div className="mx-auto mt-12 grid max-w-4xl grid-cols-2 gap-5 sm:grid-cols-4">
              {more.map(({ member: m, color: c }, i) => (
                <Reveal key={m.id} delay={i * 0.05} className="h-full">
                  <TeamCard member={m} color={c} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}
    </PageTransition>
  );
}
