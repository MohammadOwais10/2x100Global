import { Skeleton } from "@/components/ui/skeleton";

/** The two control geometries that differ enough to need their own placeholder. */
export type AuthSkeletonRow = "field" | "otp" | "strength";

/**
 * Placeholder matching an auth form's layout.
 *
 * `rows` is an explicit list rather than a field count, because the two
 * non-default geometries (the 6-box OTP grid and the password strength meter)
 * are ~50px taller than a plain input. A count would either under- or
 * over-shoot and reintroduce the shift the skeleton exists to prevent.
 *
 * Sized to the real form so the Suspense fallback causes no layout shift when
 * the client component hydrates in.
 */
export function AuthFormSkeleton({
  rows = ["field", "field"],
  checkbox = false,
}: {
  rows?: AuthSkeletonRow[];
  /** Terms / "keep me signed in" row. */
  checkbox?: boolean;
}) {
  return (
    <div>
      <div className="mb-8 space-y-3">
        <Skeleton className="h-2.5 w-24 rounded-full" />
        <Skeleton className="h-8 w-64 rounded-lg" />
        <Skeleton className="h-4 w-full max-w-[22rem] rounded-md" />
      </div>

      <div className="space-y-5">
        {rows.map((row, index) => (
          <div key={index} className="space-y-2">
            {row === "otp" ? (
              <Skeleton className="h-14 w-full rounded-xl" />
            ) : (
              <>
                <Skeleton className="h-3 w-24 rounded-md" />
                <Skeleton className="h-12 w-full rounded-xl" />
              </>
            )}

            {row === "strength" ? (
              <div className="flex gap-1.5 pt-0.5">
                {[0, 1, 2, 3].map((bar) => (
                  <Skeleton key={bar} className="h-1 flex-1 rounded-full" />
                ))}
              </div>
            ) : null}
          </div>
        ))}

        {checkbox ? <Skeleton className="h-[1.125rem] w-40 rounded-md" /> : null}

        <div className="pt-1.5">
          <Skeleton className="h-12 w-full rounded-xl" />
        </div>
      </div>

      <Skeleton className="mx-auto mt-8 h-4 w-56 rounded-md" />
    </div>
  );
}