import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import type { ReactNode } from "react";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";

interface AuthShellProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}

export const AuthShell = ({ title, subtitle, children, footer }: AuthShellProps) => (
  <div className="relative grid min-h-screen place-items-center overflow-hidden p-4">
    <div className="ambient" />
    <div className="aurora-glow" />

    <div className="absolute right-4 top-4 z-20">
      <ThemeToggle />
    </div>

    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="relative z-10 w-full max-w-[400px]"
    >
      <div className="mb-7 flex flex-col items-center text-center">
        <Link to="/" aria-label="Cluttr home" className="mb-5">
          <Logo size={32} markOnly />
        </Link>
        <h1 className="text-2xl font-bold tracking-tight text-fg">{title}</h1>
        <p className="mt-1.5 text-sm text-muted">{subtitle}</p>
      </div>

      <div className="rounded-2xl border border-border bg-surface p-7 shadow-soft">
        {children}
      </div>

      <p className="mt-6 text-center text-sm text-muted">{footer}</p>
    </motion.div>
  </div>
);
