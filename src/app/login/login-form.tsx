"use client";

import { useActionState } from "react";
import { sendCode, verifyCode, type LoginState } from "./actions";

const inputClass =
  "w-full rounded-md border border-border bg-surface px-3 py-2.5 text-[15px] text-text placeholder:text-text-3 focus:border-accent focus:outline-none";
const buttonClass =
  "w-full rounded-md bg-accent px-3 py-2.5 text-[14px] font-medium text-surface transition-opacity disabled:opacity-60";

export function LoginForm() {
  const [emailState, emailAction, sending] = useActionState<LoginState, FormData>(sendCode, { step: "email" });
  const [codeState, codeAction, verifying] = useActionState<LoginState, FormData>(verifyCode, { step: "code" });

  if (emailState.step === "code") {
    const error = codeState.error;
    return (
      <form action={codeAction} className="space-y-3">
        <p className="text-text-2">
          A sign-in code has been sent to <span className="text-text">{emailState.email}</span>.
        </p>
        <input type="hidden" name="email" value={emailState.email} />
        <input
          name="code"
          inputMode="numeric"
          autoComplete="one-time-code"
          placeholder="Code"
          autoFocus
          className={`${inputClass} num tracking-[0.3em]`}
        />
        {error && <p className="text-[13px] text-danger">{error}</p>}
        <button type="submit" disabled={verifying} className={buttonClass}>
          {verifying ? "Verifying…" : "Sign in"}
        </button>
      </form>
    );
  }

  return (
    <form action={emailAction} className="space-y-3">
      <input
        name="email"
        type="email"
        autoComplete="email"
        placeholder="Email address"
        defaultValue={emailState.email}
        autoFocus
        className={inputClass}
      />
      {emailState.error && <p className="text-[13px] text-danger">{emailState.error}</p>}
      <button type="submit" disabled={sending} className={buttonClass}>
        {sending ? "Sending…" : "Send sign-in code"}
      </button>
    </form>
  );
}
