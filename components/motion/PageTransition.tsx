import { ViewTransition } from "react";

/**
 * Wraps a page's content so navigations animate: the old page's exit and the
 * new page's enter (including the reveal after loading.tsx). It fires only
 * when a page mounts or unmounts, so form submissions and refreshes on the
 * same page don't replay it. Animations live in globals.css under
 * "Page transitions". Put it in each page.tsx, not a layout: layouts persist
 * across navigations, so enter/exit never fire there.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <ViewTransition enter="page-enter" exit="page-exit" default="none">
      <div>{children}</div>
    </ViewTransition>
  );
}
