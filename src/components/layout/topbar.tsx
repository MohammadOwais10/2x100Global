"use client";

import { Menu, Search } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./theme-toggle";
import { UserMenu } from "./user-menu";
import { useAppDispatch } from "@/store/hooks";
import {
  commandPaletteToggled,
  mobileNavToggled,
} from "@/store/slices/ui-slice";

/**
 * Application top bar.
 *
 * Sticky with a translucent backdrop so table headers scroll under it rather
 * than colliding — a small thing that makes long ledger pages feel composed.
 *
 * The right side holds the persistent account controls — theme, then the avatar
 * that carries every account detail behind a click. The sidebar rail keeps only
 * sign out, so this is the one place identity lives.
 *
 * The search control is a button, not an input. It opens the ⌘K palette, which
 * searches navigation, and later transactions and users. A dead-looking input
 * that does nothing until you type is worse than an honest button, and this
 * also keeps the palette as the single search surface.
 */

export interface TopbarProps {
  /** Right-hand slot for page-specific controls. */
  children?: React.ReactNode;
  className?: string;
}

export function Topbar({
  children,
  className,
}: TopbarProps) {
  const dispatch = useAppDispatch();

  return (
    <header
      className={cn(
        "sticky top-0 z-30 flex h-16 shrink-0 items-center gap-2 px-4 lg:px-6",
        "border-border/60 border-b",
        "bg-background/70 backdrop-blur-xl backdrop-saturate-150",
        className,
      )}
    >
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        onClick={() => dispatch(mobileNavToggled())}
        aria-label="Open navigation"
      >
        <Menu className="size-5" />
      </Button>

      <button
        type="button"
        onClick={() => dispatch(commandPaletteToggled())}
        className={cn(
          "text-muted-foreground hover:text-foreground hover:border-border",
          "hidden h-8 w-full max-w-72 items-center gap-2 rounded-lg border border-dashed px-3 text-sm",
          "transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring sm:flex",
        )}
      >
        <Search className="size-4" />
        <span>Search</span>
        {/* Platform-specific glyph. Resolved during render rather than in an
            effect, so the server's guess is simply overwritten on hydration. */}
        <kbd
          className="text-muted-foreground/70 ml-auto font-mono text-[0.6875rem]"
          suppressHydrationWarning
        >
          {isAppleDevice() ? "⌘K" : "Ctrl K"}
        </kbd>
      </button>

      <div className="flex-1" />

      {children}

      <ThemeToggle />

      <UserMenu />
    </header>
  );
}

function isAppleDevice() {
  if (typeof navigator === "undefined") return false;
  return /mac|iphone|ipad|ipod/i.test(navigator.userAgent);
}
