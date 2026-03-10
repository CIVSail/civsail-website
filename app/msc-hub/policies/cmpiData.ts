/**
 * CMPI Policies Data Configuration
 * 
 * Civilian Mariners Personnel Instructions (CMPIs) are official MSC policy documents.
 * 
 * To add a new CMPI:
 * 1. Add a PDF to /public/policies/[filename].pdf
 * 2. Add an entry to the CMPIS array below
 */

export type CMPICategory = 
  | 'employment'    // Hiring, positions, workforce
  | 'pay'           // Wages, allotments, benefits
  | 'work-rules'    // Hours, leave, uniforms
  | 'training'      // Training requirements
  | 'conduct'       // Discipline, drug/alcohol, labor relations
  | 'travel'        // Travel and repatriation
  | 'safety';       // War risk, emergencies

export interface CMPIItem {
  id: string;
  number: string;           // e.g., "330", "610"
  title: string;            // e.g., "Employment"
  description: string;
  filename: string;
  category: CMPICategory;
}

/**
 * All CMPIs - ordered by number
 */
export const CMPIS: CMPIItem[] = [
  // ============================================
  // EMPLOYMENT
  // ============================================
  {
    id: 'cmpi-330',
    number: '330',
    title: 'Employment',
    description: 'Rules governing CIVMAR hiring, appointments, employment status and conditions of service.',
    filename: 'cmpi-330-employment.pdf',
    category: 'employment',
  },
  {
    id: 'cmpi-351',
    number: '351',
    title: 'Reduction in Force',
    description: 'Policies for layoffs, recalls and workforce reductions affecting CIVMARs.',
    filename: 'cmpi-351-reduction-in-force.pdf',
    category: 'employment',
  },
  {
    id: 'cmpi-512',
    number: '512',
    title: 'Positions',
    description: 'Establishes authorized CIVMAR positions, classifications and billet definitions.',
    filename: 'cmpi-512-positions.pdf',
    category: 'employment',
  },
  {
    id: 'cmpi-512-clarification',
    number: '512',
    title: 'Positions Clarification Advisory',
    description: 'Provides guidance and clarifications on CIVMAR position classifications and duties.',
    filename: 'cmpi-512-positions-clarification.pdf',
    category: 'employment',
  },

  // ============================================
  // TRAINING
  // ============================================
  {
    id: 'cmpi-410',
    number: '410',
    title: 'Training',
    description: 'Defines required training, pay status and obligations for CIVMAR training programs.',
    filename: 'cmpi-410-training.pdf',
    category: 'training',
  },

  // ============================================
  // PAY & BENEFITS
  // ============================================
  {
    id: 'cmpi-531',
    number: '531',
    title: 'Wage Administration',
    description: 'Explains how CIVMAR pay, differentials and wage adjustments are calculated and administered.',
    filename: 'cmpi-531-wage-administration.pdf',
    category: 'pay',
  },
  {
    id: 'cmpi-553',
    number: '553',
    title: 'Allotments of Pay',
    description: 'Rules for direct deposit, pay allotments, garnishments and related payroll actions.',
    filename: 'cmpi-553-allotments-of-pay.pdf',
    category: 'pay',
  },
  {
    id: 'cmpi-575',
    number: '575',
    title: 'Recruitment and Retention Allowance',
    description: 'Outlines eligibility, payment and conditions for CIVMAR recruitment and retention pay.',
    filename: 'cmpi-575-recruitment-retention-allowance.pdf',
    category: 'pay',
  },
  {
    id: 'cmpi-593',
    number: '593',
    title: 'Subsistence and Quarters',
    description: 'Covers per diem, lodging, meals and housing entitlements for CIVMARs.',
    filename: 'cmpi-593-subsistence-quarters.pdf',
    category: 'pay',
  },
  {
    id: 'cmpi-815',
    number: '815',
    title: 'War Risk Benefits',
    description: 'Details special pay and benefits for CIVMARs operating in designated war-risk areas.',
    filename: 'cmpi-815-war-risk-benefits.pdf',
    category: 'pay',
  },

  // ============================================
  // WORK RULES
  // ============================================
  {
    id: 'cmpi-594',
    number: '594',
    title: 'Uniforms and Standards of Dress',
    description: 'Defines required uniforms, appearance standards and related responsibilities.',
    filename: 'cmpi-594-uniforms-dress.pdf',
    category: 'work-rules',
  },
  {
    id: 'cmpi-610',
    number: '610',
    title: 'Hours of Work and Premium Pay',
    description: 'Rules governing work schedules, overtime, penalty pay and premium compensation.',
    filename: 'cmpi-610-hours-premium-pay.pdf',
    category: 'work-rules',
  },
  {
    id: 'cmpi-610-srs',
    number: '610',
    title: 'SRS Clarification',
    description: 'Clarifies pay, duties and work rules for Shipboard Rescue Swimmers (SRS).',
    filename: 'cmpi-610-srs-clarification.pdf',
    category: 'work-rules',
  },
  {
    id: 'cmpi-610-overdue',
    number: '610',
    title: 'Overdue Relief Update',
    description: 'Defines policies and remedies related to overdue relief and delayed crew changes.',
    filename: 'cmpi-610-overdue-relief.pdf',
    category: 'work-rules',
  },
  {
    id: 'cmpi-630',
    number: '630',
    title: 'Leave and Liberty',
    description: 'Explains CIVMAR leave accrual, usage, liberty policies and leave-related procedures.',
    filename: 'cmpi-630-leave-liberty.pdf',
    category: 'work-rules',
  },

  // ============================================
  // CONDUCT & LABOR
  // ============================================
  {
    id: 'cmpi-721',
    number: '721',
    title: 'Labor-Management Relations',
    description: 'Governs union relations, grievances, employee rights and labor-management interactions.',
    filename: 'cmpi-721-labor-management.pdf',
    category: 'conduct',
  },
  {
    id: 'cmpi-750',
    number: '750',
    title: 'Discipline',
    description: 'Outlines disciplinary procedures, due process and corrective actions for CIVMARs.',
    filename: 'cmpi-750-discipline.pdf',
    category: 'conduct',
  },
  {
    id: 'cmpi-790',
    number: '790',
    title: 'Alcohol Breath Testing',
    description: 'Policies for alcohol testing, thresholds, procedures and enforcement.',
    filename: 'cmpi-790-alcohol-testing.pdf',
    category: 'conduct',
  },
  {
    id: 'cmpi-792',
    number: '792',
    title: 'CIVMAR Drug-Free Workplace',
    description: 'Rules governing drug testing, compliance and substance abuse policies.',
    filename: 'cmpi-792-drug-free-workplace.pdf',
    category: 'conduct',
  },

  // ============================================
  // TRAVEL
  // ============================================
  {
    id: 'cmpi-4650',
    number: '4650',
    title: 'Travel',
    description: 'Covers official travel orders, reimbursements and travel entitlements.',
    filename: 'cmpi-4650-travel.pdf',
    category: 'travel',
  },
  {
    id: 'cmpi-4651',
    number: '4651',
    title: 'Repatriation',
    description: 'Rules governing CIVMAR return travel, medical repatriation and end-of-service transportation.',
    filename: 'cmpi-4651-repatriation.pdf',
    category: 'travel',
  },

  // ============================================
  // SAFETY & EMERGENCY
  // ============================================
  {
    id: 'cmpi-900',
    number: '900',
    title: 'Disappearances, Detention and Next-of-Kin Notification',
    description: 'Procedures for missing mariners, detentions, benefits and family notifications.',
    filename: 'cmpi-900-disappearances-detention.pdf',
    category: 'safety',
  },
];

/**
 * Category metadata for display
 */
export const CMPI_CATEGORY_CONFIG: Record<CMPICategory, { label: string; color: string }> = {
  'employment': { 
    label: 'Employment', 
    color: 'bg-blue-500/30 text-blue-300 border-blue-400/50' 
  },
  'pay': { 
    label: 'Pay & Benefits', 
    color: 'bg-green-500/30 text-green-300 border-green-400/50' 
  },
  'work-rules': { 
    label: 'Work Rules', 
    color: 'bg-purple-500/30 text-purple-300 border-purple-400/50' 
  },
  'training': { 
    label: 'Training', 
    color: 'bg-amber-500/30 text-amber-300 border-amber-400/50' 
  },
  'conduct': { 
    label: 'Conduct & Labor', 
    color: 'bg-red-500/30 text-red-300 border-red-400/50' 
  },
  'travel': { 
    label: 'Travel', 
    color: 'bg-cyan-500/30 text-cyan-300 border-cyan-400/50' 
  },
  'safety': { 
    label: 'Safety & Emergency', 
    color: 'bg-orange-500/30 text-orange-300 border-orange-400/50' 
  },
};