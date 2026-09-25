import type { Metadata } from "next";
import { DataTable, PageHeader, Section, Segmented } from "@/components/ui/primitives";

export const metadata: Metadata = { title: "Directory" };

const VIEWS = {
  companies: {
    label: "Companies",
    columns: ["Company", "Priority", "Status", "Coverage", "Last interaction", "Next action"],
    empty: "No companies yet.",
  },
  people: {
    label: "People",
    columns: ["Name", "Company", "Stage", "Follow-up", "Last interaction", "Introduced by"],
    empty: "No people yet.",
  },
  documents: {
    label: "Documents",
    columns: ["Title", "Type", "Version", "Linked to", "Added"],
    empty: "No documents yet.",
  },
} as const;

type View = keyof typeof VIEWS;

export default async function DirectoryPage({ searchParams }: PageProps<"/directory">) {
  const { view } = await searchParams;
  const active: View = typeof view === "string" && view in VIEWS ? (view as View) : "companies";
  const config = VIEWS[active];

  const items = (Object.keys(VIEWS) as View[]).map((v) => ({
    value: v,
    label: VIEWS[v].label,
    href: `/directory?view=${v}`,
  }));

  return (
    <>
      <PageHeader title="Directory" actions={<Segmented items={items} active={active} />} />
      <Section title={config.label} count={0}>
        <DataTable columns={[...config.columns]} empty={config.empty} />
      </Section>
    </>
  );
}
