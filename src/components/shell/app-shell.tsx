"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react";
import clsx from "clsx";
import { signOut } from "@/app/login/actions";
import { CaptureMenu } from "./capture-menu";
import { activeNavItem, NAV_ITEMS } from "./nav-items";

type Props = {
  children: React.ReactNode;
  email: string | null;
  preview: boolean;
};

// Desktop: fixed left sidebar. Phone: top bar with + and a bottom tab bar.
export function AppShell({ children, email, preview }: Props) {
  const pathname = usePathname();
  const current = activeNavItem(pathname);

  return (
    <div className="min-h-dvh md:flex">
      {/* Sidebar (tablet and desktop) */}
      <aside className="sticky top-0 hidden h-dvh w-[216px] shrink-0 flex-col border-r border-border bg-surface-2/60 px-3 py-4 md:flex">
        <div className="mb-4 flex items-center gap-2 px-1.5">
          <Mark />
          <span className="text-[13px] font-semibold tracking-tight">Career CRM</span>
        </div>
        <CaptureMenu variant="sidebar" />
        <nav className="mt-4 space-y-px">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const active = current?.href === href;
            return (
              <Link
                key={href}
                href={href}
                className={clsx(
                  "flex items-center gap-2.5 rounded-md px-2 py-1.5 text-[13px]",
                  active ? "bg-surface font-medium text-text shadow-[0_0_0_1px_var(--border)]" : "text-text-2 hover:text-text",
                )}
              >
                <Icon size={16} strokeWidth={active ? 2 : 1.75} />
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto space-y-2 px-1.5">
          {preview && <PreviewBadge />}
          {email && (
            <form action={signOut} className="flex items-center gap-2">
              <span className="truncate text-[12px] text-text-3">{email}</span>
              <button type="submit" aria-label="Sign out" className="ml-auto text-text-3 hover:text-text">
                <LogOut size={14} />
              </button>
            </form>
          )}
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        {/* Top bar (phone) */}
        <header className="pt-safe sticky top-0 z-30 border-b border-border bg-bg/90 backdrop-blur md:hidden">
          <div className="flex h-11 items-center gap-2 px-4">
            <Mark />
            <h1 className="text-[17px] font-semibold tracking-tight">{current?.label ?? "Career CRM"}</h1>
            {preview && <PreviewBadge />}
            <div className="ml-auto flex items-center">
              {email && (
                <form action={signOut}>
                  <button type="submit" aria-label="Sign out" className="flex h-9 w-9 items-center justify-center text-text-3">
                    <LogOut size={17} />
                  </button>
                </form>
              )}
              <CaptureMenu variant="topbar" />
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-[1200px] px-4 pb-28 pt-4 md:px-8 md:pb-12 md:pt-7">{children}</main>

        {/* Bottom tab bar (phone) */}
        <nav className="pb-safe fixed inset-x-0 bottom-0 z-30 border-t border-border bg-surface/95 backdrop-blur md:hidden">
          <ul className="grid grid-cols-4">
            {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
              const active = current?.href === href;
              return (
                <li key={href}>
                  <Link
                    href={href}
                    className={clsx(
                      "flex flex-col items-center gap-0.5 pb-1 pt-2 text-[10px] font-medium",
                      active ? "text-accent" : "text-text-3",
                    )}
                  >
                    <Icon size={22} strokeWidth={active ? 2 : 1.6} />
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </div>
  );
}

function Mark() {
  return (
    <svg viewBox="0 0 64 64" className="h-5 w-5 shrink-0" aria-hidden>
      <rect width="64" height="64" rx="14" fill="var(--accent)" />
      <path d="M18 44V20h6v24zM29 44V28h6v16zM40 44V34h6v10z" fill="var(--surface)" />
    </svg>
  );
}

function PreviewBadge() {
  return (
    <span
      title="Not yet connected to Supabase. Nothing is saved."
      className="rounded border border-warn/30 bg-warn-soft px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-warn"
    >
      Preview
    </span>
  );
}
