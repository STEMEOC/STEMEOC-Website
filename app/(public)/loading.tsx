import { ViewTransition } from "react";

// Shown instantly on navigation while the next page's data loads, and lets
// <Link> prefetch the shared layout so page switches never feel frozen. It
// uses the same page transition as real pages, so the dots hand off smoothly.
export default function Loading() {
  return (
    <ViewTransition enter="page-enter" exit="page-exit" default="none">
      <div className="flex min-h-[60vh] items-center justify-center" role="status" aria-label="Loading">
        <div className="flex gap-2">
          {["bg-blue", "bg-red", "bg-green", "bg-orange"].map((color, i) => (
            <span
              key={color}
              className={`${color} size-3 animate-pulse rounded-full`}
              style={{ animationDelay: `${i * 150}ms` }}
            />
          ))}
        </div>
      </div>
    </ViewTransition>
  );
}
