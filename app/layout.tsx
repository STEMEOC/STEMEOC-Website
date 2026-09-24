import type { Metadata } from "next";
import { Fredoka, Nunito_Sans, JetBrains_Mono, Kantumruy_Pro } from "next/font/google";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { getLocale } from "@/lib/i18n/locale";
import "./globals.css";

const displayFont = Fredoka({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const bodyFont = Nunito_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
});

const monoFont = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "600"],
});

const khmerFont = Kantumruy_Pro({
  variable: "--font-khmer",
  subsets: ["khmer", "latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "STEMEOC, STEM Education Organization of Cambodia",
    template: "%s · STEMEOC",
  },
  description:
    "STEMEOC brings hands-on science, technology, engineering, and math education to students across Cambodia through festivals, robotics competitions, and school partnerships.",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const locale = await getLocale();
  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={`${displayFont.variable} ${bodyFont.variable} ${monoFont.variable} ${khmerFont.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-paper text-ink">
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
