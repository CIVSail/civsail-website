/**
 * @file PortsGlobe.tsx
 * @description Interactive 3D globe with ~3,900 port markers
 *
 * Features:
 * - Globe projection with atmosphere effect
 * - Clustering for performance at low zoom
 * - Three-tier color coding (green/yellow/gray)
 * - Click popups with navigation
 * - Subtle auto-rotation on load
 * - Fly-to animation for search/highlighting
 *
 * @note Uses mapbox-gl directly (not react-map-gl) for performance
 */

'use client';

import { useEffect, useRef, useCallback, useMemo } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { PortMinimal, PortFilterOption } from '@/types/ports';
import {
  portsToGeoJSON,
  PAGE_STATUS_COLOR_EXPRESSION,
  PAGE_STATUS_COLORS,
} from '@/lib/ports/geojson';

interface PortsGlobeProps {
  ports: PortMinimal[];
  filter: PortFilterOption;
  highlightPort?: string | null;
  onMapReady?: () => void;
  onError?: (error: Error) => void;
}

// Source and layer IDs
const SOURCE_ID = 'ports';
const CLUSTER_LAYER = 'clusters';
const CLUSTER_COUNT_LAYER = 'cluster-count';
const UNCLUSTERED_LAYER = 'unclustered-ports';

export default function PortsGlobe({
  ports,
  filter,
  highlightPort,
  onMapReady,
  onError,
}: PortsGlobeProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const popup = useRef<mapboxgl.Popup | null>(null);
  const isRotating = useRef(true);
  const animationFrame = useRef<number | null>(null);

  // Convert ports to GeoJSON (memoized)
  // When showing 'coverage', filter to only ports with pages
  const geojson = useMemo(() => {
    if (filter === 'coverage') {
      const coveragePorts = ports.filter(
        (p) => p.page_status === 'full_guide' || p.page_status === 'basic_page'
      );
      return portsToGeoJSON(coveragePorts);
    }
    return portsToGeoJSON(ports);
  }, [ports, filter]);

  // Initialize map
  useEffect(() => {
    if (map.current) return; // Already initialized
    if (!mapContainer.current) return;

    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    if (!token) {
      onError?.(new Error('Mapbox token not found'));
      return;
    }

    try {
      mapboxgl.accessToken = token;

      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/dark-v11',
        projection: 'globe',
        center: [0, 20], // Start centered on Atlantic
        zoom: 1.5,
        minZoom: 1,
        maxZoom: 18,
      });

      const m = map.current;

      // Globe atmosphere effect
      m.on('style.load', () => {
        m.setFog({
          color: 'rgb(186, 210, 235)',
          'high-color': 'rgb(36, 92, 223)',
          'horizon-blend': 0.02,
          'space-color': 'rgb(11, 11, 25)',
          'star-intensity': 0.6,
        });
      });

      // Add sources and layers when map loads
      m.on('load', () => {
        // Add clustered source
        m.addSource(SOURCE_ID, {
          type: 'geojson',
          data: geojson,
          cluster: true,
          clusterMaxZoom: 14,
          clusterRadius: 50,
        });

        // Cluster circles
        m.addLayer({
          id: CLUSTER_LAYER,
          type: 'circle',
          source: SOURCE_ID,
          filter: ['has', 'point_count'],
          paint: {
            // Graduated sizes based on point count
            'circle-radius': [
              'step',
              ['get', 'point_count'],
              20,   // Base size
              100, 30,  // 100+ points
              750, 40,  // 750+ points
            ],
            'circle-color': PAGE_STATUS_COLORS.cluster,
            'circle-stroke-width': 2,
            'circle-stroke-color': '#0f172a',
            'circle-opacity': 0.9,
          },
        });

        // Cluster count labels
        m.addLayer({
          id: CLUSTER_COUNT_LAYER,
          type: 'symbol',
          source: SOURCE_ID,
          filter: ['has', 'point_count'],
          layout: {
            'text-field': ['get', 'point_count_abbreviated'],
            'text-font': ['DIN Pro Medium', 'Arial Unicode MS Bold'],
            'text-size': 12,
          },
          paint: {
            'text-color': '#ffffff',
          },
        });

        // Unclustered port markers
        m.addLayer({
          id: UNCLUSTERED_LAYER,
          type: 'circle',
          source: SOURCE_ID,
          filter: ['!', ['has', 'point_count']],
          paint: {
            'circle-radius': 6,
            'circle-color': PAGE_STATUS_COLOR_EXPRESSION,
            'circle-stroke-width': 1.5,
            'circle-stroke-color': '#0f172a',
            'circle-opacity': 0.9,
          },
        });

        // Hide cluster layers initially if showing coverage (small dataset)
        if (filter === 'coverage') {
          m.setLayoutProperty(CLUSTER_LAYER, 'visibility', 'none');
          m.setLayoutProperty(CLUSTER_COUNT_LAYER, 'visibility', 'none');
        }

        onMapReady?.();
      });

      // Cluster click - zoom in
      m.on('click', CLUSTER_LAYER, (e) => {
        const features = m.queryRenderedFeatures(e.point, { layers: [CLUSTER_LAYER] });
        if (!features.length) return;

        const clusterId = features[0].properties?.cluster_id;
        const source = m.getSource(SOURCE_ID) as mapboxgl.GeoJSONSource;

        source.getClusterExpansionZoom(clusterId, (err, zoom) => {
          if (err) return;

          m.easeTo({
            center: (features[0].geometry as GeoJSON.Point).coordinates as [number, number],
            zoom: zoom ?? m.getZoom() + 2,
            duration: 500,
          });
        });
      });

      // Port marker click - show popup
      m.on('click', UNCLUSTERED_LAYER, (e) => {
        const features = m.queryRenderedFeatures(e.point, { layers: [UNCLUSTERED_LAYER] });
        if (!features.length) return;

        const props = features[0].properties;
        if (!props) return;

        const coords = (features[0].geometry as GeoJSON.Point).coordinates.slice() as [number, number];
        const displayName = props.display_name || props.city;

        // Build popup HTML based on page_status
        const popupHtml = buildPopupHtml(props);

        // Close existing popup
        popup.current?.remove();

        // Create new popup
        popup.current = new mapboxgl.Popup({
          closeButton: true,
          closeOnClick: true,
          maxWidth: '280px',
          className: 'ports-globe-popup',
        })
          .setLngLat(coords)
          .setHTML(popupHtml)
          .addTo(m);
      });

      // Cursor styles
      m.on('mouseenter', CLUSTER_LAYER, () => {
        m.getCanvas().style.cursor = 'pointer';
      });
      m.on('mouseleave', CLUSTER_LAYER, () => {
        m.getCanvas().style.cursor = '';
      });
      m.on('mouseenter', UNCLUSTERED_LAYER, () => {
        m.getCanvas().style.cursor = 'pointer';
      });
      m.on('mouseleave', UNCLUSTERED_LAYER, () => {
        m.getCanvas().style.cursor = '';
      });

      // Stop rotation on user interaction
      m.on('mousedown', () => {
        isRotating.current = false;
      });
      m.on('touchstart', () => {
        isRotating.current = false;
      });
      m.on('wheel', () => {
        isRotating.current = false;
      });

      // Start subtle rotation
      startRotation(m);

    } catch (err) {
      onError?.(err instanceof Error ? err : new Error('Failed to initialize map'));
    }

    // Cleanup
    return () => {
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }
      popup.current?.remove();
      map.current?.remove();
      map.current = null;
    };
  }, []); // Only run once on mount

  // Update source data and layer visibility when filter changes
  useEffect(() => {
    if (!map.current?.isStyleLoaded()) return;

    const m = map.current;
    const source = m.getSource(SOURCE_ID) as mapboxgl.GeoJSONSource;

    if (source) {
      // Update source with filtered or full data
      source.setData(geojson);

      // Toggle cluster layer visibility based on filter
      // Hide clusters for 'coverage' (small dataset), show for 'all'
      const showClusters = filter === 'all';
      m.setLayoutProperty(CLUSTER_LAYER, 'visibility', showClusters ? 'visible' : 'none');
      m.setLayoutProperty(CLUSTER_COUNT_LAYER, 'visibility', showClusters ? 'visible' : 'none');

      // Reset filter on unclustered layer - data is already filtered in source
      m.setFilter(UNCLUSTERED_LAYER, ['!', ['has', 'point_count']]);
    }
  }, [filter, geojson]);

  // Fly to highlighted port
  useEffect(() => {
    if (!highlightPort || !map.current) return;

    const port = ports.find(
      (p) =>
        p.city.toLowerCase() === highlightPort.toLowerCase() ||
        p.display_name?.toLowerCase() === highlightPort.toLowerCase()
    );

    if (port) {
      flyToPort(port);
    }
  }, [highlightPort, ports]);

  // Subtle rotation animation
  const startRotation = useCallback((m: mapboxgl.Map) => {
    const rotationSpeed = 0.1; // degrees per frame

    function rotate() {
      if (!isRotating.current || !m) return;

      const center = m.getCenter();
      center.lng += rotationSpeed;
      m.setCenter(center);

      animationFrame.current = requestAnimationFrame(rotate);
    }

    // Start after a short delay
    setTimeout(() => {
      if (isRotating.current) {
        rotate();
      }
    }, 1000);

    // Stop after 4 seconds
    setTimeout(() => {
      isRotating.current = false;
    }, 4000);
  }, []);

  // Fly to a specific port
  const flyToPort = useCallback((port: PortMinimal) => {
    if (!map.current) return;

    isRotating.current = false;

    map.current.flyTo({
      center: [port.longitude, port.latitude],
      zoom: 10,
      duration: 2000,
      essential: true,
    });

    // Show popup after fly animation
    setTimeout(() => {
      if (!map.current) return;

      const popupHtml = buildPopupHtml({
        city: port.city,
        country: port.country,
        state: port.state,
        page_status: port.page_status,
        slug: port.slug,
        display_name: port.display_name,
        latitude: port.latitude,
        longitude: port.longitude,
      });

      popup.current?.remove();
      popup.current = new mapboxgl.Popup({
        closeButton: true,
        closeOnClick: true,
        maxWidth: '280px',
        className: 'ports-globe-popup',
      })
        .setLngLat([port.longitude, port.latitude])
        .setHTML(popupHtml)
        .addTo(map.current!);
    }, 2100);
  }, []);

  // Expose flyToPort for parent component
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).__portsGlobeFlyTo = flyToPort;
    }
    return () => {
      if (typeof window !== 'undefined') {
        delete (window as any).__portsGlobeFlyTo;
      }
    };
  }, [flyToPort]);

  return (
    <>
      <div
        ref={mapContainer}
        className="w-full h-[600px] md:h-[700px] rounded-2xl overflow-hidden"
      />

      {/* Custom popup styles */}
      <style jsx global>{`
        .ports-globe-popup .mapboxgl-popup-content {
          background: #1e293b;
          color: white;
          border-radius: 12px;
          padding: 16px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
          border: 1px solid #334155;
        }
        .ports-globe-popup .mapboxgl-popup-close-button {
          color: #94a3b8;
          font-size: 20px;
          padding: 4px 8px;
        }
        .ports-globe-popup .mapboxgl-popup-close-button:hover {
          color: white;
          background: transparent;
        }
        .ports-globe-popup .mapboxgl-popup-tip {
          border-top-color: #1e293b;
        }
        .ports-globe-popup a.popup-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          background: #3b82f6;
          color: white;
          border-radius: 8px;
          font-weight: 500;
          font-size: 14px;
          text-decoration: none;
          transition: background 0.2s;
        }
        .ports-globe-popup a.popup-btn:hover {
          background: #2563eb;
        }
        .ports-globe-popup a.popup-btn-secondary {
          background: #475569;
        }
        .ports-globe-popup a.popup-btn-secondary:hover {
          background: #64748b;
        }
      `}</style>
    </>
  );
}

/**
 * Build popup HTML based on port properties
 */
function buildPopupHtml(props: Record<string, any>): string {
  const displayName = props.display_name || props.city;
  const country = props.country;
  const state = props.state;
  const pageStatus = props.page_status as 'full_guide' | 'basic_page' | 'none';
  const slug = props.slug;
  const lat = props.latitude;
  const lng = props.longitude;

  const location = state ? `${state}, ${country}` : country;

  // Status indicator
  const statusColor = PAGE_STATUS_COLORS[pageStatus];
  const statusLabel =
    pageStatus === 'full_guide'
      ? 'Full Port Guide'
      : pageStatus === 'basic_page'
        ? 'Basic Info Available'
        : 'No guide yet';

  // Build content based on status
  let content = `
    <div style="min-width: 200px;">
      <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
        <span style="font-size: 24px;">📍</span>
        <div>
          <h3 style="margin: 0; font-size: 18px; font-weight: 600;">${displayName}</h3>
          <p style="margin: 0; color: #94a3b8; font-size: 14px;">${location}</p>
        </div>
      </div>
      <hr style="border: none; border-top: 1px solid #334155; margin: 12px 0;" />
      <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px;">
        <span style="width: 10px; height: 10px; border-radius: 50%; background: ${statusColor};"></span>
        <span style="color: #cbd5e1; font-size: 14px;">${statusLabel}</span>
      </div>
  `;

  if (pageStatus === 'full_guide' && slug) {
    content += `
      <a href="/ports/${slug}" class="popup-btn">
        View Guide
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M5 12h14M12 5l7 7-7 7"/>
        </svg>
      </a>
    `;
  } else if (pageStatus === 'basic_page' && slug) {
    content += `
      <div style="display: flex; flex-direction: column; gap: 8px;">
        <a href="/ports/${slug}" class="popup-btn">
          View Page
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </a>
        <a href="/contribute?port=${encodeURIComponent(displayName)}&country=${encodeURIComponent(country)}" class="popup-btn popup-btn-secondary">
          Help Improve This Page
        </a>
      </div>
    `;
  } else {
    // No page yet
    content += `
      <div style="color: #94a3b8; font-size: 13px; margin-bottom: 12px;">
        <strong>Coordinates:</strong><br/>
        ${lat?.toFixed(4)}°${lat >= 0 ? 'N' : 'S'}, ${Math.abs(lng)?.toFixed(4)}°${lng >= 0 ? 'E' : 'W'}
      </div>
      <a href="/contribute?port=${encodeURIComponent(displayName)}&country=${encodeURIComponent(country)}" class="popup-btn">
        Contribute Info
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M5 12h14M12 5l7 7-7 7"/>
        </svg>
      </a>
    `;
  }

  content += '</div>';
  return content;
}
