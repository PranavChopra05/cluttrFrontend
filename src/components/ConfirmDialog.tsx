import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LuTriangleAlert } from "react-icons/lu";
import { Button } from "./Button";
import { useLockBodyScroll } from "../hooks/useLockBodyScroll";
import { useFocusTrap } from "../hooks/useFocusTrap";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  danger?: boolean;
  isLoading?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export const ConfirmDialog = ({
  open,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  danger = true,
  isLoading,
  onConfirm,
  onClose,
}: ConfirmDialogProps) => {
  useLockBodyScroll(open);
  const trapRef = useFocusTrap<HTMLDivElement>(open);

  useEffect(() => {
    if (!open) return;
    // Only Escape is global — confirmation must be an explicit click/Enter on the
    // (trap-focused) button, so a stray Enter can't fire a destructive delete.
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center p-4"
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="confirm-title"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            ref={trapRef}
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.18 }}
            className="relative w-full max-w-sm overflow-hidden rounded-2xl border border-border bg-elevated p-6 shadow-2xl"
          >
            <div className="flex items-start gap-4">
              <div
                className={`grid h-11 w-11 flex-shrink-0 place-items-center rounded-xl ${
                  danger ? "bg-danger/10 text-danger" : "bg-accent-soft text-accent"
                }`}
              >
                <LuTriangleAlert className="text-lg" />
              </div>
              <div className="min-w-0">
                <h2 id="confirm-title" className="text-base font-semibold text-fg">
                  {title}
                </h2>
                {description && <p className="mt-1 text-sm text-muted">{description}</p>}
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <Button variant="ghost" size="sm" text={cancelText} onClick={onClose} />
              <Button
                variant={danger ? "danger" : "primary"}
                size="sm"
                text={confirmText}
                onClick={onConfirm}
                isLoading={isLoading}
              />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
