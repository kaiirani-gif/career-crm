import type { Metadata } from "next";
import { Search } from "lucide-react";
import { PageHeader } from "@/components/ui/primitives";

export const metadata: Metadata = { title: "Search" };

export default function SearchPage() {
  return (
    <>
      <PageHeader title="Search" />
      <div className="relative max-w-[640px]">
        <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-3" />
        <input
          type="search"
          placeholder="People, companies, meetings, notes…"
          className="w-full rounded-md border border-border bg-surface py-2.5 pl-9 pr-3 text-[15px] placeholder:text-text-3 focus:border-accent focus:outline-none md:text-[14px]"
        />
      </div>
      <p className="mt-3 max-w-[640px] text-[13px] text-text-3">
        Results are grouped by type, with exact name matches first.
      </p>
    </>
  );
}
