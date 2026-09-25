import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "Sign in" };

export default function LoginPage() {
  if (!isSupabaseConfigured) redirect("/today");

  return (
    <main className="pt-safe flex min-h-dvh items-center justify-center px-6">
      <div className="w-full max-w-[340px]">
        <p className="label mb-1">Career CRM</p>
        <h1 className="mb-6 text-[22px] font-semibold tracking-tight">Sign in</h1>
        <LoginForm />
      </div>
    </main>
  );
}
