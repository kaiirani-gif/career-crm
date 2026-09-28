"use client";

import Link from "next/link";
import { useActionState } from "react";
import { buttonClass, Field, FieldSet, FormError, Select, TextArea, TextInput } from "@/components/ui/form";
import { SubmitButton } from "@/components/ui/submit-button";
import type { Tables } from "@/lib/database.types";
import { COMPANY_STATUSES, PRIORITIES } from "@/lib/domain";
import type { FormState } from "@/lib/form-data";

type Props = {
  action: (prev: FormState, fd: FormData) => Promise<FormState>;
  industries: Pick<Tables<"industries">, "id" | "name">[];
  company?: Tables<"companies">;
  selectedIndustryIds?: string[];
  submitLabel: string;
  cancelHref: string;
};

export function CompanyForm({ action, industries, company, selectedIndustryIds = [], submitLabel, cancelHref }: Props) {
  const [state, formAction] = useActionState(action, {});

  return (
    <form action={formAction} className="max-w-[760px] space-y-4">
      <FormError message={state.error} />

      <FieldSet legend="Company">
        <Field label="Name" className="sm:col-span-2">
          <TextInput name="name" defaultValue={company?.name} required autoFocus={!company} placeholder="e.g. Blue Owl" />
        </Field>
        <Field label="One-line description" className="sm:col-span-2">
          <TextInput name="one_liner" defaultValue={company?.one_liner ?? ""} placeholder="What they do, in a sentence" />
        </Field>
        <Field label="Priority">
          <Select name="priority" options={PRIORITIES} defaultValue={company?.priority ?? "medium"} />
        </Field>
        <Field label="Status">
          <Select name="status" options={COMPANY_STATUSES} defaultValue={company?.status ?? "target"} />
        </Field>
      </FieldSet>

      <FieldSet legend="Industries">
        <div className="grid gap-2 sm:col-span-2 sm:grid-cols-2">
          {industries.map((i) => (
            <label key={i.id} className="flex items-center gap-2 text-[13px]">
              <input
                type="checkbox"
                name="industry_ids"
                value={i.id}
                defaultChecked={selectedIndustryIds.includes(i.id)}
                className="h-4 w-4 accent-[var(--accent)]"
              />
              {i.name}
            </label>
          ))}
        </div>
      </FieldSet>

      <FieldSet legend="Details">
        <Field label="Website">
          <TextInput name="website" defaultValue={company?.website ?? ""} placeholder="blueowl.com" inputMode="url" />
        </Field>
        <Field label="Careers page">
          <TextInput name="careers_url" defaultValue={company?.careers_url ?? ""} inputMode="url" />
        </Field>
        <Field label="Headquarters">
          <TextInput name="hq" defaultValue={company?.hq ?? ""} placeholder="New York" />
        </Field>
        <Field label="Relevant offices" hint="Separate with commas">
          <TextArea name="offices" rows={1} defaultValue={company?.offices.join(", ") ?? ""} placeholder="London, New York" />
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
