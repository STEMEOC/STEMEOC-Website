import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import {
  RocketLaunch,
  Newspaper,
  GraduationCap,
  Microphone,
  ClipboardText,
  ChartPieSlice,
  ChatCircleText,
  UsersThree,
  Handshake,
  ImageSquare,
  UserCircle,
  Lightbulb,
  ArrowRight,
} from "@phosphor-icons/react/dist/ssr";
import { PageHeader } from "@/components/admin/PageHeader";
import { HelpIndex, type HelpTopic } from "@/components/admin/HelpIndex";

export const metadata: Metadata = { title: "Help" };

type GroupId = "basics" | "content" | "forms" | "people";

const GROUPS: { id: Exclude<GroupId, "basics">; title: string; tint: string }[] = [
  { id: "content", title: "Website content", tint: "bg-blue/10 text-blue" },
  { id: "forms", title: "Forms & inbox", tint: "bg-green/10 text-green" },
  { id: "people", title: "People & account", tint: "bg-orange/15 text-orange" },
];
const TINT: Record<GroupId, string> = {
  basics: "bg-navy text-white",
  ...Object.fromEntries(GROUPS.map((g) => [g.id, g.tint])),
} as Record<GroupId, string>;

type Guide = {
  id: string;
  title: string;
  summary: string;
  icon: typeof Newspaper;
  group: GroupId;
  /** Extra words people might search for. */
  keywords: string;
  href?: string;
  steps: ReactNode[];
  tips?: ReactNode[];
};

const B = ({ children }: { children: ReactNode }) => <strong className="font-semibold text-navy">{children}</strong>;

const GUIDES: Guide[] = [
  {
    id: "getting-started",
    group: "basics",
    keywords: "start publish save hide unpublish delete draft",
    title: "Getting started",
    summary: "How the admin works and how changes reach the website.",
    icon: RocketLaunch,
    steps: [
      <>Use the menu on the left to pick what you want to change: News, Programs, Podcast, Team, Partners, or Forms.</>,
      <>Each page shows a list. Click the <B>New</B> or <B>Add</B> button at the top right to add something, or the pencil icon on a row to edit it.</>,
      <>Press <B>Save</B> at the bottom of the form. Changes go live on the website straight away.</>,
      <>Click <B>View website</B> at the bottom of the menu to check how it looks to visitors.</>,
    ],
    tips: [
      <>Untick <B>Published</B> to hide something from the website without deleting it. Tick it again to bring it back.</>,
      <>Deleting cannot be undone. If you are unsure, unpublish instead.</>,
    ],
  },
  {
    id: "news",
    group: "content",
    keywords: "article post blog slug cover draft",
    title: "News posts",
    summary: "Write articles for the News page.",
    icon: Newspaper,
    href: "/admin/news",
    steps: [
      <>Go to <B>News</B> and click <B>New Post</B>.</>,
      <>Fill in the <B>Title</B>, a short <B>Excerpt</B> (shown on the news list), and the full <B>Body</B>.</>,
      <>The <B>Slug</B> is the web address of the post, e.g. <code>stem-festival-2026-recap</code>. Use lowercase letters, numbers and hyphens only.</>,
      <>Add a <B>Cover image</B> (see <a href="#images" className="text-blue hover:underline">Images</a>).</>,
      <>Tick <B>Published</B> when it is ready, then save. Leave it unticked to keep it as a draft.</>,
    ],
    tips: [<>Changing the slug of a published post breaks links people have already shared.</>],
  },
  {
    id: "programs",
    group: "content",
    keywords: "project competition category order cover",
    title: "Programs",
    summary: "Competitions and projects shown on the Projects page.",
    icon: GraduationCap,
    href: "/admin/programs",
    steps: [
      <>Go to <B>Programs</B> and click <B>New Program</B>.</>,
      <>Enter the <B>Title</B>, <B>Slug</B>, <B>Description</B> and a <B>Category</B> (e.g. festival, robotics, eco).</>,
      <>Upload a <B>Cover image</B>.</>,
      <><B>Display order</B> controls the position: lower numbers appear first.</>,
    ],
  },
  {
    id: "podcast",
    group: "content",
    keywords: "youtube video episode id tag",
    title: "Podcast episodes",
    summary: "Add YouTube episodes to the Podcast page.",
    icon: Microphone,
    href: "/admin/podcast",
    steps: [
      <>Go to <B>Podcast</B> and click <B>Add Episode</B>.</>,
      <>
        Paste the <B>YouTube video ID</B>: the code after <code>v=</code> in the video link. For{" "}
        <code>youtube.com/watch?v=uLvIQmWKLH8</code> the ID is <code>uLvIQmWKLH8</code>.
      </>,
      <>Add a title, description, and an optional <B>Tag</B> such as “Special Episode”.</>,
    ],
  },
  {
    id: "forms",
    group: "forms",
    keywords: "google form question template required share link preview",
    title: "Forms (like Google Forms)",
    summary: "Build sign-up and application forms and share the link.",
    icon: ClipboardText,
    href: "/admin/forms",
    steps: [
      <>Go to <B>Forms</B>. Under <B>Start a new form</B>, pick a template (Volunteer application, Event RSVP, Contact form) or <B>Blank form</B>.</>,
      <>Under <B>Add a question</B>, click the type you want: short text, paragraph, email, number, date, dropdown, multiple choice, checkboxes, or file upload. Then type the question. The form link fills in from the title.</>,
      <>Turn on <B>Required</B> for questions people must answer. Use the arrows to reorder and the copy icon to duplicate a question.</>,
      <>Open the <B>Design &amp; preview</B> tab to pick a color, layout and light/dark look, with a live preview of the form.</>,
      <>Click <B>Create form</B> (or <B>Save changes</B>) at the top. Then click <B>Copy link</B> on the form’s card and share it (e.g. on Facebook or Telegram).</>,
    ],
    tips: [<>Editing questions after people have answered can make old answers harder to read. Add new questions rather than changing existing ones.</>],
  },
  {
    id: "responses",
    group: "forms",
    keywords: "answers chart summary individual csv excel sheets export close accepting",
    title: "Reading form responses",
    summary: "Summary charts, answers per question, and each person's response.",
    icon: ChartPieSlice,
    href: "/admin/forms",
    steps: [
      <>In <B>Forms</B>, click <B>View</B> (or the response count) on the form’s card.</>,
      <><B>Summary</B> shows a chart for each choice question and a list of answers for text questions.</>,
      <><B>Question</B> shows all answers to one question at a time. Use the dropdown or the arrows to switch questions.</>,
      <><B>Individual</B> shows one person’s full response. Use the arrows or pick a name from the dropdown. The bin icon deletes that response.</>,
      <><B>Export CSV</B> downloads every response as a spreadsheet you can open in Google Sheets or Excel.</>,
    ],
    tips: [<>Turn off <B>Accepting responses</B> (on the form’s card or its responses page) to close the form. It is hidden from the website until you turn it back on.</>],
  },
  {
    id: "messages",
    group: "forms",
    keywords: "contact inbox email reply",
    title: "Contact messages",
    summary: "Messages sent through the website's Contact page.",
    icon: ChatCircleText,
    href: "/admin/messages",
    steps: [
      <>Go to <B>Messages</B> to see every message, newest first.</>,
      <>Click the envelope icon to reply by email, or the bin icon to delete a message.</>,
    ],
  },
  {
    id: "team",
    group: "people",
    keywords: "staff member bio photo order",
    title: "Team members",
    summary: "People shown on the About page and their profile pages.",
    icon: UsersThree,
    href: "/admin/team",
    steps: [
      <>Go to <B>Team</B> and click <B>Add Member</B>, or edit an existing person.</>,
      <>Fill in <B>Name</B>, <B>Role</B> and <B>Bio</B>. Leave an empty line between paragraphs in the bio.</>,
      <>Upload a <B>Photo</B>. A clear, front-facing portrait works best.</>,
      <><B>Display order</B>: lower numbers appear first (0 = first).</>,
    ],
  },
  {
    id: "partners",
    group: "people",
    keywords: "logo sponsor website",
    title: "Partners",
    summary: "Partner logos shown on the home page.",
    icon: Handshake,
    href: "/admin/partners",
    steps: [
      <>Go to <B>Partners</B> and click <B>Add Partner</B>.</>,
      <>Upload the <B>Logo</B> (required) and add the partner’s <B>Website URL</B> so the logo links to it.</>,
    ],
    tips: [<>Logos look best as PNG or SVG with a transparent background.</>],
  },
  {
    id: "images",
    group: "content",
    keywords: "photo picture upload replace remove logo cover url",
    title: "Images",
    summary: "Uploading, replacing and removing photos.",
    icon: ImageSquare,
    steps: [
      <>Click the image box or <B>Upload image</B> and choose a file. You see a preview straight away.</>,
      <>The image is uploaded when you press <B>Save</B>.</>,
      <>To change it, click <B>Replace image</B>. To take it off, click <B>Remove</B>.</>,
      <>You can also paste a link under <B>Or use an image URL</B>.</>,
    ],
    tips: [<>Allowed: JPG, PNG, WebP, GIF, AVIF or SVG, up to 8MB. Large phone photos are fine; the website resizes them automatically.</>],
  },
  {
    id: "account",
    group: "people",
    keywords: "profile password photo email sign out logout",
    title: "Your account",
    summary: "Change your name, photo, email or password.",
    icon: UserCircle,
    href: "/admin/profile",
    steps: [
      <>Click your name at the bottom of the menu to open your profile.</>,
      <>Click your photo to upload a new one, then press <B>Save changes</B>.</>,
      <>Use <B>Change password</B> to set a new password. You will need your current one.</>,
      <>Sign out with the arrow button next to your name, especially on shared computers.</>,
    ],
  },
];

export default function AdminHelpPage() {
  // Detailed guides follow the same order as the index: basics, then each group.
  const ordered = [
    ...GUIDES.filter((g) => g.group === "basics"),
    ...GROUPS.flatMap((grp) => GUIDES.filter((g) => g.group === grp.id)),
  ];
  const topics: HelpTopic[] = ordered.map((g) => {
    const Icon = g.icon;
    return {
      id: g.id,
      group: g.group,
      title: g.title,
      summary: g.summary,
      keywords: g.keywords,
      stepCount: g.steps.length,
      icon: <Icon size={20} weight="bold" />,
    };
  });

  return (
    <div className="mx-auto max-w-[90rem]">
      <PageHeader
        eyebrow="Support"
        title="Help & guides"
        description="Step-by-step guides for everything in the admin. Search, or pick a topic to jump to it."
      />

      <HelpIndex
        topics={topics}
        groups={GROUPS}
        intro={GUIDES[0].steps.map((step, i) => (
          <span key={i}>{step}</span>
        ))}
      />

      <div className="mt-14 space-y-6">
        {ordered.map((g) => {
          const Icon = g.icon;
          return (
            <section
              key={g.id}
              id={g.id}
              className="scroll-mt-8 rounded-3xl bg-white ring-1 ring-navy/10"
              aria-labelledby={`${g.id}-title`}
            >
              <header className="flex flex-wrap items-center justify-between gap-4 border-b border-navy/10 px-7 py-5">
                <div className="flex items-center gap-4">
                  <span className={`flex h-11 w-11 items-center justify-center rounded-2xl ${TINT[g.group]}`}>
                    <Icon size={22} weight="bold" />
                  </span>
                  <h2 id={`${g.id}-title`} className="font-display text-2xl font-bold text-navy">
                    {g.title}
                  </h2>
                </div>
                <div className="flex items-center gap-5">
                  {g.href && (
                    <Link
                      href={g.href}
                      className="flex items-center gap-1.5 text-base font-semibold text-blue hover:text-navy"
                    >
                      Open {g.title.split(" (")[0].toLowerCase()}
                      <ArrowRight size={16} weight="bold" />
                    </Link>
                  )}
                  <a href="#top" className="text-sm font-semibold text-navy/40 hover:text-navy">
                    Back to top
                  </a>
                </div>
              </header>

              <div className="px-7 py-6">
                <ol className="space-y-4">
                  {g.steps.map((step, i) => (
                    <li key={i} className="flex gap-4 text-base leading-relaxed text-navy/80">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-navy/5 text-sm font-bold text-navy">
                        {i + 1}
                      </span>
                      <span className="min-w-0 pt-0.5 [&_code]:break-all [&_code]:rounded [&_code]:bg-navy/5 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-sm">
                        {step}
                      </span>
                    </li>
                  ))}
                </ol>

                {g.tips && (
                  <div className="mt-6 space-y-2 rounded-2xl bg-orange/10 px-5 py-4">
                    {g.tips.map((tip, i) => (
                      <p key={i} className="flex gap-3 text-sm leading-relaxed text-navy/80">
                        <Lightbulb size={18} weight="fill" className="mt-0.5 shrink-0 text-orange" />
                        <span>{tip}</span>
                      </p>
                    ))}
                  </div>
                )}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
