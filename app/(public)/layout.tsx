import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { IntroCurtain } from "@/components/motion/IntroCurtain";

// Runs before first paint: if the intro already played this session, hide the
// server-rendered curtain so repeat loads never flash the brand colors.
// Adding ?intro to any URL replays it (handy for previewing).
const introGate = `try{if(sessionStorage.getItem("stemeoc-intro-seen")&&!new URLSearchParams(location.search).has("intro"))document.documentElement.setAttribute("data-intro-seen","")}catch(e){}`;

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: introGate }} />
      <IntroCurtain />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}