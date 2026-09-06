import { SidebarItem } from "./SidebarItem";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";
import {
  LuLibrary, LuStar, LuLogOut, LuX, LuFolder, LuTag, LuLayers,
} from "react-icons/lu";
import { CONTENT_TYPE_CONFIG } from "../lib/contentTypes";
import type { ContentType } from "../hooks/useContent";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { useLockBodyScroll } from "../hooks/useLockBodyScroll";
import { useFocusTrap } from "../hooks/useFocusTrap";

export type Filter =
  | { kind: "all" }
  | { kind: "favorites" }
  | { kind: "type"; value: ContentType }
  | { kind: "collection"; value: string }
  | { kind: "tag"; value: string };

interface SidebarProps {
  filter: Filter;
  onFilterChange: (f: Filter) => void;
  counts: { total: number; favorites: number; byType: Record<string, number> };
  collections: { name: string; count: number }[];
  tags: { name: string; count: number }[];
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export const Sidebar = ({
  filter, onFilterChange, counts, collections, tags, mobileOpen, onMobileClose,
}: SidebarProps) => {
  const { logout, user } = useAuth();
  useLockBodyScroll(!!mobileOpen);
  const trapRef = useFocusTrap<HTMLDivElement>(!!mobileOpen);

  const handleLogout = () => {
    logout();
    toast("Signed out");
  };

  const pick = (f: Filter) => {
    onFilterChange(f);
    onMobileClose?.();
  };

  const presentTypes = (Object.keys(counts.byType) as ContentType[])
    .filter((t) => counts.byType[t] > 0)
    .sort((a, b) => counts.byType[b] - counts.byType[a]);

  const SectionLabel = ({ icon, text }: { icon: React.ReactNode; text: string }) => (
    <div className="flex items-center gap-2 px-7 pb-1.5 pt-4">
      <span className="text-subtle">{icon}</span>
      <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-subtle">{text}</span>
    </div>
  );

  const content = (
    <>
      <div className="flex flex-shrink-0 items-center justify-between px-6 pb-5 pt-6">
        <Logo />
        {onMobileClose && (
          <button onClick={onMobileClose} aria-label="Close menu"
            className="rounded-xl p-2 text-muted transition-colors hover:bg-surface-2 hover:text-fg lg:hidden">
            <LuX size={18} />
          </button>
        )}
      </div>

      <div className="scrollbar-hide flex-1 overflow-y-auto pb-2">
        {/* Library */}
        <div className="space-y-0.5">
          <SidebarItem text="All content" icon={<LuLibrary />} count={counts.total}
            active={filter.kind === "all"} onClick={() => pick({ kind: "all" })} />
          <SidebarItem text="Favorites" icon={<LuStar />} count={counts.favorites}
            active={filter.kind === "favorites"} onClick={() => pick({ kind: "favorites" })} />
        </div>

        {/* Collections */}
        {collections.length > 0 && (
          <>
            <SectionLabel icon={<LuFolder size={11} />} text="Collections" />
            <div className="space-y-0.5">
              {collections.map((c) => (
                <SidebarItem key={c.name} text={c.name} icon={<LuLayers />} count={c.count}
                  active={filter.kind === "collection" && filter.value === c.name}
                  onClick={() => pick({ kind: "collection", value: c.name })} />
              ))}
            </div>
          </>
        )}

        {/* Types */}
        {presentTypes.length > 0 && (
          <>
            <SectionLabel icon={<LuLayers size={11} />} text="Types" />
            <div className="space-y-0.5">
              {presentTypes.map((t) => {
                const cfg = CONTENT_TYPE_CONFIG[t];
                const Icon = cfg.icon;
                return (
                  <SidebarItem key={t} text={cfg.label} icon={<Icon />} count={counts.byType[t]}
                    active={filter.kind === "type" && filter.value === t}
                    onClick={() => pick({ kind: "type", value: t })} />
                );
              })}
            </div>
          </>
        )}

        {/* Tags */}
        {tags.length > 0 && (
          <>
            <SectionLabel icon={<LuTag size={11} />} text="Tags" />
            <div className="flex flex-wrap gap-1.5 px-6 pt-1">
              {tags.map((t) => {
                const active = filter.kind === "tag" && filter.value === t.name;
                return (
                  <button key={t.name} type="button" onClick={() => pick({ kind: "tag", value: t.name })}
                    className={`rounded-md px-2 py-1 text-xs font-medium transition-colors ${active ? "bg-accent-soft text-accent" : "bg-surface-2 text-muted hover:text-fg"}`}>
                    #{t.name}
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Footer */}
      <div className="flex-shrink-0 border-t border-border">
        {user && (
          <div className="flex items-center gap-3 px-5 py-3">
            <div className="grid h-9 w-9 flex-shrink-0 place-items-center rounded-lg bg-accent text-sm font-bold uppercase text-accent-fg">
              {user.username.charAt(0)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-fg">{user.username}</p>
              <p className="text-[11px] text-subtle">Second brain</p>
            </div>
            <ThemeToggle />
          </div>
        )}
        <div className="px-3 pb-3">
          <SidebarItem text="Sign out" icon={<LuLogOut />} onClick={handleLogout} />
        </div>
      </div>
    </>
  );

  return (
    <>
      <aside className="fixed left-0 top-0 z-20 hidden h-screen w-72 flex-col border-r border-border bg-surface lg:flex">
        {content}
      </aside>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }} onClick={onMobileClose}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            />
            <motion.aside
              ref={trapRef}
              initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-border bg-surface lg:hidden"
            >
              {content}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
