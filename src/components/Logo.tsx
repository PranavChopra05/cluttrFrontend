interface LogoProps {
  /** Pixel size of the mark */
  size?: number;
  className?: string;
}

/** Cluttr brand mark — a stylised second-brain glyph. Inherits currentColor
 *  for the strokes via the accent gradient; pairs with the wordmark below. */
export const LogoMark = ({ size = 28, className = "" }: LogoProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    className={className}
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="cluttr-mark" x1="12" y1="10" x2="52" y2="54" gradientUnits="userSpaceOnUse">
        <stop stopColor="var(--accent-hover)" />
        <stop offset="1" stopColor="var(--accent)" />
      </linearGradient>
    </defs>
    <path
      d="M32 14c-6.2 0-11.2 4.6-11.2 10.2 0 1 .15 1.95.43 2.85C18.7 28.3 17 30.8 17 33.7c0 3.6 2.6 6.6 6.1 7.4.7 3.4 3.9 6 7.8 6 1.05 0 2.05-.2 2.95-.55"
      stroke="url(#cluttr-mark)"
      strokeWidth="3.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M32 14c6.2 0 11.2 4.6 11.2 10.2 0 1-.15 1.95-.43 2.85C45.3 28.3 47 30.8 47 33.7c0 3.6-2.6 6.6-6.1 7.4-.7 3.4-3.9 6-7.8 6"
      stroke="url(#cluttr-mark)"
      strokeWidth="3.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity="0.55"
    />
    <circle cx="32" cy="30" r="3" fill="var(--accent-hover)" />
  </svg>
);

interface WordmarkProps extends LogoProps {
  /** Hide the text label (mark only) */
  markOnly?: boolean;
}

/** Logo lockup: mark + "Cluttr" wordmark. */
export const Logo = ({ size = 28, className = "", markOnly = false }: WordmarkProps) => (
  <span className={`inline-flex items-center gap-2 ${className}`}>
    <span className="grid place-items-center rounded-xl bg-accent-soft p-1.5 ring-1 ring-border">
      <LogoMark size={size} />
    </span>
    {!markOnly && (
      <span className="text-[1.15rem] font-bold tracking-tight text-fg">Cluttr</span>
    )}
  </span>
);
