"use client";

import FingerprintJS from "@fingerprintjs/fingerprintjs";

/**
 * Browser device fingerprint (FingerprintJS `visitorId`).
 *
 * Used by signup to enforce the one-account-per-device rule: the backend
 * rejects a second signup carrying a fingerprint already bound to an
 * account.
 *
 * The promise is cached so the ~1s collection runs once per page load —
 * calling `fp.get()` twice would re-do the same canvas/audio probing.
 *
 * Returns `null` when fingerprinting is unavailable (blocked script,
 * exotic browser); the caller decides whether to block submission.
 */
let fingerprintPromise: Promise<string | null> | null = null;

export function getDeviceFingerprint(): Promise<string | null> {
  fingerprintPromise ??= FingerprintJS.load()
    .then((agent) => agent.get())
    .then((result) => result.visitorId)
    .catch(() => null);
  return fingerprintPromise;
}
