"use client";

import { ShieldCheck, Target } from "lucide-react";

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

export function TradePlanProgress() {
  const stats = useTradeStatisticsQuery();
  const plan = stats.data?.tradePlan;

  const completed = stats.data?.completedTrades ?? 0;
  const total = plan?.totalTrades ?? 0;
  const penaltyFreeAt = plan?.penaltyFreeAt ?? 0;
  const percent = Math.round(plan?.completionPercent ?? 0);
  const penaltyFree = plan?.penaltyFree ?? false;
  const remaining = Math.max(0, penaltyFreeAt - completed);

  return (
    <Card>
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
              className={`flex items-center gap-1.5 text-sm ${
                penaltyFree ? "text-profit" : "text-muted-foreground"
              }`}
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
