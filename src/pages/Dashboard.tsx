import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LuPlus, LuShare2, LuMenu, LuSearch, LuSparkles, LuMessageSquare, LuX,
  LuArrowUpDown, LuCheck, LuTrash2, LuListChecks, LuCommand, LuLibrary,
} from "react-icons/lu";
import { toast } from "sonner";

import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { CONTENT_TYPE_CONFIG } from "../lib/contentTypes";
import { Logo } from "../components/Logo";
import { CreateEditContentModal } from "../components/CreateEditContentModal";
import { AiSearchPanel } from "../components/AiSearchPanel";
import { Sidebar, type Filter } from "../components/Sidebar";
import { ChatPanel } from "../components/ChatPanel";
import { CommandPalette, type Command } from "../components/CommandPalette";
import { ViewToggle } from "../components/ViewToggle";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { EmptyState } from "../components/EmptyState";
import { useContent, type Content } from "../hooks/useContent";
import { useAuth } from "../context/AuthContext";
import api, { errMessage } from "../lib/api";

type Sort = "recent" | "oldest" | "title" | "favorites";
const SORT_LABELS: Record<Sort, string> = {
  recent: "Newest first",
  oldest: "Oldest first",
  title: "Title (A–Z)",
  favorites: "Favorites first",
};

function Dashboard() {
  const { contents, setContents, refresh, isLoading } = useContent();
  const { user } = useAuth();

  const [filter, setFilter] = useState<Filter>({ kind: "all" });
  const [view, setView] = useState<"grid" | "list">(() => (localStorage.getItem("cluttr-view") as "grid" | "list") || "grid");
  const [sort, setSort] = useState<Sort>("recent");
  const [text, setText] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Content | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);

  const [selectMode, setSelectMode] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [confirm, setConfirm] = useState<{ target: Content | "bulk" } | null>(null);
  const [deleting, setDeleting] = useState(false);

  // AI search
  const [aiQuery, setAiQuery] = useState("");
  const [aiSummary, setAiSummary] = useState("");
  const [aiMatchedIds, setAiMatchedIds] = useState<string[] | null>(null);
  const [isAiSearching, setIsAiSearching] = useState(false);

  useEffect(() => { localStorage.setItem("cluttr-view", view); }, [view]);

  // ── ⌘K / Ctrl+K command palette ──
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // ── Derived: counts, collections, tags ──
  const counts = useMemo(() => {
    const byType: Record<string, number> = {};
    let favorites = 0;
    for (const c of contents) {
      byType[c.type] = (byType[c.type] || 0) + 1;
      if (c.favorite) favorites++;
    }
    return { total: contents.length, favorites, byType };
  }, [contents]);

  const collections = useMemo(() => {
    const map = new Map<string, number>();
    for (const c of contents) if (c.collectionName) map.set(c.collectionName, (map.get(c.collectionName) || 0) + 1);
    return [...map.entries()].map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count);
  }, [contents]);

  const tags = useMemo(() => {
    const map = new Map<string, number>();
    for (const c of contents) for (const t of c.tags ?? []) map.set(t, (map.get(t) || 0) + 1);
    return [...map.entries()].map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count).slice(0, 24);
  }, [contents]);

  const tagSuggestions = useMemo(() => tags.map((t) => t.name), [tags]);
  const collectionSuggestions = useMemo(() => collections.map((c) => c.name), [collections]);

  // ── Derived: filtered + sorted list ──
  const filtered = useMemo(() => {
    let list = [...contents];
    if (filter.kind === "favorites") list = list.filter((c) => c.favorite);
    else if (filter.kind === "type") list = list.filter((c) => c.type === filter.value);
    else if (filter.kind === "collection") list = list.filter((c) => c.collectionName === filter.value);
    else if (filter.kind === "tag") list = list.filter((c) => (c.tags ?? []).includes(filter.value));

    const q = text.trim().toLowerCase();
    if (q) {
      list = list.filter((c) =>
        `${c.title} ${c.link} ${(c.tags ?? []).join(" ")} ${c.collectionName ?? ""}`.toLowerCase().includes(q)
      );
    }
    if (aiMatchedIds !== null) list = list.filter((c) => aiMatchedIds.includes(c._id));

    const ts = (c: Content) => new Date(c.createdAt ?? 0).getTime();
    if (sort === "recent") list.sort((a, b) => ts(b) - ts(a));
    else if (sort === "oldest") list.sort((a, b) => ts(a) - ts(b));
    else if (sort === "title") list.sort((a, b) => a.title.localeCompare(b.title));
    else if (sort === "favorites") list.sort((a, b) => Number(!!b.favorite) - Number(!!a.favorite) || ts(b) - ts(a));
    return list;
  }, [contents, filter, text, aiMatchedIds, sort]);

  // ── Actions ──
  const openAdd = useCallback(() => { setEditing(null); setModalOpen(true); }, []);
  const openEdit = useCallback((c: Content) => { setEditing(c); setModalOpen(true); }, []);

  const toggleFavorite = useCallback(async (c: Content) => {
    const next = !c.favorite;
    setContents((prev) => prev.map((x) => (x._id === c._id ? { ...x, favorite: next } : x)));
    try {
      await api.put(`/api/v1/content/${c._id}`, { favorite: next });
    } catch (err) {
      setContents((prev) => prev.map((x) => (x._id === c._id ? { ...x, favorite: !next } : x)));
      toast.error(errMessage(err, "Couldn't update favorite"));
    }
  }, [setContents]);

  const doDelete = async () => {
    if (!confirm || deleting) return;
    setDeleting(true);
    try {
      if (confirm.target === "bulk") {
        const ids = [...selected];
        await api.post("/api/v1/content/bulk-delete", { ids });
        setContents((prev) => prev.filter((c) => !selected.has(c._id)));
        toast.success(`Deleted ${ids.length} item${ids.length === 1 ? "" : "s"}`);
        setSelected(new Set());
        setSelectMode(false);
      } else {
        const id = confirm.target._id;
        await api.delete(`/api/v1/content/${id}`);
        setContents((prev) => prev.filter((c) => c._id !== id));
        toast.success("Deleted");
      }
    } catch (err) {
      toast.error(errMessage(err, "Couldn't delete"));
      refresh();
    } finally {
      setDeleting(false);
      setConfirm(null);
    }
  };

  const handleShare = async () => {
    try {
      const res = await api.post("/api/v1/brain/share", { share: true });
      const url = `${window.location.origin}/share/${res.data.hash}`;
      await navigator.clipboard.writeText(url);
      toast.success("Public link copied to clipboard");
    } catch (err) {
      toast.error(errMessage(err, "Couldn't create share link"));
    }
  };

  const aiReqId = useRef(0);
  const runAiSearch = async (query: string) => {
    const q = query.trim();
    if (!q || isAiSearching) return;
    const reqId = ++aiReqId.current;
    setAiQuery(q);
    setIsAiSearching(true);
    try {
      const res = await api.post("/api/v1/ai/search", { query: q });
      if (reqId !== aiReqId.current) return; // a newer search superseded this one
      setAiMatchedIds(res.data.matchedIds);
      setAiSummary(res.data.summary);
    } catch (err) {
      if (reqId === aiReqId.current) toast.error(errMessage(err, "AI search failed"));
    } finally {
      if (reqId === aiReqId.current) setIsAiSearching(false);
    }
  };

  const clearAi = () => { setAiMatchedIds(null); setAiSummary(""); setAiQuery(""); };

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // ── Command palette commands ──
  const commands: Command[] = useMemo(() => [
    { id: "add", label: "Add content", icon: <LuPlus size={16} />, hint: "N", keywords: "new save link", run: openAdd },
    { id: "chat", label: "Chat with your brain", icon: <LuMessageSquare size={16} />, keywords: "ai ask", run: () => setChatOpen(true) },
    { id: "share", label: "Share my brain", icon: <LuShare2 size={16} />, keywords: "public link", run: handleShare },
    { id: "all", label: "Go to: All content", icon: <LuLibrary size={16} />, run: () => setFilter({ kind: "all" }) },
    { id: "grid", label: "Switch to grid view", icon: <LuArrowUpDown size={16} />, run: () => setView("grid") },
    { id: "list", label: "Switch to list view", icon: <LuArrowUpDown size={16} />, run: () => setView("list") },
  ], [openAdd]);

  const isFiltering = filter.kind !== "all" || text.trim() || aiMatchedIds !== null;

  const filterLabel = () => {
    if (filter.kind === "favorites") return "Favorites";
    if (filter.kind === "type") return CONTENT_TYPE_CONFIG[filter.value]?.label ?? "Filtered";
    if (filter.kind === "collection") return filter.value;
    if (filter.kind === "tag") return `#${filter.value}`;
    return "Your library";
  };

  return (
    <div className="flex min-h-screen">
      <div className="ambient" />

      <Sidebar
        filter={filter}
        onFilterChange={(f) => { setFilter(f); clearAi(); }}
        counts={counts}
        collections={collections}
        tags={tags}
        mobileOpen={sidebarOpen}
        onMobileClose={() => setSidebarOpen(false)}
      />

      <main className="relative z-10 flex-1 p-4 sm:p-6 lg:ml-72 lg:p-8">
        {/* Mobile top bar */}
        <div className="mb-5 flex items-center justify-between lg:hidden">
          <button onClick={() => setSidebarOpen(true)} aria-label="Open menu"
            className="rounded-xl p-2.5 text-muted transition-colors hover:bg-surface-2 hover:text-fg">
            <LuMenu size={20} />
          </button>
          <Logo />
          <div className="flex gap-1">
            <button onClick={() => setChatOpen(true)} aria-label="Chat with your brain"
              className="rounded-xl p-2.5 text-muted transition-colors hover:bg-surface-2 hover:text-fg">
              <LuSparkles size={18} />
            </button>
            <button onClick={openAdd} aria-label="Add content"
              className="rounded-xl bg-accent p-2.5 text-accent-fg">
              <LuPlus size={18} />
            </button>
          </div>
        </div>

        {/* Header */}
        <header className="mb-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <motion.h1 initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                className="text-2xl font-bold tracking-tight sm:text-3xl">
                {filter.kind === "all" ? <>Welcome back, <span className="gradient-text">{user?.username}</span></> : filterLabel()}
              </motion.h1>
              <p className="mt-1 text-sm text-muted">
                {filtered.length} {filtered.length === 1 ? "item" : "items"}
                {isFiltering ? " shown" : " in your second brain"}
              </p>
            </div>

            <div className="hidden items-center gap-2 lg:flex">
              <button onClick={() => setPaletteOpen(true)}
                className="flex items-center gap-2 rounded-xl border border-border bg-surface-2 px-3 py-2 text-sm text-subtle transition-colors hover:text-fg">
                <LuCommand size={14} /> <span className="text-xs">K</span>
              </button>
              <Button variant="secondary" text="Chat" startIcon={<LuSparkles size={15} />} onClick={() => setChatOpen(true)} />
              <Button variant="secondary" text="Share" startIcon={<LuShare2 size={15} />} onClick={handleShare} />
              <Button variant="primary" text="Add content" startIcon={<LuPlus size={16} />} onClick={openAdd} />
            </div>
          </div>

          {/* Toolbar */}
          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <LuSearch className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-subtle" size={16} />
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && text.trim()) runAiSearch(text); }}
                placeholder="Search instantly, or press Enter to ask AI…"
                className="w-full rounded-xl border border-border bg-surface-2 py-2.5 pl-10 pr-28 text-sm text-fg placeholder:text-subtle focus:border-accent/50 focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1">
                {text && (
                  <button onClick={() => setText("")} aria-label="Clear search"
                    className="rounded-md p-1 text-subtle hover:text-fg"><LuX size={14} /></button>
                )}
                <button
                  onClick={() => runAiSearch(text)}
                  disabled={!text.trim() || isAiSearching}
                  className="flex items-center gap-1.5 rounded-lg bg-accent px-2.5 py-1.5 text-xs font-semibold text-accent-fg transition-all hover:bg-accent-hover disabled:opacity-40"
                >
                  {isAiSearching
                    ? <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    : <LuSparkles size={13} />}
                  Ask AI
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Sort */}
              <div className="relative">
                <button onClick={() => setSortOpen((o) => !o)} aria-haspopup="menu" aria-expanded={sortOpen}
                  className="flex items-center gap-2 rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm text-muted transition-colors hover:text-fg">
                  <LuArrowUpDown size={15} /> <span className="hidden sm:inline">{SORT_LABELS[sort]}</span>
                </button>
                <AnimatePresence>
                  {sortOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setSortOpen(false)} />
                      <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 z-20 mt-2 w-44 rounded-xl border border-border bg-elevated p-1.5 shadow-2xl">
                        {(Object.keys(SORT_LABELS) as Sort[]).map((s) => (
                          <button key={s} onClick={() => { setSort(s); setSortOpen(false); }}
                            className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors ${sort === s ? "bg-accent-soft text-accent" : "text-muted hover:bg-surface-2 hover:text-fg"}`}>
                            {SORT_LABELS[s]} {sort === s && <LuCheck size={14} />}
                          </button>
                        ))}
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>

              <ViewToggle view={view} onChange={setView} />

              <button onClick={() => { setSelectMode((s) => !s); setSelected(new Set()); }}
                aria-pressed={selectMode} title="Select multiple"
                className={`grid h-9 w-9 place-items-center rounded-lg border transition-colors ${selectMode ? "border-accent bg-accent-soft text-accent" : "border-border bg-surface-2 text-muted hover:text-fg"}`}>
                <LuListChecks size={16} />
              </button>
            </div>
          </div>
        </header>

        {/* AI summary */}
        <AnimatePresence>
          {aiSummary && aiMatchedIds !== null && (
            <AiSearchPanel summary={aiSummary} matchCount={filtered.length} query={aiQuery} onClear={clearAi} />
          )}
        </AnimatePresence>

        {/* Content */}
        {isLoading ? (
          <div className={view === "grid"
            ? "grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"
            : "space-y-2"}>
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className={`skeleton rounded-2xl ${view === "grid" ? "h-64" : "h-14"}`} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={aiMatchedIds !== null || text ? <LuSearch /> : <LuLibrary />}
            title={aiMatchedIds !== null || text ? "No matches" : "Nothing here yet"}
            description={aiMatchedIds !== null || text
              ? "Try different keywords or clear your filters."
              : "Save your first link and start building your second brain."}
            action={aiMatchedIds !== null || text
              ? <Button variant="secondary" text="Clear filters" onClick={() => { setText(""); clearAi(); setFilter({ kind: "all" }); }} />
              : <Button variant="primary" text="Add content" startIcon={<LuPlus size={16} />} onClick={openAdd} />}
          />
        ) : view === "grid" ? (
          <motion.div layout className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            <AnimatePresence mode="popLayout">
              {filtered.map((c) => (
                <motion.div key={c._id} layout initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96 }} transition={{ duration: 0.2 }}>
                  <Card content={c} view="grid"
                    onDelete={(t) => setConfirm({ target: t })}
                    onEdit={openEdit}
                    onToggleFavorite={toggleFavorite}
                    selectable={selectMode}
                    selected={selected.has(c._id)}
                    onToggleSelect={toggleSelect}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <div className="space-y-2">
            <AnimatePresence mode="popLayout">
              {filtered.map((c) => (
                <motion.div key={c._id} layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }} transition={{ duration: 0.18 }}>
                  <Card content={c} view="list"
                    onDelete={(t) => setConfirm({ target: t })}
                    onEdit={openEdit}
                    onToggleFavorite={toggleFavorite}
                    selectable={selectMode}
                    selected={selected.has(c._id)}
                    onToggleSelect={toggleSelect}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </main>

      {/* Bulk action bar */}
      <AnimatePresence>
        {selectMode && selected.size > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 left-1/2 z-30 flex -translate-x-1/2 items-center gap-3 rounded-2xl border border-border bg-elevated px-4 py-3 shadow-2xl"
          >
            <span className="text-sm font-medium text-fg">{selected.size} selected</span>
            <div className="h-5 w-px bg-border" />
            <Button variant="danger" size="sm" text="Delete" startIcon={<LuTrash2 size={14} />}
              onClick={() => setConfirm({ target: "bulk" })} />
            <Button variant="ghost" size="sm" text="Cancel" onClick={() => { setSelectMode(false); setSelected(new Set()); }} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modals & overlays */}
      <CreateEditContentModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSaved={refresh}
        editing={editing}
        tagSuggestions={tagSuggestions}
        collectionSuggestions={collectionSuggestions}
      />
      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} commands={commands} contents={contents} />
      <ChatPanel open={chatOpen} onClose={() => setChatOpen(false)} contents={contents} />
      <ConfirmDialog
        open={!!confirm}
        title={confirm?.target === "bulk" ? `Delete ${selected.size} items?` : "Delete this item?"}
        description="This can't be undone."
        confirmText="Delete"
        isLoading={deleting}
        onConfirm={doDelete}
        onClose={() => setConfirm(null)}
      />
    </div>
  );
}

export default Dashboard;
