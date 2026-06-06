-- ============================================================
-- Migration: create credential_checklists
-- Source: https://www.dco.uscg.mil/nmc/checklist/
-- ============================================================
-- NOTE ON TABLE NAME:
--   This table stores the NMC checklist index (name, roles, PDF link).
--   When you later parse each PDF and store line-item requirements,
--   a natural companion table would be "checklist_items" or
--   "credential_requirements". At that point you may want to rename
--   this table to "nmc_checklists" or "checklist_index" to make the
--   relationship clearer. See bottom of file for suggested future schema.
-- ============================================================

create table if not exists public.credential_checklists (
  id               uuid        primary key default gen_random_uuid(),
  name             text        not null,
  -- "Deck", "Engine", or both
  departments      text[]      not null default '{}',
  -- "National Officer", "STCW Officer", "National Rating",
  -- "STCW Rating", "Renewal / Entry Level"
  credential_types text[]      not null default '{}',
  -- specific endorsements / ratings this checklist applies to
  roles            text[]      not null default '{}',
  -- direct PDF URL (null if checklist has no PDF, e.g. modal-only entries)
  link             text,
  -- set to true once the PDF has been parsed and requirements stored
  pdf_parsed       boolean     not null default false,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

-- ── indexes ──────────────────────────────────────────────────
create index if not exists idx_credential_checklists_roles
  on public.credential_checklists using gin(roles);

create index if not exists idx_credential_checklists_departments
  on public.credential_checklists using gin(departments);

create index if not exists idx_credential_checklists_credential_types
  on public.credential_checklists using gin(credential_types);

-- ── updated_at trigger ────────────────────────────────────────
create or replace function public.handle_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_credential_checklists_updated_at
  before update on public.credential_checklists
  for each row execute function public.handle_updated_at();

-- ── RLS ───────────────────────────────────────────────────────
alter table public.credential_checklists enable row level security;

create policy "Authenticated users can read credential_checklists"
  on public.credential_checklists
  for select using (auth.role() = 'authenticated');

-- ============================================================
-- FUTURE SCHEMA NOTE
-- Once you parse each PDF you will likely want something like:
--
--   create table public.checklist_items (
--     id                    uuid primary key default gen_random_uuid(),
--     checklist_id          uuid not null references public.credential_checklists(id),
--     category              text,   -- e.g. "Sea Service", "Examination", "Fees"
--     requirement           text,   -- the parsed line-item text
--     is_required           boolean,
--     notes                 text,
--     sort_order            int,
--     created_at            timestamptz not null default now()
--   );
--
-- At that point renaming this table to "nmc_checklists" keeps things
-- readable: nmc_checklists -> checklist_items.
-- ============================================================
