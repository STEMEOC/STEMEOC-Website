"use client";

import { useState } from "react";
import { FacebookLogo, TelegramLogo, XLogo, WhatsappLogo } from "@phosphor-icons/react/dist/ssr";

const SITE_URL = "https://stemcambodia.ngo";

export function ShareButtons({ slug, title }: { slug: string; title: string }) {
  const url = `${SITE_URL}/news/${slug}`;
  const [hovered, setHovered] = useState<string | null>(null);

  const links = [
    {
      label: "Facebook",
      icon: FacebookLogo,
      color: "#1877F2",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    },
    {
      label: "Telegram",
      icon: TelegramLogo,
      color: "#229ED9",
      href: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
    },
    {
      label: "X",
      icon: XLogo,
      color: "#0F1419",
      href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
    },
    {
      label: "WhatsApp",
      icon: WhatsappLogo,
      color: "#25D366",
      href: `https://api.whatsapp.com/send?text=${encodeURIComponent(`${title} ${url}`)}`,
    },
  ];

  return (
    <div className="rounded-[1.75rem] bg-paper p-5 shadow-lg ring-1 ring-black/5">
      <h3 className="font-display text-lg font-semibold">Share this post</h3>
      <div className="mt-4 grid grid-cols-2 gap-3">
        {links.map((link) => {
          const Icon = link.icon;
          const isHovered = hovered === link.label;
          return (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noreferrer"
              onMouseEnter={() => setHovered(link.label)}
              onMouseLeave={() => setHovered(null)}
              className="group press flex items-center gap-2 rounded-full border-2 px-4 py-2.5 text-sm font-bold hover:-translate-y-0.5"
              style={{
                borderColor: link.color,
                color: isHovered ? "#ffffff" : link.color,
                backgroundColor: isHovered ? link.color : "transparent",
              }}
            >
              <Icon
                size={20}
                weight="fill"
                color={isHovered ? "#ffffff" : link.color}
                className="transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:-rotate-12 group-hover:scale-110"
              />
              {link.label}
            </a>
          );
        })}
      </div>
    </div>
  );
}
