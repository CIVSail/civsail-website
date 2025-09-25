/*
===============================================================================
PORT PAGE TEMPLATE - COMPLETE IMPLEMENTATION GUIDE
===============================================================================

WHAT THIS TEMPLATE CREATES:
✓ Interactive map with colored venue markers  
✓ Clickable venue cards opening detailed modals
✓ Weather display and currency converter
✓ Responsive design with tabbed navigation

BEFORE YOU START - REQUIRED SETUP:
1. Environment Variables (add to .env.local):
   - NEXT_PUBLIC_MAPBOX_TOKEN="your_mapbox_token_here" 
   - NEXT_PUBLIC_OPENWEATHER_API_KEY="your_weather_key_here"

2. Folder Structure:
   - Create: /app/ports/[region]/[country]/[port-name]/page.tsx
   - Example: /app/ports/mediterranean/spain/rota/page.tsx

3. Parent Pages (must exist for breadcrumbs to work):
   - /app/ports/page.tsx (main ports index)
   - /app/ports/[region]/page.tsx (region page)
   - /app/ports/[region]/[country]/page.tsx (country page)

IMPLEMENTATION STEPS:
□ Step 1: Update all CONFIGURATION sections with your port's data
□ Step 2: Replace EXAMPLE data arrays with your venue information  
□ Step 3: Test map markers appear correctly
□ Step 4: Test modal popups work on venue cards
□ Step 5: Customize remaining sections (operations, transportation, etc.)

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
// IMPORTS - UPDATED WITH NEW MODAL ICONS
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
  X, // NEW: For modal close button
  Clock, // NEW: For hours display in modal
  Phone, // NEW: For phone numbers in modal
  Globe, // NEW: For website links in modal
  MapPinIcon, // NEW: For location info in modal
} from 'lucide-react';

// =============================================================================
// TYPESCRIPT INTERFACES - ENHANCED WITH NEW FIELDS
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

// ENHANCED: SpotData interface with new optional fields for modals and map
interface SpotData {
  id: number;
  name: string;
  type: string;
  description: string; // Short description for cards
  highlights: string[];
  priceRange: string;
  location: string;
  // NEW FIELDS FOR ENHANCED FUNCTIONALITY:
  coordinates?: [number, number]; // [longitude, latitude] for map markers
  detailedDescription?: string; // Longer description for modal popup
  photos?: string[]; // Array of image URLs (future use)
  website?: string; // Official website URL
  hours?: string; // Operating hours
  phoneNumber?: string; // Contact phone number
  specialNotes?: string; // Special notes (reservations, dress code, etc.)
}

// =============================================================================
// STEP 1: PORT LOCATION - REQUIRED CHANGES
// =============================================================================

/* 
WHAT TO DO: Replace these 3 numbers with your port's coordinates
HOW TO GET COORDINATES: 
1. Go to https://www.latlong.net/
2. Search for your port name
3. Copy the numbers (example: "40.4168, -3.7038" for Madrid)
4. IMPORTANT: Reverse the order - Mapbox needs [longitude, latitude]
*/

const PORT_COORDINATES = {
  LATITUDE: 13.41697, // REPLACE: Second number from latlong.net
  LONGITUDE: 144.664307, // REPLACE: First number from latlong.net
  ZOOM_LEVEL: 10, // KEEP: 14 works for most ports (12=city, 16=street)
};

// =============================================================================
// STEP 2: COMPONENT NAME - REQUIRED CHANGE
// =============================================================================

/*
WHAT TO DO: Change "Sasebo" to your port name in PascalCase
EXAMPLES: 
- Rota → RotaPortPage
- Guam → GuamPortPage  
- Norfolk → NorfolkPortPage
*/

export default function GuamPortPage() {
  // =============================================================================
  // STEP 3: WEATHER & TIME - COPY FROM STEP 1
  // =============================================================================

  /*
WHAT TO DO: Copy the same coordinates from PORT_COORDINATES above
TIMEZONE: Find your timezone at https://worldtimeapi.org/api/timezone
EXAMPLES:
- Spain: 'Europe/Madrid'
- Guam: 'Pacific/Guam'  
- East Coast US: 'America/New_York'
*/

  const WEATHER_CONFIG = {
    LATITUDE: 13.41697, // COPY: Same as PORT_COORDINATES.LATITUDE
    LONGITUDE: 144.664307, // COPY: Same as PORT_COORDINATES.LONGITUDE
    TIMEZONE: 'Pacific/Guam', // REPLACE: Your port's timezone
  };

  // =============================================================================
  // STEP 4: BREADCRUMB NAVIGATION - FILL IN THE BLANKS
  // =============================================================================

  /*
WHAT TO DO: Fill in your port's hierarchy for the navigation breadcrumbs
RESULT: Creates "Ports > europe > Spain > Rota" style navigation

REGIONS: Use these standard regions (or create your own):
- 'mediterranean', 'far-east', 'caribbean', 'atlantic', 'pacific'
- Display names: 'Mediterranean', 'Far East', 'Caribbean', 'Atlantic', 'Pacific'

COUNTRIES: Use lowercase with hyphens for multi-word countries
- Examples: 'spain', 'united-kingdom', 'south-korea', 'united-states'
*/

  const BREADCRUMB_CONFIG = {
    REGION: 'far-east', // REPLACE: Your region slug (lowercase, hyphens)
    REGION_NAME: 'Far East', // REPLACE: Your region display name (Title Case)
    COUNTRY: 'Guam', // REPLACE: Your country slug (lowercase, hyphens)
    COUNTRY_NAME: 'Guam', // REPLACE: Your country display name (Title Case)
    PORT_NAME: 'Guam Naval Base', // REPLACE: Your port display name (Title Case)
  };

  // =============================================================================
  // STEP 5: HERO SECTION - YOUR PORT'S "ELEVATOR PITCH"
  // =============================================================================

  /*
WHAT TO DO: Write a compelling 2-3 sentence description of your port
THINK: What makes this port special? What should sailors know?
EXAMPLES:
- "Strategic Mediterranean port with rich history and vibrant nightlife"
- "Modern container terminal gateway to Asia with excellent shore facilities"
- "Historic naval base featuring world-class dining and cultural attractions"
*/

  const HERO_CONFIG = {
    BADGE_TEXT: 'Naval Base • 7th Fleet Hub', // REPLACE: Port type (e.g., "Commercial Port", "Container Terminal")
    PORT_TITLE: 'Guam', // REPLACE: Same as BREADCRUMB_CONFIG.PORT_NAME

    // REPLACE: Write your port's compelling description (2-3 sentences max)
    DESCRIPTION:
      'Guam is a tropical U.S. territory in the Pacific, ringed by clear blue water and a laid-back island vibe where “island time” runs the show. It’s a common Far East port visit for MSC crews, but beyond the beaches it’s also a critical submarine base and strategic hub for the Navy. Mariners quickly learn Guam blends paradise with purpose — equal parts liberty port and frontline outpost.',

    // REPLACE: These appear in the stats boxes on the hero section
    PORT_TYPE: 'Military • Naval Base', // What kind of port? (Military, Commercial, Container, etc.)
    VESSEL_TYPES: 'T-AKE, T-AO, Navy Vessels, CONMAR Vessels', // What ships visit? (Container ships, Navy vessels, Cruise ships, etc.)
    TYPICAL_STAY: '2-5 days', // How long do ships usually stay?
  };

  // =============================================================================
  // STEP 6: MAP MARKER COLORS - USUALLY KEEP AS-IS
  // =============================================================================

  /*
WHAT TO DO: Usually nothing - these colors work well for most ports
ONLY CHANGE IF: You have specific branding colors or color preferences

COLOR MEANINGS:
- Red markers = Local authentic restaurants  
- Orange markers = American/familiar food
- Yellow markers = Relaxed bars
- Purple markers = High-energy nightlife
- Blue/Green markers = Port facilities
*/

  const MARKER_COLORS = {
    // Port infrastructure (keep these)
    base: '#3b82f6', // Blue - main port facilities
    landing: '#10b981', // Green - gates and landing points

    // Venue categories (change colors if desired)
    localSpots: '#ef4444', // Red - authentic local food
    tasteOfHome: '#f59e0b', // Orange - American/familiar food
    hangsAndDives: '#eab308', // Yellow - chill bars
    higherEnergy: '#8b5cf6', // Purple - nightclubs/karaoke
  };

  // =============================================================================
  // COMPONENT STATE - DO NOT MODIFY
  // =============================================================================
  const [activeSection, setActiveSection] = useState('overview');
  const [weatherData, setWeatherData] = useState({ temp: '--', time: '--:--' });
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [usdAmount, setUsdAmount] = useState('');
  const [yenAmount, setYenAmount] = useState('');
  const [exchangeRate, setExchangeRate] = useState(0);
  const [localSpotsIndex, setLocalSpotsIndex] = useState(0);
  const [tasteOfHomeIndex, setTasteOfHomeIndex] = useState(0);
  const [hangsIndex, setHangsIndex] = useState(0);
  const [highEnergyIndex, setHighEnergyIndex] = useState(0);

  // NEW: Modal state for venue popups
  const [selectedVenue, setSelectedVenue] = useState<SpotData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // =============================================================================
  // MODAL FUNCTIONS - DO NOT MODIFY
  // =============================================================================
  // NEW: Functions to handle modal open/close
  const openModal = (venue: SpotData) => {
    setSelectedVenue(venue);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedVenue(null);
  };
  // =============================================================================

  // =============================================================================
  // STEP 7: PORT INFRASTRUCTURE - ADD YOUR KEY FACILITIES
  // =============================================================================

  /*
WHAT ARE BASE FACILITIES?
These are the main port infrastructure points (NOT restaurants or bars):
- Main port/terminal buildings
- Gates and entry points  
- Fuel depots
- Passenger terminals
- Liberty launch points
- Security checkpoints

THESE APPEAR AS BLUE/GREEN MARKERS on the map to help orient users

HOW TO ADD FACILITIES:
1. Copy the template below for each facility
2. Get coordinates from https://www.latlong.net/
3. Choose the right 'type' and 'color' from the options below
*/

  const baseFacilities = [
    // TEMPLATE - Copy this structure for each facility:
    // {
    //   name: 'Your Facility Name',                    // What sailors will see
    //   coordinates: [longitude, latitude],            // From latlong.net (reverse order!)
    //   type: 'base',                                  // Pick from types below
    //   description: 'Brief description of facility', // One sentence explaining what it is
    //   color: '#3b82f6',                             // Pick from colors below
    // },

    // EXAMPLE FACILITIES (replace with your port's actual facilities):
    {
      name: 'Apra Outer Harbor',
      coordinates: [144.64819, 13.4528] as [number, number], // REPLACE with your coordinates 13.45280° N, 144.64819° E
      type: 'base',
      description: 'Large ship berthing area', // REPLACE with your description
      color: '#8b5cf6',
    },
    {
      name: 'Apra Inner Harbor',
      coordinates: [144.66759, 13.43265] as [number, number], // REPLACE with your coordinates 13.43265° N, 144.66759° E
      type: 'base',
      description: 'Main berthing area', // REPLACE with your description
      color: '#8b5cf6',
    },
    {
      name: 'Kilo Pier',
      coordinates: [144.63039, 13.44607] as [number, number], // REPLACE with your coordinates
      type: 'Ammo Pier',
      description: 'Ammo Pier', // REPLACE with your description
      color: '#8b5cf6',
    },
    {
      name: 'Gab Gab Beach',
      coordinates: [144.64131, 13.44175] as [number, number], // REPLACE with your coordinates
      type: 'liberty location',
      description: 'Beach with grills and swimming area', // REPLACE with your description
      color: '#3b82f6',
    },
    {
      name: 'Naval Base Guam Main Gate',
      coordinates: [144.67447, 13.41998] as [number, number], // REPLACE with your coordinates 13.41998, 144.67447
      type: 'Gate',
      description: 'Main Gate', // REPLACE with your description
      color: '#10b981',
    },
    // ADD MORE FACILITIES: Copy the template above for each additional facility 13.41998° N, 144.67447° E
  ];

  /*
FACILITY TYPES (choose the best match):
- 'base' = Main buildings, terminals, headquarters
- 'landing' = Gates, entry points, launch points
- 'fuel' = Fuel depots, bunker facilities
- 'terminal' = Passenger terminals, cargo terminals

FACILITY COLORS (match the type):
- '#3b82f6' (blue) = Main facilities, buildings
- '#10b981' (green) = Gates, entry points
- '#f59e0b' (orange) = Fuel and service areas
- '#8b5cf6' (purple) = Passenger/special terminals

COMMON FACILITIES TO INCLUDE:
✓ Main gate/security checkpoint
✓ Port administration building  
✓ Fuel depot (if applicable)
✓ Liberty launch points (for naval ports)
✓ Passenger terminal (if applicable)
✓ Cargo terminal (if applicable)

DELETE THESE EXAMPLES when you add your real facilities
*/

  // =============================================================================
  // STEP 8: VENUE DATA - THE HEART OF YOUR PORT PAGE
  // =============================================================================

  /*
OVERVIEW - WHAT ARE THESE ARRAYS?
Each array is a category of places sailors can visit:
- localSpots = Authentic local restaurants (RED markers on map)
- tasteOfHome = American/familiar food (ORANGE markers on map)  
- hangsAndDives = Relaxed bars for conversation (YELLOW markers on map)
- higherEnergy = Nightclubs, karaoke, party spots (PURPLE markers on map)

IMPORTANT: You can have empty arrays! If your port has no nightlife, just leave those arrays empty.

HOW COORDINATES WORK:
1. Go to https://www.latlong.net/
2. Search for the restaurant/bar name or address
3. You'll see something like "33.1594, 129.7233"
4. REVERSE THE ORDER: [129.7233, 33.1594] (longitude first for Mapbox)
5. If you can't find exact coordinates, estimate or leave undefined
*/

  // =============================================================================
  // LOCAL SPOTS ARRAY - Authentic local restaurants and unique dining
  // =============================================================================

  /*
WHAT GOES HERE: Local restaurants that show off your port's culture
EXAMPLES: Ramen shops in Japan, tapas bars in Spain, fish markets in Portugal
SKIP IF: Your port has no notable local food scene

FIELD GUIDE:
- name: The restaurant's actual name
- type: What kind of food (e.g., "Ramen Shop", "Seafood Restaurant", "Local Cafe")  
- description: 1-2 sentences for the venue card
- highlights: 2-4 key things that make it special
- priceRange: Use local currency (¥800-1,500, €15-25, $10-20)
- location: Where it is relative to the port ("Downtown", "5-min walk", "Near gate")
- coordinates: [longitude, latitude] from latlong.net
- detailedDescription: Longer text for the popup modal (2-4 sentences)
- hours: When it's open ("Daily: 11:00-23:00")
- specialNotes: Important info ("Cash only", "English menu", "Reservations needed")
*/

  const localSpots: SpotData[] = [
    // TEMPLATE - Copy this for each local restaurant:
    {
      id: 1, // Always start with 1, then 2, 3, etc.
      name: 'Lorwills Barbeque', // REPLACE: Actual restaurant name
      type: 'Shack', // REPLACE: e.g., "Italian Restaurant", "Seafood"
      description: 'Fillipino food and BBQ.',
      highlights: ['BBQ', 'Chicken', 'Local', 'Good Value'],
      priceRange: '$15-30', // REPLACE: Local currency and actual prices
      location: '20-25 min from base in Dededo', // REPLACE: "Downtown", "10-min walk", etc.
      coordinates: [144.84537, 13.51426], // REPLACE: From latlong.net (longitude first!)
      detailedDescription:
        'A small side of the road stand in front of the Guam Home Center that serves Fillipino food and BBQ.',
      hours: '08:00-21:00, Varies', // REPLACE: Actual operating hours
      specialNotes: 'The chicken and beef skewers are fantastic', // REPLACE: Important notes
    },
    {
      id: 2, // Always start with 1, then 2, 3, etc.
      name: 'Chamorro Village', // REPLACE: Actual restaurant name
      type: 'Community Event', // REPLACE: e.g., "Italian Restaurant", "Seafood"
      description: 'Weekly market with local food and shops.',
      highlights: [
        'Local Stalls',
        'Souvenirs',
        'Good Food',
        'Cultural Atmosphere',
      ],
      priceRange: '$5-50', // REPLACE: Local currency and actual prices
      location: 'Hagatna', // REPLACE: "Downtown", "10-min walk", etc.
      coordinates: [144.75277, 13.47777], // REPLACE: From latlong.net (longitude first!)
      detailedDescription:
        'Community market with local food and shops. A great place to try local dishes and meet locals.',
      hours: 'Wednesday Evenings', // REPLACE: Actual operating hours
      specialNotes: 'Something everyone should check out at least once', // REPLACE: Important notes
    },
    {
      id: 3, // Always start with 1, then 2, 3, etc.
      name: 'Gab Gab Beach', // REPLACE: Actual restaurant name
      type: 'Beach', // REPLACE: e.g., "Italian Restaurant", "Seafood"
      description: 'An on base beach with grills and swimming area.',
      highlights: ['Clear Water', 'Snorkeling', 'Scuba', 'Restrooms'],
      priceRange: 'Free', // REPLACE: Local currency and actual prices
      location: 'On base by Kilo Pier', // REPLACE: "Downtown", "10-min walk", etc.
      coordinates: [144.64131, 13.44175], // REPLACE: From latlong.net (longitude first!)
      detailedDescription:
        'A great place to swim and barbeque on base. Bring your own food and drinks.',
      hours: 'Daylight Hours. Sometimes closed due to ships at Kilo Pier', // REPLACE: Actual operating hours
      specialNotes: 'Ships will often host cookouts/parties here', // REPLACE: Important notes
    },
    // ADD MORE RESTAURANTS: Copy the template above for each local spot
    // DELETE THIS COMMENT when you add real restaurants
  ];

  // =============================================================================
  // TASTE OF HOME ARRAY - American/familiar food options
  // =============================================================================

  /*
WHAT GOES HERE: Familiar chain restaurants, American food, English-speaking places
EXAMPLES: McDonald's, Subway, local places with American menus
SKIP IF: Your port has no familiar food options (many smaller ports don't)
*/

  const tasteOfHome: SpotData[] = [
    // TEMPLATE - Copy this for each familiar restaurant:
    {
      id: 1,
      name: 'Mosas Joint', // REPLACE: e.g., "McDonald's", "Local American Diner"
      type: 'American Restaurant', // REPLACE: "Fast Food", "Chain Restaurant", "American Diner"
      description: 'Burger joint with familiar American fare.',
      highlights: [
        'Burgers',
        'Familiar Food',
        'American Portions',
        'Credit Cards',
      ],
      priceRange: '$15-25', // Use USD for American chains, local currency otherwise
      location: '10 min from base', // Where is it relative to port?
      coordinates: [144.74819, 13.47687], // From latlong.net
      detailedDescription:
        'A good modern American burger joint with a variety of options. They also have a full bar.',
      hours: '11:00-21:00',
      specialNotes:
        'A good place to get dinner and return to the ship, or start a night out.',
    },
    {
      id: 2,
      name: 'NEX Food Court', // REPLACE: e.g., "McDonald's", "Local American Diner"
      type: 'Food Court', // REPLACE: "Fast Food", "Chain Restaurant", "American Diner"
      description: 'Familiar food and mall type food court.',
      highlights: ['Fast Food', 'Familiar Food', 'American Portions'],
      priceRange: '$10-20', // Use USD for American chains, local currency otherwise
      location: 'Inside the NEX', // Where is it relative to port?
      coordinates: [144.66405, 13.41393], // From latlong.net
      detailedDescription:
        'The NEX food court has a variety of familiar options including Panda Express, Del Taco and other familiar brands.',
      hours: '09:00-20:00',
      specialNotes: 'WiFi available.',
    },

    // ADD MORE: Copy template for each familiar restaurant
    // LEAVE EMPTY: If your port has no American/familiar options, just use: []
  ];

  // =============================================================================
  // HANGS AND DIVES ARRAY - Relaxed bars and conversation spots
  // =============================================================================

  /*
WHAT GOES HERE: Low-key bars good for conversation, local pubs, quiet spots
FOCUS ON: Places to relax, chat, meet locals or other sailors
SKIP IF: Your port has limited bar scene or only high-energy venues
*/

  const hangsAndDives: SpotData[] = [
    // TEMPLATE - Copy for each relaxed bar:
    {
      id: 1,
      name: 'Laddas',
      type: 'Local Dive', // "Dive Bar", "Wine Bar", "Local Pub", "Sailor Bar"
      description: 'Small local bar with some serious pool players.',
      highlights: [
        'Good Conversation',
        'Local Crowd',
        'Reasonable Prices',
        'Pool Table',
      ],
      priceRange: '$3-8 per drink', // Local currency, per drink pricing
      location: '5-10 minutes from base',
      coordinates: [144.73903, 13.47783],
      detailedDescription:
        'A good old fashioned local dive bbar. You never know who you might meet here.',
      hours: 'Daily: 15:00-02:00',
      specialNotes: 'This place has had many names in the past.',
    },
    {
      id: 2,
      name: 'Beach Bar',
      type: 'Beach Bar', // "Dive Bar", "Wine Bar", "Local Pub", "Sailor Bar"
      description: 'Relaxed atmosphere perfect for conversation and group.',
      highlights: ['Great View', 'On Beach', 'More Expensive', 'Sunset Spot'],
      priceRange: '$7-12 per drink', // Local currency, per drink pricing
      location: 'End of Tumon Bay',
      coordinates: [144.80388, 13.5243],
      detailedDescription:
        'Fantastic place to watch the sunset on the ocean with some drinks.',
      hours: 'Daily: 12:00-23:45',
      specialNotes:
        'Need a car or taxi to get here. Remember that for leaving!',
    },
    {
      id: 3,
      name: 'Shamrocks',
      type: 'Irish Pub', // "Dive Bar", "Wine Bar", "Local Pub", "Sailor Bar"
      description: 'Traditional Irish pub. Exactly what you would expect.',
      highlights: [
        'Good Selection',
        'Local Crowd',
        'Reasonable Prices',
        'Friendly Staff',
      ],
      priceRange: '$4-8 per drink', // Local currency, per drink pricing
      location: 'Tumon Bay',
      coordinates: [144.80644, 13.51156],
      detailedDescription: 'A great place to start or end your night out.',
      hours: 'Daily: 18:00-02:00',
      specialNotes:
        'Likely to be a mixed crowd of locals and sailors and military.',
    },
    {
      id: 4,
      name: 'Green Lizard',
      type: 'Local Bar', // "Dive Bar", "Wine Bar", "Local Pub", "Sailor Bar"
      description:
        'Relaxed atmosphere perfect for conversation and meeting people.',
      highlights: ['Multi Level', 'Beer Pong', 'Outdoor Seating'],
      priceRange: '$€4-8 per drink', // Local currency, per drink pricing
      location: 'Tumon Bay',
      coordinates: [144.8065, 13.51243],
      detailedDescription:
        'If you call Guam frequently, it is a nice change of pace from the usual bars.',
      hours: 'Daily: 19:00-02:00',
      specialNotes: 'Sometimes has live music, DJs or other promotions.',
    },

    // LEAVE EMPTY IF: Your port has no relaxed bar scene, use: []
  ];

  // =============================================================================
  // HIGHER ENERGY ARRAY - Nightclubs, karaoke, party venues
  // =============================================================================

  /*
WHAT GOES HERE: Dance clubs, karaoke bars, late-night party spots
FOCUS ON: High energy, entertainment, dancing, late hours
SKIP IF: Your port has quiet nightlife or early closing times
*/

  const higherEnergy: SpotData[] = [
    // TEMPLATE - Copy for each party venue:
    {
      id: 1,
      name: 'Porkys',
      type: 'Bar with Music', // "Nightclub", "Karaoke Bar", "Dance Club"
      description: 'High-energy venue with music themes and house rules',
      highlights: ['Dancing', 'Late Hours', 'DJ Music', 'Pool Table'],
      priceRange: '$$$', // Include cover charges if applicable
      location: 'Tumon Bay',
      coordinates: [144.80632, 13.51124],
      detailedDescription: 'Local bar with different music themes each night.',
      hours: 'Thu-Sat: 22:00-05:00', // Many clubs have limited days
      specialNotes: 'Ring the bell if you dare',
    },
    {
      id: 2,
      name: 'Club USA',
      type: 'Strip Club', // "Nightclub", "Karaoke Bar", "Dance Club"
      description: 'Adult Entertainment',
      highlights: ['Dancers', 'Expensive', 'Club', 'Be Respectful'],
      priceRange: '$$$$ cover + drinks', // Include cover charges if applicable
      location: 'Tumon Bay',
      coordinates: [144.80696, 13.51727],
      detailedDescription:
        'Popular Guam strip club. Expect to buy expensive drinks and tip well.',
      hours: '19:00-02:30', // Many clubs have limited days
      specialNotes:
        'One of the local/military/sailor favorites.If you have been to Guam, you have likely heard of this place.',
    },
    {
      id: 3,
      name: 'Foxys',
      type: 'Strip Club', // "Nightclub", "Karaoke Bar", "Dance Club"
      description: 'Adult Entertainment',
      highlights: ['Dancers', 'Expensive', 'Club', 'Act Accodingly'],
      priceRange: '$$$$ cover + drinks', // Include cover charges if applicable
      location: 'Tumon Bay',
      coordinates: [144.80778, 13.51844],
      detailedDescription:
        'Popular Guam strip club. Expect to buy expensive drinks and tip well.',
      hours: '19:00-02:00', // Many clubs have limited days
      specialNotes:
        'One of the local/military/sailor favorites.If you have been to Guam, you have likely heard of this place.',
    },
    // LEAVE EMPTY IF: Your port has quiet nightlife, use: []
  ];

  // =============================================================================
  // DATA VALIDATION CHECKLIST
  // =============================================================================
  /*
Before deploying, verify each array:
□ All TODO comments have been addressed and removed
□ All placeholder text replaced with real venue data
□ ID numbers are sequential within each array (1, 2, 3...)
□ Coordinates are in [longitude, latitude] format
□ Coordinates tested on map (zoom to Overview section to check)
□ Price ranges are consistent within each array
□ Highlights arrays have 2-4 items each
□ Descriptions are concise (1-2 sentences for description field)
□ DetailedDescriptions are informative (2-4 sentences)
□ Hours format is clear and readable
□ Phone numbers include country codes
□ Website URLs include https://
□ No empty arrays (remove entire array if no venues available for category)

TESTING YOUR DATA:
1. Save and run locally
2. Click Overview tab and check map markers appear
3. Click on map markers to test popups
4. Navigate to Food/Nightlife tabs
5. Click venue cards to test modal popups
6. Verify all information displays correctly in modals
*/

  // =============================================================================
  // SECTION 3: MAP & MODAL IMPLEMENTATION - CRITICAL FUNCTIONALITY
  // =============================================================================

  /*
IMPLEMENTATION ORDER - FOLLOW THIS SEQUENCE:
This section must come AFTER Section 1 (setup) and Section 2 (data arrays) because:
1. It references the venue data arrays defined in Section 2
2. It uses the configuration constants from Section 1
3. It requires the modal state variables from Section 1

WHAT THIS SECTION INCLUDES:
- Enhanced map useEffect that creates colored markers from venue data
- Modal component JSX for venue detail popups
- Weather and currency exchange functionality
- Carousel navigation helpers
- All the functional hooks that make the page interactive
*/

  // =============================================================================
  // STEP 9: AUTOMATIC FUNCTIONS - MOSTLY COPY/PASTE WITH SMALL CHANGES
  // =============================================================================

  /*
WHAT ARE THESE? 
These are React functions that automatically:
- Fetch weather data for your port
- Create map markers from your venue data  
- Handle currency conversion
- Make the interactive features work

MOST OF THIS CODE: Copy exactly as-is
ONLY CHANGE: A few specific values marked clearly below
*/

  // =============================================================================
  // WEATHER & TIME FETCHING - CHANGE ONLY THE FALLBACK VALUES
  // =============================================================================

  /*
WHAT THIS DOES: Automatically fetches current weather and local time for your port
WHAT TO CHANGE: Only the fallback temperature on line marked "CHANGE THIS"
LEAVE EVERYTHING ELSE: The coordinates come from WEATHER_CONFIG you set earlier
*/

  useEffect(() => {
    // Format the current time in the port’s timezone (no external API needed)
    const computeLocalTime = () =>
      new Date().toLocaleTimeString('en-US', {
        timeZone: WEATHER_CONFIG.TIMEZONE,
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
      });

    // Fetch temperature from OpenWeather
    const fetchWeather = async () => {
      try {
        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${WEATHER_CONFIG.LATITUDE}&lon=${WEATHER_CONFIG.LONGITUDE}&appid=${process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY}&units=imperial`
        );
        if (!res.ok) throw new Error(`Weather fetch failed: ${res.status}`);

        const data = await res.json();
        const temp =
          typeof data?.main?.temp === 'number'
            ? Math.round(data.main.temp).toString()
            : '—';

        setWeatherData({ temp, time: computeLocalTime() });
      } catch (err) {
        console.error('Error fetching weather:', err);
        // Show time anyway; keep a reasonable temp fallback
        setWeatherData({ temp: '75', time: computeLocalTime() });
      }
    };

    // Initial paint
    setWeatherData((prev) => ({ ...prev, time: computeLocalTime() }));
    fetchWeather();

    // Keep time fresh every minute
    const timeInterval = setInterval(() => {
      setWeatherData((prev) => ({ ...prev, time: computeLocalTime() }));
    }, 60_000);

    // Refresh weather every 10 minutes
    const weatherInterval = setInterval(fetchWeather, 600_000);

    return () => {
      clearInterval(timeInterval);
      clearInterval(weatherInterval);
    };
  }, []);

  // =============================================================================
  // MAP CREATION - COPY EXACTLY AS-IS (DON'T CHANGE ANYTHING)
  // =============================================================================

  /*
WHAT THIS DOES: 
- Creates the interactive map using your PORT_COORDINATES
- Automatically adds colored markers for all your venues
- Creates popups when users click markers

DO NOT CHANGE ANYTHING in this section - it automatically uses:
- PORT_COORDINATES from Step 1
- baseFacilities from Step 7  
- All your venue arrays from Step 8
- MARKER_COLORS from Step 6
*/

  useEffect(() => {
    if (map.current) return;
    if (!mapContainer.current) return;

    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/satellite-streets-v12',
      center: [PORT_COORDINATES.LONGITUDE, PORT_COORDINATES.LATITUDE],
      zoom: PORT_COORDINATES.ZOOM_LEVEL,
    });

    // Add base facility markers (port infrastructure)
    baseFacilities.forEach((facility) => {
      const popupHTML = `
      <div class="p-2">
        <h3 class="font-semibold text-gray-900 mb-1">${facility.name}</h3>
        <p class="text-gray-600 text-sm mb-2">${facility.description}</p>
        <button 
          onclick="window.scrollToSection && window.scrollToSection('operations')"
          class="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          View Operations →
        </button>
      </div>
    `;

      new mapboxgl.Marker({
        color: facility.color,
        scale: 0.9,
      })
        .setLngLat(facility.coordinates)
        .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(popupHTML))
        .addTo(map.current!);
    });

    // AUTOMATED VENUE MARKERS
    const allVenues = [
      ...localSpots.map((v) => ({ ...v, category: 'localSpots' })),
      ...tasteOfHome.map((v) => ({ ...v, category: 'tasteOfHome' })),
      ...hangsAndDives.map((v) => ({ ...v, category: 'hangsAndDives' })),
      ...higherEnergy.map((v) => ({ ...v, category: 'higherEnergy' })),
    ];

    allVenues.forEach((venue) => {
      if (!venue.coordinates) return;

      const popupHTML = `
      <div class="p-2">
        <h3 class="font-semibold text-gray-900 mb-1">${venue.name}</h3>
        <p class="text-sm text-gray-600 mb-1">${venue.type}</p>
        <p class="text-gray-600 text-sm mb-2">${venue.description}</p>
        <div class="flex justify-between items-center">
          <span class="text-green-600 font-medium text-sm">${
            venue.priceRange
          }</span>
          <button 
            onclick="window.scrollToSection && window.scrollToSection('${
              venue.category === 'localSpots' ||
              venue.category === 'tasteOfHome'
                ? 'food'
                : 'nightlife'
            }')"
            class="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            View ${
              venue.category === 'localSpots' ||
              venue.category === 'tasteOfHome'
                ? 'Food'
                : 'Nightlife'
            } →
          </button>
        </div>
      </div>
    `;

      new mapboxgl.Marker({
        color: MARKER_COLORS[venue.category as keyof typeof MARKER_COLORS],
        scale: 0.7,
      })
        .setLngLat(venue.coordinates)
        .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(popupHTML))
        .addTo(map.current!);
    });
  }, []);

  // Map resize handler - SEPARATE useEffect
  useEffect(() => {
    if (map.current && activeSection === 'overview') {
      setTimeout(() => {
        map.current?.resize();
      }, 100);
    }
  }, [activeSection]);

  // =============================================================================
  // CURRENCY CONVERTER - CUSTOMIZE FOR YOUR PORT'S CURRENCY
  // =============================================================================

  /*
WHAT THIS DOES: Creates a live currency converter on your port page
COMMON SETUPS:
- USD ↔ Euro (Mediterranean ports)
- USD ↔ Yen (Japan/Asia ports)  
- USD ↔ Pound (UK ports)
- USD ↔ Won (South Korea)
- Skip entirely (US ports)

WHAT TO CHANGE:
1. Currency code in the API call
2. Fallback exchange rate
3. Function names 
4. Display labels in the JSX section
*/

  // =============================================================================
  // STEP A: EXCHANGE RATE FETCHING - UPDATE CURRENCY CODE
  // =============================================================================

  useEffect(() => {
    const fetchExchangeRate = async () => {
      try {
        // DON'T CHANGE: The API URL base
        const response = await fetch(
          'https://api.exchangerate-api.com/v4/latest/USD'
        );
        const data = await response.json();

        // CHANGE THIS: Replace 'JPY' with your currency code
        setExchangeRate(data.rates.JPY); // CHANGE: JPY → EUR, GBP, KRW, etc.
      } catch (error) {
        console.error('Error fetching exchange rate:', error);
        // CHANGE THIS: Set reasonable fallback rate for your currency
        setExchangeRate(130); // CHANGE: 130 yen → 0.85 euro, 0.80 pound, 1350 won, etc.
      }
    };

    fetchExchangeRate();
    const interval = setInterval(fetchExchangeRate, 3600000); // Updates hourly
    return () => clearInterval(interval);
  }, []);

  // =============================================================================
  // STEP B: CONVERSION FUNCTIONS - UPDATE NAMES AND CURRENCY
  // =============================================================================

  /*
WHAT TO CHANGE: Function names and currency references
EXAMPLES:
- Japan: convertUsdToYen / convertYenToUsd
- Spain: convertUsdToEuro / convertEuroToUsd  
- UK: convertUsdToPound / convertPoundToUsd
*/

  // CHANGE THESE: Update function names for your currency
  const convertUsdToYen = (usd: string) => {
    // CHANGE: "Yen" → "Euro", "Pound", etc.
    if (!usd || !exchangeRate) return '';
    const usdValue = parseFloat(usd);
    if (isNaN(usdValue)) return '';
    return (usdValue * exchangeRate).toLocaleString('en-US', {
      maximumFractionDigits: 0, // CHANGE: 0 for yen/won, 2 for euro/pound
    });
  };

  const convertYenToUsd = (yen: string) => {
    // CHANGE: "Yen" → your currency name
    if (!yen || !exchangeRate) return '';
    const yenValue = parseFloat(yen.replace(/,/g, '')); // CHANGE: "yenValue" → your currency
    if (isNaN(yenValue)) return '';
    return (yenValue / exchangeRate).toFixed(2);
  };

  // =============================================================================
  // COMMON CURRENCY EXAMPLES - COPY THE RIGHT ONE
  // =============================================================================

  /*
EURO EXAMPLE (Spain, Italy, France, etc.):
setExchangeRate(data.rates.EUR);
setExchangeRate(0.85); // fallback
const convertUsdToEuro = (usd: string) => {
  // ... same logic, maximumFractionDigits: 2
};
const convertEuroToUsd = (euro: string) => {
  const euroValue = parseFloat(euro.replace(/,/g, ''));
  // ... rest same
};

POUND EXAMPLE (UK):
setExchangeRate(data.rates.GBP);
setExchangeRate(0.80); // fallback  
const convertUsdToPound = (usd: string) => {
  // ... same logic, maximumFractionDigits: 2
};
const convertPoundToUsd = (pound: string) => {
  // ... rest same
};

WON EXAMPLE (South Korea):
setExchangeRate(data.rates.KRW);
setExchangeRate(1350); // fallback
const convertUsdToWon = (usd: string) => {
  // ... same logic, maximumFractionDigits: 0
};
const convertWonToUsd = (won: string) => {
  // ... rest same
};

US PORTS - SKIP CURRENCY CONVERTER:
If your port is in the US, you can remove the entire currency converter 
section from both the JavaScript and the JSX display parts.
*/

  // =============================================================================
  // STEP C: QUICK STATS DISPLAY - USUALLY LEAVE AS-IS
  // =============================================================================

  /*
WHAT THIS DOES: Creates the stat boxes in the hero section
USUALLY CHANGE: Nothing - it automatically uses your HERO_CONFIG values
ONLY CHANGE: Temperature unit (°F to °C) if your region uses Celsius
*/

  const quickStats: QuickStat[] = [
    {
      icon: <Anchor className="w-5 h-5" />,
      label: 'Port Type',
      value: HERO_CONFIG.PORT_TYPE, // Uses your config automatically
    },
    {
      icon: <Ship className="w-5 h-5" />,
      label: 'Vessel Types',
      value: HERO_CONFIG.VESSEL_TYPES, // Uses your config automatically
    },
    {
      icon: <Users className="w-5 h-5" />,
      label: 'Typical Stay',
      value: HERO_CONFIG.TYPICAL_STAY, // Uses your config automatically
    },
    {
      icon: <Thermometer className="w-5 h-5" />,
      label: 'Weather & Time',
      value: `${weatherData.temp}°F • ${weatherData.time}`, // CHANGE: °F to °C if needed
    },
  ];

  // =============================================================================
  // NAVIGATION SECTIONS - CUSTOMIZE SECTION NAMES IF NEEDED
  // =============================================================================

  // TODO: Update section titles/icons if you want different navigation
  const sections: Section[] = [
    { id: 'overview', title: 'Overview', icon: <MapPin className="w-5 h-5" /> },
    {
      id: 'operations',
      title: 'Port Operations',
      icon: <Ship className="w-5 h-5" />,
    },
    {
      id: 'food',
      title: 'Food & Attractions',
      icon: <Utensils className="w-5 h-5" />,
    },
    {
      id: 'nightlife',
      title: 'Bars & Nightlife',
      icon: <Wine className="w-5 h-5" />,
    },
    {
      id: 'transportation',
      title: 'Transportation',
      icon: <Car className="w-5 h-5" />,
    },
    {
      id: 'safety',
      title: 'Safety & Tips',
      icon: <AlertTriangle className="w-5 h-5" />,
    },
  ];

  // =============================================================================
  // SCROLL TO SECTION HANDLER - DO NOT MODIFY
  // =============================================================================

  // Global scroll handler for map popup buttons
  useEffect(() => {
    window.scrollToSection = (sectionId: string) => {
      setActiveSection(sectionId);
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
    };

    return () => {
      delete window.scrollToSection;
    };
  }, []);

  /*
===============================================================================
PORT PAGE TEMPLATE - MODAL AND HERO SECTION
===============================================================================

CRITICAL: This section contains the modal popup and hero section JSX.
The modal should NEVER be modified - it's a complex interactive component.
The hero section has specific areas marked for customization.

WHAT'S IN THIS FILE:
1. Modal popup (DO NOT MODIFY - copy exactly as written)
2. Hero section (MODIFY marked areas only)

FOR BEGINNERS: 
- Comments starting with "DO NOT MODIFY" mean copy exactly
- Comments starting with "TODO" mean you must change these
- Everything else can stay as-is
===============================================================================
*/

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      {/* =================================================================== */}
      {/* MODAL POPUP COMPONENT - DO NOT MODIFY ANYTHING IN THIS SECTION */}
      {/* =================================================================== */}
      {/* 
    WHAT THIS DOES: Creates a detailed popup when users click venue cards
    WHY DON'T MODIFY: This is a complex React component with state management
    HOW IT WORKS: Uses selectedVenue data from your venue arrays automatically
    DEPENDENCIES: Requires modal state variables from JavaScript section
    */}

      {/* DO NOT MODIFY: Modal visibility logic */}
      {isModalOpen && selectedVenue && (
        /* DO NOT MODIFY: Modal backdrop and positioning */
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          {/* DO NOT MODIFY: Modal container with scrolling */}
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* DO NOT MODIFY: Modal header with close button */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center">
              {/* DO NOT MODIFY: Venue name display */}
              <h2 className="text-2xl font-bold text-gray-900">
                {selectedVenue.name}
              </h2>

              {/* DO NOT MODIFY: Close button functionality */}
              <button
                onClick={closeModal}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* DO NOT MODIFY: Modal content body */}
            <div className="p-6">
              {/* DO NOT MODIFY: Type and price tags */}
              <div className="mb-4">
                <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  {selectedVenue.type}
                </span>
                <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium ml-2">
                  {selectedVenue.priceRange}
                </span>
              </div>

              {/* DO NOT MODIFY: Detailed description display */}
              {selectedVenue.detailedDescription && (
                <p className="text-gray-700 mb-6 leading-relaxed">
                  {selectedVenue.detailedDescription}
                </p>
              )}

              {/* DO NOT MODIFY: Two-column layout for highlights and contact info */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* DO NOT MODIFY: Left column - highlights list */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">
                    Highlights
                  </h3>
                  <ul className="space-y-2">
                    {selectedVenue.highlights.map((highlight, idx) => (
                      <li key={idx} className="flex items-center text-gray-700">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                        {highlight}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* DO NOT MODIFY: Right column - contact information */}
                <div className="space-y-4">
                  {/* DO NOT MODIFY: Operating hours display */}
                  {selectedVenue.hours && (
                    <div className="flex items-start">
                      <Clock className="w-5 h-5 text-gray-500 mr-3 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-900">Hours</p>
                        <p className="text-gray-700">{selectedVenue.hours}</p>
                      </div>
                    </div>
                  )}

                  {/* DO NOT MODIFY: Phone number display */}
                  {selectedVenue.phoneNumber && (
                    <div className="flex items-center">
                      <Phone className="w-5 h-5 text-gray-500 mr-3" />
                      <div>
                        <p className="font-medium text-gray-900">Phone</p>
                        <p className="text-gray-700">
                          {selectedVenue.phoneNumber}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* DO NOT MODIFY: Website link display */}
                  {selectedVenue.website && (
                    <div className="flex items-center">
                      <Globe className="w-5 h-5 text-gray-500 mr-3" />
                      <div>
                        <p className="font-medium text-gray-900">Website</p>
                        <a
                          href={selectedVenue.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800"
                        >
                          {selectedVenue.website}
                        </a>
                      </div>
                    </div>
                  )}

                  {/* DO NOT MODIFY: Location information display */}
                  <div className="flex items-start">
                    <MapPinIcon className="w-5 h-5 text-gray-500 mr-3 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">Location</p>
                      <p className="text-gray-700">{selectedVenue.location}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* DO NOT MODIFY: Special notes section */}
              {selectedVenue.specialNotes && (
                <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="font-medium text-yellow-800 mb-1">
                    Special Notes
                  </p>
                  <p className="text-yellow-700">
                    {selectedVenue.specialNotes}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* HERO SECTION - MAIN HEADER WITH PORT INFO AND NAVIGATION */}
      {/* =================================================================== */}
      {/* 
    WHAT THIS DOES: Creates the main header with port name and navigation
    WHAT TO CUSTOMIZE: Breadcrumb links, port content, stats
    WHAT NOT TO CHANGE: Layout structure, styling classes
    */}

      {/* DO NOT MODIFY: Hero container and background */}
      <div className="relative overflow-hidden">
        {/* DO NOT MODIFY: Background gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20" />

        {/* DO NOT MODIFY: Container with responsive padding */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* MODIFY THIS: Breadcrumb Navigation */}
          {/* TODO: Update these links to match your folder structure */}
          {/* EXAMPLE: /app/ports/[region]/[country]/[port-name]/page.tsx */}
          <div className="flex items-center text-white/70 text-sm mb-8">
            {/* DO NOT MODIFY: Home link structure, but verify /ports page exists */}
            <Link href="/ports" className="hover:text-white transition-colors">
              Ports
            </Link>
            <ChevronRight className="w-4 h-4 mx-2" />

            {/* TODO: Update region slug to match your folder name */}
            {/* EXAMPLES: mediterranean, far-east, caribbean, atlantic */}
            <Link
              href={`/ports/${BREADCRUMB_CONFIG.REGION}`}
              className="hover:text-white transition-colors"
            >
              {/* DO NOT MODIFY: Uses BREADCRUMB_CONFIG.REGION_NAME from JavaScript section */}
              {BREADCRUMB_CONFIG.REGION_NAME}
            </Link>
            <ChevronRight className="w-4 h-4 mx-2" />

            {/* TODO: Update country slug to match your folder name */}
            {/* EXAMPLES: spain, japan, united-kingdom, united-states */}
            <Link
              href={`/ports/${BREADCRUMB_CONFIG.REGION}/${BREADCRUMB_CONFIG.COUNTRY}`}
              className="hover:text-white transition-colors"
            >
              {/* DO NOT MODIFY: Uses BREADCRUMB_CONFIG.COUNTRY_NAME from JavaScript section */}
              {BREADCRUMB_CONFIG.COUNTRY_NAME}
            </Link>
            <ChevronRight className="w-4 h-4 mx-2" />

            {/* DO NOT MODIFY: Current port name display */}
            <span className="text-white">{BREADCRUMB_CONFIG.PORT_NAME}</span>
          </div>

          {/* DO NOT MODIFY: Main hero content grid layout */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Port Information */}
            <div>
              {/* Port Type Badge */}
              {/* DO NOT MODIFY: Badge structure and styling */}
              <div className="inline-flex items-center bg-blue-500/20 text-blue-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Anchor className="w-4 h-4 mr-2" />
                {/* TODO: Update in HERO_CONFIG.BADGE_TEXT in JavaScript section */}
                {/* EXAMPLES: "Naval Base • 7th Fleet Hub", "Commercial Port • Container Terminal" */}
                {HERO_CONFIG.BADGE_TEXT}
              </div>

              {/* Port Name - Main Heading */}
              {/* DO NOT MODIFY: Heading structure and responsive sizing */}
              <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6">
                {/* TODO: Update in HERO_CONFIG.PORT_TITLE in JavaScript section */}
                {HERO_CONFIG.PORT_TITLE}
              </h1>

              {/* Port Description */}
              {/* DO NOT MODIFY: Paragraph styling and spacing */}
              <p className="text-xl text-white/80 leading-relaxed mb-8">
                {/* TODO: Update in HERO_CONFIG.DESCRIPTION in JavaScript section */}
                {/* EXAMPLE: "Strategic Mediterranean port with rich history and vibrant nightlife" */}
                {HERO_CONFIG.DESCRIPTION}
              </p>

              {/* Quick Stats Grid */}
              {/* DO NOT MODIFY: Grid layout and card structure */}
              <div className="grid grid-cols-2 gap-4">
                {/* DO NOT MODIFY: This maps over quickStats array from JavaScript section */}
                {quickStats.map((stat, index) => (
                  <div
                    key={index}
                    className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4"
                  >
                    {/* DO NOT MODIFY: Stat header with icon and label */}
                    <div className="flex items-center text-blue-300 mb-2">
                      {stat.icon}
                      <span className="ml-2 text-sm font-medium">
                        {stat.label}
                      </span>
                    </div>
                    {/* DO NOT MODIFY: Stat value display */}
                    <div className="text-white font-semibold">{stat.value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column - Navigation Menu */}
            {/* DO NOT MODIFY: This entire navigation menu */}
            <div className="lg:pl-8">
              <div className="bg-white/5 backdrop-blur-lg border border-white/20 rounded-2xl p-6">
                <h3 className="text-white font-semibold mb-4 text-lg">
                  Port Information
                </h3>

                {/* DO NOT MODIFY: Navigation menu structure */}
                <nav className="space-y-2">
                  {/* DO NOT MODIFY: This maps over sections array from JavaScript */}
                  {sections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-center p-3 rounded-xl transition-all duration-300 ${
                        activeSection === section.id
                          ? 'bg-blue-500/30 text-white border border-blue-400/50'
                          : 'text-white/70 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {section.icon}
                      <span className="ml-3 font-medium">{section.title}</span>
                      <ChevronRight className="w-4 h-4 ml-auto" />
                    </button>
                  ))}
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =================================================================== */}
      {/* END OF HERO SECTION */}
      {/* Next: Main content container with all tabbed sections */}
      {/* =================================================================== */}

      {/*
===============================================================================
SUMMARY OF WHAT YOU NEED TO CHANGE:

1. BREADCRUMB_CONFIG in JavaScript section:
   - REGION: 'your-region-slug' 
   - REGION_NAME: 'Your Region Name'
   - COUNTRY: 'your-country-slug'
   - COUNTRY_NAME: 'Your Country Name' 
   - PORT_NAME: 'Your Port Name'

2. HERO_CONFIG in JavaScript section:
   - BADGE_TEXT: "Port Type • Description"
   - PORT_TITLE: "Your Port Name"
   - DESCRIPTION: "2-3 sentences about your port"

3. Verify folder structure matches breadcrumb links:
   - /app/ports/page.tsx (main ports page)
   - /app/ports/[region]/page.tsx (your region page)
   - /app/ports/[region]/[country]/page.tsx (your country page)
   - /app/ports/[region]/[country]/[port]/page.tsx (this page)

TESTING CHECKLIST:
□ Modal opens when clicking venue cards
□ Breadcrumb links work (pages exist)
□ Hero content displays your port info
□ Navigation menu switches sections
□ Quick stats show current weather/time
===============================================================================
*/
      /*
===============================================================================
PORT PAGE TEMPLATE - MAIN CONTENT CONTAINER & OVERVIEW SECTION
===============================================================================

This section contains:
1. Main content container (DO NOT MODIFY)
2. Overview section with map (CUSTOMIZE marked areas)
3. Currency converter (CUSTOMIZE currency type)
4. Know Before You Go section (CUSTOMIZE content)

Key concepts for beginners:
- {activeSection === 'overview' && (...)} means "only show this when Overview tab is selected"
- ref={mapContainer} creates the map - DO NOT MODIFY
- TODO comments show what to change
===============================================================================
*/}

      {/* =================================================================== */}
      {/* MAIN CONTENT CONTAINER - DO NOT MODIFY THIS WRAPPER */}
      {/* =================================================================== */}
      {/* 
    WHAT THIS DOES: Creates the main container for all tabbed sections
    WHY DON'T MODIFY: Handles responsive design and consistent spacing
    DEPENDENCIES: None - this is the wrapper for everything else
    */}

      {/* DO NOT MODIFY: Main content container with responsive padding */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* DO NOT MODIFY: Content card with backdrop blur effect */}
        <div className="bg-white/5 backdrop-blur-lg border border-white/20 rounded-2xl p-8 lg:p-12">
          {/* =============================================================== */}
          {/* OVERVIEW SECTION - CUSTOMIZE CONTENT IN MARKED AREAS */}
          {/* =============================================================== */}
          {/* 
        WHAT THIS DOES: Shows when user clicks "Overview" in navigation
        INCLUDES: Interactive map, port highlights, currency converter
        CUSTOMIZE: Port descriptions, highlights, weather info
        */}

          {/* DO NOT MODIFY: Section visibility logic */}
          {activeSection === 'overview' && (
            /* DO NOT MODIFY: Section spacing container */
            <div className="space-y-8">
              {/* DO NOT MODIFY: Section header structure */}
              <div className="flex items-center mb-8">
                <MapPin className="w-8 h-8 text-blue-400 mr-4" />
                <h2 className="text-3xl font-bold text-white">Port Overview</h2>
              </div>

              {/* =================================================================== */}
              {/* INTERACTIVE MAP CONTAINER - DO NOT MODIFY */}
              {/* =================================================================== */}
              {/* 
            CRITICAL: This creates the map with colored markers
            DO NOT CHANGE: Any part of this map container
            HOW IT WORKS: JavaScript automatically adds markers from your venue data
            COLORS: Red=local food, Orange=familiar food, Yellow=bars, Purple=nightlife
            */}

              {/* DO NOT MODIFY: Map card container */}
              <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-4">
                  Interactive Port Map
                </h3>

                {/* DO NOT MODIFY: Map container - this is where the map appears */}
                <div
                  ref={mapContainer}
                  className="w-full h-64 rounded-lg"
                  style={{ minHeight: '300px' }}
                />

                {/* DO NOT MODIFY: Map help text */}
                <p className="text-white/60 text-sm mt-2">
                  Click markers for details • Colored by venue type • Click
                  buttons to navigate sections
                </p>
              </div>

              {/* =================================================================== */}
              {/* PORT DESCRIPTION - CUSTOMIZE THIS CONTENT */}
              {/* =================================================================== */}
              {/* 
            TODO: Replace placeholder text with your port's actual information
            STRUCTURE: Description paragraph + two information cards
            */}

              {/* DO NOT MODIFY: Prose container styling */}
              <div className="prose prose-invert max-w-none">
                {/* TODO: Replace this entire paragraph with your port's description */}
                <p className="text-lg text-white/80 leading-relaxed">
                  {/* EXAMPLE: "Sasebo, Japan, affectionately known as 'Sas-Vegas'..." */}
                  Hafa Adai! Guam is a tropical U.S. territory in the western
                  Pacific and a critical hub for Navy and MSC operations. The
                  island blends strategic importance with island-time charm,
                  clear water, warm weather and Chamorro culture. For mariners,
                  Guam serves as both a vital logistics base and a laid-back
                  port call where you have many of the amenities of mainland US
                  in the Far East.
                </p>

                {/* Port Information Cards - Two Column Layout */}
                {/* DO NOT MODIFY: Grid layout structure */}
                <div className="grid md:grid-cols-2 gap-8 mt-8">
                  {/* =================================================================== */}
                  {/* LEFT CARD: PORT HIGHLIGHTS - CUSTOMIZE CONTENT */}
                  {/* =================================================================== */}

                  {/* DO NOT MODIFY: Card container styling */}
                  <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl p-6 border border-white/10">
                    <h3 className="text-xl font-semibold text-white mb-4">
                      Port Highlights
                    </h3>

                    {/* TODO: Replace these highlights with your port's key features */}
                    {/* DO NOT MODIFY: List structure and bullet styling */}
                    <ul className="space-y-3 text-white/80">
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        {/* TODO: Replace with actual highlight */}
                        World class SCUBA diving and snorkeling
                      </li>
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        {/* TODO: Replace with actual highlight */}
                        Compact island—most attractions within a short drive
                      </li>
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        {/* TODO: Replace with actual highlight */}
                        Mix of U.S. conveniences and Chamorro culture
                      </li>
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        {/* TODO: Replace with actual highlight */}
                        Operations are done on "Island Time"
                      </li>
                    </ul>
                  </div>

                  {/* =================================================================== */}
                  {/* RIGHT CARD: QUICK FACTS - CUSTOMIZE CONTENT */}
                  {/* =================================================================== */}

                  {/* DO NOT MODIFY: Card container styling */}
                  <div className="bg-gradient-to-br from-green-500/20 to-teal-500/20 rounded-xl p-6 border border-white/10">
                    <h3 className="text-xl font-semibold text-white mb-4">
                      Quick Facts
                    </h3>

                    {/* TODO: Replace these facts with your port's characteristics */}
                    {/* DO NOT MODIFY: List structure and bullet styling */}
                    <ul className="space-y-3 text-white/80">
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-green-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        {/* TODO: Replace with actual fact */}
                        English widely spoken, Chamorro is the local language
                      </li>
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-green-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        {/* TODO: Replace with actual fact */}
                        Base is well equipped with a large NEX and Commissary
                      </li>
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-green-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        {/* TODO: Replace with actual fact */}
                        Tropical climate year-round, hot and humid with rainy
                        season (Jun–Nov)
                      </li>
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-green-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        {/* TODO: Replace with actual fact */}
                        Strong military security and port infrastructure
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Currency Information Card - USD Territory */}
              <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-4">
                  Currency Information
                </h3>

                <div className="flex items-center mb-4">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mr-4">
                    <span className="text-2xl">💵</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white">
                      US Dollar (USD)
                    </h4>
                    <p className="text-white/80">
                      Official currency - US Territory
                    </p>
                  </div>
                </div>

                <div className="bg-white/10 rounded-lg p-4">
                  <h5 className="font-semibold text-white mb-3">
                    What to Know About Costs
                  </h5>
                  <ul className="space-y-2 text-white/80 text-sm">
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span>
                        Prices are generally 15-25% higher than mainland US due
                        to shipping costs
                      </span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span>
                        Credit cards widely accepted at most establishments
                      </span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span>
                        ATMs available on base and in town with standard US
                        banking
                      </span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span>
                        Tipping customs follow standard US practices (15-20%)
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="mt-4 p-3 bg-blue-500/20 rounded-lg border border-blue-400/30">
                  <p className="text-blue-300 text-sm">
                    <strong>Budget Tip:</strong> Expect mainland US prices plus
                    shipping premium. Base commissary and NEX offer more
                    familiar pricing.
                  </p>
                </div>
              </div>

              {/* =================================================================== */}
              {/* KNOW BEFORE YOU GO SECTION - CUSTOMIZE ALL CONTENT */}
              {/* =================================================================== */}
              {/* 
            TODO: Update weather info and eSIM details for your region
            STRUCTURE: Weather seasons + connectivity options
            */}

              {/* DO NOT MODIFY: Section card container */}
              <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-6">
                  Know Before You Go
                </h3>

                {/* DO NOT MODIFY: Two-column grid layout */}
                <div className="grid md:grid-cols-2 gap-8">
                  {/* =================================================================== */}
                  {/* LEFT COLUMN: WEATHER & PACKING - CUSTOMIZE ALL CONTENT */}
                  {/* =================================================================== */}

                  <div>
                    <h4 className="text-lg font-semibold text-white mb-4">
                      Weather & What to Pack
                    </h4>

                    {/* TODO: Update all seasons and weather info for your location */}
                    {/* DO NOT MODIFY: Card structure and spacing */}
                    <div className="space-y-3 text-white/80">
                      {/* Season 1 - TODO: Customize */}
                      <div className="bg-white/10 rounded-lg p-4">
                        <h5 className="font-medium text-white mb-2">
                          {/* TODO: Update season and months */}
                          Dry Season (Dec-May)
                        </h5>
                        <p className="text-sm">
                          {/* TODO: Update weather description and packing advice */}
                          Less humid, 75-85°F. Breeze provides relief. Pack
                          lightweight clothes, light jacket for evening,
                          comfortable walking shoes. Best weather for outdoor
                          activities.
                        </p>
                      </div>

                      {/* Season 2 - TODO: Customize */}
                      <div className="bg-white/10 rounded-lg p-4">
                        <h5 className="font-medium text-white mb-2">
                          {/* TODO: Update season and months */}
                          Wet Season (Jun-Nov)
                        </h5>
                        <p className="text-sm">
                          {/* TODO: Update weather description and packing advice */}
                          Hot & humid 80-90°F, frequent rain showers. Pack
                          quick-dry clothes, umbrella, rain jacket. Typhoon
                          season peaks Aug-Oct. Check weather before outdoor
                          plans.
                        </p>
                      </div>

                      {/* Season 3 - TODO: Customize */}
                      <div className="bg-white/10 rounded-lg p-4">
                        <h5 className="font-medium text-white mb-2">
                          {/* TODO: Update season and months */}
                          Year-Round Essentials
                        </h5>
                        <p className="text-sm">
                          {/* TODO: Update weather description and packing advice */}
                          Tropical climate 75-90°F. Always pack: sunscreen, hat,
                          sunglasses, breathable fabrics, and insect repellent.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* =================================================================== */}
                  {/* RIGHT COLUMN: CONNECTIVITY - CUSTOMIZE REGION INFO */}
                  {/* =================================================================== */}

                  <div>
                    <h4 className="text-lg font-semibold text-white mb-4">
                      Stay Connected
                    </h4>

                    {/* eSIM Promotion Card - DO NOT MODIFY STRUCTURE */}
                    <div className="bg-white/10 rounded-lg p-4 mb-4">
                      <p className="text-white/80 text-sm mb-4">
                        {/* TODO: Update with region-specific eSIM pricing */}
                        Despite being a US territory, most mainland US phone
                        plans do NOT work in Guam without expensive
                        international roaming charges. Local SIM cards or eSIMs
                        are your best option for data. Use code "CIVMAR10" for
                        10% off your Airalo eSIM purchase!
                      </p>

                      {/* DO NOT MODIFY: eSIM button link */}
                      <a
                        href="https://airalo.pxf.io/QjrLzP"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                      >
                        {/* TODO: Update region name */}
                        Get Guam eSIM →
                      </a>
                    </div>

                    {/* Recommended Plans - TODO: CUSTOMIZE PLANS AND PRICING */}
                    <div className="space-y-2">
                      <h5 className="font-medium text-white">
                        Recommended Plans:
                      </h5>
                      <ul className="space-y-2 text-sm text-white/70">
                        {/* TODO: Update with actual regional eSIM plans and pricing */}
                        <li>
                          • <strong>Guam 7 Days:</strong> 4 Days Unlimited for
                          $9.00
                        </li>
                        <li>
                          • <strong>Guam 14 Days:</strong> 15 Days Unlimited for
                          $31.00
                        </li>
                        <li>
                          • <strong>Guam:</strong> 30 Days Unlimited for $43.50
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =================================================================== */}
          {/* END OF OVERVIEW SECTION */}
          {/* Next section will be Food & Dining with venue carousels */}
          {/* =================================================================== */}

          {/*
===============================================================================
WHAT YOU NEED TO CUSTOMIZE IN THIS SECTION:

1. PORT DESCRIPTION (around line 85):
   - Replace placeholder text with 2-3 sentences about your port

2. PORT HIGHLIGHTS (around line 95):
   - Replace 4 bullet points with your port's key features
   - Keep structure, just change text content

3. QUICK FACTS (around line 125):
   - Replace 4 bullet points with practical info about your port
   - Examples: language, transport, payment, facilities

4. CURRENCY CONVERTER (around line 155):
   - Update currency name in label
   - Update conversion function names
   - Update currency symbol in rate display

5. WEATHER SECTIONS (around line 195):
   - Update season names and months for your climate
   - Update temperature ranges and packing advice

6. eSIM INFORMATION (around line 260):
   - Update region name in text and button
   - Update pricing for your region's eSIM plans

TESTING CHECKLIST:
□ Map displays with venue markers from your data arrays
□ Currency converter works with your local currency
□ All text content reflects your specific port
□ Weather advice matches your port's climate
□ eSIM link and pricing match your region
===============================================================================
*/
          /*
===============================================================================
PORT PAGE TEMPLATE - OPERATIONS SECTION
===============================================================================

This section covers port operations information that sailors need to know:
1. Typical operations and vessel types
2. Pier locations and berth assignments  
3. Liberty launch information
4. Port facilities and services

Key for beginners:
- {activeSection === 'operations' && (...)} means "only show when Operations tab selected"
- This section is mostly text content - easier to customize than interactive components
- Focus on practical information sailors need for port operations
===============================================================================
*/}

          {/* =============================================================== */}
          {/* OPERATIONS SECTION - CUSTOMIZE ALL CONTENT */}
          {/* =============================================================== */}
          {/* 
        WHAT THIS DOES: Shows when user clicks "Port Operations" in navigation
        CONTENT: Port facilities, typical operations, berth info, launch schedules
        CUSTOMIZE: All text content should reflect your specific port
        */}

          {/* DO NOT MODIFY: Section visibility logic */}
          {activeSection === 'operations' && (
            /* DO NOT MODIFY: Section spacing container */
            <div className="space-y-8">
              {/* DO NOT MODIFY: Section header structure */}
              <div className="flex items-center mb-8">
                <Ship className="w-8 h-8 text-blue-400 mr-4" />
                <h2 className="text-3xl font-bold text-white">
                  Port Operations
                </h2>
              </div>

              {/* =================================================================== */}
              {/* TYPICAL OPERATIONS CARD - CUSTOMIZE ALL CONTENT */}
              {/* =================================================================== */}
              {/* 
            TODO: Replace all content with your port's operational information
            FOCUS: What types of ships visit, what operations happen, how long stays are
            */}

              {/* DO NOT MODIFY: Card container styling */}
              <div className="bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-4">
                  Typical Operations
                </h3>

                {/* TODO: Replace with your port's operational overview */}
                <p className="text-white/80 mb-4">
                  {/* EXAMPLE: "Sasebo serves as a major naval logistics hub for routine port visits..." */}
                  Guam’s Apra Harbor is divided into the outharbor and inner
                  harbor, each serving different types of ships and missions.
                </p>

                {/* DO NOT MODIFY: Two-column grid layout */}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* =================================================================== */}
                  {/* LEFT COLUMN: PRIMARY FUNCTIONS - CUSTOMIZE CONTENT */}
                  {/* =================================================================== */}

                  <div>
                    <h4 className="font-semibold text-white mb-3">
                      Primary Functions
                    </h4>
                    {/* TODO: Replace with your port's primary functions */}
                    {/* DO NOT MODIFY: List structure and bullet styling */}
                    <ul className="space-y-2 text-white/70">
                      <li>
                        •{' '}
                        {
                          /* TODO: Replace */ 'T-AKE and T-AO cargo and fuel operations'
                        }
                      </li>
                      <li>• {/* TODO: Replace */ 'Ammo Operations'}</li>
                      <li>
                        • {/* TODO: Replace */ 'Voyage Repair (VR) periods'}
                      </li>
                      <li>
                        •{' '}
                        {/* TODO: Replace */ 'Navy vessel maintenance support'}
                      </li>
                    </ul>
                  </div>

                  {/* =================================================================== */}
                  {/* RIGHT COLUMN: OPERATION NOTES - CUSTOMIZE CONTENT */}
                  {/* =================================================================== */}

                  <div>
                    <h4 className="font-semibold text-white mb-3">
                      Operation Notes
                    </h4>
                    {/* TODO: Replace with your port's operational characteristics */}
                    {/* DO NOT MODIFY: List structure and bullet styling */}
                    <ul className="space-y-2 text-white/70">
                      <li>
                        •{' '}
                        {
                          /* TODO: Replace */ 'Local workers are often on island time'
                        }
                      </li>
                      <li>
                        •{' '}
                        {
                          /* TODO: Replace */ '24/7 security and base operations'
                        }
                      </li>

                      <li>
                        •{' '}
                        {
                          /* TODO: Replace */ 'Pop up storms are common and can impact operations'
                        }
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* =================================================================== */}
              {/* PIER LOCATIONS AND FACILITIES - CUSTOMIZE ALL CONTENT */}
              {/* =================================================================== */}
              {/* 
            TODO: This is the most important section for sailors
            INCLUDE: Where ships berth, anchor areas, liberty launch info
            CUSTOMIZE: All location names, distances, and operational details
            */}

              {/* DO NOT MODIFY: Card container styling */}
              <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-4">
                  Pier Locations & Facilities
                </h3>

                {/* DO NOT MODIFY: Sections spacing container */}
                <div className="space-y-6">
                  {/* =================================================================== */}
                  {/* ANCHORING INFORMATION - CUSTOMIZE IF APPLICABLE */}
                  {/* =================================================================== */}
                  {/* 
                TODO: If ships anchor (vs. pier-side), customize this section
                DELETE: If your port doesn't use anchoring - remove entire subsection
                */}

                  {/* DO NOT MODIFY: Anchoring card structure */}
                  <div className="bg-white/10 rounded-lg p-4">
                    <h4 className="font-semibold text-white mb-3">
                      Anchoring Areas
                    </h4>

                    {/* TODO: Replace with your port's anchoring info (or delete if N/A) */}
                    <p className="text-white/80 mb-3">
                      {/* EXAMPLE: "Most T-AKEs anchor in Sasebo harbor rather than pier-side..." */}
                      Most [VESSEL TYPES] anchor in [PORT NAME] [HARBOR/BAY]
                      rather than pier-side. [LIBERTY TRANSPORT DESCRIPTION].
                    </p>

                    {/* DO NOT MODIFY: Two-column grid layout */}
                    <div className="grid md:grid-cols-2 gap-4">
                      {/* Anchor Details - TODO: Customize */}
                      <div>
                        <h5 className="font-medium text-white mb-2">
                          Anchor Details
                        </h5>
                        {/* TODO: Replace with your port's anchor area characteristics */}
                        <ul className="space-y-1 text-white/70 text-sm">
                          <li>
                            • {/* TODO */ '15-20 minute liberty launch transit'}
                          </li>
                          <li>
                            •{' '}
                            {
                              /* TODO */ 'Launches operate 0600-0100 (ship dependent)'
                            }
                          </li>
                          <li>
                            • {/* TODO */ 'Protected harbor with good holding'}
                          </li>
                          <li>
                            •{' '}
                            {/* TODO */ 'Minimal weather impact on operations'}
                          </li>
                        </ul>
                      </div>

                      {/* Launch Operations - TODO: Customize */}
                      <div>
                        <h5 className="font-medium text-white mb-2">
                          Launch Operations
                        </h5>
                        {/* TODO: Replace with your port's launch information */}
                        <ul className="space-y-1 text-white/70 text-sm">
                          <li>
                            •{' '}
                            {
                              /* TODO */ 'Multiple ships = multiple launch schedules'
                            }
                          </li>
                          <li>
                            • {/* TODO */ 'Punctual and reliable service'}
                          </li>
                          <li>
                            • {/* TODO */ 'Two main drop-off points available'}
                          </li>
                          <li>
                            • {/* TODO */ 'Weather rarely impacts operations'}
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* =================================================================== */}
                  {/* PIER FACILITIES - CUSTOMIZE ALL CONTENT */}
                  {/* =================================================================== */}
                  {/* 
                TODO: Describe your port's pier facilities
                INCLUDE: Fuel piers, cargo areas, passenger facilities, etc.
                */}

                  {/* DO NOT MODIFY: Pier facilities card structure */}
                  <div className="bg-white/10 rounded-lg p-4">
                    <h4 className="font-semibold text-white mb-3">
                      Pier Facilities
                    </h4>

                    {/* DO NOT MODIFY: Two-column grid layout */}
                    <div className="grid md:grid-cols-2 gap-4">
                      {/* First Facility Type - TODO: Customize */}
                      <div className="border-l-4 border-blue-400 pl-4">
                        <h5 className="font-semibold text-white mb-2">
                          {/* TODO: Replace with actual facility name */}
                          Fuel Pier
                        </h5>
                        <p className="text-white/70 text-sm mb-2">
                          {/* TODO: Replace with actual facility description */}
                          Primary fuel pier for T-AO operations and fuel
                          transfers.
                        </p>
                        {/* TODO: Replace with actual facility details */}
                        <ul className="space-y-1 text-white/60 text-xs">
                          <li>• Direct shore access when pier-side</li>
                          <li>• Full fuel loading capabilities</li>
                          <li>• Shore power and utilities available</li>
                        </ul>
                      </div>

                      {/* Second Facility Type - TODO: Customize */}
                      <div className="border-l-4 border-green-400 pl-4">
                        <h5 className="font-semibold text-white mb-2">
                          {/* TODO: Replace with actual facility name */}
                          Cargo Areas
                        </h5>
                        <p className="text-white/70 text-sm mb-2">
                          {/* TODO: Replace with actual facility description */}
                          Multiple cargo handling areas for supplies and
                          equipment loading.
                        </p>
                        {/* TODO: Replace with actual facility details */}
                        <ul className="space-y-1 text-white/60 text-xs">
                          <li>• Heavy-lift crane capabilities</li>
                          <li>• Container and break-bulk handling</li>
                          <li>• Secure storage areas available</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* =================================================================== */}
                  {/* LIBERTY DROP-OFF POINTS - VERY IMPORTANT FOR SAILORS */}
                  {/* =================================================================== */}
                  {/* 
                TODO: This is critical information - where do liberty launches drop off sailors?
                CUSTOMIZE: All location names, descriptions, and important reminders
                */}

                  {/* DO NOT MODIFY: Drop-off points card styling (yellow = important) */}
                  <div className="bg-yellow-500/20 rounded-lg border border-yellow-400/30 p-4">
                    <h4 className="font-semibold text-yellow-300 mb-3">
                      Liberty Drop-off Points
                    </h4>

                    {/* DO NOT MODIFY: Two-column grid layout */}
                    <div className="grid md:grid-cols-2 gap-4">
                      {/* First Drop-off Point - TODO: Customize */}
                      <div className="border-l-4 border-blue-400 pl-4">
                        <h5 className="font-semibold text-white mb-2">
                          {/* TODO: Replace with actual location name */}
                          Fleet Landing
                        </h5>
                        <p className="text-white/70 text-sm">
                          {/* TODO: Replace with actual location description */}
                          Primary drop-off point near USO and NEX food court.
                          Most convenient for base facilities access.
                        </p>
                      </div>

                      {/* Second Drop-off Point - TODO: Customize */}
                      <div className="border-l-4 border-green-400 pl-4">
                        <h5 className="font-semibold text-white mb-2">
                          {/* TODO: Replace with actual location name */}
                          Flag Landing
                        </h5>
                        <p className="text-white/70 text-sm">
                          {/* TODO: Replace with actual location description */}
                          Alternative drop-off point by Navy Lodge. Good access
                          to lodging and facilities.
                        </p>
                      </div>
                    </div>

                    {/* =================================================================== */}
                    {/* CRITICAL REMINDER - CUSTOMIZE FOR YOUR PORT */}
                    {/* =================================================================== */}
                    {/* 
                  TODO: Replace with the most important operational reminder for your port
                  EXAMPLES: Launch schedules, security requirements, transportation info
                  */}

                    {/* DO NOT MODIFY: Important reminder card styling (red = critical) */}
                    <div className="mt-4 p-3 bg-red-500/20 rounded-lg border border-red-400/30">
                      <p className="text-red-300 text-sm font-medium">
                        {/* TODO: Replace with your port's most critical operational reminder */}
                        Important: Take a picture of your ship's launch schedule
                        before departing. Multiple ships = multiple launches -
                        get on the right one!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/*
===============================================================================
WHAT YOU NEED TO CUSTOMIZE IN THIS SECTION:

1. TYPICAL OPERATIONS (around line 35):
   - Replace port function description with your port's role
   - Update primary functions list with actual operations
   - Update operation notes with your port's characteristics

2. ANCHORING INFORMATION (around line 85):
   - DELETE entire anchoring subsection if ships go pier-side
   - If applicable, update anchor area details and launch info
   - Customize launch schedules and drop-off information

3. PIER FACILITIES (around line 135):
   - Replace facility types with your actual pier facilities
   - Update facility descriptions and capabilities
   - Add/remove facilities as needed for your port

4. LIBERTY DROP-OFF POINTS (around line 175):
   - CRITICAL: Update with actual drop-off location names
   - Describe what's near each drop-off point
   - Update the important reminder with port-specific info

5. CRITICAL REMINDER (around line 205):
   - Replace with the most important thing sailors need to know
   - Examples: Security procedures, transportation, timing

COMMON PORT OPERATION TYPES:
- Naval: T-AKE, T-AO, DDG, CG visits
- Commercial: Container loading, cargo operations
- Passenger: Cruise ship terminals
- Industrial: Bulk cargo, fuel terminals
- Mixed: Multiple vessel types and operations

TESTING CHECKLIST:
□ All placeholder text replaced with your port's information
□ Facility descriptions match your actual port capabilities
□ Drop-off points are accurate and helpful for navigation
□ Critical reminders address your port's specific issues
□ Information helps sailors understand what to expect
===============================================================================
*/
          /*
===============================================================================
PORT PAGE TEMPLATE - FOOD & DINING SECTION
===============================================================================

This section contains the interactive venue carousels for dining options:
1. Food scene overview (customize content)
2. Local Spots carousel (uses localSpots array from JavaScript)
3. Taste of Home carousel (uses tasteOfHome array from JavaScript)

Key concepts for beginners:
- Carousels show 4 cards at a time, users can navigate with arrows
- Cards are clickable and open the modal popup
- All venue data comes from your arrays in the JavaScript section
- DO NOT MODIFY the carousel logic - only customize the introductory content

CRITICAL: The carousel components are complex interactive elements - don't change them!
===============================================================================
*/}

          {/* =============================================================== */}
          {/* FOOD & DINING SECTION - CUSTOMIZE INTRO, CAROUSELS AUTO-POPULATE */}
          {/* =============================================================== */}
          {/* 
        WHAT THIS DOES: Shows when user clicks "Food & Dining" in navigation
        STRUCTURE: Food overview + two venue carousels (Local Spots + Taste of Home)
        CUSTOMIZE: Only the intro content - carousels use your venue data automatically
        */}

          {/* DO NOT MODIFY: Section visibility logic */}
          {activeSection === 'food' && (
            /* DO NOT MODIFY: Section spacing container */
            <div className="space-y-8">
              {/* DO NOT MODIFY: Section header structure */}
              <div className="flex items-center mb-8">
                <Utensils className="w-8 h-8 text-blue-400 mr-4" />
                <h2 className="text-3xl font-bold text-white">Food & Dining</h2>
              </div>

              {/* =================================================================== */}
              {/* FOOD SCENE OVERVIEW - CUSTOMIZE ALL CONTENT */}
              {/* =================================================================== */}
              {/* 
            TODO: Replace all content with your port's food scene description
            STRUCTURE: Main description + two columns (specialties + drinks)
            PURPOSE: Give sailors overview of local cuisine before showing specific venues
            */}

              {/* DO NOT MODIFY: Overview card container */}
              <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-4">
                  Local Food & Drink
                </h3>

                {/* TODO: Replace with your port's food scene description */}
                <p className="text-lg text-white/80 leading-relaxed mb-6">
                  {/* EXAMPLE: "Sasebo offers incredible Japanese cuisine with something for every palate..." */}
                  [PORT NAME] offers [CUISINE TYPE] with [VARIETY DESCRIPTION].
                  From [SPECIALTY 1] to [SPECIALTY 2], the food scene here is
                  [ADJECTIVE].
                </p>

                {/* DO NOT MODIFY: Two-column grid layout */}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* =================================================================== */}
                  {/* LEFT COLUMN: LOCAL SPECIALTIES - CUSTOMIZE CONTENT */}
                  {/* =================================================================== */}

                  {/* DO NOT MODIFY: Specialties card structure */}
                  <div className="bg-white/10 rounded-lg p-4">
                    <h4 className="font-semibold text-white mb-3">
                      Must-Try Local Specialties
                    </h4>

                    {/* TODO: Replace with your port's local dishes */}
                    {/* DO NOT MODIFY: List structure and bullet styling */}
                    <ul className="space-y-2 text-white/80">
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-red-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <div>
                          <strong>{/* TODO */ 'Ramen'}:</strong>{' '}
                          {
                            /* TODO */ 'Rich tonkotsu and miso broths with perfect noodles'
                          }
                        </div>
                      </li>
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-red-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <div>
                          <strong>{/* TODO */ 'Fresh Sushi'}:</strong>{' '}
                          {
                            /* TODO */ 'Daily catch from local waters, expertly prepared'
                          }
                        </div>
                      </li>
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-red-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <div>
                          <strong>{/* TODO */ 'Gyoza'}:</strong>{' '}
                          {
                            /* TODO */ 'Perfectly pan-fried dumplings, crispy and flavorful'
                          }
                        </div>
                      </li>
                    </ul>
                  </div>

                  {/* =================================================================== */}
                  {/* RIGHT COLUMN: LOCAL DRINKS - CUSTOMIZE CONTENT */}
                  {/* =================================================================== */}

                  {/* DO NOT MODIFY: Drinks card structure */}
                  <div className="bg-white/10 rounded-lg p-4">
                    <h4 className="font-semibold text-white mb-3">
                      Local Drinks to Try
                    </h4>

                    {/* TODO: Replace with your port's local drinks */}
                    {/* DO NOT MODIFY: List structure and bullet styling */}
                    <ul className="space-y-2 text-white/80">
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <div>
                          <strong>{/* TODO */ 'Chuhai'}:</strong>{' '}
                          {/* TODO */ '9% ABV mixed drink, deceptively strong'}
                        </div>
                      </li>
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <div>
                          <strong>{/* TODO */ 'Local Beer'}:</strong>{' '}
                          {
                            /* TODO */ 'Regional brews on tap at most establishments'
                          }
                        </div>
                      </li>
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <div>
                          <strong>{/* TODO */ 'Regional Wine'}:</strong>{' '}
                          {
                            /* TODO */ 'Local vintages that pair well with cuisine'
                          }
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* =================================================================== */}
              {/* LOCAL SPOTS CAROUSEL - DO NOT MODIFY ANYTHING IN THIS SECTION */}
              {/* =================================================================== */}
              {/* 
            CRITICAL: This entire carousel is a complex interactive component
            DATA SOURCE: Uses localSpots array from JavaScript section
            HOW IT WORKS: Shows 4 venue cards, navigation arrows, clickable cards open modal
            CUSTOMIZE: Only venue data in localSpots array - NOT this carousel code
            */}

              {/* DO NOT MODIFY: Carousel container */}
              <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl p-6 border border-white/10">
                {/* DO NOT MODIFY: Carousel header with navigation arrows */}
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-white">
                    Local Spots
                  </h3>

                  {/* DO NOT MODIFY: Navigation arrow buttons */}
                  <div className="flex space-x-2">
                    <button
                      onClick={() =>
                        setLocalSpotsIndex(Math.max(0, localSpotsIndex - 4))
                      }
                      disabled={localSpotsIndex === 0}
                      className="p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      ←
                    </button>
                    <button
                      onClick={() =>
                        setLocalSpotsIndex(
                          Math.min(localSpots.length - 4, localSpotsIndex + 4)
                        )
                      }
                      disabled={localSpotsIndex >= localSpots.length - 4}
                      className="p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      →
                    </button>
                  </div>
                </div>

                {/* DO NOT MODIFY: Venue cards grid - automatically populated from localSpots array */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {localSpots
                    .slice(localSpotsIndex, localSpotsIndex + 4)
                    .map((spot) => (
                      /* DO NOT MODIFY: Individual venue card structure */
                      <div
                        key={spot.id}
                        onClick={() => openModal(spot)}
                        className="bg-white/10 rounded-lg p-4 hover:bg-white/15 transition-all cursor-pointer group"
                      >
                        {/* DO NOT MODIFY: Venue name display */}
                        <h4 className="font-semibold text-white mb-1 group-hover:text-blue-300 transition-colors">
                          {spot.name}
                        </h4>

                        {/* DO NOT MODIFY: Venue type display */}
                        <p className="text-blue-300 text-sm mb-2">
                          {spot.type}
                        </p>

                        {/* DO NOT MODIFY: Short description display */}
                        <p className="text-white/70 text-sm mb-3 line-clamp-2">
                          {spot.description}
                        </p>

                        {/* DO NOT MODIFY: Highlights and pricing section */}
                        <div className="space-y-2">
                          {/* DO NOT MODIFY: Highlight tags - shows first 2 highlights */}
                          <div className="flex flex-wrap gap-1">
                            {spot.highlights
                              .slice(0, 2)
                              .map((highlight, idx) => (
                                <span
                                  key={idx}
                                  className="text-xs bg-blue-500/30 text-blue-200 px-2 py-1 rounded"
                                >
                                  {highlight}
                                </span>
                              ))}
                          </div>

                          {/* DO NOT MODIFY: Price and location footer */}
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-green-300">
                              {spot.priceRange}
                            </span>
                            <span className="text-white/50">
                              {spot.location}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>

                {/* DO NOT MODIFY: Carousel pagination dots */}
                <div className="flex justify-center mt-4">
                  <div className="flex space-x-2">
                    {Array.from({
                      length: Math.ceil(localSpots.length / 4),
                    }).map((_, idx) => (
                      <div
                        key={idx}
                        className={`w-2 h-2 rounded-full transition-all ${
                          Math.floor(localSpotsIndex / 4) === idx
                            ? 'bg-blue-400'
                            : 'bg-white/30'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* =================================================================== */}
              {/* TASTE OF HOME CAROUSEL - DO NOT MODIFY ANYTHING IN THIS SECTION */}
              {/* =================================================================== */}
              {/* 
            CRITICAL: This entire carousel is a complex interactive component
            DATA SOURCE: Uses tasteOfHome array from JavaScript section
            IDENTICAL: Same structure as Local Spots carousel, different data source
            CUSTOMIZE: Only venue data in tasteOfHome array - NOT this carousel code
            */}

              {/* DO NOT MODIFY: Carousel container */}
              <div className="bg-gradient-to-br from-green-500/20 to-teal-500/20 rounded-xl p-6 border border-white/10">
                {/* DO NOT MODIFY: Carousel header with navigation arrows */}
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-white">
                    A Taste of Home
                  </h3>

                  {/* DO NOT MODIFY: Navigation arrow buttons */}
                  <div className="flex space-x-2">
                    <button
                      onClick={() =>
                        setTasteOfHomeIndex(Math.max(0, tasteOfHomeIndex - 4))
                      }
                      disabled={tasteOfHomeIndex === 0}
                      className="p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      ←
                    </button>
                    <button
                      onClick={() =>
                        setTasteOfHomeIndex(
                          Math.min(tasteOfHome.length - 4, tasteOfHomeIndex + 4)
                        )
                      }
                      disabled={tasteOfHomeIndex >= tasteOfHome.length - 4}
                      className="p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      →
                    </button>
                  </div>
                </div>

                {/* DO NOT MODIFY: Venue cards grid - automatically populated from tasteOfHome array */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {tasteOfHome
                    .slice(tasteOfHomeIndex, tasteOfHomeIndex + 4)
                    .map((spot) => (
                      /* DO NOT MODIFY: Individual venue card structure */
                      <div
                        key={spot.id}
                        onClick={() => openModal(spot)}
                        className="bg-white/10 rounded-lg p-4 hover:bg-white/15 transition-all cursor-pointer group"
                      >
                        {/* DO NOT MODIFY: Venue name display */}
                        <h4 className="font-semibold text-white mb-1 group-hover:text-green-300 transition-colors">
                          {spot.name}
                        </h4>

                        {/* DO NOT MODIFY: Venue type display */}
                        <p className="text-green-300 text-sm mb-2">
                          {spot.type}
                        </p>

                        {/* DO NOT MODIFY: Short description display */}
                        <p className="text-white/70 text-sm mb-3 line-clamp-2">
                          {spot.description}
                        </p>

                        {/* DO NOT MODIFY: Highlights and pricing section */}
                        <div className="space-y-2">
                          {/* DO NOT MODIFY: Highlight tags - shows first 2 highlights */}
                          <div className="flex flex-wrap gap-1">
                            {spot.highlights
                              .slice(0, 2)
                              .map((highlight, idx) => (
                                <span
                                  key={idx}
                                  className="text-xs bg-green-500/30 text-green-200 px-2 py-1 rounded"
                                >
                                  {highlight}
                                </span>
                              ))}
                          </div>

                          {/* DO NOT MODIFY: Price and location footer */}
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-green-300">
                              {spot.priceRange}
                            </span>
                            <span className="text-white/50">
                              {spot.location}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>

                {/* DO NOT MODIFY: Carousel pagination dots */}
                <div className="flex justify-center mt-4">
                  <div className="flex space-x-2">
                    {Array.from({
                      length: Math.ceil(tasteOfHome.length / 4),
                    }).map((_, idx) => (
                      <div
                        key={idx}
                        className={`w-2 h-2 rounded-full transition-all ${
                          Math.floor(tasteOfHomeIndex / 4) === idx
                            ? 'bg-green-400'
                            : 'bg-white/30'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/*
===============================================================================
WHAT YOU NEED TO CUSTOMIZE IN THIS SECTION:

⚠️  CRITICAL: DO NOT MODIFY THE CAROUSEL COMPONENTS!
The carousels are complex interactive elements. Only customize the data they use.

1. FOOD SCENE OVERVIEW (around line 35):
   - Replace main description with your port's cuisine overview
   - Update local specialties list (3-4 dishes)
   - Update local drinks list (3-4 beverages)

2. VENUE DATA (in JavaScript section, not this file):
   - Populate localSpots array with authentic local restaurants
   - Populate tasteOfHome array with familiar/American food options
   - Each venue needs: name, type, description, highlights, priceRange, location
   - Optional: coordinates, detailedDescription, hours, phone, website

VENUE DATA STRUCTURE REMINDER:
{
  id: 1,
  name: "Restaurant Name",
  type: "Restaurant Type", 
  description: "Brief description for card",
  highlights: ["Feature 1", "Feature 2", "Feature 3"],
  priceRange: "€15-25", // Local currency
  location: "Area description",
  coordinates: [longitude, latitude], // Optional - for map markers
  detailedDescription: "Longer description for modal", // Optional
  hours: "Daily: 11:00-23:00", // Optional
  specialNotes: "Cash only, English menu available" // Optional
}

TESTING CHECKLIST:
□ Food scene overview describes your port's actual cuisine
□ Local specialties reflect real dishes available at your port
□ Local drinks represent actual beverages sailors can order
□ Venue arrays populated with real restaurants/cafes
□ Carousel navigation works (arrows and dots)
□ Venue cards open modal popups when clicked
□ All venue information is accurate and helpful

COMMON MISTAKE:
Don't modify the carousel JSX - only modify the data arrays in the JavaScript section!
===============================================================================
*/
          /*
===============================================================================
PORT PAGE TEMPLATE - BARS & NIGHTLIFE SECTION
===============================================================================

This section contains nightlife venue carousels with safety information:
1. Safety reminders and local etiquette (customize content)
2. Hangs and Dives carousel (uses hangsAndDives array from JavaScript)
3. Higher Energy carousel (uses higherEnergy array from JavaScript)

Key concepts for beginners:
- Same carousel structure as Food section, different data sources
- Safety section is important - customize for your port's specific risks
- Carousels auto-populate from your venue arrays - DO NOT MODIFY carousel code
- Focus on responsible drinking and local safety considerations

CRITICAL: Like food carousels, these are complex interactive components - don't change them!
===============================================================================
*/}

          {/* =============================================================== */}
          {/* NIGHTLIFE SECTION - CUSTOMIZE INTRO, CAROUSELS AUTO-POPULATE */}
          {/* =============================================================== */}
          {/* 
        WHAT THIS DOES: Shows when user clicks "Bars & Nightlife" in navigation
        STRUCTURE: Safety info + two venue carousels (Hangs & Dives + Higher Energy)
        CUSTOMIZE: Safety content and venue data arrays - NOT the carousel code
        */}

          {/* DO NOT MODIFY: Section visibility logic */}
          {activeSection === 'nightlife' && (
            /* DO NOT MODIFY: Section spacing container */
            <div className="space-y-8">
              {/* DO NOT MODIFY: Section header structure */}
              <div className="flex items-center mb-8">
                <Wine className="w-8 h-8 text-blue-400 mr-4" />
                <h2 className="text-3xl font-bold text-white">
                  Bars & Nightlife
                </h2>
              </div>

              {/* =================================================================== */}
              {/* SAFETY & ETIQUETTE SECTION - CUSTOMIZE ALL CONTENT */}
              {/* =================================================================== */}
              {/* 
            TODO: This is crucial - replace with your port's specific safety considerations
            FOCUS: Local drinking culture, common risks, etiquette, transportation
            PURPOSE: Keep sailors safe and help them respect local customs
            */}

              {/* DO NOT MODIFY: Safety section card container */}
              <div className="bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-4">
                  Safety & Local Etiquette
                </h3>

                {/* DO NOT MODIFY: Two-column grid layout */}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* =================================================================== */}
                  {/* LEFT COLUMN: ESSENTIAL REMINDERS - CUSTOMIZE CONTENT */}
                  {/* =================================================================== */}

                  {/* DO NOT MODIFY: Essential reminders card structure */}
                  <div className="bg-white/10 rounded-lg p-4">
                    <h4 className="font-semibold text-white mb-3">
                      Essential Safety Reminders
                    </h4>

                    {/* TODO: Replace with your port's most critical safety reminders */}
                    {/* DO NOT MODIFY: List structure and bullet styling */}
                    <ul className="space-y-2 text-white/80">
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-red-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <div>
                          <strong>{/* TODO */ 'Last Liberty Launch'}:</strong>{' '}
                          {
                            /* TODO */ 'Never miss it! Hotels are expensive and limited'
                          }
                        </div>
                      </li>
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-red-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <div>
                          <strong>{/* TODO */ 'Know Your Transport'}:</strong>{' '}
                          {
                            /* TODO */ 'Multiple ships = multiple launch schedules'
                          }
                        </div>
                      </li>
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-red-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <div>
                          <strong>
                            {/* TODO */ 'Drink Strength Warning'}:
                          </strong>{' '}
                          {
                            /* TODO */ 'Local drinks may be stronger than expected'
                          }
                        </div>
                      </li>
                    </ul>
                  </div>

                  {/* =================================================================== */}
                  {/* RIGHT COLUMN: LOCAL ETIQUETTE - CUSTOMIZE CONTENT */}
                  {/* =================================================================== */}

                  {/* DO NOT MODIFY: Local etiquette card structure */}
                  <div className="bg-white/10 rounded-lg p-4">
                    <h4 className="font-semibold text-white mb-3">
                      Local Customs & Etiquette
                    </h4>

                    {/* TODO: Replace with your port's cultural considerations */}
                    {/* DO NOT MODIFY: List structure and bullet styling */}
                    <ul className="space-y-2 text-white/80">
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <div>
                          <strong>{/* TODO */ 'Tipping Policy'}:</strong>{' '}
                          {/* TODO */ 'Research local tipping customs'}
                        </div>
                      </li>
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <div>
                          <strong>{/* TODO */ 'Local Customs'}:</strong>{' '}
                          {/* TODO */ 'Respect establishment policies'}
                        </div>
                      </li>
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <div>
                          <strong>{/* TODO */ 'Language Barrier'}:</strong>{' '}
                          {/* TODO */ 'Learn basic courtesy phrases'}
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* =================================================================== */}
              {/* HANGS AND DIVES CAROUSEL - DO NOT MODIFY ANYTHING IN THIS SECTION */}
              {/* =================================================================== */}
              {/* 
            CRITICAL: This entire carousel is a complex interactive component
            DATA SOURCE: Uses hangsAndDives array from JavaScript section
            PURPOSE: Shows relaxed bars good for conversation and socializing
            CUSTOMIZE: Only venue data in hangsAndDives array - NOT this carousel code
            */}

              {/* DO NOT MODIFY: Carousel container */}
              <div className="bg-gradient-to-br from-amber-500/20 to-yellow-500/20 rounded-xl p-6 border border-white/10">
                {/* DO NOT MODIFY: Carousel header with navigation arrows */}
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-white">
                    Hangs and Dives
                  </h3>

                  {/* DO NOT MODIFY: Navigation arrow buttons */}
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setHangsIndex(Math.max(0, hangsIndex - 4))}
                      disabled={hangsIndex === 0}
                      className="p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      ←
                    </button>
                    <button
                      onClick={() =>
                        setHangsIndex(
                          Math.min(hangsAndDives.length - 4, hangsIndex + 4)
                        )
                      }
                      disabled={hangsIndex >= hangsAndDives.length - 4}
                      className="p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      →
                    </button>
                  </div>
                </div>

                {/* DO NOT MODIFY: Venue cards grid - automatically populated from hangsAndDives array */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {hangsAndDives
                    .slice(hangsIndex, hangsIndex + 4)
                    .map((spot) => (
                      /* DO NOT MODIFY: Individual venue card structure */
                      <div
                        key={spot.id}
                        onClick={() => openModal(spot)}
                        className="bg-white/10 rounded-lg p-4 hover:bg-white/15 transition-all cursor-pointer group"
                      >
                        {/* DO NOT MODIFY: Venue name display */}
                        <h4 className="font-semibold text-white mb-1 group-hover:text-amber-300 transition-colors">
                          {spot.name}
                        </h4>

                        {/* DO NOT MODIFY: Venue type display */}
                        <p className="text-amber-300 text-sm mb-2">
                          {spot.type}
                        </p>

                        {/* DO NOT MODIFY: Short description display */}
                        <p className="text-white/70 text-sm mb-3 line-clamp-2">
                          {spot.description}
                        </p>

                        {/* DO NOT MODIFY: Highlights and pricing section */}
                        <div className="space-y-2">
                          {/* DO NOT MODIFY: Highlight tags - shows first 2 highlights */}
                          <div className="flex flex-wrap gap-1">
                            {spot.highlights
                              .slice(0, 2)
                              .map((highlight, idx) => (
                                <span
                                  key={idx}
                                  className="text-xs bg-amber-500/30 text-amber-200 px-2 py-1 rounded"
                                >
                                  {highlight}
                                </span>
                              ))}
                          </div>

                          {/* DO NOT MODIFY: Price and location footer */}
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-green-300">
                              {spot.priceRange}
                            </span>
                            <span className="text-white/50">
                              {spot.location}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>

                {/* DO NOT MODIFY: Carousel pagination dots */}
                <div className="flex justify-center mt-4">
                  <div className="flex space-x-2">
                    {Array.from({
                      length: Math.ceil(hangsAndDives.length / 4),
                    }).map((_, idx) => (
                      <div
                        key={idx}
                        className={`w-2 h-2 rounded-full transition-all ${
                          Math.floor(hangsIndex / 4) === idx
                            ? 'bg-amber-400'
                            : 'bg-white/30'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* HIGHER ENERGY CAROUSEL - DO NOT MODIFY ANYTHING IN THIS SECTION */}
              {/* =================================================================== */}
              {/* 
            CRITICAL: This entire carousel is a complex interactive component
            DATA SOURCE: Uses higherEnergy array from JavaScript section
            PURPOSE: Shows nightclubs, karaoke, and high-energy entertainment venues
            CUSTOMIZE: Only venue data in higherEnergy array - NOT this carousel code
            */}

              {/* DO NOT MODIFY: Carousel container */}
              <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl p-6 border border-white/10">
                {/* DO NOT MODIFY: Carousel header with navigation arrows */}
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-white">
                    Higher Energy
                  </h3>

                  {/* DO NOT MODIFY: Navigation arrow buttons */}
                  <div className="flex space-x-2">
                    <button
                      onClick={() =>
                        setHighEnergyIndex(Math.max(0, highEnergyIndex - 4))
                      }
                      disabled={highEnergyIndex === 0}
                      className="p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      ←
                    </button>
                    <button
                      onClick={() =>
                        setHighEnergyIndex(
                          Math.min(higherEnergy.length - 4, highEnergyIndex + 4)
                        )
                      }
                      disabled={highEnergyIndex >= higherEnergy.length - 4}
                      className="p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      →
                    </button>
                  </div>
                </div>

                {/* DO NOT MODIFY: Venue cards grid - automatically populated from higherEnergy array */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {higherEnergy
                    .slice(highEnergyIndex, highEnergyIndex + 4)
                    .map((spot) => (
                      <div
                        key={spot.id}
                        onClick={() => openModal(spot)}
                        className="bg-white/10 rounded-lg p-4 hover:bg-white/15 transition-all cursor-pointer group"
                      >
                        {/* DO NOT MODIFY: Venue name display */}
                        <h4 className="font-semibold text-white mb-1 group-hover:text-purple-300 transition-colors">
                          {spot.name}
                        </h4>

                        {/* DO NOT MODIFY: Venue type display */}
                        <p className="text-purple-300 text-sm mb-2">
                          {spot.type}
                        </p>

                        {/* DO NOT MODIFY: Short description display */}
                        <p className="text-white/70 text-sm mb-3 line-clamp-2">
                          {spot.description}
                        </p>

                        {/* DO NOT MODIFY: Highlights and pricing section */}
                        <div className="space-y-2">
                          {/* DO NOT MODIFY: Highlight tags - shows first 2 highlights */}
                          <div className="flex flex-wrap gap-1">
                            {spot.highlights
                              .slice(0, 2)
                              .map((highlight, idx) => (
                                <span
                                  key={idx}
                                  className="text-xs bg-purple-500/30 text-purple-200 px-2 py-1 rounded"
                                >
                                  {highlight}
                                </span>
                              ))}
                          </div>

                          {/* DO NOT MODIFY: Price and location footer */}
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-green-300">
                              {spot.priceRange}
                            </span>
                            <span className="text-white/50">
                              {spot.location}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>

                {/* DO NOT MODIFY: Carousel pagination dots */}
                <div className="flex justify-center mt-4">
                  <div className="flex space-x-2">
                    {Array.from({
                      length: Math.ceil(higherEnergy.length / 4),
                    }).map((_, idx) => (
                      <div
                        key={idx}
                        className={`w-2 h-2 rounded-full transition-all ${
                          Math.floor(highEnergyIndex / 4) === idx
                            ? 'bg-purple-400'
                            : 'bg-white/30'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/*
===============================================================================
WHAT YOU NEED TO CUSTOMIZE IN THIS SECTION:

⚠️  CRITICAL: DO NOT MODIFY THE CAROUSEL COMPONENTS!
The carousels are identical to food section - complex interactive elements.

1. SAFETY & ETIQUETTE (around line 35):
   - Update essential safety reminders for your port's specific risks
   - Replace local customs with your port's cultural considerations
   - Focus on responsible drinking and local safety

2. VENUE DATA (in JavaScript section, not this file):
   - Populate hangsAndDives array with relaxed bars/pubs
   - Populate higherEnergy array with nightclubs/karaoke/entertainment
   - Same data structure as food venues

VENUE CATEGORIES:
- Hangs and Dives: Relaxed bars, pubs, places good for conversation
- Higher Energy: Nightclubs, karaoke bars, dance venues, late-night entertainment

SAFETY CONSIDERATIONS BY REGION:
- Japan: No tipping, strong drinks (chuhai), respect "Japanese only" policies
- Europe: Vary by country - research tipping, closing times, local customs  
- Caribbean: Hurricane season awareness, tourist area safety
- Mediterranean: Siesta hours, late dining times, pickpocket awareness

RESPONSIBLE MESSAGING:
Focus on safety, moderation, and respect for local customs rather than encouraging excessive drinking or risky behavior.

TESTING CHECKLIST:
□ Safety reminders address your port's specific risks
□ Local etiquette reflects actual cultural norms
□ Venue arrays populated with appropriate establishments
□ Hangs and Dives focuses on conversation-friendly venues
□ Higher Energy includes appropriate entertainment options
□ All venue information promotes responsible enjoyment
□ Carousel navigation and modals work properly

VENUE DATA REMINDER:
Modify the hangsAndDives and higherEnergy arrays in the JavaScript section - not this JSX code!
===============================================================================
*/}

          {/*
===============================================================================
PORT PAGE TEMPLATE - TRANSPORTATION & SAFETY SECTIONS
===============================================================================

These are the final two sections with practical information sailors need:
1. Transportation - Getting around town and to/from airports
2. Safety & Tips - Emergency contacts, common problems, local safety

Key concepts for beginners:
- These are content-heavy sections with lots of customization needed
- Focus on practical, actionable information sailors can use
- Transportation should cover local options plus regional travel
- Safety should address real risks and provide emergency contacts

Both sections are primarily text-based - no complex interactive components!
===============================================================================
*/}

          {/* =============================================================== */}
          {/* TRANSPORTATION SECTION - CUSTOMIZE ALL CONTENT */}
          {/* =============================================================== */}
          {/* 
        WHAT THIS DOES: Shows when user clicks "Transportation" in navigation
        STRUCTURE: Local transport + regional travel + airport info
        CUSTOMIZE: All content should reflect your port's transportation options
        */}

          {/* DO NOT MODIFY: Section visibility logic */}
          {activeSection === 'transportation' && (
            /* DO NOT MODIFY: Section spacing container */
            <div className="space-y-8">
              {/* DO NOT MODIFY: Section header structure */}
              <div className="flex items-center mb-8">
                <Car className="w-8 h-8 text-blue-400 mr-4" />
                <h2 className="text-3xl font-bold text-white">
                  Transportation
                </h2>
              </div>

              {/* =================================================================== */}
              {/* TO TOWN FROM BERTH - CUSTOMIZE ALL CONTENT */}
              {/* =================================================================== */}
              {/* 
            TODO: Replace with your port's ship-to-shore transportation info
            FOCUS: How sailors get from anchored ship or pier to town
            IMPORTANT: Include schedules, costs, and backup plans
            */}

              {/* DO NOT MODIFY: Transport card container */}
              <div className="bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-4">
                  🚤 To Town from Berth
                </h3>

                {/* DO NOT MODIFY: Two-column grid layout */}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* =================================================================== */}
                  {/* PRIMARY TRANSPORT METHOD - CUSTOMIZE CONTENT */}
                  {/* =================================================================== */}

                  {/* DO NOT MODIFY: Primary transport card structure */}
                  <div className="bg-white/10 rounded-lg p-4">
                    <h4 className="font-semibold text-white mb-3">
                      {/* TODO: Update transport method name */}
                      Liberty Launches
                    </h4>
                    <p className="text-white/80 mb-3">
                      {/* TODO: Replace with your port's primary transport description */}
                      Primary transportation between anchored ships and shore
                      facilities.
                    </p>
                    {/* TODO: Replace with your port's transport details */}
                    <ul className="space-y-2 text-white/70 text-sm">
                      <li>
                        • <strong>Operating Hours:</strong>{' '}
                        {/* TODO */ '0600-0100 (varies by ship)'}
                      </li>
                      <li>
                        • <strong>Transit Time:</strong>{' '}
                        {/* TODO */ '15-20 minutes each way'}
                      </li>
                      <li>
                        • <strong>Drop-off Points:</strong>{' '}
                        {/* TODO */ 'Fleet Landing or Flag Landing'}
                      </li>
                      <li>
                        • <strong>Frequency:</strong>{' '}
                        {/* TODO */ 'Every 30-60 minutes'}
                      </li>
                      <li>
                        • {/* TODO */ 'Well-maintained and punctual service'}
                      </li>
                    </ul>
                  </div>

                  {/* =================================================================== */}
                  {/* ALTERNATIVE TRANSPORT METHOD - CUSTOMIZE CONTENT */}
                  {/* =================================================================== */}

                  {/* DO NOT MODIFY: Alternative transport card structure */}
                  <div className="bg-white/10 rounded-lg p-4">
                    <h4 className="font-semibold text-white mb-3">
                      {/* TODO: Update alternative method name */}
                      Pier-Side Access
                    </h4>
                    <p className="text-white/80 mb-3">
                      {/* TODO: Replace with alternative transport description */}
                      When moored pier-side, direct walking access to base
                      facilities.
                    </p>
                    {/* TODO: Replace with alternative transport details */}
                    <ul className="space-y-2 text-white/70 text-sm">
                      <li>
                        • <strong>Walking Distance:</strong>{' '}
                        {/* TODO */ '5-10 minutes to base gate'}
                      </li>
                      <li>
                        • <strong>Base Facilities:</strong>{' '}
                        {/* TODO */ 'NEX, commissary, food court'}
                      </li>
                      <li>
                        • <strong>Town Access:</strong>{' '}
                        {/* TODO */ '10-15 minute walk to downtown'}
                      </li>
                      <li>
                        • <strong>Security:</strong>{' '}
                        {/* TODO */ 'Valid military ID required'}
                      </li>
                    </ul>
                  </div>
                </div>

                {/* =================================================================== */}
                {/* CRITICAL TRANSPORT REMINDER - CUSTOMIZE MESSAGE */}
                {/* =================================================================== */}

                {/* DO NOT MODIFY: Critical reminder card styling (red = important) */}
                <div className="mt-6 p-4 bg-red-500/20 rounded-lg border border-red-400/30">
                  <h4 className="font-semibold text-red-300 mb-2">
                    ⚠️ Critical Reminder
                  </h4>
                  <p className="text-white/80 text-sm">
                    {/* TODO: Replace with your port's most critical transport reminder */}
                    <strong>
                      Take a photo of your ship's launch schedule!
                    </strong>{' '}
                    Multiple ships = multiple launches. Missing the last launch
                    means expensive hotels or sleeping in Liberty Park.
                  </p>
                </div>
              </div>

              {/* =================================================================== */}
              {/* AROUND TOWN - CUSTOMIZE ALL CONTENT */}
              {/* =================================================================== */}
              {/* 
            TODO: Replace with your port's local transportation options
            INCLUDE: Walking distances, taxis, public transport, ride-sharing
            */}

              {/* DO NOT MODIFY: Around town card container */}
              <div className="bg-gradient-to-br from-green-500/20 to-teal-500/20 rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-4">
                  🚗 Around Town
                </h3>

                {/* DO NOT MODIFY: Two-column grid layout */}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Walking Information - TODO: Customize */}
                  <div className="bg-white/10 rounded-lg p-4">
                    <h4 className="font-semibold text-white mb-3">Walking</h4>
                    <p className="text-white/80 mb-3">
                      {/* TODO: Replace with your port's walkability description */}
                      [PORT NAME]'s compact layout makes most attractions easily
                      walkable.
                    </p>
                    {/* TODO: Replace with actual walking distances and areas */}
                    <ul className="space-y-2 text-white/70 text-sm">
                      <li>
                        • <strong>[Main Area]:</strong>{' '}
                        {/* TODO */ 'Main dining/shopping area'}
                      </li>
                      <li>
                        • <strong>[Entertainment District]:</strong>{' '}
                        {/* TODO */ '5-minute walk from base'}
                      </li>
                      <li>
                        • <strong>[Nightlife Area]:</strong>{' '}
                        {/* TODO */ 'Adjacent to main area'}
                      </li>
                      <li>
                        • <strong>[Cultural Sites]:</strong>{' '}
                        {/* TODO */ '10-minute walk from center'}
                      </li>
                      <li>
                        • {/* TODO */ 'Most attractions within 15-minute walk'}
                      </li>
                    </ul>
                  </div>

                  {/* Taxi & Ride Services - TODO: Customize */}
                  <div className="bg-white/10 rounded-lg p-4">
                    <h4 className="font-semibold text-white mb-3">
                      Taxis & Ride Services
                    </h4>
                    <p className="text-white/80 mb-3">
                      {/* TODO: Replace with your port's taxi/ride-share situation */}
                      Limited ride-sharing, but taxis are readily available.
                    </p>
                    {/* TODO: Replace with actual ride service details */}
                    <ul className="space-y-2 text-white/70 text-sm">
                      <li>
                        • <strong>Uber/Lyft:</strong>{' '}
                        {/* TODO */ 'Availability status in your area'}
                      </li>
                      <li>
                        • <strong>Local Taxis:</strong>{' '}
                        {/* TODO */ 'Available at base and town'}
                      </li>
                      <li>
                        • <strong>Cost:</strong>{' '}
                        {/* TODO */ 'Local currency range for trips'}
                      </li>
                      <li>
                        • <strong>Language:</strong>{' '}
                        {/* TODO */ 'English level, translation needs'}
                      </li>
                      <li>
                        • <strong>Payment:</strong>{' '}
                        {/* TODO */ 'Cash vs card acceptance'}
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Public Transportation - TODO: Customize */}
                <div className="bg-white/10 rounded-lg p-4 mt-4">
                  <h4 className="font-semibold text-white mb-3">
                    🚌 Public Transportation
                  </h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h5 className="font-medium text-white mb-2">
                        {/* TODO */ 'Local Buses'}
                      </h5>
                      {/* TODO: Replace with actual bus information */}
                      <ul className="space-y-1 text-white/70 text-xs">
                        <li>
                          • {/* TODO */ 'Connect to nearby neighborhoods'}
                        </li>
                        <li>
                          • {/* TODO */ 'Cost per trip in local currency'}
                        </li>
                        <li>• {/* TODO */ 'English signage availability'}</li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-medium text-white mb-2">
                        {/* TODO */ 'Base/Port Shuttle'}
                      </h5>
                      {/* TODO: Replace with shuttle information or delete if N/A */}
                      <ul className="space-y-1 text-white/70 text-xs">
                        <li>
                          • {/* TODO */ 'Limited routes within port area'}
                        </li>
                        <li>• {/* TODO */ 'Free for military personnel'}</li>
                        <li>• {/* TODO */ 'Connects major facilities'}</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* =================================================================== */}
              {/* REGIONAL TRAVEL & AIRPORTS - CUSTOMIZE ALL CONTENT */}
              {/* =================================================================== */}
              {/* 
            TODO: This section is crucial for crew changes and liberty travel
            CUSTOMIZE: Regional destinations, airport information, transportation costs
            */}

              {/* DO NOT MODIFY: Regional travel card container */}
              <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-4">
                  🚆 Regional Travel & ✈️ Airports
                </h3>

                <p className="text-white/80 mb-6">
                  {/* TODO: Replace with your port's regional travel overview */}
                  [PORT NAME]'s location provides excellent access to major
                  destinations for longer port visits and crew changes.
                </p>

                {/* DO NOT MODIFY: Two-column grid layout */}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* =================================================================== */}
                  {/* LEFT COLUMN: REGIONAL DESTINATIONS - CUSTOMIZE ALL */}
                  {/* =================================================================== */}

                  <div className="space-y-4">
                    {/* Destination 1 - TODO: Customize */}
                    <div className="bg-white/10 rounded-lg p-4">
                      <div className="flex items-center mb-3">
                        <span className="text-2xl mr-3">
                          {/* TODO: Appropriate emoji */ '🏮'}
                        </span>
                        <div>
                          <h4 className="font-semibold text-white">
                            {/* TODO */ 'Major City 1'}
                          </h4>
                          <p className="text-purple-300 text-sm">
                            {/* TODO */ 'X hours by train/bus'}
                          </p>
                        </div>
                      </div>
                      <p className="text-white/70 text-sm mb-2">
                        {
                          /* TODO */ 'Description of what this destination offers sailors'
                        }
                      </p>
                      <ul className="space-y-1 text-white/60 text-xs">
                        <li>
                          • {/* TODO */ 'Transportation method and route'}
                        </li>
                        <li>• {/* TODO */ 'Cost in local currency'}</li>
                        <li>• {/* TODO */ 'Travel time and frequency'}</li>
                      </ul>
                    </div>

                    {/* Destination 2 - TODO: Customize or delete */}
                    <div className="bg-white/10 rounded-lg p-4">
                      <div className="flex items-center mb-3">
                        <span className="text-2xl mr-3">
                          {/* TODO: Appropriate emoji */ '🏙️'}
                        </span>
                        <div>
                          <h4 className="font-semibold text-white">
                            {/* TODO */ 'Major City 2'}
                          </h4>
                          <p className="text-purple-300 text-sm">
                            {/* TODO */ 'X hours by transportation'}
                          </p>
                        </div>
                      </div>
                      <p className="text-white/70 text-sm mb-2">
                        {
                          /* TODO */ 'Description of what this destination offers'
                        }
                      </p>
                      <ul className="space-y-1 text-white/60 text-xs">
                        <li>• {/* TODO */ 'Transportation details'}</li>
                        <li>• {/* TODO */ 'Cost information'}</li>
                        <li>• {/* TODO */ 'Additional travel notes'}</li>
                      </ul>
                    </div>
                  </div>

                  {/* =================================================================== */}
                  {/* RIGHT COLUMN: AIRPORT & CREW CHANGE INFO - CUSTOMIZE ALL */}
                  {/* =================================================================== */}

                  <div className="space-y-4">
                    {/* Primary Airport - TODO: Customize */}
                    <div className="bg-white/10 rounded-lg p-4">
                      <div className="flex items-center mb-4">
                        <span className="text-3xl mr-4">🛬</span>
                        <div>
                          <h4 className="font-semibold text-white">
                            {/* TODO */ 'Primary Airport (CODE)'}
                          </h4>
                          <p className="text-orange-300 text-sm">
                            {/* TODO */ 'Primary International Gateway'}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <h5 className="font-medium text-white mb-2">
                            Distance & Travel Time
                          </h5>
                          {/* TODO: Replace with actual airport information */}
                          <ul className="space-y-1 text-white/70 text-sm">
                            <li>
                              • <strong>Distance:</strong>{' '}
                              {/* TODO */ 'XX km (XX miles) from port'}
                            </li>
                            <li>
                              • <strong>By Train:</strong>{' '}
                              {/* TODO */ 'X hours via [route]'}
                            </li>
                            <li>
                              • <strong>By Bus:</strong>{' '}
                              {/* TODO */ 'X hours direct service'}
                            </li>
                            <li>
                              • <strong>By Taxi:</strong>{' '}
                              {/* TODO */ 'X hours (cost range)'}
                            </li>
                          </ul>
                        </div>

                        <div>
                          <h5 className="font-medium text-white mb-2">
                            Flight Connections
                          </h5>
                          {/* TODO: Replace with actual flight information */}
                          <ul className="space-y-1 text-white/70 text-sm">
                            <li>
                              • <strong>International:</strong>{' '}
                              {/* TODO */ 'Major international destinations'}
                            </li>
                            <li>
                              • <strong>Domestic:</strong>{' '}
                              {/* TODO */ 'Major domestic destinations'}
                            </li>
                            <li>
                              • <strong>Airlines:</strong>{' '}
                              {/* TODO */ 'Major carriers serving airport'}
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* Crew Change Tips - TODO: Customize */}
                    <div className="bg-white/10 rounded-lg p-4">
                      <h4 className="font-semibold text-white mb-3">
                        Crew Change Logistics
                      </h4>
                      {/* TODO: Replace with practical crew change advice */}
                      <ul className="space-y-2 text-white/70 text-sm">
                        <li>
                          • <strong>Advance Booking:</strong>{' '}
                          {/* TODO */ 'Reserve transport 24-48 hours ahead'}
                        </li>
                        <li>
                          • <strong>Best Option:</strong>{' '}
                          {/* TODO */ 'Most economical transport method'}
                        </li>
                        <li>
                          • <strong>Group Travel:</strong>{' '}
                          {/* TODO */ 'Coordinate with other crew members'}
                        </li>
                        <li>
                          • <strong>Luggage:</strong>{' '}
                          {/* TODO */ 'All transport accommodates seabags'}
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =============================================================== */}
          {/* SAFETY & TIPS SECTION - CUSTOMIZE ALL CONTENT */}
          {/* =============================================================== */}
          {/* 
        WHAT THIS DOES: Shows when user clicks "Safety & Tips" in navigation
        STRUCTURE: Common problems + critical reminders + emergency contacts
        CUSTOMIZE: All content should reflect your port's specific safety issues
        */}

          {/* DO NOT MODIFY: Section visibility logic */}
          {activeSection === 'safety' && (
            /* DO NOT MODIFY: Section spacing container */
            <div className="space-y-8">
              {/* DO NOT MODIFY: Section header structure */}
              <div className="flex items-center mb-8">
                <AlertTriangle className="w-8 h-8 text-blue-400 mr-4" />
                <h2 className="text-3xl font-bold text-white">Safety & Tips</h2>
              </div>

              {/* =================================================================== */}
              {/* COMMON PROBLEMS - CUSTOMIZE ALL CONTENT */}
              {/* =================================================================== */}
              {/* 
            TODO: This is crucial - replace with your port's actual liberty incidents
            FOCUS: Real problems that happen at your port, how to avoid them
            PURPOSE: Learn from others' mistakes, prevent incidents
            */}

              {/* DO NOT MODIFY: Common problems card container */}
              <div className="bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-4">
                  ⚠️ How People Get in Trouble
                </h3>

                <p className="text-white/80 mb-6">
                  Learn from others' mistakes. These are the most common liberty
                  incidents that can ruin your port visit or career.
                </p>

                {/* DO NOT MODIFY: Two-column grid layout */}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Left Column - Top 2 Problems */}
                  <div className="space-y-4">
                    {/* Problem 1 - TODO: Customize */}
                    <div className="bg-white/10 rounded-lg p-4">
                      <h4 className="font-semibold text-red-300 mb-3">
                        {/* TODO */ '🚤 Missing Liberty Launch'}
                      </h4>
                      <p className="text-white/80 text-sm mb-2">
                        {/* TODO: Replace with your port's #1 most common incident */}
                        The #1 liberty incident. Missing the last launch leads
                        to expensive hotels or sleeping rough.
                      </p>
                      {/* TODO: Replace with specific ways this happens at your port */}
                      <ul className="space-y-1 text-white/70 text-xs">
                        <li>• Getting on wrong ship's launch</li>
                        <li>• Losing track of time at bars</li>
                        <li>• Not knowing launch schedule changes</li>
                        <li>• Weather delays without backup plan</li>
                      </ul>
                    </div>

                    {/* Problem 2 - TODO: Customize */}
                    <div className="bg-white/10 rounded-lg p-4">
                      <h4 className="font-semibold text-red-300 mb-3">
                        {/* TODO */ '🍺 Alcohol-Related Incidents'}
                      </h4>
                      <p className="text-white/80 text-sm mb-2">
                        {/* TODO: Replace with alcohol-related problems specific to your port */}
                        Local drinks are stronger than they taste. Overindulging
                        leads to problems.
                      </p>
                      {/* TODO: Replace with specific alcohol risks at your port */}
                      <ul className="space-y-1 text-white/70 text-xs">
                        <li>• Underestimating local drink strength</li>
                        <li>• Drinking competitions with locals</li>
                        <li>• Public intoxication and disturbances</li>
                        <li>• Getting overcharged or scammed</li>
                      </ul>
                    </div>
                  </div>

                  {/* Right Column - Problems 3 & 4 */}
                  <div className="space-y-4">
                    {/* Problem 3 - TODO: Customize */}
                    <div className="bg-white/10 rounded-lg p-4">
                      <h4 className="font-semibold text-red-300 mb-3">
                        {/* TODO */ '💸 Financial Incidents'}
                      </h4>
                      <p className="text-white/80 text-sm mb-2">
                        {/* TODO: Replace with financial problems common at your port */}
                        Money problems escalate quickly in foreign ports,
                        especially with language barriers.
                      </p>
                      {/* TODO: Replace with financial risks specific to your port */}
                      <ul className="space-y-1 text-white/70 text-xs">
                        <li>• Buying expensive drinks repeatedly</li>
                        <li>• Not understanding pricing at venues</li>
                        <li>• Credit card fraud or overcharges</li>
                        <li>• Falling for tourist scams</li>
                      </ul>
                    </div>

                    {/* Problem 4 - TODO: Customize */}
                    <div className="bg-white/10 rounded-lg p-4">
                      <h4 className="font-semibold text-red-300 mb-3">
                        {/* TODO */ '🚫 Cultural Missteps'}
                      </h4>
                      <p className="text-white/80 text-sm mb-2">
                        {/* TODO: Replace with cultural problems at your port */}
                        Disrespecting local customs can escalate from
                        embarrassing to serious quickly.
                      </p>
                      {/* TODO: Replace with cultural sensitivity issues at your port */}
                      <ul className="space-y-1 text-white/70 text-xs">
                        <li>• Ignoring cultural restrictions</li>
                        <li>• Being loud or disruptive in public</li>
                        <li>• Inappropriate behavior in cultural sites</li>
                        <li>• Disrespecting local customs or people</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* =================================================================== */}
              {/* EMERGENCY CONTACTS - VERY IMPORTANT - CUSTOMIZE ALL NUMBERS */}
              {/* =================================================================== */}
              {/* 
            TODO: This is critical safety information - get the actual numbers
            VERIFY: All phone numbers, addresses, and contact information
            DOUBLE-CHECK: Emergency numbers are correct for your country
            */}

              {/* DO NOT MODIFY: Emergency contacts card container */}
              <div className="bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-4">
                  📞 Emergency Contacts
                </h3>

                <p className="text-white/80 mb-6">
                  Keep these contact numbers accessible. Save them in your phone
                  before going on liberty.
                </p>

                {/* DO NOT MODIFY: Two-column grid layout */}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* =================================================================== */}
                  {/* LEFT COLUMN: LOCAL EMERGENCY NUMBERS - CUSTOMIZE ALL */}
                  {/* =================================================================== */}

                  <div className="space-y-4">
                    {/* Local Emergency Numbers - TODO: Verify and customize */}
                    <div className="bg-white/10 rounded-lg p-4">
                      <h4 className="font-semibold text-blue-300 mb-3">
                        🚨 Emergency Numbers
                      </h4>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center p-2 bg-red-500/20 rounded border border-red-400/30">
                          <span className="text-white font-medium">Police</span>
                          <span className="text-red-300 font-bold text-lg">
                            {/* TODO: VERIFY local police number */}
                            911
                          </span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-red-500/20 rounded border border-red-400/30">
                          <span className="text-white font-medium">
                            Fire/Ambulance
                          </span>
                          <span className="text-red-300 font-bold text-lg">
                            {/* TODO: VERIFY local emergency number */}
                            911
                          </span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-blue-500/20 rounded border border-blue-400/30">
                          <span className="text-white font-medium">
                            Port/Base Security
                          </span>
                          <span className="text-blue-300 font-medium">
                            {/* TODO: Add actual port security number */}
                            [Port Security Number]
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Medical Facilities - TODO: Customize */}
                    <div className="bg-white/10 rounded-lg p-4">
                      <h4 className="font-semibold text-blue-300 mb-3">
                        🏥 Medical Facilities
                      </h4>
                      <div className="space-y-3 text-white/80 text-sm">
                        <div>
                          <strong>
                            {/* TODO */ 'Primary Medical Facility'}
                          </strong>
                          <p className="text-white/70">
                            {/* TODO */ 'Location and description'}
                          </p>
                          <p className="text-green-300">
                            {/* TODO */ 'Emergency contact number'}
                          </p>
                        </div>
                        <div>
                          <strong>
                            {/* TODO */ 'Secondary Medical Option'}
                          </strong>
                          <p className="text-white/70">
                            {/* TODO */ 'Alternative facility info'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* =================================================================== */}
                  {/* RIGHT COLUMN: EMBASSY & SHIP CONTACTS - CUSTOMIZE ALL */}
                  {/* =================================================================== */}

                  <div className="space-y-4">
                    {/* Embassy Information - TODO: Research and customize */}
                    <div className="bg-white/10 rounded-lg p-4">
                      <h4 className="font-semibold text-blue-300 mb-3">
                        🇺🇸 U.S. Embassy & Consulate
                      </h4>
                      <div className="space-y-2 text-white/80 text-sm">
                        <div>
                          <strong>{/* TODO */ 'U.S. Consulate [City]'}</strong>
                          <p className="text-white/70">
                            {/* TODO */ 'Full address'}
                          </p>
                          <p className="text-blue-300">
                            {/* TODO */ '+XX-XXX-XXX-XXXX'}
                          </p>
                        </div>
                        <div className="mt-3">
                          <strong>
                            U.S. Embassy [Capital] (24/7 Emergency)
                          </strong>
                          <p className="text-blue-300">
                            {/* TODO */ '+XX-XXX-XXX-XXXX'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Ship & Base Contacts - TODO: Make generic */}
                    <div className="bg-white/10 rounded-lg p-4">
                      <h4 className="font-semibold text-blue-300 mb-3">
                        🚢 Ship & Base Contacts
                      </h4>
                      <div className="space-y-2 text-white/80 text-sm">
                        <div className="p-2 bg-yellow-500/20 rounded border border-yellow-400/30">
                          <strong className="text-yellow-300">
                            Your Ship:
                          </strong>
                          <p className="text-white/70">
                            Always keep your ship's emergency contact number
                          </p>
                        </div>
                        <div>
                          <strong>Base Information:</strong>
                          <p className="text-white/70">
                            {/* TODO */ 'Main base/port number'}
                          </p>
                        </div>
                        <div>
                          <strong>Shore Patrol:</strong>
                          <p className="text-white/70">
                            {/* TODO */ 'Contact method'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* =================================================================== */}
                {/* CONTACT TIPS - CUSTOMIZE FOR YOUR REGION */}
                {/* =================================================================== */}

                {/* DO NOT MODIFY: Contact tips card styling */}
                <div className="mt-6 p-4 bg-green-500/20 rounded-lg border border-green-400/30">
                  <h4 className="font-semibold text-green-300 mb-3">
                    💡 Contact Tips
                  </h4>
                  <div className="grid md:grid-cols-3 gap-4 text-white/80 text-sm">
                    <ul className="space-y-1">
                      <li>• Save all numbers in your phone</li>
                      <li>• Screenshot important contacts</li>
                      <li>• Share emergency contacts with shipmates</li>
                    </ul>
                    <ul className="space-y-1">
                      <li>• Keep written backup in wallet</li>
                      <li>• Know your ship's name in local language</li>
                      <li>• Learn basic emergency phrases</li>
                    </ul>
                    <ul className="space-y-1">
                      <li>• Always carry military ID</li>
                      <li>• Know base address in local language</li>
                      <li>• Download offline translation app</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =============================================================== */}
          {/* END OF ALL SECTIONS - CLOSING STRUCTURE */}
          {/* =============================================================== */}
        </div>
      </div>

      {/* =================================================================== */}
      {/* FOOTER - DO NOT MODIFY */}
      {/* =================================================================== */}
      {/* This appears at the bottom of every page */}

      {/* DO NOT MODIFY: Footer container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center text-white/60">
          <p className="mb-2">
            Information compiled from sailor experiences and port visits
          </p>
          <p className="text-sm">
            Always verify current information with your ship's port brief
          </p>
        </div>
      </div>
    </div>
  );
}
{
  /*
===============================================================================
WHAT YOU NEED TO CUSTOMIZE IN TRANSPORTATION SECTION:

1. TO TOWN FROM BERTH (around line 35):
   - Update transport method names and descriptions
   - Replace operating hours, costs, and logistics
   - Customize critical transport reminders

2. AROUND TOWN (around line 95):
   - Update walking distances and area names
   - Replace taxi/ride-share availability and costs
   - Customize public transport information

3. REGIONAL TRAVEL (around line 160):
   - Replace regional destinations with actual nearby cities
   - Update airport information with correct codes and distances
   - Customize crew change logistics and costs

WHAT YOU NEED TO CUSTOMIZE IN SAFETY SECTION:

4. COMMON PROBLEMS (around line 280):
   - Replace with your port's actual most common liberty incidents
   - Update each problem category with port-specific risks
   - Focus on real problems that happen at your location

5. EMERGENCY CONTACTS (around line 360):
   - VERIFY all emergency numbers for your country
   - Update embassy/consulate contact information
   - Replace medical facility information with local options
   - Add correct base/port security contacts

CRITICAL VERIFICATION NEEDED:
□ Emergency numbers are correct for your country
□ Embassy contact information is accurate and current
□ Medical facilities exist and contact info is correct
□ All phone numbers include proper country codes
□ Base/port security contacts are up to date

TESTING CHECKLIST:
□ All transport options reflect actual available methods
□ Regional destinations are relevant for crew/liberty travel
□ Airport information is accurate for crew changes
□ Safety problems address real risks at your port
□ Emergency contacts are all verified and current
□ Contact tips reflect local communication challenges

FINAL REMINDER:
The Safety section contains critical information that could save lives or prevent career-ending incidents. Take extra care to ensure accuracy and completeness.
===============================================================================
*/
  // =============================================================================
  // FINAL TEMPLATE NOTES
  // =============================================================================
  /*
WHAT'S INCLUDED IN SECTION 4:
✓ Complete Hero Section with breadcrumbs
✓ Interactive navigation menu
✓ Overview section with map container
✓ Port highlights and quick facts
✓ Currency converter
✓ Know Before You Go information
✓ Food section with clickable venue carousels
✓ Modal integration for venue details
✓ Responsive design components

STILL NEEDED (create additional sections as needed):
- Nightlife section with hangsAndDives and higherEnergy carousels  
- Operations section with port-specific information
- Transportation section with local transport options
- Safety section with local guidelines and contacts

DEPLOYMENT CHECKLIST:
□ All TODO comments addressed and removed
□ All placeholder content replaced with real data
□ Venue arrays populated with actual restaurants/bars
□ Coordinates tested on map
□ Modal popups tested for all venue types
□ Currency converter configured for correct currency pair
□ Weather API configured for correct coordinates
□ Breadcrumb links match your folder structure
□ All sections customized for your specific port

TESTING BEFORE DEPLOYMENT:
1. Run locally and test all interactive features
2. Click all venue cards to test modals
3. Verify map shows all venues with correct colors
4. Test currency converter
5. Navigate through all tabs
6. Check responsive design on mobile
*/
}
