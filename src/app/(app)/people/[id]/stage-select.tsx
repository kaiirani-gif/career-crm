"use client";

import { useTransition } from "react";
import { RELATIONSHIP_STAGES, type RelationshipStage } from "@/lib/domain";
import { setStage } from "../actions";

// Changing the stage saves immediately and is logged on the timeline by the database.
export function StageSelect({ personId, stage }: { personId: string; stage: RelationshipStage }) {
  const [pending, startTransition] = useTransition();

  return (
    <label className="inline-flex items-center gap-2">
      <span className="label">Stage</span>
      <select
        aria-label="Networking stage"
        defaultValue={stage}
        disabled={pending}
        onChange={(e) => {
          const next = e.target.value as RelationshipStage;
          startTransition(() => setStage(personId, next));
        }}
        className="rounded-md border border-border bg-surface px-2 py-1.5 text-[13px] font-medium text-text focus:border-accent focus:outline-none disabled:opacity-60"
      >
        {RELATIONSHIP_STAGES.map((s) => (
          <option key={s.value} value={s.value}>
            {s.label}
          </option>
        ))}
      </select>
    </label>
  );
}
