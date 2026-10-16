"use client";

import { forwardRef, useId, useState } from "react";
import { Check, Eye, EyeOff, type LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

import { cn } from "@/lib/utils";
import { assessPassword, type PasswordStrength } from "../schemas/auth-schemas";
import { AUTH_CONTROL_CLASS } from "./auth-field";

/**
 * Password field with a visibility toggle and an optional strength meter.
 *
 * The visibility toggle is not a nicety: on mobile, a masked 12-character
 * password with mixed case and symbols has a high mistype rate, and the
 * alternative users reach for is a weaker password they can type reliably.
 *
 * `forwardRef` is required so react-hook-form's `register`/`setFocus` can
 * address the underlying input — without it, focusing the first errored field
 * silently does nothing.
 */

export interface PasswordInputProps
  extends Omit<React.ComponentProps<"input">, "type"> {
  /** Render the strength meter. Signup/reset only — never on login. */
  showStrength?: boolean;
  invalid?: boolean;
  /** Leading icon, seated in the same left gutter as `AuthInputShell`. */
  icon?: LucideIcon;
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  function PasswordInput(
    {
      className,
      showStrength = false,
      invalid,
      icon: Icon,
      value,
      "aria-describedby": describedBy,
      ...props
    },
    ref,
  ) {
    const [visible, setVisible] = useState(false);
    const meterId = useId();

    const text = typeof value === "string" ? value : "";
    const assessment = showStrength ? assessPassword(text) : null;

    // `FormControl` is a Slot, so it injects its own `aria-describedby`
    // pointing at the (absent) form-description node. Spreading props after our
    // own attribute would clobber the meter id and leave the meter rendering
    // but unannounced — so the ids are merged here instead of overwritten.
    const ariaDescribedBy =
      [describedBy, assessment ? meterId : undefined].filter(Boolean).join(" ") ||
      undefined;

    return (
      <div className="space-y-2.5">
        <div className="group/field relative flex items-center">
          {Icon ? (
            <Icon
              className="text-muted-foreground/60 pointer-events-none absolute left-4 size-[1.0625rem] transition-colors duration-200 group-focus-within/field:text-primary"
              strokeWidth={1.7}
              aria-hidden="true"
            />
          ) : null}

          <input
            ref={ref}
            data-slot="auth-input"
            type={visible ? "text" : "password"}
            value={value}
            aria-invalid={invalid}
            aria-describedby={ariaDescribedBy}
            className={cn(
              AUTH_CONTROL_CLASS,
              Icon && "pl-11",
              "pr-12",
              className,
            )}
            {...props}
          />

          <button
            type="button"
            // `tabIndex={-1}` keeps Tab moving between form fields rather than
            // detouring through the toggle on every password input.
            tabIndex={-1}
            onClick={() => setVisible((current) => !current)}
            aria-label={visible ? "Hide password" : "Show password"}
            className="text-muted-foreground hover:text-foreground focus-visible:text-foreground absolute right-3 grid size-8 cursor-pointer place-items-center rounded-lg transition-colors"
          >
            {visible ? (
              <EyeOff className="size-4" strokeWidth={1.8} />
            ) : (
              <Eye className="size-4" strokeWidth={1.8} />
            )}
          </button>
        </div>

        {assessment && text.length > 0 ? (
          <div id={meterId} className="space-y-2 pt-0.5">
            <StrengthBars score={assessment.score} />
            <div className="flex items-start justify-between gap-3">
              <p className={cn("text-xs font-medium", STRENGTH_TEXT[assessment.score])}>
                {assessment.label}
              </p>
              {assessment.suggestions.length > 0 ? (
                <ul className="text-muted-foreground/85 space-y-0.5 text-right text-[0.6875rem]">
                  {assessment.suggestions.map((suggestion) => (
                    <li key={suggestion}>{suggestion}</li>
                  ))}
                </ul>
              ) : null}
            </div>
            {assessment.suggestions.length === 0 ? (
              <p className="text-primary inline-flex items-center gap-1.5 text-[0.6875rem]">
                <Check className="size-3" strokeWidth={3} aria-hidden="true" />
                Meets all recommendations
              </p>
            ) : null}
          </div>
        ) : null}
      </div>
    );
  },
);

/**
 * Green at strength 4, deliberately: this is the one place on the auth screens
 * where colour carries a magnitude rather than a brand accent, and the ladder
 * has to read as weak → strong. It is the only remaining `--profit` in the auth
 * tree — every affirmative confirmation uses brand gold instead, because green
 * here means "strong password", not "confirmed".
 */
const STRENGTH_TEXT: Record<PasswordStrength, string> = {
  0: "text-loss",
  1: "text-loss",
  2: "text-pending",
  3: "text-info",
  4: "text-profit",
};

const STRENGTH_BG: Record<PasswordStrength, string> = {
  0: "bg-loss",
  1: "bg-loss",
  2: "bg-pending",
  3: "bg-info",
  4: "bg-profit",
};

/**
 * Four segments rather than a single continuous bar: discrete steps make the
 * effect of adding a character class legible, where a smoothly growing bar
 * reads as arbitrary.
 */
function StrengthBars({ score }: { score: PasswordStrength }) {
  return (
    <div className="flex gap-1.5" aria-hidden="true">
      {[1, 2, 3, 4].map((segment) => {
        const filled = score >= segment;
        return (
          <div key={segment} className="bg-muted h-1 flex-1 overflow-hidden rounded-full">
            <motion.div
              initial={false}
              animate={{ scaleX: filled ? 1 : 0 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              style={{ transformOrigin: "left" }}
              className={cn("h-full w-full rounded-full", STRENGTH_BG[score])}
            />
          </div>
        );
      })}
    </div>
  );
}