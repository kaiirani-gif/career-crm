"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isOption, PERSON_SOURCES, RELATIONSHIP_STAGES, type RelationshipStage } from "@/lib/domain";
import { id, positiveInt, text, type FormState } from "@/lib/form-data";
import { normaliseUrl } from "@/lib/format";
import { createClient } from "@/lib/supabase/server";

type Supabase = Awaited<ReturnType<typeof createClient>>;

const NEW_COMPANY = "__new";

// Resolves the company picker: an existing company, or a new one typed inline
// so a person can be captured without leaving the form.
async function resolveCompany(supabase: Supabase, fd: FormData): Promise<{ companyId: string | null; error?: string }> {
  if (fd.get("company_id") !== NEW_COMPANY) return { companyId: id(fd, "company_id") };

  const name = text(fd, "new_company_name");
  if (!name) return { companyId: null, error: "Enter the new company's name." };

  const { data: existing } = await supabase
    .from("companies")
    .select("id")
    .ilike("name", name)
    .is("archived_at", null)
    .maybeSingle();
  if (existing) return { companyId: existing.id };

  const { data, error } = await supabase.from("companies").insert({ name }).select("id").single();
  if (error) return { companyId: null, error: error.message };
  return { companyId: data.id };
}

async function personFields(supabase: Supabase, fd: FormData) {
  const { companyId, error } = await resolveCompany(supabase, fd);
  if (error) return { error };

  // A group only makes sense within the chosen company.
  let groupId = id(fd, "group_id");
  if (groupId) {
    const { data: group } = await supabase.from("company_groups").select("company_id").eq("id", groupId).maybeSingle();
    if (!group || group.company_id !== companyId) groupId = null;
  }

  const introducedBy = id(fd, "introduced_by_person_id");
  const source = fd.get("source");
  const stage = fd.get("relationship_stage");

  return {
    fields: {
      full_name: text(fd, "full_name"),
      preferred_name: text(fd, "preferred_name"),
      company_id: companyId,
      group_id: groupId,
      title: text(fd, "title"),
      email: text(fd, "email"),
      phone: text(fd, "phone"),
      linkedin_url: normaliseUrl(text(fd, "linkedin_url")),
      location: text(fd, "location"),
      how_we_met: text(fd, "how_we_met"),
      introduced_by_person_id: introducedBy,
      source: isOption(PERSON_SOURCES, source) ? source : introducedBy ? "introduction" : "other",
      relationship_stage: isOption(RELATIONSHIP_STAGES, stage) ? stage : "identified",
      follow_up_cadence_days: positiveInt(fd, "follow_up_cadence_days"),
      background: text(fd, "background"),
      personal_notes: text(fd, "personal_notes"),
    },
  };
}

// Records an introduction on the timeline of the person introduced; it also
// appears on the introducer's history via related_person_id.
async function logIntroduction(supabase: Supabase, personId: string, introducerId: string) {
  const { data: introducer } = await supabase.from("people").select("full_name").eq("id", introducerId).maybeSingle();
  if (!introducer) return;
  await supabase.from("activities").insert({
    type: "intro_made",
    summary: `Introduced by ${introducer.full_name}`,
    person_id: personId,
    related_person_id: introducerId,
    source: "user",
  });
}

export async function createPerson(_prev: FormState, fd: FormData): Promise<FormState> {
  const supabase = await createClient();
  const result = await personFields(supabase, fd);
  if ("error" in result) return { error: result.error };
  const { fields } = result;
  if (!fields.full_name) return { error: "Enter the person's name." };

  const { data, error } = await supabase
    .from("people")
    .insert({ ...fields, full_name: fields.full_name })
    .select("id")
    .single();
  if (error) return { error: error.message };

  if (fields.introduced_by_person_id) await logIntroduction(supabase, data.id, fields.introduced_by_person_id);

  revalidatePath("/directory");
  redirect(`/people/${data.id}`);
}

export async function updatePerson(personId: string, _prev: FormState, fd: FormData): Promise<FormState> {
  const supabase = await createClient();
  const result = await personFields(supabase, fd);
  if ("error" in result) return { error: result.error };
  const { fields } = result;
  if (!fields.full_name) return { error: "Enter the person's name." };
  if (fields.introduced_by_person_id === personId) return { error: "A person cannot introduce themselves." };

  const { data: before } = await supabase.from("people").select("introduced_by_person_id").eq("id", personId).maybeSingle();

  const { error } = await supabase
    .from("people")
    .update({ ...fields, full_name: fields.full_name })
    .eq("id", personId);
  if (error) return { error: error.message };

  if (fields.introduced_by_person_id && fields.introduced_by_person_id !== before?.introduced_by_person_id) {
    await logIntroduction(supabase, personId, fields.introduced_by_person_id);
  }

  revalidatePath(`/people/${personId}`);
  redirect(`/people/${personId}`);
}

export async function setStage(personId: string, stage: RelationshipStage) {
  if (!isOption(RELATIONSHIP_STAGES, stage)) return;
  const supabase = await createClient();
  await supabase.from("people").update({ relationship_stage: stage }).eq("id", personId);
  revalidatePath(`/people/${personId}`);
  revalidatePath("/pipeline");
}

export async function archivePerson(personId: string) {
  const supabase = await createClient();
  await supabase.from("people").update({ archived_at: new Date().toISOString() }).eq("id", personId);
  revalidatePath("/directory");
  redirect("/directory?view=people");
}
