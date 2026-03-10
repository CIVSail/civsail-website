// Career Navigator Type Definitions

export type IndustryEntryRoute = 'hawsepiper' | 'academy' | 'military';

export type CredentialLevel = 
  | 'third_mate' 
  | 'second_mate' 
  | 'chief_mate' 
  | 'master'
  | 'third_ae'    // Future: engine track
  | 'second_ae'
  | 'first_ae'
  | 'chief_engineer';

export type RouteType = 'oceans' | 'near_coastal' | 'great_lakes' | 'inland';

//May need to update/refactor in future to support separate engine/deck routes
export type CertificateCategory = 
  | 'safety_renewable' 
  | 'operational' 
  | 'management_level' 
  | 'specialist';

// Training Certificate record from database
export interface TrainingCertificate {
  id: string;
  user_id: string;
  certificate_category: CertificateCategory;
  course_type: string;
  course_name: string;
  completion_date: string;
  expiration_date: string | null;
  certificate_number: string | null;
  issuing_school: string | null;
  doc_path: string | null;
  satisfied_via_academy: boolean;
  created_at: string;
  updated_at: string;
}

// Course requirement definition (hard-coded in evaluation logic)
export interface CourseRequirement {
  id: string;
  category: CertificateCategory;
  course_type: string;
  display_name: string;
  description: string;
  required_for: CredentialLevel[];
  renewable: boolean;
  renewal_period_years?: number;
}

// Ship record from database
export interface Ship {
  id: string;
  name: string;
  class: string;
  hull_number: string | null;
  operator: 'msc' | 'noaa' | 'commercial' | 'usn';
  service_type: string | null;
  grt: number | null;
  tonnage_band: 'unlimited' | '500_to_1600' | '200_to_500' | 'under_200' | null;
  route_category: RouteType | null;
  propulsion_type: 'motor' | 'steam' | 'gas_turbine' | 'sail' | null;
  typical_theater: string | null;
  home_port: string | null;
  slug: string;
  description: string | null;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

// Career goal from database
export interface CareerGoal {
  id: string;
  user_id: string;
  current_credential: CredentialLevel;
  target_credential: CredentialLevel;
  preferred_route: RouteType | 'both' | null;
  created_at: string;
  updated_at: string;
}

// Sea service requirement for a credential upgrade
export interface SeaServiceRequirement {
  description: string;
  required_days: number;
  required_position: string[];  // e.g., ['third_mate', 'oicnw']
  min_grt: number;
  min_1600grt_percentage: number;  // 0.5 = 50% must be on 1600+ GRT
  route: RouteType[];
  watchkeeping_required: boolean;
  recency_days: number;  // e.g., 90 days in past 7 years
  recency_years: number;
}

// Exam requirement for a credential
export interface ExamRequirement {
  exam_type: 'new_exam' | 'raise_of_grade' | 'no_exam';
  description: string;
  exam_modules?: string[];  // e.g., ['Navigation', 'Deck General', 'Deck Safety']
}

// Single upgrade step (e.g., 3/M → 2/M)
export interface UpgradeStep {
  from: CredentialLevel;
  to: CredentialLevel;
  cfr_section: string;  // "46 CFR 11.406"
  sea_service_paths: SeaServiceRequirement[];  // Multiple qualification paths
  course_requirements: CourseRequirement[];
  exam_requirement: ExamRequirement;
}

// Progress calculation for a specific upgrade step
export interface UpgradeProgress {
  step: UpgradeStep;
  
  // Sea service progress
  sea_service_completed_days: number;
  sea_service_required_days: number;
  sea_service_percentage: number;
  
  qualifying_periods: any[];  // Array of sea_service records that count
  recency_met: boolean;
  tonnage_requirement_met: boolean;
  
  // Course progress
  courses_completed: number;
  courses_required: number;
  courses_percentage: number;
  missing_courses: CourseRequirement[];
  expiring_soon_courses: TrainingCertificate[];  // < 90 days to expiration
  
  // Exam status
  exam_ready: boolean;
  exam_notes: string;
  
  // Time estimate
  estimated_days_remaining: number;
  estimated_completion_date: string;
}

// Complete career path evaluation
export interface CareerPathEvaluation {
  user_id: string;
  current_credential: CredentialLevel;
  target_credential: CredentialLevel;
  upgrade_steps: UpgradeProgress[];
  total_estimated_days: number;
  total_estimated_years: number;
  next_action_items: string[];
}

export type CareerGoalType = 
  | 'upgrade_fast'
  | 'transition_ashore'
  | 'fulfill_commitment'
  | 'maximize_earnings'
  | 'build_optionality'
  | 'not_sure_yet'
  | 'explore_experience'
  | 'sea_time_for_other';

export interface CareerGoalArchetype {
  id: CareerGoalType;
  label: string;
  shortLabel: string;
  description: string;
  icon: string;
  whoThisIs: string[];
  systemBehavior: string[];
}

export const CAREER_GOAL_ARCHETYPES: CareerGoalArchetype[] = [
  {
    id: 'upgrade_fast',
    label: 'Upgrade as Fast as Possible',
    shortLabel: 'Fast Track',
    description: 'I want the next license / raise in grade ASAP',
    icon: '🚀',
    whoThisIs: [
      'Hungry junior officers',
      'Academy grads',
      'People who know the checklist game'
    ],
    systemBehavior: [
      'Prioritizes sea-time density',
      'Highlights upgrade-eligible vessels',
      'Shows training gaps early',
      'Warns when billets won\'t count optimally'
    ]
  },
  {
    id: 'transition_ashore',
    label: 'Sail a Few Years, Then Transition Ashore',
    shortLabel: 'Transition',
    description: 'I\'m here for experience, money, or credibility — not forever',
    icon: '🏢',
    whoThisIs: [
      'Future MBAs, law school',
      'Shoreside operations',
      'Building resume for land careers'
    ],
    systemBehavior: [
      'Frames sea days as resume assets',
      'Highlights transferable skills',
      'Suggests shore-transition timing',
      'Tracks leadership exposure'
    ]
  },
  {
    id: 'fulfill_commitment',
    label: 'Fulfill My Commitment / Obligation',
    shortLabel: 'Commitment',
    description: 'I just need to do my time — clean and correct',
    icon: '📋',
    whoThisIs: [
      'Tuition repayment obligations',
      'GI Bill / SHIPS Act',
      'Personal/family commitments'
    ],
    systemBehavior: [
      'Compliance-first guidance',
      'Tracks required vs actual days',
      'Alerts on missing documentation',
      'De-emphasizes optional training'
    ]
  },
  {
    id: 'maximize_earnings',
    label: 'Maximize Earnings (For Now)',
    shortLabel: 'Max Pay',
    description: 'I want to stack cash while I can',
    icon: '💰',
    whoThisIs: [
      'Debt payoff phase',
      'Wealth-building',
      'Short-term financial goals'
    ],
    systemBehavior: [
      'Pay-optimized ship suggestions',
      'Highlights OT/penalty-heavy rotations',
      'Shows effective daily pay',
      'Integrates with pay calculators'
    ]
  },
  {
    id: 'build_optionality',
    label: 'Build Optionality / Keep Doors Open',
    shortLabel: 'Optionality',
    description: 'I don\'t know yet — I want flexibility',
    icon: '🔓',
    whoThisIs: [
      'Early career mariners',
      'Cautious planners',
      'Avoiding narrow paths too soon'
    ],
    systemBehavior: [
      'Encourages diverse vessel types',
      'Emphasizes documentation quality',
      'Avoids locking into niche paths',
      'Broadly applicable training'
    ]
  },
  {
    id: 'not_sure_yet',
    label: 'Not Sure Yet',
    shortLabel: 'Exploring',
    description: 'I need guidance, not a decision',
    icon: '🤔',
    whoThisIs: [
      'New to the industry',
      'Still learning the system',
      'Want to explore before committing'
    ],
    systemBehavior: [
      'Gentle onboarding',
      'Educational prompts',
      'Periodic check-ins',
      'Defaults to optionality'
    ]
  }
];