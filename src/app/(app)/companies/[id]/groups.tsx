"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { Star } from "lucide-react";
import clsx from "clsx";
import { ConfirmButton } from "@/components/ui/confirm-button";
import { buttonClass, Field, FormError, TextInput } from "@/components/ui/form";
import { SubmitButton } from "@/components/ui/submit-button";
import type { Tables } from "@/lib/database.types";
import { addGroup, deleteGroup, setGroupFocus } from "../actions";

type Group = Pick<Tables<"company_groups">, "id" | "name" | "description" | "locations" | "is_focus">;

export function Groups({ companyId, groups, peopleCounts }: { companyId: string; groups: Group[]; peopleCounts: Record<string, number> }) {
  return (
    <div>
      {groups.length === 0 ? (
        <p className="px-4 py-5 text-[13px] text-text-3">
          No groups yet. Add the divisions or teams you are targeting, such as a real estate or credit platform.
        </p>
      ) : (
        <ul>
          {groups.map((g) => (
            <li key={g.id} className="flex flex-wrap items-start gap-x-3 gap-y-2 border-b border-border px-4 py-3 last:border-b-0">
              <form action={setGroupFocus.bind(null, g.id, companyId, !g.is_focus)}>
                <button
                  type="submit"
                  aria-label={g.is_focus ? "Remove focus" : "Mark as focus"}
                  title={g.is_focus ? "Focus group" : "Mark as focus"}
                  className={clsx("mt-0.5", g.is_focus ? "text-accent" : "text-text-3 hover:text-text-2")}
                >
                  <Star size={15} fill={g.is_focus ? "currentColor" : "none"} />
                </button>
              </form>
              <div className="min-w-0 flex-1">
                <p className="text-[14px] font-medium">{g.name}</p>
                {g.description && <p className="mt-0.5 text-[13px] text-text-2">{g.description}</p>}
                <p className="mt-0.5 text-[12px] text-text-3">
                  {[g.locations.join(", "), `${peopleCounts[g.id] ?? 0} people`].filter(Boolean).join(" · ")}
                </p>
              </div>
              <ConfirmButton action={deleteGroup.bind(null, g.id, companyId)} label="Remove" confirmLabel="Remove group" />
            </li>
          ))}
        </ul>
      )}
      <AddGroup companyId={companyId} />
    </div>
  );
}

function AddGroup({ companyId }: { companyId: string }) {
  const [open, setOpen] = useState(false);
  const [state, action] = useActionState(addGroup.bind(null, companyId), {});
  const formRef = useRef<HTMLFormElement>(null);
  const submitted = useRef(false);

  // Clear the form after a successful add, keeping it open for the next one.
  useEffect(() => {
    if (submitted.current && !state.error) formRef.current?.reset();
    submitted.current = false;
  }, [state]);

  if (!open) {
    return (
      <div className="border-t border-border px-4 py-3">
        <button type="button" onClick={() => setOpen(true)} className={buttonClass.secondary}>
          Add group
        </button>
      </div>
    );
  }

  return (
    <form
      ref={formRef}
      action={(fd) => {
        submitted.current = true;
        return action(fd);
      }}
      className="space-y-3 border-t border-border bg-surface-2/50 px-4 py-4"
    >
      <FormError message={state.error} />
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Name">
          <TextInput name="name" required autoFocus placeholder="e.g. Real Estate" />
        </Field>
        <Field label="Locations" hint="Separate with commas">
          <TextInput name="locations" placeholder="London, New York" />
        </Field>
        <Field label="Description" className="sm:col-span-2">
          <TextInput name="description" placeholder="Strategy, focus, why it matters to you" />
        </Field>
      </div>
      <label className="flex items-center gap-2 text-[13px]">
        <input type="checkbox" name="is_focus" className="h-4 w-4 accent-[var(--accent)]" defaultChecked />
        Focus group
      </label>
      <div className="flex items-center gap-3">
        <SubmitButton>Add group</SubmitButton>
        <button type="button" onClick={() => setOpen(false)} className={buttonClass.quiet}>
          Done
        </button>
      </div>
    </form>
  );
}
