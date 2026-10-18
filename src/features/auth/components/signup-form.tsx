"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Gift, Globe2, LockKeyhole, Mail, Phone, Ticket, User } from "lucide-react";
import { motion } from "framer-motion";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { AuthFieldLabel, AuthInput, AuthInputShell } from "./auth-field";
import { PasswordInput } from "./password-input";
import {
  AuthFormError,
  AuthFormFooter,
  AuthFormHeader,
  AuthSubmitButton,
} from "./auth-form-shell";
import { useSignupMutation } from "../api/auth-api";
import { useFormSubmit } from "../hooks/use-form-submit";
import {
  signupSchema,
  toSignupRequest,
  type SignupFormValues,
} from "../schemas/auth-schemas";
import { ROUTES } from "@/config/routes";
import { getDeviceFingerprint } from "@/lib/device/fingerprint";

/**
 * Signup — single-step form.
 *
 * Fields: name, email, password, optional phone/sponsor code + terms.
 * On success the user must verify a 6-digit email OTP before the
 * account can sign in — we redirect to /verify-email.
 */
export function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [signup] = useSignupMutation();

  // `/ref/<code>` rewrites to `/signup?ref=<code>`; also accept ?sponsorCode=
  // (and the legacy ?referralCode=) so a manually shared link with any param
  // works.
  const sponsorFromUrl = (
    searchParams.get("ref") ??
    searchParams.get("sponsorCode") ??
    searchParams.get("referralCode") ??
    ""
  )
    .trim()
    .toUpperCase();

  const hasSponsor = sponsorFromUrl.length > 0;

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    mode: "onTouched",
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
      country: "",
      sponsorCode: sponsorFromUrl,
    },
  });

  const { submit, submitting, formError } = useFormSubmit({
    form,
    mutate: async (values) => {
      const parsed = signupSchema.parse(values);
      const deviceFingerprint = await getDeviceFingerprint();
      if (!deviceFingerprint) {
        // Backend requires a fingerprint — without one the account could not
        // be bound to this device, so fail before the round trip.
        throw new Error(
          "Could not verify your device. Please refresh the page and try again.",
        );
      }
      return signup(toSignupRequest(parsed, deviceFingerprint)).unwrap();
    },
    onSuccess: (_data, values) => {
      toast.success("Check your email", {
        description: "We sent a 6-digit verification code to your email.",
      });
      router.replace(
        `${ROUTES.verifyEmail}?email=${encodeURIComponent(values.email)}`,
      );
    },
    fieldAliases: { referralCode: "sponsorCode" },
  });

  return (
    <>
      <AuthFormHeader
        eyebrow="Get started"
        title="Create your"
        accent="account."
        description="Open a member account, deposit USDT, and let the automated sessions run."
      />

      {hasSponsor ? (
        <SponsorBanner code={sponsorFromUrl} />
      ) : null}

      <AuthFormError error={formError} />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(submit)} className="space-y-5" noValidate>
          <FormField
            control={form.control}
            name="name"
            render={({ field, fieldState }) => (
              <FormItem className="space-y-2">
                <AuthFieldLabel>Full name</AuthFieldLabel>

                <AuthInputShell icon={User}>
                  <AuthInput
                    {...field}
                    hasIcon
                    autoComplete="name"
                    autoFocus
                    placeholder="Alex Morgan"
                    aria-invalid={Boolean(fieldState.error)}
                  />
                </AuthInputShell>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field, fieldState }) => (
              <FormItem className="space-y-2">
                <AuthFieldLabel>Email address</AuthFieldLabel>

                <AuthInputShell icon={Mail}>
                  <AuthInput
                    {...field}
                    hasIcon
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    aria-invalid={Boolean(fieldState.error)}
                  />
                </AuthInputShell>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field, fieldState }) => (
              <FormItem className="space-y-2">
                <AuthFieldLabel>Password</AuthFieldLabel>

                <FormControl>
                  <PasswordInput
                    {...field}
                    icon={LockKeyhole}
                    autoComplete="new-password"
                    placeholder="At least 8 characters"
                    showStrength
                    invalid={Boolean(fieldState.error)}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field, fieldState }) => (
              <FormItem className="space-y-2">
                <AuthFieldLabel>Confirm password</AuthFieldLabel>

                <FormControl>
                  <PasswordInput
                    {...field}
                    icon={LockKeyhole}
                    autoComplete="new-password"
                    placeholder="Re-enter your password"
                    invalid={Boolean(fieldState.error)}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          {/* Hairline + micro-label, so it is obvious the remaining fields are
              skippable rather than another required block. */}
          <div className="flex items-center gap-4 pt-1.5">
            <span className="bg-border/70 h-px flex-1" />
            <span className="text-muted-foreground/70 text-[0.6875rem] font-medium tracking-[0.2em] uppercase">
              Optional
            </span>
            <span className="bg-border/70 h-px flex-1" />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="phone"
              render={({ field, fieldState }) => (
                <FormItem className="space-y-2">
                  <AuthFieldLabel>Phone</AuthFieldLabel>

                  <AuthInputShell icon={Phone}>
                    <AuthInput
                      {...field}
                      hasIcon
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      placeholder="Mobile number"
                      aria-invalid={Boolean(fieldState.error)}
                    />
                  </AuthInputShell>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="country"
              render={({ field, fieldState }) => (
                <FormItem className="space-y-2">
                  <AuthFieldLabel>Country</AuthFieldLabel>

                  <AuthInputShell icon={Globe2}>
                    <AuthInput
                      {...field}
                      hasIcon
                      autoComplete="country-name"
                      placeholder="United States"
                      aria-invalid={Boolean(fieldState.error)}
                    />
                  </AuthInputShell>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="sponsorCode"
            render={({ field, fieldState }) => (
              <FormItem className="space-y-2">
                <AuthFieldLabel>Sponsor code</AuthFieldLabel>

                <AuthInputShell icon={Ticket}>
                  <AuthInput
                    {...field}
                    hasIcon
                    placeholder="ABCD1234"
                    maxLength={8}
                    autoCapitalize="characters"
                    spellCheck={false}
                    className="font-mono tracking-[0.18em] uppercase"
                    aria-invalid={Boolean(fieldState.error)}
                  />
                </AuthInputShell>

                <FormMessage />
              </FormItem>
            )}
          />

          <div className="pt-1.5">
            <AuthSubmitButton
              loading={submitting}
              loadingLabel="Creating account…"
            >
              Create account
            </AuthSubmitButton>
          </div>
        </form>
      </Form>

      <AuthFormFooter
        prompt="Already have an account?"
        linkLabel="Sign in"
        href={ROUTES.login}
      />
    </>
  );
}

/**
 * Confirms a sponsor code landed, so a member arriving from `/ref/<code>` can
 * see the code was actually captured before they type anything.
 */
function SponsorBanner({ code }: { code: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="mb-6 overflow-hidden rounded-2xl border border-primary/25 bg-primary/8 backdrop-blur-sm"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(240,212,138,0.6),transparent)]"
      />

      <div className="flex items-center gap-3.5 px-4 py-3.5">
        <span className="border-primary/25 bg-primary/12 text-primary grid size-9 shrink-0 place-items-center rounded-xl border">
          <Gift className="size-4" strokeWidth={1.9} aria-hidden="true" />
        </span>

        <p className="text-[0.8125rem] leading-relaxed">
          <span className="text-muted-foreground">Invited with code</span>{" "}
          <span className="text-primary font-mono font-semibold tracking-[0.14em]">
            {code}
          </span>
        </p>
      </div>
    </motion.div>
  );
}