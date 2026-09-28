import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink, Pencil } from "lucide-react";
import { Timeline } from "@/components/timeline";
import { ConfirmButton } from "@/components/ui/confirm-button";
import { buttonClass } from "@/components/ui/form";
import { Details, Section } from "@/components/ui/primitives";
import { labelFor, PERSON_SOURCES } from "@/lib/domain";
import { one } from "@/lib/form-data";
import { displayHost, formatDate, formatRelative } from "@/lib/format";
import { createClient } from "@/lib/supabase/server";
import { archivePerson } from "../actions";
import { StageSelect } from "./stage-select";

export async function generateMetadata({ params }: PageProps<"/people/[id]">): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from("people").select("full_name").eq("id", id).maybeSingle();
  return { title: data?.full_name ?? "Person" };
}

export default async function PersonPage({ params }: PageProps<"/people/[id]">) {
  const { id } = await params;
  const supabase = await createClient();

  const [person, introduced, lastInteraction, myTasks, theirCommitments, activities, insights] = await Promise.all([
    supabase
      .from("people")
      .select(
        "*, company:companies(id, name), group:company_groups(name), introducer:people!introduced_by_person_id(id, full_name)",
      )
      .eq("id", id)
      .is("archived_at", null)
      .maybeSingle(),
    supabase
      .from("people")
      .select("id, full_name, company:companies(name)")
      .eq("introduced_by_person_id", id)
      .is("archived_at", null)
      .order("full_name"),
    supabase.from("person_last_interaction").select("last_interaction_at").eq("person_id", id).maybeSingle(),
    supabase
      .from("tasks")
      .select("id, title, due_date")
      .eq("person_id", id)
      .eq("owner", "me")
      .eq("status", "open")
      .order("due_date", { ascending: true, nullsFirst: false }),
    supabase
      .from("tasks")
      .select("id, title, due_date")
      .eq("owner_person_id", id)
      .eq("status", "open")
      .order("due_date", { ascending: true, nullsFirst: false }),
    supabase
      .from("activities")
      .select("id, occurred_at, type, summary, body, source, related_person_id, subject:people!activities_person_id_fkey(full_name)")
      .or(`person_id.eq.${id},related_person_id.eq.${id}`)
      .order("occurred_at", { ascending: false })
      .limit(100),
    supabase.from("insights").select("id, content, category, occurred_at").eq("person_id", id).order("occurred_at", { ascending: false }),
  ]);

  const p = person.data;
  if (!p) notFound();
  const introducer = one(p.introducer);

  const introducedRows = introduced.data ?? [];

  // Introductions are stored once; on the introducer's page, phrase them from their side.
  const timeline = (activities.data ?? []).map((a) =>
    a.type === "intro_made" && a.related_person_id === id && a.subject
      ? { ...a, summary: `Introduced you to ${a.subject.full_name}` }
      : a,
  );
  const nextTask = myTasks.data?.[0];
  const overdue = nextTask?.due_date ? new Date(nextTask.due_date) < new Date(new Date().toDateString()) : false;

  // The one-line story of the relationship.
  const thread = [
    introducer ? `Introduced by ${introducer.full_name}` : labelFor(PERSON_SOURCES, p.source),
    `added ${formatDate(p.created_at, { year: true })}`,
    introducedRows.length ? `introduced you to ${introducedRows.length} ${introducedRows.length === 1 ? "person" : "people"}` : "",
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <>
      {/* Header */}
      <div className="mb-5">
        <Link href="/directory?view=people" className="text-[12px] text-text-3 hover:text-text-2">
          People
        </Link>
        <div className="mt-1 flex flex-wrap items-start gap-x-4 gap-y-3">
          <div className="min-w-0 flex-1">
            <h1 className="text-[22px] font-semibold tracking-tight">
              {p.full_name}
              {p.preferred_name && <span className="ml-2 text-[15px] font-normal text-text-3">“{p.preferred_name}”</span>}
            </h1>
            <p className="mt-0.5 text-[14px] text-text-2">
              {[p.title, p.group?.name].filter(Boolean).join(", ")}
              {p.company && (
                <>
                  {p.title || p.group ? " · " : ""}
                  <Link href={`/companies/${p.company.id}`} className="text-accent hover:underline">
                    {p.company.name}
                  </Link>
                </>
              )}
            </p>
            <p className="mt-1 text-[12px] text-text-3">{thread}</p>
          </div>
          <Link href={`/people/${id}/edit`} className={buttonClass.secondary}>
            <Pencil size={14} /> Edit
          </Link>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-3 rounded-lg border border-border bg-surface px-4 py-3">
          <StageSelect key={p.relationship_stage} personId={id} stage={p.relationship_stage} />
          <Stat label="Last interaction" value={formatRelative(lastInteraction.data?.last_interaction_at)} />
          <Stat
            label="Next action"
            value={nextTask ? `${nextTask.title}${nextTask.due_date ? ` · ${formatDate(nextTask.due_date)}` : ""}` : "—"}
            danger={overdue}
          />
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <div className="space-y-4">
          <Section title="Open loops">
            <div className="grid sm:grid-cols-2 sm:divide-x sm:divide-border">
              <Loop title="I owe them" items={myTasks.data ?? []} />
              <Loop title="They owe me" items={theirCommitments.data ?? []} />
            </div>
          </Section>

          <Section title="Timeline">
            <Timeline activities={timeline} />
          </Section>
        </div>

        <div className="space-y-4">
          <Section title="Relationship">
            <Details
              rows={[
                {
                  label: "Introduced by",
                  value: introducer && (
                    <Link href={`/people/${introducer.id}`} className="text-accent hover:underline">
                      {introducer.full_name}
                    </Link>
                  ),
                },
                {
                  label: "Introduced you to",
                  value: introducedRows.length > 0 && (
                    <span className="flex flex-col gap-0.5">
                      {introducedRows.map((r) => (
                        <Link key={r.id} href={`/people/${r.id}`} className="text-accent hover:underline">
                          {r.full_name}
                          {r.company?.name && <span className="text-text-3"> · {r.company.name}</span>}
                        </Link>
                      ))}
                    </span>
                  ),
                },
                { label: "How you know them", value: p.how_we_met && <span className="whitespace-pre-line">{p.how_we_met}</span> },
                { label: "Follow-up cadence", value: p.follow_up_cadence_days ? `Every ${p.follow_up_cadence_days} days` : "Default" },
              ]}
            />
          </Section>

          <Section title="Contact">
            <Details
              rows={[
                { label: "Email", value: p.email && <a href={`mailto:${p.email}`} className="text-accent">{p.email}</a> },
                { label: "Phone", value: p.phone && <a href={`tel:${p.phone}`} className="num text-accent">{p.phone}</a> },
                {
                  label: "LinkedIn",
                  value: p.linkedin_url && (
                    <a href={p.linkedin_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-accent">
                      {displayHost(p.linkedin_url)} <ExternalLink size={12} />
                    </a>
                  ),
                },
                { label: "Location", value: p.location },
              ]}
            />
          </Section>

          <Section title="Knowledge">
            <Details
              rows={[
                { label: "Background", value: p.background && <span className="whitespace-pre-line">{p.background}</span> },
                { label: "Personal notes", value: p.personal_notes && <span className="whitespace-pre-line">{p.personal_notes}</span> },
              ]}
            />
            {insights.data?.length ? (
              <ul className="border-t border-border">
                {insights.data.map((i) => (
                  <li key={i.id} className="border-b border-border px-4 py-2.5 text-[13px] last:border-b-0">
                    {i.content}
                    <span className="ml-2 text-[11px] text-text-3">{formatDate(i.occurred_at)}</span>
                  </li>
                ))}
              </ul>
            ) : null}
          </Section>
        </div>
      </div>

      <div className="mt-8 border-t border-border pt-4">
        <ConfirmButton action={archivePerson.bind(null, id)} label="Archive person" confirmLabel="Archive" />
      </div>
    </>
  );
}

function Stat({ label, value, danger }: { label: string; value: string; danger?: boolean }) {
  return (
    <div className="min-w-0">
      <span className="label mr-2">{label}</span>
      <span className={danger ? "text-[13px] font-medium text-danger" : "text-[13px]"}>{value}</span>
    </div>
  );
}

function Loop({ title, items }: { title: string; items: { id: string; title: string; due_date: string | null }[] }) {
  return (
    <div className="border-b border-border last:border-b-0 sm:border-b-0">
      <p className="px-4 pt-3 text-[12px] font-medium text-text-2">{title}</p>
      {items.length ? (
        <ul className="pb-2">
          {items.map((t) => (
            <li key={t.id} className="flex justify-between gap-3 px-4 py-1.5 text-[13px]">
              {t.title}
              <span className="num shrink-0 text-text-3">{formatDate(t.due_date)}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="px-4 pb-3 pt-1 text-[13px] text-text-3">Nothing outstanding.</p>
      )}
    </div>
  );
}
