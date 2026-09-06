import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LuSearch, LuCornerDownLeft } from "react-icons/lu";
import { CONTENT_TYPE_CONFIG } from "../lib/contentTypes";
import type { Content } from "../hooks/useContent";
import { useLockBodyScroll } from "../hooks/useLockBodyScroll";
import { useFocusTrap } from "../hooks/useFocusTrap";

export interface Command {
  id: string;
  label: string;
  icon: React.ReactNode;
  hint?: string;
  keywords?: string;
  run: () => void;
}

interface Props {
  open: boolean;
  onClose: () => void;
  commands: Command[];
  contents: Content[];
}

export const CommandPalette = ({ open, onClose, commands, contents }: Props) => {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useLockBodyScroll(open);
  const trapRef = useFocusTrap<HTMLDivElement>(open);

  useEffect(() => {
    if (open) {
      setQuery("");
      setActive(0);
      setTimeout(() => inputRef.current?.focus(), 40);
    }
  }, [open]);

  const q = query.trim().toLowerCase();

  const filteredCommands = useMemo(
    () => commands.filter((c) => !q || (c.label + " " + (c.keywords ?? "")).toLowerCase().includes(q)),
    [commands, q]
  );

  const filteredContent = useMemo(() => {
    if (!q) return [];
    return contents
      .filter((c) => (c.title + " " + c.link + " " + (c.tags ?? []).join(" ")).toLowerCase().includes(q))
      .slice(0, 6);
  }, [contents, q]);

  // Flat list for keyboard navigation
  const items = useMemo(
    () => [
      ...filteredCommands.map((c) => ({ type: "command" as const, cmd: c })),
      ...filteredContent.map((c) => ({ type: "content" as const, content: c })),
    ],
    [filteredCommands, filteredContent]
  );

  useEffect(() => { setActive(0); }, [query]);

  const exec = (i: number) => {
    const item = items[i];
    if (!item) return;
    if (item.type === "command") item.cmd.run();
    else window.open(item.content.link, "_blank", "noopener,noreferrer");
    onClose();
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => Math.min(a + 1, items.length - 1)); }
      else if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
      else if (e.key === "Enter") { e.preventDefault(); exec(active); }
      else if (e.key === "Escape") { e.preventDefault(); onClose(); }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
    // Listener is rebuilt whenever items/active change, so it always closes
    // over the latest exec/onClose; adding them would needlessly re-subscribe.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, items, active]);

  useEffect(() => {
    listRef.current?.querySelector<HTMLElement>(`[data-idx="${active}"]`)?.scrollIntoView({ block: "nearest" });
  }, [active]);

  let idx = -1;

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[80] flex items-start justify-center p-4 pt-[12vh]" role="dialog" aria-modal="true" aria-label="Command palette">
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }} onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            ref={trapRef}
            initial={{ opacity: 0, scale: 0.97, y: -8 }} animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: -8 }} transition={{ duration: 0.18 }}
            className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-border bg-elevated shadow-2xl"
          >
            <div className="flex items-center gap-3 border-b border-border px-4">
              <LuSearch className="text-subtle" size={18} />
              <input
                ref={inputRef} value={query} onChange={(e) => setQuery(e.target.value)}
                placeholder="Type a command or search…"
                className="w-full bg-transparent py-4 text-sm text-fg placeholder:text-subtle focus:outline-none"
              />
              <kbd className="hidden rounded border border-border bg-surface-2 px-1.5 py-0.5 text-[10px] font-medium text-subtle sm:block">ESC</kbd>
            </div>

            <div ref={listRef} className="scrollbar-hide max-h-[55vh] overflow-y-auto p-2">
              {items.length === 0 && (
                <p className="px-3 py-8 text-center text-sm text-subtle">No matches found</p>
              )}

              {filteredCommands.length > 0 && (
                <p className="px-3 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-widest text-subtle">Actions</p>
              )}
              {filteredCommands.map((c) => {
                idx++;
                const i = idx;
                return (
                  <button key={c.id} data-idx={i} onMouseEnter={() => setActive(i)} onClick={() => exec(i)}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-colors ${active === i ? "bg-accent-soft text-accent" : "text-fg hover:bg-surface-2"}`}>
                    <span className={active === i ? "text-accent" : "text-subtle"}>{c.icon}</span>
                    <span className="flex-1">{c.label}</span>
                    {c.hint && <span className="text-[11px] text-subtle">{c.hint}</span>}
                    {active === i && <LuCornerDownLeft size={13} className="text-accent" />}
                  </button>
                );
              })}

              {filteredContent.length > 0 && (
                <p className="px-3 pb-1 pt-3 text-[10px] font-semibold uppercase tracking-widest text-subtle">Saved content</p>
              )}
              {filteredContent.map((c) => {
                idx++;
                const i = idx;
                const cfg = CONTENT_TYPE_CONFIG[c.type] ?? CONTENT_TYPE_CONFIG.other;
                const Icon = cfg.icon;
                return (
                  <button key={c._id} data-idx={i} onMouseEnter={() => setActive(i)} onClick={() => exec(i)}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-colors ${active === i ? "bg-accent-soft" : "hover:bg-surface-2"}`}>
                    <span className={cfg.accentColor}><Icon size={15} /></span>
                    <span className="min-w-0 flex-1 truncate text-fg">{c.title}</span>
                    <span className="text-[11px] text-subtle">Open</span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
