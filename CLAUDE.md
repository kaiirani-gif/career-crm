@AGENTS.md

# Career CRM — project decisions

Personal job-search CRM styled as an institutional deal-pipeline tool. British English in all UI copy.

## Stack
- Next.js 16 (App Router; `src/proxy.ts` replaces middleware), Tailwind v4, TypeScript.
- Supabase (Postgres, auth, storage). Hosted on Vercel. iPhone via home-screen web app (PWA).
- No paid AI API yet: AI features use a copy-prompt → paste into claude.ai → paste JSON back bridge, behind a provider-agnostic interface so the Claude API can be swapped in later.

## Data model rules
- One `opportunities` table: `kind` speculative|formal, separate stage sets (enforced by check constraint). Closure = `state` + `outcome`.
- Networking stage lives on `people`; company networking position is derived (`company_coverage` view).
- No Introduction / Application / Commitment / Note tables: introductions = `introduced_by_person_id` + activities; other people's commitments = tasks with `owner = 'them'`; notes = activities; knowledge = `insights`.
- Divisions are `company_groups` (FK `group_id`).
- Explicit nullable FKs, not polymorphic links. Every table has `user_id` + RLS.
- Supabase project has "automatically expose new tables" OFF: new tables need explicit GRANTs to `authenticated` in their migration.
- Dashboard suggestions are deterministic SQL rules, not AI.

## Auth
- Email + password. Not magic links (iOS home-screen apps don't share Safari's cookies) and not emailed codes (the free plan's built-in email service doesn't allow editing templates). The single user is created in the Supabase dashboard; the app has no sign-up.
- Without env vars the app runs in preview mode (no login, nothing saved).

## Deployment
- GitHub `kaiirani-gif/career-crm` (branch `main`) → Vercel project `career-crm` → https://career-crm-jade.vercel.app. Pushing to `main` deploys.
- Vercel env vars `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` must be type **Config**, not Secret: Vercel withholds secret values from `NEXT_PUBLIC_` variables, which silently puts the app in preview mode.
- Regenerate types after a migration: `npm run db:types`. Self-referencing embeds (e.g. people → introducer) are typed as arrays; normalise with `one()` from `lib/form-data`.

## Build sequence
1 Foundation ✓ → 2 Directory ✓ → 3 Timeline & tasks → 4 Meetings & debrief → 5 Today dashboard → 6 Opportunities → 7 Research → 8 Meeting brief → 9 Documents & search → 10 Mobile polish.
