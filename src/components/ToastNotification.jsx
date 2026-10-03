import React, { useEffect } from "react";
import { Check, X } from "lucide-react";

function ToastNotification({
  show,
  title = "Changes Saved",
  message = "Your changes have been saved successfully.",
  onClose,
  duration = 2500,
}) {
  useEffect(() => {
    if (!show) return undefined;

    const timeoutId = window.setTimeout(() => {
      onClose?.();
    }, duration);

    return () => window.clearTimeout(timeoutId);
  }, [show, duration, onClose]);

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className={`pointer-events-none fixed right-4 top-5 z-[200] w-[calc(100%-2rem)] max-w-[340px] transition-all duration-300 sm:right-6 ${
        show
          ? "translate-x-0 opacity-100"
          : "translate-x-8 opacity-0"
      }`}
    >
      {show && (
        <div className="pointer-events-auto flex items-start gap-3 rounded-lg border border-[#A8DCE8] bg-white px-4 py-3 shadow-[0_8px_30px_rgba(0,0,0,0.15)]">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#08779D] text-white">
            <Check size={17} strokeWidth={3} />
          </div>

          <div className="min-w-0 flex-1 pt-0.5">
            <p className="text-xs font-bold text-[#123047]">
              {title}
            </p>

            <p className="mt-0.5 text-[11px] leading-4 text-[#123047B2]">
              {message}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Dismiss notification"
            className="pointer-events-auto rounded p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
          >
            <X size={15} />
          </button>
        </div>
      )}
    </div>
  );
}

export default ToastNotification;