import type { ReactNode } from "react";
import { motion } from "framer-motion";

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  compact?: boolean;
}

/** Reusable, icon-driven empty state — replaces emoji placeholders. */
export const EmptyState = ({ icon, title, description, action, compact }: EmptyStateProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex flex-col items-center justify-center text-center ${compact ? "py-12" : "py-20"}`}
    >
      <div className="mb-5 grid h-16 w-16 place-items-center rounded-2xl border border-border bg-surface text-accent">
        <span className="text-2xl">{icon}</span>
      </div>
      <h3 className="text-base font-semibold text-fg">{title}</h3>
      {description && <p className="mt-1.5 max-w-sm text-sm text-muted">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </motion.div>
  );
};
