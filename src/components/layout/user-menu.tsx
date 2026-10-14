"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCallback } from "react";
import {
  Eye,
  EyeOff,
  LayoutDashboard,
  LogOut,
  Settings,
  ShieldCheck,
  UserCog,
  UserRound,
} from "lucide-react";
import { toast } from "sonner";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { RankBadge } from "@/components/common/status-badge";
import { useLogoutMutation } from "@/features/auth/api/auth-api";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectCurrentUser, selectIsAdmin } from "@/store/slices/auth-slice";
import {
  balancesVisibilityToggled,
  selectBalancesHidden,
} from "@/store/slices/ui-slice";
import { ROUTES } from "@/config/routes";
import { initialsOf } from "@/lib/utils/format";
import { UserRole } from "@/types/enums";

/**
 * Sign out, as a hook.
 *
 * The sidebar button, the avatar menu and the ⌘K palette all need the same
 * "call the mutation, redirect, refresh" sequence — one copy, because a second
 * copy is a second chance to forget the redirect.
 */
export function useSignOut() {
  const router = useRouter();
  const [logout, { isLoading }] = useLogoutMutation();

  const signOut = useCallback(async () => {
    try {
      await logout().unwrap();
      toast.success("Signed out");
    } catch {
      // The mutation clears local state in its `finally` regardless, so the
      // user is signed out here either way — no need to alarm them.
      toast.success("Signed out");
    } finally {
      router.replace(ROUTES.login);
      router.refresh();
    }
  }, [logout, router]);

  return { signOut, isSigningOut: isLoading };
}

/**
 * The rail's only account control.
 *
 * Sign out is the one account action you need without navigating anywhere, so
 * it stays pinned to the sidebar. Everything else — profile, settings, privacy,
 * the admin switch — moved to the avatar menu in the topbar, where there is
 * room to read it.
 */
export function SignOutButton({
  collapsed = false,
  className,
}: {
  collapsed?: boolean;
  className?: string;
}) {
  const { signOut, isSigningOut } = useSignOut();

  const button = (
    <Button
      variant="ghost"
      size="sm"
      disabled={isSigningOut}
      onClick={() => void signOut()}
      aria-label="Sign out"
      className={cn(
        "text-muted-foreground hover:text-foreground w-full justify-start gap-3",
        collapsed && "justify-center px-0",
        className,
      )}
    >
      <LogOut className="size-4.5 shrink-0" />
      {!collapsed && (
        <span className="text-sm">{isSigningOut ? "Signing out…" : "Sign out"}</span>
      )}
    </Button>
  );

  if (!collapsed) return button;

  return (
    <Tooltip>
      <TooltipTrigger asChild>{button}</TooltipTrigger>
      <TooltipContent side="right" sideOffset={8}>
        Sign out
      </TooltipContent>
    </Tooltip>
  );
}

/**
 * One row of the account menu: a tinted icon chip and the action.
 *
 * Single column on purpose. A label with a right-aligned hint needs a panel
 * wide enough to hold both, and at that width the menu stops reading as a list
 * of five things and starts reading as a form.
 */
function MenuRow({
  icon: Icon,
  label,
  href,
  destructive = false,
  className,
  ...props
}: {
  icon: LucideIcon;
  label: string;
  href?: string;
  destructive?: boolean;
} & Omit<React.ComponentProps<typeof DropdownMenuItem>, "asChild">) {
  const content = (
    <>
      <span
        className={cn(
          "grid size-6 shrink-0 place-items-center rounded-md",
          destructive ? "bg-destructive/10" : "bg-muted",
        )}
        aria-hidden="true"
      >
        <Icon className="size-3.5" />
      </span>
      <span className="truncate text-sm">{label}</span>
    </>
  );

  return (
    <DropdownMenuItem
      asChild={Boolean(href)}
      variant={destructive ? "destructive" : "default"}
      className={cn(
        "h-auto gap-2.5 rounded-md px-2 py-1.5",
        "[&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    >
      {href ? <Link href={href}>{content}</Link> : content}
    </DropdownMenuItem>
  );
}

/**
 * Account menu — the topbar's user icon.
 *
 * The trigger is an icon, not a name: the topbar is shared chrome, so identity
 * belongs behind a click rather than spending 200px of every page on it.
 *
 * Opening it yields a slim identity line — who you are, at a glance — then a
 * list of rows that each explain themselves.
 */
export function UserMenu({ className }: { className?: string }) {
  const user = useAppSelector(selectCurrentUser);
  const isAdmin = useAppSelector(selectIsAdmin);
  const balancesHidden = useAppSelector(selectBalancesHidden);
  const dispatch = useAppDispatch();
  const { signOut, isSigningOut } = useSignOut();

  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Account menu"
          className={cn(
            "bg-accent/50 text-accent-foreground hover:bg-accent size-9 rounded-lg",
            "focus-visible:ring-ring/50 focus-visible:ring-2",
            "data-[state=open]:bg-accent data-[state=open]:text-accent-foreground",
            className,
          )}
        >
          <UserRound className="size-5" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" sideOffset={8} className="w-48 p-1.5">
        <div className="flex items-center gap-2.5 px-2 py-2">
          <Avatar className="size-8 shrink-0">
            <AvatarFallback className="from-(--logo-gold-400) to-(--logo-gold-700) bg-gradient-to-br text-[0.6875rem] font-semibold text-(--logo-navy-900)">
              {initialsOf(user.name, user.email)}
            </AvatarFallback>
          </Avatar>

          <div className="flex min-w-0 flex-1 flex-col leading-tight">
            <div className="flex items-center gap-1.5">
              <span className="text-foreground truncate text-sm font-medium">
                {user.name ?? user.email.split("@")[0]}
              </span>
              {user.role === UserRole.ADMIN && (
                <ShieldCheck
                  className="text-primary size-3.5 shrink-0"
                  aria-label="Admin"
                />
              )}
            </div>
            <span className="text-muted-foreground truncate text-xs">
              {user.email}
            </span>
          </div>

          <RankBadge rank={user.rank} />
        </div>

        <DropdownMenuSeparator className="bg-border/60" />

        <MenuRow href={ROUTES.profile} icon={UserCog} label="Profile" />

        <MenuRow href={ROUTES.settings} icon={Settings} label="Settings" />

        <MenuRow
          icon={balancesHidden ? Eye : EyeOff}
          label={balancesHidden ? "Show balances" : "Hide balances"}
          onSelect={(event) => {
            // Keep the menu open: toggling privacy is something users often do
            // alongside another action, and closing feels abrupt.
            event.preventDefault();
            dispatch(balancesVisibilityToggled());
          }}
        />

        {isAdmin && (
          <>
            <DropdownMenuSeparator className="bg-border/60" />
            <MenuRow
              href={ROUTES.admin.dashboard}
              icon={LayoutDashboard}
              label="Admin panel"
            />
          </>
        )}

        <DropdownMenuSeparator className="bg-border/60" />

        <MenuRow
          destructive
          disabled={isSigningOut}
          icon={LogOut}
          label={isSigningOut ? "Signing out…" : "Sign out"}
          onSelect={(event) => {
            event.preventDefault();
            void signOut();
          }}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}