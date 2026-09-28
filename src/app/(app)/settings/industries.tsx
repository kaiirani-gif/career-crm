"use client";

import { useActionState, useEffect, useRef } from "react";
import { ConfirmButton } from "@/components/ui/confirm-button";
import { FormError, inputClass, Select } from "@/components/ui/form";
import { SubmitButton } from "@/components/ui/submit-button";
import { PRIORITIES, type Priority } from "@/lib/domain";
import { addIndustry, removeIndustry, updateIndustry } from "./actions";

type Industry = { id: string; name: string; priority: Priority; companies: number };

export function Industries({ industries }: { industries: Industry[] }) {
  return (
    <div>
      <ul>
        {industries.map((i) => (
          <li key={i.id} className="flex flex-wrap items-center gap-2 border-b border-border px-4 py-2.5 last:border-b-0">
            {/* Saves when the priority changes or the name loses focus. */}
            <form action={updateIndustry.bind(null, i.id)} className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
              <input
                name="name"
                defaultValue={i.name}
                aria-label="Industry name"
                onBlur={(e) => e.currentTarget.value !== i.name && e.currentTarget.form?.requestSubmit()}
                className={`${inputClass} min-w-[12rem] flex-1`}
              />
              <select
                name="priority"
                aria-label="Priority"
                defaultValue={i.priority}
                onChange={(e) => e.currentTarget.form?.requestSubmit()}
                className={`${inputClass} w-auto`}
              >
                {PRIORITIES.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </select>
              <span className="num w-24 text-[12px] text-text-3">
                {i.companies} {i.companies === 1 ? "company" : "companies"}
              </span>
            </form>
            <ConfirmButton action={removeIndustry.bind(null, i.id)} label="Remove" confirmLabel="Remove industry" />
          </li>
        ))}
      </ul>
      <AddIndustry />
    </div>
  );
}

function AddIndustry() {
  const [state, action] = useActionState(addIndustry, {});
  const formRef = useRef<HTMLFormElement>(null);
  const submitted = useRef(false);

  useEffect(() => {
    if (submitted.current && !state.error) formRef.current?.reset();
    submitted.current = false;
  }, [state]);

  return (
    <form
      ref={formRef}
      action={(fd) => {
        submitted.current = true;
        return action(fd);
      }}
      className="space-y-2 border-t border-border bg-surface-2/50 px-4 py-3"
    >
      <FormError message={state.error} />
      <div className="flex flex-wrap items-center gap-2">
        <input name="name" placeholder="Add an industry" aria-label="New industry" className={`${inputClass} min-w-[12rem] flex-1`} />
        <Select name="priority" options={PRIORITIES} defaultValue="medium" aria-label="Priority" className="w-auto" />
        <SubmitButton variant="secondary" pendingLabel="Adding…">
          Add
        </SubmitButton>
      </div>
    </form>
  );
}
