const TIME_ZONE = "Europe/London";

export function formatDate(value: string | null | undefined, opts: { year?: boolean } = {}) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    ...(opts.year ? { year: "numeric" } : {}),
    timeZone: TIME_ZONE,
  }).format(new Date(value));
}

// "Today", "Yesterday", "12 days ago", or a date once it is over a month old.
export function formatRelative(value: string | null | undefined) {
  if (!value) return "—";
  const days = Math.floor((Date.now() - new Date(value).getTime()) / 86_400_000);
  if (days <= 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 31) return `${days} days ago`;
  return formatDate(value, { year: true });
}

// Accepts "blackstone.com" or a full URL; stores a full https URL.
export function normaliseUrl(value: string | null) {
  if (!value) return null;
  return /^https?:\/\//i.test(value) ? value : `https://${value}`;
}

export function displayHost(url: string | null | undefined) {
  if (!url) return "";
  try {
    return new URL(url).host.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export function splitList(value: string | null) {
  if (!value) return [];
  return value
    .split(/[,;\n]/)
    .map((s) => s.trim())
    .filter(Boolean);
}
