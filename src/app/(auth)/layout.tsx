import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { AuthCard } from "@/features/auth/components/auth-card";
import { ROUTES } from "@/config/routes";

/**
 * Layout for the unauthenticated auth routes.
 *
 * Single centred column — form only. A fixed bar holds the logo on the left and
 * the way back home on the right; `Backdrop` is a separate fixed layer, so the
 * gradient and its blobs stay anchored to the viewport while the card scrolls
 * underneath them. Anchoring the card instead would drag the emerald blob off
 * the top of the screen on long forms like signup and leave a flat black void
 * behind the fields.
 *
 * The bar fades the page out beneath it rather than taking a solid fill: signup
 * scrolls roughly 1300px, and an opaque bar would visibly cut the form in half.
 * A gradient to `background` matches the base of the hero glow, so the seam is
 * invisible at rest and the fade is only doing work once content moves under it.
 *
 * There is deliberately no theme toggle here. The home page is dark-only, and
 * a visitor's first impression of the product should not depend on a local
 * preference set on some other site. `.dark` is re-asserted on this wrapper so
 * the auth surface stays dark even when someone has chosen light elsewhere in
 * the app (the in-app topbar still exposes the toggle): the token sheet defines
 * dark under `:root, .dark`, so a `.dark` element re-binds every custom property
 * for its own subtree regardless of what `<html>` says.
 *
 * Kept as a Server Component; only the forms are client.
 */
export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="dark relative isolate min-h-dvh">
      <Backdrop />

      <header className="fixed inset-x-0 top-0 z-40">
        <div
          aria-hidden="true"
          className="from-background via-background/70 pointer-events-none absolute inset-x-0 top-0 h-32 sm:h-12  bg-gradient-to-b to-transparent"
        />

        <div className="relative flex h-20 items-center justify-between px-6 lg:px-10">
          {/* Same markup and sizing as the home header, so the two read as the
              same product surface rather than two different ones. */}
          <Link href={ROUTES.home} className="group inline-flex items-center">
            <Image
              src="/logo.png"
              alt="2X100 Global"
              width={148}
              height={48}
              className="h-10 w-auto object-contain transition group-hover:brightness-110"
              priority
            />
          </Link>

          <Link
            href={ROUTES.home}
            className="border-border/60 bg-background/70 text-muted-foreground hover:border-primary/40 hover:bg-primary/10 hover:text-foreground inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-xs font-medium backdrop-blur-sm transition-colors"
          >
            <ArrowLeft className="size-3.5" strokeWidth={2} aria-hidden="true" />
            Back to home
          </Link>
        </div>
      </header>

      {/* Vertical centring depends on an invariant worth stating, because it is not
          obvious from the numbers: `my-auto` splits the leftover space evenly
          inside the content box, so the card sits centred in the band below the
          fixed bar *only if* the top padding equals the bar height plus the
          bottom padding. Otherwise the gaps read unequal by exactly the error —
          `pt-24` against `pb-6` put the card 8px high, which is small enough
          to look like a mistake rather than a choice.

            pt = bar (80px) + pb     ->  104 = 80 + 24   (mobile)
                                        112 = 80 + 32   (sm and up)

          `my-auto`, not `items-center`: when a form outgrows the viewport the
          auto margin collapses to 0 and the card top-aligns, keeping the first
          field reachable. `items-center` would overflow in both directions and
          push it out of reach entirely.

          Horizontal: a three-step gutter rather than two jumps, so the card is
          not pinched on a 390px phone nor stranded on a 1920px display. The
          30rem cap holds line length readable on desktop.

          `overflow-x-clip` contains the card's bloom, which is drawn at
          `-inset-8` and so reaches past the side padding on narrow screens.
          `clip` over `hidden` because it suppresses the horizontal scrollbar
          without turning the element into a scroll container. */}
      <main className="relative z-10 flex min-h-dvh justify-center overflow-x-clip px-5 pt-26 pb-6 sm:px-6 sm:pt-20 sm:pb-8 lg:px-10">
        <div className="my-auto w-full max-w-[30rem]">
          <AuthCard>{children}</AuthCard>
        </div>
      </main>
    </div>
  );
}

/**
 * The homepage background, reused verbatim.
 *
 * `hero-glow` supplies the same layered gradient stack the home hero paints
 * (`emerald → gold → deep floor → #030806`), and the two blurred radial blobs
 * below are copied from `HeroSection` — emerald top-right, gold bottom-left.
 * Deliberately not a bespoke composition: the auth pages should feel like the
 * same product surface, not a different theme.
 *
 * `fixed` rather than `absolute`: it takes this layer out of the document flow
 * so the blobs stay put while the card scrolls. `absolute` would pin them to
 * the wrapper, which grows to the full height of the tallest form, and the
 * emerald blob — anchored at `top-16` — would scroll away, leaving the bottom
 * of a long signup form sitting on bare black.
 *
 * `overflow-hidden` clips the blobs, which sit at negative offsets
 * (`-right-24`, `-left-32`) and would otherwise open a horizontal scrollbar.
 */
function Backdrop() {
  return (
    <div
      aria-hidden="true"
      className="hero-glow pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      <div className="absolute -right-24 top-16 size-[520px] rounded-full bg-[radial-gradient(circle,rgba(26,157,92,0.18),transparent_68%)] blur-2xl" />
      <div className="absolute -left-32 bottom-0 size-[420px] rounded-full bg-[radial-gradient(circle,rgba(212,175,90,0.12),transparent_70%)] blur-2xl" />
    </div>
  );
}