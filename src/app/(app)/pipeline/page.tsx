import type { Metadata } from "next";
import { Empty, PageHeader, Section, Segmented } from "@/components/ui/primitives";
import { FORMAL_STAGES, RELATIONSHIP_STAGES, SPECULATIVE_STAGES } from "@/lib/domain";

export const metadata: Metadata = { title: "Pipeline" };

const VIEWS = [
  { value: "networking", label: "Networking", href: "/pipeline?view=networking" },
  { value: "opportunities", label: "Opportunities", href: "/pipeline?view=opportunities" },
];

export default async function PipelinePage({ searchParams }: PageProps<"/pipeline">) {
  const { view } = await searchParams;
  const active = view === "opportunities" ? "opportunities" : "networking";

  return (
    <>
      <PageHeader title="Pipeline" actions={<Segmented items={VIEWS} active={active} />} />

      {active === "networking" ? (
        <Board stages={RELATIONSHIP_STAGES} empty="No people" />
      ) : (
        <div className="space-y-6">
          <div>
            <p className="label mb-2">Speculative</p>
            <Board stages={SPECULATIVE_STAGES} empty="None" />
          </div>
          <div>
            <p className="label mb-2">Formal</p>
            <Board stages={FORMAL_STAGES} empty="None" />
          </div>
        </div>
      )}
    </>
  );
}

// One column per stage; scrolls horizontally on narrow screens.
function Board({ stages, empty }: { stages: readonly { value: string; label: string }[]; empty: string }) {
  return (
    <div className="-mx-4 overflow-x-auto px-4 md:mx-0 md:px-0">
      <div className="flex gap-3">
        {stages.map((s) => (
          <Section key={s.value} title={s.label} count={0} className="w-[220px] shrink-0">
            <Empty>{empty}</Empty>
          </Section>
        ))}
      </div>
    </div>
  );
}
