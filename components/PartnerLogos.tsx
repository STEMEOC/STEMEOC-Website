import Image from "next/image";

// partner logo row
export function PartnerLogos({ partners }: { partners: { name: string; logoUrl: string }[] }) {
  return (
    <ul className="flex flex-wrap items-center justify-center gap-x-10 gap-y-8 md:justify-between md:gap-x-8">
      {partners.map((partner) => (
        <li key={partner.name}>
          <Image
            src={partner.logoUrl}
            alt={partner.name}
            width={240}
            height={240}
            className="h-14 w-auto max-w-44 object-contain md:h-20 md:max-w-56"
          />
        </li>
      ))}
    </ul>
  );
}
