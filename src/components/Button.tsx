import type { ReactElement, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

interface ButtonProps {
  variant?: Variant;
  size?: Size;
  text?: string;
  children?: ReactNode;
  startIcon?: ReactElement;
  endIcon?: ReactElement;
  onClick?: () => void;
  fullWidth?: boolean;
  isLoading?: boolean;
  disabled?: boolean;
  type?: "button" | "submit";
  title?: string;
  "aria-label"?: string;
}

const variantStyles: Record<Variant, string> = {
  primary:
    "bg-accent text-accent-fg hover:bg-accent-hover shadow-sm shadow-accent/20 active:scale-[0.98]",
  secondary:
    "bg-surface-2 text-fg border border-border hover:border-border-strong hover:bg-elevated active:scale-[0.98]",
  ghost:
    "text-muted hover:text-fg hover:bg-surface-2 active:scale-[0.98]",
  danger:
    "bg-transparent text-danger border border-border hover:bg-danger/10 hover:border-danger/30 active:scale-[0.98]",
};

const sizeStyles: Record<Size, string> = {
  sm: "px-3 py-1.5 text-xs gap-1.5 rounded-lg",
  md: "px-4 py-2.5 text-sm gap-2 rounded-xl",
  lg: "px-5 py-3 text-sm gap-2 rounded-xl",
};

const base =
  "inline-flex items-center justify-center font-semibold tracking-tight cursor-pointer transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 group select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-canvas";

export const Button = ({
  variant = "primary",
  size = "md",
  text,
  children,
  startIcon,
  endIcon,
  onClick,
  fullWidth,
  isLoading,
  disabled,
  type = "button",
  title,
  "aria-label": ariaLabel,
}: ButtonProps) => {
  return (
    <button
      type={type}
      title={title}
      aria-label={ariaLabel}
      aria-busy={isLoading || undefined}
      disabled={isLoading || disabled}
      onClick={onClick}
      className={`${base} ${variantStyles[variant]} ${sizeStyles[size]} ${fullWidth ? "w-full" : ""}`}
    >
      {isLoading ? (
        <span className="h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
      ) : (
        startIcon && (
          <span className="transition-transform duration-200 group-hover:scale-110">{startIcon}</span>
        )
      )}
      {(text || children) && <span>{isLoading ? "Working…" : children ?? text}</span>}
      {!isLoading && endIcon && (
        <span className="transition-transform duration-200 group-hover:translate-x-0.5">{endIcon}</span>
      )}
    </button>
  );
};
