"use client";

import { useEffect, useMemo, useState } from "react";

import { cn } from "@/lib/utils";
import { Money } from "@/components/common/money";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAppSelector } from "@/store/hooks";
import { selectBalancesHidden } from "@/store/slices/ui-slice";
import { USER_WALLET_TYPES, WalletType } from "@/types/enums";
import type { WalletSummary } from "@/types/models";

/**
 * Where the money sits.
 *
 * One proportional bar plus its legend, rather than a grid of identical tiles:
 * the shape of the balance — how much is locked in Principal versus spendable
 * trading profit — is the question this answers, and a stacked bar answers it
 * at a glance. The legend carries the exact figures.
 *
 * Production concerns handled here:
 *   - percentages are rounded with the largest-remainder method, so they always
 *     sum to exactly 100.0% instead of a drifting 99.9% / 100.1%
 *   - privacy mode masks both the amounts *and* the distribution, because the
 *     bar's shape is itself a leak of the underlying balances
 *   - bar and legend share one hover/focus state, so either can drive the other
 *   - bar segment width animates in on mount, and respects reduced-motion
 *   - the empty/zero state is explicit rather than six rows of $0.00
 */

const WALLET_LABELS: Record<WalletType, string> = {
  [WalletType.PRINCIPAL]: "Principal",
  [WalletType.TRADING_PROFIT]: "Trading profit",
  [WalletType.REFERRAL]: "Sponsor",
  [WalletType.DEPOSIT_BONUS]: "Deposit bonus",
  [WalletType.RANK_BONUS]: "Rank bonus",
  [WalletType.POOL_BONUS]: "Pool bonus",
  [WalletType.ADMIN_COMMISSION]: "Admin commission",
};

const WALLET_COLORS: Record<WalletType, string> = {
  [WalletType.PRINCIPAL]: "bg-chart-1",
  [WalletType.TRADING_PROFIT]: "bg-chart-2",
  [WalletType.REFERRAL]: "bg-chart-3",
  [WalletType.DEPOSIT_BONUS]: "bg-chart-4",
  [WalletType.RANK_BONUS]: "bg-chart-5",
  [WalletType.POOL_BONUS]: "bg-[oklch(0.7_0.14_200)]",
  [WalletType.ADMIN_COMMISSION]: "bg-[oklch(0.66_0.16_25)]",
};

/**
 * Percentages that sum to exactly 100 (to one decimal) via the largest-
 * remainder method. Values are tenths of a percent so the arithmetic is exact.
 */
function distributePercentages(amounts: number[], total: number): number[] {
  const SCALE = 10; // one decimal place
  const TARGET = 100 * SCALE;

  if (total <= 0) return amounts.map(() => 0);

  const exact = amounts.map((amount) => (amount / total) * TARGET);
  const floors = exact.map(Math.floor);
  let remaining = TARGET - floors.reduce((sum, value) => sum + value, 0);

  const byRemainder = exact
    .map((value, index) => ({ index, fraction: value - Math.floor(value) }))
    .sort((a, b) => b.fraction - a.fraction);

  const result = [...floors];
  for (const { index } of byRemainder) {
    if (remaining <= 0) break;
    result[index] += 1;
    remaining -= 1;
  }

  return result.map((tenths) => tenths / SCALE);
}

function useEntered(): boolean {
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  return entered;
}

export interface WalletDistributionProps {
  summary?: WalletSummary;
  loading?: boolean;
  className?: string;
}

export function WalletDistribution({
  summary,
  loading = false,
  className,
}: WalletDistributionProps) {
  const balancesHidden = useAppSelector(selectBalancesHidden);
  const entered = useEntered();
  const [active, setActive] = useState<WalletType | null>(null);

  const segments = useMemo(() => {
    const rows = USER_WALLET_TYPES.map((type) => {
      const balance = summary?.wallets[type]?.balance;
      return { type, balance, amount: Number(balance ?? 0) };
    });
    const total = rows.reduce((sum, row) => sum + row.amount, 0);
    const percentages = distributePercentages(
      rows.map((row) => row.amount),
      total,
    );
    return rows.map((row, index) => ({
      ...row,
      percentage: percentages[index],
    }));
  }, [summary]);

  const total = segments.reduce((sum, segment) => sum + segment.amount, 0);
  const hasBalance = total > 0;
  const funded = segments.filter((segment) => segment.amount > 0);

  if (loading) {
    return (
      <div className={cn("space-y-4", className)}>
        <Skeleton className="h-2.5 w-full rounded-full" />
        <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }, (_, index) => (
            <div
              key={index}
              className="flex items-center justify-between gap-3 rounded-lg border border-border/60 px-3 py-2"
            >
              <Skeleton className="h-3.5 w-24" />
              <Skeleton className="h-3.5 w-14" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!hasBalance) {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-border/60 px-6 py-8 text-center",
          className,
        )}
      >
        <p className="text-sm font-medium">No balance yet</p>
        <p className="text-muted-foreground max-w-sm text-xs">
          Deposits, trading profit and bonuses will show up here, split across
          your wallets.
        </p>
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Bar */}
      <div
        className="flex h-2.5 w-full items-stretch gap-0.5 overflow-hidden rounded-full bg-muted"
        role="img"
        aria-label="Distribution of your balance across wallets"
      >
        {balancesHidden ? (
          <div className="h-full flex-1 rounded-full bg-muted-foreground/25" />
        ) : (
          funded.map((segment) => {
            const dimmed = active !== null && active !== segment.type;
            return (
              <Tooltip key={segment.type}>
                <TooltipTrigger asChild>
                  <div
                    className={cn(
                      "h-full min-w-[3px] rounded-full transition-[width,opacity] duration-500 ease-out",
                      WALLET_COLORS[segment.type],
                      dimmed ? "opacity-30" : "opacity-100",
                    )}
                    style={{ width: entered ? `${segment.percentage}%` : "0%" }}
                    onMouseEnter={() => setActive(segment.type)}
                    onMouseLeave={() => setActive(null)}
                    tabIndex={0}
                    onFocus={() => setActive(segment.type)}
                    onBlur={() => setActive(null)}
                  />
                </TooltipTrigger>
                <TooltipContent side="top" sideOffset={8}>
                  <span
                    className={cn(
                      "inline-block size-2 rounded-full",
                      WALLET_COLORS[segment.type],
                    )}
                  />
                  {WALLET_LABELS[segment.type]}
                  <span className="font-medium">
                    {segment.percentage.toFixed(1)}%
                  </span>
                </TooltipContent>
              </Tooltip>
            );
          })
        )}
      </div>

      {/* Legend */}
      <ul className="grid gap-1.5 sm:grid-cols-2 xl:grid-cols-3">
        {segments.map((segment) => {
          const dimmed = active !== null && active !== segment.type;
          const interactive = segment.amount > 0;
          return (
            <li key={segment.type}>
              <div
                className={cn(
                  "flex items-center justify-between gap-3 rounded-lg border border-border/60 px-3 py-2 transition-colors",
                  interactive && "cursor-default hover:bg-muted/50",
                  dimmed && "opacity-60",
                )}
                onMouseEnter={() => interactive && setActive(segment.type)}
                onMouseLeave={() => setActive(null)}
              >
                <span className="flex min-w-0 items-center gap-2">
                  <span
                    aria-hidden="true"
                    className={cn(
                      "size-2 shrink-0 rounded-full",
                      segment.amount > 0
                        ? WALLET_COLORS[segment.type]
                        : "bg-muted-foreground/30",
                    )}
                  />
                  <span className="text-muted-foreground truncate text-xs font-medium">
                    {WALLET_LABELS[segment.type]}
                  </span>
                </span>
                <span className="flex shrink-0 items-baseline gap-2">
                  <Money value={segment.balance} size="sm" showCurrency />
                  <span className="w-11 text-right text-[11px] tabular-nums text-muted-foreground">
                    {balancesHidden
                      ? "•••"
                      : `${segment.percentage.toFixed(1)}%`}
                  </span>
                </span>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
