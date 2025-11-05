// lib/utils/nmc-parser.ts
/**
 * NMC Email Parser - Beginner-Friendly Version
 * 
 * This file parses emails from the National Maritime Center (NMC)
 * and extracts maritime credentials, expiration dates, and other info.
 * 
 * WHAT IS PARSING?
 * Parsing = reading messy text and extracting structured data
 * Like highlighting important parts of a document and organizing them
 */

// ============================================
// STEP 1: Define Types (What Data Looks Like)
// ============================================

/**
 * These types define the "shape" of our data
 * Think of them as blueprints or templates
 */

export type EndorsementSystem = 'national' | 'stcw';  // US or International
export type Department = 'deck' | 'engine' | 'other' | 'all';  // Which part of ship
export type CredentialType = 'license' | 'rating' | 'endorsement' | 'competency' | 'basic_safety' | 'advanced_training';
export type QualificationLevel = 'entry' | 'rating' | 'junior_officer' | 'senior_officer';

/**
 * This describes ONE credential (like "Ordinary Seafarer")
 * with all its metadata
 */
export interface CredentialClassification {
  system: EndorsementSystem;      // 'national' or 'stcw'
  department: Department;          // 'deck', 'engine', etc.
  type: CredentialType;            // 'license', 'rating', etc.
  rank: number;                    // 1=entry level, 10=master/chief
  level: QualificationLevel;       // How senior you are
  shortName: string;               // Display name like "OS" or "AB"
}

/**
 * After we parse a credential line, we store:
 * - The original text (for audit trail)
 * - Our classification (if we recognized it)
 * - Whether it needs human review
 */
export interface ParsedCredential {
  rawText: string;                           // Original: "National - Ordinary Seafarer"
  classification: CredentialClassification | null;  // Our guess about what it is
  needsReview: boolean;                      // true if we don't recognize it
}

/**
 * The final output of parsing an entire email
 */
export interface ParsedNMCEmail {
  refNumber: string;                    // Mariner's ID: "4161399"
  lastName: string;                     // "Schenning"
  mmcExpiration: Date | null;           // When MMC expires
  medicalExpiration: Date | null;       // When medical expires
  credentials: ParsedCredential[];      // List of all credentials
  unknownCredentials: string[];         // Ones we couldn't classify
}

// ============================================
// STEP 2: Classification Map (The Lookup Table)
// ============================================

/**
 * This is like a dictionary that maps:
 * "National - Ordinary Seafarer" → { department: 'deck', rank: 1, ... }
 * 
 * We use this to understand what each credential means
 */
const NMC_CREDENTIAL_MAP: Record<string, CredentialClassification> = {
  // NATIONAL DECK RATINGS
  'National - Ordinary Seafarer': {
    system: 'national',
    department: 'deck',
    type: 'rating',
    rank: 1,               // Entry level
    level: 'entry',
    shortName: 'OS',
  },
  'National - Able Seafarer-Unlimited': {
    system: 'national',
    department: 'deck',
    type: 'rating',
    rank: 3,               // Qualified rating
    level: 'rating',
    shortName: 'AB Unlimited',
  },
  
  // NATIONAL DECK LICENSES
  'National - Deck Officer - Third Mate Of Self-Propelled Vessels': {
    system: 'national',
    department: 'deck',
    type: 'license',
    rank: 5,               // Junior officer
    level: 'junior_officer',
    shortName: '3rd Mate',
  },
  'National - Deck Officer - Second Mate Of Self-Propelled Vessels Not Including Sail or Auxiliary Sail Of Unlimited Tonnage Upon Oceans.': {
    system: 'national',
    department: 'deck',
    type: 'license',
    rank: 6,
    level: 'junior_officer',
    shortName: '2nd Mate Unlimited',
  },
  
  // NATIONAL ENGINE
  'National - Wiper': {
    system: 'national',
    department: 'engine',
    type: 'rating',
    rank: 1,
    level: 'entry',
    shortName: 'Wiper',
  },
  'National - Qualified Member of the Engine Department (QMED) Any Rating': {
    system: 'national',
    department: 'engine',
    type: 'rating',
    rank: 3,
    level: 'rating',
    shortName: 'QMED',
  },
  
  // NATIONAL OTHER
  'National - Stewards Department (F.H.)': {
    system: 'national',
    department: 'other',
    type: 'rating',
    rank: 1,
    level: 'entry',
    shortName: 'Steward (F.H.)',
  },
  'National - Lifeboat Operator': {
    system: 'national',
    department: 'all',
    type: 'endorsement',
    rank: 0,
    level: 'rating',
    shortName: 'Lifeboat Operator',
  },
  
  // STCW CERTIFICATIONS
  'STCW - Basic Training.': {
    system: 'stcw',
    department: 'all',
    type: 'basic_safety',
    rank: 0,
    level: 'entry',
    shortName: 'Basic Training',
  },
  'STCW - Advanced Firefighting.': {
    system: 'stcw',
    department: 'all',
    type: 'advanced_training',
    rank: 0,
    level: 'rating',
    shortName: 'Advanced Firefighting',
  },
  'STCW - Officer in charge of a navigational watch (OICNW).': {
    system: 'stcw',
    department: 'deck',
    type: 'competency',
    rank: 0,
    level: 'junior_officer',
    shortName: 'OICNW',
  },
  'STCW - Rating forming part of a navigational watch (RFPNW).': {
    system: 'stcw',
    department: 'deck',
    type: 'competency',
    rank: 0,
    level: 'rating',
    shortName: 'RFPNW',
  },
  
  // Add more as needed...
};

// ============================================
// STEP 3: Helper Functions
// ============================================

/**
 * FUNCTION: classifyCredential
 * 
 * Takes a line like "National - Ordinary Seafarer"
 * and looks it up in our classification map
 * 
 * RETURNS: Classification info OR null if unknown
 */
function classifyCredential(nmcText: string): CredentialClassification | null {
  // Try exact match first (fastest)
  if (NMC_CREDENTIAL_MAP[nmcText]) {
    return NMC_CREDENTIAL_MAP[nmcText];
  }
  
  // Try case-insensitive match
  const cleaned = nmcText.trim();
  for (const [key, classification] of Object.entries(NMC_CREDENTIAL_MAP)) {
    if (key.toLowerCase() === cleaned.toLowerCase()) {
      return classification;
    }
  }
  
  // Pattern-based guessing for unknowns
  // This helps when we don't have exact match but can make educated guess
  const text = cleaned.toLowerCase();
  
  if (text.startsWith('stcw -')) {
    // It's some kind of STCW cert we don't know about
    return {
      system: 'stcw',
      department: 'all',
      type: 'advanced_training',
      rank: 0,
      level: 'rating',
      shortName: cleaned.replace(/^STCW - /i, ''),
    };
  }
  
  if (text.includes('mate') || text.includes('master')) {
    // Probably a deck officer
    return {
      system: 'national',
      department: 'deck',
      type: 'license',
      rank: 5,
      level: 'junior_officer',
      shortName: cleaned.replace(/^National - /, ''),
    };
  }
  
  // Couldn't figure it out
  return null;
}

/**
 * FUNCTION: parseCoastGuardDate
 * 
 * Coast Guard uses format: "26-OCT-28"
 * We need to convert to JavaScript Date: 2028-10-26
 * 
 * WHY? JavaScript can't understand "26-OCT-28" directly
 */
function parseCoastGuardDate(dateStr: string): Date | null {
  try {
    // Month name to number lookup
    const months: Record<string, number> = {
      'JAN': 0, 'FEB': 1, 'MAR': 2, 'APR': 3, 
      'MAY': 4, 'JUN': 5, 'JUL': 6, 'AUG': 7, 
      'SEP': 8, 'OCT': 9, 'NOV': 10, 'DEC': 11
    };
    
    // Split "26-OCT-28" into ["26", "OCT", "28"]
    const parts = dateStr.trim().split('-');
    if (parts.length !== 3) return null;
    
    // Extract pieces
    const day = parseInt(parts[0]);       // 26
    const month = months[parts[1].toUpperCase()];  // OCT → 9 (October)
    let year = parseInt(parts[2]);        // 28
    
    // Handle 2-digit years
    // 28 → 2028, 95 → 1995
    if (year < 100) {
      year = year < 50 ? 2000 + year : 1900 + year;
    }
    
    // Create JavaScript Date
    return new Date(year, month, day);
  } catch {
    return null;  // If anything fails, return null
  }
}

// ============================================
// STEP 4: Main Parser Function
// ============================================

/**
 * MAIN FUNCTION: parseNMCEmail
 * 
 * This is the function everyone calls!
 * Takes raw email text, returns structured data
 * 
 * HOW IT WORKS:
 * 1. Split email into lines
 * 2. Go through each line
 * 3. Look for patterns (RefNum:, EXPIRATION DATE:, National -, STCW -)
 * 4. Extract and classify what we find
 * 5. Return organized results
 */
export function parseNMCEmail(emailBody: string): ParsedNMCEmail {
  // Split email into array of lines
  const lines = emailBody.split('\n');
  
  // Initialize results (start with empty values)
  const credentials: ParsedCredential[] = [];
  const unknownCredentials: string[] = [];
  let refNumber = '';
  let lastName = '';
  let mmcExpiration: Date | null = null;
  let medicalExpiration: Date | null = null;
  
  // LOOP through each line of the email
  for (const line of lines) {
    const trimmed = line.trim();  // Remove spaces from start/end
    
    // PATTERN 1: Extract Reference Number
    // Looking for: "RefNum: 4161399"
    if (trimmed.startsWith('RefNum:') || trimmed.startsWith('Ref Num:')) {
      refNumber = trimmed.split(':')[1].trim();
      continue;  // Move to next line
    }
    
    // PATTERN 2: Extract Last Name
    // Looking for: "Last Name: Schenning"
    if (trimmed.startsWith('Last Name:')) {
      lastName = trimmed.split(':')[1].trim();
      continue;
    }
    
    // PATTERN 3: Extract MMC Expiration
    // Looking for: "MMC (ISSUE DATE:26-OCT-23 EXPIRATION DATE:26-OCT-28)"
    if (trimmed.includes('MMC') && trimmed.includes('EXPIRATION DATE:')) {
      // Use regex to find the date pattern
      const match = trimmed.match(/EXPIRATION DATE:(\d{2}-[A-Z]{3}-\d{2,4})/);
      if (match) {
        const exp = parseCoastGuardDate(match[1]);
        // Keep the LATEST expiration if multiple MMCs
        if (exp && (!mmcExpiration || exp > mmcExpiration)) {
          mmcExpiration = exp;
        }
      }
      continue;
    }
    
    // PATTERN 4: Extract Medical Expiration
    // Looking for: "MEDICAL CERTIFICATE (...STCW EXPIRATION DATE:12-MAR-26)"
    // We use STCW date because it's the most restrictive
    if (trimmed.includes('MEDICAL CERTIFICATE') && trimmed.includes('STCW EXPIRATION DATE:')) {
      const match = trimmed.match(/STCW EXPIRATION DATE:(\d{2}-[A-Z]{3}-\d{2,4})/);
      if (match) {
        const exp = parseCoastGuardDate(match[1]);
        if (exp && (!medicalExpiration || exp > medicalExpiration)) {
          medicalExpiration = exp;
        }
      }
      continue;
    }
    
    // PATTERN 5: Extract Credentials
    // Looking for lines that start with "National -" or "STCW -"
    if (trimmed.startsWith('National -') || trimmed.startsWith('STCW -')) {
      // Try to classify this credential
      const classification = classifyCredential(trimmed);
      
      // If we couldn't classify it, add to unknowns list
      if (!classification) {
        unknownCredentials.push(trimmed);
      }
      
      // Add to credentials list
      credentials.push({
        rawText: trimmed,
        classification: classification,
        needsReview: !classification,  // true if null
      });
    }
  }
  
  // Return all extracted data
  return {
    refNumber,
    lastName,
    mmcExpiration,
    medicalExpiration,
    credentials,
    unknownCredentials,
  };
}

// ============================================
// STEP 5: Discrepancy Detection
// ============================================

/**
 * FUNCTION: detectDiscrepancies
 * 
 * Compares what user entered vs what NMC says
 * Helps catch typos or outdated info
 */
export interface DiscrepancyResult {
  hasAnyDiscrepancy: boolean;
  mmcDiscrepancy: boolean;
  medicalDiscrepancy: boolean;
  mmcUserEntered: Date | null;
  mmcNMCVerified: Date | null;
  medicalUserEntered: Date | null;
  medicalNMCVerified: Date | null;
}

export function detectDiscrepancies(
  userMMC: string | null,
  userMedical: string | null,
  nmcMMC: Date | null,
  nmcMedical: Date | null
): DiscrepancyResult {
  // Convert user strings to dates for comparison
  const userMMCDate = userMMC ? new Date(userMMC) : null;
  const userMedicalDate = userMedical ? new Date(userMedical) : null;
  
  // Check if dates match (within 1 day tolerance for timezone issues)
  const mmcMatches = !userMMCDate || !nmcMMC || 
    Math.abs(userMMCDate.getTime() - nmcMMC.getTime()) < 24 * 60 * 60 * 1000;
  
  const medicalMatches = !userMedicalDate || !nmcMedical || 
    Math.abs(userMedicalDate.getTime() - nmcMedical.getTime()) < 24 * 60 * 60 * 1000;
  
  return {
    hasAnyDiscrepancy: !mmcMatches || !medicalMatches,
    mmcDiscrepancy: !mmcMatches,
    medicalDiscrepancy: !medicalMatches,
    mmcUserEntered: userMMCDate,
    mmcNMCVerified: nmcMMC,
    medicalUserEntered: userMedicalDate,
    medicalNMCVerified: nmcMedical,
  };
}
