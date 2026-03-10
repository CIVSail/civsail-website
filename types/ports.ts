/**
 * @file ports.ts
 * @description TypeScript types for the ports globe feature
 *
 * Defines the data structures for ~3,900 world ports displayed on the
 * interactive globe, including their page status (full guide, basic page,
 * or no page yet).
 */

// Three-tier system for port page status
export type PortPageStatus = 'full_guide' | 'basic_page' | 'none';

// Filter options for the globe UI
// 'coverage' = ports with pages (full_guide + basic_page) - DEFAULT
// 'all' = all worldwide ports
export type PortFilterOption = 'coverage' | 'all';

/**
 * Port record from the database
 */
export interface Port {
  id: string;
  city: string;
  state: string | null;
  country: string;
  latitude: number;
  longitude: number;
  utc_offset: number | null;
  has_dst: boolean;
  regulation_14: boolean;
  regulation_13: boolean;
  slug: string | null;
  page_status: PortPageStatus;
  display_name: string | null;
  region: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Minimal port data for the globe (reduces payload size)
 * Used when we don't need all fields
 */
export interface PortMinimal {
  id: string;
  city: string;
  state: string | null;
  country: string;
  latitude: number;
  longitude: number;
  slug: string | null;
  page_status: PortPageStatus;
  display_name: string | null;
  region: string | null;
}

/**
 * Counts for filter dropdown
 */
export interface PortFilterCounts {
  total: number;
  fullGuide: number;
  basicPage: number;
  coverage: number; // fullGuide + basicPage
  none: number;
}

/**
 * GeoJSON Feature for a single port
 * Used by Mapbox for rendering markers
 */
export interface PortFeature {
  type: 'Feature';
  geometry: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude] - Mapbox order!
  };
  properties: {
    id: string;
    city: string;
    state: string | null;
    country: string;
    slug: string | null;
    page_status: PortPageStatus;
    display_name: string | null;
    region: string | null;
    // Include coordinates in properties for popup access
    latitude: number;
    longitude: number;
  };
}

/**
 * GeoJSON FeatureCollection for all ports
 * Passed to Mapbox as a source
 */
export interface PortFeatureCollection {
  type: 'FeatureCollection';
  features: PortFeature[];
}

/**
 * Props for the PortsGlobe component
 */
export interface PortsGlobeProps {
  ports: PortMinimal[];
  initialFilter?: PortFilterOption;
  highlightPort?: string; // city name to highlight on load
  onFilterChange?: (filter: PortFilterOption) => void;
}

/**
 * Props for the filter dropdown
 */
export interface PortsFilterProps {
  currentFilter: PortFilterOption;
  counts: PortFilterCounts;
  onChange: (filter: PortFilterOption) => void;
}

/**
 * Props for search component
 */
export interface PortsSearchProps {
  ports: PortMinimal[];
  onSelectPort: (port: PortMinimal) => void;
}

/**
 * Raw port data from the world_ports GitHub dataset
 * Used during import process
 */
export interface RawPortData {
  CITY: string;
  STATE: string | null;
  COUNTRY: string;
  LATITUDE: number;
  LONGITUDE: number;
  OFFSET: number | null;
  DST: boolean;
  Regulation_14: boolean;
  Regulation_13: boolean;
}

/**
 * Port update payload for marking existing ports
 */
export interface PortUpdate {
  city: string;
  country: string;
  slug: string;
  page_status: PortPageStatus;
  region: string;
  display_name?: string;
}
