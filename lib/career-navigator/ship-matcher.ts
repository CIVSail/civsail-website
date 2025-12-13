import { Ship, CredentialLevel, RouteType } from '@/types/career-navigator';

/**
 * Ship Matching Logic
 * Suggests ships that build qualifying time for a specific upgrade
 */

interface ShipMatchCriteria {
  min_grt: number;
  preferred_grt: number;  // Ideal GRT for unlimited tonnage
  route_categories: RouteType[];
  department: 'deck' | 'engine';  // For future engine support
}

/**
 * Get ship matching criteria for each credential upgrade
 */
function getShipCriteriaForCredential(credential: CredentialLevel): ShipMatchCriteria {
  // For deck unlimited officers, we want:
  // - Minimum 100 GRT (anything counts)
  // - Prefer 1600+ GRT (builds unlimited tonnage time)
  // - Ocean/NC/Great Lakes routes
  
  const deckCriteria: ShipMatchCriteria = {
    min_grt: 100,
    preferred_grt: 1600,
    route_categories: ['oceans', 'near_coastal', 'great_lakes'],
    department: 'deck',
  };

  switch (credential) {
    case 'second_mate':
    case 'chief_mate':
    case 'master':
      return deckCriteria;
    
    // Future: engine officers will have similar criteria
    case 'second_ae':
    case 'first_ae':
    case 'chief_engineer':
      return {
        ...deckCriteria,
        department: 'engine',
      };
    
    default:
      return deckCriteria;
  }
}

/**
 * Calculate a "quality score" for how well a ship matches upgrade needs
 * Higher score = better match
 */
function calculateShipScore(ship: Ship, criteria: ShipMatchCriteria): number {
  let score = 0;

  // GRT scoring (0-50 points)
  if (ship.grt) {
    if (ship.grt >= criteria.preferred_grt) {
      score += 50;  // Perfect - builds unlimited tonnage time
    } else if (ship.grt >= criteria.min_grt) {
      score += 25;  // Acceptable but limits tonnage credit
    }
  }
// will need to update this 
  // Route scoring (0-30 points)
  if (ship.route_category && criteria.route_categories.includes(ship.route_category)) {
    if (ship.route_category === 'oceans') {
      score += 30;  // Oceans is most versatile
    } else if (ship.route_category === 'near_coastal') {
      score += 25;  // Near Coastal is good
    } else {
      score += 20;  // Great Lakes/Inland
    }
  }

  // Operator preference (0-10 points)
  if (ship.operator === 'msc') {
    score += 10;  // MSC ships are reliable for mariners
  } else if (ship.operator === 'noaa') {
    score += 8;
  }

  // Tonnage band bonus (0-10 points)
  if (ship.tonnage_band === 'unlimited') {
    score += 10;
  }

  return score;
}

/**
 * Find ships that help build time toward a credential
 */
export function findQualifyingShips(
  allShips: Ship[],
  targetCredential: CredentialLevel,
  limit: number = 12
): Ship[] {
  const criteria = getShipCriteriaForCredential(targetCredential);

  // Filter ships that meet minimum criteria
  const qualifyingShips = allShips.filter(ship => {
    // Must meet GRT minimum
    if (!ship.grt || ship.grt < criteria.min_grt) return false;

    // Must operate on qualifying routes
    if (ship.route_category && !criteria.route_categories.includes(ship.route_category)) {
      return false;
    }

    return true;
  });

  // Score and sort ships
  const scoredShips = qualifyingShips.map(ship => ({
    ship,
    score: calculateShipScore(ship, criteria),
  }));

  scoredShips.sort((a, b) => b.score - a.score);

  // Return top N ships
  return scoredShips.slice(0, limit).map(s => s.ship);
}

/**
 * Group ships by class (for display purposes)
 */
export function groupShipsByClass(ships: Ship[]): Record<string, Ship[]> {
  const grouped: Record<string, Ship[]> = {};

  ships.forEach(ship => {
    if (!grouped[ship.class]) {
      grouped[ship.class] = [];
    }
    grouped[ship.class].push(ship);
  });

  return grouped;
}

/**
 * Get a human-readable description of what a ship helps with
 */
export function getShipHelpText(ship: Ship): string {
  const benefits: string[] = [];

  if (ship.grt && ship.grt >= 1600 && ship.route_category === 'oceans') {
    benefits.push('Builds unlimited tonnage time on ocean routes');
  } else if (ship.grt && ship.grt >= 1600) {
    benefits.push('Builds unlimited tonnage time');
  } else if (ship.grt && ship.grt >= 100) {
    benefits.push('Qualifying tonnage (may result in limited endorsement)');
  }

  if (ship.route_category === 'oceans') {
    benefits.push('Ocean route - most versatile for upgrades');
  } else if (ship.route_category === 'near_coastal') {
    benefits.push('Near Coastal route');
  }

  if (ship.operator === 'msc') {
    benefits.push('MSC operation - stable employment');
  }

  return benefits.join(' • ');
}