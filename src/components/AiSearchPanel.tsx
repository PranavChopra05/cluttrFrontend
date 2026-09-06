import { motion } from "framer-motion";
import { LuX, LuSparkles } from "react-icons/lu";

interface AiSearchPanelProps {
  summary: string;
  matchCount: number;
  query: string;
  onClear: () => void;
}

export const AiSearchPanel = ({ summary, matchCount, query, onClear }: AiSearchPanelProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8, height: 0 }}
      animate={{ opacity: 1, y: 0, height: "auto" }}
      exit={{ opacity: 0, y: -8, height: 0 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      className="mb-6"
    >
      <div className="relative overflow-hidden rounded-2xl border border-border bg-surface">
        <div className="absolute left-0 top-0 h-full w-[3px] bg-accent" />
        <div className="p-5 pl-6">
          <div className="mb-2 flex items-start justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div className="grid h-8 w-8 place-items-center rounded-lg bg-accent-soft text-accent">
                <LuSparkles size={15} />
              </div>
              <div>
                <h3 className="flex items-center gap-2 text-sm font-semibold text-fg">
                  AI summary
                  <span className="rounded-full border border-border bg-surface-2 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-muted">
                    Gemini
                  </span>
                </h3>
                <p className="mt-0.5 text-[11px] text-subtle">
                  {matchCount} {matchCount === 1 ? "result" : "results"} for “{query}”
                </p>
              </div>
            </div>
            <button onClick={onClear} aria-label="Clear AI search"
              className="flex-shrink-0 rounded-lg p-2 text-subtle transition-colors hover:bg-surface-2 hover:text-fg">
              <LuX size={15} />
            </button>
          </div>
          <p className="pl-10 text-sm leading-relaxed text-muted">{summary}</p>
        </div>
      </div>
    </motion.div>
  );
};
