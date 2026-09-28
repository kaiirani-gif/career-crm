import "server-only";
import { createClient } from "@/lib/supabase/server";

// Lookup lists used by forms. Archived records are excluded throughout.

export async function getIndustries() {
  const supabase = await createClient();
  const { data } = await supabase.from("industries").select("id, name, priority, sort_order").order("sort_order");
  return data ?? [];
}

export async function getCompanyOptions() {
  const supabase = await createClient();
  const { data } = await supabase.from("companies").select("id, name").is("archived_at", null).order("name");
  return data ?? [];
}

export async function getGroupOptions() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("company_groups")
    .select("id, name, company_id")
    .is("archived_at", null)
    .order("name");
  return data ?? [];
}

export async function getPeopleOptions() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("people")
    .select("id, full_name, company:companies(name)")
    .is("archived_at", null)
    .order("full_name");
  return (data ?? []).map((p) => ({
    id: p.id,
    label: p.company?.name ? `${p.full_name} (${p.company.name})` : p.full_name,
  }));
}
