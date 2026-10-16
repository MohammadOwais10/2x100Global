"use client";

import type { ComponentProps, ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { FormLabel } from "@/components/ui/form";

/**
 * Field chrome for the auth surfaces.
 *
 * Why a bespoke `AuthInput` rather than the shared `ui/input`:
 *
 * `ui/input` carries a `dark:bg-input/30` variant, and Tailwind emits variants
 * after base utilities in source order. A caller-supplied `bg-surface-2/40`
 * therefore loses to it in dark mode — which is the only mode this app ships —
 * and every input silently picks up a translucent gold cast. Owning the element
 * here makes the fill, border and focus ring deterministic.
 *
 * Everything else stays on the shadcn contract: `FormControl` is a Slot, so it
 * passes `id`, `aria-*` and the ref straight through to this input.
 */

/** Height, radius and focus treatment shared by every auth control. */
export const AUTH_CONTROL_CLASS =
  "h-12 w-full rounded-xl px-3.5 text-[0.9375rem] leading-none transition-[border-color,box-shadow,background-color] duration-200 " +
  "border border-input/60 bg-surface-2/40 " +
  "placeholder:text-muted-foreground/45 " +
  "hover:border-primary/35 " +
  "focus-visible:border-primary/60 focus-visible:bg-surface-2/65 focus-visible:ring-4 focus-visible:ring-primary/12 " +
  "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-55 " +
  "aria-invalid:border-loss/55 aria-invalid:bg-loss-muted/25 aria-invalid:ring-4 aria-invalid:ring-loss/12";

/** Extra left padding for fields that carry a leading icon. */
const ICON_PAD = "pl-11";

export function AuthInput({
  className,
  hasIcon,
  ...props
}: ComponentProps<"input"> & { hasIcon?: boolean }) {
  return (
    <input
      data-slot="auth-input"
      className={cn(AUTH_CONTROL_CLASS, hasIcon && ICON_PAD, className)}
      {...props}
    />
  );
}

/**
 * Relative wrapper that seats a lucide icon inside the left edge of a control.
 *
 * `group-focus-within` drives the icon's colour, so the icon tracks focus
 * without the field having to know anything about it.
 */
export function AuthInputShell({
  icon: Icon,
  className,
  children,
}: {
  icon?: LucideIcon;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("group/field relative flex items-center", className)}>
      {Icon ? (
        <Icon
          className="text-muted-foreground/60 pointer-events-none absolute left-4 size-[1.0625rem] transition-colors duration-200 group-focus-within/field:text-primary"
          strokeWidth={1.7}
          aria-hidden="true"
        />
      ) : null}
      {children}
    </div>
  );
}

/** Slightly tightened tracking than the shadcn default reads better at 13px. */
export function AuthFieldLabel({
  className,
  ...props
}: ComponentProps<typeof FormLabel>) {
  return (
    <FormLabel
      className={cn(
        "text-foreground/85 text-[0.8125rem] font-medium tracking-tight",
        className,
      )}
      {...props}
    />
  );
}

/**
 * Hint text rendered under a control.
 *
 * Sits below the label and above the error so the error — the thing the user
 * must act on — is always the last line, closest to the next field.
 */
export function AuthFieldHint({
  className,
  ...props
}: ComponentProps<"p">) {
  return (
    <p
      className={cn("text-muted-foreground/85 text-xs leading-relaxed", className)}
      {...props}
    />
  );
}