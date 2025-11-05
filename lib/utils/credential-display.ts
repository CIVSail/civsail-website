// lib/utils/credential-display.ts
/**
 * Helper functions for displaying credentials in user-friendly format
 * Maps official NMC names to colloquial explanations
 */

export interface CredentialDisplayInfo {
  officialName: string;
  colloquialName: string;
  description: string;
  icon: string;
}

/**
 * Get user-friendly display information for a credential
 * 
 * @param officialName - The exact text from NMC (e.g., "National - Ordinary Seafarer")
 * @param shortName - The abbreviated name (e.g., "OS")
 * @returns Display info with colloquial explanation
 */
export function getCredentialDisplayInfo(
  officialName: string,
  shortName: string
): CredentialDisplayInfo {
  // Map of short names to colloquial explanations
  const colloquialMap: Record<string, { name: string; description: string; icon: string }> = {
    
    // ========================================
    // NATIONAL - DECK RATINGS
    // ========================================
    'OS': {
      name: 'Ordinary Seaman',
      description: 'Entry-level deck rating. Can stand watch and assist with deck operations.',
      icon: '⚓'
    },
    'AB Unlimited': {
      name: 'Able-Bodied Seaman (Unlimited)',
      description: 'Qualified deck rating. Can steer the ship and perform all deck duties.',
      icon: '🎖️'
    },
    'AB Limited': {
      name: 'Able Seaman (Limited)',
      description: 'Able seaman with route or tonnage restrictions.',
      icon: '🎖️'
    },
    
    // ========================================
    // NATIONAL - DECK OFFICERS
    // ========================================
    '3rd Mate': {
      name: 'Third Mate',
      description: 'Junior deck officer. Stands navigational watch and assists senior officers.',
      icon: '👨‍✈️'
    },
    '2nd Mate Unlimited': {
      name: 'Second Mate (Unlimited)',
      description: 'Senior deck officer. Navigational watch officer and often the ship\'s navigator.',
      icon: '🧭'
    },
    'Chief Mate': {
      name: 'Chief Mate',
      description: 'Senior deck officer. Second-in-command, oversees cargo and deck operations.',
      icon: '👔'
    },
    'Master Unlimited': {
      name: 'Master (Captain)',
      description: 'Ship\'s captain. Has ultimate authority and responsibility for the vessel.',
      icon: '👨‍✈️'
    },
    
    // ========================================
    // NATIONAL - DECK ENDORSEMENTS
    // ========================================
    'Radar Observer': {
      name: 'Radar Observer',
      description: 'Qualified to use radar for navigation and collision avoidance.',
      icon: '📡'
    },
    'Tank Vessel-PIC DL': {
      name: 'Tank Vessel - Person in Charge (DL)',
      description: 'Authorized to supervise dangerous liquid cargo operations on tank vessels.',
      icon: '🛢️'
    },
    'Lifeboat Operator': {
      name: 'Lifeboatman',
      description: 'Qualified to operate survival craft and rescue boats.',
      icon: '🚣'
    },
    
    // ========================================
    // NATIONAL - ENGINE RATINGS
    // ========================================
    'Wiper': {
      name: 'Wiper',
      description: 'Entry-level engine rating. Maintains cleanliness and assists engineers.',
      icon: '🔧'
    },
    'QMED': {
      name: 'Qualified Member Engine Department',
      description: 'Qualified engine rating. Can stand watch and perform engine room duties.',
      icon: '⚙️'
    },
    'Oiler': {
      name: 'Oiler',
      description: 'Engine rating responsible for lubrication and maintenance.',
      icon: '🛢️'
    },
    
    // ========================================
    // NATIONAL - ENGINE OFFICERS
    // ========================================
    '3rd Engineer': {
      name: 'Third Assistant Engineer',
      description: 'Junior engine officer. Stands watch in engine room.',
      icon: '🔧'
    },
    '3rd Engineer Steam/Gas': {
      name: 'Third Engineer (Steam/Gas Turbine)',
      description: 'Junior engine officer qualified on steam or gas turbine vessels.',
      icon: '🔧'
    },
    '2nd Engineer': {
      name: 'Second Assistant Engineer',
      description: 'Senior engine officer. Oversees maintenance and repairs.',
      icon: '⚙️'
    },
    '1st Engineer': {
      name: 'First Assistant Engineer',
      description: 'Senior engine officer. Second-in-command of engine department.',
      icon: '🔩'
    },
    '1st Engineer Motor': {
      name: 'First Assistant Engineer (Motor)',
      description: 'Senior engine officer on motor-propelled vessels.',
      icon: '🔩'
    },
    'Chief Engineer': {
      name: 'Chief Engineer',
      description: 'Head of engine department. Responsible for all propulsion and machinery.',
      icon: '👨‍🔧'
    },
    'Chief Engineer Motor': {
      name: 'Chief Engineer (Motor Vessels)',
      description: 'Head of engine department on motor-propelled vessels.',
      icon: '👨‍🔧'
    },
    
    // ========================================
    // NATIONAL - OTHER DEPARTMENTS
    // ========================================
    'Steward (F.H.)': {
      name: 'Steward / Food Handler',
      description: 'Galley crew responsible for food service and preparation.',
      icon: '🍽️'
    },
    
    // ========================================
    // STCW - BASIC SAFETY (Required for all)
    // ========================================
    'Basic Training': {
      name: 'STCW Basic Training',
      description: 'Required safety training: firefighting, first aid, survival craft, personal safety.',
      icon: '🛟'
    },
    'Security Awareness': {
      name: 'Maritime Security Awareness',
      description: 'Basic security training required for all crew.',
      icon: '🔒'
    },
    
    // ========================================
    // STCW - ADVANCED TRAINING
    // ========================================
    'Advanced Firefighting': {
      name: 'Advanced Firefighting',
      description: 'Advanced fire prevention and firefighting techniques.',
      icon: '🧯'
    },
    'Medical First-Aid Provider': {
      name: 'Medical First-Aid',
      description: 'Trained to provide medical first-aid aboard ship.',
      icon: '🏥'
    },
    'PSC': {
      name: 'Proficiency in Survival Craft',
      description: 'Qualified to operate lifeboats and rescue boats (not fast rescue boats).',
      icon: '🚣'
    },
    'Fast Rescue Boats': {
      name: 'Fast Rescue Boat Operator',
      description: 'Qualified to operate fast rescue boats in emergencies.',
      icon: '🚤'
    },
    'Advanced Chemical Tanker': {
      name: 'Advanced Chemical Tanker Operations',
      description: 'Qualified to handle chemical cargo operations on tankers.',
      icon: '🧪'
    },
    'Advanced Oil Tanker': {
      name: 'Advanced Oil Tanker Operations',
      description: 'Qualified to handle petroleum cargo operations on tankers.',
      icon: '🛢️'
    },
    
    // ========================================
    // STCW - OFFICER COMPETENCIES
    // ========================================
    'OICNW': {
      name: 'Officer in Charge of a Navigational Watch',
      description: 'International certification for deck officers to stand watch.',
      icon: '🌍'
    },
    'OICEW': {
      name: 'Officer in Charge of an Engineering Watch',
      description: 'International certification for engine officers to stand watch.',
      icon: '🌍'
    },
    'Chief Engineer STCW': {
      name: 'STCW Chief Engineer',
      description: 'International certification for chief engineers (motor vessels).',
      icon: '🌍'
    },
    'Second Engineer STCW': {
      name: 'STCW Second Engineer',
      description: 'International certification for second engineers (motor vessels).',
      icon: '🌍'
    },
    
    // ========================================
    // STCW - RATING COMPETENCIES
    // ========================================
    'RFPNW': {
      name: 'Rating Forming Part of a Navigational Watch',
      description: 'International certification for deck ratings to stand watch.',
      icon: '🌍'
    },
    'RFPEW': {
      name: 'Rating Forming Part of an Engineering Watch',
      description: 'International certification for engine ratings to stand watch.',
      icon: '🌍'
    },
    'Able Seafarer - Deck': {
      name: 'STCW Able Seafarer - Deck',
      description: 'International certification for qualified deck ratings.',
      icon: '🌍'
    },
    'Able Seafarer - Engine': {
      name: 'STCW Able Seafarer - Engine',
      description: 'International certification for qualified engine ratings.',
      icon: '🌍'
    },
    
    // ========================================
    // STCW - SECURITY
    // ========================================
    'Designated Security Duties': {
      name: 'Designated Security Duties',
      description: 'Qualified to perform specific security tasks aboard ship.',
      icon: '🛡️'
    },
    'Vessel Security Officer': {
      name: 'Vessel Security Officer (VSO)',
      description: 'Responsible for ship security plan implementation.',
      icon: '👮'
    },
    
    // ========================================
    // STCW - COMMUNICATIONS
    // ========================================
    'GMDSS Operator': {
      name: 'GMDSS Radio Operator',
      description: 'Qualified to operate Global Maritime Distress and Safety System radio equipment.',
      icon: '📻'
    },
  };

  // Get colloquial info or use defaults
  const info = colloquialMap[shortName] || {
    name: shortName,
    description: 'Maritime credential',
    icon: '📜'
  };

  return {
    officialName,
    colloquialName: info.name,
    description: info.description,
    icon: info.icon,
  };
}

/**
 * Get icon for department
 */
export function getDepartmentIcon(department: string): string {
  switch (department) {
    case 'deck': return '🎖️';
    case 'engine': return '⚙️';
    case 'other': return '🍽️';
    case 'all': return '🌍';
    default: return '📜';
  }
}

/**
 * Get display name for department
 */
export function getDepartmentName(department: string): string {
  switch (department) {
    case 'deck': return 'Deck Department';
    case 'engine': return 'Engine Department';
    case 'other': return 'Other Departments';
    case 'all': return 'All Departments';
    default: return 'Unknown Department';
  }
}

/**
 * Get badge color for qualification level
 */
export function getQualificationBadgeColor(level: string): string {
  switch (level) {
    case 'entry': return 'bg-blue-50 text-blue-700 border-blue-200';
    case 'rating': return 'bg-green-50 text-green-700 border-green-200';
    case 'junior_officer': return 'bg-purple-50 text-purple-700 border-purple-200';
    case 'senior_officer': return 'bg-amber-50 text-amber-700 border-amber-200';
    default: return 'bg-gray-50 text-gray-700 border-gray-200';
  }
}

/**
 * Get display name for qualification level
 */
export function getQualificationLevelName(level: string): string {
  switch (level) {
    case 'entry': return 'Entry Level';
    case 'rating': return 'Qualified Rating';
    case 'junior_officer': return 'Junior Officer';
    case 'senior_officer': return 'Senior Officer';
    default: return level;
  }
}