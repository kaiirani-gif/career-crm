"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { COMPANY_STATUSES, isOption, PRIORITIES } from "@/lib/domain";
import { ids, text, type FormState } from "@/lib/form-data";
import { normaliseUrl, splitList } from "@/lib/format";
import { createClient } from "@/lib/supabase/server";

function companyFields(fd: FormData) {
  const priority = fd.get("priority");
  const status = fd.get("status");
  return {
    name: text(fd, "name"),
    one_liner: text(fd, "one_liner"),
    website: normaliseUrl(text(fd, "website")),
    careers_url: normaliseUrl(text(fd, "careers_url")),
    hq: text(fd, "hq"),
    offices: splitList(text(fd, "offices")),
    priority: isOption(PRIORITIES, priority) ? priority : "medium",
    status: isOption(COMPANY_STATUSES, status) ? status : "target",
  };
}

async function setIndustries(companyId: string, industryIds: string[]) {
  const supabase = await createClient();
  await supabase.from("company_industries").delete().eq("company_id", companyId);
  if (industryIds.length) {
    await supabase
      .from("company_industries")
      .insert(industryIds.map((industry_id) => ({ company_id: companyId, industry_id })));
  }
}

export async function createCompany(_prev: FormState, fd: FormData): Promise<FormState> {
  const fields = companyFields(fd);
  if (!fields.name) return { error: "Enter the company name." };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("companies")
    .insert({ ...fields, name: fields.name })
    .select("id")
    .single();
  if (error) return { error: error.message };

  await setIndustries(data.id, ids(fd, "industry_ids"));
  revalidatePath("/directory");
  redirect(`/companies/${data.id}`);
}

export async function updateCompany(companyId: string, _prev: FormState, fd: FormData): Promise<FormState> {
  const fields = companyFields(fd);
  if (!fields.name) return { error: "Enter the company name." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("companies")
    .update({ ...fields, name: fields.name })
    .eq("id", companyId);
  if (error) return { error: error.message };

  await setIndustries(companyId, ids(fd, "industry_ids"));
  revalidatePath(`/companies/${companyId}`);
  redirect(`/companies/${companyId}`);
}

export async function archiveCompany(companyId: string) {
  const supabase = await createClient();
  await supabase.from("companies").update({ archived_at: new Date().toISOString() }).eq("id", companyId);
  revalidatePath("/directory");
  redirect("/directory");
}

// Groups (divisions / teams)

export async function addGroup(companyId: string, _prev: FormState, fd: FormData): Promise<FormState> {
  const name = text(fd, "name");
  if (!name) return { error: "Enter the group name." };

  const supabase = await createClient();
  const { error } = await supabase.from("company_groups").insert({
    company_id: companyId,
    name,
    description: text(fd, "description"),
    locations: splitList(text(fd, "locations")),
    is_focus: fd.get("is_focus") === "on",
  });
  if (error) {
    return { error: error.code === "23505" ? "A group with that name already exists." : error.message };
  }

  revalidatePath(`/companies/${companyId}`);
  return {};
}

export async function setGroupFocus(groupId: string, companyId: string, isFocus: boolean) {
  const supabase = await createClient();
  await supabase.from("company_groups").update({ is_focus: isFocus }).eq("id", groupId);
  revalidatePath(`/companies/${companyId}`);
}

export async function deleteGroup(groupId: string, companyId: string) {
  const supabase = await createClient();
  await supabase.from("company_groups").delete().eq("id", groupId);
  revalidatePath(`/companies/${companyId}`);
}
