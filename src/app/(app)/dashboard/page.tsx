"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import {
  ArrowDownToLine,
  ArrowRight,
  ArrowUpFromLine,
  BadgeCheck,
  Clock3,
  Network,
  TriangleAlert,
  Wallet,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { CopyButton, CopyableHex } from "@/components/common/copy-button";
import { EmptyState } from "@/components/common/empty-state";
import { ErrorState } from "@/components/common/error-state";
import { Money } from "@/components/common/money";
import { PageHeader, SectionHeader } from "@/components/common/page-header";
import { ShareReferralButton } from "@/components/common/share-referral-button";
import { RankBadge, StatusBadge } from "@/components/common/status-badge";
import { TradePlanProgress } from "@/components/common/trade-plan-progress";
import {
  DashboardSlider,
  NewsTicker,
} from "@/components/common/dashboard-slider";
import { SessionCodeCard } from "@/features/trading/components/session-code-card";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useDepositWalletAddressQuery } from "@/features/deposits/api/deposits-api";
import { useUserDashboardQuery } from "@/features/users/api/users-api";
import { useWalletSummaryQuery } from "@/features/wallet/api/wallet-api";
import {
  useTradeStatisticsQuery,
  useTradesQuery,
} from "@/features/portal/api/portal-api";

import { normalizeError } from "@/lib/api/errors";
import { formatDate, formatDateTime } from "@/lib/utils/format";
import { ROUTES } from "@/config/routes";
import {
  USER_WALLET_TYPES,
  WalletType,
} from "@/types/enums";

import { useAppSelector } from "@/store/hooks";
import { selectCurrentUser } from "@/store/slices/auth-slice";

/**
 * Dashboard.
 *
 * Built as an operations console, not a stack of promotional cards:
 *
 *   1. Header      — title, verification state, the two money-moving actions.
 *   2. Balance     — one authoritative figure, then the per-wallet split that
 *                    explains it, each with lifetime credit/debit underneath.
 *   3. Performance — net P&L, volume and trade counts, with trade-plan progress
 *                    attached because that plan is the only reason those numbers
 *                    matter (it gates the Principal withdrawal penalty).
 *   4. Recent      — the latest sessions with their status, so the screen
 *                    answers "what just happened" without a navigation hop.
 *   5. Rail        — referral link, deposit address, account facts.
 *
 * Structure over spectacle: every tile is a hairline-separated cell of a single
 * grid rather than a floating rounded card, money is tabular, and each figure
 * links to the page that owns it. A grid of identical icon-and-number cards is
 * the shape of a template, not of a product.
 *
 * Deliberately absent: the marketing `LiveTradingChart` the previous build
 * embedded here. It renders a `Math.random()` walk labelled BTC/USDT — mock
 * data inside an authenticated surface is the fastest way to make a real
 * product read as a demo.
 */

const WALLET_LABELS: Record<WalletType, string> = {
  [WalletType.PRINCIPAL]: "Principal",
  [WalletType.TRADING_PROFIT]: "Trading profit",
  [WalletType.REFERRAL]: "Referral",
  [WalletType.DEPOSIT_BONUS]: "Deposit bonus",
  [WalletType.RANK_BONUS]: "Rank bonus",
  [WalletType.POOL_BONUS]: "Pool bonus",
  [WalletType.ADMIN_COMMISSION]: "Admin commission",
};

/**
 * Trade statistics arrive as JS numbers (the backend does `Number(Decimal)`);
 * `Money` wants a decimal string. `toFixed` rather than `String` so a small or
 * very large figure never renders in exponential notation.
 */
const decimal = (value: number | undefined) =>
  value === undefined ? null : value.toFixed(2);

/** `SUSPENDED` → `Suspended`. Enum values are not display copy. */
const humanise = (value: string | null) =>
  value ? value.charAt(0) + value.slice(1).toLowerCase() : "Pending";

export default function DashboardPage() {
  const user = useAppSelector(selectCurrentUser);

  const dashboard = useUserDashboardQuery();
  const wallet = useWalletSummaryQuery();
  const depositWallet = useDepositWalletAddressQuery();
  const stats = useTradeStatisticsQuery();
  const trades = useTradesQuery({ limit: 6 });

  const profile = dashboard.data?.profile;
  const loading = dashboard.isLoading || wallet.isLoading;

  const error = normalizeError(
    dashboard.error ?? wallet.error ?? depositWallet.error,
  );

  const status = profile?.status ?? user?.status ?? null;
  const verified = status === "ACTIVE";

  const referralCode = profile?.referralCode ?? user?.referralCode ?? "";
  const referralLink =
    typeof window !== "undefined" && referralCode
      ? `${window.location.origin}${ROUTES.referralLanding(referralCode)}`
      : "";

  const depositAddress = depositWallet.data?.address ?? null;

  return (
    <div className="space-y-5">
      <PageHeader
        title="Dashboard"
        description="Balances, trading performance, and account status."
        breadcrumbs={[
          { label: "Account", href: ROUTES.profile },
          { label: "Dashboard" },
        ]}
        badge={<VerificationPill verified={verified} status={status} />}
        className="mb-0"
        actions={
          <>
            <Button variant="outline" size="sm" asChild>
              <Link href={ROUTES.withdraw}>
                <ArrowUpFromLine />
                Withdraw
              </Link>
            </Button>
            <Button size="sm" asChild>
              <Link href={ROUTES.deposit}>
                <ArrowDownToLine />
                Deposit
              </Link>
            </Button>
          </>
        }
      />

      {error && <ErrorState error={error} onRetry={dashboard.refetch} />}

      <NewsTicker />

      <SessionCodeCard compact />

      {/* ---- Balance -------------------------------------------------------- */}
      <Card>
        <CardHeader>
          <CardTitle className="text-muted-foreground font-sans text-xs font-medium tracking-widest uppercase">
            Total balance
          </CardTitle>
          <CardAction>
            <Button variant="ghost" size="xs" asChild>
              <Link href={ROUTES.wallet}>
                Wallets
                <ArrowRight />
              </Link>
            </Button>
          </CardAction>
        </CardHeader>

        <CardContent className="space-y-5">
          <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
            <Money
              value={wallet.data?.totalBalance}
              showCurrency
              size="2xl"
              className="text-3xl leading-none sm:text-4xl"
            />
            <p className="text-muted-foreground text-xs">
              {loading
                ? "Syncing balances…"
                : `Across ${USER_WALLET_TYPES.length} wallets`}
            </p>
          </div>

          <div className="grid gap-px overflow-hidden rounded-lg border border-border/60 bg-border/40 sm:grid-cols-2 xl:grid-cols-3">
            {loading
              ? Array.from({ length: 6 }, (_, index) => (
                  <div key={index} className="bg-card space-y-2 p-3.5">
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-5 w-28" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                ))
              : USER_WALLET_TYPES.map((type) => {
                  const entry = wallet.data?.wallets[type];
                  return (
                    <Link
                      key={type}
                      href={ROUTES.wallet}
                      className={cn(
                        "bg-card hover:bg-muted/40 group flex flex-col gap-1 p-3.5",
                        "transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset",
                      )}
                    >
                      <span className="text-muted-foreground group-hover:text-foreground text-xs font-medium transition-colors">
                        {WALLET_LABELS[type]}
                      </span>
                      <Money
                        value={entry?.balance}
                        showCurrency
                        size="lg"
                        className="leading-none"
                      />
                      <span
                        className="flex items-center gap-1.5"
                        title="Lifetime credited / debited"
                      >
                        <Money
                          value={entry?.totalCredit}
                          size="xs"
                          variant="signed"
                          showTrendIcon={false}
                        />
                        <span className="text-muted-foreground/50">·</span>
                        <Money
                          value={entry?.totalDebit}
                          size="xs"
                          variant="signed"
                          showTrendIcon={false}
                        />
                      </span>
                    </Link>
                  );
                })}
          </div>
        </CardContent>
      </Card>

      {/* ---- Performance + recent ------------------------------------------ */}
      <div className="grid gap-5 xl:grid-cols-12">
        <div className="space-y-5 xl:col-span-5">
          <Card>
            <CardHeader>
              <CardTitle>Trading performance</CardTitle>
              <CardDescription>Lifetime, across every session.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-px overflow-hidden rounded-lg border border-border/60 bg-border/40 sm:grid-cols-2">
                <Tile
                  label="Net profit"
                  loading={stats.isLoading}
                  value={
                    <Money
                      value={decimal(stats.data?.totalUserProfit)}
                      showCurrency
                      variant="signed"
                    />
                  }
                />
                <Tile
                  label="Volume"
                  loading={stats.isLoading}
                  value={
                    <Money
                      value={decimal(stats.data?.totalVolume)}
                      showCurrency
                    />
                  }
                />
                <Tile
                  label="Trades"
                  loading={stats.isLoading}
                  value={`${stats.data?.completedTrades ?? 0} / ${stats.data?.totalTrades ?? 0}`}
                  hint={
                    stats.data?.pendingTrades
                      ? `${stats.data.pendingTrades} open`
                      : undefined
                  }
                />
                <Tile
                  label="Commission"
                  loading={stats.isLoading}
                  value={
                    <Money
                      value={decimal(stats.data?.totalAdminCommission)}
                      showCurrency
                    />
                  }
                />
              </div>
            </CardContent>
          </Card>

          <TradePlanProgress variant="inline" />
        </div>

        <Card className="xl:col-span-7">
          <CardHeader>
            <CardTitle>Recent trades</CardTitle>
            <CardAction>
              <Button variant="ghost" size="xs" asChild>
                <Link href={ROUTES.tradingHistory}>
                  View all
                  <ArrowRight />
                </Link>
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent>
            {trades.isLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 5 }, (_, index) => (
                  <Skeleton key={index} className="h-8 w-full" />
                ))}
              </div>
            ) : trades.data?.items.length ? (
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="text-muted-foreground text-[0.6875rem] tracking-widest uppercase">
                      Session
                    </TableHead>
                    <TableHead className="text-muted-foreground text-[0.6875rem] tracking-widest uppercase">
                      Amount
                    </TableHead>
                    <TableHead className="text-muted-foreground text-right text-[0.6875rem] tracking-widest uppercase">
                      P&amp;L
                    </TableHead>
                    <TableHead className="text-muted-foreground text-[0.6875rem] tracking-widest uppercase">
                      Status
                    </TableHead>
                    <TableHead className="text-muted-foreground text-right text-[0.6875rem] tracking-widest uppercase">
                      Exit
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {trades.data.items.map((trade) => (
                    <TableRow key={trade.id}>
                      <TableCell className="text-xs font-medium whitespace-nowrap">
                        {trade.tradeType === "MORNING" ? "Morning" : "Evening"}
                      </TableCell>
                      <TableCell>
                        <Money value={trade.tradeAmount} size="sm" />
                      </TableCell>
                      <TableCell>
                        <span className="flex items-center justify-end gap-2">
                          <Money
                            value={trade.profit}
                            size="sm"
                            variant="signed"
                          />
                          {trade.profitPercentage !== null && (
                            <span
                              className={cn(
                                "w-12 text-right text-xs",
                                trade.profitPercentage >= 0
                                  ? "text-profit"
                                  : "text-loss",
                              )}
                            >
                              {trade.profitPercentage >= 0 ? "+" : ""}
                              {trade.profitPercentage.toFixed(2)}%
                            </span>
                          )}
                        </span>
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={trade.status} />
                      </TableCell>
                      <TableCell className="text-muted-foreground text-right text-xs whitespace-nowrap">
                        {trade.exitTime ? formatDateTime(trade.exitTime) : "—"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <EmptyState
                title="No trades yet"
                description="Sessions run twice a day. Your results appear here as soon as one settles."
                action={{ label: "Open trading", href: ROUTES.trading }}
                className="px-0 py-10"
              />
            )}
          </CardContent>
        </Card>
      </div>

      {/* ---- Rail ----------------------------------------------------------- */}
      <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Network className="text-primary size-4" />
              Referral
            </CardTitle>
            <CardDescription>
              Anyone who signs up with your code joins your team.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <CopyField
              label="Referral link"
              value={referralLink}
              fallback={dashboard.isLoading ? "Building link…" : "Unavailable"}
            />
            <div className="flex items-center justify-between gap-3">
              <p className="text-muted-foreground text-xs">
                Code{" "}
                <span className="text-foreground font-mono">
                  {referralCode || "—"}
                </span>
              </p>
              <ShareReferralButton referralLink={referralLink} />
            </div>
            <div className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-border/60 bg-border/40">
              <Tile
                label="Direct"
                value={(dashboard.data?.directReferrals ?? 0).toLocaleString()}
                skeletonWidth="w-10"
                loading={dashboard.isLoading}
              />
              <Tile
                label="Team size"
                value={(dashboard.data?.teamSize ?? 0).toLocaleString()}
                skeletonWidth="w-10"
                loading={dashboard.isLoading}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="text-primary size-4" />
              Deposit address
            </CardTitle>
            <CardDescription>
              Send USDT here, then submit the transaction for verification.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <CopyField
              label="USDT deposit address"
              value={depositAddress}
              fallback={
                depositWallet.isLoading
                  ? "Loading address…"
                  : "Not configured yet"
              }
            />
            <Button size="sm" className="w-full" asChild>
              <Link href={ROUTES.deposit}>
                <ArrowDownToLine />
                Open deposit form
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 xl:col-span-1">
          <CardHeader>
            <CardTitle>Account</CardTitle>
            <CardDescription>Profile and eligibility facts.</CardDescription>
          </CardHeader>
          <CardContent>
            <dl className="divide-border/60 divide-y">
              <Fact label="Rank">
                <RankBadge rank={profile?.rank} />
              </Fact>
              <Fact label="Referral code">
                <span className="font-mono text-xs">
                  {referralCode || "—"}
                </span>
              </Fact>
              <Fact label="Payout address">
                <CopyableHex
                  value={profile?.walletAddress}
                  display={
                    profile?.walletAddress
                      ? `${profile.walletAddress.slice(0, 8)}…${profile.walletAddress.slice(-6)}`
                      : undefined
                  }
                />
              </Fact>
              <Fact label="Auto-trade">
                <span
                  className={cn(
                    "text-xs font-medium",
                    profile?.autoTradeStatus ? "text-profit" : "text-muted-foreground",
                  )}
                >
                  {profile?.autoTradeStatus ? "Enabled" : "Off"}
                </span>
              </Fact>
              <Fact label="Member since">
                <span className="text-xs">
                  {formatDate(profile?.createdAt)}
                </span>
              </Fact>
              <Fact label="Last login">
                <span className="text-xs">
                  {formatDateTime(profile?.lastLogin)}
                </span>
              </Fact>
            </dl>

            {/* Guarded on `profile` so the warning cannot flash before the
                dashboard payload has actually resolved. */}
            {profile && !profile.withdrawPasswordSet && (
              <Notice tone="pending" icon={TriangleAlert}>
                Set a withdrawal password before requesting a payout.
              </Notice>
            )}
            {profile?.withdrawLockedUntil && (
              <Notice tone="muted" icon={Clock3}>
                Withdrawals unlock{" "}
                {formatDateTime(profile.withdrawLockedUntil)}.
              </Notice>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ---- Announcements -------------------------------------------------- */}
      <section>
        <SectionHeader title="Announcements" />
        <DashboardSlider />
      </section>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Local primitives                                                            */
/* -------------------------------------------------------------------------- */

function VerificationPill({
  verified,
  status,
}: {
  verified: boolean;
  status: string | null;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs font-medium whitespace-nowrap",
        verified
          ? "border-profit/25 bg-profit/10 text-profit"
          : "border-pending/25 bg-pending/10 text-pending",
      )}
    >
      {verified ? (
        <BadgeCheck className="size-3.5" />
      ) : (
        <Clock3 className="size-3.5" />
      )}
      {verified ? "Verified" : humanise(status)}
    </span>
  );
}

/** One cell of a hairline grid — the dashboard's basic unit. */
function Tile({
  label,
  value,
  hint,
  loading,
  skeletonWidth = "w-24",
}: {
  label: string;
  value: ReactNode;
  hint?: ReactNode;
  loading?: boolean;
  skeletonWidth?: string;
}) {
  return (
    <div className="bg-card flex flex-col gap-1 p-3.5">
      <span className="text-muted-foreground text-xs font-medium">{label}</span>
      {loading ? (
        <Skeleton className={cn("h-5", skeletonWidth)} />
      ) : (
        <span className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
          <span className="text-lg leading-none font-semibold tabular">
            {value}
          </span>
          {hint && (
            <span className="text-muted-foreground text-xs">{hint}</span>
          )}
        </span>
      )}
    </div>
  );
}

function Fact({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 py-2.5">
      <dt className="text-muted-foreground text-sm">{label}</dt>
      <dd className="flex min-w-0 items-center justify-end gap-1.5 text-right">
        {children}
      </dd>
    </div>
  );
}

function Notice({
  tone,
  icon: Icon,
  children,
}: {
  tone: "pending" | "muted";
  icon: LucideIcon;
  children: ReactNode;
}) {
  return (
    <p
      className={cn(
        "mt-4 flex items-start gap-2 rounded-lg border px-3 py-2 text-xs",
        tone === "pending"
          ? "border-pending/25 bg-pending/10 text-pending"
          : "border-border/60 bg-muted/40 text-muted-foreground",
      )}
    >
      <Icon className="mt-px size-3.5 shrink-0" />
      <span>{children}</span>
    </p>
  );
}

/**
 * Read-only value with an inline copy affordance.
 *
 * Deliberately not an `<Input>`: this is a display surface, and a focusable
 * field that cannot be edited misleads both keyboard and screen-reader users.
 * The full value stays in the `title` so it can still be verified on hover.
 */
function CopyField({
  label,
  value,
  fallback,
}: {
  label: string;
  value: string | null;
  fallback: string;
}) {
  if (!value) {
    return (
      <div className="space-y-1.5">
        <p className="text-muted-foreground text-xs">{label}</p>
        <p className="text-muted-foreground/70 rounded-lg border border-dashed border-border/70 px-3 py-2 font-mono text-xs">
          {fallback}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-1.5">
      <p className="text-muted-foreground text-xs">{label}</p>
      <div className="bg-muted/40 flex items-center gap-1 rounded-lg border border-border/60 py-1 pr-1 pl-3">
        <span className="min-w-0 flex-1 truncate font-mono text-xs" title={value}>
          {value}
        </span>
        <CopyButton value={value} label={`Copy ${label.toLowerCase()}`} />
      </div>
    </div>
  );
}
