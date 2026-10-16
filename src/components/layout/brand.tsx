"use client";

import Image from "next/image";

import { cn } from "@/lib/utils";


/**
 * Logo mark.
 *
 * Just the image — no tile, no chrome. Sized entirely by `className` so each
 * call site decides its own footprint.
 */

export function BrandMark({ className }: { className?: string }) {
  return (
    <Image
      src="/logo.png"
      alt="2x100 Global"
      width={96}
      height={96}
      priority
      className={cn(
        "size-full object-contain drop-shadow-[0_8px_30px_rgba(212,175,90,0.35)]",
        className,
      )}
    />
  );
}
