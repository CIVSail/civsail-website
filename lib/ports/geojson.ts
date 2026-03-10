/**
 * @file geojson.ts
 * @description GeoJSON conversion utilities for Mapbox
 *
 * Converts port data to GeoJSON format for use with Mapbox GL JS.
 * The globe component uses these functions to create map sources.
 */

import {
  PortMinimal,
  PortFeature,
  PortFeatureCollection,
  PortFilterOption,
} from '@/types/ports';

/**
 * Convert a single port to a GeoJSON Feature
 *
 * @note Mapbox uses [longitude, latitude] order (opposite of Google Maps!)
 */
export function portToFeature(port: PortMinimal): PortFeature {
  return {
    type: 'Feature',
    geometry: {
      type: 'Point',
      // CRITICAL: Mapbox uses [lng, lat], not [lat, lng]
      coordinates: [port.longitude, port.latitude],
    },
    properties: {
      id: port.id,
      city: port.city,
      state: port.state,
      country: port.country,
      slug: port.slug,
      page_status: port.page_status,
      display_name: port.display_name,
      region: port.region,
      // Include coordinates in properties for popup access
      latitude: port.latitude,
      longitude: port.longitude,
    },
  };
}

/**
 * Convert an array of ports to a GeoJSON FeatureCollection
 * This is the format Mapbox expects for a source
 *
 * @param ports - Array of ports to convert
 * @returns GeoJSON FeatureCollection
 */
export function portsToGeoJSON(ports: PortMinimal[]): PortFeatureCollection {
  return {
    type: 'FeatureCollection',
    features: ports.map(portToFeature),
  };
}

/**
 * Get the Mapbox filter expression for a given filter option
 * Used with map.setFilter() to show/hide ports by status
 *
 * @param filter - The active filter option
 * @returns Mapbox filter expression or null for "all"
 */
export function getFilterExpression(
  filter: PortFilterOption
): mapboxgl.FilterSpecification | null {
  switch (filter) {
    case 'all':
      // No filter - show everything
      return null;

    case 'coverage':
      // Show full_guide OR basic_page (ports with pages)
      return [
        'any',
        ['==', ['get', 'page_status'], 'full_guide'],
        ['==', ['get', 'page_status'], 'basic_page'],
      ];

    default:
      return null;
  }
}

/**
 * Mapbox expression for marker colors based on page_status
 * Used in the circle-color paint property
 */
export const PAGE_STATUS_COLOR_EXPRESSION: mapboxgl.ExpressionSpecification = [
  'match',
  ['get', 'page_status'],
  'full_guide', '#22c55e',  // Green - complete guide
  'basic_page', '#eab308',  // Gold/Yellow - basic page
  'none', '#6b7280',        // Gray - no page yet
  '#6b7280',                // Fallback to gray
];

/**
 * Color values for the legend and UI
 */
export const PAGE_STATUS_COLORS = {
  full_guide: '#22c55e',
  basic_page: '#eab308',
  none: '#6b7280',
  cluster: '#1e3a5a',
} as const;

/**
 * Labels for the filter toggle
 */
export const FILTER_LABELS: Record<PortFilterOption, string> = {
  coverage: 'Ports with Pages',
  all: 'All Worldwide Ports',
};

/**
 * Get display name for a port
 * Uses display_name override if set, otherwise city name
 */
export function getPortDisplayName(port: PortMinimal): string {
  return port.display_name || port.city;
}
