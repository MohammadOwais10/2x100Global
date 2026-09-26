"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { ChartCandlestick, Check, Clock, Loader2 } from "lucide-react";
import { toast } from "sonner";

import {
  useActiveSessionQuery,
  useSubmitTradeCodeMutation,
} from "@/features/portal/api/portal-api";
import { CopyButton } from "@/components/common/copy-button";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { normalizeError } from "@/lib/api/errors";
import { ROUTES } from "@/config/routes";

/**
 * Session code card — the manual trade entry point.
 *
 * Polls the live session every 15s. When a window is open the shared code is
 * shown with a live countdown; the user copies it (or types it) into the form
 * and submits before the 15-minute window closes. One trade per session per
 * user, enforced server-side.
 *
 * `compact` mode is for the dashboard — the shared code is revealed there for
 * copying, and the submit form is replaced with a link to the trading page.
 * On the trading page itself (`compact=false`) the code stays hidden: the
 * card only shows that a session is live and accepts the pasted code.
 */
export function SessionCodeCard({ compact = false }: { compact?: boolean }) {
  const { data, isLoading, refetch } = useActiveSessionQuery(undefined, {
    pollingInterval: 15000,
  });
  const [submit, mutation] = useSubmitTradeCodeMutation();
  const [code, setCode] = useState("");
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const session = data?.session ?? null;
  const hasTraded = data?.hasTraded ?? false;
  const msLeft = session
    ? Math.max(0, new Date(session.expiresAt).getTime() - now)
    : 0;
  const expired = session !== null && msLeft <= 0;
  const mm = Math.floor(msLeft / 60000);
  const ss = Math.floor((msLeft % 60000) / 1000);

  const nextAt = data?.nextSessionAt ? new Date(data.nextSessionAt) : null;
  const nextMs = nextAt ? Math.max(0, nextAt.getTime() - now) : 0;
  const nextH = Math.floor(nextMs / 3600000);
  const nextM = Math.floor((nextMs % 3600000) / 60000);
  const nextS = Math.floor((nextMs % 60000) / 1000);
  const nextTimeLabel = nextAt
    ? nextAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : null;

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    try {
      const result = await submit({ code }).unwrap();
      toast.success("Trade executed", {
        description: `Profit credited: ${result.profit} USDT`,
      });
      setCode("");
      refetch();
    } catch (err) {
      toast.error(
        normalizeError(err as Parameters<typeof normalizeError>[0])?.message,
      );
    }
  }

  if (!isLoading && compact && !session) return null;

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ChartCandlestick className="size-5" /> Session code
        </CardTitle>
        <CardDescription>
          {compact
            ? "Copy this code and submit it on the Trading page within 15 minutes."
            : "Get the session code from your Dashboard and submit it here within 15 minutes."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="bg-surface-2 h-32 animate-pulse rounded-xl" />
        ) : !session ? (
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <Clock className="text-muted-foreground size-8" />
            <p className="font-medium">No live session right now</p>
            {nextAt ? (
              <>
                <p className="text-muted-foreground text-sm">
                  Next{" "}
                  {data?.nextSessionType === "MORNING" ? "morning" : "evening"}{" "}
                  session opens at{" "}
                  <span className="text-foreground font-semibold">
                    {nextTimeLabel}
                  </span>
                </p>
                <p className="border-brand-500/40 bg-brand-500/10 text-brand-400 rounded-lg border px-4 py-2 font-mono text-xl font-semibold tabular">
                  {nextH > 0 ? `${nextH}h ` : ""}
                  {String(nextM).padStart(2, "0")}m{" "}
                  {String(nextS).padStart(2, "0")}s
                </p>
                <p className="text-profit text-sm font-medium">
                  Get ready — submit the code within 15 minutes when the window
                  opens.
                </p>
              </>
            ) : (
              <p className="text-muted-foreground text-sm">
                Trading windows open twice a day — morning and evening. The
                code will appear here when a session starts.
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-5">
            <div className="flex flex-col items-center gap-3 rounded-xl border p-5 sm:flex-row sm:justify-between">
              {compact ? (
                <div className="flex items-center gap-3">
                  <span className="font-mono text-3xl font-bold tracking-[0.3em]">
                    {session.code}
                  </span>
                  <CopyButton value={session.code} />
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <span className="bg-profit/10 text-profit inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-semibold">
                    <span className="relative flex size-2">
                      <span className="bg-profit absolute inline-flex h-full w-full animate-ping rounded-full opacity-75" />
                      <span className="bg-profit relative inline-flex size-2 rounded-full" />
                    </span>
                    Session is LIVE
                  </span>
                  <span className="text-muted-foreground text-sm">
                    Copy the code from your Dashboard
                  </span>
                </div>
              )}
              <div className="text-right">
                <p className="text-muted-foreground text-xs uppercase">
                  {session.sessionType === "MORNING" ? "Morning" : "Evening"}{" "}
                  session
                </p>
                <p
                  className={`font-mono text-xl font-semibold tabular ${expired ? "text-loss" : "text-profit"}`}
                >
                  {expired ? "Expired" : `${mm}:${String(ss).padStart(2, "0")}`}
                </p>
              </div>
            </div>

            {hasTraded ? (
              <div className="flex items-center justify-center gap-2 rounded-lg border border-profit-muted bg-profit-muted px-4 py-3 text-sm font-medium text-profit">
                <Check className="size-4" />
                You already traded this session.
              </div>
            ) : compact ? (
              <Button asChild className="w-full sm:w-auto">
                <Link href={ROUTES.trading}>Submit code on Trading →</Link>
              </Button>
            ) : (
              <form onSubmit={onSubmit} className="flex flex-col gap-3 sm:flex-row">
                <Input
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="Paste session code"
                  className="font-mono uppercase"
                  maxLength={16}
                  autoComplete="off"
                  disabled={expired || mutation.isLoading}
                />
                <Button
                  type="submit"
                  disabled={expired || code.trim().length < 4 || mutation.isLoading}
                  className="sm:w-40"
                >
                  {mutation.isLoading ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    "Submit & trade"
                  )}
                </Button>
              </form>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
