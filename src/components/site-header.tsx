"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { navLinks } from "@/lib/content";

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-500 ${
        scrolled
          ? "border-b border-[var(--line)] bg-[#030806]/82 backdrop-blur-xl"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-4 lg:px-10">
        <Link href="/" className="group flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="2x100 Global"
            width={148}
            height={48}
            className="h-10 w-auto object-contain transition group-hover:brightness-110"
            priority
          />
        </Link>
        <nav className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#c8d4c8] transition hover:text-[var(--gold-bright)]"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <Link
          href="#contact"
          className="gold-border relative overflow-hidden rounded-full px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--gold-bright)] transition hover:shadow-[0_0_40px_rgba(212,175,90,0.25)]"
        >
          <span className="relative z-10">Member Access</span>
        </Link>
      </div>
    </header>
  );
}
