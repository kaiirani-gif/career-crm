import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/ui/primitives";
import { getCompanyOptions, getGroupOptions, getPeopleOptions } from "@/lib/queries";
import { createClient } from "@/lib/supabase/server";
import { updatePerson } from "../../actions";
import { PersonForm } from "../../person-form";

export const metadata: Metadata = { title: "Edit person" };

export default async function EditPersonPage({ params }: PageProps<"/people/[id]/edit">) {
  const { id } = await params;
  const supabase = await createClient();
  const [{ data: person }, companies, groups, people] = await Promise.all([
    supabase.from("people").select("*").eq("id", id).is("archived_at", null).maybeSingle(),
    getCompanyOptions(),
    getGroupOptions(),
    getPeopleOptions(),
  ]);
  if (!person) notFound();

  return (
    <>
      <PageHeader title={`Edit ${person.full_name}`} meta={<span className="md:hidden">Edit {person.full_name}</span>} />
      <PersonForm
        action={updatePerson.bind(null, id)}
        companies={companies}
        groups={groups}
        people={people}
        person={person}
        submitLabel="Save changes"
        cancelHref={`/people/${id}`}
      />
    </>
  );
}
