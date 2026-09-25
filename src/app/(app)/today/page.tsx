import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import { Empty, PageHeader, Section } from "@/components/ui/primitives";
import { FORMAL_STAGES, RELATIONSHIP_STAGES, SPECULATIVE_STAGES } from "@/lib/domain";

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
              />
              <StageBars heading="Speculative" stages={SPECULATIVE_STAGES} />
              <StageBars heading="Formal" stages={FORMAL_STAGES} />
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

function StageBars({ heading, stages }: { heading: string; stages: readonly { value: string; label: string }[] }) {
  return (
    <div className="border-b border-border px-4 py-3 last:border-b-0">
      <p className="mb-2 text-[12px] font-medium text-text-2">{heading}</p>
      <ul className="space-y-1">
        {stages.map((s) => (
          <li key={s.value} className="grid grid-cols-[8.5rem_1fr_1.5rem] items-center gap-3 text-[12px]">
            <span className="truncate text-text-2">{s.label}</span>
            <span className="h-1.5 rounded-full bg-surface-2" />
            <span className="num text-right text-text-3">0</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
