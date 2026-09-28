import type { Tables } from "@/lib/database.types";
import { formatDate } from "@/lib/format";
import { Empty } from "@/components/ui/primitives";

type Activity = Pick<Tables<"activities">, "id" | "occurred_at" | "type" | "summary" | "body" | "source">;

// Chronological history, newest first. Filled by stage changes now; meetings,
// notes and emails join it in Step 3.
export function Timeline({ activities }: { activities: Activity[] }) {
  if (activities.length === 0) return <Empty>No activity yet.</Empty>;

  return (
    <ol>
      {activities.map((a) => (
        <li key={a.id} className="grid grid-cols-[4.5rem_1fr] gap-3 border-b border-border px-4 py-2.5 text-[13px] last:border-b-0">
          <time dateTime={a.occurred_at} className="num text-text-3">
            {formatDate(a.occurred_at)}
          </time>
          <div className="min-w-0">
            <p className={a.source === "system" ? "text-text-2" : "text-text"}>{a.summary}</p>
            {a.body && <p className="mt-0.5 whitespace-pre-line text-text-2">{a.body}</p>}
          </div>
        </li>
      ))}
    </ol>
  );
}
