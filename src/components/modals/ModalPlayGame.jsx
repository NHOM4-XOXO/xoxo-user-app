"use client";
import React, { useEffect, useMemo } from "react";
import { X } from "lucide-react";

export default function ModalPlayGame({
  open,
  onClose,
  src,
  title = "Play Game",
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  const sandboxAttr = useMemo(() => {
    const isLocal = typeof src === "string" && src.startsWith("/");
    return [
      "allow-scripts",
      "allow-pointer-lock",
      "allow-forms",
      "allow-popups",
      ...(isLocal ? ["allow-same-origin"] : []),
    ].join(" ");
  }, [src]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-black/60">
      <div className="relative w-full max-w-5xl h-[80vh] rounded-2xl overflow-hidden border bg-white/90 dark:bg-neutral-900/90 backdrop-blur">
        <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-4 py-2 border-b bg-white/70 dark:bg-neutral-900/70 backdrop-blur">
          <div className="text-sm font-medium truncate">{title}</div>
          <button
            onClick={onClose}
            className="inline-flex items-center gap-2 rounded-xl border px-2.5 py-1.5 text-sm cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/30 active:scale-[0.98] transition"
            title="Đóng"
          >
            <X className="w-4 h-4" />
            Đóng
          </button>
        </div>

        <div className="absolute inset-x-0 bottom-0 top-10">
          <iframe
            src={src}
            title={title}
            className="w-full h-full"
            allowFullScreen
            sandbox={sandboxAttr}
            referrerPolicy="no-referrer"
            allow="gamepad; xr-spatial-tracking; fullscreen"
          />
        </div>
      </div>
    </div>
  );
}
