/**
 * @file lookup.ts
 * @description Utility functions for looking up port data
 *
 * Helper functions for finding ports by various criteria, useful when
 * building new port pages or validating data.
 */

import { createClient } from '@/lib/supabase/server';
import { Port, PortPageStatus } from '@/types/ports';

/**
 * Look up a port's coordinates by city and country
 * Useful when building new port pages - get lat/lng from the dataset
 *
 * @param city - City name (must match dataset)
 * @param country - Country name (must match dataset)
 * @returns Coordinates and timezone info, or null if not found
 */
export async function getPortCoordinates(
  city: string,
  country: string
): Promise<{
  latitude: number;
  longitude: number;
  utc_offset: number | null;
  has_dst: boolean;
} | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('ports')
    .select('latitude, longitude, utc_offset, has_dst')
    .eq('city', city)
    .eq('country', country)
    .single();

  if (error || !data) {
    return null;
  }

  return {
    latitude: data.latitude,
    longitude: data.longitude,
    utc_offset: data.utc_offset,
    has_dst: data.has_dst,
  };
}

/**
 * Look up a port by its URL slug
 *
 * @param slug - URL path like 'far-east/guam'
 * @returns Full port data or null
 */
export async function getPortBySlug(slug: string): Promise<Port | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('ports')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error || !data) {
    return null;
  }

  return data;
}

/**
 * Update a port's CIVSail-specific fields
 * For admin use when marking ports as having pages
 *
 * @param city - City name
 * @param country - Country name
 * @param updates - Fields to update
 * @returns Success status and any error message
 */
export async function updatePortStatus(
  city: string,
  country: string,
  updates: Partial<{
    page_status: PortPageStatus;
    slug: string;
    region: string;
    display_name: string;
  }>
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();

  const { error } = await supabase
    .from('ports')
    .update(updates)
    .eq('city', city)
    .eq('country', country);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

/**
 * Find ports near a given coordinate
 * Useful for "nearby ports" features
 *
 * @param latitude - Center latitude
 * @param longitude - Center longitude
 * @param radiusDegrees - Search radius in degrees (roughly 1 degree = 111km)
 * @param limit - Max results
 * @returns Array of nearby ports sorted by approximate distance
 */
export async function findNearbyPorts(
  latitude: number,
  longitude: number,
  radiusDegrees: number = 2,
  limit: number = 10
): Promise<Port[]> {
  const supabase = await createClient();

  // Simple bounding box query (not true distance, but fast)
  const { data, error } = await supabase
    .from('ports')
    .select('*')
    .gte('latitude', latitude - radiusDegrees)
    .lte('latitude', latitude + radiusDegrees)
    .gte('longitude', longitude - radiusDegrees)
    .lte('longitude', longitude + radiusDegrees)
    .limit(limit);

  if (error || !data) {
    return [];
  }

  // Sort by approximate distance (Euclidean, good enough for nearby)
  return data.sort((a, b) => {
    const distA = Math.sqrt(
      Math.pow(a.latitude - latitude, 2) + Math.pow(a.longitude - longitude, 2)
    );
    const distB = Math.sqrt(
      Math.pow(b.latitude - latitude, 2) + Math.pow(b.longitude - longitude, 2)
    );
    return distA - distB;
  });
}

/**
 * Get all unique regions that have ports
 * Useful for building region navigation
 *
 * @returns Array of unique region names
 */
export async function getAllRegions(): Promise<string[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('ports')
    .select('region')
    .not('region', 'is', null)
    .order('region');

  if (error || !data) {
    return [];
  }

  // Get unique regions
  const regions = [...new Set(data.map((p) => p.region).filter(Boolean))];
  return regions as string[];
}

/**
 * Get all unique countries
 * Useful for country-based navigation
 *
 * @returns Array of unique country names
 */
export async function getAllCountries(): Promise<string[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('ports')
    .select('country')
    .order('country');

  if (error || !data) {
    return [];
  }

  // Get unique countries
  return [...new Set(data.map((p) => p.country))];
}

/**
 * Check if a port exists in the database
 * Useful for validation before creating pages
 *
 * @param city - City name
 * @param country - Country name
 * @returns True if port exists
 */
export async function portExists(city: string, country: string): Promise<boolean> {
  const supabase = await createClient();

  const { count, error } = await supabase
    .from('ports')
    .select('*', { count: 'exact', head: true })
    .eq('city', city)
    .eq('country', country);

  if (error) {
    return false;
  }

  return (count || 0) > 0;
}
