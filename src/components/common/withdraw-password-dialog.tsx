"use client";

import { useState, type FormEvent } from "react";
import { AlertTriangle, Hourglass, KeyRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useProfileQuery } from "@/features/auth/api/auth-api";
import { normalizeError } from "@/lib/api/errors";
import { ROUTES } from "@/config/routes";

/**
 * Shown after the user submits a withdrawal form. Handles the three states:
 * password not set → points to Profile; inside the 24h post-change lock →
 * shows the unlock time; otherwise collects the withdraw password and calls
 * `onConfirm` — the caller toasts success; errors stay inside the dialog.
 */
export function WithdrawPasswordDialog({
  open,
  onOpenChange,
  onConfirm,
  loading,
  title = "Confirm withdrawal",
  description = "Enter your withdraw password to submit this request.",
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (withdrawPassword: string) => Promise<void>;
  loading?: boolean;
  title?: string;
  description?: string;
}) {
  const { data: profile } = useProfileQuery();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const passwordSet = profile?.withdrawPasswordSet;
  const lockedUntil = profile?.withdrawLockedUntil
    ? new Date(profile.withdrawLockedUntil)
    : null;

  const close = (v: boolean) => {
    if (!v) {
      setPassword("");
      setError(null);
    }
    onOpenChange(v);
  };

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!password) return setError("Enter your withdraw password.");
    setError(null);
    try {
      await onConfirm(password);
      close(false);
    } catch (err) {
      setError(
        normalizeError(err as Parameters<typeof normalizeError>[0])?.message ??
          "Something went wrong.",
      );
    }
  }

  return (
    <Dialog open={open} onOpenChange={close}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <KeyRound className="size-5" />
            {title}
          </DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        {passwordSet === false ? (
          <div className="flex items-start gap-3 rounded-lg border border-amber-500/50 bg-amber-500/10 p-4">
            <AlertTriangle className="size-5 shrink-0 text-amber-600" />
            <p className="text-sm text-muted-foreground">
              You have not set a withdraw password yet. Set it in your{" "}
              <a href={ROUTES.profile} className="underline">
                Profile
              </a>{" "}
              first.
            </p>
          </div>
        ) : lockedUntil ? (
          <div className="flex items-start gap-3 rounded-lg border border-amber-500/50 bg-amber-500/10 p-4">
            <Hourglass className="size-5 shrink-0 text-amber-600" />
            <div className="space-y-1 text-sm">
              <p className="font-semibold text-amber-700">
                Withdrawals are locked
              </p>
              <p className="text-muted-foreground">
                For your security, withdrawals are blocked for 24 hours after
                the withdraw password was last set or changed. You can withdraw
                again after{" "}
                <strong>{lockedUntil.toLocaleString()}</strong>.
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="dialog-withdraw-password">Withdraw password</Label>
              <Input
                id="dialog-withdraw-password"
                type="password"
                autoComplete="off"
                autoFocus
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {error && <p className="text-destructive text-sm">{error}</p>}
            <DialogFooter>
              <Button type="submit" disabled={loading}>
                {loading ? "Submitting…" : "Confirm withdrawal"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
