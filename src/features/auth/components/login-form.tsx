"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { LockKeyhole, Mail } from "lucide-react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { AuthFieldLabel, AuthInput, AuthInputShell } from "./auth-field";
import { PasswordInput } from "./password-input";
import {
  AuthFormError,
  AuthFormFooter,
  AuthFormHeader,
  AuthSubmitButton,
} from "./auth-form-shell";
import { useLoginMutation } from "../api/auth-api";
import { useFormSubmit } from "../hooks/use-form-submit";
import { loginSchema, type LoginFormValues } from "../schemas/auth-schemas";
import { ROUTES, safeRedirectTarget } from "@/config/routes";
import { UserRole } from "@/types/enums";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [login] = useLoginMutation();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    // `onTouched` rather than `onChange`: validating an email on every
    // keystroke shows "invalid email" while the user is still typing the
    // domain, which reads as the form fighting them.
    mode: "onTouched",
    defaultValues: { email: "", password: "", rememberMe: true },
  });

  const { submit, submitting, formError } = useFormSubmit({
    form,
    mutate: async (values) => {
      const parsed = loginSchema.parse(values);
      try {
        return await login({
          email: parsed.email,
          password: parsed.password,
        }).unwrap();
      } catch (error) {
        const message =
          (error as { data?: { message?: string } })?.data?.message ?? "";
        if (/verify your email/i.test(message)) {
          toast.info("Verify your email first", {
            description: "Enter the 6-digit code we emailed you, or resend it.",
          });
          router.replace(
            `${ROUTES.verifyEmail}?email=${encodeURIComponent(parsed.email)}`,
          );
        }
        throw error;
      }
    },
    onSuccess: (user) => {
      toast.success(`Welcome back${user.name ? `, ${user.name}` : ""}`);

      // Honour ?next= from the middleware redirect, but only if it is a
      // same-origin path — `safeRedirectTarget` rejects absolute and
      // protocol-relative URLs to close the open-redirect vector.
      const fallback =
        user.role === UserRole.ADMIN ? ROUTES.admin.dashboard : ROUTES.dashboard;
      const destination = safeRedirectTarget(searchParams.get("next"), fallback);

      router.replace(destination);
      // Re-render server components so the layout picks up the new session
      // cookie; without this the shell can render its signed-out state.
      router.refresh();
    },
  });

  return (
    <>
      <AuthFormHeader
        eyebrow="Member access"
        title="Welcome"
        accent="back."
        description="Sign in to reach your portfolio, trading sessions and sponsor network."
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
            name="password"
            render={({ field, fieldState }) => (
              <FormItem className="space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <AuthFieldLabel>Password</AuthFieldLabel>
                  <Link
                    href={ROUTES.forgotPassword}
                    className="text-muted-foreground hover:text-primary text-xs font-medium underline-offset-4 transition-colors hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>

                <FormControl>
                  <PasswordInput
                    {...field}
                    icon={LockKeyhole}
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    invalid={Boolean(fieldState.error)}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="rememberMe"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center gap-2.5 space-y-0 pt-0.5">
                <FormControl>
                  <Checkbox
                    id="rememberMe"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="size-[1.125rem] rounded-[6px]"
                  />
                </FormControl>
                <Label
                  htmlFor="rememberMe"
                  className="text-muted-foreground cursor-pointer text-[0.8125rem] font-normal"
                >
                  Keep me signed in
                </Label>
              </FormItem>
            )}
          />

          <div className="pt-1.5">
            <AuthSubmitButton loading={submitting} loadingLabel="Signing in…">
              Sign in
            </AuthSubmitButton>
          </div>
        </form>
      </Form>

      <AuthFormFooter
        prompt="New to 2X100 Global?"
        linkLabel="Create an account"
        href={ROUTES.signup}
      />
    </>
  );
}