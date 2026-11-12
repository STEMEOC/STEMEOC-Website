import Image from "next/image";

// partner logo marquee
export function PartnerLogos({ partners }: { partners: { name: string; logoUrl: string }[] }) {
  return (
    <div className="group overflow-hidden motion-reduce:overflow-x-auto">
      {/* two copies so the -50% loop is seamless */}
      <div className="flex w-max animate-marquee [--marquee-duration:40s] group-hover:[animation-play-state:paused] motion-reduce:animate-none">
        {[0, 1].map((copy) => (
          <ul key={copy} aria-hidden={copy === 1 || undefined} className="flex shrink-0 items-center gap-16 pr-16 md:gap-24 md:pr-24">
            {partners.map((partner) => (
              <li key={partner.name}>
                <Image
                  src={partner.logoUrl}
                  alt={copy === 1 ? "" : partner.name}
                  width={240}
                  height={240}
                  className="h-14 w-auto max-w-44 object-contain md:h-20 md:max-w-56"
                />
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}
