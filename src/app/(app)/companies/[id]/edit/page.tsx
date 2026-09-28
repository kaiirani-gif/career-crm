import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/ui/primitives";
import { getIndustries } from "@/lib/queries";
import { createClient } from "@/lib/supabase/server";
import { updateCompany } from "../../actions";
import { CompanyForm } from "../../company-form";

export const metadata: Metadata = { title: "Edit company" };

export default async function EditCompanyPage({ params }: PageProps<"/companies/[id]/edit">) {
  const { id } = await params;
  const supabase = await createClient();
  const [{ data: company }, { data: links }, industries] = await Promise.all([
    supabase.from("companies").select("*").eq("id", id).is("archived_at", null).maybeSingle(),
    supabase.from("company_industries").select("industry_id").eq("company_id", id),
    getIndustries(),
  ]);
  if (!company) notFound();

  return (
    <>
      <PageHeader title={`Edit ${company.name}`} meta={<span className="md:hidden">Edit {company.name}</span>} />
      <CompanyForm
        action={updateCompany.bind(null, id)}
        industries={industries}
        company={company}
        selectedIndustryIds={(links ?? []).map((l) => l.industry_id)}
        submitLabel="Save changes"
        cancelHref={`/companies/${id}`}
      />
    </>
  );
}
