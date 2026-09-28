import { Fragment } from "react";

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** Renders `text` with every occurrence of `terms` wrapped in a <mark>. */
export function Highlight({ text, terms }: { text: string; terms: string[] }) {
  const clean = terms.filter((t) => t.length > 0);
  if (clean.length === 0) return <>{text}</>;
  // Longest first, so "robotics olympiad" wins over "robotics".
  const pattern = new RegExp(`(${clean.sort((a, b) => b.length - a.length).map(escape).join("|")})`, "gi");
  return (
    <>
      {text.split(pattern).map((part, i) =>
        i % 2 === 1 ? (
          <mark key={i} className="rounded-sm bg-orange/25 px-0.5 text-inherit">
            {part}
          </mark>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        )
      )}
    </>
  );
}
