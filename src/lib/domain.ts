// Display labels and ordering for the database enums.
// The value types come from the generated database types, so a schema change
// that renames or removes a value breaks the build here rather than at runtime.
import type { Enums } from "@/lib/database.types";

type Option<T extends string> = { value: T; label: string };

export type RelationshipStage = Enums<"relationship_stage">;
export type OpportunityStage = Enums<"opportunity_stage">;
export type OpportunityKind = Enums<"opportunity_kind">;
export type Priority = Enums<"priority_level">;
export type CompanyStatus = Enums<"company_status">;
export type PersonSource = Enums<"person_source">;

export const RELATIONSHIP_STAGES: readonly Option<RelationshipStage>[] = [
  { value: "identified", label: "Identified" },
  { value: "intro_requested", label: "Intro requested" },
  { value: "ready_to_contact", label: "Ready to contact" },
  { value: "contacted", label: "Contacted" },
  { value: "meeting_scheduled", label: "Meeting scheduled" },
  { value: "met", label: "Met" },
  { value: "established", label: "Established" },
  { value: "dormant", label: "Dormant" },
];

export const SPECULATIVE_STAGES: readonly Option<OpportunityStage>[] = [
  { value: "signal", label: "Signal" },
  { value: "exploring", label: "Exploring" },
  { value: "pursuing", label: "Pursuing" },
];

export const FORMAL_STAGES: readonly Option<OpportunityStage>[] = [
  { value: "identified", label: "Identified" },
  { value: "preparing", label: "Preparing" },
  { value: "applied", label: "Applied" },
  { value: "assessment", label: "Assessment" },
  { value: "interviewing", label: "Interviewing" },
  { value: "final_round", label: "Final round" },
  { value: "offer", label: "Offer" },
];

export const PRIORITIES: readonly Option<Priority>[] = [
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
];

export const COMPANY_STATUSES: readonly Option<CompanyStatus>[] = [
  { value: "target", label: "Target" },
  { value: "active", label: "Active" },
  { value: "watching", label: "Watching" },
  { value: "paused", label: "Paused" },
  { value: "closed", label: "Closed" },
];

export const PERSON_SOURCES: readonly Option<PersonSource>[] = [
  { value: "existing", label: "Existing contact" },
  { value: "introduction", label: "Introduction" },
  { value: "cold", label: "Cold outreach" },
  { value: "event", label: "Event" },
  { value: "alumni", label: "Alumni" },
  { value: "other", label: "Other" },
];

export function labelFor<T extends string>(options: readonly Option<T>[], value: T | null | undefined) {
  return options.find((o) => o.value === value)?.label ?? "—";
}

export function isOption<T extends string>(options: readonly Option<T>[], value: unknown): value is T {
  return options.some((o) => o.value === value);
}
