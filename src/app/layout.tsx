import type { Metadata, Viewport } from "next";
import { Syne, Manrope, Geist_Mono } from "next/font/google";

import "./globals.css";
import { Providers } from "@/components/providers";
import { getSession } from "@/lib/auth/session";
import type { PreloadedState } from "@/store";

const display = Syne({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

const body = Manrope({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const mono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "2x100 Global | Complete Investment & Wealth Building Plan",
    template: "%s · 2x100 Global",
  },
  description:
    "2x100 Global delivers AI-powered automated digital asset trading, transparent member participation, and a technology-driven wealth building ecosystem.",
  robots: {
    // The authenticated surface must stay out of search indexes; the
    // marketing routes opt back in explicitly via their own metadata.
    index: false,
    follow: false,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#030806" },
    { media: "(prefers-color-scheme: light)", color: "#f5f7f2" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  /**
   * Resolve the session on the server and hand it to the store as preloaded
   * state — removes the auth flicker on first paint.
   */
  const session = await getSession();

  const preloadedState: PreloadedState = {
    auth: session
      ? {
          status: "authenticated",
          user: {
            id: session.userId,
            email: session.email,
            role: session.role,
            name: null,
            referralCode: "",
            rank: "LV1",
            autoTradeStatus: false,
            status: "ACTIVE",
          },
          expired: false,
        }
      : { status: "unauthenticated", user: null, expired: false },
  };

  return (
    <html lang="en" className="dark h-full" suppressHydrationWarning>
      <body
        className={`${display.variable} ${body.variable} ${mono.variable} min-h-dvh antialiased`}
      >
        <div className="grain" aria-hidden />
        <Providers preloadedState={preloadedState}>{children}</Providers>
      </body>
    </html>
  );
}
