"use client";

/**
 * Silences a harmless error from page transitions.
 *
 * When a transition starts while the tab is hidden (a refresh or navigation
 * while you're on another tab), the browser skips it and rejects with an
 * InvalidStateError. React ignores that error, but only when the message
 * matches one of a few exact strings, and newer Chromium builds append detail
 * ("…invalid state. Document hidden"), so React reports it as a Recoverable
 * Error instead. This wraps document.startViewTransition so those rejections
 * carry the wording React already recognizes. The page still updates; it just
 * skips the animation, exactly as intended.
 */
const RECOGNIZED = "Transition was aborted because of invalid state";

function install() {
  if (typeof document === "undefined" || !("startViewTransition" in document)) return;
  const proto = Document.prototype as Document & { __vtGuard?: boolean };
  if (proto.__vtGuard) return;
  proto.__vtGuard = true;

  const original = proto.startViewTransition;
  const normalize = (promise: Promise<unknown>) => {
    const fixed = promise.catch((error: unknown) => {
      if (error instanceof DOMException && error.name === "InvalidStateError" && error.message !== RECOGNIZED) {
        throw new DOMException(RECOGNIZED, "InvalidStateError");
      }
      throw error;
    });
    // React only listens to some of these promises; don't let the others surface as unhandled.
    fixed.catch(() => {});
    return fixed;
  };

  proto.startViewTransition = function (this: Document, ...args: Parameters<Document["startViewTransition"]>) {
    const transition = original.apply(this, args);
    const overrides: Record<PropertyKey, unknown> = {
      ready: normalize(transition.ready),
      finished: normalize(transition.finished),
      updateCallbackDone: normalize(transition.updateCallbackDone),
    };
    return new Proxy(transition, {
      get(target, prop) {
        if (prop in overrides) return overrides[prop];
        const value = Reflect.get(target, prop, target);
        return typeof value === "function" ? value.bind(target) : value;
      },
    });
  } as Document["startViewTransition"];
}

install();

export function ViewTransitionGuard() {
  return null;
}
