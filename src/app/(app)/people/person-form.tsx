"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { buttonClass, Field, FieldSet, FormError, Select, TextArea, TextInput } from "@/components/ui/form";
import { SubmitButton } from "@/components/ui/submit-button";
import type { Tables } from "@/lib/database.types";
import { PERSON_SOURCES, RELATIONSHIP_STAGES } from "@/lib/domain";
import type { FormState } from "@/lib/form-data";

const NEW_COMPANY = "__new";

type Props = {
  action: (prev: FormState, fd: FormData) => Promise<FormState>;
  companies: { id: string; name: string }[];
  groups: { id: string; name: string; company_id: string }[];
  people: { id: string; label: string }[];
  person?: Tables<"people">;
  defaultCompanyId?: string;
  submitLabel: string;
  cancelHref: string;
};

export function PersonForm({ action, companies, groups, people, person, defaultCompanyId, submitLabel, cancelHref }: Props) {
  const [state, formAction] = useActionState(action, {});
  const [companyId, setCompanyId] = useState(person?.company_id ?? defaultCompanyId ?? "");
  const companyGroups = groups.filter((g) => g.company_id === companyId);

  return (
    <form action={formAction} className="max-w-[760px] space-y-4">
      <FormError message={state.error} />

      <FieldSet legend="Person">
        <Field label="Full name">
          <TextInput name="full_name" defaultValue={person?.full_name} required autoFocus={!person} autoComplete="off" />
        </Field>
        <Field label="Preferred name" hint="What you call them, if different">
          <TextInput name="preferred_name" defaultValue={person?.preferred_name ?? ""} autoComplete="off" />
        </Field>
        <Field label="Company">
          <select
            name="company_id"
            value={companyId}
            onChange={(e) => setCompanyId(e.target.value)}
            className="w-full rounded-md border border-border bg-surface px-3 py-2 text-[15px] text-text focus:border-accent focus:outline-none md:text-[13px]"
          >
            <option value="">None</option>
            <option value={NEW_COMPANY}>+ New company…</option>
            {companies.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </Field>
        {companyId === NEW_COMPANY ? (
          <Field label="New company name">
            <TextInput name="new_company_name" required autoFocus placeholder="e.g. Brookfield" />
          </Field>
        ) : (
          <Field label="Group" hint={companyId && companyGroups.length === 0 ? "No groups at this company yet" : undefined}>
            <Select
              key={companyId}
              name="group_id"
              options={companyGroups.map((g) => ({ value: g.id, label: g.name }))}
              placeholder="None"
              defaultValue={person?.company_id === companyId ? (person?.group_id ?? "") : ""}
              disabled={companyGroups.length === 0}
            />
          </Field>
        )}
        <Field label="Title" className="sm:col-span-2">
          <TextInput name="title" defaultValue={person?.title ?? ""} placeholder="e.g. Vice President, Real Estate Credit" />
        </Field>
      </FieldSet>

      <FieldSet legend="Relationship">
        <Field label="Networking stage">
          <Select name="relationship_stage" options={RELATIONSHIP_STAGES} defaultValue={person?.relationship_stage ?? "identified"} />
        </Field>
        <Field label="Introduced by">
          <Select
            name="introduced_by_person_id"
            options={people.filter((p) => p.id !== person?.id).map((p) => ({ value: p.id, label: p.label }))}
            placeholder="Nobody"
            defaultValue={person?.introduced_by_person_id ?? ""}
          />
        </Field>
        <Field label="Source" hint="Set automatically to Introduction when an introducer is chosen">
          <Select name="source" options={PERSON_SOURCES} placeholder="—" defaultValue={person?.source ?? ""} />
        </Field>
        <Field label="Follow-up cadence (days)" hint="Leave blank to use your default">
          <TextInput
            name="follow_up_cadence_days"
            type="number"
            min={1}
            inputMode="numeric"
            defaultValue={person?.follow_up_cadence_days ?? ""}
          />
        </Field>
        <Field label="How you know them" className="sm:col-span-2">
          <TextArea name="how_we_met" rows={2} defaultValue={person?.how_we_met ?? ""} />
        </Field>
      </FieldSet>

      <FieldSet legend="Contact">
        <Field label="Email">
          <TextInput name="email" type="email" defaultValue={person?.email ?? ""} autoComplete="off" />
        </Field>
        <Field label="Phone">
          <TextInput name="phone" type="tel" defaultValue={person?.phone ?? ""} autoComplete="off" />
        </Field>
        <Field label="LinkedIn">
          <TextInput name="linkedin_url" defaultValue={person?.linkedin_url ?? ""} inputMode="url" />
        </Field>
        <Field label="Location">
          <TextInput name="location" defaultValue={person?.location ?? ""} placeholder="London" />
        </Field>
      </FieldSet>

      <FieldSet legend="Knowledge">
        <Field label="Background" className="sm:col-span-2" hint="Career history, education, areas of expertise">
          <TextArea name="background" defaultValue={person?.background ?? ""} />
        </Field>
        <Field label="Personal notes" className="sm:col-span-2" hint="Things to remember. Not shared with AI features unless you choose to.">
          <TextArea name="personal_notes" defaultValue={person?.personal_notes ?? ""} />
        </Field>
      </FieldSet>

      <div className="flex items-center gap-3">
        <SubmitButton>{submitLabel}</SubmitButton>
        <Link href={cancelHref} className={buttonClass.quiet}>
          Cancel
        </Link>
      </div>
    </form>
  );
}
