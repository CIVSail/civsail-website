-- ============================================================
-- Migration: replace module_course_alternatives with course_exam_alternatives
-- ============================================================
-- module_course_alternatives is dropped because the courses PDF describes
-- endorsement-level approvals, not module-level approvals. Mapping at the
-- exam level is accurate; mapping at the module level would be misleading.
-- ============================================================

-- Drop the inaccurate table
drop table if exists public.module_course_alternatives;

-- Create the accurate replacement
create table if not exists public.course_exam_alternatives (
  course_id  uuid not null
    references public.nmc_courses(id) on delete cascade,
  exam_id    uuid not null
    references public.nmc_exams(id) on delete cascade,
  -- any NMC caveats specific to this course/exam pairing
  -- pulled from the approval text in nmc_courses.notes
  notes      text,
  primary key (course_id, exam_id)
);

-- create index idx_course_exam_alternatives_exam_id
--   on public.course_exam_alternatives (exam_id);
--
-- create index idx_course_exam_alternatives_course_id
--   on public.course_exam_alternatives (course_id);

-- updated_at trigger not needed — junction table has no mutable columns

-- RLS
alter table public.course_exam_alternatives enable row level security;

-- create policy "Authenticated users can read course_exam_alternatives"
--   on public.course_exam_alternatives
--   for select using (auth.role() = 'authenticated');

-- ============================================================
-- What this table means:
--   A row (course_id, exam_id) means the NMC has approved
--   that course as satisfying the examination requirements
--   for that exam endorsement. A mariner who completes the
--   course does not need to sit the written modules for that
--   exam, subject to any caveats in the notes column.
-- ============================================================
