import { useState, useEffect, useRef } from "react";
import { LuX, LuLink, LuType, LuChevronDown, LuStar, LuFolder } from "react-icons/lu";
import { Button } from "./Button";
import { TagInput } from "./TagInput";
import api from "../lib/api";
import { errMessage } from "../lib/api";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import type { Content, ContentType } from "../hooks/useContent";
import { CONTENT_TYPE_CONFIG } from "../lib/contentTypes";
import { useLockBodyScroll } from "../hooks/useLockBodyScroll";
import { useFocusTrap } from "../hooks/useFocusTrap";

interface Props {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
  editing?: Content | null;
  tagSuggestions?: string[];
  collectionSuggestions?: string[];
}

const contentTypes: { value: ContentType; label: string; group: string }[] = [
  { value: "youtube", label: "YouTube", group: "Media" },
  { value: "spotify", label: "Spotify", group: "Media" },
  { value: "instagram", label: "Instagram", group: "Media" },
  { value: "pinterest", label: "Pinterest", group: "Media" },
  { value: "twitter", label: "Twitter / X", group: "Social" },
  { value: "reddit", label: "Reddit", group: "Social" },
  { value: "linkedin", label: "LinkedIn", group: "Social" },
  { value: "github", label: "GitHub", group: "Dev" },
  { value: "stackoverflow", label: "Stack Overflow", group: "Dev" },
  { value: "codepen", label: "CodePen", group: "Dev" },
  { value: "figma", label: "Figma", group: "Design" },
  { value: "dribbble", label: "Dribbble", group: "Design" },
  { value: "article", label: "Article / Blog", group: "Knowledge" },
  { value: "document", label: "Document", group: "Knowledge" },
  { value: "notion", label: "Notion", group: "Knowledge" },
  { value: "other", label: "Other Link", group: "General" },
];

function detectType(url: string): ContentType {
  try {
    const { hostname, pathname } = new URL(url);
    const h = hostname.toLowerCase();
    const p = pathname.toLowerCase();
    if (h.includes("youtube.com") || h.includes("youtu.be")) return "youtube";
    if (h.includes("spotify.com")) return "spotify";
    if (h.includes("instagram.com")) return "instagram";
    if (h.includes("pinterest.com") || h.includes("pin.it")) return "pinterest";
    if (h.includes("twitter.com") || h.includes("x.com")) return "twitter";
    if (h.includes("reddit.com")) return "reddit";
    if (h.includes("linkedin.com")) return "linkedin";
    if (h.includes("github.com")) return "github";
    if (h.includes("stackoverflow.com") || h.includes("stackexchange.com")) return "stackoverflow";
    if (h.includes("codepen.io")) return "codepen";
    if (h.includes("figma.com")) return "figma";
    if (h.includes("dribbble.com")) return "dribbble";
    if (h.includes("notion.so") || h.includes("notion.site")) return "notion";
    if (h.includes("docs.google.com") || h.includes("drive.google.com")) return "document";
    if (h.includes("medium.com") || h.includes("dev.to") || h.includes("hashnode.dev") || h.includes("substack.com")) return "article";
    if (p.includes("/blog") || p.includes("/article") || p.includes("/post")) return "article";
  } catch { /* ignore */ }
  return "other";
}

const empty = { title: "", link: "", type: "other" as ContentType, tags: [] as string[], collectionName: "", notes: "", favorite: false };

export const CreateEditContentModal = ({ open, onClose, onSaved, editing, tagSuggestions = [], collectionSuggestions = [] }: Props) => {
  const [form, setForm] = useState(empty);
  const [typeTouched, setTypeTouched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const linkRef = useRef<HTMLInputElement>(null);

  useLockBodyScroll(open);
  const trapRef = useFocusTrap<HTMLDivElement>(open);

  const isEdit = !!editing;

  // Sync form when opening / switching between create & edit
  useEffect(() => {
    if (!open) return;
    if (editing) {
      setForm({
        title: editing.title, link: editing.link, type: editing.type,
        tags: editing.tags ?? [], collectionName: editing.collectionName ?? "",
        notes: editing.notes ?? "", favorite: !!editing.favorite,
      });
      setTypeTouched(true);
    } else {
      setForm(empty);
      setTypeTouched(false);
    }
    setDropdownOpen(false);
    setTimeout(() => linkRef.current?.focus(), 60);
  }, [open, editing]);

  // Escape to close
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (dropdownOpen) setDropdownOpen(false);
      else onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose, dropdownOpen]);

  const handleLinkChange = (val: string) => {
    setForm((f) => ({ ...f, link: val, type: typeTouched ? f.type : (val.length > 8 ? detectType(val) : f.type) }));
  };

  const save = async () => {
    const title = form.title.trim();
    const link = form.link.trim();
    if (!link) return toast.error("Please paste a link");
    if (!title) return toast.error("Please add a title");

    setIsLoading(true);
    try {
      const payload = {
        link, title, type: form.type, tags: form.tags,
        collectionName: form.collectionName.trim(), notes: form.notes.trim(), favorite: form.favorite,
      };
      if (isEdit && editing) {
        await api.put(`/api/v1/content/${editing._id}`, payload);
        toast.success("Changes saved");
      } else {
        await api.post("/api/v1/content", payload);
        toast.success("Saved to your brain");
      }
      onSaved();
      onClose();
    } catch (err) {
      toast.error(errMessage(err, "Couldn't save. Check the URL and try again."));
    } finally {
      setIsLoading(false);
    }
  };

  const selectedConfig = CONTENT_TYPE_CONFIG[form.type];
  const SelectedIcon = selectedConfig.icon;
  const groups = contentTypes.reduce((acc, ct) => {
    (acc[ct.group] ||= []).push(ct);
    return acc;
  }, {} as Record<string, typeof contentTypes>);

  const fieldClass = "w-full rounded-xl border border-border bg-surface-2 px-3.5 py-2.5 text-sm text-fg placeholder:text-subtle transition-all focus:border-accent/50 focus:outline-none focus:ring-2 focus:ring-ring";
  const labelClass = "mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted";

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto p-4 py-8">
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }} onClick={onClose}
            className="fixed inset-0 bg-black/65 backdrop-blur-sm"
          />
          <motion.div
            ref={trapRef}
            role="dialog" aria-modal="true" aria-label={isEdit ? "Edit content" : "Add content"}
            initial={{ opacity: 0, scale: 0.97, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 10 }} transition={{ duration: 0.2 }}
            className="relative my-auto w-full max-w-md overflow-hidden rounded-2xl border border-border bg-elevated shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-border px-6 py-4">
              <div>
                <h2 className="text-base font-bold tracking-tight text-fg">{isEdit ? "Edit content" : "Add content"}</h2>
                <p className="text-xs text-subtle">{isEdit ? "Update the details below" : "Save any link to your second brain"}</p>
              </div>
              <button onClick={onClose} aria-label="Close" className="rounded-lg p-2 text-subtle transition-colors hover:bg-surface-2 hover:text-fg">
                <LuX size={18} />
              </button>
            </div>

            <div className="space-y-4 p-6">
              {/* Link */}
              <div>
                <label className={labelClass} htmlFor="c-link">Link</label>
                <div className="relative">
                  <LuLink className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-subtle" size={15} />
                  <input id="c-link" ref={linkRef} value={form.link}
                    onChange={(e) => handleLinkChange(e.target.value)}
                    placeholder="Paste any URL…" className={`${fieldClass} pl-9`} />
                </div>
                {!isEdit && <p className="ml-1 mt-1 text-[10px] text-subtle">Type is auto-detected from the URL</p>}
              </div>

              {/* Title */}
              <div>
                <label className={labelClass} htmlFor="c-title">Title</label>
                <div className="relative">
                  <LuType className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-subtle" size={15} />
                  <input id="c-title" value={form.title}
                    onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                    placeholder="Give it a name…" className={`${fieldClass} pl-9`} />
                </div>
              </div>

              {/* Type dropdown */}
              <div>
                <label className={labelClass}>Type</label>
                <div className="relative">
                  <button type="button" onClick={() => setDropdownOpen((o) => !o)}
                    aria-haspopup="listbox" aria-expanded={dropdownOpen}
                    className={`flex w-full items-center justify-between rounded-xl border px-3.5 py-2.5 text-sm transition-all ${dropdownOpen ? "border-accent/50 ring-2 ring-ring" : "border-border hover:border-border-strong"} bg-surface-2`}>
                    <span className="flex items-center gap-2.5">
                      <SelectedIcon className={selectedConfig.accentColor} size={16} />
                      <span className="font-medium text-fg">{contentTypes.find((t) => t.value === form.type)?.label}</span>
                    </span>
                    <LuChevronDown className={`text-subtle transition-transform ${dropdownOpen ? "rotate-180" : ""}`} size={15} />
                  </button>

                  <AnimatePresence>
                    {dropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.15 }}
                        className="scrollbar-hide absolute z-20 mt-2 max-h-64 w-full overflow-y-auto rounded-xl border border-border bg-elevated p-1.5 shadow-2xl"
                        role="listbox"
                      >
                        {Object.entries(groups).map(([groupName, items]) => (
                          <div key={groupName}>
                            <p className="px-2.5 pb-1 pt-2 text-[9px] font-semibold uppercase tracking-widest text-subtle">{groupName}</p>
                            {items.map((ct) => {
                              const cfg = CONTENT_TYPE_CONFIG[ct.value];
                              const CtIcon = cfg.icon;
                              const active = form.type === ct.value;
                              return (
                                <button key={ct.value} type="button" role="option" aria-selected={active}
                                  onClick={() => { setForm((f) => ({ ...f, type: ct.value })); setTypeTouched(true); setDropdownOpen(false); }}
                                  className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition-colors ${active ? "bg-accent-soft text-accent" : "text-muted hover:bg-surface-2 hover:text-fg"}`}>
                                  <CtIcon className={active ? cfg.accentColor : "text-subtle"} size={15} />
                                  {ct.label}
                                  {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-accent" />}
                                </button>
                              );
                            })}
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className={labelClass}>Tags <span className="font-normal normal-case text-subtle">(optional)</span></label>
                <TagInput value={form.tags} onChange={(tags) => setForm((f) => ({ ...f, tags }))} suggestions={tagSuggestions} />
              </div>

              {/* Collection + Favorite */}
              <div className="flex items-end gap-3">
                <div className="flex-1">
                  <label className={labelClass} htmlFor="c-collection">Collection <span className="font-normal normal-case text-subtle">(optional)</span></label>
                  <div className="relative">
                    <LuFolder className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-subtle" size={15} />
                    <input id="c-collection" list="collection-suggestions" value={form.collectionName}
                      onChange={(e) => setForm((f) => ({ ...f, collectionName: e.target.value }))}
                      placeholder="e.g. Reading list" className={`${fieldClass} pl-9`} />
                    <datalist id="collection-suggestions">
                      {collectionSuggestions.map((c) => <option key={c} value={c} />)}
                    </datalist>
                  </div>
                </div>
                <button type="button" onClick={() => setForm((f) => ({ ...f, favorite: !f.favorite }))}
                  aria-pressed={form.favorite} title="Toggle favorite"
                  className={`grid h-[42px] w-[42px] flex-shrink-0 place-items-center rounded-xl border transition-all ${form.favorite ? "border-amber-400/40 bg-amber-400/10 text-amber-400" : "border-border bg-surface-2 text-subtle hover:text-fg"}`}>
                  <LuStar className={form.favorite ? "fill-current" : ""} size={17} />
                </button>
              </div>

              <div className="pt-1">
                <Button variant="primary" fullWidth text={isEdit ? "Save changes" : "Save to brain"} onClick={save} isLoading={isLoading} />
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
