import Image from "next/image";
import { FacebookLogo, XLogo, YoutubeLogo } from "@phosphor-icons/react/dist/ssr";
import { getDictionary } from "@/lib/i18n";

const SOCIAL_LINKS = [
  { label: "Facebook", href: "https://facebook.com", icon: FacebookLogo },
  { label: "X", href: "https://twitter.com", icon: XLogo },
  { label: "Youtube", href: "https://youtube.com", icon: YoutubeLogo },
];

export async function Footer() {
  const { dict } = await getDictionary();
  return (
    <footer className="bg-[#060f1e] text-paper">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-16 md:grid-cols-[1.3fr_1fr_1fr]">
        <div>
          <Image
            src="/STEM-logo-full-white.png"
            alt="STEM Education Organization for Cambodia"
            width={11037}
            height={3677}
            className="h-12 w-auto"
          />
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-paper/70">
            {dict.footer.tagline}
          </p>
        </div>

        <div>
          <p className="text-sm font-bold" style={{ color: "var(--color-blue)" }}>
            {dict.footer.followUs}
          </p>
          <ul className="mt-4 space-y-3 text-sm font-semibold">
            {SOCIAL_LINKS.map((social) => {
              const Icon = social.icon;
              return (
                <li key={social.label}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 transition-colors hover:text-orange"
                  >
                    <Icon size={18} weight="fill" />
                    {social.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>

        <div>
          <p className="text-sm font-bold" style={{ color: "var(--color-blue)" }}>
            {dict.footer.connect}
          </p>
          <ul className="mt-4 space-y-3 text-sm text-paper/80">
            <li className="font-bold text-paper">(+855) 69 626 898</li>
            <li>info@stemcambodia.ngo</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-paper/15 px-6 py-6 text-center text-xs text-paper/40">
        © {new Date().getFullYear()} {dict.footer.rights}
      </div>
    </footer>
  );
}
