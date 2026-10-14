"use client";

import { ShieldCheck, Target } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useTradeStatisticsQuery } from "@/features/portal/api/portal-api";

/**
 * Progress through the fixed trade plan.
 *
 * `variant="card"` is the standalone block used on the trading page.
 * `variant="inline"` drops the chrome for the dashboard rail, where it reads as
 * one more cell in a stack rather than a competing panel.
 */
export function TradePlanProgress({
  variant = "card",
  className,
}: {
  variant?: "card" | "inline";
  className?: string;
}) {
  const stats = useTradeStatisticsQuery();
  const plan = stats.data?.tradePlan;

  const completed = stats.data?.completedTrades ?? 0;
  const total = plan?.totalTrades ?? 0;
  const penaltyFreeAt = plan?.penaltyFreeAt ?? 0;
  const percent = Math.round(plan?.completionPercent ?? 0);
  const penaltyFree = plan?.penaltyFree ?? false;
  const remaining = Math.max(0, penaltyFreeAt - completed);

  const progress = (
    <>
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-muted-foreground text-sm">Trade plan</span>
        <span className="text-xs font-semibold tabular">
          {percent}% · {completed}/{total} trades
        </span>
      </div>
      <Progress value={percent} />
      <p
        className={cn(
          "flex items-start gap-1.5 text-xs",
          penaltyFree ? "text-profit" : "text-muted-foreground",
        )}
      >
        <ShieldCheck className="mt-px size-3.5 shrink-0" />
        {penaltyFree
          ? "Penalty-free Principal withdrawals unlocked."
          : `${remaining} trades left to waive the 40% early-exit penalty on Principal withdrawals.`}
      </p>
    </>
  );

  if (variant === "inline") {
    return (
      <div className={cn("space-y-2.5", className)}>
        {stats.isLoading ? (
          <>
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-1 w-full" />
            <Skeleton className="h-3 w-56" />
          </>
        ) : (
          progress
        )}
      </div>
    );
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Target className="size-5" />
          Trade plan progress
        </CardTitle>
        <CardDescription>
          Complete {penaltyFreeAt} of {total} trades to unlock penalty-free
          Principal withdrawals.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {stats.isLoading ? (
          <Skeleton className="h-16 w-full" />
        ) : (
          <>
            <div className="flex items-end justify-between gap-2">
              <span className="text-2xl font-semibold">{percent}%</span>
              <span className="text-muted-foreground text-sm">
                {completed}/{total} trades completed
              </span>
            </div>
            <Progress value={percent} />
            <p
              className={cn(
                "flex items-center gap-1.5 text-sm",
                penaltyFree ? "text-profit" : "text-muted-foreground",
              )}
            >
              <ShieldCheck className="size-4 shrink-0" />
              {penaltyFree
                ? "Penalty-free Principal withdrawals unlocked."
                : `${remaining} trades left to waive the 40% early-exit penalty on Principal withdrawals.`}
            </p>
          </>
        )}
      </CardContent>
    </Card>
  );
}
