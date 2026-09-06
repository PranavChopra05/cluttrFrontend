import { useEffect } from "react";

/** Locks <body> scroll while `active` is true (for modals, drawers, palettes).
 *  Compensates for the scrollbar width to avoid layout shift, and safely
 *  stacks when multiple overlays are open at once. */
let lockCount = 0;

export function useLockBodyScroll(active: boolean) {
  useEffect(() => {
    if (!active) return;
    const body = document.body;
    if (lockCount === 0) {
      const scrollbar = window.innerWidth - document.documentElement.clientWidth;
      body.style.overflow = "hidden";
      if (scrollbar > 0) body.style.paddingRight = `${scrollbar}px`;
    }
    lockCount++;
    return () => {
      lockCount = Math.max(0, lockCount - 1);
      if (lockCount === 0) {
        body.style.overflow = "";
        body.style.paddingRight = "";
      }
    };
  }, [active]);
}
