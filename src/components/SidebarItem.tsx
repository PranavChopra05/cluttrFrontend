import type { ReactElement } from "react";

interface SidebarItemProps {
  text: string;
  icon: ReactElement;
  active?: boolean;
  count?: number;
  onClick: () => void;
}

export const SidebarItem = ({ text, icon, active, count, onClick }: SidebarItemProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={`group relative mx-3 my-0.5 flex w-[calc(100%-1.5rem)] items-center gap-3 rounded-xl px-3.5 py-2.5 text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring
        ${active
          ? "bg-accent-soft text-accent"
          : "text-muted hover:bg-surface-2 hover:text-fg"
        }`}
    >
      {active && (
        <span className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-full bg-accent" />
      )}
      <span
        className={`text-base transition-transform duration-200 group-hover:scale-110 ${
          active ? "text-accent" : "text-subtle group-hover:text-fg"
        }`}
      >
        {icon}
      </span>
      <span className="flex-1 truncate text-sm font-medium">{text}</span>
      {typeof count === "number" && count > 0 && (
        <span
          className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold tabular-nums ${
            active ? "bg-accent/15 text-accent" : "bg-surface-2 text-subtle"
          }`}
        >
          {count}
        </span>
      )}
    </button>
  );
};
