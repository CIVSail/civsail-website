-- ============================================================
-- Migration: exam and course data model
-- Extends credential_checklists with the full pipeline:
--   credential_checklists → nmc_exams → nmc_exam_modules → nmc_courses
-- ============================================================

-- ──────────────────────────────────────────────────────────────
-- 1. nmc_exams
--    One row per exam code (e.g. ONC01, GLI01, FCP01).
--    Each exam maps to a specific endorsement and waterway type.
--    Scraped from: https://www.dco.uscg.mil/nmc/examinations/
-- ──────────────────────────────────────────────────────────────
create table if not exists public.nmc_exams (
  id            uuid        primary key default gen_random_uuid(),
  exam_code     text        not null,
  -- e.g. "Master/Chief Mate Unlimited Tonnage"
  endorsement   text        not null,
  -- "Deck" | "Engine"
  department    text        not null,
  -- e.g. "Oceans or Near Coastal", "Great Lakes and Inland",
  --      "River", "Towing Vessel", "MODU", "Additional"
  waterway_type text,
  -- link to the anchor section on the examinations page
  link          text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),

  constraint nmc_exams_exam_code_unique unique (exam_code)
);

create index idx_nmc_exams_department
  on public.nmc_exams (department);

create index idx_nmc_exams_waterway_type
  on public.nmc_exams (waterway_type);

-- ──────────────────────────────────────────────────────────────
-- 2. nmc_exam_modules
--    One row per Q-code module (e.g. Q100, Q101).
--    Modules are reusable — Q100 appears in many exams.
--    topics[] captures the subject matter listed on the exam
--    page; the PDF parser will validate/enrich this later.
--    Scraped from: https://www.dco.uscg.mil/nmc/examinations/
-- ──────────────────────────────────────────────────────────────
create table if not exists public.nmc_exam_modules (
  id          uuid        primary key default gen_random_uuid(),
  -- e.g. "Q100", "Q101", "Q302"
  module_code text        not null,
  -- e.g. "Rules of the Road: International and Inland"
  name        text        not null,
  -- subject matter topics listed for this module
  topics      text[]      not null default '{}',
  -- direct PDF link to the sample exam for this module
  link        text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),

  constraint nmc_exam_modules_code_unique unique (module_code)
);

create index idx_nmc_exam_modules_topics
  on public.nmc_exam_modules using gin(topics);

-- ──────────────────────────────────────────────────────────────
-- 3. nmc_courses
--    One row per approved course.
--    Populated by the PDF parser from:
--      https://www.dco.uscg.mil/Portals/9/NMC/pdfs/courses/courses.pdf
--    This PDF is updated weekly — re-running the parser keeps
--    the table current.
-- ──────────────────────────────────────────────────────────────
create table if not exists public.nmc_courses (
  id                     uuid        primary key default gen_random_uuid(),
  -- official course name as listed in the courses PDF
  name                   text        not null,
  -- school / training provider name
  provider               text,
  -- primary state of the provider
  provider_state         text,
  -- Q-codes this course satisfies in lieu of written exam
  satisfies_modules      text[]      not null default '{}',
  -- endorsements this course satisfies (NMC approval language)
  satisfies_endorsements text[]      not null default '{}',
  -- how long the course certificate is valid (in years)
  -- null = no expiry or not specified
  validity_years         int,
  -- any NMC notes, restrictions, or caveats verbatim from PDF
  notes                  text,
  -- provider website or NMC reference URL if available
  link                   text,
  -- set true once this row has been verified against the latest PDF
  pdf_parsed             boolean     not null default false,
  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now(),

  constraint nmc_courses_name_provider_unique unique (name, provider)
);

create index idx_nmc_courses_satisfies_modules
  on public.nmc_courses using gin(satisfies_modules);

create index idx_nmc_courses_satisfies_endorsements
  on public.nmc_courses using gin(satisfies_endorsements);

create index idx_nmc_courses_provider
  on public.nmc_courses (provider);

-- ──────────────────────────────────────────────────────────────
-- 4. Junction: checklist_exams
--    Which exams are required for a given checklist.
--    M:N between credential_checklists and nmc_exams.
--    Populated by the PDF parser reading each checklist PDF.
-- ──────────────────────────────────────────────────────────────
create table if not exists public.checklist_exams (
  checklist_id uuid not null
    references public.credential_checklists(id) on delete cascade,
  exam_id      uuid not null
    references public.nmc_exams(id) on delete cascade,
  -- some checklists require the exam only conditionally
  notes        text,
  primary key (checklist_id, exam_id)
);

create index idx_checklist_exams_exam_id
  on public.checklist_exams (exam_id);

-- ──────────────────────────────────────────────────────────────
-- 5. Junction: exam_module_assignments
--    Which modules make up a given exam, in order.
--    M:N between nmc_exams and nmc_exam_modules.
--    Scraped from the examinations page.
-- ──────────────────────────────────────────────────────────────
create table if not exists public.exam_module_assignments (
  exam_id      uuid not null
    references public.nmc_exams(id) on delete cascade,
  module_id    uuid not null
    references public.nmc_exam_modules(id) on delete cascade,
  -- display order within the exam
  sort_order   int  not null default 0,
  primary key (exam_id, module_id)
);

create index idx_exam_module_assignments_module_id
  on public.exam_module_assignments (module_id);

-- ──────────────────────────────────────────────────────────────
-- 6. Junction: module_course_alternatives
--    Which courses can satisfy a module in lieu of the written
--    exam. M:N between nmc_exam_modules and nmc_courses.
--    Populated by the PDF parser from courses.pdf.
-- ──────────────────────────────────────────────────────────────
create table if not exists public.module_course_alternatives (
  module_id  uuid not null
    references public.nmc_exam_modules(id) on delete cascade,
  course_id  uuid not null
    references public.nmc_courses(id) on delete cascade,
  -- any NMC caveats specific to this module/course pairing
  notes      text,
  primary key (module_id, course_id)
);

create index idx_module_course_alternatives_course_id
  on public.module_course_alternatives (course_id);

-- ──────────────────────────────────────────────────────────────
-- 7. updated_at triggers for new tables
-- ──────────────────────────────────────────────────────────────
-- (reuses handle_updated_at() created in the first migration)

create trigger set_nmc_exams_updated_at
  before update on public.nmc_exams
  for each row execute function public.handle_updated_at();

create trigger set_nmc_exam_modules_updated_at
  before update on public.nmc_exam_modules
  for each row execute function public.handle_updated_at();

create trigger set_nmc_courses_updated_at
  before update on public.nmc_courses
  for each row execute function public.handle_updated_at();

-- ──────────────────────────────────────────────────────────────
-- 8. RLS — authenticated read on all new tables
-- ──────────────────────────────────────────────────────────────
alter table public.nmc_exams                enable row level security;
alter table public.nmc_exam_modules         enable row level security;
alter table public.nmc_courses              enable row level security;
alter table public.checklist_exams          enable row level security;
alter table public.exam_module_assignments  enable row level security;
alter table public.module_course_alternatives enable row level security;

create policy "Authenticated users can read nmc_exams"
  on public.nmc_exams for select using (auth.role() = 'authenticated');

create policy "Authenticated users can read nmc_exam_modules"
  on public.nmc_exam_modules for select using (auth.role() = 'authenticated');

create policy "Authenticated users can read nmc_courses"
  on public.nmc_courses for select using (auth.role() = 'authenticated');

create policy "Authenticated users can read checklist_exams"
  on public.checklist_exams for select using (auth.role() = 'authenticated');

create policy "Authenticated users can read exam_module_assignments"
  on public.exam_module_assignments for select using (auth.role() = 'authenticated');

create policy "Authenticated users can read module_course_alternatives"
  on public.module_course_alternatives for select using (auth.role() = 'authenticated');