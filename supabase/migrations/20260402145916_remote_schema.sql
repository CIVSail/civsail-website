

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE TYPE "public"."port_page_status" AS ENUM (
    'full_guide',
    'basic_page',
    'none'
);


ALTER TYPE "public"."port_page_status" OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."calculate_days_by_propulsion"("p_user_id" "uuid", "p_propulsion" "text") RETURNS integer
    LANGUAGE "sql" STABLE
    AS $$
  SELECT COALESCE(SUM(days_served), 0)::INTEGER
  FROM sea_service
  WHERE user_id = p_user_id
    AND propulsion_type = p_propulsion
    AND verified = true
    AND is_creditable = true;
$$;


ALTER FUNCTION "public"."calculate_days_by_propulsion"("p_user_id" "uuid", "p_propulsion" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."calculate_days_by_route"("p_user_id" "uuid", "p_route" "text") RETURNS integer
    LANGUAGE "sql" STABLE
    AS $$
  SELECT COALESCE(SUM(days_served), 0)::INTEGER
  FROM sea_service
  WHERE user_id = p_user_id
    AND route = p_route
    AND verified = true
    AND is_creditable = true;
$$;


ALTER FUNCTION "public"."calculate_days_by_route"("p_user_id" "uuid", "p_route" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."calculate_recency"("p_user_id" "uuid", "p_position" "text" DEFAULT NULL::"text") RETURNS integer
    LANGUAGE "sql" STABLE
    AS $$
  SELECT COALESCE(SUM(days_served), 0)::INTEGER
  FROM sea_service
  WHERE user_id = p_user_id
    AND (p_position IS NULL OR position_held = p_position)
    AND sign_off_date >= CURRENT_DATE - INTERVAL '5 years'
    AND verified = true
    AND is_creditable = true;
$$;


ALTER FUNCTION "public"."calculate_recency"("p_user_id" "uuid", "p_position" "text") OWNER TO "postgres";


COMMENT ON FUNCTION "public"."calculate_recency"("p_user_id" "uuid", "p_position" "text") IS 'Calculate creditable days in last 5 years for renewal eligibility (46 CFR 10.227)';



CREATE OR REPLACE FUNCTION "public"."check_overlapping_service"("p_user_id" "uuid", "p_sign_on" "date", "p_sign_off" "date", "p_exclude_id" "uuid" DEFAULT NULL::"uuid") RETURNS TABLE("id" "uuid", "vessel_name" "text", "sign_on_date" "date", "sign_off_date" "date", "overlap_days" integer)
    LANGUAGE "sql" STABLE
    AS $$
  SELECT 
    ss.id,
    ss.vessel_name,
    ss.sign_on_date,
    ss.sign_off_date,
    (LEAST(ss.sign_off_date, p_sign_off) - GREATEST(ss.sign_on_date, p_sign_on) + 1) as overlap_days
  FROM sea_service ss
  WHERE ss.user_id = p_user_id
    AND (p_exclude_id IS NULL OR ss.id != p_exclude_id)
    AND ss.sign_on_date <= p_sign_off
    AND ss.sign_off_date >= p_sign_on
  ORDER BY ss.sign_on_date;
$$;


ALTER FUNCTION "public"."check_overlapping_service"("p_user_id" "uuid", "p_sign_on" "date", "p_sign_off" "date", "p_exclude_id" "uuid") OWNER TO "postgres";


COMMENT ON FUNCTION "public"."check_overlapping_service"("p_user_id" "uuid", "p_sign_on" "date", "p_sign_off" "date", "p_exclude_id" "uuid") IS 'Find overlapping service periods (cannot work on two ships at once)';



CREATE OR REPLACE FUNCTION "public"."check_sea_service_overlap"("p_user_id" "uuid", "p_sign_on" "date", "p_sign_off" "date", "p_exclude_id" "uuid" DEFAULT NULL::"uuid") RETURNS TABLE("has_overlap" boolean, "overlapping_vessel" "text", "overlapping_id" "uuid")
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  RETURN QUERY
  SELECT 
    true,
    vessel_name,
    id
  FROM sea_service
  WHERE user_id = p_user_id
    AND (p_exclude_id IS NULL OR id != p_exclude_id)
    AND (
      (sign_on_date <= p_sign_off AND sign_off_date >= p_sign_on)
    )
  LIMIT 1;
  
  -- If no overlaps found, return false
  IF NOT FOUND THEN
    RETURN QUERY SELECT false, NULL::TEXT, NULL::UUID;
  END IF;
END;
$$;


ALTER FUNCTION "public"."check_sea_service_overlap"("p_user_id" "uuid", "p_sign_on" "date", "p_sign_off" "date", "p_exclude_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_sea_service_summary"("p_user_id" "uuid") RETURNS TABLE("total_days" integer, "deck_days" integer, "engine_days" integer, "steward_days" integer, "ocean_days" integer, "near_coastal_days" integer, "watchkeeping_days" integer, "supervised_watchkeeping_days" integer, "days_over_1600grt" integer, "most_recent_sign_off" "date", "needs_review_count" integer)
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COALESCE(SUM(days_served), 0)::INTEGER as total_days,
    COALESCE(SUM(CASE WHEN department = 'Deck' THEN days_served ELSE 0 END), 0)::INTEGER,
    COALESCE(SUM(CASE WHEN department = 'Engine' THEN days_served ELSE 0 END), 0)::INTEGER,
    COALESCE(SUM(CASE WHEN department = 'Steward' THEN days_served ELSE 0 END), 0)::INTEGER,
    COALESCE(SUM(CASE WHEN route = 'Oceans' THEN days_served ELSE 0 END), 0)::INTEGER,
    COALESCE(SUM(CASE WHEN route = 'Near Coastal' THEN days_served ELSE 0 END), 0)::INTEGER,
    COALESCE(SUM(watchkeeping_days), 0)::INTEGER,
    COALESCE(SUM(CASE WHEN supervised = true THEN watchkeeping_days ELSE 0 END), 0)::INTEGER,
    COALESCE(SUM(CASE WHEN grt >= 1600 THEN days_served ELSE 0 END), 0)::INTEGER,
    MAX(sign_off_date),
    COUNT(CASE WHEN needs_manual_review = true THEN 1 END)::INTEGER
  FROM sea_service
  WHERE user_id = p_user_id;
END;
$$;


ALTER FUNCTION "public"."get_sea_service_summary"("p_user_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_updated_at"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
begin
  new.updated_at = now();
  return new;
end;
$$;


ALTER FUNCTION "public"."handle_updated_at"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_career_goals_updated_at"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;


ALTER FUNCTION "public"."update_career_goals_updated_at"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_ports_updated_at"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_ports_updated_at"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_sea_service_updated_at"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;


ALTER FUNCTION "public"."update_sea_service_updated_at"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_ships_updated_at"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;


ALTER FUNCTION "public"."update_ships_updated_at"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_training_certificates_updated_at"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;


ALTER FUNCTION "public"."update_training_certificates_updated_at"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."career_goals" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "current_credential" "text" NOT NULL,
    "target_credential" "text" NOT NULL,
    "preferred_route" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "primary_goal" "text",
    "secondary_goal" "text",
    "goal_notes" "text",
    "transition_target" "text",
    "commitment_end_date" "date",
    CONSTRAINT "career_goals_current_credential_check" CHECK (("current_credential" = ANY (ARRAY['third_mate'::"text", 'second_mate'::"text", 'chief_mate'::"text", 'master'::"text", 'third_ae'::"text", 'second_ae'::"text", 'first_ae'::"text", 'chief_engineer'::"text"]))),
    CONSTRAINT "career_goals_preferred_route_check" CHECK (("preferred_route" = ANY (ARRAY['oceans'::"text", 'near_coastal'::"text", 'both'::"text"]))),
    CONSTRAINT "career_goals_primary_goal_check" CHECK (("primary_goal" = ANY (ARRAY['upgrade_fast'::"text", 'transition_ashore'::"text", 'fulfill_commitment'::"text", 'maximize_earnings'::"text", 'build_optionality'::"text", 'not_sure_yet'::"text", 'explore_experience'::"text", 'sea_time_for_other'::"text"]))),
    CONSTRAINT "career_goals_secondary_goal_check" CHECK (("secondary_goal" = ANY (ARRAY['upgrade_fast'::"text", 'transition_ashore'::"text", 'fulfill_commitment'::"text", 'maximize_earnings'::"text", 'build_optionality'::"text", 'not_sure_yet'::"text", 'explore_experience'::"text", 'sea_time_for_other'::"text"]))),
    CONSTRAINT "career_goals_target_credential_check" CHECK (("target_credential" = ANY (ARRAY['third_mate'::"text", 'second_mate'::"text", 'chief_mate'::"text", 'master'::"text", 'third_ae'::"text", 'second_ae'::"text", 'first_ae'::"text", 'chief_engineer'::"text"])))
);


ALTER TABLE "public"."career_goals" OWNER TO "postgres";


COMMENT ON COLUMN "public"."career_goals"."primary_goal" IS 'Intent-based career goal archetype';



COMMENT ON COLUMN "public"."career_goals"."secondary_goal" IS 'Optional secondary goal';



CREATE TABLE IF NOT EXISTS "public"."checklist_exams" (
    "checklist_id" "uuid" NOT NULL,
    "exam_id" "uuid" NOT NULL,
    "notes" "text"
);


ALTER TABLE "public"."checklist_exams" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."course_exam_alternatives" (
    "course_id" "uuid" NOT NULL,
    "exam_id" "uuid" NOT NULL,
    "notes" "text"
);


ALTER TABLE "public"."course_exam_alternatives" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."credential_checklists" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "departments" "text"[] DEFAULT '{}'::"text"[] NOT NULL,
    "credential_types" "text"[] DEFAULT '{}'::"text"[] NOT NULL,
    "roles" "text"[] DEFAULT '{}'::"text"[] NOT NULL,
    "link" "text",
    "pdf_parsed" boolean DEFAULT false NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."credential_checklists" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."credential_reminders" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "document_type" "text" NOT NULL,
    "document_name" "text" NOT NULL,
    "milestone" "text" NOT NULL,
    "days_before_expiration" integer NOT NULL,
    "expiration_date" "date" NOT NULL,
    "sent_at" timestamp with time zone DEFAULT "now"(),
    "emails_sent_to" "text"[],
    "delivery_status" "text" DEFAULT 'sent'::"text",
    "resend_message_id" "text"
);


ALTER TABLE "public"."credential_reminders" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."credentials" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid",
    "credential_type" "text" NOT NULL,
    "endorsement_name" "text" NOT NULL,
    "department" "text",
    "verified_by_nmc" boolean DEFAULT true,
    "verified_at" timestamp with time zone DEFAULT "now"(),
    "created_at" timestamp with time zone DEFAULT "now"(),
    "raw_nmc_text" "text",
    "endorsement_system" "text",
    "name" "text",
    "short_name" "text",
    "rank" integer DEFAULT 0,
    "qualification_level" "text",
    "issue_date" "date",
    "expiration_date" "date",
    "source_verification_id" "uuid",
    "needs_review" boolean DEFAULT false,
    CONSTRAINT "credentials_endorsement_system_check" CHECK (("endorsement_system" = ANY (ARRAY['national'::"text", 'stcw'::"text"]))),
    CONSTRAINT "credentials_qualification_level_check" CHECK (("qualification_level" = ANY (ARRAY['entry'::"text", 'rating'::"text", 'junior_officer'::"text", 'senior_officer'::"text"])))
);


ALTER TABLE "public"."credentials" OWNER TO "postgres";


COMMENT ON TABLE "public"."credentials" IS 'Stores user maritime credentials parsed from NMC emails or manually entered';



COMMENT ON COLUMN "public"."credentials"."raw_nmc_text" IS 'Original line from NMC email for audit trail';



COMMENT ON COLUMN "public"."credentials"."endorsement_system" IS 'national = US domestic, stcw = international';



COMMENT ON COLUMN "public"."credentials"."rank" IS 'Hierarchy: 1=entry, 3=rating, 5=junior officer, 10=senior officer';



CREATE TABLE IF NOT EXISTS "public"."documents" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid",
    "file_name" "text" NOT NULL,
    "file_type" "text" NOT NULL,
    "storage_path" "text" NOT NULL,
    "uploaded_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."documents" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."exam_module_assignments" (
    "exam_id" "uuid" NOT NULL,
    "module_id" "uuid" NOT NULL,
    "sort_order" integer DEFAULT 0 NOT NULL
);


ALTER TABLE "public"."exam_module_assignments" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."leave_chits" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "user_id" "uuid",
    "file_path" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"())
);


ALTER TABLE "public"."leave_chits" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."newsletter_subscribers" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "email" "text" NOT NULL,
    "source" "text" DEFAULT 'editorial'::"text",
    "subscribed_at" timestamp with time zone DEFAULT "now"(),
    "confirmed" boolean DEFAULT false,
    "unsubscribed_at" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."newsletter_subscribers" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."nmc_courses" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "provider" "text",
    "provider_state" "text",
    "satisfies_modules" "text"[] DEFAULT '{}'::"text"[] NOT NULL,
    "satisfies_endorsements" "text"[] DEFAULT '{}'::"text"[] NOT NULL,
    "validity_years" integer,
    "notes" "text",
    "link" "text",
    "pdf_parsed" boolean DEFAULT false NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."nmc_courses" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."nmc_exam_modules" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "module_code" "text" NOT NULL,
    "name" "text" NOT NULL,
    "topics" "text"[] DEFAULT '{}'::"text"[] NOT NULL,
    "link" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "question_count" integer,
    "passing_score" integer
);


ALTER TABLE "public"."nmc_exam_modules" OWNER TO "postgres";


COMMENT ON COLUMN "public"."nmc_exam_modules"."question_count" IS 'Number of questions in this module as defined in the NMC Deck and Engineering Guide';



COMMENT ON COLUMN "public"."nmc_exam_modules"."passing_score" IS 'Minimum passing score (percentage) as defined in the NMC Deck and Engineering Guide';



CREATE TABLE IF NOT EXISTS "public"."nmc_exams" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "exam_code" "text" NOT NULL,
    "endorsement" "text" NOT NULL,
    "department" "text" NOT NULL,
    "waterway_type" "text",
    "link" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."nmc_exams" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."nmc_verifications" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid",
    "ref_number" "text" NOT NULL,
    "last_name" "text" NOT NULL,
    "verification_type" "text" NOT NULL,
    "status" "text" DEFAULT 'pending'::"text",
    "requested_at" timestamp with time zone DEFAULT "now"(),
    "completed_at" timestamp with time zone,
    "raw_email_text" "text",
    "parsed_data" "jsonb",
    "check_count" integer DEFAULT 0,
    "last_checked_at" timestamp with time zone,
    "has_discrepancy" boolean DEFAULT false
);


ALTER TABLE "public"."nmc_verifications" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."ports" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "city" "text" NOT NULL,
    "state" "text",
    "country" "text" NOT NULL,
    "latitude" numeric(9,6) NOT NULL,
    "longitude" numeric(9,6) NOT NULL,
    "utc_offset" integer,
    "has_dst" boolean DEFAULT false,
    "regulation_14" boolean DEFAULT false,
    "regulation_13" boolean DEFAULT false,
    "slug" "text",
    "page_status" "public"."port_page_status" DEFAULT 'none'::"public"."port_page_status",
    "display_name" "text",
    "region" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."ports" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."profiles" (
    "user_id" "uuid" NOT NULL,
    "full_name" "text",
    "phone" "text",
    "ref_number" "text",
    "mmc_exp" "date",
    "medical_exp" "date",
    "passport_exp" "date",
    "twic_exp" "date",
    "license_exp" "date",
    "created_at" timestamp without time zone DEFAULT "now"(),
    "ship_email" "text",
    "email" "text",
    "alert_email" boolean DEFAULT true,
    "alert_sms" boolean DEFAULT false,
    "nmc_verification_status" "text" DEFAULT 'not_started'::"text",
    "nmc_verified_at" timestamp with time zone,
    "nmc_discrepancy_reviewed" boolean DEFAULT false,
    "nmc_discrepancy_reviewed_at" timestamp with time zone,
    "mmc_exp_user_entered" "date",
    "mmc_exp_nmc_verified" "date",
    "mmc_exp_user_override" boolean DEFAULT false,
    "medical_exp_user_entered" "date",
    "medical_exp_nmc_verified" "date",
    "medical_exp_user_override" boolean DEFAULT false,
    "industry_entry_route" "text",
    "academy_name" "text",
    "academy_program" "text",
    "military_branch" "text",
    "sea_days_per_year" integer DEFAULT 200,
    "first_name" "text",
    "last_name" "text",
    "career_track" "text",
    "contracting_company" "text",
    "department" "text",
    "has_mmc" boolean,
    "onboarding_completed_at" timestamp with time zone,
    "sector" "text",
    CONSTRAINT "profiles_industry_entry_route_check" CHECK (("industry_entry_route" = ANY (ARRAY['hawsepiper'::"text", 'academy'::"text", 'military'::"text"])))
);


ALTER TABLE "public"."profiles" OWNER TO "postgres";


COMMENT ON TABLE "public"."profiles" IS 'Initial Profile Date';



COMMENT ON COLUMN "public"."profiles"."industry_entry_route" IS 'How the mariner entered the industry';



COMMENT ON COLUMN "public"."profiles"."sea_days_per_year" IS 'Expected or historical average sea days per year for time-to-upgrade estimates';



CREATE TABLE IF NOT EXISTS "public"."retirement_reviews" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "review" "text" NOT NULL,
    "rating" integer NOT NULL,
    "approved" boolean DEFAULT false,
    "created_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "retirement_reviews_rating_check" CHECK ((("rating" >= 1) AND ("rating" <= 5)))
);


ALTER TABLE "public"."retirement_reviews" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."sea_service" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "document_id" "uuid",
    "vessel_name" "text" NOT NULL,
    "official_number" "text",
    "gross_tonnage" integer,
    "horsepower" integer,
    "propulsion_type" "text",
    "route" "text",
    "sign_on_date" "date" NOT NULL,
    "sign_off_date" "date" NOT NULL,
    "days_served" integer GENERATED ALWAYS AS ((("sign_off_date" - "sign_on_date") + 1)) STORED,
    "position_held" "text" NOT NULL,
    "department" "text",
    "is_creditable" boolean DEFAULT true,
    "creditable_for_routes" "text"[],
    "creditable_toward" "text"[],
    "tonnage_category" "text",
    "counts_toward_unlimited" boolean DEFAULT true,
    "raw_ocr_text" "text",
    "ocr_confidence" numeric(5,2),
    "ocr_method" "text",
    "ocr_processed_at" timestamp with time zone,
    "needs_manual_review" boolean DEFAULT false,
    "validation_flags" "jsonb" DEFAULT '[]'::"jsonb",
    "verified" boolean DEFAULT false,
    "verified_at" timestamp with time zone,
    "verified_by" "uuid",
    "notes" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "watchkeeping_days" integer DEFAULT 0,
    "supervised" boolean DEFAULT false,
    "grt" integer,
    "imo_number" "text",
    "vessel_type" "text",
    "flag_state" "text",
    "company" "text",
    "dp_days" integer DEFAULT 0,
    "officer_on_watch" boolean DEFAULT false,
    "cadet_service" boolean DEFAULT false,
    "port_sign_on" "text",
    "port_sign_off" "text",
    "source_doc_id" "text",
    "source_doc_path" "text",
    "ocr_confidence_details" "jsonb",
    "page_reference" "text",
    "days_served_computed" integer GENERATED ALWAYS AS ((("sign_off_date" - "sign_on_date") + 1)) STORED,
    CONSTRAINT "positive_grt" CHECK (("grt" > 0)),
    CONSTRAINT "sea_service_department_check" CHECK (("department" = ANY (ARRAY['deck'::"text", 'engine'::"text", 'steward'::"text", 'other'::"text"]))),
    CONSTRAINT "sea_service_dp_days_check" CHECK (("dp_days" >= 0)),
    CONSTRAINT "sea_service_ocr_method_check" CHECK (("ocr_method" = ANY (ARRAY['google_vision'::"text", 'tesseract'::"text", 'manual'::"text"]))),
    CONSTRAINT "sea_service_propulsion_type_check" CHECK (("propulsion_type" = ANY (ARRAY['motor'::"text", 'steam'::"text", 'gas_turbine'::"text", 'sail'::"text", 'mixed'::"text"]))),
    CONSTRAINT "sea_service_route_check" CHECK (("route" = ANY (ARRAY['oceans'::"text", 'near_coastal'::"text", 'great_lakes'::"text", 'inland'::"text", 'rivers'::"text"]))),
    CONSTRAINT "sea_service_tonnage_category_check" CHECK (("tonnage_category" = ANY (ARRAY['under_200'::"text", '200_to_1600'::"text", 'over_1600'::"text", 'unlimited'::"text"]))),
    CONSTRAINT "sea_service_watchkeeping_days_check" CHECK (("watchkeeping_days" >= 0)),
    CONSTRAINT "valid_dates" CHECK (("sign_off_date" >= "sign_on_date")),
    CONSTRAINT "valid_days" CHECK (("days_served" >= 0)),
    CONSTRAINT "valid_dp_days" CHECK (("dp_days" <= "days_served")),
    CONSTRAINT "valid_tonnage" CHECK ((("gross_tonnage" IS NULL) OR ("gross_tonnage" >= 0))),
    CONSTRAINT "valid_watchkeeping" CHECK (("watchkeeping_days" <= "days_served"))
);


ALTER TABLE "public"."sea_service" OWNER TO "postgres";


COMMENT ON TABLE "public"."sea_service" IS 'Mariner sea service ledger - stores all verified service periods for eligibility calculations and career planning';



COMMENT ON COLUMN "public"."sea_service"."days_served" IS 'Auto-calculated: sign_off_date - sign_on_date + 1';



COMMENT ON COLUMN "public"."sea_service"."creditable_for_routes" IS 'Routes this service counts toward (oceans counts for all)';



COMMENT ON COLUMN "public"."sea_service"."tonnage_category" IS 'For tracking 25% rule (46 CFR 11.402)';



COMMENT ON COLUMN "public"."sea_service"."ocr_confidence" IS 'Overall OCR extraction confidence (0-1)';



COMMENT ON COLUMN "public"."sea_service"."validation_flags" IS 'JSON array of validation issues flagged during OCR';



COMMENT ON COLUMN "public"."sea_service"."watchkeeping_days" IS 'Days spent standing watch (required for OICNW/STCW)';



COMMENT ON COLUMN "public"."sea_service"."supervised" IS 'Whether watchkeeping was supervised (required for STCW II/1)';



COMMENT ON COLUMN "public"."sea_service"."grt" IS 'Gross Registered Tons - used for tonnage limitation checks';



COMMENT ON COLUMN "public"."sea_service"."dp_days" IS 'Dynamic Positioning days (for offshore/DP operator paths)';



COMMENT ON COLUMN "public"."sea_service"."officer_on_watch" IS 'Served as Officer on Watch (STCW evidence)';



COMMENT ON COLUMN "public"."sea_service"."cadet_service" IS 'Cadet or training service (may have special equivalency rules)';



COMMENT ON COLUMN "public"."sea_service"."source_doc_id" IS 'Reference to the uploaded sea service letter';



CREATE OR REPLACE VIEW "public"."sea_service_summary" WITH ("security_invoker"='true') AS
 WITH "route_totals" AS (
         SELECT "sea_service"."user_id",
            "sea_service"."route",
            "sum"("sea_service"."days_served") AS "total_days"
           FROM "public"."sea_service"
          WHERE (("sea_service"."is_creditable" = true) AND ("sea_service"."route" IS NOT NULL))
          GROUP BY "sea_service"."user_id", "sea_service"."route"
        ), "propulsion_totals" AS (
         SELECT "sea_service"."user_id",
            "sea_service"."propulsion_type",
            "sum"("sea_service"."days_served") AS "total_days"
           FROM "public"."sea_service"
          WHERE (("sea_service"."is_creditable" = true) AND ("sea_service"."propulsion_type" IS NOT NULL))
          GROUP BY "sea_service"."user_id", "sea_service"."propulsion_type"
        )
 SELECT "ss"."user_id",
    "count"(*) AS "total_voyages",
    "sum"("ss"."days_served") AS "total_days",
    "min"("ss"."sign_on_date") AS "first_voyage",
    "max"("ss"."sign_off_date") AS "last_voyage",
    "count"(DISTINCT "ss"."vessel_name") AS "unique_vessels",
    "count"(*) FILTER (WHERE "ss"."needs_manual_review") AS "needs_review",
    "count"(*) FILTER (WHERE "ss"."verified") AS "verified_count",
    ( SELECT "jsonb_object_agg"("rt"."route", "rt"."total_days") AS "jsonb_object_agg"
           FROM "route_totals" "rt"
          WHERE ("rt"."user_id" = "ss"."user_id")) AS "days_by_route",
    ( SELECT "jsonb_object_agg"("pt"."propulsion_type", "pt"."total_days") AS "jsonb_object_agg"
           FROM "propulsion_totals" "pt"
          WHERE ("pt"."user_id" = "ss"."user_id")) AS "days_by_propulsion"
   FROM "public"."sea_service" "ss"
  WHERE ("ss"."is_creditable" = true)
  GROUP BY "ss"."user_id";


ALTER TABLE "public"."sea_service_summary" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."ships" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "class" "text" NOT NULL,
    "hull_number" "text",
    "operator" "text" NOT NULL,
    "service_type" "text",
    "grt" integer,
    "tonnage_band" "text",
    "route_category" "text",
    "propulsion_type" "text",
    "typical_theater" "text",
    "home_port" "text",
    "slug" "text" NOT NULL,
    "description" "text",
    "image_url" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "ships_operator_check" CHECK (("operator" = ANY (ARRAY['msc'::"text", 'noaa'::"text", 'commercial'::"text", 'usn'::"text"]))),
    CONSTRAINT "ships_propulsion_type_check" CHECK (("propulsion_type" = ANY (ARRAY['motor'::"text", 'steam'::"text", 'gas_turbine'::"text", 'sail'::"text"]))),
    CONSTRAINT "ships_route_category_check" CHECK (("route_category" = ANY (ARRAY['oceans'::"text", 'near_coastal'::"text", 'great_lakes'::"text", 'inland'::"text"]))),
    CONSTRAINT "ships_tonnage_band_check" CHECK (("tonnage_band" = ANY (ARRAY['unlimited'::"text", '500_to_1600'::"text", '200_to_500'::"text", 'under_200'::"text"])))
);


ALTER TABLE "public"."ships" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."training_certificates" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "certificate_category" "text" NOT NULL,
    "course_type" "text" NOT NULL,
    "course_name" "text" NOT NULL,
    "completion_date" "date" NOT NULL,
    "expiration_date" "date",
    "certificate_number" "text",
    "issuing_school" "text",
    "doc_path" "text",
    "satisfied_via_academy" boolean DEFAULT false,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "training_certificates_certificate_category_check" CHECK (("certificate_category" = ANY (ARRAY['safety_renewable'::"text", 'operational'::"text", 'management_level'::"text", 'specialist'::"text"])))
);


ALTER TABLE "public"."training_certificates" OWNER TO "postgres";


ALTER TABLE ONLY "public"."career_goals"
    ADD CONSTRAINT "career_goals_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."career_goals"
    ADD CONSTRAINT "career_goals_user_id_key" UNIQUE ("user_id");



ALTER TABLE ONLY "public"."checklist_exams"
    ADD CONSTRAINT "checklist_exams_pkey" PRIMARY KEY ("checklist_id", "exam_id");



ALTER TABLE ONLY "public"."course_exam_alternatives"
    ADD CONSTRAINT "course_exam_alternatives_pkey" PRIMARY KEY ("course_id", "exam_id");



ALTER TABLE ONLY "public"."credential_checklists"
    ADD CONSTRAINT "credential_checklists_name_unique" UNIQUE ("name");



ALTER TABLE ONLY "public"."credential_checklists"
    ADD CONSTRAINT "credential_checklists_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."credential_reminders"
    ADD CONSTRAINT "credential_reminders_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."credential_reminders"
    ADD CONSTRAINT "credential_reminders_user_id_document_type_milestone_expira_key" UNIQUE ("user_id", "document_type", "milestone", "expiration_date");



ALTER TABLE ONLY "public"."credentials"
    ADD CONSTRAINT "credentials_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."credentials"
    ADD CONSTRAINT "credentials_user_id_endorsement_name_key" UNIQUE ("user_id", "endorsement_name");



ALTER TABLE ONLY "public"."documents"
    ADD CONSTRAINT "documents_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."exam_module_assignments"
    ADD CONSTRAINT "exam_module_assignments_pkey" PRIMARY KEY ("exam_id", "module_id");



ALTER TABLE ONLY "public"."leave_chits"
    ADD CONSTRAINT "leave_chits_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."newsletter_subscribers"
    ADD CONSTRAINT "newsletter_subscribers_email_key" UNIQUE ("email");



ALTER TABLE ONLY "public"."newsletter_subscribers"
    ADD CONSTRAINT "newsletter_subscribers_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."nmc_courses"
    ADD CONSTRAINT "nmc_courses_name_provider_unique" UNIQUE ("name", "provider");



ALTER TABLE ONLY "public"."nmc_courses"
    ADD CONSTRAINT "nmc_courses_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."nmc_exam_modules"
    ADD CONSTRAINT "nmc_exam_modules_code_unique" UNIQUE ("module_code");



ALTER TABLE ONLY "public"."nmc_exam_modules"
    ADD CONSTRAINT "nmc_exam_modules_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."nmc_exams"
    ADD CONSTRAINT "nmc_exams_exam_code_unique" UNIQUE ("exam_code");



ALTER TABLE ONLY "public"."nmc_exams"
    ADD CONSTRAINT "nmc_exams_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."nmc_verifications"
    ADD CONSTRAINT "nmc_verifications_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."ports"
    ADD CONSTRAINT "ports_city_country_unique" UNIQUE ("city", "country");



ALTER TABLE ONLY "public"."ports"
    ADD CONSTRAINT "ports_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."ports"
    ADD CONSTRAINT "ports_slug_key" UNIQUE ("slug");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_pkey" PRIMARY KEY ("user_id");



ALTER TABLE ONLY "public"."retirement_reviews"
    ADD CONSTRAINT "retirement_reviews_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."sea_service"
    ADD CONSTRAINT "sea_service_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."ships"
    ADD CONSTRAINT "ships_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."ships"
    ADD CONSTRAINT "ships_slug_key" UNIQUE ("slug");



ALTER TABLE ONLY "public"."training_certificates"
    ADD CONSTRAINT "training_certificates_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."sea_service"
    ADD CONSTRAINT "unique_service_period" UNIQUE ("user_id", "vessel_name", "sign_on_date", "sign_off_date", "position_held");



CREATE UNIQUE INDEX "career_goals_user_id_unique" ON "public"."career_goals" USING "btree" ("user_id");



CREATE UNIQUE INDEX "credential_reminders_dedup" ON "public"."credential_reminders" USING "btree" ("user_id", "document_type", "milestone", "expiration_date");



CREATE UNIQUE INDEX "credentials_user_endorsement_unique" ON "public"."credentials" USING "btree" ("user_id", "endorsement_name");



CREATE INDEX "idx_career_goals_user_id" ON "public"."career_goals" USING "btree" ("user_id");



CREATE INDEX "idx_checklist_exams_exam_id" ON "public"."checklist_exams" USING "btree" ("exam_id");



CREATE INDEX "idx_course_exam_alternatives_course_id" ON "public"."course_exam_alternatives" USING "btree" ("course_id");



CREATE INDEX "idx_course_exam_alternatives_exam_id" ON "public"."course_exam_alternatives" USING "btree" ("exam_id");



CREATE INDEX "idx_credential_checklists_credential_types" ON "public"."credential_checklists" USING "gin" ("credential_types");



CREATE INDEX "idx_credential_checklists_departments" ON "public"."credential_checklists" USING "gin" ("departments");



CREATE INDEX "idx_credential_checklists_roles" ON "public"."credential_checklists" USING "gin" ("roles");



CREATE INDEX "idx_credential_reminders_lookup" ON "public"."credential_reminders" USING "btree" ("user_id", "document_type", "milestone");



CREATE INDEX "idx_credential_reminders_sent" ON "public"."credential_reminders" USING "btree" ("sent_at");



CREATE INDEX "idx_credential_reminders_user" ON "public"."credential_reminders" USING "btree" ("user_id");



CREATE INDEX "idx_credential_reminders_user_id" ON "public"."credential_reminders" USING "btree" ("user_id");



CREATE INDEX "idx_credentials_dept_rank" ON "public"."credentials" USING "btree" ("user_id", "department", "rank" DESC);



CREATE INDEX "idx_credentials_system" ON "public"."credentials" USING "btree" ("user_id", "endorsement_system");



CREATE INDEX "idx_credentials_type" ON "public"."credentials" USING "btree" ("credential_type");



CREATE INDEX "idx_credentials_user" ON "public"."credentials" USING "btree" ("user_id");



CREATE INDEX "idx_credentials_user_id" ON "public"."credentials" USING "btree" ("user_id");



CREATE INDEX "idx_exam_module_assignments_module_id" ON "public"."exam_module_assignments" USING "btree" ("module_id");



CREATE INDEX "idx_newsletter_email" ON "public"."newsletter_subscribers" USING "btree" ("email");



CREATE INDEX "idx_nmc_courses_provider" ON "public"."nmc_courses" USING "btree" ("provider");



CREATE INDEX "idx_nmc_courses_satisfies_endorsements" ON "public"."nmc_courses" USING "gin" ("satisfies_endorsements");



CREATE INDEX "idx_nmc_courses_satisfies_modules" ON "public"."nmc_courses" USING "gin" ("satisfies_modules");



CREATE INDEX "idx_nmc_exam_modules_topics" ON "public"."nmc_exam_modules" USING "gin" ("topics");



CREATE INDEX "idx_nmc_exams_department" ON "public"."nmc_exams" USING "btree" ("department");



CREATE INDEX "idx_nmc_exams_waterway_type" ON "public"."nmc_exams" USING "btree" ("waterway_type");



CREATE INDEX "idx_nmc_pending" ON "public"."nmc_verifications" USING "btree" ("status", "requested_at") WHERE ("status" = 'pending'::"text");



CREATE INDEX "idx_nmc_user" ON "public"."nmc_verifications" USING "btree" ("user_id");



CREATE INDEX "idx_nmc_verifications_pending" ON "public"."nmc_verifications" USING "btree" ("requested_at") WHERE ("status" = 'pending'::"text");



CREATE INDEX "idx_nmc_verifications_status" ON "public"."nmc_verifications" USING "btree" ("status");



CREATE INDEX "idx_nmc_verifications_user_id" ON "public"."nmc_verifications" USING "btree" ("user_id");



CREATE INDEX "idx_ports_coordinates" ON "public"."ports" USING "btree" ("latitude", "longitude");



CREATE INDEX "idx_ports_country" ON "public"."ports" USING "btree" ("country");



CREATE INDEX "idx_ports_page_status" ON "public"."ports" USING "btree" ("page_status");



CREATE INDEX "idx_ports_region" ON "public"."ports" USING "btree" ("region") WHERE ("region" IS NOT NULL);



CREATE INDEX "idx_ports_slug" ON "public"."ports" USING "btree" ("slug") WHERE ("slug" IS NOT NULL);



CREATE INDEX "idx_profiles_alert_email" ON "public"."profiles" USING "btree" ("alert_email") WHERE ("alert_email" = true);



CREATE INDEX "idx_profiles_nmc_status" ON "public"."profiles" USING "btree" ("nmc_verification_status");



CREATE INDEX "idx_retirement_reviews_approved" ON "public"."retirement_reviews" USING "btree" ("approved", "created_at" DESC);



CREATE INDEX "idx_sea_service_dates" ON "public"."sea_service" USING "btree" ("sign_on_date", "sign_off_date");



CREATE INDEX "idx_sea_service_dedup" ON "public"."sea_service" USING "btree" ("user_id", "vessel_name", "sign_on_date", "sign_off_date");



CREATE INDEX "idx_sea_service_department" ON "public"."sea_service" USING "btree" ("department");



CREATE INDEX "idx_sea_service_document" ON "public"."sea_service" USING "btree" ("document_id") WHERE ("document_id" IS NOT NULL);



CREATE INDEX "idx_sea_service_grt" ON "public"."sea_service" USING "btree" ("grt");



CREATE INDEX "idx_sea_service_needs_review" ON "public"."sea_service" USING "btree" ("needs_manual_review") WHERE ("needs_manual_review" = true);



CREATE INDEX "idx_sea_service_position" ON "public"."sea_service" USING "btree" ("user_id", "position_held");



CREATE INDEX "idx_sea_service_propulsion" ON "public"."sea_service" USING "btree" ("user_id", "propulsion_type") WHERE ("propulsion_type" IS NOT NULL);



CREATE INDEX "idx_sea_service_review" ON "public"."sea_service" USING "btree" ("user_id", "needs_manual_review") WHERE ("needs_manual_review" = true);



CREATE INDEX "idx_sea_service_route" ON "public"."sea_service" USING "btree" ("user_id", "route") WHERE ("route" IS NOT NULL);



CREATE INDEX "idx_sea_service_sign_on_date" ON "public"."sea_service" USING "btree" ("user_id", "sign_on_date" DESC);



CREATE INDEX "idx_sea_service_user" ON "public"."sea_service" USING "btree" ("user_id");



CREATE INDEX "idx_sea_service_user_dates" ON "public"."sea_service" USING "btree" ("user_id", "sign_on_date" DESC, "sign_off_date" DESC);



CREATE INDEX "idx_sea_service_user_id" ON "public"."sea_service" USING "btree" ("user_id");



CREATE INDEX "idx_ships_class" ON "public"."ships" USING "btree" ("class");



CREATE INDEX "idx_ships_operator" ON "public"."ships" USING "btree" ("operator");



CREATE INDEX "idx_ships_route_category" ON "public"."ships" USING "btree" ("route_category");



CREATE INDEX "idx_ships_slug" ON "public"."ships" USING "btree" ("slug");



CREATE INDEX "idx_ships_tonnage_band" ON "public"."ships" USING "btree" ("tonnage_band");



CREATE INDEX "idx_training_certificates_category" ON "public"."training_certificates" USING "btree" ("certificate_category");



CREATE INDEX "idx_training_certificates_expiration" ON "public"."training_certificates" USING "btree" ("expiration_date") WHERE ("expiration_date" IS NOT NULL);



CREATE INDEX "idx_training_certificates_user_id" ON "public"."training_certificates" USING "btree" ("user_id");



CREATE INDEX "idx_training_certs_category" ON "public"."training_certificates" USING "btree" ("user_id", "certificate_category");



CREATE INDEX "idx_training_certs_expiring" ON "public"."training_certificates" USING "btree" ("user_id", "expiration_date") WHERE ("expiration_date" IS NOT NULL);



CREATE INDEX "idx_training_certs_user_id" ON "public"."training_certificates" USING "btree" ("user_id");



CREATE UNIQUE INDEX "newsletter_subscribers_email_unique" ON "public"."newsletter_subscribers" USING "btree" ("email");



CREATE UNIQUE INDEX "ships_slug_unique" ON "public"."ships" USING "btree" ("slug");



CREATE OR REPLACE TRIGGER "career_goals_updated_at" BEFORE UPDATE ON "public"."career_goals" FOR EACH ROW EXECUTE FUNCTION "public"."update_career_goals_updated_at"();



CREATE OR REPLACE TRIGGER "ports_updated_at" BEFORE UPDATE ON "public"."ports" FOR EACH ROW EXECUTE FUNCTION "public"."update_ports_updated_at"();



CREATE OR REPLACE TRIGGER "sea_service_updated_at" BEFORE UPDATE ON "public"."sea_service" FOR EACH ROW EXECUTE FUNCTION "public"."update_sea_service_updated_at"();



CREATE OR REPLACE TRIGGER "set_credential_checklists_updated_at" BEFORE UPDATE ON "public"."credential_checklists" FOR EACH ROW EXECUTE FUNCTION "public"."handle_updated_at"();



CREATE OR REPLACE TRIGGER "set_nmc_courses_updated_at" BEFORE UPDATE ON "public"."nmc_courses" FOR EACH ROW EXECUTE FUNCTION "public"."handle_updated_at"();



CREATE OR REPLACE TRIGGER "set_nmc_exam_modules_updated_at" BEFORE UPDATE ON "public"."nmc_exam_modules" FOR EACH ROW EXECUTE FUNCTION "public"."handle_updated_at"();



CREATE OR REPLACE TRIGGER "set_nmc_exams_updated_at" BEFORE UPDATE ON "public"."nmc_exams" FOR EACH ROW EXECUTE FUNCTION "public"."handle_updated_at"();



CREATE OR REPLACE TRIGGER "ships_updated_at" BEFORE UPDATE ON "public"."ships" FOR EACH ROW EXECUTE FUNCTION "public"."update_ships_updated_at"();



CREATE OR REPLACE TRIGGER "training_certificates_updated_at" BEFORE UPDATE ON "public"."training_certificates" FOR EACH ROW EXECUTE FUNCTION "public"."update_training_certificates_updated_at"();



ALTER TABLE ONLY "public"."career_goals"
    ADD CONSTRAINT "career_goals_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("user_id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."checklist_exams"
    ADD CONSTRAINT "checklist_exams_checklist_id_fkey" FOREIGN KEY ("checklist_id") REFERENCES "public"."credential_checklists"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."checklist_exams"
    ADD CONSTRAINT "checklist_exams_exam_id_fkey" FOREIGN KEY ("exam_id") REFERENCES "public"."nmc_exams"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."course_exam_alternatives"
    ADD CONSTRAINT "course_exam_alternatives_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "public"."nmc_courses"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."course_exam_alternatives"
    ADD CONSTRAINT "course_exam_alternatives_exam_id_fkey" FOREIGN KEY ("exam_id") REFERENCES "public"."nmc_exams"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."credential_reminders"
    ADD CONSTRAINT "credential_reminders_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."credentials"
    ADD CONSTRAINT "credentials_source_verification_id_fkey" FOREIGN KEY ("source_verification_id") REFERENCES "public"."nmc_verifications"("id");



ALTER TABLE ONLY "public"."credentials"
    ADD CONSTRAINT "credentials_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("user_id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."documents"
    ADD CONSTRAINT "documents_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("user_id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."exam_module_assignments"
    ADD CONSTRAINT "exam_module_assignments_exam_id_fkey" FOREIGN KEY ("exam_id") REFERENCES "public"."nmc_exams"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."exam_module_assignments"
    ADD CONSTRAINT "exam_module_assignments_module_id_fkey" FOREIGN KEY ("module_id") REFERENCES "public"."nmc_exam_modules"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."leave_chits"
    ADD CONSTRAINT "leave_chits_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("user_id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."nmc_verifications"
    ADD CONSTRAINT "nmc_verifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("user_id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."sea_service"
    ADD CONSTRAINT "sea_service_document_id_fkey" FOREIGN KEY ("document_id") REFERENCES "public"."documents"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."sea_service"
    ADD CONSTRAINT "sea_service_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."sea_service"
    ADD CONSTRAINT "sea_service_verified_by_fkey" FOREIGN KEY ("verified_by") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."training_certificates"
    ADD CONSTRAINT "training_certificates_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("user_id") ON DELETE CASCADE;



CREATE POLICY "Admin can manage reviews" ON "public"."retirement_reviews" FOR UPDATE USING (((("auth"."jwt"() -> 'app_metadata'::"text") ->> 'role'::"text") = 'admin'::"text"));



CREATE POLICY "Admin delete access for ports" ON "public"."ports" FOR DELETE USING (((("auth"."jwt"() ->> 'role'::"text") = 'admin'::"text") OR ((("auth"."jwt"() -> 'app_metadata'::"text") ->> 'role'::"text") = 'admin'::"text")));



CREATE POLICY "Admin update access for ports" ON "public"."ports" FOR UPDATE USING (((("auth"."jwt"() ->> 'role'::"text") = 'admin'::"text") OR ((("auth"."jwt"() -> 'app_metadata'::"text") ->> 'role'::"text") = 'admin'::"text")));



CREATE POLICY "Admin update access for ships" ON "public"."ships" FOR UPDATE USING (((("auth"."jwt"() -> 'app_metadata'::"text") ->> 'role'::"text") = 'admin'::"text"));



CREATE POLICY "Admin write access for ports" ON "public"."ports" FOR INSERT WITH CHECK (((("auth"."jwt"() ->> 'role'::"text") = 'admin'::"text") OR ("auth"."uid"() IN ( SELECT "auth"."uid"() AS "uid"
  WHERE ((("auth"."jwt"() -> 'app_metadata'::"text") ->> 'role'::"text") = 'admin'::"text")))));



CREATE POLICY "Admin write access for ships" ON "public"."ships" FOR INSERT WITH CHECK (((("auth"."jwt"() -> 'app_metadata'::"text") ->> 'role'::"text") = 'admin'::"text"));



CREATE POLICY "Allow full access to own profile" ON "public"."profiles" TO "authenticated" USING (("auth"."uid"() = "user_id")) WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Allow profile insert for logged-in user" ON "public"."profiles" FOR INSERT TO "authenticated" WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Allow profile read for logged-in user" ON "public"."profiles" FOR SELECT TO "authenticated" USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Allow profile update for logged-in user" ON "public"."profiles" FOR UPDATE TO "authenticated" USING (("auth"."uid"() = "user_id")) WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Anyone can submit a review" ON "public"."retirement_reviews" FOR INSERT WITH CHECK (true);



CREATE POLICY "Anyone can submit reviews" ON "public"."retirement_reviews" FOR INSERT WITH CHECK (true);



CREATE POLICY "Anyone can subscribe" ON "public"."newsletter_subscribers" FOR INSERT TO "authenticated", "anon" WITH CHECK (true);



CREATE POLICY "Authenticated users can read checklist_exams" ON "public"."checklist_exams" FOR SELECT USING (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "Authenticated users can read course_exam_alternatives" ON "public"."course_exam_alternatives" FOR SELECT USING (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "Authenticated users can read credential_checklists" ON "public"."credential_checklists" FOR SELECT USING (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "Authenticated users can read exam_module_assignments" ON "public"."exam_module_assignments" FOR SELECT USING (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "Authenticated users can read nmc_courses" ON "public"."nmc_courses" FOR SELECT USING (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "Authenticated users can read nmc_exam_modules" ON "public"."nmc_exam_modules" FOR SELECT USING (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "Authenticated users can read nmc_exams" ON "public"."nmc_exams" FOR SELECT USING (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "Only approved reviews are visible" ON "public"."retirement_reviews" FOR SELECT USING (("approved" = true));



CREATE POLICY "Public can read approved reviews" ON "public"."retirement_reviews" FOR SELECT USING (("approved" = true));



CREATE POLICY "Public read access for ports" ON "public"."ports" FOR SELECT USING (true);



CREATE POLICY "Public read access for ships" ON "public"."ships" FOR SELECT USING (true);



CREATE POLICY "Service role can insert reminders" ON "public"."credential_reminders" FOR INSERT WITH CHECK (true);



CREATE POLICY "Service role can update verifications" ON "public"."nmc_verifications" FOR UPDATE USING (true);



CREATE POLICY "Ships are viewable by everyone" ON "public"."ships" FOR SELECT USING (true);



CREATE POLICY "Users can delete own credentials" ON "public"."credentials" FOR DELETE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can delete own sea service" ON "public"."sea_service" FOR DELETE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can delete own training certificates" ON "public"."training_certificates" FOR DELETE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can delete their own training certificates" ON "public"."training_certificates" FOR DELETE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can insert own career goals" ON "public"."career_goals" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can insert own credentials" ON "public"."credentials" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can insert own profile" ON "public"."profiles" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can insert own sea service" ON "public"."sea_service" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can insert own training certificates" ON "public"."training_certificates" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can insert own verifications" ON "public"."nmc_verifications" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can insert their own career goals" ON "public"."career_goals" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can insert their own training certificates" ON "public"."training_certificates" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can manage own documents" ON "public"."documents" TO "authenticated" USING (("auth"."uid"() = "user_id")) WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can manage own leave chits" ON "public"."leave_chits" TO "authenticated" USING (("auth"."uid"() = "user_id")) WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can update own career goals" ON "public"."career_goals" FOR UPDATE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can update own credentials" ON "public"."credentials" FOR UPDATE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can update own profile" ON "public"."profiles" FOR UPDATE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can update own sea service" ON "public"."sea_service" FOR UPDATE USING (("auth"."uid"() = "user_id")) WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can update own training certificates" ON "public"."training_certificates" FOR UPDATE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can update their own career goals" ON "public"."career_goals" FOR UPDATE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can update their own training certificates" ON "public"."training_certificates" FOR UPDATE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view own career goals" ON "public"."career_goals" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view own credentials" ON "public"."credentials" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view own profile" ON "public"."profiles" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view own reminders" ON "public"."credential_reminders" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view own sea service" ON "public"."sea_service" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view own training certificates" ON "public"."training_certificates" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view own verifications" ON "public"."nmc_verifications" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view their own career goals" ON "public"."career_goals" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view their own training certificates" ON "public"."training_certificates" FOR SELECT USING (("auth"."uid"() = "user_id"));



ALTER TABLE "public"."career_goals" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."checklist_exams" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."course_exam_alternatives" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."credential_checklists" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."credential_reminders" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."credentials" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."documents" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."exam_module_assignments" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."leave_chits" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."newsletter_subscribers" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."nmc_courses" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."nmc_exam_modules" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."nmc_exams" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."nmc_verifications" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."ports" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."profiles" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."retirement_reviews" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."sea_service" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."ships" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."training_certificates" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";






GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";











































































































































































GRANT ALL ON FUNCTION "public"."calculate_days_by_propulsion"("p_user_id" "uuid", "p_propulsion" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."calculate_days_by_propulsion"("p_user_id" "uuid", "p_propulsion" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."calculate_days_by_propulsion"("p_user_id" "uuid", "p_propulsion" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."calculate_days_by_route"("p_user_id" "uuid", "p_route" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."calculate_days_by_route"("p_user_id" "uuid", "p_route" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."calculate_days_by_route"("p_user_id" "uuid", "p_route" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."calculate_recency"("p_user_id" "uuid", "p_position" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."calculate_recency"("p_user_id" "uuid", "p_position" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."calculate_recency"("p_user_id" "uuid", "p_position" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."check_overlapping_service"("p_user_id" "uuid", "p_sign_on" "date", "p_sign_off" "date", "p_exclude_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."check_overlapping_service"("p_user_id" "uuid", "p_sign_on" "date", "p_sign_off" "date", "p_exclude_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."check_overlapping_service"("p_user_id" "uuid", "p_sign_on" "date", "p_sign_off" "date", "p_exclude_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."check_sea_service_overlap"("p_user_id" "uuid", "p_sign_on" "date", "p_sign_off" "date", "p_exclude_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."check_sea_service_overlap"("p_user_id" "uuid", "p_sign_on" "date", "p_sign_off" "date", "p_exclude_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."check_sea_service_overlap"("p_user_id" "uuid", "p_sign_on" "date", "p_sign_off" "date", "p_exclude_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_sea_service_summary"("p_user_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."get_sea_service_summary"("p_user_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_sea_service_summary"("p_user_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_updated_at"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_updated_at"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_updated_at"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_career_goals_updated_at"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_career_goals_updated_at"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_career_goals_updated_at"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_ports_updated_at"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_ports_updated_at"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_ports_updated_at"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_sea_service_updated_at"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_sea_service_updated_at"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_sea_service_updated_at"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_ships_updated_at"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_ships_updated_at"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_ships_updated_at"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_training_certificates_updated_at"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_training_certificates_updated_at"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_training_certificates_updated_at"() TO "service_role";


















GRANT ALL ON TABLE "public"."career_goals" TO "anon";
GRANT ALL ON TABLE "public"."career_goals" TO "authenticated";
GRANT ALL ON TABLE "public"."career_goals" TO "service_role";



GRANT ALL ON TABLE "public"."checklist_exams" TO "anon";
GRANT ALL ON TABLE "public"."checklist_exams" TO "authenticated";
GRANT ALL ON TABLE "public"."checklist_exams" TO "service_role";



GRANT ALL ON TABLE "public"."course_exam_alternatives" TO "anon";
GRANT ALL ON TABLE "public"."course_exam_alternatives" TO "authenticated";
GRANT ALL ON TABLE "public"."course_exam_alternatives" TO "service_role";



GRANT ALL ON TABLE "public"."credential_checklists" TO "anon";
GRANT ALL ON TABLE "public"."credential_checklists" TO "authenticated";
GRANT ALL ON TABLE "public"."credential_checklists" TO "service_role";



GRANT ALL ON TABLE "public"."credential_reminders" TO "anon";
GRANT ALL ON TABLE "public"."credential_reminders" TO "authenticated";
GRANT ALL ON TABLE "public"."credential_reminders" TO "service_role";



GRANT ALL ON TABLE "public"."credentials" TO "anon";
GRANT ALL ON TABLE "public"."credentials" TO "authenticated";
GRANT ALL ON TABLE "public"."credentials" TO "service_role";



GRANT ALL ON TABLE "public"."documents" TO "anon";
GRANT ALL ON TABLE "public"."documents" TO "authenticated";
GRANT ALL ON TABLE "public"."documents" TO "service_role";



GRANT ALL ON TABLE "public"."exam_module_assignments" TO "anon";
GRANT ALL ON TABLE "public"."exam_module_assignments" TO "authenticated";
GRANT ALL ON TABLE "public"."exam_module_assignments" TO "service_role";



GRANT ALL ON TABLE "public"."leave_chits" TO "anon";
GRANT ALL ON TABLE "public"."leave_chits" TO "authenticated";
GRANT ALL ON TABLE "public"."leave_chits" TO "service_role";



GRANT ALL ON TABLE "public"."newsletter_subscribers" TO "anon";
GRANT ALL ON TABLE "public"."newsletter_subscribers" TO "authenticated";
GRANT ALL ON TABLE "public"."newsletter_subscribers" TO "service_role";



GRANT ALL ON TABLE "public"."nmc_courses" TO "anon";
GRANT ALL ON TABLE "public"."nmc_courses" TO "authenticated";
GRANT ALL ON TABLE "public"."nmc_courses" TO "service_role";



GRANT ALL ON TABLE "public"."nmc_exam_modules" TO "anon";
GRANT ALL ON TABLE "public"."nmc_exam_modules" TO "authenticated";
GRANT ALL ON TABLE "public"."nmc_exam_modules" TO "service_role";



GRANT ALL ON TABLE "public"."nmc_exams" TO "anon";
GRANT ALL ON TABLE "public"."nmc_exams" TO "authenticated";
GRANT ALL ON TABLE "public"."nmc_exams" TO "service_role";



GRANT ALL ON TABLE "public"."nmc_verifications" TO "anon";
GRANT ALL ON TABLE "public"."nmc_verifications" TO "authenticated";
GRANT ALL ON TABLE "public"."nmc_verifications" TO "service_role";



GRANT ALL ON TABLE "public"."ports" TO "anon";
GRANT ALL ON TABLE "public"."ports" TO "authenticated";
GRANT ALL ON TABLE "public"."ports" TO "service_role";



GRANT ALL ON TABLE "public"."profiles" TO "anon";
GRANT ALL ON TABLE "public"."profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."profiles" TO "service_role";



GRANT ALL ON TABLE "public"."retirement_reviews" TO "anon";
GRANT ALL ON TABLE "public"."retirement_reviews" TO "authenticated";
GRANT ALL ON TABLE "public"."retirement_reviews" TO "service_role";



GRANT ALL ON TABLE "public"."sea_service" TO "anon";
GRANT ALL ON TABLE "public"."sea_service" TO "authenticated";
GRANT ALL ON TABLE "public"."sea_service" TO "service_role";



GRANT ALL ON TABLE "public"."sea_service_summary" TO "anon";
GRANT ALL ON TABLE "public"."sea_service_summary" TO "authenticated";
GRANT ALL ON TABLE "public"."sea_service_summary" TO "service_role";



GRANT ALL ON TABLE "public"."ships" TO "anon";
GRANT ALL ON TABLE "public"."ships" TO "authenticated";
GRANT ALL ON TABLE "public"."ships" TO "service_role";



GRANT ALL ON TABLE "public"."training_certificates" TO "anon";
GRANT ALL ON TABLE "public"."training_certificates" TO "authenticated";
GRANT ALL ON TABLE "public"."training_certificates" TO "service_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";






























drop extension if exists "pg_net";

drop policy "Anyone can subscribe" on "public"."newsletter_subscribers";


  create policy "Anyone can subscribe"
  on "public"."newsletter_subscribers"
  as permissive
  for insert
  to anon, authenticated
with check (true);



  create policy "Allow INSERT to documents for authenticated users flreew_0"
  on "storage"."objects"
  as permissive
  for insert
  to authenticated
with check (true);



  create policy "Allow INSERT to documents for authenticated users flreew_1"
  on "storage"."objects"
  as permissive
  for update
  to authenticated
using (true);



  create policy "Allow INSERT to documents for authenticated users flreew_2"
  on "storage"."objects"
  as permissive
  for delete
  to authenticated
using (true);



  create policy "Allow INSERT to documents for authenticated users flreew_3"
  on "storage"."objects"
  as permissive
  for select
  to authenticated
using (true);



  create policy "Users can delete own documents"
  on "storage"."objects"
  as permissive
  for delete
  to authenticated
using (((bucket_id = 'documents'::text) AND ((storage.foldername(name))[2] = (auth.uid())::text)));



  create policy "Users can read own documents"
  on "storage"."objects"
  as permissive
  for select
  to authenticated
using (((bucket_id = 'documents'::text) AND ((storage.foldername(name))[2] = (auth.uid())::text)));



  create policy "Users can upload own documents"
  on "storage"."objects"
  as permissive
  for insert
  to authenticated
with check (((bucket_id = 'documents'::text) AND ((storage.foldername(name))[2] = (auth.uid())::text)));



