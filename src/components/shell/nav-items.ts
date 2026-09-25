import { Building2, Columns3, ListChecks, Search } from "lucide-react";

export const NAV_ITEMS = [
  { href: "/today", label: "Today", icon: ListChecks },
  { href: "/pipeline", label: "Pipeline", icon: Columns3 },
  { href: "/directory", label: "Directory", icon: Building2 },
  { href: "/search", label: "Search", icon: Search },
] as const;

export function activeNavItem(pathname: string) {
  return NAV_ITEMS.find((item) => pathname === item.href || pathname.startsWith(`${item.href}/`));
}
