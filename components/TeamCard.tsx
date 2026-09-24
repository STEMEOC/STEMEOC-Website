import Link from "next/link";
import Image from "next/image";
import { teamMemberSlug } from "@/lib/content";

/** Portrait card linking to a team member's profile page. */
export function TeamCard({
  member,
  color,
  sizes = "(max-width: 768px) 50vw, 220px",
}: {
  member: { id: string; name: string; role: string; photoUrl: string | null };
  color: string;
  sizes?: string;
}) {
  return (
    <Link
      href={`/team/${teamMemberSlug(member)}`}
      className="group relative flex h-full aspect-[4/5] w-full items-end justify-center overflow-hidden rounded-2xl bg-ink-soft shadow-sm outline-offset-4 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-blue"
    >
      {member.photoUrl && (
        <Image
          src={member.photoUrl}
          alt={member.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          sizes={sizes}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
      <div
        className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100"
        style={{ backgroundColor: color }}
      />
      <div className="relative p-4 text-center">
        <h3 className="font-display text-sm font-semibold leading-tight text-paper">{member.name}</h3>
        <p className="mt-1 text-xs font-semibold" style={{ color }}>
          {member.role}
        </p>
      </div>
    </Link>
  );
}
