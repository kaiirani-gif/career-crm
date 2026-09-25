"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Briefcase, Building2, CalendarPlus, CheckSquare, NotebookPen, Plus, UserPlus } from "lucide-react";
import clsx from "clsx";

// Quick capture, reachable from every screen. Items are enabled as each build
// step lands.
const CAPTURE_ITEMS = [
  { label: "Meeting", icon: CalendarPlus },
  { label: "Note", icon: NotebookPen },
  { label: "Task", icon: CheckSquare },
  { label: "Person", icon: UserPlus },
  { label: "Company", icon: Building2 },
  { label: "Opportunity", icon: Briefcase },
] as const;

export function CaptureMenu({ variant }: { variant: "sidebar" | "topbar" }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      {variant === "sidebar" ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex w-full items-center gap-2 rounded-md border border-border bg-surface px-2.5 py-1.5 text-[13px] font-medium text-text hover:border-border-strong"
        >
          <Plus size={15} strokeWidth={2} />
          New
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="New"
          className="-mr-1.5 flex h-9 w-9 items-center justify-center rounded-full text-accent active:bg-surface-2"
        >
          <Plus size={22} strokeWidth={2} />
        </button>
      )}

      {/* Portalled to <body>: the blurred top bar would otherwise trap a fixed-position sheet. */}
      {open &&
        createPortal(
        <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="New">
          <button
            type="button"
            aria-label="Close"
            className="absolute inset-0 bg-black/25 md:bg-black/10"
            onClick={() => setOpen(false)}
          />
          <div
            className={clsx(
              "absolute border-border bg-surface shadow-lg",
              // Bottom sheet on the phone, compact panel on larger screens.
              "pb-safe inset-x-0 bottom-0 rounded-t-xl border-t",
              "md:inset-x-auto md:bottom-auto md:left-3 md:top-24 md:w-[240px] md:rounded-lg md:border md:pb-0",
            )}
          >
            <div className="mx-auto mt-2 h-1 w-9 rounded-full bg-border-strong md:hidden" />
            <p className="label px-4 pb-1 pt-3">New</p>
            <ul className="pb-2">
              {CAPTURE_ITEMS.map(({ label, icon: Icon }) => (
                <li key={label}>
                  <button
                    type="button"
                    disabled
                    className="flex w-full items-center gap-3 px-4 py-3 text-left text-[15px] text-text disabled:text-text-3 md:py-2 md:text-[13px]"
                  >
                    <Icon size={17} strokeWidth={1.75} />
                    {label}
                    <span className="ml-auto text-[11px] text-text-3">Soon</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>,
          document.body,
        )}
    </>
  );
}
