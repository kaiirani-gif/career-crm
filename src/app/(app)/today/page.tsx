import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import { Empty, PageHeader, Section } from "@/components/ui/primitives";
import { FORMAL_STAGES, RELATIONSHIP_STAGES, SPECULATIVE_STAGES } from "@/lib/domain";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Today" };

// Sections are ordered by consequence: what damages a relationship or loses an
// opportunity comes first; summaries come last. Data is wired in Step 5.
export default async function TodayPage() {
  await connection(); // render per request so the date is always current
  const today = new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: "Europe/London",
  }).format(new Date());

  const supabase = await createClient();
  const [{ data: people }, { data: opportunities }] = await Promise.all([
    supabase.from("people").select("relationship_stage").is("archived_at", null),
    supabase.from("opportunities").select("kind, stage").is("archived_at", null).eq("state", "open"),
  ]);
  const count = (values: string[]) =>
    values.reduce<Record<string, number>>((acc, v) => ((acc[v] = (acc[v] ?? 0) + 1), acc), {});
  const networking = count((people ?? []).map((p) => p.relationship_stage));
  const speculative = count((opportunities ?? []).filter((o) => o.kind === "speculative").map((o) => o.stage));
  const formal = count((opportunities ?? []).filter((o) => o.kind === "formal").map((o) => o.stage));

  return (
    <>
      <PageHeader title="Today" meta={today} />

      <div className="space-y-4">
        <Section title="Next meeting">
          <Empty>No meetings in the next 24 hours.</Empty>
        </Section>

        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)]">
          <div className="space-y-4">
            <Section title="Needs attention" count={0} tone="danger">
              <Empty>Nothing overdue.</Empty>
            </Section>
            <Section title="Today" count={0}>
              <Empty>No tasks or suggested actions due today.</Empty>
            </Section>
          </div>

          <div className="space-y-4">
            <Section title="Waiting on" count={0}>
              <Empty>No outstanding applications, introductions or replies.</Empty>
            </Section>
            <Section title="Pipelines" action={<Link href="/pipeline" className="text-text-2 hover:text-text">Open</Link>}>
              <StageBars
                heading="Networking"
                stages={RELATIONSHIP_STAGES.filter((s) => s.value !== "dormant")}
                counts={networking}
              />
              <StageBars heading="Speculative" stages={SPECULATIVE_STAGES} counts={speculative} />
              <StageBars heading="Formal" stages={FORMAL_STAGES} counts={formal} />
            </Section>
            <Section title="Research" count={0}>
              <Empty>No new reports or roles.</Empty>
            </Section>
          </div>
        </div>
      </div>
    </>
  );
}

function StageBars({
  heading,
  stages,
  counts,
}: {
  heading: string;
  stages: readonly { value: string; label: string }[];
  counts: Record<string, number>;
}) {
  const max = Math.max(1, ...stages.map((s) => counts[s.value] ?? 0));
  return (
    <div className="border-b border-border px-4 py-3 last:border-b-0">
      <p className="mb-2 text-[12px] font-medium text-text-2">{heading}</p>
      <ul className="space-y-1">
        {stages.map((s) => {
          const n = counts[s.value] ?? 0;
          return (
            <li key={s.value} className="grid grid-cols-[8.5rem_1fr_1.5rem] items-center gap-3 text-[12px]">
              <span className="truncate text-text-2">{s.label}</span>
              <span className="h-1.5 overflow-hidden rounded-full bg-surface-2">
                <span className="block h-full rounded-full bg-accent" style={{ width: `${(n / max) * 100}%` }} />
              </span>
              <span className={n ? "num text-right text-text" : "num text-right text-text-3"}>{n}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
