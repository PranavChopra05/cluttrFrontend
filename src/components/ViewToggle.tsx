import { LuLayoutGrid, LuList } from "react-icons/lu";

interface ViewToggleProps {
  view: "grid" | "list";
  onChange: (v: "grid" | "list") => void;
}

export const ViewToggle = ({ view, onChange }: ViewToggleProps) => {
  const item = (v: "grid" | "list", Icon: typeof LuLayoutGrid, label: string) => (
    <button
      type="button"
      onClick={() => onChange(v)}
      aria-label={label}
      aria-pressed={view === v}
      className={`grid h-8 w-8 place-items-center rounded-md transition-colors ${
        view === v ? "bg-surface text-fg shadow-sm" : "text-subtle hover:text-fg"
      }`}
    >
      <Icon size={16} />
    </button>
  );

  return (
    <div className="inline-flex items-center gap-0.5 rounded-lg border border-border bg-surface-2 p-1">
      {item("grid", LuLayoutGrid, "Grid view")}
      {item("list", LuList, "List view")}
    </div>
  );
};
