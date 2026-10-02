import type { Metadata } from "next";
import { Suspense } from "react";

import { VerifyEmailForm } from "@/features/auth/components/verify-email-form";
import { AuthFormSkeleton } from "@/features/auth/components/auth-form-skeleton";

export const metadata: Metadata = {
  title: "Verify your email",
  description: "Enter the verification code sent to your email to complete signup.",
};

// Suspense is required because VerifyEmailForm reads ?email= via
// useSearchParams(), which Next cannot prerender without a boundary.
export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<AuthFormSkeleton rows={["otp"]} />}>
      <VerifyEmailForm />
    </Suspense>
  );
}