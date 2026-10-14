"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";
import { ChevronRight, Menu } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./theme-toggle";
import { UserMenu } from "./user-menu";
import { useAppDispatch } from "@/store/hooks";
import { mobileNavToggled } from "@/store/slices/ui-slice";
import {
  isNavItemActive,
  type NavItem,
  type NavSection,
} from "@/config/navigation";

/**
 * Application top bar.
 *
 * Sticky with a translucent backdrop so table headers scroll under it rather
 * than colliding — a small thing that makes long ledger pages feel composed.
 *
 * On the left sits a live "you are here" indicator, resolved from the same
 * `NavSection[]` the sidebar and palette render. The page header repeats the
 * breadcrumb, but it scrolls away; once a ledger table is halfway down the
 * screen this is the only thing still telling you which page you are on.
 *
 * The right side holds the persistent account controls — theme, then the avatar
 * that carries every account detail behind a click. The sidebar rail keeps only
 * sign out, so this is the one place identity lives.
 */

export interface TopbarProps {
  /** Right-hand slot for page-specific controls. */
  children?: React.ReactNode;
  /** Navigation model — same array the sidebar renders. */
  sections?: NavSection[];
  className?: string;
}

export function Topbar({
  children,
  sections = [],
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

      <TopbarBreadcrumb sections={sections} />

      <div className="flex-1" />

      {children}

      <ThemeToggle />

      <UserMenu />
    </header>
  );
}

/**
 * Current-page indicator.
 *
 * Walks the nav tree and keeps the longest matching `href`, so a nested route
 * like `/wallet/deposit` resolves to "Deposit" rather than its parent "Wallet",
 * and a dynamic admin route like `/admin/users/:id` still resolves to "Users".
 * Renders nothing on an unknown path, leaving the topbar's spacer to absorb it.
 */
function TopbarBreadcrumb({ sections }: { sections: NavSection[] }) {
  const pathname = usePathname();

  const current = useMemo(() => {
    let match: { section: NavSection; item: NavItem } | null = null;

    for (const section of sections) {
      for (const item of section.items) {
        if (!isNavItemActive(item, pathname)) continue;
        if (!match || item.href.length > match.item.href.length) {
          match = { section, item };
        }
      }
    }

    return match;
  }, [sections, pathname]);

  if (!current) return null;

  const { section, item } = current;
  const Icon = item.icon;

  return (
    <nav
      aria-label="Current page"
      className="hidden min-w-0 items-center gap-2 sm:flex"
    >
      <span className="bg-accent/60 text-accent-foreground grid size-7 shrink-0 place-items-center rounded-md">
        <Icon className="size-4" aria-hidden="true" />
      </span>
      {section.label ? (
        <>
          <span className="text-muted-foreground truncate text-sm">
            {section.label}
          </span>
          <ChevronRight
            className="text-muted-foreground/50 size-3.5 shrink-0"
            aria-hidden="true"
          />
        </>
      ) : null}
      <span className="text-foreground truncate text-sm font-medium">
        {item.label}
      </span>
    </nav>
  );
}
