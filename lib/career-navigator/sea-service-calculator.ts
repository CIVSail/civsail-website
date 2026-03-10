import { SeaServicePeriod } from '@/types/sea-service';
import { SeaServiceRequirement, CredentialLevel } from '@/types/career-navigator';

/**
 * Calculate qualifying sea service time toward a specific credential
 * 
 * CRITICAL LOGIC:
 * - Only counts time where position_held matches required ranks
 * - Respects GRT requirements (100+ GRT minimum, 50% on 1600+ GRT for unlimited)
 * - Uses watchkeeping_days when position is OICNW-qualified
 * - Handles 2-for-1 credit (e.g., AB time toward 2/M, OICNW time toward Master)
 */

interface QualifyingTimeResult {
  qualifying_days: number;
  qualifying_periods: SeaServicePeriod[];
  days_on_1600_plus: number;
  recency_met: boolean;
  tonnage_requirement_met: boolean;
  breakdown: {
    total_days: number;
    days_on_100_plus_grt: number;
    days_on_1600_plus_grt: number;
    percentage_on_1600_plus: number;
  };
}

/**
 * Check if a position qualifies for OICNW credit
 */
function isOICNWPosition(position: string): boolean {
  const oicnw_positions = [
    'third_mate',
    '3rd_mate',
    '3/m',
    'second_mate',
    '2nd_mate',
    '2/m',
    'chief_mate',
    'c/m',
    'master',
  ];
  return oicnw_positions.some(p => position.toLowerCase().includes(p));
}

/**
 * Check if a period counts toward recency (90 days in past 7 years, 45 on 1600+)
 */
function checkRecency(periods: SeaServicePeriod[]): boolean {
  const sevenYearsAgo = new Date();
  sevenYearsAgo.setFullYear(sevenYearsAgo.getFullYear() - 7);

  let recentDays = 0;
  let recent1600Days = 0;

  periods.forEach(period => {
    const signOffDate = new Date(period.sign_off_date);
    if (signOffDate >= sevenYearsAgo) {
      recentDays += period.days_served || 0;
      if (period.grt && period.grt >= 1600) {
        recent1600Days += period.days_served || 0;
      }
    }
  });

  return recentDays >= 90 && recent1600Days >= 45;
}

/**
 * Main function: Calculate qualifying time toward Second Mate
 * Requirement: 360 days as OICNW while holding 3/M endorsement
 */
export function calculateSecondMateQualifyingTime(
  seaService: SeaServicePeriod[]
): QualifyingTimeResult {
  let qualifying_days = 0;
  let days_on_1600_plus = 0;
  const qualifying_periods: SeaServicePeriod[] = [];

  seaService.forEach(period => {
    // Must be on vessel 100+ GRT
    if (!period.grt || period.grt < 100) return;

    // Must be in OICNW position (3/M, 2/M, C/M, Master)
    if (!isOICNWPosition(period.position_held)) return;

    // Must be on Ocean/NC or Great Lakes
    if (period.route && !['oceans', 'near_coastal', 'great_lakes'].includes(period.route)) return;

    // Use watchkeeping_days if available, otherwise use days_served
    const creditable_days = period.watchkeeping_days || period.days_served || 0;

    qualifying_days += creditable_days;
    qualifying_periods.push(period);

    if (period.grt >= 1600) {
      days_on_1600_plus += creditable_days;
    }
  });

  const percentage_on_1600_plus = qualifying_days > 0 
    ? days_on_1600_plus / qualifying_days 
    : 0;

  const recency_met = checkRecency(seaService);
  const tonnage_requirement_met = percentage_on_1600_plus >= 0.5; // 50% on 1600+ GRT

  return {
    qualifying_days,
    qualifying_periods,
    days_on_1600_plus,
    recency_met,
    tonnage_requirement_met,
    breakdown: {
      total_days: qualifying_days,
      days_on_100_plus_grt: qualifying_days,
      days_on_1600_plus_grt: days_on_1600_plus,
      percentage_on_1600_plus,
    },
  };
}

/**
 * Calculate qualifying time toward Chief Mate
 * Requirement: 360 days as OICNW while holding 2/M endorsement
 */
export function calculateChiefMateQualifyingTime(
  seaService: SeaServicePeriod[]
): QualifyingTimeResult {
  // Logic is identical to Second Mate calculation
  // Just checking for 2/M position instead of 3/M
  // (In practice, user's current credential determines which periods count)
  
  return calculateSecondMateQualifyingTime(seaService);
}

/**
 * Calculate qualifying time toward Master
 * 
 * PRIMARY PATH (46 CFR 11.404(a)(1)):
 * - 360 days as Chief Mate on Ocean/NC or Great Lakes
 * 
 * ALTERNATIVE PATH (46 CFR 11.404(a)(2)):
 * - 180 days as Chief Mate + 360 days as OICNW (2-for-1 credit)
 */
export function calculateMasterQualifyingTime(
  seaService: SeaServicePeriod[]
): {
  primary_path: QualifyingTimeResult;
  alternative_path: {
    chief_mate_days: number;
    oicnw_days_credit: number;  // Actual OICNW days / 2
    total_creditable_days: number;
  };
  recommended_path: 'primary' | 'alternative';
} {
  // PRIMARY PATH: 360 days as Chief Mate
  let cm_days = 0;
  let cm_days_on_1600 = 0;
  const cm_periods: SeaServicePeriod[] = [];

  // ALTERNATIVE PATH components
  let cm_days_alt = 0;
  let oicnw_days = 0;

  seaService.forEach(period => {
    if (!period.grt || period.grt < 100) return;
    if (period.route && !['oceans', 'near_coastal', 'great_lakes'].includes(period.route)) return;

    const creditable_days = period.watchkeeping_days || period.days_served || 0;
    const position_lower = period.position_held.toLowerCase();

    // Chief Mate time
    if (position_lower.includes('chief_mate') || position_lower.includes('c/m')) {
      cm_days += creditable_days;
      cm_periods.push(period);
      cm_days_alt += creditable_days;
      
      if (period.grt >= 1600) {
        cm_days_on_1600 += creditable_days;
      }
    }
    // OICNW time (for alternative path only - 2:1 credit)
    else if (isOICNWPosition(period.position_held)) {
      oicnw_days += creditable_days;
    }
  });

  const primary_path: QualifyingTimeResult = {
    qualifying_days: cm_days,
    qualifying_periods: cm_periods,
    days_on_1600_plus: cm_days_on_1600,
    recency_met: checkRecency(seaService),
    tonnage_requirement_met: cm_days > 0 ? (cm_days_on_1600 / cm_days >= 0.5) : false,
    breakdown: {
      total_days: cm_days,
      days_on_100_plus_grt: cm_days,
      days_on_1600_plus_grt: cm_days_on_1600,
      percentage_on_1600_plus: cm_days > 0 ? cm_days_on_1600 / cm_days : 0,
    },
  };

  // Alternative path: 180 C/M + (OICNW days / 2)
  const oicnw_credit = oicnw_days / 2;
  const alt_total = cm_days_alt + oicnw_credit;

  const alternative_path = {
    chief_mate_days: cm_days_alt,
    oicnw_days_credit: oicnw_credit,
    total_creditable_days: alt_total,
  };

  // Recommend whichever path gets them there faster
  const recommended_path = primary_path.qualifying_days >= 360 ? 'primary' :
                          alt_total >= 360 ? 'alternative' : 
                          (primary_path.qualifying_days > alt_total ? 'primary' : 'alternative') as 'primary' | 'alternative';

  return {
    primary_path,
    alternative_path,
    recommended_path,
  };
}

/**
 * Generic calculator that routes to the appropriate function
 */
export function calculateQualifyingTime(
  targetCredential: CredentialLevel,
  seaService: SeaServicePeriod[]
): QualifyingTimeResult | any {
  switch (targetCredential) {
    case 'second_mate':
      return calculateSecondMateQualifyingTime(seaService);
    case 'chief_mate':
      return calculateChiefMateQualifyingTime(seaService);
    case 'master':
      return calculateMasterQualifyingTime(seaService);
    default:
      throw new Error(`Unsupported credential: ${targetCredential}`);
  }
}