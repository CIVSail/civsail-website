// lib/utils/sea-service-parser.ts
/**
 * Parse sea service letters to extract vessel info, dates, and position
 * Handles MSC (Military Sealift Command) and commercial formats
 * 
 * KEY CHALLENGE: One SSL can contain MULTIPLE service periods
 * Example: USNS ARCTIC letter shows BOTH Feb 2021 trip AND Feb 2023 trip
 * We need to extract ALL periods and check for duplicates
 */

export interface ParsedServicePeriod {
  vesselName: string;
  signOnDate: Date | null;
  signOffDate: Date | null;
  daysServed: number | null;
  position: string;
  department: 'deck' | 'engine' | 'steward' | 'other' | null;
  grossTonnage: number | null;
  horsepower: number | null;
  propulsionType: 'motor' | 'steam' | 'gas_turbine' | 'sail' | 'mixed' | null;
  route: 'oceans' | 'near_coastal' | 'great_lakes' | 'inland' | null;
  confidence: 'high' | 'medium' | 'low';
  validationFlags: ValidationFlag[];
}

export interface ParsedSeaServiceLetter {
  servicePeriods: ParsedServicePeriod[];
  rawText: string;
  overallConfidence: 'high' | 'medium' | 'low';
  needsManualReview: boolean;
}

export interface ValidationFlag {
  type: 'error' | 'warning' | 'info';
  field: string;
  message: string;
  code: string;
}

/**
 * Main parser function - extracts ALL service periods from a sea service letter
 * 
 * @param ocrText - Raw text from OCR
 * @returns All service periods found in the letter
 */
export function parseSeaServiceLetter(ocrText: string): ParsedSeaServiceLetter {
  const text = ocrText.toUpperCase();
  
  // Detect letter format
  const isMSCFormat = text.includes('MILITARY SEALIFT COMMAND') || text.includes('USNS');
  
  // Extract all service periods (THIS IS KEY!)
  const servicePeriods = isMSCFormat
    ? extractMSCServicePeriods(text, ocrText) // Pass original case for vessel names
    : extractCommercialServicePeriods(text, ocrText);

  // Calculate overall confidence
  const avgConfidence = calculateAverageConfidence(servicePeriods);
  
  // Determine if manual review needed
  const needsReview = servicePeriods.some(p => 
    p.confidence === 'low' || 
    p.validationFlags.some(f => f.type === 'error')
  );

  return {
    servicePeriods,
    rawText: ocrText,
    overallConfidence: avgConfidence,
    needsManualReview: needsReview,
  };
}

/**
 * Extract service periods from MSC (Military Sealift Command) format
 * 
 * MSC letters typically have a table format:
 * USNS Ship | Service Dates | Billet | Sea Time | Creditable | HP/TONNAGE | PROP
 * USNS ARCTIC | Feb 17 2021 To Jul 23 2021 | JR SUPPLY OFFICER | 157 days | 157 days | 105000/37063 | Gas Turbines
 */
function extractMSCServicePeriods(textUpper: string, textOriginal: string): ParsedServicePeriod[] {
  const periods: ParsedServicePeriod[] = [];
  
  // Look for the table section (after "has served as follows")
  const tableStart = textUpper.indexOf('HAS SERVED AS FOLLOWS');
  if (tableStart === -1) {
    // Fallback to generic parsing
    return extractCommercialServicePeriods(textUpper, textOriginal);
  }

  // Extract vessel name from header (e.g., "USNS ARCTIC")
  const vesselMatch = textUpper.match(/USNS\s+([A-Z\s]+?)(?:\n|FROM:|TO:)/);
  const vesselName = vesselMatch ? `USNS ${vesselMatch[1].trim()}` : 'Unknown Vessel';

  // Find all date range patterns in the table
  // Pattern: "Feb 17 2021 To Jul 23 2021" or "Feb 17 2021\nTo\nJul 23 2021"
  const dateRangePattern = /([A-Z]{3}\s+\d{1,2}\s+\d{4})\s*(?:TO|To|to)\s*([A-Z]{3}\s+\d{1,2}\s+\d{4})/gi;
  
  let match;
  const matches: Array<{signOn: string; signOff: string; index: number}> = [];
  
  while ((match = dateRangePattern.exec(textUpper)) !== null) {
    matches.push({
      signOn: match[1],
      signOff: match[2],
      index: match.index,
    });
  }

  // For each date range found, extract the associated data
  for (const dateMatch of matches) {
    // Extract the row containing this date range
    const rowStart = Math.max(0, dateMatch.index - 200); // Look back 200 chars
    const rowEnd = Math.min(textUpper.length, dateMatch.index + 300); // Look forward 300 chars
    const rowText = textUpper.substring(rowStart, rowEnd);

    // Extract position (Billet)
    const positionMatch = rowText.match(/(?:JR\s+)?(?:SUPPLY\s+OFFICER|ABLE\s+SEAMAN|ORDINARY\s+SEAMAN|THIRD\s+MATE|SECOND\s+MATE|CHIEF\s+MATE|MASTER|ENGINEER|WIPER|OILER|QMED|STEWARD)/);
    const position = positionMatch ? positionMatch[0].trim() : 'Unknown Position';

    // Extract days served
    const daysMatch = rowText.match(/(\d+)\s+DAYS/);
    const daysServed = daysMatch ? parseInt(daysMatch[1]) : null;

    // Extract tonnage and horsepower (format: "105000/37063" or "105000 / 37063")
    const tonnageMatch = rowText.match(/(\d+)\s*\/\s*(\d+)/);
    const horsepower = tonnageMatch ? parseInt(tonnageMatch[1]) : null;
    const grossTonnage = tonnageMatch ? parseInt(tonnageMatch[2]) : null;

    // Extract propulsion type
    let propulsionType: ParsedServicePeriod['propulsionType'] = null;
    if (rowText.includes('GAS TURB')) propulsionType = 'gas_turbine';
    else if (rowText.includes('STEAM')) propulsionType = 'steam';
    else if (rowText.includes('MOTOR') || rowText.includes('DIESEL')) propulsionType = 'motor';

    // Parse dates
    const signOnDate = parseMSCDate(dateMatch.signOn);
    const signOffDate = parseMSCDate(dateMatch.signOff);

    // Infer department
    const department = inferDepartment(position);

    // Infer route (MSC ships are typically ocean-going)
    const route = inferRoute(textUpper, grossTonnage);

    // Validate and flag issues
    const validationFlags = validateServicePeriod({
      vesselName,
      signOnDate,
      signOffDate,
      daysServed,
      position,
      grossTonnage,
      horsepower,
      propulsionType,
    });

    // Calculate confidence
    const confidence = calculateConfidence({
      hasVesselName: !!vesselName && vesselName !== 'Unknown Vessel',
      hasSignOnDate: !!signOnDate,
      hasSignOffDate: !!signOffDate,
      hasPosition: !!position && position !== 'Unknown Position',
      hasTonnage: !!grossTonnage,
      hasPropulsion: !!propulsionType,
      validationFlags,
    });

    periods.push({
      vesselName,
      signOnDate,
      signOffDate,
      daysServed,
      position,
      department,
      grossTonnage,
      horsepower,
      propulsionType,
      route,
      confidence,
      validationFlags,
    });
  }

  // If no periods found, try fallback parsing
  if (periods.length === 0) {
    return extractCommercialServicePeriods(textUpper, textOriginal);
  }

  return periods;
}

/**
 * Extract service periods from commercial/non-MSC format
 * This is a simpler fallback for other types of discharge letters
 */
function extractCommercialServicePeriods(textUpper: string, textOriginal: string): ParsedServicePeriod[] {
  // Extract basic info
  const vesselName = extractVesselName(textUpper) || 'Unknown Vessel';
  const signOnDate = extractDate(textUpper, 'SIGN.?ON');
  const signOffDate = extractDate(textUpper, 'SIGN.?OFF');
  const position = extractPosition(textUpper) || 'Unknown Position';
  const department = inferDepartment(position);
  const grossTonnage = extractTonnage(textUpper);
  const propulsionType = extractPropulsion(textUpper);
  const route = inferRoute(textUpper, grossTonnage);

  // Calculate days if possible
  const daysServed = (signOnDate && signOffDate)
    ? Math.floor((signOffDate.getTime() - signOnDate.getTime()) / (1000 * 60 * 60 * 24)) + 1
    : null;

  const validationFlags = validateServicePeriod({
    vesselName,
    signOnDate,
    signOffDate,
    daysServed,
    position,
    grossTonnage,
    horsepower: null,
    propulsionType,
  });

  const confidence = calculateConfidence({
    hasVesselName: !!vesselName && vesselName !== 'Unknown Vessel',
    hasSignOnDate: !!signOnDate,
    hasSignOffDate: !!signOffDate,
    hasPosition: !!position && position !== 'Unknown Position',
    hasTonnage: !!grossTonnage,
    hasPropulsion: !!propulsionType,
    validationFlags,
  });

  return [{
    vesselName,
    signOnDate,
    signOffDate,
    daysServed,
    position,
    department,
    grossTonnage,
    horsepower: null,
    propulsionType,
    route,
    confidence,
    validationFlags,
  }];
}

/**
 * Parse MSC date format (e.g., "Feb 17 2021", "JUL 23 2021")
 */
function parseMSCDate(dateStr: string): Date | null {
  const months: Record<string, number> = {
    'JAN': 0, 'FEB': 1, 'MAR': 2, 'APR': 3,
    'MAY': 4, 'JUN': 5, 'JUL': 6, 'AUG': 7,
    'SEP': 8, 'OCT': 9, 'NOV': 10, 'DEC': 11
  };

  const parts = dateStr.trim().split(/\s+/);
  if (parts.length !== 3) return null;

  const month = months[parts[0].toUpperCase()];
  const day = parseInt(parts[1]);
  const year = parseInt(parts[2]);

  if (month === undefined || isNaN(day) || isNaN(year)) return null;

  return new Date(year, month, day);
}

// ... (continued in next file - helper functions)
// lib/utils/sea-service-parser-helpers.ts
/**
 * Helper functions for sea service parsing
 * These extract specific fields from OCR text
 */

/**
 * Extract vessel name from OCR text
 */
export function extractVesselName(text: string): string | null {
  const patterns = [
    /VESSEL\s*(?:NAME)?[\s:]+([A-Z\s]+?)(?:\n|GROSS|SIGN|$)/,
    /(?:M\/V|MV|SS|MS|USNS)\s+([A-Z\s]+?)(?:\n|GROSS|SIGN|$)/,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      return match[0].trim(); // Return full match (includes M/V prefix)
    }
  }

  return null;
}

/**
 * Extract date from OCR text with keyword
 */
export function extractDate(text: string, keyword: string): Date | null {
  const pattern = new RegExp(
    keyword + '\\s*(?:DATE)?[\\s:]+' +
    '(\\d{1,2}[-/](?:[A-Z]{3}|\\d{1,2})[-/]\\d{2,4})',
    'i'
  );

  const match = text.match(pattern);
  if (!match) return null;

  const dateStr = match[1];

  try {
    // Handle DD-MMM-YYYY format
    if (dateStr.match(/\d{1,2}-[A-Z]{3}-\d{2,4}/i)) {
      return parseCoastGuardDate(dateStr);
    }
    // Handle other formats
    return new Date(dateStr);
  } catch {
    return null;
  }
}

/**
 * Parse Coast Guard date format (DD-MMM-YYYY)
 */
export function parseCoastGuardDate(dateStr: string): Date | null {
  const months: Record<string, number> = {
    'JAN': 0, 'FEB': 1, 'MAR': 2, 'APR': 3,
    'MAY': 4, 'JUN': 5, 'JUL': 6, 'AUG': 7,
    'SEP': 8, 'OCT': 9, 'NOV': 10, 'DEC': 11
  };

  const parts = dateStr.split('-');
  if (parts.length !== 3) return null;

  const day = parseInt(parts[0]);
  const month = months[parts[1].toUpperCase()];
  let year = parseInt(parts[2]);

  if (isNaN(day) || month === undefined || isNaN(year)) return null;

  // Handle 2-digit years
  if (year < 100) {
    year = year < 50 ? 2000 + year : 1900 + year;
  }

  return new Date(year, month, day);
}

/**
 * Extract position/rating from OCR text
 */
export function extractPosition(text: string): string | null {
  const patterns = [
    /(?:RATING|POSITION|CAPACITY|BILLET)[\s:]+([A-Z\s]+?)(?:\n|DEPARTMENT|$)/,
    /(?:SERVED AS|AS)[\s:]+([A-Z\s]+?)(?:\n|ON|$)/,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      const position = match[1].trim();
      if (position.length > 2 && position.length < 50) {
        return position;
      }
    }
  }

  return null;
}

/**
 * Infer department from position
 */
export function inferDepartment(position: string | null): 'deck' | 'engine' | 'steward' | 'other' | null {
  if (!position) return null;

  const pos = position.toUpperCase();

  // Deck positions
  if (pos.match(/MATE|MASTER|CAPTAIN|DECK|AB|ABLE|ORDINARY|BOSUN|QUARTERMASTER|SUPPLY\s+OFFICER/)) {
    return 'deck';
  }

  // Engine positions
  if (pos.match(/ENGINEER|ENGINE|OILER|WIPER|QMED|ELECTRICIAN|FITTER/)) {
    return 'engine';
  }

  // Steward positions
  if (pos.match(/STEWARD|COOK|MESSMAN|GALLEY/)) {
    return 'steward';
  }

  return 'other';
}

/**
 * Extract gross tonnage
 */
export function extractTonnage(text: string): number | null {
  const patterns = [
    /GROSS\s*(?:TONS?|TONNAGE|T)[\s:]+(\d+(?:,\d+)?)/,
    /GRT[\s:]+(\d+(?:,\d+)?)/,
    /(\d+)\s*\/\s*(\d+)/, // HP/TONNAGE format - second number is tonnage
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      // For HP/TONNAGE format, use second capture group
      const tonnageStr = pattern.source.includes('\\/') ? match[2] : match[1];
      return parseInt(tonnageStr.replace(/,/g, ''));
    }
  }

  return null;
}

/**
 * Extract propulsion type
 */
export function extractPropulsion(text: string): 'motor' | 'steam' | 'gas_turbine' | 'sail' | 'mixed' | null {
  if (text.includes('GAS TURB')) return 'gas_turbine';
  if (text.includes('STEAM')) return 'steam';
  if (text.includes('MOTOR') || text.includes('DIESEL')) return 'motor';
  if (text.includes('SAIL')) return 'sail';
  return null;
}

/**
 * Infer route from text and tonnage
 */
export function inferRoute(
  text: string,
  tonnage: number | null
): 'oceans' | 'near_coastal' | 'great_lakes' | 'inland' | null {
  // Check explicit mentions
  if (text.includes('OCEAN')) return 'oceans';
  if (text.includes('NEAR COASTAL')) return 'near_coastal';
  if (text.includes('GREAT LAKES')) return 'great_lakes';
  if (text.includes('INLAND') || text.includes('RIVER')) return 'inland';

  // Infer from tonnage (larger ships = likely ocean-going)
  if (tonnage && tonnage >= 10000) return 'oceans';
  
  // MSC ships are typically ocean-going
  if (text.includes('MILITARY SEALIFT') || text.includes('USNS')) {
    return 'oceans';
  }

  return null;
}

/**
 * Validate a service period and return flags
 */
export function validateServicePeriod(period: {
  vesselName: string | null;
  signOnDate: Date | null;
  signOffDate: Date | null;
  daysServed: number | null;
  position: string | null;
  grossTonnage: number | null;
  horsepower: number | null;
  propulsionType: string | null;
}): Array<{type: 'error' | 'warning' | 'info'; field: string; message: string; code: string}> {
  const flags: Array<{type: 'error' | 'warning' | 'info'; field: string; message: string; code: string}> = [];

  // ERRORS (Coast Guard will likely reject)
  if (!period.vesselName || period.vesselName === 'Unknown Vessel') {
    flags.push({
      type: 'error',
      field: 'vessel_name',
      message: 'Vessel name is required. Coast Guard will reject without this.',
      code: 'MISSING_VESSEL_NAME',
    });
  }

  if (!period.signOnDate) {
    flags.push({
      type: 'error',
      field: 'sign_on_date',
      message: 'Sign-on date is required. Coast Guard will reject without this.',
      code: 'MISSING_SIGN_ON_DATE',
    });
  }

  if (!period.signOffDate) {
    flags.push({
      type: 'error',
      field: 'sign_off_date',
      message: 'Sign-off date is required. Coast Guard will reject without this.',
      code: 'MISSING_SIGN_OFF_DATE',
    });
  }

  if (period.signOnDate && period.signOffDate && period.signOffDate < period.signOnDate) {
    flags.push({
      type: 'error',
      field: 'dates',
      message: 'Sign-off date is before sign-on date. This is invalid.',
      code: 'INVALID_DATE_ORDER',
    });
  }

  if (period.daysServed !== null && period.daysServed === 0) {
    flags.push({
      type: 'error',
      field: 'days_served',
      message: 'Zero days of service. Coast Guard requires at least 1 day.',
      code: 'ZERO_DAYS',
    });
  }

  // WARNINGS (May cause problems)
  if (!period.grossTonnage) {
    flags.push({
      type: 'warning',
      field: 'gross_tonnage',
      message: 'Missing tonnage. Required for some license upgrades (46 CFR 11.402).',
      code: 'MISSING_TONNAGE',
    });
  }

  if (!period.propulsionType) {
    flags.push({
      type: 'warning',
      field: 'propulsion_type',
      message: 'Missing propulsion type. Needed to track motor/steam/gas turbine limitations.',
      code: 'MISSING_PROPULSION',
    });
  }

  if (!period.position || period.position === 'Unknown Position') {
    flags.push({
      type: 'warning',
      field: 'position',
      message: 'Position unclear. Coast Guard needs to know what capacity you served under.',
      code: 'UNCLEAR_POSITION',
    });
  }

  // INFO (Good to know)
  if (period.grossTonnage && period.grossTonnage < 200) {
    flags.push({
      type: 'info',
      field: 'gross_tonnage',
      message: 'Vessel under 200 GT. Subject to 25% rule for some upgrades (46 CFR 11.402).',
      code: 'SMALL_TONNAGE',
    });
  }

  if (period.propulsionType === 'gas_turbine' || period.propulsionType === 'steam') {
    flags.push({
      type: 'info',
      field: 'propulsion_type',
      message: `Service on ${period.propulsionType} vessel noted. Helps remove "motor only" limitations.`,
      code: 'NON_MOTOR_PROPULSION',
    });
  }

  return flags;
}

/**
 * Calculate confidence level based on extracted data
 */
export function calculateConfidence(factors: {
  hasVesselName: boolean;
  hasSignOnDate: boolean;
  hasSignOffDate: boolean;
  hasPosition: boolean;
  hasTonnage: boolean;
  hasPropulsion: boolean;
  validationFlags: Array<{type: string}>;
}): 'high' | 'medium' | 'low' {
  let score = 0;

  if (factors.hasVesselName) score += 20;
  if (factors.hasSignOnDate) score += 30;
  if (factors.hasSignOffDate) score += 30;
  if (factors.hasPosition) score += 15;
  if (factors.hasTonnage) score += 5;

  // Penalize for errors
  const errorCount = factors.validationFlags.filter(f => f.type === 'error').length;
  score -= errorCount * 20;

  if (score >= 80) return 'high';
  if (score >= 50) return 'medium';
  return 'low';
}

/**
 * Calculate average confidence across multiple service periods
 */
export function calculateAverageConfidence(
  periods: Array<{confidence: 'high' | 'medium' | 'low'}>
): 'high' | 'medium' | 'low' {
  if (periods.length === 0) return 'low';

  const scoreMap = { high: 3, medium: 2, low: 1 };
  const total = periods.reduce((sum, p) => sum + scoreMap[p.confidence], 0);
  const avg = total / periods.length;

  if (avg >= 2.5) return 'high';
  if (avg >= 1.5) return 'medium';
  return 'low';
}