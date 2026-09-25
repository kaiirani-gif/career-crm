# Career CRM

Personal relationship and opportunity pipeline for a job search.
Next.js (App Router) + Supabase, deployed on Vercel, installed on iPhone as a home-screen web app.

## Structure

- `supabase/migrations/` — database schema, row-level security, triggers and views
- `src/app/(app)/` — the four main areas: Today, Pipeline, Directory, Search
- `src/app/login/` — sign-in with an emailed one-time code
- `src/components/` — app shell and shared UI
- `src/lib/domain.ts` — pipeline stage labels (keep in step with the schema)

## Running locally

```bash
npm install
npm run dev
```

Without `.env.local` the app runs in **preview mode**: no login, nothing saved.
To connect Supabase, copy `.env.example` to `.env.local` and fill in both values.
