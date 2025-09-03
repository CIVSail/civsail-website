/*
===============================================================================
PORT PAGE TEMPLATE - SECTION 1: SETUP & CONFIGURATION
===============================================================================
This template creates a comprehensive port information page for CIVSail.com

INSTRUCTIONS FOR USE:
1. Copy this entire file to a new port folder: /app/ports/[region]/[country]/[port-name]/page.tsx
2. Follow the comments marked with "TODO:" to customize for your specific port
3. Replace ALL PLACEHOLDER DATA with actual port information
4. Test locally before deploying

REQUIRED SETUP:
- Mapbox API key in environment variables (NEXT_PUBLIC_MAPBOX_TOKEN)
- OpenWeatherMap API key in environment variables (NEXT_PUBLIC_OPENWEATHER_API_KEY)
- Exchange rate API (uses exchangerate-api.com - no key required)
===============================================================================
*/

'use client';

// =============================================================================
// GLOBAL WINDOW INTERFACE - DO NOT MODIFY
// =============================================================================
declare global {
  interface Window {
    scrollToSection?: (sectionId: string) => void;
  }
}

// =============================================================================
// IMPORTS - DO NOT MODIFY UNLESS ADDING NEW ICONS
// =============================================================================
import Link from 'next/link';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useState, useEffect, useRef } from 'react';
import {
  ChevronRight,
  MapPin,
  Users,
  DollarSign,
  Thermometer,
  Anchor,
  Ship,
  Utensils,
  Wine,
  Wifi,
  Car,
  AlertTriangle,
} from 'lucide-react';

// =============================================================================
// TYPESCRIPT INTERFACES - DO NOT MODIFY
// =============================================================================
interface QuickStat {
  icon: React.ReactNode;
  label: string;
  value: string;
}

interface Section {
  id: string;
  title: string;
  icon: React.ReactNode;
}

interface SpotData {
  id: number;
  name: string;
  type: string;
  description: string;
  highlights: string[];
  priceRange: string;
  location: string;
}

// =============================================================================
// PORT CONFIGURATION - CUSTOMIZE THIS SECTION
// =============================================================================

// TODO: Update these coordinates for your port's location
// Find coordinates using: https://www.latlong.net/
const PORT_COORDINATES = {
  LATITUDE: 33.1594,    // TODO: Replace with your port's latitude
  LONGITUDE: 129.7233,  // TODO: Replace with your port's longitude
  ZOOM_LEVEL: 14        // TODO: Adjust zoom (12=city, 14=detailed, 16=street level)
};

// TODO: Update port name and component name
// Component name should be: [PortName]PortPage (e.g., GuamPortPage, RodmanPortPage)
export default function SaseboPortPage() {  // TODO: Change "Sasebo" to your port name

// TODO: Update weather city name for API call
// Use the closest major city if your port is small
const WEATHER_CITY_NAME = 'Sasebo';  // TODO: Replace with your city name

// TODO: Update timezone for local time display
// Find timezone strings at: https://worldtimeapi.org/api/timezone
const TIMEZONE = 'Asia/Tokyo';  // TODO: Replace with your port's timezone

// =============================================================================
// BREADCRUMB CONFIGURATION - CUSTOMIZE THIS SECTION
// =============================================================================

// TODO: Update breadcrumb hierarchy for your port
// Structure: Ports > Region > Country > Port Name
const BREADCRUMB_CONFIG = {
  REGION: 'far-east',      // TODO: Update region slug (e.g., 'mediterranean', 'caribbean')
  REGION_NAME: 'Far East', // TODO: Update region display name
  COUNTRY: 'japan',        // TODO: Update country slug
  COUNTRY_NAME: 'Japan',   // TODO: Update country display name
  PORT_NAME: 'Sasebo'      // TODO: Update port display name
};

// =============================================================================
// HERO SECTION CONFIGURATION - CUSTOMIZE THIS SECTION
// =============================================================================

// TODO: Update hero content for your port
const HERO_CONFIG = {
  // TODO: Update badge text (e.g., "Commercial Port", "Naval Base", "Container Terminal")
  BADGE_TEXT: "Naval Base • 7th Fleet Hub",
  
  // TODO: Update main port name (should match folder name)
  PORT_TITLE: "Sasebo",
  
  // TODO: Write 2-3 sentence description highlighting what makes this port special
  DESCRIPTION: "One of the most efficient loading ports in the world, located in southern Japan. Known for its professional operations, vibrant nightlife, and incredible food scene.",
  
  // TODO: Update port type classification
  PORT_TYPE: "Military • Naval Base",
  
  // TODO: Update vessel types that commonly visit
  VESSEL_TYPES: "T-AKE, T-AO, Navy Vessels",
  
  // TODO: Update typical stay duration
  TYPICAL_STAY: "2-5 days"
};

// =============================================================================
// SECTION 2: RESTAURANT & NIGHTLIFE DATA - CUSTOMIZE ALL ARRAYS BELOW
// =============================================================================

/*
INSTRUCTIONS FOR DATA ARRAYS:
- Each array represents a category of places (food, bars, etc.)
- Add/remove items as needed - no minimum or maximum
- Keep the same object structure for each item
- Use consistent ID numbering (1, 2, 3, etc.) within each array
- Price ranges can be in local currency or USD - be consistent within each array
- Highlights should be 2-4 key features that make this place special
*/

// =============================================================================
// LOCAL SPOTS - Authentic local restaurants and unique dining experiences
// =============================================================================
// TODO: Replace with actual local restaurants and food spots
// Focus on: Authentic cuisine, local favorites, must-try experiences
// Remove this entire array if port has no notable local food scene

const localSpots: SpotData[] = [
  // EXAMPLE ENTRY - Copy this format for each restaurant:
  {
    id: 1,                                    // TODO: Increment for each entry (1, 2, 3...)
    name: 'Restaurant Name Here',             // TODO: Replace with actual restaurant name
    type: 'Cuisine Type',                     // TODO: Replace with type (e.g., 'Ramen Shop', 'Seafood', 'Italian')
    description: 'Brief description of what makes this place special and worth visiting for sailors.',  // TODO: 1-2 sentences max
    highlights: ['Key Feature 1', 'Key Feature 2', 'Key Feature 3'],  // TODO: 2-4 standout features
    priceRange: '¥800-1,500',                 // TODO: Replace with actual price range in local currency
    location: 'Area Description',             // TODO: Replace with location (e.g., 'Downtown', 'Near Base', '10-min walk')
  },
  
  // TODO: Copy the above structure for each local restaurant
  // TODO: Remove this comment block when adding real data
  
  // REAL DATA EXAMPLES (from Sasebo):
  {
    id: 1,
    name: 'DDD Ramen',
    type: 'Ramen Shop',
    description: 'Popular ramen spot with excellent gyoza. Great atmosphere and authentic Japanese flavors.',
    highlights: ['Tonkotsu Ramen', 'Gyoza', 'Local Favorite'],
    priceRange: '¥800-1,500',
    location: 'Off Ginza Street',
  },
  {
    id: 2,
    name: 'Kunimatsu Coffee',
    type: 'Coffee Shop',
    description: 'Must-visit coffee shop owned by sharply dressed Hiro. Look for the sailor statue out front.',
    highlights: ['Great Coffee', 'Friendly Owner', 'Sailor Statue'],
    priceRange: '¥300-800',
    location: 'Near Ginza',
  },
  // TODO: Replace above examples with your port's actual local spots
];

// =============================================================================
// TASTE OF HOME - American/familiar food options
// =============================================================================
// TODO: Replace with actual American/familiar restaurants
// Focus on: Chain restaurants, American food, familiar brands, comfort food
// Remove this array if port has no American/familiar dining options

const tasteOfHome: SpotData[] = [
  // EXAMPLE ENTRY - Copy this format for each restaurant:
  {
    id: 1,                                    // TODO: Increment for each entry (1, 2, 3...)
    name: 'Restaurant Name',                  // TODO: Replace with actual restaurant name
    type: 'American Restaurant',              // TODO: Replace with type (e.g., 'Fast Food', 'Chain Restaurant', 'American Bar')
    description: 'Description focusing on familiar American menu items and atmosphere.',  // TODO: Emphasize familiar aspects
    highlights: ['Familiar Menu', 'English Spoken', 'American Portions'],  // TODO: Focus on comfort/familiarity
    priceRange: '$10-20',                     // TODO: Use USD for American places, local currency otherwise
    location: 'Location Description',         // TODO: Location relative to port/base
  },
  
  // TODO: Copy above structure for each American/familiar restaurant
  // TODO: Remove this comment when adding real data
  
  // REAL DATA EXAMPLES (from Sasebo):
  {
    id: 1,
    name: "Chili's",
    type: 'American Restaurant',
    description: 'Familiar American chain restaurant on base. Standard menu with American comfort food.',
    highlights: ['American Menu', 'On Base', 'Familiar Food'],
    priceRange: '$10-20',
    location: 'On Base',
  },
  {
    id: 2,
    name: 'Starbucks',
    type: 'Coffee Chain',
    description: 'Located on main street. Popular Wi-Fi spot frequently visited by sailors.',
    highlights: ['Free Wi-Fi', 'Familiar Coffee', 'Central Location'],
    priceRange: '$3-8',
    location: 'Main Street',
  },
  // TODO: Replace above examples with your port's actual American/familiar spots
];

// =============================================================================
// HANGS AND DIVES - Relaxed bars and conversation spots
// =============================================================================
// TODO: Replace with actual low-key bars and relaxed hangout spots
// Focus on: Conversation-friendly, relaxed atmosphere, good for small groups
// Remove this array if port has limited bar scene

const hangsAndDives: SpotData[] = [
  // EXAMPLE ENTRY - Copy this format for each bar:
  {
    id: 1,                                    // TODO: Increment for each entry (1, 2, 3...)
    name: 'Bar Name',                         // TODO: Replace with actual bar name
    type: 'Bar Type',                         // TODO: Replace with type (e.g., 'Dive Bar', 'Wine Bar', 'Sports Bar')
    description: 'Description emphasizing relaxed atmosphere and why it\'s good for conversation.',  // TODO: Focus on atmosphere
    highlights: ['Good Conversation', 'Relaxed Vibe', 'Local Crowd'],  // TODO: Emphasize low-key aspects
    priceRange: '$3-10 per drink',            // TODO: Replace with actual drink prices
    location: 'Location Description',         // TODO: Location relative to port
  },
  
  // TODO: Copy above structure for each relaxed bar/hangout
  // TODO: Remove this comment when adding real data
  
  // REAL DATA EXAMPLES (from Sasebo):
  {
    id: 1,
    name: 'G-rock Bar',
    type: 'Sailor Bar',
    description: 'Popular sailor hangout in Sailor Town. Good for conversation and meeting other mariners.',
    highlights: ['Sailor Crowd', 'Good Conversation', 'Regular Hangout'],
    priceRange: '¥500-1,500',
    location: 'Sailor Town',
  },
  // TODO: Replace above example with your port's actual hang-out spots
];

// =============================================================================
// HIGHER ENERGY - High-energy nightlife spots
// =============================================================================
// TODO: Replace with actual nightclubs, karaoke, and high-energy venues
// Focus on: Dancing, karaoke, late-night venues, party atmosphere
// Remove this array if port has limited nightlife

const higherEnergy: SpotData[] = [
  // EXAMPLE ENTRY - Copy this format for each venue:
  {
    id: 1,                                    // TODO: Increment for each entry (1, 2, 3...)
    name: 'Venue Name',                       // TODO: Replace with actual venue name
    type: 'Venue Type',                       // TODO: Replace with type (e.g., 'Nightclub', 'Karaoke', 'Dance Club')
    description: 'Description emphasizing high-energy atmosphere and entertainment options.',  // TODO: Focus on energy/fun
    highlights: ['Dancing', 'Late Hours', 'High Energy'],  // TODO: Emphasize party aspects
    priceRange: '$15-30 cover',               // TODO: Replace with actual cover charges/drink prices
    location: 'Location Description',         // TODO: Location relative to port
  },
  
  // TODO: Copy above structure for each high-energy venue
  // TODO: Remove this comment when adding real data
  
  // REAL DATA EXAMPLES (from Sasebo):
  {
    id: 1,
    name: 'Snake Alley Karaoke',
    type: 'Filipino Karaoke',
    description: 'Literal alley with multiple Filipino karaoke bars. High energy and interactive.',
    highlights: ['Karaoke', 'Filipino Staff', 'Interactive'],
    priceRange: '¥800-2,000',
    location: 'Snake Alley',
  },
  // TODO: Replace above example with your port's actual nightlife spots
];

// =============================================================================
// DATA VALIDATION CHECKLIST
// =============================================================================
/*
Before deploying, verify:
□ All TODO comments have been addressed
□ All placeholder text has been replaced with real data
□ ID numbers are sequential within each array (1, 2, 3...)
□ Price ranges are consistent within each array (all USD or all local currency)
□ Highlights arrays have 2-4 items each
□ Descriptions are 1-2 sentences and under 150 characters
□ Location descriptions help sailors find the places
□ No empty arrays (remove entire array if no data available)
*/

// =============================================================================
// SECTION 3: MAP CONFIGURATION AND COORDINATES
// =============================================================================
// NOTE: This section must come AFTER the data arrays above because it references them

// =============================================================================
// ENHANCED DATA INTERFACE - ADD TO YOUR EXISTING SpotData INTERFACE
// =============================================================================
// TODO: Update your existing SpotData interface to include these new fields:
/*
interface SpotData {
  id: number;
  name: string;
  type: string;
  description: string;
  highlights: string[];
  priceRange: string;
  location: string;
  // NEW FIELDS FOR MAP AND POPUPS:
  coordinates?: [number, number];  // [longitude, latitude] - optional for places without exact coordinates
  detailedDescription?: string;    // Longer description for popup modal
  photos?: string[];              // Array of image URLs
  website?: string;               // Official website URL
  hours?: string;                 // Operating hours
  phoneNumber?: string;           // Contact number
  specialNotes?: string;          // Any special notes (dress code, reservations, etc.)
}
*/

// =============================================================================
// MAP CENTER AND BASE LOCATIONS
// =============================================================================
// TODO: Update these coordinates for your port's center point and key facilities
// Use https://www.latlong.net/ to find exact coordinates
// Remember: Mapbox uses [longitude, latitude] format (opposite of Google Maps)

const MAP_CONFIG = {
  // TODO: Center point of your port area
  CENTER_LONGITUDE: 129.7233,  // TODO: Replace with your port's center longitude
  CENTER_LATITUDE: 33.1594,    // TODO: Replace with your port's center latitude
  ZOOM_LEVEL: 14,              // TODO: Adjust zoom level (12=city view, 14=detailed, 16=street level)
  MAP_STYLE: 'mapbox://styles/mapbox/satellite-streets-v12', // TODO: Change if desired (satellite-streets-v12, streets-v11, outdoors-v11)
};

// =============================================================================
// BASE FACILITY LOCATIONS - Key infrastructure points
// =============================================================================
// TODO: Add coordinates for key port facilities (berths, gates, terminals, etc.)
// These appear as special markers on the map and help orient users

const baseFacilities = [
  // EXAMPLE ENTRIES - Replace with your port's actual facilities:
  {
    name: 'Main Port Facility',              // TODO: Replace with actual facility name
    coordinates: [129.7233, 33.1594] as [number, number], // TODO: Replace with actual coordinates
    type: 'port',                            // TODO: Use 'port', 'gate', 'terminal', 'berth', 'fuel'
    description: 'Primary port facility',    // TODO: Brief description of facility
    color: '#3b82f6',                       // TODO: Choose color (blue: #3b82f6, green: #10b981, red: #ef4444, orange: #f59e0b)
  },
  {
    name: 'Main Gate',                       // TODO: Replace with actual gate name
    coordinates: [129.71432, 33.16628] as [number, number], // TODO: Replace with actual coordinates
    type: 'gate',
    description: 'Primary entry/exit point for personnel',
    color: '#10b981',
  },
  // TODO: Add more facilities as needed (fuel depot, passenger terminal, etc.)
  // TODO: Remove this comment block when adding real data

  // REAL EXAMPLES (from Sasebo):
  {
    name: 'Sasebo Naval Base',
    coordinates: [129.7233, 33.1594] as [number, number],
    type: 'base',
    description: 'Primary port facility',
    color: '#3b82f6',
  },
  {
    name: 'Fleet Landing',
    coordinates: [129.71432, 33.16628] as [number, number],
    type: 'landing',
    description: 'Primary liberty launch drop-off point',
    color: '#10b981',
  },
  // TODO: Replace examples above with your port's actual facilities
];

// =============================================================================
// UPDATED DATA ARRAYS WITH COORDINATES
// =============================================================================
// TODO: Go back to your data arrays above and add coordinates to each entry
// Example of how to update your existing entries:

/*
BEFORE (your current format):
{
  id: 1,
  name: 'Restaurant Name',
  type: 'Restaurant Type',
  description: 'Description...',
  highlights: ['Feature 1', 'Feature 2'],
  priceRange: '$10-20',
  location: 'Downtown',
},

AFTER (add coordinates and optional fields):
{
  id: 1,
  name: 'Restaurant Name',
  type: 'Restaurant Type', 
  description: 'Description...',
  highlights: ['Feature 1', 'Feature 2'],
  priceRange: '$10-20',
  location: 'Downtown',
  coordinates: [longitude, latitude],              // TODO: Add exact coordinates
  detailedDescription: 'Extended description...',  // TODO: Optional - longer description for popup
  photos: ['url1.jpg', 'url2.jpg'],               // TODO: Optional - photo URLs
  website: 'https://restaurant-website.com',      // TODO: Optional - official website
  hours: 'Mon-Sat: 11:00-22:00, Sun: Closed',    // TODO: Optional - operating hours
  phoneNumber: '+1-555-123-4567',                 // TODO: Optional - phone number
  specialNotes: 'Reservations recommended',       // TODO: Optional - special notes
},
*/

// =============================================================================
// MAP COLOR SCHEME FOR CATEGORIES
// =============================================================================
// TODO: Assign colors to different venue types for map markers
// These colors will be used to differentiate restaurant/bar categories on the map

const MARKER_COLORS = {
  // Base facilities (defined above)
  base: '#3b82f6',      // Blue - port facilities
  gate: '#10b981',      // Green - entry points
  terminal: '#8b5cf6',  // Purple - terminals
  fuel: '#f59e0b',      // Orange - fuel facilities
  
  // Restaurant/bar categories (from your data arrays)
  localSpots: '#ef4444',     // Red - local authentic food
  tasteOfHome: '#f59e0b',    // Orange - American/familiar food  
  hangsAndDives: '#eab308',  // Yellow - relaxed bars
  higherEnergy: '#8b5cf6',   // Purple - nightclubs/karaoke
  
  // TODO: Add more colors if you have additional categories
  // Available colors: #3b82f6 (blue), #10b981 (green), #ef4444 (red), 
  //                  #f59e0b (orange), #eab308 (yellow), #8b5cf6 (purple),
  //                  #ec4899 (pink), #06b6d4 (cyan)
};

// =============================================================================
// COORDINATE GATHERING INSTRUCTIONS
// =============================================================================
/*
HOW TO GET COORDINATES FOR YOUR VENUES:

1. Go to https://www.latlong.net/
2. Search for the venue name or address
3. The result shows "Latitude, Longitude" 
4. For Mapbox, reverse the order to [Longitude, Latitude]

EXAMPLE:
- LatLong.net shows: "33.1594, 129.7233" 
- Use in your code as: [129.7233, 33.1594]

ALTERNATIVE METHODS:
- Right-click location in Google Maps → click coordinates that appear
- Use GPS coordinates from your phone when visiting the location
- Use approximate coordinates if exact location is uncertain

ACCURACY TIPS:
- Exact coordinates are best but not required for every venue
- For general areas, use approximate coordinates (like "downtown area")
- If you can't find coordinates, leave the coordinates field undefined
- The map will still work with some missing coordinate data
*/

// =============================================================================
// MAP POPUP CONTENT CONFIGURATION  
// =============================================================================
// TODO: Customize popup content for different venue types
// This determines what information appears when users click map markers

const POPUP_CONFIG = {
  // TODO: Choose which fields to show in map popups for each category
  localSpots: {
    showFields: ['name', 'type', 'description', 'priceRange', 'hours'],
    buttonText: 'View Food Section →',
    buttonAction: 'food'  // Which tab to open when clicked
  },
  tasteOfHome: {
    showFields: ['name', 'type', 'description', 'priceRange'],
    buttonText: 'View Food Section →', 
    buttonAction: 'food'
  },
  hangsAndDives: {
    showFields: ['name', 'type', 'description', 'priceRange', 'hours'],
    buttonText: 'View Nightlife →',
    buttonAction: 'nightlife'
  },
  higherEnergy: {
    showFields: ['name', 'type', 'description', 'priceRange'],
    buttonText: 'View Nightlife →',
    buttonAction: 'nightlife'
  },
  baseFacilities: {
    showFields: ['name', 'description'],
    buttonText: 'View Operations →',
    buttonAction: 'operations'
  }
};

// =============================================================================
// IMPLEMENTATION NOTES
// =============================================================================
/*
IMPORTANT: This section defines the data structure but the actual map rendering
happens in the component's useEffect hooks later in the file. 

The map will:
1. Use MAP_CONFIG to set center point and zoom
2. Add markers for all baseFacilities 
3. Add markers for all venues with coordinates from your data arrays
4. Color-code markers using MARKER_COLORS
5. Show popups with content defined in POPUP_CONFIG

TESTING YOUR MAP:
- Start with just a few venues with coordinates
- Test the map renders correctly
- Add more venues gradually
- Verify popup content appears correctly
- Check that popup buttons navigate to correct sections
*/