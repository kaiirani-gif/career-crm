import clsx from "clsx";

export const inputClass =
  "w-full rounded-md border border-border bg-surface px-3 py-2 text-[15px] text-text placeholder:text-text-3 focus:border-accent focus:outline-none md:text-[13px]";

export function Field({
  label,
  hint,
  children,
  className,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={clsx("block", className)}>
      <span className="mb-1 block text-[12px] font-medium text-text-2">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-[11px] text-text-3">{hint}</span>}
    </label>
  );
}

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={clsx(inputClass, props.className)} />;
}

export function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea rows={3} {...props} className={clsx(inputClass, "resize-y", props.className)} />;
}

export function Select({
  options,
  placeholder,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & {
  options: readonly { value: string; label: string }[];
  placeholder?: string;
}) {
  return (
    <select {...props} className={clsx(inputClass, "appearance-auto", props.className)}>
      {placeholder !== undefined && <option value="">{placeholder}</option>}
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

// Groups related fields under a small heading.
export function FieldSet({ legend, children }: { legend: string; children: React.ReactNode }) {
  return (
    <fieldset className="rounded-lg border border-border bg-surface p-4">
      <legend className="label px-1">{legend}</legend>
      <div className="grid gap-3 sm:grid-cols-2">{children}</div>
    </fieldset>
  );
}

export function FormError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p role="alert" className="rounded-md bg-danger-soft px-3 py-2 text-[13px] text-danger">
      {message}
    </p>
  );
}

export const buttonClass = {
  primary:
    "inline-flex items-center justify-center gap-1.5 rounded-md bg-accent px-3.5 py-2 text-[13px] font-medium text-surface transition-opacity disabled:opacity-60",
  secondary:
    "inline-flex items-center justify-center gap-1.5 rounded-md border border-border bg-surface px-3 py-2 text-[13px] font-medium text-text hover:border-border-strong disabled:opacity-60",
  quiet: "inline-flex items-center gap-1 text-[12px] text-text-2 hover:text-text",
};
