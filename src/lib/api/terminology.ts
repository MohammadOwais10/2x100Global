/**
 * Terminology mapping: referral -> sponsor.
 *
 * The Express backend calls the invite relationship a "referral" (`referralCode`,
 * `referralLink`, `/referrals/*`, the `REFERRAL` wallet enum, …). The product
 * language is "sponsor". Rather than leak the backend's word into the frontend,
 * every response that crosses the BFF is rewritten so the rest of the app only
 * ever sees `sponsor*` keys.
 *
 * This lives at the single server-side choke point — `callUpstream` — so both
 * Server Components and the browser (which reaches the backend only through the
 * `/api/bff/*` proxy) receive the same shape. It is applied recursively because
 * a `User` (carrying `referralCode`/`referrals`) is embedded at every depth of
 * the object graph: inside deposits, referrals, admin lists, and so on.
 *
 * NOT handled here:
 *   - Request bodies. The only referral-named field a request carries is
 *     signup's `referralCode`, which `toSignupRequest` maps explicitly.
 *   - Enum *values* (`"REFERRAL"`, `"REFERRAL_BONUS"`). These are the literal
 *     strings the backend stores and matches on; renaming them would break the
 *     contract. Only object keys are rewritten.
 *   - URL paths (`/referrals/*`). Those are backend routes and stay untouched.
 */

/** Matches the "referral" substring in a key, in any case. */
const REFERRAL = /referral/gi;

/** Preserve the original casing's first letter: "Referral" -> "Sponsor". */
function toSponsor(match: string): string {
  return match[0] === match[0].toUpperCase() ? "Sponsor" : "sponsor";
}

/**
 * Recursively rename every object key containing "referral" (any case) to
 * "sponsor", preserving the surrounding key and the leading-letter case.
 *
 * Arrays and primitives pass through structurally; only keys change.
 */
export function sponsorizeResponse<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.map((item) => sponsorizeResponse(item)) as unknown as T;
  }

  if (value !== null && typeof value === "object") {
    const source = value as Record<string, unknown>;
    const result: Record<string, unknown> = {};
    for (const [key, item] of Object.entries(source)) {
      result[key.replace(REFERRAL, toSponsor)] = sponsorizeResponse(item);
    }
    return result as unknown as T;
  }

  return value;
}
