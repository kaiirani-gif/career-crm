"use client";

import { useActionState } from "react";
import { signIn, type LoginState } from "./actions";

const inputClass =
  "w-full rounded-md border border-border bg-surface px-3 py-2.5 text-[15px] text-text placeholder:text-text-3 focus:border-accent focus:outline-none";

export function LoginForm() {
  const [state, action, pending] = useActionState<LoginState, FormData>(signIn, {});

  return (
    <form action={action} className="space-y-3">
      <input
        name="email"
        type="email"
        autoComplete="username"
        placeholder="Email address"
        defaultValue={state.email}
        autoFocus
        required
        className={inputClass}
      />
      <input
        name="password"
        type="password"
        autoComplete="current-password"
        placeholder="Password"
        required
        className={inputClass}
      />
      {state.error && <p className="text-[13px] text-danger">{state.error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-md bg-accent px-3 py-2.5 text-[14px] font-medium text-surface transition-opacity disabled:opacity-60"
      >
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
