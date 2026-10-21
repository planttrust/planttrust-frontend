'use client';

/* ─── GeofenceMap Component (Leaflet) ────────────────────────────────────
 * Interactive Map visualization for Module 4 (Company Portal & Geofencing)
 * Renders GPS polygon boundary, centroid, telemetry test pin, and supports
 * point-in-polygon verification.
 * ──────────────────────────────────────────────────────────────────────── */

import { useEffect, useRef } from 'react';
import type { LatLngCoord } from '@/types';

interface GeofenceMapProps {
  polygonCoordinates: LatLngCoord[];
  centroid: { lat: number; lng: number };
  testCoordinate?: { lat: number; lng: number; isInside?: boolean } | null;
  onPointSelect?: (lat: number, lng: number) => void;
  height?: string;
}

export default function GeofenceMap({
  polygonCoordinates,
  centroid,
  testCoordinate,
  onPointSelect,
  height = '360px',
}: GeofenceMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const polygonLayerRef = useRef<any>(null);
  const testMarkerRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !mapContainerRef.current) return;

    let isMounted = true;

    async function initMap() {
      const L = (await import('leaflet')).default;

      if (!isMounted || !mapContainerRef.current) return;

      // Fix default Leaflet icon paths
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });

      // Clear existing instance if any
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      // Initialize Leaflet Map
      const map = L.map(mapContainerRef.current, {
        center: [centroid.lat, centroid.lng],
        zoom: 15,
        attributionControl: false,
      });

      mapInstanceRef.current = map;

      // Dark / Satellite tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
      }).addTo(map);

      // Render polygon boundary
      const polygon = L.polygon(polygonCoordinates as [number, number][], {
        color: '#10b981',
        weight: 3,
        fillColor: '#10b981',
        fillOpacity: 0.25,
      }).addTo(map);

      polygon.bindPopup('<b>Registered Parcel Boundary</b><br>GPS Polygon Anchored on XRPL');
      polygonLayerRef.current = polygon;

      // Fit map to polygon
      map.fitBounds(polygon.getBounds(), { padding: [20, 20] });

      // Click event for testing custom points
      if (onPointSelect) {
        map.on('click', (e: any) => {
          onPointSelect(Number(e.latlng.lat.toFixed(5)), Number(e.latlng.lng.toFixed(5)));
        });
      }
    }

    initMap();

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [centroid.lat, centroid.lng, polygonCoordinates, onPointSelect]);

  // Update test marker when testCoordinate changes
  useEffect(() => {
    if (!mapInstanceRef.current || !testCoordinate) return;

    import('leaflet').then((L) => {
      const map = mapInstanceRef.current;
      if (!map) return;

      if (testMarkerRef.current) {
        map.removeLayer(testMarkerRef.current);
        testMarkerRef.current = null;
      }

      const isInside = testCoordinate.isInside;
      const markerColor = isInside ? '#10b981' : '#f43f5e';

      const customIcon = L.divIcon({
        className: 'custom-map-pin',
        html: `<div style="background-color: ${markerColor}; width: 18px; height: 18px; border-radius: 50%; border: 3px solid #ffffff; box-shadow: 0 0 12px ${markerColor};"></div>`,
        iconSize: [18, 18],
        iconAnchor: [9, 9],
      });

      const marker = L.marker([testCoordinate.lat, testCoordinate.lng], { icon: customIcon }).addTo(map);
      marker.bindPopup(
        `<b>Telemetry GPS Pin</b><br>Lat: ${testCoordinate.lat}<br>Lng: ${testCoordinate.lng}<br>Status: ${
          isInside ? '<span style="color:#10b981;">INSIDE Boundary</span>' : '<span style="color:#f43f5e;">OUTSIDE Boundary</span>'
        }`
      );
      marker.openPopup();
      testMarkerRef.current = marker;
    });
  }, [testCoordinate]);

  return (
    <div className="relative rounded-xl overflow-hidden border border-[var(--border-subtle)] shadow-lg">
      <div ref={mapContainerRef} style={{ width: '100%', height }} />
      <div className="absolute bottom-2 left-2 z-[1000] bg-[rgba(6,11,19,0.85)] backdrop-blur-md px-2.5 py-1 rounded text-xs text-slate-300 border border-white/10">
        💡 Click anywhere on the map to test GPS point
      </div>
    </div>
  );
}
