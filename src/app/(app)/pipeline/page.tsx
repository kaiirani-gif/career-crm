import type { Metadata } from "next";
import Link from "next/link";
import { Empty, PageHeader, Section, Segmented } from "@/components/ui/primitives";
import { FORMAL_STAGES, RELATIONSHIP_STAGES, SPECULATIVE_STAGES } from "@/lib/domain";
import { formatRelative } from "@/lib/format";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Pipeline" };

const VIEWS = [
  { value: "networking", label: "Networking", href: "/pipeline?view=networking" },
  { value: "opportunities", label: "Opportunities", href: "/pipeline?view=opportunities" },
];

type Card = { id: string; href: string; title: string; subtitle: string; meta?: string };

export default async function PipelinePage({ searchParams }: PageProps<"/pipeline">) {
  const { view } = await searchParams;
  const active = view === "opportunities" ? "opportunities" : "networking";

  return (
    <>
      <PageHeader title="Pipeline" actions={<Segmented items={VIEWS} active={active} />} />
      {active === "networking" ? <Networking /> : <Opportunities />}
    </>
  );
}

async function Networking() {
  const supabase = await createClient();
  const [{ data: people }, { data: last }] = await Promise.all([
    supabase
      .from("people")
      .select("id, full_name, title, relationship_stage, company:companies(name)")
      .is("archived_at", null)
      .order("stage_changed_at", { ascending: false }),
    supabase.from("person_last_interaction").select("person_id, last_interaction_at"),
  ]);
  const lastBy = new Map((last ?? []).map((l) => [l.person_id, l.last_interaction_at]));

  const columns = RELATIONSHIP_STAGES.map((s) => ({
    ...s,
    cards: (people ?? [])
      .filter((p) => p.relationship_stage === s.value)
      .map<Card>((p) => ({
        id: p.id,
        href: `/people/${p.id}`,
        title: p.full_name,
        subtitle: [p.company?.name, p.title].filter(Boolean).join(" · "),
        meta: lastBy.get(p.id) ? `Last contact ${formatRelative(lastBy.get(p.id)).toLowerCase()}` : undefined,
      })),
  }));

  return <Board columns={columns} empty="Nobody at this stage" />;
}

async function Opportunities() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("opportunities")
    .select("id, title, kind, stage, company:companies(name)")
    .is("archived_at", null)
    .eq("state", "open");

  const toColumns = (kind: "speculative" | "formal", stages: typeof SPECULATIVE_STAGES) =>
    stages.map((s) => ({
      ...s,
      cards: (data ?? [])
        .filter((o) => o.kind === kind && o.stage === s.value)
        .map<Card>((o) => ({ id: o.id, href: `/pipeline?view=opportunities`, title: o.title, subtitle: o.company?.name ?? "" })),
    }));

  return (
    <div className="space-y-6">
      <div>
        <p className="label mb-2">Speculative</p>
        <Board columns={toColumns("speculative", SPECULATIVE_STAGES)} empty="None" />
      </div>
      <div>
        <p className="label mb-2">Formal</p>
        <Board columns={toColumns("formal", FORMAL_STAGES)} empty="None" />
      </div>
    </div>
  );
}

// One column per stage; scrolls horizontally on narrow screens.
function Board({ columns, empty }: { columns: { value: string; label: string; cards: Card[] }[]; empty: string }) {
  return (
    <div className="-mx-4 overflow-x-auto px-4 pb-2 md:mx-0 md:px-0">
      <div className="flex items-start gap-3">
        {columns.map((col) => (
          <Section key={col.value} title={col.label} count={col.cards.length} className="w-[230px] shrink-0">
            {col.cards.length === 0 ? (
              <Empty>{empty}</Empty>
            ) : (
              <ul>
                {col.cards.map((c) => (
                  <li key={c.id}>
                    <Link href={c.href} className="block border-b border-border px-3 py-2.5 last:border-b-0 hover:bg-surface-2/60">
                      <p className="text-[13px] font-medium">{c.title}</p>
                      {c.subtitle && <p className="truncate text-[12px] text-text-2">{c.subtitle}</p>}
                      {c.meta && <p className="mt-0.5 text-[11px] text-text-3">{c.meta}</p>}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </Section>
        ))}
      </div>
    </div>
  );
}
