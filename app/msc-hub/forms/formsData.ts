/**
 * Forms Data Configuration
 * 
 * This file contains all the forms displayed on the MSC Hub Forms page.
 * To add a new form:
 * 1. Add a PDF to /public/forms/[filename].pdf
 * 2. Add an entry to the FORMS array below
 * 
 * Each form needs:
 * - id: unique identifier (used for React keys)
 * - title: display name shown on the tile
 * - description: brief explanation of what the form is for
 * - filename: the PDF filename in /public/forms/ (without path)
 * - category: groups forms together for organization
 * - icon: which lucide-react icon to display
 */

export type FormCategory = 
  | 'leave'           // Leave-related forms
  | 'medical'         // Medical and health forms
  | 'training'        // Training and development
  | 'administrative'  // General admin paperwork
  | 'coast-guard'     // USCG credential forms
  | 'benefits';       // Pay and benefits

export interface FormItem {
  id: string;
  title: string;
  description: string;
  filename: string;      // Just the filename, e.g., "leave-chit.pdf"
  category: FormCategory;
  icon: 'calendar' | 'heart' | 'graduation-cap' | 'file-text' | 'anchor' | 'dollar-sign' | 'users' | 'clipboard' | 'home' | 'shield';
}

/**
 * All MSC forms - ordered by most commonly used first
 * 
 * HOW TO ADD A NEW FORM:
 * 1. Drop your PDF into /public/forms/
 * 2. Copy one of the objects below and update all fields
 * 3. The form will automatically appear on the page!
 */
export const FORMS: FormItem[] = [
  // ============================================
  // LEAVE-RELATED FORMS
  // ============================================
  {
    id: 'leave-chit',
    title: 'Leave Chit',
    description: 'Standard leave request form for requesting annual leave, sick leave, or other time off. Submit to your department head for approval.',
    filename: 'leave-chit.pdf',
    category: 'leave',
    icon: 'calendar',
  },
  {
    id: 'licwo-instructions',
    title: 'LICWO Instructions',
    description: 'Leave in Conjunction with Orders - Instructions for taking leave when you have PCS or TAD orders. Explains how to coordinate leave with travel.',
    filename: 'licwo-instructions.pdf',
    category: 'leave',
    icon: 'clipboard',
  },
  {
    id: 'donated-leave-accept',
    title: 'Application to Accept Donated Leave',
    description: 'Request to receive donated leave from another employee. Used for medical emergencies or other qualifying situations when you\'ve exhausted your own leave.',
    filename: 'application-accept-donated-leave.pdf',
    category: 'leave',
    icon: 'users',
  },
  {
    id: 'donated-leave-request',
    title: 'Request to Donate Leave Form',
    description: 'Donate your annual leave to a coworker in need. Allows you to transfer leave hours to an approved leave recipient.',
    filename: 'request-donate-leave.pdf',
    category: 'leave',
    icon: 'heart',
  },
  {
    id: 'fmla-application',
    title: 'FMLA Application',
    description: 'Family and Medical Leave Act application. Request up to 12 weeks of unpaid, job-protected leave for family or medical reasons.',
    filename: 'fmla-application.pdf',
    category: 'leave',
    icon: 'home',
  },

  // ============================================
  // MEDICAL FORMS
  // ============================================
  {
    id: 'medical-summary-nffd',
    title: 'Medical Summary Form - NFFD Paperwork',
    description: 'Not Fit For Duty medical documentation. Required when seeking medical clearance or documenting health conditions affecting duty status.',
    filename: 'medical-summary-nffd.pdf',
    category: 'medical',
    icon: 'heart',
  },
  {
    id: 'msc-sq-medical',
    title: 'MSC SQ - Medical Questionnaire',
    description: 'MSC Sea Qualification medical questionnaire. Part of the periodic medical screening required to maintain sea duty qualification.',
    filename: 'msc-sq-medical-questionnaire.pdf',
    category: 'medical',
    icon: 'clipboard',
  },

  // ============================================
  // COAST GUARD / CREDENTIAL FORMS
  // ============================================
  {
    id: '719k-physical',
    title: '719K - Coast Guard Physical',
    description: 'USCG Form 719K for merchant mariner physical examination. Required for initial MMC issuance and renewals.',
    filename: '719k-coast-guard-physical.pdf',
    category: 'coast-guard',
    icon: 'anchor',
  },
  {
    id: '719b-mmc-renewal',
    title: '719B - Coast Guard MMC Renewal',
    description: 'USCG Form 719B for Merchant Mariner Credential renewal. Use this when renewing your MMC before expiration.',
    filename: '719b-mmc-renewal.pdf',
    category: 'coast-guard',
    icon: 'anchor',
  },

  // ============================================
  // TRAINING FORMS
  // ============================================
  {
    id: 'training-request',
    title: 'Training Request Form',
    description: 'Request approval for professional development, certifications, or required training courses. Submit to your supervisor for routing.',
    filename: 'training-request.pdf',
    category: 'training',
    icon: 'graduation-cap',
  },
  {
    id: 's-and-q',
    title: 'S&Q Form',
    description: 'Skills and Qualifications form. Document your professional qualifications, certifications, and special skills for your personnel record.',
    filename: 's-and-q.pdf',
    category: 'training',
    icon: 'shield',
  },

  // ============================================
  // ADMINISTRATIVE FORMS
  // ============================================
  {
    id: 'boot-reimbursement',
    title: 'Boot Reimbursement Form',
    description: 'Request reimbursement for safety footwear purchases. Include receipt and ensure boots meet required safety standards.',
    filename: 'boot-reimbursement.pdf',
    category: 'benefits',
    icon: 'dollar-sign',
  },
  {
    id: 'address-emergency-contact',
    title: 'Change of Address or Emergency Contact',
    description: 'Update your home address, mailing address, or emergency contact information. Keep your personnel record current.',
    filename: 'change-address-emergency-contact.pdf',
    category: 'administrative',
    icon: 'home',
  },
  {
    id: 'designation-beneficiary',
    title: 'Designation of Beneficiary',
    description: 'Designate or update beneficiaries for life insurance and other benefits. Important to keep current after life changes.',
    filename: 'designation-beneficiary.pdf',
    category: 'benefits',
    icon: 'users',
  },
  {
    id: 'resignation-letter',
    title: 'Resignation Letter',
    description: 'Template for submitting your resignation from MSC. Follow proper procedures and provide adequate notice period.',
    filename: 'resignation-letter.pdf',
    category: 'administrative',
    icon: 'file-text',
  },
];

/**
 * Category metadata for display purposes
 * Used to show category labels and colors on the tiles
 */
export const CATEGORY_CONFIG: Record<FormCategory, { label: string; color: string }> = {
  'leave': { 
    label: 'Leave', 
    color: 'bg-blue-500/30 text-blue-300 border-blue-400/50' 
  },
  'medical': { 
    label: 'Medical', 
    color: 'bg-red-500/30 text-red-300 border-red-400/50' 
  },
  'training': { 
    label: 'Training', 
    color: 'bg-purple-500/30 text-purple-300 border-purple-400/50' 
  },
  'administrative': { 
    label: 'Administrative', 
    color: 'bg-gray-500/30 text-gray-300 border-gray-400/50' 
  },
  'coast-guard': { 
    label: 'Coast Guard', 
    color: 'bg-orange-500/30 text-orange-300 border-orange-400/50' 
  },
  'benefits': { 
    label: 'Benefits', 
    color: 'bg-green-500/30 text-green-300 border-green-400/50' 
  },
};
