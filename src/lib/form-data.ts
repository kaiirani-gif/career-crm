// Small helpers for reading Server Action form submissions and query results.

// A to-one embed on a self-referencing table (e.g. people → introducer) is typed
// as an array by the generated types; accept either shape.
export function one<T>(value: T | T[] | null | undefined): T | null {
  if (Array.isArray(value)) return value[0] ?? null;
  return value ?? null;
}

export type FormState = { error?: string };

// Trimmed string, or null when empty.
export function text(fd: FormData, key: string) {
  const v = fd.get(key);
  if (typeof v !== "string") return null;
  const t = v.trim();
  return t === "" ? null : t;
}

export function id(fd: FormData, key: string) {
  const v = text(fd, key);
  return v && /^[0-9a-f-]{36}$/i.test(v) ? v : null;
}

export function positiveInt(fd: FormData, key: string) {
  const v = text(fd, key);
  if (!v) return null;
  const n = Number.parseInt(v, 10);
  return Number.isFinite(n) && n > 0 ? n : null;
}

export function ids(fd: FormData, key: string) {
  return fd
    .getAll(key)
    .filter((v): v is string => typeof v === "string" && /^[0-9a-f-]{36}$/i.test(v));
}
