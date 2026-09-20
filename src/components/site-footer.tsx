import Image from "next/image";
import Link from "next/link";
import { brand, navLinks } from "@/lib/content";

export function SiteFooter() {
  return (
    <footer id="contact" className="border-t border-[var(--line)] bg-[#020503]">
      <div className="relative overflow-hidden">
        <div className="marquee-track flex w-max gap-16 whitespace-nowrap py-6 text-[11px] font-semibold uppercase tracking-[0.42em] text-[#3f5a49]">
          {[...Array(2)].map((_, loop) => (
            <span key={loop} className="flex gap-16">
              {brand.pillars.map((pillar) => (
                <span key={`${loop}-${pillar}`}>{pillar}</span>
              ))}
              <span>{brand.motto}</span>
            </span>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <Image
              src="/logo-2x100.png"
              alt="2X100 Global"
              width={160}
              height={52}
              className="h-11 w-auto object-contain"
            />
            <p className="mt-6 max-w-md text-sm leading-relaxed text-[#93a89a]">
              {brand.tagline}. Technology-driven automated digital asset trading
              with scheduled participation, transparent processes, and a global
              member community.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            <div className="col-span-2 sm:col-span-1">
              <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[var(--gold-bright)]">
                Navigate
              </p>
              <ul className="mt-4 space-y-2">
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
            <div className="col-span-2 sm:col-span-2">
              <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[var(--gold-bright)]">
                Member Access
              </p>
              <p className="mt-4 text-sm text-[#a8bdb0]">
                Request onboarding details and platform credentials through your
                regional representative or official member channel.
              </p>
              <a
                href="mailto:contact@2x100global.com"
                className="mt-5 inline-flex rounded-full bg-[linear-gradient(135deg,#1a9d5c,#0f5c38)] px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-white"
              >
                Contact Team
              </a>
            </div>
          </div>
        </div>
        <div className="mt-14 flex flex-col gap-3 border-t border-[var(--line)] pt-8 text-xs text-[#6f8779] sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} 2X100 Global. All rights reserved.</p>
          <p>{brand.visionLine}</p>
        </div>
      </div>
    </footer>
  );
}
