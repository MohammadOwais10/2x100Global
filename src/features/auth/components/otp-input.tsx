"use client";

import {
  useRef,
  useState,
  type ChangeEvent,
  type ComponentProps,
} from "react";

import { cn } from "@/lib/utils";

const LENGTH = 6;

/**
 * Segmented one-time-code field.
 *
 * Backed by ONE real `<input>` stretched transparently across the boxes, rather
 * than six separate inputs. That inversion is the whole design:
 *
 *   - `autocomplete="one-time-code"` only autofills reliably into a single
 *     field, which is what makes "paste the code from your email" work on
 *     iOS/Android SMS suggestions.
 *   - Paste, drop, hardware keyboards and dictation all behave natively, with
 *     no per-index bookkeeping to get wrong.
 *   - One tab stop, one accessible name, one caret. Six inputs get all three
 *     wrong in different ways.
 *
 * The boxes are `aria-hidden` presentational chrome; the input owns the label,
 * the value and the announcement. Caret position is mirrored onto the box
 * geometry purely for the active-cell highlight, so the user can still see
 * where they are after a mid-string edit.
 */
export interface OtpInputProps
  extends Omit<ComponentProps<"input">, "onChange" | "value" | "type"> {
  value: string;
  onChange: (value: string) => void;
  /** Fires the moment the final digit lands, for auto-submit. */
  onComplete?: (value: string) => void;
  invalid?: boolean;
}

export function OtpInput({
  value,
  onChange,
  onComplete,
  invalid,
  disabled,
  className,
  onFocus,
  onBlur,
  ...props
}: OtpInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [focused, setFocused] = useState(false);
  const [caret, setCaret] = useState(0);

  const digits = value.slice(0, LENGTH);
  // Past the end of the string the last cell is what the user is typing into.
  const activeIndex = focused ? Math.min(caret, LENGTH - 1) : -1;

  function syncCaret() {
    const el = inputRef.current;
    if (!el) return;
    setCaret(el.selectionStart ?? el.value.length);
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    // Strip anything non-numeric so a pasted "123 456" or "code: 123456" still
    // lands six clean digits instead of failing validation on whitespace.
    const next = event.target.value.replace(/\D/g, "").slice(0, LENGTH);
    onChange(next);
    setCaret(next.length);
    if (next.length === LENGTH) onComplete?.(next);
  }

  return (
    <div className={cn("w-full", className)}>
      <div className="relative">
        <input
          ref={inputRef}
          {...props}
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          pattern="[0-9]*"
          maxLength={LENGTH}
          disabled={disabled}
          value={value}
          onChange={handleChange}
          onKeyUp={syncCaret}
          onClick={syncCaret}
          onSelect={syncCaret}
          onFocus={(event) => {
            setFocused(true);
            syncCaret();
            onFocus?.(event);
          }}
          onBlur={(event) => {
            setFocused(false);
            onBlur?.(event);
          }}
          aria-invalid={invalid}
          className="absolute inset-0 z-10 size-full cursor-pointer rounded-xl text-transparent caret-transparent opacity-0"
        />

        <div className="flex gap-2 sm:gap-2.5" aria-hidden="true">
          {Array.from({ length: LENGTH }, (_, index) => {
            const char = digits[index] ?? "";
            const isActive = index === activeIndex && !invalid;

            return (
              <div
                key={index}
                className={cn(
                  "relative flex h-14 flex-1 items-center justify-center rounded-xl border font-mono text-lg font-semibold transition-all duration-200",
                  invalid
                    ? "border-loss/50 bg-loss-muted/25"
                    : "border-input/60 bg-surface-2/40",
                  char && !invalid && "border-primary/35 bg-surface-2/65 text-foreground",
                  char && invalid && "text-loss",
                  isActive &&
                    "border-primary/70 bg-surface-2/75 shadow-[0_0_0_4px_rgba(212,175,90,0.14)]",
                  disabled && "opacity-55",
                )}
              >
                {char ? (
                  char
                ) : isActive ? (
                  <span className="bg-primary h-5 w-px animate-pulse" />
                ) : (
                  <span className="bg-muted-foreground/20 size-1.5 rounded-full" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}