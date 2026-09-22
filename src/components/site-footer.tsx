import Image from "next/image";
import Link from "next/link";
import { brand, navLinks } from "@/lib/content";

export function SiteFooter() {
  return (
    <footer
      id="contact"
      className="relative border-t border-[var(--line)] bg-[#020503]"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(240,212,138,0.5)] to-transparent" />

      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_0.7fr_1fr]">
          <div>
            <Image
              src="/logo.png"
              alt="2X100 Global"
              width={160}
              height={52}
              className="h-12 w-auto object-contain"
            />
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-[#93a89a]">
              {brand.tagline}. Technology-driven automated digital asset trading
              for a global member community.
            </p>
          </div>

          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[var(--gold-bright)]">
              Navigate
            </p>
            <ul className="mt-5 space-y-2.5">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#a8bdb0] transition hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[var(--gold-bright)]">
              Contact
            </p>
            <p className="mt-5 text-sm leading-relaxed text-[#a8bdb0]">
              Request onboarding details and platform credentials through your
              regional representative or official member channel.
            </p>
            <a
              href="mailto:contact@2x100global.com"
              className="group mt-6 inline-flex items-center gap-3 rounded-full bg-[linear-gradient(135deg,#f0d48a,#d4af5a)] px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#1a1204] transition shadow-[0_10px_30px_rgba(212,175,90,0.25)] hover:shadow-[0_12px_36px_rgba(212,175,90,0.4)]"
            >
              Become a Member
              <span className="transition group-hover:translate-x-0.5">→</span>
            </a>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-[var(--line)] pt-7 text-xs text-[#6f8779] sm:flex-row">
          <p>
            © {new Date().getFullYear()} {brand.name} {brand.suffix}. All rights
            reserved.
          </p>
          <p>
            {brand.name} Global · {brand.visionLine}
          </p>
        </div>
      </div>
    </footer>
  );
}