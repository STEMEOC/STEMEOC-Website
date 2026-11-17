import Image from "next/image";
import type { ProgramEvent } from "@/lib/program-pages";

type Groups = NonNullable<ProgramEvent["sponsors"]>;

// logo height per tier
function logoSize(tier: string) {
  if (/diamond|platinum|gold|venue/i.test(tier)) return "h-20 md:h-28";
  if (/f&b|vendor/i.test(tier)) return "h-12 md:h-14";
  return "h-14 md:h-20";
}

// sponsor credits for one event
export function EventSponsors({ groups }: { groups: Groups }) {
  return (
    <div className="flex flex-wrap justify-center gap-x-16 gap-y-14 md:gap-y-16">
      {groups.map((group) => {
        // short tiers share a row
        const wide = group.items.length > 4;
        return (
          <section key={group.tier} className={wide ? "w-full" : "w-full sm:w-auto"}>
            <h3 className="mb-6 flex items-center gap-4 text-xs font-semibold uppercase tracking-[0.2em] text-navy/60 md:mb-8 md:text-sm">
              <span aria-hidden className="h-px min-w-8 flex-1 bg-navy/20" />
              {group.tier}
              <span aria-hidden className="h-px min-w-8 flex-1 bg-navy/20" />
            </h3>
            <ul className="flex flex-wrap items-center justify-center gap-x-10 gap-y-8 md:gap-x-14">
              {group.items.map((item) => (
                <li key={item.name} className="flex items-center">
                  {item.logo ? (
                    <Image
                      src={item.logo}
                      alt={item.name}
                      width={320}
                      height={200}
                      className={`w-auto max-w-40 object-contain md:max-w-56 ${logoSize(group.tier)}`}
                    />
                  ) : (
                    <span className="font-display text-base font-bold text-navy md:text-lg">{item.name}</span>
                  )}
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
