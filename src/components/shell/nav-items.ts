import { Building2, Columns3, ListChecks, Search } from "lucide-react";

export const NAV_ITEMS = [
  { href: "/today", label: "Today", icon: ListChecks, sections: ["/today"] },
  { href: "/pipeline", label: "Pipeline", icon: Columns3, sections: ["/pipeline"] },
  { href: "/directory", label: "Directory", icon: Building2, sections: ["/directory", "/companies", "/people"] },
  { href: "/search", label: "Search", icon: Search, sections: ["/search"] },
] as const;

export function activeNavItem(pathname: string) {
  return NAV_ITEMS.find((item) => item.sections.some((s) => pathname === s || pathname.startsWith(`${s}/`)));
}
