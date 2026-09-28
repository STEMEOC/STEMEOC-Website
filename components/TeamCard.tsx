import Link from "next/link";
import Image from "next/image";
import { ArrowDownRight } from "@phosphor-icons/react/dist/ssr";
import { teamMemberSlug } from "@/lib/content";

/**
 * Square portrait with name and role beneath, linking to the member's profile
 * page. The text inherits its color, so it works on white and navy sections.
 */
export function TeamCard({
  member,
  sizes = "(max-width: 768px) 50vw, 400px",
}: {
  member: { id: string; name: string; role: string; photoUrl: string | null };
  sizes?: string;
}) {
  return (
    <Link
      href={`/team/${teamMemberSlug(member)}`}
      className="group block rounded-2xl text-center outline-offset-4 focus-visible:outline-2 focus-visible:outline-navy"
    >
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-placeholder">
        {member.photoUrl && (
          <Image
            src={member.photoUrl}
            alt=""
            fill
            quality={90}
            // Portraits are taller than the square frame: anchor to the top so heads aren't cropped.
            className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
            sizes={sizes}
          />
        )}
        <span className="absolute bottom-3 right-3 flex size-9 items-center justify-center rounded-full bg-navy text-white transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:-rotate-45 group-hover:scale-110 group-active:scale-90 md:size-11">
          <ArrowDownRight size={20} weight="bold" />
        </span>
      </div>
      <h3 className="mt-4 font-body text-lg font-bold leading-tight md:text-xl">{member.name}</h3>
      <p className="mt-1 text-sm opacity-80">{member.role}</p>
    </Link>
  );
}
