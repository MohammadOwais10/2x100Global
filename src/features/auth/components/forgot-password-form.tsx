"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, MailCheck } from "lucide-react";

import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { AuthFieldLabel, AuthInput, AuthInputShell } from "./auth-field";
import {
  AuthBackLink,
  AuthFormError,
  AuthFormHeader,
  AuthStatus,
  AuthSubmitButton,
  AuthTrustNote,
} from "./auth-form-shell";
import { useForgotPasswordMutation } from "../api/auth-api";
import { useFormSubmit } from "../hooks/use-form-submit";
import {
  forgotPasswordSchema,
  type ForgotPasswordFormValues,
} from "../schemas/auth-schemas";
import { ROUTES } from "@/config/routes";

/**
 * Request a password reset code (OTP) by email.
 *
 * The backend deliberately returns the same success response whether or not
 * the email exists (`forgotPassword` returns early on an unknown address), to
 * prevent account enumeration — which is why the confirmation copy below is
 * phrased conditionally and never confirms that an account exists.
 */
export function ForgotPasswordForm() {
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [forgotPassword] = useForgotPasswordMutation();

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onTouched",
    defaultValues: { email: "" },
  });

  const { submit, submitting, formError } = useFormSubmit({
    form,
    mutate: async (values) => {
      const parsed = forgotPasswordSchema.parse(values);
      return forgotPassword({ email: parsed.email }).unwrap();
    },
    onSuccess: (_result, values) => {
      setSentTo(forgotPasswordSchema.parse(values).email);
    },
    toastOnError: true,
  });

  if (sentTo) {
    return (
      <AuthStatus
        icon={MailCheck}
        title="Check your inbox"
        description={
          <>
            If an account exists for{" "}
            <span className="text-foreground font-medium break-all">{sentTo}</span>,
            we&apos;ve sent a 6-digit reset code. It expires in 15 minutes.
          </>
        }
      >
        <Button asChild className="h-12 w-full rounded-xl text-[0.8125rem]">
          <Link href={ROUTES.resetPassword}>I have the code</Link>
        </Button>

        <Button
          variant="ghost"
          className="text-muted-foreground hover:text-foreground h-12 w-full rounded-xl text-[0.8125rem]"
          onClick={() => setSentTo(null)}
        >
          Try a different address
        </Button>

        <div className="pt-1">
          <AuthTrustNote icon={Mail}>
            Still nothing? Check your spam or promotions folder
          </AuthTrustNote>
        </div>

        <AuthBackLink href={ROUTES.login}>Back to sign in</AuthBackLink>
      </AuthStatus>
    );
  }

  return (
    <>
      <AuthFormHeader
        eyebrow="Account recovery"
        title="Reset your"
        accent="password."
        description="Enter the email on your account and we'll send a 6-digit reset code."
      />

      <AuthFormError error={formError} />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(submit)} className="space-y-5" noValidate>
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
                    autoFocus
                    placeholder="you@example.com"
                    aria-invalid={Boolean(fieldState.error)}
                  />
                </AuthInputShell>

                <FormMessage />
              </FormItem>
            )}
          />

          <div className="pt-1">
            <AuthSubmitButton loading={submitting} loadingLabel="Sending code…">
              Send reset code
            </AuthSubmitButton>
          </div>
        </form>
      </Form>

      <AuthBackLink href={ROUTES.login}>Back to sign in</AuthBackLink>
    </>
  );
}