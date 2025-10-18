import { parse, format } from 'date-fns';

/**
 * Parse NMC email body and extract credentials and expiration dates
 * 
 * Example email format:
 * RefNum: 4161399
 * Last Name: Schenning
 * MMC (ISSUE DATE:26-OCT-23 EXPIRATION DATE:26-OCT-28 Serial Number:000702770)
 * National - Ordinary Seafarer
 * National - Stewards Department (F.H.)
 * STCW - Basic Training
 * MEDICAL CERTIFICATE (ISSUE DATE:13-MAR-24 DOMESTIC EXPIRATION DATE:12-MAR-29 STCW EXPIRATION DATE:12-MAR-26)
 */

interface ParsedCredential {
  type: 'national' | 'stcw' | 'license';
  name: string;
  department: 'deck' | 'engine' | 'steward' | null;
}

interface NMCParseResult {
  refNumber: string;
  mmcExpiration: string; // YYYY-MM-DD format
  medicalExpiration: string; // YYYY-MM-DD format (STCW date)
  credentials: ParsedCredential[];
}

/**
 * Convert NMC date format (DD-MMM-YY) to ISO format (YYYY-MM-DD)
 * Example: "26-OCT-28" → "2028-10-26"
 */
function parseNMCDate(dateStr: string): string {
  try {
    // NMC format: DD-MMM-YY (e.g., "26-OCT-28")
    const parsed = parse(dateStr, 'dd-MMM-yy', new Date());
    return format(parsed, 'yyyy-MM-dd');
  } catch (error) {
    console.error('Error parsing NMC date:', dateStr, error);
    throw new Error(`Invalid date format: ${dateStr}`);
  }
}

/**
 * Determine department from endorsement name
 * This is a best-effort mapping based on common endorsements
 */
function inferDepartment(endorsementName: string): 'deck' | 'engine' | 'steward' | null {
  const name = endorsementName.toLowerCase();
  
  // Deck department indicators
  if (name.includes('ab') || 
      name.includes('able seafarer') ||
      name.includes('ordinary seafarer') ||
      name.includes('mate') ||
      name.includes('master') ||
      name.includes('deck')) {
    return 'deck';
  }
  
  // Engine department indicators
  if (name.includes('qmed') ||
      name.includes('oiler') ||
      name.includes('wiper') ||
      name.includes('engineer') ||
      name.includes('engine')) {
    return 'engine';
  }
  
  // Steward department indicators
  if (name.includes('steward') ||
      name.includes('cook') ||
      name.includes('f.h.')) {
    return 'steward';
  }
  
  return null;
}

/**
 * Parse the full NMC email body
 */
export function parseNMCEmail(emailBody: string): NMCParseResult {
  const lines = emailBody.split('\n').map(line => line.trim());
  
  let refNumber = '';
  let mmcExpiration = '';
  let medicalExpiration = '';
  const credentials: ParsedCredential[] = [];
  
  for (const line of lines) {
    // Extract reference number
    if (line.startsWith('RefNum:')) {
      refNumber = line.replace('RefNum:', '').trim();
      continue;
    }
    
    // Extract MMC expiration date
    if (line.includes('MMC (') && line.includes('EXPIRATION DATE:')) {
      const match = line.match(/EXPIRATION DATE:(\d{2}-[A-Z]{3}-\d{2})/);
      if (match) {
        mmcExpiration = parseNMCDate(match[1]);
      }
      continue;
    }
    
    // Extract Medical cert expiration (use STCW date)
    if (line.includes('MEDICAL CERTIFICATE') && line.includes('STCW EXPIRATION DATE:')) {
      const match = line.match(/STCW EXPIRATION DATE:(\d{2}-[A-Z]{3}-\d{2})/);
      if (match) {
        medicalExpiration = parseNMCDate(match[1]);
      }
      continue;
    }
    
    // Extract National endorsements
    if (line.startsWith('National - ')) {
      const name = line.replace('National - ', '').trim();
      credentials.push({
        type: 'national',
        name,
        department: inferDepartment(name)
      });
      continue;
    }
    
    // Extract STCW certifications
    if (line.startsWith('STCW - ')) {
      const name = line.replace('STCW - ', '').trim().replace('.', ''); // Remove trailing period
      credentials.push({
        type: 'stcw',
        name,
        department: null // STCW certs don't have departments
      });
      continue;
    }
    
    // Extract Licenses (if present)
    // Example: "Master, Any Oceans (200 GRT)" or "Third Assistant Engineer (Unlimited HP)"
    if (line.match(/^(Master|Chief Engineer|Chief Mate|First Assistant Engineer|Second Mate|Second Assistant Engineer|Third Mate|Third Assistant Engineer)/i)) {
      credentials.push({
        type: 'license',
        name: line.trim(),
        department: line.toLowerCase().includes('engineer') ? 'engine' : 'deck'
      });
    }
  }
  
  // Validate required fields
  if (!refNumber) {
    throw new Error('Could not find RefNum in email');
  }
  if (!mmcExpiration) {
    throw new Error('Could not find MMC expiration date in email');
  }
  if (!medicalExpiration) {
    throw new Error('Could not find Medical expiration date in email');
  }
  
  return {
    refNumber,
    mmcExpiration,
    medicalExpiration,
    credentials
  };
}

/**
 * Compare parsed NMC data with user-entered data to detect discrepancies
 */
export function detectDiscrepancies(
  userMMC: string | null,
  userMedical: string | null,
  nmcMMC: string,
  nmcMedical: string
): {
  hasMMCDiscrepancy: boolean;
  hasMedicalDiscrepancy: boolean;
  hasAnyDiscrepancy: boolean;
} {
  const hasMMCDiscrepancy = userMMC !== null && userMMC !== nmcMMC;
  const hasMedicalDiscrepancy = userMedical !== null && userMedical !== nmcMedical;
  
  return {
    hasMMCDiscrepancy,
    hasMedicalDiscrepancy,
    hasAnyDiscrepancy: hasMMCDiscrepancy || hasMedicalDiscrepancy
  };
}