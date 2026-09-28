import clsx from "clsx";
import {
  COMPANY_STATUSES,
  labelFor,
  PRIORITIES,
  RELATIONSHIP_STAGES,
  type CompanyStatus,
  type Priority,
  type RelationshipStage,
} from "@/lib/domain";

const pill = "inline-flex items-center whitespace-nowrap rounded px-1.5 py-0.5 text-[11px] font-medium";

export function PriorityPill({ value }: { value: Priority }) {
  return (
    <span
      className={clsx(
        pill,
        value === "high" && "bg-accent-soft text-accent",
        value === "medium" && "bg-surface-2 text-text-2",
        value === "low" && "text-text-3",
      )}
    >
      {labelFor(PRIORITIES, value)}
    </span>
  );
}

export function StatusPill({ value }: { value: CompanyStatus }) {
  return (
    <span className={clsx(pill, value === "active" ? "bg-positive-soft text-positive" : "bg-surface-2 text-text-2")}>
      {labelFor(COMPANY_STATUSES, value)}
    </span>
  );
}

// Stages later in the pipeline read progressively stronger.
export function StagePill({ value }: { value: RelationshipStage }) {
  const index = RELATIONSHIP_STAGES.findIndex((s) => s.value === value);
  return (
    <span
      className={clsx(
        pill,
        value === "dormant" && "text-text-3",
        value !== "dormant" && index <= 2 && "bg-surface-2 text-text-2",
        value !== "dormant" && index > 2 && index <= 4 && "bg-accent-soft text-accent",
        (value === "met" || value === "established") && "bg-accent text-surface",
      )}
    >
      {labelFor(RELATIONSHIP_STAGES, value)}
    </span>
  );
}
