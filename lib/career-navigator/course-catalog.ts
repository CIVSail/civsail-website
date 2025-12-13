import { CourseRequirement, CredentialLevel } from '@/types/career-navigator';

/**
 * Hard-coded catalog of course requirements for deck officers
 * Extensible pattern: Later add ENGINE_COURSE_REQUIREMENTS for engineers
 */

export const DECK_COURSE_REQUIREMENTS: CourseRequirement[] = [
  // ===== SAFETY & RENEWABLE COURSES =====
  {
    id: 'basic_training',
    category: 'safety_renewable',
    course_type: 'basic_training',
    display_name: 'Basic Training (STCW)',
    description: 'Includes Basic Firefighting, First Aid, CPR, and Personal Safety',
    required_for: ['third_mate', 'second_mate', 'chief_mate', 'master'],
    renewable: true,
    renewal_period_years: 5,
  },
  {
    id: 'advanced_firefighting',
    category: 'safety_renewable',
    course_type: 'advanced_firefighting',
    display_name: 'Advanced Firefighting (STCW)',
    description: 'Required for all officer endorsements',
    required_for: ['third_mate', 'second_mate', 'chief_mate', 'master'],
    renewable: true,
    renewal_period_years: 5,
  },
  {
    id: 'first_aid',
    category: 'safety_renewable',
    course_type: 'first_aid',
    display_name: 'First Aid',
    description: 'Completed within 1 year of application (original endorsement only)',
    required_for: ['third_mate'],  // Only for original
    renewable: false,
  },
  {
    id: 'cpr',
    category: 'safety_renewable',
    course_type: 'cpr',
    display_name: 'CPR',
    description: 'Must be valid at time of application (original endorsement only)',
    required_for: ['third_mate'],  // Only for original
    renewable: true,
  },

  // ===== MANAGEMENT LEVEL COURSES (Chief Mate/Master) =====
  {
    id: 'management_shiphandling',
    category: 'management_level',
    course_type: 'management_shiphandling',
    display_name: 'Advanced Shiphandling (Management Level)',
    description: 'STCW Management Level shiphandling and maneuvering',
    required_for: ['chief_mate', 'master'],
    renewable: false,
  },
  {
    id: 'management_stability',
    category: 'management_level',
    course_type: 'management_stability',
    display_name: 'Advanced Stability (Management Level)',
    description: 'Stability and damage control at management level',
    required_for: ['chief_mate', 'master'],
    renewable: false,
  },
  {
    id: 'management_meteorology',
    category: 'management_level',
    course_type: 'management_meteorology',
    display_name: 'Advanced Meteorology (Management Level)',
    description: 'Weather routing and meteorological principles',
    required_for: ['chief_mate', 'master'],
    renewable: false,
  },
  {
    id: 'management_cargo',
    category: 'management_level',
    course_type: 'management_cargo',
    display_name: 'Cargo Operations & Stowage (Management Level)',
    description: 'Advanced cargo handling, stowage, and ballast management',
    required_for: ['chief_mate', 'master'],
    renewable: false,
  },
  {
    id: 'management_leadership',
    category: 'management_level',
    course_type: 'management_leadership',
    display_name: 'Leadership & Management (BRM)',
    description: 'Bridge Resource Management and leadership at management level',
    required_for: ['chief_mate', 'master'],
    renewable: false,
  },
];

/**
 * Get course requirements for a specific credential
 */
export function getCoursesForCredential(credential: CredentialLevel): CourseRequirement[] {
  return DECK_COURSE_REQUIREMENTS.filter(course =>
    course.required_for.includes(credential)
  );
}

/**
 * Get management-level courses only
 */
export function getManagementLevelCourses(): CourseRequirement[] {
  return DECK_COURSE_REQUIREMENTS.filter(
    course => course.category === 'management_level'
  );
}

/**
 * Get safety & renewable courses only
 */
export function getSafetyRenewableCourses(): CourseRequirement[] {
  return DECK_COURSE_REQUIREMENTS.filter(
    course => course.category === 'safety_renewable'
  );
}