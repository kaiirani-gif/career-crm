// Display labels and ordering for the database enums.
// Keep in step with supabase/migrations/*_initial_schema.sql.

export const RELATIONSHIP_STAGES = [
  { value: "identified", label: "Identified" },
  { value: "intro_requested", label: "Intro requested" },
  { value: "ready_to_contact", label: "Ready to contact" },
  { value: "contacted", label: "Contacted" },
  { value: "meeting_scheduled", label: "Meeting scheduled" },
  { value: "met", label: "Met" },
  { value: "established", label: "Established" },
  { value: "dormant", label: "Dormant" },
] as const;

export type RelationshipStage = (typeof RELATIONSHIP_STAGES)[number]["value"];

export const SPECULATIVE_STAGES = [
  { value: "signal", label: "Signal" },
  { value: "exploring", label: "Exploring" },
  { value: "pursuing", label: "Pursuing" },
] as const;

export const FORMAL_STAGES = [
  { value: "identified", label: "Identified" },
  { value: "preparing", label: "Preparing" },
  { value: "applied", label: "Applied" },
  { value: "assessment", label: "Assessment" },
  { value: "interviewing", label: "Interviewing" },
  { value: "final_round", label: "Final round" },
  { value: "offer", label: "Offer" },
] as const;

export type OpportunityKind = "speculative" | "formal";
export type OpportunityStage =
  | (typeof SPECULATIVE_STAGES)[number]["value"]
  | (typeof FORMAL_STAGES)[number]["value"];

export const PRIORITY_LABELS = { high: "High", medium: "Medium", low: "Low" } as const;
export type Priority = keyof typeof PRIORITY_LABELS;
