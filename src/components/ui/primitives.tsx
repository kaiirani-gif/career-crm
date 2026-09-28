import Link from "next/link";
import clsx from "clsx";

// Page heading used on desktop; the phone shows the title in the top bar.
export function PageHeader({ title, meta, actions }: { title: string; meta?: React.ReactNode; actions?: React.ReactNode }) {
  return (
    <div className="mb-5 flex flex-wrap items-end gap-x-4 gap-y-2 md:mb-7">
      <div className="min-w-0">
        <h1 className="hidden text-[22px] font-semibold tracking-tight md:block">{title}</h1>
        {meta && <div className="text-[13px] text-text-2 md:mt-0.5">{meta}</div>}
      </div>
      {actions && <div className="ml-auto flex items-center gap-2">{actions}</div>}
    </div>
  );
}

export function Section({
  title,
  count,
  tone = "default",
  action,
  children,
  className,
}: {
  title: string;
  count?: number;
  tone?: "default" | "danger";
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={clsx("overflow-hidden rounded-lg border border-border bg-surface", className)}>
      <header className="flex items-center gap-2 border-b border-border px-4 py-2.5">
        <h2 className={clsx("label", tone === "danger" && "text-danger!")}>{title}</h2>
        {count !== undefined && (
          <span
            className={clsx(
              "num rounded px-1.5 text-[11px] font-semibold",
              tone === "danger" && count > 0 ? "bg-danger-soft text-danger" : "bg-surface-2 text-text-2",
            )}
          >
            {count}
          </span>
        )}
        {action && <div className="ml-auto text-[12px]">{action}</div>}
      </header>
      {children}
    </section>
  );
}

export function Empty({ children }: { children: React.ReactNode }) {
  return <p className="px-4 py-5 text-[13px] text-text-3">{children}</p>;
}

// Segmented control driven by the URL, so views are linkable and work without JavaScript.
export function Segmented({ items, active }: { items: { href: string; label: string; value: string }[]; active: string }) {
  return (
    <div className="inline-flex rounded-md border border-border bg-surface-2 p-0.5">
      {items.map((item) => (
        <Link
          key={item.value}
          href={item.href}
          scroll={false}
          className={clsx(
            "rounded-[5px] px-3 py-1 text-[13px]",
            item.value === active ? "bg-surface font-medium text-text shadow-[0_0_0_1px_var(--border)]" : "text-text-2 hover:text-text",
          )}
        >
          {item.label}
        </Link>
      ))}
    </div>
  );
}

// Underlined tabs for record pages; scroll sideways on the phone.
export function Tabs({ items, active }: { items: { href: string; label: string; value: string; count?: number }[]; active: string }) {
  return (
    <nav className="-mx-4 mb-4 overflow-x-auto border-b border-border px-4 md:mx-0 md:px-0">
      <ul className="flex gap-5">
        {items.map((item) => (
          <li key={item.value}>
            <Link
              href={item.href}
              scroll={false}
              className={clsx(
                "-mb-px flex items-center gap-1.5 whitespace-nowrap border-b-2 py-2 text-[13px]",
                item.value === active ? "border-accent font-medium text-text" : "border-transparent text-text-2 hover:text-text",
              )}
            >
              {item.label}
              {item.count !== undefined && item.count > 0 && <span className="num text-[11px] text-text-3">{item.count}</span>}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

// Label / value rows for record details.
export function Details({ rows }: { rows: { label: string; value: React.ReactNode }[] }) {
  return (
    <dl className="divide-y divide-border">
      {rows.map((r) => (
        <div key={r.label} className="grid grid-cols-[8.5rem_1fr] gap-3 px-4 py-2.5 text-[13px]">
          <dt className="text-text-3">{r.label}</dt>
          <dd className="min-w-0 break-words">{r.value || <span className="text-text-3">—</span>}</dd>
        </div>
      ))}
    </dl>
  );
}
