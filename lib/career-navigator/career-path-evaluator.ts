import { SeaServicePeriod } from '@/types/sea-service';
import { TrainingCertificate, CareerPathEvaluation, UpgradeProgress, UpgradeStep, CredentialLevel } from '@/types/career-navigator';
import { calculateSecondMateQualifyingTime, calculateChiefMateQualifyingTime, calculateMasterQualifyingTime } from './sea-service-calculator';
import { DECK_COURSE_REQUIREMENTS, getCoursesForCredential } from './course-catalog';
import { getExamRequirement } from './exam-requirements';

/**
 * Complete career path evaluator
 * Evaluates progress from current credential to target credential
 */

/**
 * Define upgrade steps for unlimited deck officers
 */
export const DECK_UPGRADE_STEPS: UpgradeStep[] = [
  {
    from: 'third_mate',
    to: 'second_mate',
    cfr_section: '46 CFR 11.406',
    sea_service_paths: [{
      description: '360 days as OICNW while holding Third Mate endorsement',
      required_days: 360,
      required_position: ['third_mate', 'oicnw'],
      min_grt: 100,
      min_1600grt_percentage: 0.5,
      route: ['oceans', 'near_coastal', 'great_lakes'],
      watchkeeping_required: true,
      recency_days: 90,
      recency_years: 7,
    }],
    course_requirements: getCoursesForCredential('second_mate'),
    exam_requirement: getExamRequirement('third_mate', 'second_mate'),
  },
  {
    from: 'second_mate',
    to: 'chief_mate',
    cfr_section: '46 CFR 11.405',
    sea_service_paths: [{
      description: '360 days as OICNW while holding Second Mate endorsement',
      required_days: 360,
      required_position: ['second_mate', 'oicnw'],
      min_grt: 100,
      min_1600grt_percentage: 0.5,
      route: ['oceans', 'near_coastal', 'great_lakes'],
      watchkeeping_required: true,
      recency_days: 90,
      recency_years: 7,
    }],
    course_requirements: getCoursesForCredential('chief_mate'),
    exam_requirement: getExamRequirement('second_mate', 'chief_mate'),
  },
  {
    from: 'chief_mate',
    to: 'master',
    cfr_section: '46 CFR 11.404',
    sea_service_paths: [
      {
        description: '360 days as Chief Mate on Ocean/NC or Great Lakes',
        required_days: 360,
        required_position: ['chief_mate'],
        min_grt: 100,
        min_1600grt_percentage: 0.5,
        route: ['oceans', 'near_coastal', 'great_lakes'],
        watchkeeping_required: false,
        recency_days: 90,
        recency_years: 7,
      },
      {
        description: '180 days as Chief Mate + 360 days as OICNW (2-for-1 credit)',
        required_days: 360,  // Total creditable days
        required_position: ['chief_mate', 'oicnw'],
        min_grt: 100,
        min_1600grt_percentage: 0.5,
        route: ['oceans', 'near_coastal', 'great_lakes'],
        watchkeeping_required: true,
        recency_days: 90,
        recency_years: 7,
      },
    ],
    course_requirements: getCoursesForCredential('master'),
    exam_requirement: getExamRequirement('chief_mate', 'master'),
  },
];

/**
 * Get applicable upgrade steps between current and target
 */
function getUpgradeSteps(current: CredentialLevel, target: CredentialLevel): UpgradeStep[] {
  const ladder = ['third_mate', 'second_mate', 'chief_mate', 'master'];
  const currentIdx = ladder.indexOf(current);
  const targetIdx = ladder.indexOf(target);

  if (currentIdx === -1 || targetIdx === -1 || targetIdx <= currentIdx) {
    return [];
  }

  return DECK_UPGRADE_STEPS.filter(step => {
    const fromIdx = ladder.indexOf(step.from);
    const toIdx = ladder.indexOf(step.to);
    return fromIdx >= currentIdx && toIdx <= targetIdx;
  });
}

/**
 * Evaluate course progress for a specific upgrade step
 */
function evaluateCourseProgress(
  step: UpgradeStep,
  userCertificates: TrainingCertificate[]
) {
  const required_courses = step.course_requirements;
  const completed_course_types = new Set(
    userCertificates.map(cert => cert.course_type)
  );

  const completed_count = required_courses.filter(req =>
    completed_course_types.has(req.course_type)
  ).length;

  const missing_courses = required_courses.filter(req =>
    !completed_course_types.has(req.course_type)
  );

  // Check for expiring courses (< 90 days)
  const ninety_days_from_now = new Date();
  ninety_days_from_now.setDate(ninety_days_from_now.getDate() + 90);

  const expiring_soon = userCertificates.filter(cert => {
    if (!cert.expiration_date) return false;
    const expDate = new Date(cert.expiration_date);
    return expDate <= ninety_days_from_now;
  });

  return {
    courses_completed: completed_count,
    courses_required: required_courses.length,
    courses_percentage: required_courses.length > 0 
      ? (completed_count / required_courses.length) * 100 
      : 100,
    missing_courses,
    expiring_soon_courses: expiring_soon,
  };
}

/**
 * Evaluate a single upgrade step
 */
function evaluateUpgradeStep(
  step: UpgradeStep,
  seaService: SeaServicePeriod[],
  userCertificates: TrainingCertificate[],
  seaDaysPerYear: number
): UpgradeProgress {
  // Calculate sea service progress
  let qualifying_result;
  
  if (step.to === 'second_mate') {
    qualifying_result = calculateSecondMateQualifyingTime(seaService);
  } else if (step.to === 'chief_mate') {
    qualifying_result = calculateChiefMateQualifyingTime(seaService);
  } else if (step.to === 'master') {
    const master_result = calculateMasterQualifyingTime(seaService);
    // Use primary path for now (can show alternative in UI)
    qualifying_result = master_result.primary_path;
  } else {
    qualifying_result = {
      qualifying_days: 0,
      qualifying_periods: [],
      days_on_1600_plus: 0,
      recency_met: false,
      tonnage_requirement_met: false,
      breakdown: {
        total_days: 0,
        days_on_100_plus_grt: 0,
        days_on_1600_plus_grt: 0,
        percentage_on_1600_plus: 0,
      },
    };
  }

  const required_days = step.sea_service_paths[0].required_days;
  const days_remaining = Math.max(0, required_days - qualifying_result.qualifying_days);

  // Calculate course progress
  const course_progress = evaluateCourseProgress(step, userCertificates);

  // Estimate time remaining
  const estimated_days_remaining = days_remaining;
  const estimated_years = estimated_days_remaining / seaDaysPerYear;
  const estimated_completion = new Date();
  estimated_completion.setDate(estimated_completion.getDate() + (estimated_days_remaining * (365 / seaDaysPerYear)));

  // Exam readiness
  const sea_service_met = qualifying_result.qualifying_days >= required_days;
  const courses_met = course_progress.courses_completed >= course_progress.courses_required;
  const recency_met = qualifying_result.recency_met;
  const tonnage_met = qualifying_result.tonnage_requirement_met;

  const exam_ready = sea_service_met && courses_met && recency_met && tonnage_met;
  
  let exam_notes = '';
  if (!sea_service_met) exam_notes += 'Sea service requirement not met. ';
  if (!courses_met) exam_notes += `${course_progress.missing_courses.length} course(s) required. `;
  if (!recency_met) exam_notes += 'Recency requirement not met. ';
  if (!tonnage_met) exam_notes += 'Tonnage requirement not met (need 50% on 1600+ GRT). ';
  if (exam_ready) exam_notes = step.exam_requirement.description;

  return {
    step,
    sea_service_completed_days: qualifying_result.qualifying_days,
    sea_service_required_days: required_days,
    sea_service_percentage: (qualifying_result.qualifying_days / required_days) * 100,
    qualifying_periods: qualifying_result.qualifying_periods,
    recency_met: qualifying_result.recency_met,
    tonnage_requirement_met: qualifying_result.tonnage_requirement_met,
    courses_completed: course_progress.courses_completed,
    courses_required: course_progress.courses_required,
    courses_percentage: course_progress.courses_percentage,
    missing_courses: course_progress.missing_courses,
    expiring_soon_courses: course_progress.expiring_soon_courses,
    exam_ready,
    exam_notes,
    estimated_days_remaining,
    estimated_completion_date: estimated_completion.toISOString(),
  };
}

/**
 * Main evaluation function
 */
export function evaluateCareerPath(
  userId: string,
  currentCredential: CredentialLevel,
  targetCredential: CredentialLevel,
  seaService: SeaServicePeriod[],
  userCertificates: TrainingCertificate[],
  seaDaysPerYear: number = 200
): CareerPathEvaluation {
  const steps = getUpgradeSteps(currentCredential, targetCredential);

  const upgrade_steps = steps.map(step =>
    evaluateUpgradeStep(step, seaService, userCertificates, seaDaysPerYear)
  );

  const total_estimated_days = upgrade_steps.reduce(
    (sum, step) => sum + step.estimated_days_remaining,
    0
  );

  const total_estimated_years = total_estimated_days / seaDaysPerYear;

  // Generate next action items
  const next_actions: string[] = [];
  const next_step = upgrade_steps[0];
  
  if (next_step) {
    if (next_step.sea_service_completed_days < next_step.sea_service_required_days) {
      const days_needed = next_step.sea_service_required_days - next_step.sea_service_completed_days;
      next_actions.push(`Accumulate ${days_needed} more days of qualifying sea service as ${next_step.step.sea_service_paths[0].required_position.join(' or ')}`);
    }
    
    if (next_step.missing_courses.length > 0) {
      next_actions.push(`Complete ${next_step.missing_courses.length} required course(s): ${next_step.missing_courses.map(c => c.display_name).join(', ')}`);
    }

    if (next_step.expiring_soon_courses.length > 0) {
      next_actions.push(`Renew ${next_step.expiring_soon_courses.length} expiring certificate(s)`);
    }

    if (!next_step.recency_met) {
      next_actions.push('Meet recency requirement: 90 days in past 7 years (45 days on 1600+ GRT)');
    }

    if (!next_step.tonnage_requirement_met) {
      next_actions.push('Ensure 50% of qualifying time is on vessels 1600+ GRT');
    }

    if (next_step.exam_ready) {
      next_actions.push(`Ready to apply for ${next_step.step.to.replace('_', ' ').toUpperCase()}!`);
    }
  }

  return {
    user_id: userId,
    current_credential: currentCredential,
    target_credential: targetCredential,
    upgrade_steps,
    total_estimated_days,
    total_estimated_years,
    next_action_items: next_actions,
  };
}