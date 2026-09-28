import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/primitives";
import { getCompanyOptions, getGroupOptions, getPeopleOptions } from "@/lib/queries";
import { createPerson } from "../actions";
import { PersonForm } from "../person-form";

export const metadata: Metadata = { title: "New person" };

export default async function NewPersonPage({ searchParams }: PageProps<"/people/new">) {
  const { company } = await searchParams;
  const [companies, groups, people] = await Promise.all([getCompanyOptions(), getGroupOptions(), getPeopleOptions()]);
  const defaultCompanyId = typeof company === "string" && companies.some((c) => c.id === company) ? company : undefined;

  return (
    <>
      <PageHeader title="New person" meta={<span className="md:hidden">New person</span>} />
      <PersonForm
        action={createPerson}
        companies={companies}
        groups={groups}
        people={people}
        defaultCompanyId={defaultCompanyId}
        submitLabel="Create person"
        cancelHref={defaultCompanyId ? `/companies/${defaultCompanyId}?tab=people` : "/directory?view=people"}
      />
    </>
  );
}
