"use server";

import { revalidatePath } from "next/cache";
import { isOption, PRIORITIES } from "@/lib/domain";
import { text, type FormState } from "@/lib/form-data";
import { createClient } from "@/lib/supabase/server";

export async function updateIndustry(industryId: string, fd: FormData) {
  const name = text(fd, "name");
  const priority = fd.get("priority");
  if (!name || !isOption(PRIORITIES, priority)) return;

  const supabase = await createClient();
  await supabase.from("industries").update({ name, priority }).eq("id", industryId);
  revalidatePath("/settings");
}

export async function addIndustry(_prev: FormState, fd: FormData): Promise<FormState> {
  const name = text(fd, "name");
  const priority = fd.get("priority");
  if (!name) return { error: "Enter the industry name." };

  const supabase = await createClient();
  const { data: last } = await supabase
    .from("industries")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();
  const { error } = await supabase.from("industries").insert({
    name,
    priority: isOption(PRIORITIES, priority) ? priority : "medium",
    sort_order: (last?.sort_order ?? 0) + 1,
  });
  if (error) return { error: error.code === "23505" ? "That industry already exists." : error.message };

  revalidatePath("/settings");
  return {};
}

// Removing an industry also removes it from any companies tagged with it.
export async function removeIndustry(industryId: string) {
  const supabase = await createClient();
  await supabase.from("industries").delete().eq("id", industryId);
  revalidatePath("/settings");
}
