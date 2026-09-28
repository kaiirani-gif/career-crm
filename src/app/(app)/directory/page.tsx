import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { buttonClass } from "@/components/ui/form";
import { PriorityPill, StagePill, StatusPill } from "@/components/ui/pills";
import { Empty, PageHeader, Section, Segmented } from "@/components/ui/primitives";
import { labelFor, RELATIONSHIP_STAGES } from "@/lib/domain";
import { one } from "@/lib/form-data";
import { formatDate, formatRelative } from "@/lib/format";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Directory" };

const VIEWS = { companies: "Companies", people: "People", documents: "Documents" } as const;
type View = keyof typeof VIEWS;

export default async function DirectoryPage({ searchParams }: PageProps<"/directory">) {
  const { view } = await searchParams;
  const active: View = typeof view === "string" && view in VIEWS ? (view as View) : "companies";

  const items = (Object.keys(VIEWS) as View[]).map((v) => ({ value: v, label: VIEWS[v], href: `/directory?view=${v}` }));
  const newHref = active === "people" ? "/people/new" : active === "companies" ? "/companies/new" : null;

  return (
    <>
      <PageHeader
        title="Directory"
        actions={
          <>
            <Segmented items={items} active={active} />
            {newHref && (
              <Link href={newHref} className={buttonClass.primary}>
                <Plus size={14} /> {active === "people" ? "Person" : "Company"}
              </Link>
            )}
          </>
        }
      />
      {active === "companies" && <Companies />}
      {active === "people" && <People />}
      {active === "documents" && <Documents />}
    </>
  );
}

const th = "label px-4 py-2 font-semibold";
const td = "px-4 py-2.5 align-top";
const row = "border-b border-border last:border-b-0 hover:bg-surface-2/60";

async function Companies() {
  const supabase = await createClient();
  const [companies, coverage, tasks, interactions] = await Promise.all([
    supabase
      .from("companies")
      .select("id, name, one_liner, priority, status, company_industries(industry:industries(name))")
      .is("archived_at", null)
      .order("priority")
      .order("name"),
    supabase.from("company_coverage").select("company_id, contact_count, furthest_stage"),
    supabase
      .from("tasks")
      .select("company_id, title, due_date")
      .eq("status", "open")
      .not("company_id", "is", null)
      .order("due_date", { ascending: true, nullsFirst: false }),
    supabase
      .from("activities")
      .select("company_id, occurred_at")
      .eq("is_interaction", true)
      .not("company_id", "is", null)
      .order("occurred_at", { ascending: false })
      .limit(2000),
  ]);

  const rows = companies.data ?? [];
  const coverageBy = new Map((coverage.data ?? []).map((c) => [c.company_id, c]));
  const nextTaskBy = new Map<string, string>();
  for (const t of tasks.data ?? []) if (t.company_id && !nextTaskBy.has(t.company_id)) nextTaskBy.set(t.company_id, t.title);
  const lastBy = new Map<string, string>();
  for (const a of interactions.data ?? []) if (a.company_id && !lastBy.has(a.company_id)) lastBy.set(a.company_id, a.occurred_at);

  const coverageText = (id: string) => {
    const c = coverageBy.get(id);
    if (!c?.contact_count) return "No contacts";
    return `${c.contact_count} · ${labelFor(RELATIONSHIP_STAGES, c.furthest_stage)}`;
  };

  return (
    <Section title="Companies" count={rows.length}>
      {rows.length === 0 ? (
        <Empty>
          No companies yet.{" "}
          <Link href="/companies/new" className="text-accent">
            Add your first target
          </Link>
          .
        </Empty>
      ) : (
        <>
          <table className="hidden w-full border-collapse text-left text-[13px] md:table">
            <thead>
              <tr className="border-b border-border">
                <th className={th}>Company</th>
                <th className={th}>Priority</th>
                <th className={th}>Status</th>
                <th className={th}>Coverage</th>
                <th className={th}>Last interaction</th>
                <th className={th}>Next action</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((c) => (
                <tr key={c.id} className={row}>
                  <td className={td}>
                    <Link href={`/companies/${c.id}`} className="font-medium hover:underline">
                      {c.name}
                    </Link>
                    <p className="max-w-[28rem] truncate text-[12px] text-text-3">
                      {c.one_liner ?? c.company_industries.map((ci) => ci.industry?.name).filter(Boolean).join(", ")}
                    </p>
                  </td>
                  <td className={td}><PriorityPill value={c.priority} /></td>
                  <td className={td}><StatusPill value={c.status} /></td>
                  <td className={`${td} text-text-2`}>{coverageText(c.id)}</td>
                  <td className={`${td} num text-text-2`}>{formatRelative(lastBy.get(c.id))}</td>
                  <td className={`${td} text-text-2`}>{nextTaskBy.get(c.id) ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <ul className="md:hidden">
            {rows.map((c) => (
              <li key={c.id}>
                <Link href={`/companies/${c.id}`} className={`flex items-center gap-3 px-4 py-3 ${row}`}>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium">{c.name}</p>
                    <p className="truncate text-[12px] text-text-3">{coverageText(c.id)}</p>
                  </div>
                  <PriorityPill value={c.priority} />
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}
    </Section>
  );
}

async function People() {
  const supabase = await createClient();
  const [people, last, followUps] = await Promise.all([
    supabase
      .from("people")
      .select(
        "id, full_name, title, relationship_stage, company:companies(id, name), introducer:people!introduced_by_person_id(id, full_name)",
      )
      .is("archived_at", null)
      .order("full_name"),
    supabase.from("person_last_interaction").select("person_id, last_interaction_at"),
    supabase.from("person_next_follow_up").select("person_id, due_date"),
  ]);

  const rows = (people.data ?? []).map((p) => ({ ...p, introducer: one(p.introducer) }));
  const lastBy = new Map((last.data ?? []).map((l) => [l.person_id, l.last_interaction_at]));
  const followBy = new Map((followUps.data ?? []).map((f) => [f.person_id, f.due_date]));
  const today = new Date(new Date().toDateString());

  const followUp = (id: string) => {
    const due = followBy.get(id);
    if (!due) return <span className="text-text-3">—</span>;
    const overdue = new Date(due) < today;
    return <span className={overdue ? "font-medium text-danger" : ""}>{overdue ? `Overdue · ${formatDate(due)}` : formatDate(due)}</span>;
  };

  return (
    <Section title="People" count={rows.length}>
      {rows.length === 0 ? (
        <Empty>
          No people yet.{" "}
          <Link href="/people/new" className="text-accent">
            Add someone you know
          </Link>
          .
        </Empty>
      ) : (
        <>
          <table className="hidden w-full border-collapse text-left text-[13px] md:table">
            <thead>
              <tr className="border-b border-border">
                <th className={th}>Name</th>
                <th className={th}>Company</th>
                <th className={th}>Stage</th>
                <th className={th}>Follow-up</th>
                <th className={th}>Last interaction</th>
                <th className={th}>Introduced by</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((p) => (
                <tr key={p.id} className={row}>
                  <td className={td}>
                    <Link href={`/people/${p.id}`} className="font-medium hover:underline">
                      {p.full_name}
                    </Link>
                    {p.title && <p className="max-w-[18rem] truncate text-[12px] text-text-3">{p.title}</p>}
                  </td>
                  <td className={td}>
                    {p.company ? (
                      <Link href={`/companies/${p.company.id}`} className="text-text-2 hover:underline">
                        {p.company.name}
                      </Link>
                    ) : (
                      <span className="text-text-3">—</span>
                    )}
                  </td>
                  <td className={td}><StagePill value={p.relationship_stage} /></td>
                  <td className={`${td} num`}>{followUp(p.id)}</td>
                  <td className={`${td} num text-text-2`}>{formatRelative(lastBy.get(p.id))}</td>
                  <td className={td}>
                    {p.introducer ? (
                      <Link href={`/people/${p.introducer.id}`} className="text-text-2 hover:underline">
                        {p.introducer.full_name}
                      </Link>
                    ) : (
                      <span className="text-text-3">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <ul className="md:hidden">
            {rows.map((p) => (
              <li key={p.id}>
                <Link href={`/people/${p.id}`} className={`flex items-center gap-3 px-4 py-3 ${row}`}>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium">{p.full_name}</p>
                    <p className="truncate text-[12px] text-text-3">{[p.title, p.company?.name].filter(Boolean).join(" · ") || "—"}</p>
                  </div>
                  <StagePill value={p.relationship_stage} />
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}
    </Section>
  );
}

async function Documents() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("documents")
    .select("id, title, kind, version_label, created_at")
    .is("archived_at", null)
    .order("created_at", { ascending: false });

  return (
    <Section title="Documents" count={data?.length ?? 0}>
      {data?.length ? (
        <ul>
          {data.map((d) => (
            <li key={d.id} className={`flex justify-between gap-3 px-4 py-2.5 text-[13px] ${row}`}>
              <span>
                {d.title}
                {d.version_label && <span className="text-text-3"> · {d.version_label}</span>}
              </span>
              <span className="num text-text-3">{formatDate(d.created_at)}</span>
            </li>
          ))}
        </ul>
      ) : (
        <Empty>No documents yet. Uploads arrive in Step 9.</Empty>
      )}
    </Section>
  );
}
