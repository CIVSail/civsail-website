/**
 * @file queries.ts
 * @description Supabase query functions for ports data
 *
 * These functions fetch port data from Supabase for use in the globe
 * visualization and port pages. Uses server-side client for SSR.
 */

import { createClient } from '@/lib/supabase/server';
import { Port, PortMinimal, PortFilterCounts, PortPageStatus } from '@/types/ports';

/**
 * Fetch all ports for the globe visualization
 * Returns minimal data to reduce payload size (~3,900 ports)
 *
 * @returns Array of ports with essential fields for rendering
 */
export async function fetchAllPorts(): Promise<PortMinimal[]> {
  const supabase = await createClient();

  // Order by page_status to ensure ports with pages come first (within 1000 limit)
  // This ensures full_guide and basic_page ports are always fetched
  const { data, error } = await supabase
    .from('ports')
    .select(`
      id,
      city,
      state,
      country,
      latitude,
      longitude,
      slug,
      page_status,
      display_name,
      region
    `)
    .order('page_status', { ascending: true }) // full_guide, basic_page, none (alphabetical)
    .order('city', { ascending: true });

  if (error) {
    console.error('Error fetching ports:', error.message);
    return [];
  }

  return data || [];
}

/**
 * Fetch a single port by slug
 * Used for individual port pages
 *
 * @param slug - The port's URL slug (e.g., 'far-east/guam')
 * @returns Full port data or null if not found
 */
export async function fetchPortBySlug(slug: string): Promise<Port | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('ports')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    // PGRST116 = "No rows found" - not actually an error
    if (error.code !== 'PGRST116') {
      console.error('Error fetching port by slug:', error.message);
    }
    return null;
  }

  return data;
}

/**
 * Fetch ports by region
 * Used for region landing pages
 *
 * @param region - The region identifier (e.g., 'far-east', 'europe')
 * @returns Array of ports in that region
 */
export async function fetchPortsByRegion(region: string): Promise<PortMinimal[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('ports')
    .select(`
      id,
      city,
      state,
      country,
      latitude,
      longitude,
      slug,
      page_status,
      display_name,
      region
    `)
    .eq('region', region)
    .order('city');

  if (error) {
    console.error('Error fetching ports by region:', error.message);
    return [];
  }

  return data || [];
}

/**
 * Fetch ports by page status
 * Useful for admin dashboards or filtered views
 *
 * @param status - The page status to filter by
 * @returns Array of ports with that status
 */
export async function fetchPortsByStatus(
  status: PortPageStatus
): Promise<PortMinimal[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('ports')
    .select(`
      id,
      city,
      state,
      country,
      latitude,
      longitude,
      slug,
      page_status,
      display_name,
      region
    `)
    .eq('page_status', status)
    .order('city');

  if (error) {
    console.error('Error fetching ports by status:', error.message);
    return [];
  }

  return data || [];
}

/**
 * Calculate filter counts from a ports array
 * Called once on the server to avoid client-side recalculation
 *
 * @param ports - Array of ports to count
 * @returns Object with counts for each filter option
 */
export function calculateFilterCounts(ports: PortMinimal[]): PortFilterCounts {
  const fullGuide = ports.filter((p) => p.page_status === 'full_guide').length;
  const basicPage = ports.filter((p) => p.page_status === 'basic_page').length;
  const none = ports.filter((p) => p.page_status === 'none').length;

  return {
    total: ports.length,
    fullGuide,
    basicPage,
    coverage: fullGuide + basicPage,
    none,
  };
}

/**
 * Search ports by name (for admin tools)
 * Case-insensitive search on city, country, and display_name
 *
 * @param query - Search string
 * @param limit - Max results to return (default 10)
 * @returns Array of matching ports
 */
export async function searchPorts(
  query: string,
  limit: number = 10
): Promise<PortMinimal[]> {
  const supabase = await createClient();

  // Use OR conditions for flexible search
  const { data, error } = await supabase
    .from('ports')
    .select(`
      id,
      city,
      state,
      country,
      latitude,
      longitude,
      slug,
      page_status,
      display_name,
      region
    `)
    .or(`city.ilike.%${query}%,country.ilike.%${query}%,display_name.ilike.%${query}%`)
    .limit(limit);

  if (error) {
    console.error('Error searching ports:', error.message);
    return [];
  }

  return data || [];
}

/**
 * Get port count by status (for dashboard stats)
 *
 * @returns Object with counts for each status
 */
export async function getPortStatusCounts(): Promise<{
  fullGuide: number;
  basicPage: number;
  none: number;
  total: number;
}> {
  const supabase = await createClient();

  // Get total count
  const { count: total } = await supabase
    .from('ports')
    .select('*', { count: 'exact', head: true });

  // Get counts by status using separate queries for accuracy
  const statuses: PortPageStatus[] = ['full_guide', 'basic_page', 'none'];
  const counts: Record<string, number> = {};

  for (const status of statuses) {
    const { count } = await supabase
      .from('ports')
      .select('*', { count: 'exact', head: true })
      .eq('page_status', status);

    counts[status] = count || 0;
  }

  return {
    fullGuide: counts.full_guide || 0,
    basicPage: counts.basic_page || 0,
    none: counts.none || 0,
    total: total || 0,
  };
}
