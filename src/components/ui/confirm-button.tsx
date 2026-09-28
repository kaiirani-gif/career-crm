"use client";

import { useState } from "react";
import { buttonClass } from "./form";

// Two-step destructive action: the first click asks, the second submits.
// Browser confirm() dialogs are unreliable in a home-screen web app.
export function ConfirmButton({
  action,
  label,
  confirmLabel,
}: {
  action: () => Promise<void>;
  label: string;
  confirmLabel: string;
}) {
  const [asking, setAsking] = useState(false);

  if (!asking) {
    return (
      <button type="button" onClick={() => setAsking(true)} className={buttonClass.secondary}>
        {label}
      </button>
    );
  }

  return (
    <form action={action} className="inline-flex items-center gap-2">
      <button type="submit" className={`${buttonClass.secondary} border-danger/40 text-danger`}>
        {confirmLabel}
      </button>
      <button type="button" onClick={() => setAsking(false)} className={buttonClass.quiet}>
        Cancel
      </button>
    </form>
  );
}
