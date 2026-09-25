-- =============================================================================
-- Career CRM — initial schema
--
-- Conventions
--   * Every table carries user_id (defaults to the signed-in user) and is
--     protected by row-level security: a user can only ever see their own rows.
--   * Records are archived (archived_at) rather than hard-deleted, except for
--     join tables.
--   * Relationships use explicit nullable foreign keys, not a generic
--     entity_type/entity_id pair, so the database enforces integrity.
--   * "Automatically expose new tables" is OFF in this project, so every table
--     and view is explicitly granted to the authenticated role at the end.
-- =============================================================================

create extension if not exists pg_trgm;

-- -----------------------------------------------------------------------------
-- Enumerations
-- -----------------------------------------------------------------------------

create type priority_level as enum ('high', 'medium', 'low');

create type company_status as enum ('target', 'active', 'watching', 'paused', 'closed');

create type person_source as enum ('existing', 'introduction', 'cold', 'event', 'alumni', 'other');

-- Networking pipeline. Follow-up status is deliberately NOT a stage: it is
-- derived from tasks and interactions and applies at every stage.
create type relationship_stage as enum (
  'identified',
  'intro_requested',
  'ready_to_contact',
  'contacted',
  'meeting_scheduled',
  'met',
  'established',
  'dormant'
);

create type meeting_type as enum ('coffee', 'call', 'video', 'office', 'event', 'interview', 'other');
create type meeting_status as enum ('scheduled', 'completed', 'cancelled');
create type participant_role as enum ('attendee', 'interviewer', 'organiser');

create type opportunity_kind as enum ('speculative', 'formal');

-- One enum holds both stage sets; a check constraint on opportunities ensures
-- each kind only uses its own stages. Closure is recorded by state + outcome,
-- so the stage keeps showing how far the opportunity got.
create type opportunity_stage as enum (
  -- speculative
  'signal',
  'exploring',
  'pursuing',
  -- formal
  'identified',
  'preparing',
  'applied',
  'assessment',
  'interviewing',
  'final_round',
  'offer'
);

create type opportunity_state as enum ('open', 'closed');

create type opportunity_outcome as enum (
  'offer_accepted',
  'offer_declined',
  'rejected',
  'withdrawn',
  'lapsed',
  'not_pursued'
);

create type opportunity_person_role as enum ('source', 'referrer', 'hiring_manager', 'interviewer', 'contact');

create type task_type as enum ('todo', 'follow_up', 'send', 'apply', 'prepare', 'research');
create type task_owner as enum ('me', 'them');
create type task_status as enum ('open', 'done', 'cancelled');
create type task_priority as enum ('high', 'normal');
create type record_origin as enum ('user', 'ai', 'rule', 'system');

create type activity_type as enum (
  'note',
  'email_sent',
  'email_received',
  'message',
  'call',
  'meeting_held',
  'intro_requested',
  'intro_offered',
  'intro_made',
  'stage_changed',
  'application_submitted',
  'document_sent',
  'opportunity_created',
  'research_generated'
);

create type interaction_direction as enum ('outbound', 'inbound');

create type insight_category as enum ('advice', 'market_intel', 'hiring_signal', 'company_intel', 'personal');

create type report_kind as enum (
  'company_overview',
  'group_deep_dive',
  'role_scan',
  'person_profile',
  'meeting_brief',
  'interview_prep'
);

create type report_status as enum ('queued', 'running', 'ready', 'failed');

create type document_kind as enum (
  'cv',
  'cover_letter',
  'job_description',
  'interview_notes',
  'company_material',
  'research',
  'other'
);

-- -----------------------------------------------------------------------------
-- Shared trigger functions
-- -----------------------------------------------------------------------------

create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- -----------------------------------------------------------------------------
-- Profile (one row per user)
-- -----------------------------------------------------------------------------

create table profiles (
  user_id                   uuid primary key default auth.uid() references auth.users (id) on delete cascade,
  display_name              text,
  background_summary        text,
  target_roles              text,
  master_cv_document_id     uuid,            -- FK added after documents exists
  email_signature           text,
  tone_notes                text,
  -- Thresholds for the Today dashboard rules (days)
  default_follow_up_cadence int not null default 30,
  thank_you_within          int not null default 2,
  outreach_nudge_after      int not null default 7,
  application_chase_after   int not null default 14,
  speculative_stale_after   int not null default 21,
  created_at                timestamptz not null default now(),
  updated_at                timestamptz not null default now()
);

-- -----------------------------------------------------------------------------
-- Industries
-- -----------------------------------------------------------------------------

create table industries (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null default auth.uid() references auth.users (id) on delete cascade,
  name        text not null,
  priority    priority_level not null default 'medium',
  sort_order  int not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  unique (user_id, name)
);

-- -----------------------------------------------------------------------------
-- Companies and groups (divisions / teams)
-- -----------------------------------------------------------------------------

create table companies (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null default auth.uid() references auth.users (id) on delete cascade,
  name         text not null,
  one_liner    text,
  website      text,
  careers_url  text,
  hq           text,
  offices      text[] not null default '{}',
  priority     priority_level not null default 'medium',
  status       company_status not null default 'target',
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  archived_at  timestamptz
);

create index companies_user_name_idx on companies (user_id, name);
create index companies_name_trgm_idx on companies using gin (name gin_trgm_ops);

create table company_industries (
  user_id      uuid not null default auth.uid() references auth.users (id) on delete cascade,
  company_id   uuid not null references companies (id) on delete cascade,
  industry_id  uuid not null references industries (id) on delete cascade,
  primary key (company_id, industry_id)
);

create table company_groups (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null default auth.uid() references auth.users (id) on delete cascade,
  company_id   uuid not null references companies (id) on delete cascade,
  name         text not null,
  description  text,
  is_focus     boolean not null default false,
  locations    text[] not null default '{}',
  careers_url  text,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  archived_at  timestamptz,
  unique (company_id, name)
);

create index company_groups_company_idx on company_groups (company_id);

-- -----------------------------------------------------------------------------
-- People
-- -----------------------------------------------------------------------------

create table people (
  id                       uuid primary key default gen_random_uuid(),
  user_id                  uuid not null default auth.uid() references auth.users (id) on delete cascade,
  full_name                text not null,
  preferred_name           text,
  company_id               uuid references companies (id) on delete set null,
  group_id                 uuid references company_groups (id) on delete set null,
  title                    text,
  email                    text,
  phone                    text,
  linkedin_url             text,
  location                 text,
  how_we_met               text,
  source                   person_source not null default 'other',
  introduced_by_person_id  uuid references people (id) on delete set null,
  relationship_stage       relationship_stage not null default 'identified',
  stage_changed_at         timestamptz not null default now(),
  follow_up_cadence_days   int check (follow_up_cadence_days is null or follow_up_cadence_days > 0),
  background               text,
  personal_notes           text,   -- excluded from AI context unless explicitly included
  created_at               timestamptz not null default now(),
  updated_at               timestamptz not null default now(),
  archived_at              timestamptz,
  check (introduced_by_person_id is null or introduced_by_person_id <> id)
);

create index people_company_idx on people (company_id);
create index people_introduced_by_idx on people (introduced_by_person_id);
create index people_stage_idx on people (user_id, relationship_stage);
create index people_name_trgm_idx on people using gin (full_name gin_trgm_ops);

-- -----------------------------------------------------------------------------
-- Opportunities (speculative and formal share one table)
-- -----------------------------------------------------------------------------

create table opportunities (
  id                 uuid primary key default gen_random_uuid(),
  user_id            uuid not null default auth.uid() references auth.users (id) on delete cascade,
  title              text not null,
  kind               opportunity_kind not null,
  stage              opportunity_stage not null,
  state              opportunity_state not null default 'open',
  outcome            opportunity_outcome,
  company_id         uuid references companies (id) on delete set null,
  group_id           uuid references company_groups (id) on delete set null,
  source_person_id   uuid references people (id) on delete set null,
  source_meeting_id  uuid,          -- FK added after meetings exists
  priority           priority_level not null default 'medium',
  summary            text,
  location           text,
  job_url            text,
  deadline           date,
  applied_at         timestamptz,
  stage_changed_at   timestamptz not null default now(),
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now(),
  archived_at        timestamptz,
  constraint opportunity_stage_matches_kind check (
    (kind = 'speculative' and stage in ('signal', 'exploring', 'pursuing'))
    or
    (kind = 'formal' and stage in ('identified', 'preparing', 'applied', 'assessment', 'interviewing', 'final_round', 'offer'))
  ),
  constraint opportunity_outcome_only_when_closed check (
    (state = 'open' and outcome is null) or (state = 'closed' and outcome is not null)
  )
);

create index opportunities_company_idx on opportunities (company_id);
create index opportunities_pipeline_idx on opportunities (user_id, kind, state, stage);

create table opportunity_people (
  user_id         uuid not null default auth.uid() references auth.users (id) on delete cascade,
  opportunity_id  uuid not null references opportunities (id) on delete cascade,
  person_id       uuid not null references people (id) on delete cascade,
  role            opportunity_person_role not null default 'contact',
  primary key (opportunity_id, person_id, role)
);

-- -----------------------------------------------------------------------------
-- Meetings (interviews are meetings of type 'interview' linked to an opportunity)
-- -----------------------------------------------------------------------------

create table meetings (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid not null default auth.uid() references auth.users (id) on delete cascade,
  title             text not null,
  type              meeting_type not null default 'coffee',
  status            meeting_status not null default 'scheduled',
  starts_at         timestamptz not null,
  ends_at           timestamptz,
  location          text,
  company_id        uuid references companies (id) on delete set null,
  group_id          uuid references company_groups (id) on delete set null,
  opportunity_id    uuid references opportunities (id) on delete set null,
  objective         text,
  raw_notes         text,
  summary           text,
  debrief_proposal  jsonb,          -- AI extraction awaiting review
  debriefed_at      timestamptz,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  archived_at       timestamptz,
  check (ends_at is null or ends_at >= starts_at)
);

create index meetings_user_start_idx on meetings (user_id, starts_at);
create index meetings_company_idx on meetings (company_id);
create index meetings_opportunity_idx on meetings (opportunity_id);

alter table opportunities
  add constraint opportunities_source_meeting_fk
  foreign key (source_meeting_id) references meetings (id) on delete set null;

create table meeting_participants (
  user_id     uuid not null default auth.uid() references auth.users (id) on delete cascade,
  meeting_id  uuid not null references meetings (id) on delete cascade,
  person_id   uuid not null references people (id) on delete cascade,
  role        participant_role not null default 'attendee',
  primary key (meeting_id, person_id)
);

create index meeting_participants_person_idx on meeting_participants (person_id);

-- -----------------------------------------------------------------------------
-- Tasks (my actions AND other people's commitments to me)
-- -----------------------------------------------------------------------------

create table tasks (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid not null default auth.uid() references auth.users (id) on delete cascade,
  title            text not null,
  notes            text,
  type             task_type not null default 'todo',
  owner            task_owner not null default 'me',
  owner_person_id  uuid references people (id) on delete set null,
  status           task_status not null default 'open',
  priority         task_priority not null default 'normal',
  due_date         date,
  company_id       uuid references companies (id) on delete set null,
  person_id        uuid references people (id) on delete set null,
  opportunity_id   uuid references opportunities (id) on delete set null,
  meeting_id       uuid references meetings (id) on delete set null,
  origin           record_origin not null default 'user',
  completed_at     timestamptz,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  constraint task_owner_person_required check (
    (owner = 'me' and owner_person_id is null) or (owner = 'them' and owner_person_id is not null)
  )
);

create index tasks_open_due_idx on tasks (user_id, status, due_date);
create index tasks_person_idx on tasks (person_id);
create index tasks_owner_person_idx on tasks (owner_person_id);
create index tasks_company_idx on tasks (company_id);
create index tasks_opportunity_idx on tasks (opportunity_id);

-- -----------------------------------------------------------------------------
-- Activities (the unified timeline)
-- -----------------------------------------------------------------------------

create table activities (
  id                 uuid primary key default gen_random_uuid(),
  user_id            uuid not null default auth.uid() references auth.users (id) on delete cascade,
  occurred_at        timestamptz not null default now(),
  type               activity_type not null,
  summary            text not null,
  body               text,
  company_id         uuid references companies (id) on delete set null,
  person_id          uuid references people (id) on delete set null,
  related_person_id  uuid references people (id) on delete set null,  -- e.g. the introducer
  opportunity_id     uuid references opportunities (id) on delete set null,
  meeting_id         uuid references meetings (id) on delete set null,
  task_id            uuid references tasks (id) on delete set null,
  is_interaction     boolean not null default false,
  direction          interaction_direction,
  source             record_origin not null default 'user',
  metadata           jsonb not null default '{}',
  created_at         timestamptz not null default now()
);

create index activities_user_time_idx on activities (user_id, occurred_at desc);
create index activities_person_idx on activities (person_id, occurred_at desc);
create index activities_related_person_idx on activities (related_person_id);
create index activities_company_idx on activities (company_id, occurred_at desc);
create index activities_opportunity_idx on activities (opportunity_id, occurred_at desc);

-- -----------------------------------------------------------------------------
-- Insights (knowledge learned, not events)
-- -----------------------------------------------------------------------------

create table insights (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null default auth.uid() references auth.users (id) on delete cascade,
  content      text not null,
  category     insight_category not null,
  meeting_id   uuid references meetings (id) on delete set null,
  person_id    uuid references people (id) on delete set null,
  company_id   uuid references companies (id) on delete set null,
  group_id     uuid references company_groups (id) on delete set null,
  occurred_at  timestamptz not null default now(),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index insights_person_idx on insights (person_id);
create index insights_company_idx on insights (company_id);

-- -----------------------------------------------------------------------------
-- Reports (all long-form AI output, versioned) and their sources
-- -----------------------------------------------------------------------------

create table reports (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null default auth.uid() references auth.users (id) on delete cascade,
  kind            report_kind not null,
  status          report_status not null default 'queued',
  is_current      boolean not null default true,
  company_id      uuid references companies (id) on delete cascade,
  group_id        uuid references company_groups (id) on delete cascade,
  opportunity_id  uuid references opportunities (id) on delete cascade,
  meeting_id      uuid references meetings (id) on delete cascade,
  person_id       uuid references people (id) on delete cascade,
  -- sections: [{ heading, claims: [{ text, basis: verified|background|inference, source_ids[], as_of }] }]
  sections        jsonb not null default '[]',
  model           text,
  error           text,
  generated_at    timestamptz,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index reports_company_idx on reports (company_id, kind, is_current);
create index reports_meeting_idx on reports (meeting_id);
create index reports_opportunity_idx on reports (opportunity_id);

create table report_sources (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null default auth.uid() references auth.users (id) on delete cascade,
  report_id     uuid not null references reports (id) on delete cascade,
  url           text not null,
  title         text,
  publisher     text,
  published_at  date,
  retrieved_at  timestamptz not null default now()
);

create index report_sources_report_idx on report_sources (report_id);

-- -----------------------------------------------------------------------------
-- Documents
-- -----------------------------------------------------------------------------

create table documents (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null default auth.uid() references auth.users (id) on delete cascade,
  title           text not null,
  kind            document_kind not null default 'other',
  storage_path    text not null,     -- path inside the private 'documents' bucket
  mime_type       text,
  version_label   text,
  is_master       boolean not null default false,
  extracted_text  text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  archived_at     timestamptz
);

alter table profiles
  add constraint profiles_master_cv_fk
  foreign key (master_cv_document_id) references documents (id) on delete set null;

create table document_links (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null default auth.uid() references auth.users (id) on delete cascade,
  document_id     uuid not null references documents (id) on delete cascade,
  company_id      uuid references companies (id) on delete cascade,
  opportunity_id  uuid references opportunities (id) on delete cascade,
  person_id       uuid references people (id) on delete cascade,
  meeting_id      uuid references meetings (id) on delete cascade,
  created_at      timestamptz not null default now(),
  constraint document_link_single_target check (
    num_nonnulls(company_id, opportunity_id, person_id, meeting_id) = 1
  )
);

create index document_links_document_idx on document_links (document_id);

-- -----------------------------------------------------------------------------
-- AI run log (audit, cost, re-runs)
-- -----------------------------------------------------------------------------

create table ai_runs (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null default auth.uid() references auth.users (id) on delete cascade,
  feature     text not null,
  mode        text not null default 'manual',   -- 'manual' (copy/paste bridge) or 'api'
  input_refs  jsonb not null default '{}',
  prompt      text,
  output      jsonb,
  model       text,
  tokens_in   int,
  tokens_out  int,
  status      text not null default 'pending',
  created_at  timestamptz not null default now()
);

-- -----------------------------------------------------------------------------
-- Behavioural triggers
-- -----------------------------------------------------------------------------

-- updated_at on every table that has it
do $$
declare
  t text;
begin
  foreach t in array array[
    'profiles', 'industries', 'companies', 'company_groups', 'people',
    'opportunities', 'meetings', 'tasks', 'insights', 'reports', 'documents'
  ]
  loop
    execute format(
      'create trigger %I before update on %I for each row execute function set_updated_at()',
      t || '_set_updated_at', t
    );
  end loop;
end;
$$;

-- Tasks: fill company from the linked person/opportunity/meeting so it never
-- has to be entered twice, and stamp completed_at.
create or replace function tasks_before_write()
returns trigger
language plpgsql
as $$
begin
  if new.company_id is null then
    new.company_id := coalesce(
      (select company_id from opportunities where id = new.opportunity_id),
      (select company_id from meetings where id = new.meeting_id),
      (select company_id from people where id = coalesce(new.person_id, new.owner_person_id))
    );
  end if;

  if new.status = 'done' and (tg_op = 'INSERT' or old.status <> 'done') then
    new.completed_at := now();
  elsif new.status <> 'done' then
    new.completed_at := null;
  end if;

  return new;
end;
$$;

create trigger tasks_before_write
before insert or update on tasks
for each row execute function tasks_before_write();

-- Activities: fill company from the linked person/opportunity/meeting.
create or replace function activities_before_insert()
returns trigger
language plpgsql
as $$
begin
  if new.company_id is null then
    new.company_id := coalesce(
      (select company_id from opportunities where id = new.opportunity_id),
      (select company_id from meetings where id = new.meeting_id),
      (select company_id from people where id = new.person_id)
    );
  end if;
  return new;
end;
$$;

create trigger activities_before_insert
before insert on activities
for each row execute function activities_before_insert();

-- People: stamp stage changes and log them on the timeline.
create or replace function people_stage_change()
returns trigger
language plpgsql
as $$
begin
  if new.relationship_stage is distinct from old.relationship_stage then
    new.stage_changed_at := now();
    insert into activities (user_id, type, summary, person_id, company_id, source, metadata)
    values (
      new.user_id,
      'stage_changed',
      'Relationship stage: ' || replace(old.relationship_stage::text, '_', ' ')
        || ' → ' || replace(new.relationship_stage::text, '_', ' '),
      new.id,
      new.company_id,
      'system',
      jsonb_build_object('from', old.relationship_stage, 'to', new.relationship_stage)
    );
  end if;
  return new;
end;
$$;

create trigger people_stage_change
before update of relationship_stage on people
for each row execute function people_stage_change();

-- Opportunities: stamp stage changes, stamp applied_at, log to the timeline.
create or replace function opportunities_stage_change()
returns trigger
language plpgsql
as $$
begin
  if tg_op = 'INSERT' then
    if new.stage = 'applied' and new.applied_at is null then
      new.applied_at := now();
    end if;
    return new;
  end if;

  if new.stage is distinct from old.stage or new.kind is distinct from old.kind then
    new.stage_changed_at := now();
    if new.stage = 'applied' and new.applied_at is null then
      new.applied_at := now();
    end if;
    insert into activities (user_id, type, summary, opportunity_id, company_id, source, metadata)
    values (
      new.user_id,
      'stage_changed',
      case
        when new.kind is distinct from old.kind then 'Formalised: ' || new.title
        else 'Stage: ' || replace(old.stage::text, '_', ' ') || ' → ' || replace(new.stage::text, '_', ' ')
      end,
      new.id,
      new.company_id,
      'system',
      jsonb_build_object('from_kind', old.kind, 'to_kind', new.kind, 'from', old.stage, 'to', new.stage)
    );
  end if;

  if new.state = 'closed' and old.state = 'open' then
    insert into activities (user_id, type, summary, opportunity_id, company_id, source, metadata)
    values (
      new.user_id,
      'stage_changed',
      'Closed: ' || replace(new.outcome::text, '_', ' '),
      new.id,
      new.company_id,
      'system',
      jsonb_build_object('outcome', new.outcome)
    );
  end if;

  return new;
end;
$$;

create trigger opportunities_stage_change
before insert or update on opportunities
for each row execute function opportunities_stage_change();

-- New user: create a profile and seed the target industries (all Medium;
-- priorities are edited in the app).
create or replace function handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (user_id) values (new.id);

  insert into public.industries (user_id, name, sort_order)
  values
    (new.id, 'Venture Capital', 1),
    (new.id, 'Private Equity — Corporate', 2),
    (new.id, 'Private Equity — Real Estate', 3),
    (new.id, 'AI Infrastructure / Data Centres', 4),
    (new.id, 'Asset Management', 5),
    (new.id, 'Real Estate Investment Banking', 6),
    (new.id, 'Consulting', 7),
    (new.id, 'Private Wealth Management', 8);

  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function handle_new_user();

-- -----------------------------------------------------------------------------
-- Derived views (security_invoker so row-level security still applies)
-- -----------------------------------------------------------------------------

-- Last interaction per person: the latest interaction activity, or the latest
-- completed meeting they attended, whichever is more recent.
create view person_last_interaction
with (security_invoker = true)
as
select
  p.id as person_id,
  p.user_id,
  greatest(
    (select max(a.occurred_at) from activities a
      where a.is_interaction and (a.person_id = p.id)),
    (select max(m.starts_at) from meetings m
      join meeting_participants mp on mp.meeting_id = m.id
      where mp.person_id = p.id and m.status = 'completed')
  ) as last_interaction_at
from people p
where p.archived_at is null;

-- Next open follow-up per person.
create view person_next_follow_up
with (security_invoker = true)
as
select distinct on (t.person_id)
  t.person_id,
  t.user_id,
  t.id as task_id,
  t.title,
  t.due_date
from tasks t
where t.status = 'open'
  and t.type = 'follow_up'
  and t.owner = 'me'
  and t.person_id is not null
order by t.person_id, t.due_date nulls last;

-- Company coverage: number of live contacts and the furthest relationship stage.
create view company_coverage
with (security_invoker = true)
as
select
  c.id as company_id,
  c.user_id,
  count(p.id) filter (where p.relationship_stage <> 'dormant') as contact_count,
  max(p.relationship_stage) filter (where p.relationship_stage <> 'dormant') as furthest_stage
from companies c
left join people p on p.company_id = c.id and p.archived_at is null
where c.archived_at is null
group by c.id, c.user_id;

-- Days in the current stage, and days outstanding since applying.
create view opportunity_ageing
with (security_invoker = true)
as
select
  o.id as opportunity_id,
  o.user_id,
  (current_date - o.stage_changed_at::date) as days_in_stage,
  case when o.applied_at is not null then (current_date - o.applied_at::date) end as days_since_applied,
  (select max(a.occurred_at) from activities a where a.opportunity_id = o.id) as last_activity_at
from opportunities o
where o.archived_at is null;

-- -----------------------------------------------------------------------------
-- Row-level security and grants
-- -----------------------------------------------------------------------------

do $$
declare
  t text;
begin
  foreach t in array array[
    'profiles', 'industries', 'companies', 'company_industries', 'company_groups',
    'people', 'opportunities', 'opportunity_people', 'meetings', 'meeting_participants',
    'tasks', 'activities', 'insights', 'reports', 'report_sources',
    'documents', 'document_links', 'ai_runs'
  ]
  loop
    execute format('alter table %I enable row level security', t);
    execute format(
      'create policy %I on %I for all to authenticated
         using (user_id = (select auth.uid()))
         with check (user_id = (select auth.uid()))',
      t || '_owner_all', t
    );
    execute format('grant select, insert, update, delete on %I to authenticated', t);
  end loop;
end;
$$;

grant select on person_last_interaction, person_next_follow_up, company_coverage, opportunity_ageing
  to authenticated;

-- -----------------------------------------------------------------------------
-- Storage: private bucket for documents; each user may only touch files in a
-- folder named after their own user id.
-- -----------------------------------------------------------------------------

insert into storage.buckets (id, name, public)
values ('documents', 'documents', false)
on conflict (id) do nothing;

create policy "documents_owner_select" on storage.objects
  for select to authenticated
  using (bucket_id = 'documents' and (storage.foldername(name))[1] = (select auth.uid())::text);

create policy "documents_owner_insert" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'documents' and (storage.foldername(name))[1] = (select auth.uid())::text);

create policy "documents_owner_update" on storage.objects
  for update to authenticated
  using (bucket_id = 'documents' and (storage.foldername(name))[1] = (select auth.uid())::text);

create policy "documents_owner_delete" on storage.objects
  for delete to authenticated
  using (bucket_id = 'documents' and (storage.foldername(name))[1] = (select auth.uid())::text);
