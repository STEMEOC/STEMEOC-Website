import { FacebookLogo, TelegramLogo, XLogo, WhatsappLogo } from "@phosphor-icons/react/dist/ssr";

const SITE_URL = "https://stemcambodia.ngo";

export function ShareButtons({ slug, title, heading }: { slug: string; title: string; heading: string }) {
  const url = encodeURIComponent(`${SITE_URL}/news/${slug}`);
  const text = encodeURIComponent(title);

  const links = [
    { label: "Facebook", icon: FacebookLogo, href: `https://www.facebook.com/sharer/sharer.php?u=${url}` },
    { label: "Telegram", icon: TelegramLogo, href: `https://t.me/share/url?url=${url}&text=${text}` },
    { label: "X", icon: XLogo, href: `https://twitter.com/intent/tweet?url=${url}&text=${text}` },
    { label: "WhatsApp", icon: WhatsappLogo, href: `https://api.whatsapp.com/send?text=${text}%20${url}` },
  ];

  return (
    <div>
      <h2 className="font-body text-lg font-bold">{heading}</h2>
      <ul className="mt-4 flex flex-wrap gap-2 lg:flex-col lg:items-start">
        {links.map(({ label, icon: Icon, href }) => (
          <li key={label}>
            <a
              href={href}
              target="_blank"
              rel="noreferrer"
              className="press inline-flex items-center gap-2 rounded-full border border-navy px-3.5 py-1 text-xs font-bold uppercase transition-colors hover:bg-navy hover:text-white"
            >
              <Icon size={16} weight="fill" />
              {label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
