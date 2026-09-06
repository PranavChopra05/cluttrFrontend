import { useState, type KeyboardEvent } from "react";
import { LuX } from "react-icons/lu";

interface TagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  suggestions?: string[];
  placeholder?: string;
  max?: number;
}

export const TagInput = ({
  value,
  onChange,
  suggestions = [],
  placeholder = "Add tags…",
  max = 20,
}: TagInputProps) => {
  const [draft, setDraft] = useState("");

  const addTag = (raw: string) => {
    const tag = raw.trim().toLowerCase();
    if (!tag) return;
    if (value.includes(tag)) {
      setDraft("");
      return;
    }
    if (value.length >= max) return;
    onChange([...value, tag]);
    setDraft("");
  };

  const removeTag = (tag: string) => onChange(value.filter((t) => t !== tag));

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(draft);
    } else if (e.key === "Backspace" && !draft && value.length) {
      removeTag(value[value.length - 1]);
    }
  };

  const filteredSuggestions = suggestions
    .filter((s) => !value.includes(s) && (!draft || s.includes(draft.toLowerCase())))
    .slice(0, 6);

  return (
    <div>
      <div className="flex flex-wrap items-center gap-1.5 rounded-xl border border-border bg-surface-2 px-2.5 py-2 transition-all focus-within:border-accent/50 focus-within:ring-2 focus-within:ring-ring">
        {value.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 rounded-md bg-accent-soft px-2 py-1 text-xs font-medium text-accent"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              aria-label={`Remove tag ${tag}`}
              className="grid place-items-center rounded hover:text-fg"
            >
              <LuX className="text-[11px]" />
            </button>
          </span>
        ))}
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={onKeyDown}
          onBlur={() => addTag(draft)}
          placeholder={value.length ? "" : placeholder}
          className="min-w-[80px] flex-1 bg-transparent py-0.5 text-sm text-fg placeholder:text-subtle focus:outline-none"
        />
      </div>
      {filteredSuggestions.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {filteredSuggestions.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => addTag(s)}
              className="rounded-md border border-border bg-surface px-2 py-1 text-xs text-muted transition-colors hover:border-accent/40 hover:text-accent"
            >
              + {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
