"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type LoginState = { email?: string; error?: string };

// Email + password: works inside the iPhone home-screen app (an emailed link
// would open in Safari, which does not share its session) and needs no email
// delivery. The single account is created in the Supabase dashboard; the app
// offers no sign-up.
export async function signIn(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  if (!email || !password) return { email, error: "Enter your email address and password." };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    const invalid = /invalid login credentials/i.test(error.message);
    return { email, error: invalid ? "Incorrect email address or password." : error.message };
  }

  redirect("/today");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
