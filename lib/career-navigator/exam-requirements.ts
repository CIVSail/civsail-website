import { ExamRequirement, CredentialLevel } from '@/types/career-navigator';

/**
 * Exam requirements for each credential upgrade
 * Based on 46 CFR 11.903 and NMC checklists
 */

export const EXAM_REQUIREMENTS: Record<string, ExamRequirement> = {
  // Third Mate (original)
  third_mate_original: {
    exam_type: 'new_exam',
    description: 'Full Third Mate examination required',
    exam_modules: [
      'Navigation General',
      'Navigation Problems',
      'Deck General',
      'Deck Safety & Environmental Protection',
      'Rules of the Road',
      'Chart Navigation',
    ],
  },

  // Second Mate (from Third Mate)
  third_mate_to_second_mate: {
    exam_type: 'raise_of_grade',
    description: 'No additional examination required when upgrading from Third Mate. Raise of grade only.',
    exam_modules: [],
  },

  // Chief Mate (from Second Mate)
  second_mate_to_chief_mate: {
    exam_type: 'new_exam',
    description: 'Chief Mate/Master examination required (unless satisfied via approved course package)',
    exam_modules: [
      'Navigation General (Management Level)',
      'Navigation Problems (Management Level)',
      'Deck General (Management Level)',
      'Deck Safety & Environmental Protection (Management Level)',
      'Advanced Stability',
      'Advanced Cargo',
    ],
  },

  // Master (from Chief Mate)
  chief_mate_to_master: {
    exam_type: 'raise_of_grade',
    description: 'No additional examination required when upgrading from Chief Mate Unlimited. Provided mariner has been examined for Chief Mate Unlimited tonnage.',
    exam_modules: [],
  },
};

/**
 * Get exam requirement for an upgrade path
 */
export function getExamRequirement(from: CredentialLevel, to: CredentialLevel): ExamRequirement {
  const key = `${from}_to_${to}`;
  return EXAM_REQUIREMENTS[key] || {
    exam_type: 'new_exam',
    description: 'Examination requirements vary. Consult NMC checklist.',
    exam_modules: [],
  };
}