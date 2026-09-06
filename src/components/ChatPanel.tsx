import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LuX, LuSparkles, LuSend, LuExternalLink } from "react-icons/lu";
import { CONTENT_TYPE_CONFIG } from "../lib/contentTypes";
import api, { errMessage } from "../lib/api";
import type { Content } from "../hooks/useContent";
import { useLockBodyScroll } from "../hooks/useLockBodyScroll";
import { useFocusTrap } from "../hooks/useFocusTrap";

interface Message {
  role: "user" | "assistant";
  content: string;
  sourceIds?: string[];
}

interface Props {
  open: boolean;
  onClose: () => void;
  contents: Content[];
  endpoint?: string;
  extraPayload?: Record<string, unknown>;
}

const SUGGESTIONS = [
  "What did I save about design?",
  "Summarize my reading list",
  "Find that video on React",
  "What topics do I save most?",
];

export const ChatPanel = ({ open, onClose, contents, endpoint = "/api/v1/ai/chat", extraPayload }: Props) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useLockBodyScroll(open);
  const trapRef = useFocusTrap<HTMLDivElement>(open);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 80);
  }, [open]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const send = async (text: string) => {
    const message = text.trim();
    if (!message || loading) return;

    const history = messages.slice(-8).map((m) => ({ role: m.role, content: m.content }));
    setMessages((prev) => [...prev, { role: "user", content: message }]);
    setInput("");
    setLoading(true);
    try {
      const res = await api.post(endpoint, { message, history, ...extraPayload });
      setMessages((prev) => [...prev, { role: "assistant", content: res.data.answer, sourceIds: res.data.sourceIds ?? [] }]);
    } catch (err) {
      setMessages((prev) => [...prev, { role: "assistant", content: errMessage(err, "I couldn't answer that. Please try again.") }]);
    } finally {
      setLoading(false);
    }
  };

  const sourcesFor = (ids?: string[]) =>
    (ids ?? []).map((id) => contents.find((c) => c._id === id)).filter(Boolean) as Content[];

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[75]" role="dialog" aria-modal="true" aria-label="Chat with your brain">
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }} onClick={onClose}
            className="absolute inset-0 bg-black/55 backdrop-blur-sm"
          />
          <motion.div
            ref={trapRef}
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="absolute right-0 top-0 flex h-full w-full flex-col border-l border-border bg-surface sm:max-w-md"
          >
            {/* Header */}
            <div className="flex flex-shrink-0 items-center justify-between border-b border-border px-5 py-4">
              <div className="flex items-center gap-2.5">
                <div className="grid h-9 w-9 place-items-center rounded-xl bg-accent-soft text-accent">
                  <LuSparkles size={17} />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-fg">Chat with your brain</h2>
                  <p className="text-[11px] text-subtle">Answers from your {contents.length} saved item{contents.length === 1 ? "" : "s"}</p>
                </div>
              </div>
              <button onClick={onClose} aria-label="Close chat"
                className="rounded-lg p-2 text-subtle transition-colors hover:bg-surface-2 hover:text-fg">
                <LuX size={18} />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="scrollbar-hide flex-1 space-y-4 overflow-y-auto p-5">
              {messages.length === 0 && (
                <div className="pt-6 text-center">
                  <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-accent-soft text-accent">
                    <LuSparkles size={24} />
                  </div>
                  <p className="text-sm font-medium text-fg">Ask anything about what you've saved</p>
                  <p className="mt-1 text-xs text-subtle">I only know your saved content — and I'll cite my sources.</p>
                  <div className="mt-5 flex flex-col gap-2">
                    {SUGGESTIONS.map((s) => (
                      <button key={s} onClick={() => send(s)}
                        className="rounded-xl border border-border bg-surface-2 px-3 py-2.5 text-left text-sm text-muted transition-colors hover:border-accent/40 hover:text-fg">
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((m, i) => (
                <div key={i} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
                  <div className={`max-w-[85%] ${m.role === "user" ? "" : "w-full"}`}>
                    <div className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                      m.role === "user" ? "bg-accent text-accent-fg" : "border border-border bg-surface-2 text-fg"
                    }`}>
                      {m.content}
                    </div>
                    {m.role === "assistant" && sourcesFor(m.sourceIds).length > 0 && (
                      <div className="mt-2 space-y-1.5">
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-subtle">Sources</p>
                        {sourcesFor(m.sourceIds).map((c) => {
                          const cfg = CONTENT_TYPE_CONFIG[c.type] ?? CONTENT_TYPE_CONFIG.other;
                          const Icon = cfg.icon;
                          return (
                            <a key={c._id} href={c.link} target="_blank" rel="noopener noreferrer"
                              className="group flex items-center gap-2.5 rounded-xl border border-border bg-surface px-3 py-2 transition-colors hover:border-border-strong">
                              <span className={cfg.accentColor}><Icon size={15} /></span>
                              <span className="min-w-0 flex-1 truncate text-xs font-medium text-fg">{c.title}</span>
                              <LuExternalLink size={12} className="text-subtle group-hover:text-accent" />
                            </a>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className="flex items-center gap-1.5 rounded-2xl border border-border bg-surface-2 px-4 py-3">
                    {[0, 1, 2].map((d) => (
                      <span key={d} className="h-1.5 w-1.5 animate-bounce rounded-full bg-subtle"
                        style={{ animationDelay: `${d * 0.15}s` }} />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <form
              onSubmit={(e) => { e.preventDefault(); send(input); }}
              className="flex flex-shrink-0 items-center gap-2 border-t border-border p-4"
            >
              <input
                ref={inputRef} value={input} onChange={(e) => setInput(e.target.value)}
                placeholder="Ask your brain…" disabled={loading}
                className="w-full rounded-xl border border-border bg-surface-2 px-3.5 py-2.5 text-sm text-fg placeholder:text-subtle focus:border-accent/50 focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <button type="submit" disabled={loading || !input.trim()} aria-label="Send message"
                className="grid h-[42px] w-[42px] flex-shrink-0 place-items-center rounded-xl bg-accent text-accent-fg transition-all hover:bg-accent-hover disabled:opacity-40">
                <LuSend size={16} />
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
