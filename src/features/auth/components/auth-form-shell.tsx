"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  Loader2,
  type LucideIcon,
  TriangleAlert,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { NormalizedApiError } from "@/types/api";

/**
 * Shared chrome for every auth form: heading, inline error banner, submit
 * button, footer link, success state.
 *
 * Centralised so the four auth screens cannot drift in spacing, button width
 * or error placement — the kind of inconsistency that is invisible in review
 * and obvious when clicking through the flow.
 *
 * The frame itself (card, backdrop, gradient ring) lives in `AuthCard` and the
 * (auth) layout, so it stays put while the page inside swaps.
 */

/**
 * Screen heading.
 *
 * `accent` takes the one or two words that should carry the gold gradient,
 * which keeps the display font doing the brand work without tinting the whole
 * line — a fully gold heading reads as a discount banner, not a product.
 */
export function AuthFormHeader({
  eyebrow,
  title,
  accent,
  description,
  align = "left",
}: {
  eyebrow?: string;
  title: string;
  accent?: string;
  description?: ReactNode;
  align?: "left" | "center";
}) {
  return (
    <header
      className={cn(
        "mb-8",
        align === "center" && "text-center",
      )}
    >
      {eyebrow ? (
        <p className="text-primary/85 text-[0.6875rem] font-semibold tracking-[0.26em] uppercase">
          {eyebrow}
        </p>
      ) : null}

      <h1 className="font-display mt-3 text-[1.75rem] leading-[1.08] tracking-[-0.025em] text-balance sm:text-[2.125rem]">
        {title}
        {accent ? (
          <>
            {" "}
            <span className="text-gradient-gold">{accent}</span>
          </>
        ) : null}
      </h1>

      {description ? (
        <p
          className={cn(
            "text-muted-foreground mt-3.5 text-[0.9375rem] leading-relaxed text-pretty",
            align === "center" && "mx-auto max-w-sm",
          )}
        >
          {description}
        </p>
      ) : null}
    </header>
  );
}

/**
 * Inline error banner for non-field failures.
 *
 * Auth errors are shown inline rather than only as a toast: toasts auto-dismiss
 * and are easy to miss when the user is already looking at the password field
 * wondering why nothing happened. `role="alert"` announces it immediately.
 */
export function AuthFormError({ error }: { error: NormalizedApiError | null }) {
  return (
    <AnimatePresence initial={false}>
      {error && (
        <motion.div
          initial={{ opacity: 0, height: 0, marginBottom: 0 }}
          animate={{ opacity: 1, height: "auto", marginBottom: 24 }}
          exit={{ opacity: 0, height: 0, marginBottom: 0 }}
          transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
          className="overflow-hidden"
        >
          <div
            role="alert"
            className="border-loss/30 bg-loss-muted/60 text-loss flex items-start gap-3 rounded-xl border px-4 py-3.5 backdrop-blur-sm"
          >
            <TriangleAlert
              className="mt-0.5 size-4 shrink-0"
              strokeWidth={2.2}
              aria-hidden="true"
            />
            <p className="text-sm leading-relaxed">{error.message}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * Primary call to action.
 *
 * The gold gradient is a layered child rather than a variant on `Button`, which
 * only supports flat `background-color`. Three passes stack into the treatment:
 * the static gradient, a white shimmer that sweeps on hover, and a lift in
 * shadow depth. `text-[#1a1204]` is the near-black that clears AA on gold —
 * `--primary-foreground` is tuned for the flat button, not the gradient.
 */
export function AuthSubmitButton({
  children,
  loading,
  disabled,
  loadingLabel,
  className,
}: {
  children: ReactNode;
  loading?: boolean;
  disabled?: boolean;
  loadingLabel?: string;
  className?: string;
}) {
  return (
    <Button
      type="submit"
      // `disabled` while loading prevents the double-submit that, on signup,
      // produces a duplicate-email 409 on the user's own second click.
      disabled={loading || disabled}
      className={cn(
        "group/submit relative h-12 w-full overflow-hidden rounded-xl",
        "text-[0.75rem] font-semibold tracking-[0.16em] uppercase",
        "shadow-[0_14px_38px_-14px_rgba(212,175,90,0.65)]",
        "transition-all duration-300",
        "hover:shadow-[0_18px_46px_-12px_rgba(212,175,90,0.8)]",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(110deg,#b8944a_0%,#f0d48a_38%,#d4af5a_62%,#b8944a_100%)] bg-[length:220%_auto] transition-[background-position] duration-700 group-hover/submit:[background-position:100%_50%]"
      />
      <span
        aria-hidden="true"
        className="absolute inset-0 translate-x-[-120%] bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.5),transparent)] transition-transform duration-700 group-hover/submit:translate-x-[120%]"
      />

      <span className="text-[#1a1204] relative z-10 inline-flex items-center justify-center gap-2">
        {loading ? <Loader2 className="size-4 animate-spin" /> : null}
        {loading ? (loadingLabel ?? "Please wait…") : children}
        {loading ? null : (
          <ArrowRight className="size-4 transition-transform duration-300 group-hover/submit:translate-x-1" />
        )}
      </span>
    </Button>
  );
}

/**
 * Post-submit confirmation. Used by forgot-password and reset-password instead
 * of each hand-rolling its own success markup. Not verify-email: that one
 * redirects to the dashboard the moment the code checks out, so there is no
 * success screen to stand still on.
 *
 * Gold, like every other accent on these screens — the eyebrow, the submit
 * button, Back to home, the card's hairline ring. `--profit` reads as a generic
 * "success green" and is worse than a mismatch here, because it is a *trading*
 * token: it means "this position gained" everywhere else in the product, so
 * borrowing it to mean "your email was sent" reads as a financial state. There
 * is no separate neutral tone for that reason — when success matched neutral
 * there was nothing left for the prop to switch between, so it is gone rather
 * than left as a no-op.
 */
export function AuthStatus({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: LucideIcon;
  title: string;
  description?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="relative mb-7 w-fit">
        <div
          aria-hidden="true"
          className="border-primary/20 bg-primary/10 absolute -inset-3 rounded-full blur-xl"
        />

        <div className="border-primary/25 bg-primary/10 text-primary relative grid size-14 place-items-center rounded-2xl border">
          <Icon className="size-6" strokeWidth={1.7} aria-hidden="true" />
        </div>
      </div>

      <AuthFormHeader title={title} description={description} />

      {children ? <div className="space-y-3">{children}</div> : null}
    </motion.div>
  );
}

/** Pill confirming a completed step, e.g. "Account secured". Gold, per `AuthStatus`. */
export function AuthTrustNote({
  icon: Icon = CheckCircle2,
  children,
}: {
  icon?: LucideIcon;
  children: ReactNode;
}) {
  return (
    <p className="text-muted-foreground/80 inline-flex items-center gap-1.5 text-xs">
      <Icon className="text-primary size-3.5 shrink-0" strokeWidth={2.2} aria-hidden="true" />
      {children}
    </p>
  );
}

export function AuthFormFooter({
  prompt,
  linkLabel,
  href,
}: {
  prompt: string;
  linkLabel: string;
  href: string;
}) {
  return (
    <p className="text-muted-foreground mt-8 text-center text-sm">
      {prompt}{" "}
      <Link
        href={href}
        className="group/link text-foreground inline-flex items-center gap-1 font-medium underline-offset-4 transition-colors hover:text-primary"
      >
        {linkLabel}
        <ArrowRight className="size-3.5 -translate-x-1 opacity-0 transition-all duration-300 group-hover/link:translate-x-0 group-hover/link:opacity-100" />
      </Link>
    </p>
  );
}

/** Centred "back" affordance for the dead-end auth screens. */
export function AuthBackLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <div className="mt-8 text-center">
      <Link
        href={href}
        className="text-muted-foreground hover:text-foreground group/back inline-flex items-center gap-1.5 text-sm transition-colors"
      >
        <ArrowRight className="size-3.5 rotate-180 transition-transform duration-300 group-hover/back:-translate-x-0.5" />
        {children}
      </Link>
    </div>
  );
}