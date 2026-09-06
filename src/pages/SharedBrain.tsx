import { useParams, Link } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LuSearch, LuSparkles, LuX, LuMessageSquare, LuCompass } from "react-icons/lu";
import { toast } from "sonner";

import api, { errMessage } from "../lib/api";
import { Card } from "../components/Card";
import { Logo } from "../components/Logo";
import { ThemeToggle } from "../components/ThemeToggle";
import { AiSearchPanel } from "../components/AiSearchPanel";
import { ChatPanel } from "../components/ChatPanel";
import { EmptyState } from "../components/EmptyState";
import { Button } from "../components/Button";
import type { Content } from "../hooks/useContent";

export const SharedBrain = () => {
  const { hash } = useParams<{ hash: string }>();
  const [contents, setContents] = useState<Content[]>([]);
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  const [text, setText] = useState("");
  const [chatOpen, setChatOpen] = useState(false);
  const [aiQuery, setAiQuery] = useState("");
  const [aiSummary, setAiSummary] = useState("");
  const [aiMatchedIds, setAiMatchedIds] = useState<string[] | null>(null);
  const [isAiSearching, setIsAiSearching] = useState(false);

  useEffect(() => {
    if (!hash) return;
    (async () => {
      try {
        const res = await api.get(`/api/v1/brain/${hash}`);
        setContents(res.data.content ?? []);
        setUsername(res.data.username ?? "");
      } catch {
        setError(true);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [hash]);

  const filtered = useMemo(() => {
    let list = contents;
    const q = text.trim().toLowerCase();
    if (q) list = list.filter((c) => `${c.title} ${c.link} ${(c.tags ?? []).join(" ")}`.toLowerCase().includes(q));
    if (aiMatchedIds !== null) list = list.filter((c) => aiMatchedIds.includes(c._id));
    return list;
  }, [contents, text, aiMatchedIds]);

  const runAiSearch = async (query: string) => {
    const q = query.trim();
    if (!q || isAiSearching) return;
    setAiQuery(q);
    setIsAiSearching(true);
    try {
      const res = await api.post("/api/v1/ai/search-public", { query: q, hash });
      setAiMatchedIds(res.data.matchedIds);
      setAiSummary(res.data.summary);
    } catch (err) {
      toast.error(errMessage(err, "AI search failed"));
    } finally {
      setIsAiSearching(false);
    }
  };

  const clearAi = () => { setAiMatchedIds(null); setAiSummary(""); setAiQuery(""); };

  if (isLoading) {
    return (
      <div className="grid min-h-screen place-items-center">
        <div className="ambient" />
        <div className="relative z-10 flex flex-col items-center gap-4">
          <div className="grid h-12 w-12 animate-pulse place-items-center rounded-2xl bg-accent-soft">
            <LuCompass className="animate-[spin-slow_3s_linear_infinite] text-accent" size={22} />
          </div>
          <p className="text-sm text-subtle">Loading shared brain…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="grid min-h-screen place-items-center p-4">
        <div className="ambient" />
        <div className="relative z-10">
          <EmptyState
            icon={<LuCompass />}
            title="Brain not found"
            description="This shared link may have expired or never existed."
            action={<Link to="/"><Button variant="primary" text="Go to Cluttr" /></Link>}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="ambient" />

      <nav className="glass sticky top-0 z-20 border-b border-border">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <Link to="/" className="transition-opacity hover:opacity-80"><Logo /></Link>
          <div className="flex items-center gap-2">
            <span className="rounded-full border border-border bg-surface-2 px-3 py-1.5 text-xs text-muted">
              <span className="hidden sm:inline">Viewing </span>
              <span className="font-medium text-accent">@{username}</span>
            </span>
            <ThemeToggle />
          </div>
        </div>
      </nav>

      <main className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
        <motion.header initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 flex-shrink-0 place-items-center rounded-xl bg-accent text-base font-bold uppercase text-accent-fg">
              {username.charAt(0)}
            </div>
            <div className="min-w-0">
              <h1 className="truncate text-xl font-bold tracking-tight sm:text-2xl">{username}'s collection</h1>
              <p className="text-sm text-muted">{contents.length} curated item{contents.length === 1 ? "" : "s"} · shared via Cluttr</p>
            </div>
          </div>

          {/* Search + chat */}
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <LuSearch className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-subtle" size={16} />
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && text.trim()) runAiSearch(text); }}
                placeholder="Search, or press Enter to ask AI…"
                className="w-full rounded-xl border border-border bg-surface-2 py-2.5 pl-10 pr-28 text-sm text-fg placeholder:text-subtle focus:border-accent/50 focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1">
                {text && (
                  <button onClick={() => setText("")} aria-label="Clear search" className="rounded-md p-1 text-subtle hover:text-fg"><LuX size={14} /></button>
                )}
                <button onClick={() => runAiSearch(text)} disabled={!text.trim() || isAiSearching}
                  className="flex items-center gap-1.5 rounded-lg bg-accent px-2.5 py-1.5 text-xs font-semibold text-accent-fg transition-all hover:bg-accent-hover disabled:opacity-40">
                  {isAiSearching ? <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" /> : <LuSparkles size={13} />}
                  Ask AI
                </button>
              </div>
            </div>
            <Button variant="secondary" text="Chat" startIcon={<LuMessageSquare size={15} />} onClick={() => setChatOpen(true)} />
          </div>
        </motion.header>

        <AnimatePresence>
          {aiSummary && aiMatchedIds !== null && (
            <AiSearchPanel summary={aiSummary} matchCount={filtered.length} query={aiQuery} onClear={clearAi} />
          )}
        </AnimatePresence>

        {filtered.length === 0 ? (
          <EmptyState
            icon={<LuSearch />}
            title={text || aiMatchedIds !== null ? "No matches" : "Nothing shared yet"}
            description={text || aiMatchedIds !== null ? "Try different keywords." : "This brain has no public content."}
            action={(text || aiMatchedIds !== null) && <Button variant="secondary" text="Clear" onClick={() => { setText(""); clearAi(); }} />}
          />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((c, i) => (
              <motion.div key={c._id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(i * 0.03, 0.3) }}>
                <Card content={c} view="grid" />
              </motion.div>
            ))}
          </div>
        )}
      </main>

      <ChatPanel open={chatOpen} onClose={() => setChatOpen(false)} contents={contents}
        endpoint="/api/v1/ai/chat-public" extraPayload={{ hash }} />
    </div>
  );
};
