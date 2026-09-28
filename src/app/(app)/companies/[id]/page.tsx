import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink, Pencil, UserPlus } from "lucide-react";
import { Timeline } from "@/components/timeline";
import { ConfirmButton } from "@/components/ui/confirm-button";
import { buttonClass } from "@/components/ui/form";
import { PriorityPill, StagePill, StatusPill } from "@/components/ui/pills";
import { Details, Empty, Section, Tabs } from "@/components/ui/primitives";
import { labelFor, RELATIONSHIP_STAGES } from "@/lib/domain";
import { displayHost, formatDate, formatRelative } from "@/lib/format";
import { createClient } from "@/lib/supabase/server";
import { archiveCompany } from "../actions";
import { Groups } from "./groups";

const TABS = ["overview", "groups", "people", "opportunities", "timeline", "intelligence"] as const;
type Tab = (typeof TABS)[number];

export async function generateMetadata({ params }: PageProps<"/companies/[id]">): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from("companies").select("name").eq("id", id).maybeSingle();
  return { title: data?.name ?? "Company" };
}

export default async function CompanyPage({ params, searchParams }: PageProps<"/companies/[id]">) {
  const { id } = await params;
  const { tab: rawTab } = await searchParams;
  const tab: Tab = TABS.includes(rawTab as Tab) ? (rawTab as Tab) : "overview";

  const supabase = await createClient();
  const [company, industries, groups, people, coverage, tasks, activities, opportunities, insights] = await Promise.all([
    supabase.from("companies").select("*").eq("id", id).is("archived_at", null).maybeSingle(),
    supabase.from("company_industries").select("industry:industries(name)").eq("company_id", id),
    supabase
      .from("company_groups")
      .select("id, name, description, locations, is_focus")
      .eq("company_id", id)
      .is("archived_at", null)
      .order("is_focus", { ascending: false })
      .order("name"),
    supabase
      .from("people")
      .select("id, full_name, title, group_id, relationship_stage, group:company_groups(name)")
      .eq("company_id", id)
      .is("archived_at", null)
      .order("full_name"),
    supabase.from("company_coverage").select("contact_count, furthest_stage").eq("company_id", id).maybeSingle(),
    supabase
      .from("tasks")
      .select("id, title, due_date")
      .eq("company_id", id)
      .eq("status", "open")
      .order("due_date", { ascending: true, nullsFirst: false })
      .limit(5),
    supabase
      .from("activities")
      .select("id, occurred_at, type, summary, body, source, is_interaction")
      .eq("company_id", id)
      .order("occurred_at", { ascending: false })
      .limit(100),
    supabase.from("opportunities").select("id, title, kind, stage, state").eq("company_id", id).is("archived_at", null),
    supabase.from("insights").select("id, content, category, occurred_at").eq("company_id", id).order("occurred_at", { ascending: false }),
  ]);

  const c = company.data;
  if (!c) notFound();

  const peopleRows = people.data ?? [];
  const groupRows = groups.data ?? [];
  const activityRows = activities.data ?? [];
  const lastInteraction = activityRows.find((a) => a.is_interaction)?.occurred_at ?? null;
  const focusGroups = groupRows.filter((g) => g.is_focus).map((g) => g.name);
  const industryNames = (industries.data ?? []).map((l) => l.industry?.name).filter(Boolean);
  const peopleCounts = peopleRows.reduce<Record<string, number>>((acc, p) => {
    if (p.group_id) acc[p.group_id] = (acc[p.group_id] ?? 0) + 1;
    return acc;
  }, {});
  const cov = coverage.data;

  const tabs = [
    { value: "overview", label: "Overview" },
    { value: "groups", label: "Groups", count: groupRows.length },
    { value: "people", label: "People", count: peopleRows.length },
    { value: "opportunities", label: "Opportunities", count: opportunities.data?.length ?? 0 },
    { value: "timeline", label: "Timeline" },
    { value: "intelligence", label: "Intelligence", count: insights.data?.length ?? 0 },
  ].map((t) => ({ ...t, href: `/companies/${id}?tab=${t.value}` }));

  return (
    <>
      {/* Header */}
      <div className="mb-5">
        <Link href="/directory" className="text-[12px] text-text-3 hover:text-text-2">
          Directory
        </Link>
        <div className="mt-1 flex flex-wrap items-start gap-x-4 gap-y-3">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-[22px] font-semibold tracking-tight">{c.name}</h1>
              <PriorityPill value={c.priority} />
              <StatusPill value={c.status} />
            </div>
            {c.one_liner && <p className="mt-1 text-[14px] text-text-2">{c.one_liner}</p>}
            {(industryNames.length > 0 || focusGroups.length > 0) && (
              <p className="mt-1 text-[12px] text-text-3">
                {[industryNames.join(", "), focusGroups.length ? `Focus: ${focusGroups.join(", ")}` : ""]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Link href={`/people/new?company=${id}`} className={buttonClass.secondary}>
              <UserPlus size={14} /> Person
            </Link>
            <Link href={`/companies/${id}/edit`} className={buttonClass.secondary}>
              <Pencil size={14} /> Edit
            </Link>
          </div>
        </div>

        <dl className="mt-4 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-4">
          <Stat label="Contacts" value={String(cov?.contact_count ?? 0)} />
          <Stat
            label="Furthest stage"
            value={cov?.furthest_stage ? labelFor(RELATIONSHIP_STAGES, cov.furthest_stage) : "—"}
          />
          <Stat label="Last interaction" value={formatRelative(lastInteraction)} />
          <Stat label="Next action" value={tasks.data?.[0]?.title ?? "—"} />
        </dl>
      </div>

      <Tabs items={tabs} active={tab} />

      {tab === "overview" && (
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <Section title="Details">
            <Details
              rows={[
                {
                  label: "Website",
                  value: c.website && (
                    <a href={c.website} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-accent">
                      {displayHost(c.website)} <ExternalLink size={12} />
                    </a>
                  ),
                },
                {
                  label: "Careers",
                  value: c.careers_url && (
                    <a href={c.careers_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-accent">
                      {displayHost(c.careers_url)} <ExternalLink size={12} />
                    </a>
                  ),
                },
                { label: "Headquarters", value: c.hq },
                { label: "Offices", value: c.offices.join(", ") },
                { label: "Added", value: formatDate(c.created_at, { year: true }) },
              ]}
            />
          </Section>
          <div className="space-y-4">
            <Section title="Open tasks" count={tasks.data?.length ?? 0}>
              {tasks.data?.length ? (
                <ul>
                  {tasks.data.map((t) => (
                    <li key={t.id} className="flex justify-between gap-3 border-b border-border px-4 py-2.5 text-[13px] last:border-b-0">
                      {t.title}
                      <span className="num text-text-3">{formatDate(t.due_date)}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <Empty>No open tasks.</Empty>
              )}
            </Section>
            <Section title="Research">
              <Empty>No research yet.</Empty>
            </Section>
          </div>
        </div>
      )}

      {tab === "groups" && (
        <Section title="Groups" count={groupRows.length}>
          <Groups companyId={id} groups={groupRows} peopleCounts={peopleCounts} />
        </Section>
      )}

      {tab === "people" && (
        <Section
          title="People"
          count={peopleRows.length}
          action={
            <Link href={`/people/new?company=${id}`} className="text-text-2 hover:text-text">
              Add person
            </Link>
          }
        >
          {peopleRows.length ? (
            <ul>
              {peopleRows.map((p) => (
                <li key={p.id}>
                  <Link
                    href={`/people/${p.id}`}
                    className="flex items-center gap-3 border-b border-border px-4 py-2.5 last:border-b-0 hover:bg-surface-2/60"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-[14px] font-medium">{p.full_name}</p>
                      <p className="truncate text-[12px] text-text-3">{[p.title, p.group?.name].filter(Boolean).join(" · ")}</p>
                    </div>
                    <StagePill value={p.relationship_stage} />
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <Empty>No people at {c.name} yet.</Empty>
          )}
        </Section>
      )}

      {tab === "opportunities" && (
        <Section title="Opportunities" count={opportunities.data?.length ?? 0}>
          <Empty>No opportunities yet.</Empty>
        </Section>
      )}

      {tab === "timeline" && (
        <Section title="Timeline">
          <Timeline activities={activityRows} />
        </Section>
      )}

      {tab === "intelligence" && (
        <Section title="Intelligence" count={insights.data?.length ?? 0}>
          <Empty>Insights from your meetings will collect here.</Empty>
        </Section>
      )}

      <div className="mt-8 border-t border-border pt-4">
        <ConfirmButton action={archiveCompany.bind(null, id)} label="Archive company" confirmLabel="Archive" />
      </div>
    </>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-surface px-3 py-2.5">
      <dt className="label">{label}</dt>
      <dd className="mt-0.5 truncate text-[13px]">{value}</dd>
    </div>
  );
}
