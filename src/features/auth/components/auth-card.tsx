import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * The single surface every auth screen sits inside.
 *
 * Rendered by the (auth) layout rather than by each page, so the five flows
 * cannot drift in width, padding, radius or shadow depth — the class of
 * inconsistency that is invisible in review and jarring when clicking through
 * login → reset → signup.
 *
 * Three stacked treatments build the depth:
 *   1. a hairline gold gradient border, masked to a 1px ring (not a flat border)
 *   2. an inner top highlight, so the card reads as lit from above
 *   3. a soft gold bloom behind it, so the card appears to emit onto the page
 *
 * All three are dropped below `sm`, along with the surface itself — border,
 * fill, blur, shadow and padding — leaving the bare form on the page
 * background. A phone already has the edge-to-edge gutter the card was
 * providing, so on mobile the card only added a second inset and a hairline
 * that the eye reads as a stray line once it is close to the screen edge. The
 * inner padding goes to zero rather than to a small value for the same reason:
 * anything left over stacks with the layout's `px-5` and the fields stop
 * lining up with the page gutter.
 *
 * `sm:shadow-[var(--shadow-lifted)]` rather than `sm:shadow-lifted`: the
 * `shadow-lifted` class is hand-rolled inside `@layer components` in
 * `globals.css`, and Tailwind only emits `sm:`/`hover:` variants for utilities
 * it has registered — via `@utility` or a theme namespace. There are no
 * `@utility` rules in that stylesheet, so the prefixed name silently generates
 * nothing. The arbitrary-value form is a real utility, so the variant resolves,
 * and it still reads the same token rather than duplicating the shadow value.
 */
export function AuthCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("relative w-full max-w-[30rem]", className)}>
      {/* Bloom. Sits behind the card so the gold appears to bleed outward. With
          no card edge below `sm` there is nothing for it to bleed from, and it
          would just fog the text sitting on top of it. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-8 -z-10 hidden rounded-[2.5rem] bg-[radial-gradient(60%_50%_at_50%_35%,rgba(212,175,90,0.16),transparent_70%)] blur-2xl sm:block"
      />

      <div className="relative sm:overflow-hidden sm:rounded-4xl sm:border sm:border-border/70 sm:bg-card/75 sm:shadow-[var(--shadow-lifted)] sm:backdrop-blur-2xl">
        {/* Gradient hairline ring. Mask composites `content-box` out of the
            full box, leaving exactly 1px of gradient visible at the edge. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 hidden rounded-4xl opacity-70 sm:block"
          style={{
            padding: 1,
            background:
              "linear-gradient(150deg, rgba(212,175,90,0.42) 0%, rgba(212,175,90,0.08) 32%, rgba(26,157,92,0.22) 68%, rgba(212,175,90,0.38) 100%)",
            WebkitMask:
              "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
            WebkitMaskComposite: "xor",
            mask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
            maskComposite: "exclude",
          }}
        />

        {/* Inner top highlight — the "lit from above" cue. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-10 top-0 hidden h-px bg-[linear-gradient(90deg,transparent,rgba(240,212,138,0.55),transparent)] sm:block"
        />

        <div className="relative sm:px-9 sm:py-10">{children}</div>
      </div>
    </div>
  );
}