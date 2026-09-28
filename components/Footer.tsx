import Link from "next/link";
import Image from "next/image";
import { FacebookLogo, LinkedinLogo, YoutubeLogo } from "@phosphor-icons/react/dist/ssr";
import { getDictionary } from "@/lib/i18n";

const SOCIAL_LINKS = [
  { label: "Facebook", href: "https://www.facebook.com/STEMCambodia", icon: FacebookLogo },
  { label: "YouTube", href: "https://www.youtube.com/@StemCambodia", icon: YoutubeLogo },
  { label: "Linkedin", href: "https://www.linkedin.com/company/stemcambodia", icon: LinkedinLogo },
];

const heading = "font-body text-lg font-bold uppercase";

export async function Footer() {
  const { dict } = await getDictionary();
  return (
    <footer className="bg-navy text-white">
      <div className="container-site grid gap-10 py-16 sm:grid-cols-2 lg:grid-cols-[1fr_1.3fr_0.8fr_0.9fr_1fr] lg:gap-12 lg:py-20">
        <Link href="/" className="block w-fit transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 active:scale-[0.98]" aria-label="STEM Education Organization for Cambodia, home">
          <Image
            src="/brand/stem-cambodia-logo.png"
            alt=""
            width={1104}
            height={440}
            className="h-auto w-52"
          />
        </Link>

        <div>
          <p className={heading}>{dict.footer.about}</p>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/90">{dict.footer.tagline}</p>
        </div>

        <div>
          <p className={heading}>{dict.footer.followUs}</p>
          <ul className="mt-4 space-y-3 text-sm">
            {SOCIAL_LINKS.map(({ label, href, icon: Icon }) => (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex w-fit items-center gap-3"
                >
                  <Icon
                    size={22}
                    weight="fill"
                    className="transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:-translate-y-0.5 group-hover:scale-125 group-hover:-rotate-6"
                  />
                  <span className="link-underline">{label}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className={heading}>{dict.footer.getInvolved}</p>
          <ul className="mt-4 list-disc space-y-1 pl-5 text-sm">
            {dict.footer.getInvolvedLinks.map((label) => (
              <li key={label}>
                <Link href="/apply" className="link-underline">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className={heading}>{dict.footer.contact}</p>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <a href="tel:+85569626898" className="link-underline">
                (+855) 69 626 898
              </a>
            </li>
            <li>
              <a href="mailto:info@stemcambodia.ngo" className="link-underline">
                info@stemcambodia.ngo
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="container-site">
        <p className="border-t border-white/15 py-6 text-center text-xs text-white/50">
          © {new Date().getFullYear()} {dict.footer.rights}
        </p>
      </div>
    </footer>
  );
}
