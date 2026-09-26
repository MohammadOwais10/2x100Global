"use client";

import { useEffect, useState } from "react";
import { clientFetch } from "@/lib/api";
import type { News, Post } from "@/lib/types";

export function LiveDataSection() {
  const [news, setNews] = useState<News[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [newsRes, postsRes] = await Promise.all([
          clientFetch<{ data: News[] }>("/content/news"),
          clientFetch<{ data: Post[] }>("/content/posts"),
        ]);
        if (newsRes.success && newsRes.data) setNews(newsRes.data.data || []);
        if (postsRes.success && postsRes.data) setPosts(postsRes.data.data || []);
      } catch {
        // ignore errors — section just won't render
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return null;
  if (news.length === 0 && posts.length === 0) return null;

  return (
    <section id="live" className="relative px-6 py-24 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-[var(--gold-bright)]">
            Latest Updates
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold gold-text sm:text-4xl">
            Platform News & Updates
          </h2>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* News */}
          {news.length > 0 && (
            <div>
              <h3 className="mb-4 font-display text-sm font-bold uppercase tracking-wider text-[var(--gold-bright)]">
                News
              </h3>
              <div className="space-y-3">
                {news.slice(0, 5).map((n) => (
                  <div key={n.id} className="panel-glass rounded-xl p-5">
                    <p className="text-sm font-medium text-[var(--foreground)]">{n.title}</p>
                    <p className="mt-1 text-xs text-[#8a9a8a] line-clamp-2">{n.content}</p>
                    <p className="mt-2 text-[10px] text-[#5a6a5a]">
                      {new Date(n.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Posts */}
          {posts.length > 0 && (
            <div>
              <h3 className="mb-4 font-display text-sm font-bold uppercase tracking-wider text-[var(--gold-bright)]">
                Updates
              </h3>
              <div className="space-y-3">
                {posts.slice(0, 5).map((p) => (
                  <div key={p.id} className="panel-glass rounded-xl p-5">
                    <p className="text-sm font-medium text-[var(--foreground)]">{p.title}</p>
                    <p className="mt-1 text-xs text-[#8a9a8a] line-clamp-2">{p.description}</p>
                    <p className="mt-2 text-[10px] text-[#5a6a5a]">
                      {new Date(p.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
