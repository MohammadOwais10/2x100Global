"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MailCheck, Send } from "lucide-react";
import { toast } from "sonner";

import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { AuthFieldLabel } from "./auth-field";
import { OtpInput } from "./otp-input";
import {
  AuthFormError,
  AuthFormHeader,
  AuthSubmitButton,
} from "./auth-form-shell";
import { useVerifyEmailMutation, useResendOtpMutation } from "@/features/auth/api/auth-api";
import { useFormSubmit } from "@/features/auth/hooks/use-form-submit";
import {
  verifyEmailSchema,
  type VerifyEmailFormValues,
} from "@/features/auth/schemas/auth-schemas";
import { ROUTES } from "@/config/routes";

export function VerifyEmailForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [verifyEmail] = useVerifyEmailMutation();
  const [resendOtp] = useResendOtpMutation();
  const [resending, setResending] = useState(false);

  const email = searchParams.get("email") ?? "";

  const form = useForm<VerifyEmailFormValues>({
    resolver: zodResolver(verifyEmailSchema),
    mode: "onTouched",
    defaultValues: {
      email,
      otp: "",
    },
  });

  // Keep email in sync with URL param
  useEffect(() => {
    form.setValue("email", email);
  }, [email, form]);

  const { submit, submitting, formError } = useFormSubmit({
    form,
    mutate: async (values) => {
      const parsed = verifyEmailSchema.parse(values);
      return verifyEmail(parsed).unwrap();
    },
    onSuccess: () => {
      toast.success("Email verified");
      router.replace(ROUTES.dashboard);
      router.refresh();
    },
  });

  const handleResend = async () => {
    if (!email) return;
    setResending(true);
    try {
      await resendOtp({ email, purpose: "SIGNUP" }).unwrap();
      toast.success("Code sent", { description: "Check your email." });
    } catch {
      // error surfaced by RTK/sonner
    } finally {
      setResending(false);
    }
  };

  return (
    <>
      <AuthFormHeader
        eyebrow="One last step"
        title="Verify your"
        accent="email."
        description={
          <>
            We sent a 6-digit code to{" "}
            <span className="text-foreground font-medium break-all">
              {email || "your email"}
            </span>
            . Enter it below to finish creating your account.
          </>
        }
      />

      <AuthFormError error={formError} />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(submit)} className="space-y-5" noValidate>
          <input type="hidden" {...form.register("email")} value={email} />

          <FormField
            control={form.control}
            name="otp"
            render={({ field, fieldState }) => (
              <FormItem className="space-y-2">
                <AuthFieldLabel>Verification code</AuthFieldLabel>

                <OtpInput
                  {...field}
                  onChange={field.onChange}
                  placeholder="000000"
                  aria-label="6-digit verification code"
                  invalid={Boolean(fieldState.error)}
                />

                <FormMessage />
              </FormItem>
            )}
          />

          <div className="pt-1">
            <AuthSubmitButton loading={submitting} loadingLabel="Verifying…">
              Verify and continue
            </AuthSubmitButton>
          </div>
        </form>
      </Form>

      <div className="mt-8 space-y-2.5 border-t border-border/50 pt-6 text-center">
        <p className="text-muted-foreground text-sm">
          Didn&apos;t get it?{" "}
          <button
            type="button"
            onClick={handleResend}
            disabled={resending || !email}
            className="text-foreground inline-flex items-center gap-1.5 font-medium underline-offset-4 transition-colors hover:text-primary hover:underline disabled:opacity-50"
          >
            <Send className="size-3.5" strokeWidth={1.9} aria-hidden="true" />
            {resending ? "Sending…" : "Resend code"}
          </button>
        </p>

        <p className="text-muted-foreground text-sm">
          Wrong email?{" "}
          <Link
            href={ROUTES.signup}
            className="text-foreground font-medium underline-offset-4 transition-colors hover:text-primary hover:underline"
          >
            Sign up again
          </Link>
        </p>
      </div>

      <p className="text-muted-foreground/70 mt-6 flex items-center justify-center gap-1.5 text-[0.6875rem]">
        <MailCheck className="text-primary size-3" strokeWidth={2.5} aria-hidden="true" />
        Codes expire after 15 minutes
      </p>
    </>
  );
}