import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/primitives";
import { getIndustries } from "@/lib/queries";
import { createCompany } from "../actions";
import { CompanyForm } from "../company-form";

export const metadata: Metadata = { title: "New company" };

export default async function NewCompanyPage() {
  const industries = await getIndustries();
  return (
    <>
      <PageHeader title="New company" meta={<span className="md:hidden">New company</span>} />
      <CompanyForm action={createCompany} industries={industries} submitLabel="Create company" cancelHref="/directory" />
    </>
  );
}
