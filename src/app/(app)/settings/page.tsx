import type { Metadata } from "next";
import { signOut } from "@/app/login/actions";
import { buttonClass } from "@/components/ui/form";
import { PageHeader, Section } from "@/components/ui/primitives";
import { createClient } from "@/lib/supabase/server";
import { Industries } from "./industries";

export const metadata: Metadata = { title: "Settings" };

export default async function SettingsPage() {
  const supabase = await createClient();
  const [{ data: industries }, { data: links }] = await Promise.all([
    supabase.from("industries").select("id, name, priority").order("sort_order"),
    supabase.from("company_industries").select("industry_id, company:companies!inner(archived_at)").is("company.archived_at", null),
  ]);

  const counts = (links ?? []).reduce<Record<string, number>>((acc, l) => {
    acc[l.industry_id] = (acc[l.industry_id] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <>
      <PageHeader title="Settings" meta={<span className="md:hidden">Settings</span>} />
      <Section title="Target industries" count={industries?.length ?? 0} className="max-w-[760px]">
        <p className="border-b border-border px-4 py-2.5 text-[12px] text-text-3">
          Priority is a simple High, Medium or Low. Changes save as you make them.
        </p>
        <Industries industries={(industries ?? []).map((i) => ({ ...i, companies: counts[i.id] ?? 0 }))} />
      </Section>

      <form action={signOut} className="mt-6 md:hidden">
        <button type="submit" className={buttonClass.secondary}>
          Sign out
        </button>
      </form>
    </>
  );
}
