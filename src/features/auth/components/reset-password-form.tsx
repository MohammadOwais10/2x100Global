"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, KeyRound, Mail } from "lucide-react";
import { toast } from "sonner";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { AuthFieldLabel, AuthInput, AuthInputShell } from "./auth-field";
import { OtpInput } from "./otp-input";
import { PasswordInput } from "./password-input";
import {
  AuthFormError,
  AuthFormHeader,
  AuthStatus,
  AuthSubmitButton,
} from "./auth-form-shell";
import { useResetPasswordMutation } from "../api/auth-api";
import { useFormSubmit } from "../hooks/use-form-submit";
import {
  resetPasswordSchema,
  type ResetPasswordFormValues,
} from "../schemas/auth-schemas";
import { ROUTES } from "@/config/routes";

export function ResetPasswordForm() {
  const router = useRouter();
  const [resetPassword] = useResetPasswordMutation();
  const [done, setDone] = useState(false);

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onTouched",
    defaultValues: {
      email: "",
      otp: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const { submit, submitting, formError } = useFormSubmit({
    form,
    mutate: async (values) => {
      const parsed = resetPasswordSchema.parse(values);
      return resetPassword({
        email: parsed.email,
        otp: parsed.otp,
        newPassword: parsed.newPassword,
      }).unwrap();
    },
    onSuccess: () => {
      setDone(true);
      toast.success("Password updated");
    },
  });

  if (done) {
    return (
      <AuthStatus
        icon={CheckCircle2}
        title="Password updated"
        description="For your security, you've been signed out on all other devices. Sign in with your new password to continue."
      >
        <Button
          className="h-12 w-full rounded-xl text-[0.8125rem]"
          onClick={() => {
            router.replace(ROUTES.login);
            router.refresh();
          }}
        >
          Continue to sign in
        </Button>
      </AuthStatus>
    );
  }

  return (
    <>
      <AuthFormHeader
        eyebrow="Account recovery"
        title="Choose a new"
        accent="password."
        description="Enter the 6-digit code we emailed you, then set a new password."
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

          <FormField
            control={form.control}
            name="otp"
            render={({ field, fieldState }) => (
              <FormItem className="space-y-2">
                <AuthFieldLabel>Reset code</AuthFieldLabel>

                <FormControl>
                  <OtpInput
                    {...field}
                    onChange={field.onChange}
                    placeholder="000000"
                    aria-label="6-digit reset code"
                    invalid={Boolean(fieldState.error)}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="newPassword"
            render={({ field, fieldState }) => (
              <FormItem className="space-y-2">
                <AuthFieldLabel>New password</AuthFieldLabel>

                <FormControl>
                  <PasswordInput
                    {...field}
                    icon={KeyRound}
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
                <AuthFieldLabel>Confirm new password</AuthFieldLabel>

                <FormControl>
                  <PasswordInput
                    {...field}
                    icon={KeyRound}
                    autoComplete="new-password"
                    placeholder="Re-enter your new password"
                    invalid={Boolean(fieldState.error)}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <div className="pt-1">
            <AuthSubmitButton loading={submitting} loadingLabel="Updating…">
              Update password
            </AuthSubmitButton>
          </div>
        </form>
      </Form>

      <p className="text-muted-foreground mt-8 text-center text-sm">
        Didn&apos;t get a code?{" "}
        <Link
          href={ROUTES.forgotPassword}
          className="text-foreground font-medium underline-offset-4 transition-colors hover:text-primary hover:underline"
        >
          Request a new one
        </Link>
      </p>
    </>
  );
}