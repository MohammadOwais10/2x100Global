import type { Metadata } from "next";
import { Syne, Manrope } from "next/font/google";
import "./globals.css";

const display = Syne({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const body = Manrope({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "2X100 Global | Complete Investment & Wealth Building Plan",
  description:
    "2X100 Global delivers AI-powered automated digital asset trading, transparent member participation, and a technology-driven wealth building ecosystem.",
  openGraph: {
    title: "2X100 Global",
    description:
      "Invest · Trade · Grow · Together — A Brighter Financial Tomorrow.",
    images: [{ url: "/logo-2x100.png" }],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} h-full`}>
      <body className="min-h-full bg-[var(--background)] font-sans antialiased">
        <div className="grain" aria-hidden />
        {children}
      </body>
    </html>
  );
}
