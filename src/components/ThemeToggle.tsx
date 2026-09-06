import { LuSun, LuMoon } from "react-icons/lu";
import { useTheme } from "../context/ThemeContext";

interface ThemeToggleProps {
  className?: string;
}

/** Compact light/dark switch. Animated icon swap, fully keyboard accessible. */
export const ThemeToggle = ({ className = "" }: ThemeToggleProps) => {
  const { resolved, toggle } = useTheme();
  const isDark = resolved === "dark";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      title={`Switch to ${isDark ? "light" : "dark"} mode`}
      className={`relative grid h-9 w-9 place-items-center rounded-xl border border-border bg-surface-2 text-muted transition-all duration-200 hover:text-fg hover:border-border-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${className}`}
    >
      <LuSun
        className={`absolute h-[18px] w-[18px] transition-all duration-300 ${
          isDark ? "scale-0 -rotate-90 opacity-0" : "scale-100 rotate-0 opacity-100"
        }`}
      />
      <LuMoon
        className={`absolute h-[18px] w-[18px] transition-all duration-300 ${
          isDark ? "scale-100 rotate-0 opacity-100" : "scale-0 rotate-90 opacity-0"
        }`}
      />
    </button>
  );
};
