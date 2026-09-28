import type { Metadata } from "next";
import { ChatCircleText, EnvelopeSimple, Trash } from "@phosphor-icons/react/dist/ssr";
import { prisma } from "@/lib/prisma";
import { deleteMessage } from "@/lib/actions/messages";
import { PageHeader } from "@/components/admin/PageHeader";

export const metadata: Metadata = { title: "Messages" };

const dateFormat = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

export default async function AdminMessagesPage() {
  const messages = await prisma.contactSubmission.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <PageHeader
        eyebrow="Inbox"
        title="Messages"
        description={`${messages.length} message${messages.length === 1 ? "" : "s"} sent through the contact form.`}
      />

      {messages.length > 0 ? (
        <ul className="mt-8 space-y-4">
          {messages.map((m) => (
            <li key={m.id} className="rounded-3xl bg-paper p-6 shadow-sm ring-1 ring-black/5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-lg font-bold text-navy">{m.name}</p>
                  <a href={`mailto:${m.email}`} className="text-sm text-blue hover:underline">
                    {m.email}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-navy/50">{dateFormat.format(m.createdAt)}</span>
                  <a
                    href={`mailto:${m.email}?subject=${encodeURIComponent("Re: your message to STEMEOC")}`}
                    aria-label={`Reply to ${m.name}`}
                    title="Reply"
                    className="flex h-9 w-9 items-center justify-center rounded-xl text-ink/40 transition-colors hover:bg-blue hover:text-paper"
                  >
                    <EnvelopeSimple size={16} weight="bold" />
                  </a>
                  <form action={deleteMessage.bind(null, m.id)}>
                    <button
                      type="submit"
                      aria-label={`Delete message from ${m.name}`}
                      title="Delete"
                      className="flex h-9 w-9 items-center justify-center rounded-xl text-ink/40 transition-colors hover:bg-red hover:text-paper"
                    >
                      <Trash size={16} weight="bold" />
                    </button>
                  </form>
                </div>
              </div>
              <p className="mt-4 whitespace-pre-line text-base leading-relaxed text-navy/80">{m.message}</p>
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-8 rounded-3xl bg-paper px-7 py-16 text-center ring-1 ring-black/5">
          <ChatCircleText size={36} className="mx-auto text-navy/25" />
          <p className="mt-3 text-base text-navy/50">No messages yet. Contact form messages will show here.</p>
        </div>
      )}
    </div>
  );
}
