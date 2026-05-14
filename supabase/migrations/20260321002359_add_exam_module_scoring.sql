-- ============================================================
-- Migration: add question_count and passing_score to nmc_exam_modules
-- ============================================================

alter table public.nmc_exam_modules
  add column if not exists question_count int,
  add column if not exists passing_score  int;

comment on column public.nmc_exam_modules.question_count is
  'Number of questions in this module as defined in the NMC Deck and Engineering Guide';

comment on column public.nmc_exam_modules.passing_score is
  'Minimum passing score (percentage) as defined in the NMC Deck and Engineering Guide';