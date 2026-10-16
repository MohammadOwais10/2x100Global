"use client";

import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  BadgeCheck,
  CalendarDays,
  Check,
  Clock3,
  Copy,
  IdCard,
  KeyRound,
  Link2,
  LogIn,
  Mail,
  Save,
  ShieldCheck,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { CopyButton } from "@/components/common/copy-button";
import { ErrorState } from "@/components/common/error-state";
import { PageHeader } from "@/components/common/page-header";
import { ShareSponsorButton } from "@/components/common/share-sponsor-button";
import { RankBadge, StatusBadge } from "@/components/common/status-badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useProfileQuery } from "@/features/auth/api/auth-api";
import { useFormSubmit } from "@/features/auth/hooks/use-form-submit";
import {
  useRequestWithdrawPasswordOtpMutation,
  useSetWithdrawPasswordMutation,
  useUpdateProfileMutation,
} from "@/features/users/api/users-api";
import { normalizeError } from "@/lib/api/errors";
import { formatDate, formatDateTime, humanizeEnum, initialsOf } from "@/lib/utils/format";
import { ROUTES } from "@/config/routes";
import { UserRole } from "@/types/enums";

const profileSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters.").max(100),
  phone: z.union([z.literal(""), z.string().trim().regex(/^\d{10}$/, "Phone number must be exactly 10 digits.")]),
  country: z.union([z.literal(""), z.string().trim().min(2).max(100)]),
  walletAddress: z.union([
    z.literal(""),
    z.string().regex(/^0x[a-fA-F0-9]{40}$/, "Enter a valid EVM wallet address."),
  ]),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const { data: profile, error, isLoading, refetch } = useProfileQuery();
  const [updateProfile] = useUpdateProfileMutation();
  const [setWithdrawPassword, { isLoading: savingWithdrawPw }] =
    useSetWithdrawPasswordMutation();
  const [requestOtp, { isLoading: sendingOtp }] =
    useRequestWithdrawPasswordOtpMutation();
  const [withdrawPw1, setWithdrawPw1] = useState("");
  const [withdrawPw2, setWithdrawPw2] = useState("");
  const [withdrawOtp, setWithdrawOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [copiedRef, setCopiedRef] = useState(false);
  const withdrawLockedUntil = profile?.withdrawLockedUntil
    ? new Date(profile.withdrawLockedUntil)
    : null;

  const withdrawPwValid =
    /^(?=.*[a-zA-Z])(?=.*\d).{8,}$/.test(withdrawPw1) &&
    withdrawPw1 === withdrawPw2;

  async function sendWithdrawOtp() {
    try {
      await requestOtp().unwrap();
      setOtpSent(true);
      toast.success("Verification code sent", {
        description: `Check ${profile?.email ?? "your email"} for the 6-digit code.`,
      });
    } catch (err) {
      toast.error(
        normalizeError(err as Parameters<typeof normalizeError>[0])?.message,
      );
    }
  }

  async function submitWithdrawPassword(e: FormEvent) {
    e.preventDefault();
    if (!/^(?=.*[a-zA-Z])(?=.*\d).{8,}$/.test(withdrawPw1)) {
      return toast.error(
        "Withdraw password must be 8+ characters with letters and numbers.",
      );
    }
    if (withdrawPw1 !== withdrawPw2) {
      return toast.error("Passwords do not match.");
    }
    if (!/^\d{6}$/.test(withdrawOtp)) {
      return toast.error("Enter the 6-digit code from your email.");
    }
    try {
      await setWithdrawPassword({
        withdrawPassword: withdrawPw1,
        otp: withdrawOtp,
      }).unwrap();
      toast.success(
        "Withdraw password saved. Withdrawals are locked for the next 24 hours.",
      );
      setWithdrawPw1("");
      setWithdrawPw2("");
      setWithdrawOtp("");
      setOtpSent(false);
      refetch();
    } catch (err) {
      toast.error(
        normalizeError(err as Parameters<typeof normalizeError>[0])?.message,
      );
    }
  }
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    mode: "onTouched",
    defaultValues: { name: "", phone: "", country: "", walletAddress: "" },
  });

  useEffect(() => {
    if (!profile) return;
    form.reset({
      name: profile.name ?? "",
      phone: profile.phone ?? "",
      country: profile.country ?? "",
      walletAddress: profile.walletAddress ?? "",
    });
  }, [form, profile]);

  const { submit, submitting, formError } = useFormSubmit({
    form,
    mutate: async (values) =>
      updateProfile({
        name: values.name,
        phone: values.phone || undefined,
        country: values.country || undefined,
        walletAddress: values.walletAddress || undefined,
      }).unwrap(),
    onSuccess: () => {
      toast.success("Profile updated");
    },
  });

  const normalizedError = normalizeError(error);

  const sponsorLink =
    typeof window !== "undefined"
      ? `${window.location.origin}${ROUTES.sponsorLanding(profile?.sponsorCode ?? "")}`
      : "";

  const copySponsor = async () => {
    if (!sponsorLink) return;
    try {
      await navigator.clipboard.writeText(sponsorLink);
      setCopiedRef(true);
      toast.success("Sponsor link copied!");
      setTimeout(() => setCopiedRef(false), 1500);
    } catch {
      toast.error("Could not copy to clipboard.");
    }
  };

  return (
    <>
      <PageHeader
        title="Profile"
        description="Manage your personal details, payout wallet, and account security."
        breadcrumbs={[{ label: "Account" }, { label: "Profile" }]}
      />

      {normalizedError ? (
        <ErrorState error={normalizedError} onRetry={refetch} />
      ) : (
        <div className="space-y-5">
          <IdentityHero profile={profile} isLoading={isLoading} />

          <div className="grid gap-5 xl:grid-cols-12">
            <Card className="xl:col-span-7">
              <CardHeader>
                <CardTitle>Personal details</CardTitle>
                <CardDescription>Keep your contact and wallet information current.</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="grid gap-5 sm:grid-cols-2">
                    {Array.from({ length: 4 }, (_, index) => (
                      <Skeleton key={index} className="h-16 w-full" />
                    ))}
                  </div>
                ) : (
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(submit)} className="space-y-6" noValidate>
                      {formError ? <ErrorState error={formError} /> : null}
                      <div className="grid gap-5 sm:grid-cols-2">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Full name</FormLabel>
                              <FormControl><Input {...field} autoComplete="name" /></FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone</FormLabel>
                              <FormControl><Input {...field} type="tel" autoComplete="tel" placeholder="+1 555 000 0000" /></FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="country"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Country</FormLabel>
                              <FormControl><Input {...field} autoComplete="country-name" /></FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="walletAddress"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>USDT wallet address</FormLabel>
                              <FormControl><Input {...field} className="font-mono" autoComplete="off" placeholder="0x…" /></FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <Button type="submit" disabled={submitting || !form.formState.isDirty}>
                        <Save className="size-4" />
                        {submitting ? "Saving…" : "Save changes"}
                      </Button>
                    </form>
                  </Form>
                )}
              </CardContent>
            </Card>

            <Card className="h-fit xl:col-span-5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Link2 className="text-primary size-4" />
                  Sponsor link
                </CardTitle>
                <CardDescription>
                  Share this link to invite new members — they land on signup with your code pre-filled.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {isLoading || !profile ? (
                  <Skeleton className="h-20 w-full" />
                ) : (
                  <>
                    <div className="bg-muted/40 flex items-center gap-1 rounded-lg border border-border/60 py-1 pr-1 pl-3">
                      <span className="min-w-0 flex-1 truncate font-mono text-xs" title={sponsorLink}>
                        {sponsorLink}
                      </span>
                      <CopyButton value={sponsorLink} label="Copy sponsor link" />
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <p className="text-muted-foreground text-xs">
                        Code{" "}
                        <span className="text-foreground font-mono">{profile.sponsorCode || "—"}</span>
                      </p>
                      <div className="flex gap-2">
                        <Button
                          onClick={copySponsor}
                          variant={copiedRef ? "secondary" : "default"}
                          size="sm"
                        >
                          {copiedRef ? (
                            <>
                              <Check className="mr-2 size-4" />
                              Copied
                            </>
                          ) : (
                            <>
                              <Copy className="mr-2 size-4" />
                              Copy
                            </>
                          )}
                        </Button>
                        <ShareSponsorButton sponsorLink={sponsorLink} />
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-5 xl:grid-cols-12">
            <Card className="h-fit xl:col-span-7">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <KeyRound className="text-primary size-4" />
                  Withdraw password
                </CardTitle>
                <CardDescription>
                  Required on every withdrawal and salary bonus request. Every
                  change needs the 6-digit code emailed to you, and locks
                withdrawals for 24 hours.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading || !profile ? (
                  <Skeleton className="h-24 w-full" />
                ) : (
                  <>
                    <div className="mb-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
                      {profile.withdrawPasswordSet ? (
                        <span className="text-profit inline-flex items-center gap-1.5 font-medium">
                          <BadgeCheck className="size-4" />
                          Set
                        </span>
                      ) : (
                        <span className="text-pending inline-flex items-center gap-1.5 font-medium">
                          <Clock3 className="size-4" />
                          Not set — withdrawals are unavailable
                        </span>
                      )}
                      {withdrawLockedUntil ? (
                        <span className="text-pending">
                          · Locked until {withdrawLockedUntil.toLocaleString()}
                        </span>
                      ) : null}
                    </div>
                    <form
                      onSubmit={submitWithdrawPassword}
                      className="grid gap-4 sm:grid-cols-2"
                    >
                      <div className="space-y-2">
                        <Label htmlFor="withdraw-pw-new">
                          {profile.withdrawPasswordSet
                            ? "New withdraw password"
                            : "Withdraw password"}
                        </Label>
                        <Input
                          id="withdraw-pw-new"
                          type="password"
                          autoComplete="new-password"
                          value={withdrawPw1}
                          onChange={(e) => setWithdrawPw1(e.target.value)}
                          required
                          minLength={8}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="withdraw-pw-confirm">Confirm password</Label>
                        <Input
                          id="withdraw-pw-confirm"
                          type="password"
                          autoComplete="new-password"
                          value={withdrawPw2}
                          onChange={(e) => setWithdrawPw2(e.target.value)}
                          required
                          minLength={8}
                        />
                      </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <Label htmlFor="withdraw-otp">Email verification code</Label>
                        <button
                          type="button"
                          onClick={sendWithdrawOtp}
                          disabled={sendingOtp || !withdrawPwValid}
                          className="text-foreground text-xs font-medium underline-offset-4 hover:underline disabled:opacity-50"
                        >
                          {sendingOtp
                            ? "Sending…"
                            : otpSent
                              ? "Resend code"
                              : "Send code to my email"}
                        </button>
                      </div>
                      <Input
                        id="withdraw-otp"
                        inputMode="numeric"
                        maxLength={6}
                        autoComplete="one-time-code"
                        placeholder="6-digit code"
                        className="font-mono"
                        value={withdrawOtp}
                        onChange={(e) => setWithdrawOtp(e.target.value)}
                        required
                      />
                      {otpSent && (
                        <p className="text-muted-foreground text-xs">
                          Code sent to {profile.email} — valid for 15 minutes.
                        </p>
                      )}
                    </div>
                      <div className="sm:col-span-2">
                        <Button
                      type="submit"
                      disabled={savingWithdrawPw || !otpSent}
                    >
                          <Save className="size-4" />
                          {savingWithdrawPw
                            ? "Saving…"
                            : profile.withdrawPasswordSet
                              ? "Update withdraw password"
                              : "Set withdraw password"}
                        </Button>
                      </div>
                    </form>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Government ID (KYC) — shows the photos uploaded at signup */}
            <Card className="h-fit xl:col-span-5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <IdCard className="text-primary size-4" />
                  Government ID
                </CardTitle>
                <CardDescription>
                  Your uploaded ID photos for account verification.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading || !profile ? (
                  <div className="space-y-3">
                    <Skeleton className="h-8 w-full" />
                    <div className="grid grid-cols-1 gap-4">
                      <Skeleton className="aspect-4/3 w-full" />
                    </div>
                  </div>
                ) : profile.govIdType || profile.govIdUrl ? (
                  <div className="space-y-4">
                    {profile.govIdType ? (
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground text-sm">ID type</span>
                        <span className="text-sm font-medium">{humanizeEnum(profile.govIdType)}</span>
                      </div>
                    ) : null}
                    <div className="grid grid-cols-1 gap-4">
                      <ProfileKycImage label="ID photo" url={profile.govIdUrl} />
                    </div>
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">
                    No government ID on file. This is optional for existing accounts.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </>
  );
}

/**
 * Identity hero.
 *
 * The one place on the app that states who the account *is*: avatar, name,
 * verification and rank, followed by a hairline rail of the facts that rarely
 * change. Everything mutable lives in the cards below, so this block reads as
 * a header rather than another form.
 */
function IdentityHero({
  profile,
  isLoading,
}: {
  profile: ReturnType<typeof useProfileQuery>["data"];
  isLoading: boolean;
}) {
  return (
    <section className="relative overflow-hidden rounded-xl bg-card ring-1 ring-foreground/10">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 150% at 0% 0%, color-mix(in oklch, var(--logo-gold-400) 16%, transparent) 0%, transparent 55%), radial-gradient(90% 130% at 100% 0%, var(--profit-muted) 0%, transparent 60%)",
        }}
      />

      <div className="relative flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:gap-6 sm:p-6">
        {isLoading || !profile ? (
          <>
            <Skeleton className="size-16 shrink-0 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-64" />
            </div>
          </>
        ) : (
          <>
            <Avatar className="size-16 shrink-0 ring-2 ring-(--logo-gold-400)/25">
              <AvatarFallback className="bg-gradient-to-br from-(--logo-gold-400) to-(--logo-gold-700) text-xl font-semibold text-(--logo-navy-900)">
                {initialsOf(profile.name, profile.email)}
              </AvatarFallback>
            </Avatar>

            <div className="min-w-0 flex-1 space-y-1.5">
              <div className="flex flex-wrap items-center gap-2.5">
                <h2 className="text-foreground truncate text-xl font-semibold tracking-tight">
                  {profile.name ?? profile.email.split("@")[0]}
                </h2>
                {profile.role === UserRole.ADMIN ? (
                  <ShieldCheck className="text-primary size-4 shrink-0" aria-label="Admin" />
                ) : null}
                <StatusBadge status={profile.status} />
              </div>
              <div className="text-muted-foreground flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm">
                <span className="inline-flex min-w-0 items-center gap-1.5">
                  <Mail className="size-3.5 shrink-0" />
                  <span className="truncate">{profile.email}</span>
                </span>
                <RankBadge rank={profile.rank} />
              </div>
            </div>
          </>
        )}
      </div>

      <dl className="border-border/60 bg-border/30 relative grid grid-cols-2 gap-px border-t sm:grid-cols-4">
        <HeroStat
          label="Sponsor code"
          loading={isLoading || !profile}
          value={
            profile?.sponsorCode ? (
              <span className="inline-flex items-center gap-1">
                <span className="font-mono">{profile.sponsorCode}</span>
                <CopyButton value={profile.sponsorCode} size="xs" label="Copy sponsor code" />
              </span>
            ) : (
              "—"
            )
          }
        />
        <HeroStat
          label="Role"
          loading={isLoading || !profile}
          value={profile ? humanizeEnum(profile.role) : "—"}
        />
        <HeroStat
          icon={CalendarDays}
          label="Member since"
          loading={isLoading || !profile}
          value={formatDate(profile?.createdAt)}
        />
        <HeroStat
          icon={LogIn}
          label="Last login"
          loading={isLoading || !profile}
          value={formatDateTime(profile?.lastLogin)}
        />
      </dl>
    </section>
  );
}

/** One cell of the identity rail — mirrors the dashboard's hairline tiles. */
function HeroStat({
  label,
  value,
  icon: Icon,
  loading,
}: {
  label: string;
  value: ReactNode;
  icon?: typeof Mail;
  loading?: boolean;
}) {
  return (
    <div className="bg-card flex flex-col gap-1 p-3.5 sm:p-4">
      <dt className="text-muted-foreground flex items-center gap-1.5 text-xs font-medium">
        {Icon ? <Icon className="size-3.5" /> : null}
        {label}
      </dt>
      <dd className="text-sm font-medium">
        {loading ? <Skeleton className="h-5 w-24" /> : value}
      </dd>
    </div>
  );
}

function ProfileKycImage({ label, url }: { label: string; url?: string | null }) {
  if (!url) {
    return (
      <div className="space-y-1.5">
        <p className="text-muted-foreground text-xs font-medium">{label}</p>
        <div className="bg-muted flex aspect-4/3 items-center justify-center rounded-lg border">
          <span className="text-muted-foreground text-xs">Not provided</span>
        </div>
      </div>
    );
  }
  return (
    <div className="space-y-1.5">
      <p className="text-muted-foreground text-xs font-medium">{label}</p>
      <a href={url} target="_blank" rel="noopener noreferrer" className="block">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={url}
          alt={`${label} of your government ID`}
          className={cn(
            "aspect-4/3 w-full rounded-lg border object-cover",
            "transition-opacity hover:opacity-80",
          )}
        />
      </a>
    </div>
  );
}
