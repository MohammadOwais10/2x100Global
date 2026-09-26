"use client";

import { Newspaper } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { DashboardSlider } from "@/components/common/dashboard-slider";
import {
  usePublicPostsQuery,
  usePublicNewsQuery,
} from "@/features/content/api/content-api";

const dateFmt = new Intl.DateTimeFormat("en", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

/**
 * Landing page section — admin-published posts in the same 3D carousel used
 * on the member dashboard, with a compact news feed panel beside it.
 * Renders nothing until there is published content, so an empty platform
 * simply doesn't show the section at all.
 */
export function UpdatesSection() {
  const posts = usePublicPostsQuery({ limit: 10 });
  const news = usePublicNewsQuery({ limit: 6 });

  const items = posts.data?.items ?? [];
  const newsItems = news.data?.items ?? [];
  const loading = posts.isLoading || news.isLoading;

  if (!loading && items.length === 0 && newsItems.length === 0) return null;

  return (
    <section id="updates" className="relative py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal>
          <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-[#8fae98]">
            Announcements
          </p>
          <h2 className="mt-4 max-w-3xl font-display text-4xl tracking-tight text-white md:text-5xl">
            Latest from 2X100 Global
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {/* Posts — same 3D slider as the dashboard */}
          <Reveal className="lg:col-span-2">
            <div className="panel-glass rounded-3xl p-2 [&>div]:mb-0 [&>div]:border-0 [&>div]:bg-transparent">
              <DashboardSlider />
            </div>
          </Reveal>

          {/* News — compact feed */}
          <Reveal delay={0.1}>
            <aside className="panel-glass h-full rounded-3xl p-7">
              <div className="mb-5 flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--line)] bg-[#0a2015] text-[var(--gold-bright)]">
                  <Newspaper className="size-4" />
                </span>
                <h3 className="font-display text-xl text-white">News feed</h3>
              </div>
              <div className="space-y-5">
                {newsItems.map((item) => (
                  <div
                    key={item.id}
                    className="border-b border-[var(--line)] pb-5 last:border-0 last:pb-0"
                  >
                    <p className="text-sm font-semibold text-white">
                      {item.title}
                    </p>
                    <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-[#b5c7bb]">
                      {item.message}
                    </p>
                    <p className="mt-2 text-[11px] uppercase tracking-wider text-[#8fae98]">
                      {dateFmt.format(new Date(item.createdAt))}
                    </p>
                  </div>
                ))}
                {!loading && newsItems.length === 0 && (
                  <p className="text-sm text-[#8fae98]">No news yet.</p>
                )}
              </div>
            </aside>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
