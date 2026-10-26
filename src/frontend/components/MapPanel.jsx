import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Navigation, Maximize2, Minimize2, ExternalLink } from 'lucide-react';

// Custom SVG Pin Generator using warm orange and amber colors (zero blue)
const createPinIcon = (isSelected = false) => {
  const pinColor = isSelected ? '#FF933E' : '#D97706';
  const pulseClass = isSelected ? 'map-pin-pulse' : '';

  const svgHtml = `
    <div style="position: relative; width: 34px; height: 34px; display: flex; align-items: center; justify-content: center;">
      ${
        isSelected
          ? `<div class="${pulseClass}" style="position: absolute; width: 38px; height: 38px; border-radius: 50%; background: rgba(255, 147, 62, 0.35);"></div>`
          : ''
      }
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="filter: drop-shadow(0 2px 5px rgba(53,43,35,0.25));">
        <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2Z" fill="${pinColor}" stroke="#ffffff" stroke-width="1.5"/>
        <circle cx="12" cy="9" r="3" fill="#ffffff"/>
      </svg>
    </div>
  `;

  return L.divIcon({
    html: svgHtml,
    className: 'custom-map-pin',
    iconSize: [34, 34],
    iconAnchor: [17, 34],
    popupAnchor: [0, -32]
  });
};

export default function MapPanel({
  attractions = [],
  selectedAttraction,
  onSelectAttraction,
  destLat,
  destLon,
  destinationName,
  format,
  isCollapsed,
  onToggleCollapse
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef(new Map());
  const [mapReady, setMapReady] = useState(false);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    try {
      const initialLat = destLat || 40.7128;
      const initialLon = destLon || -74.006;

      const map = L.map(mapContainerRef.current, {
        center: [initialLat, initialLon],
        zoom: 13,
        zoomControl: true,
        attributionControl: true
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19
      }).addTo(map);

      mapInstanceRef.current = map;
      setMapReady(true);
    } catch (err) {
      console.warn('Leaflet map initialization warning:', err);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Markers when attractions change
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !mapReady) return;

    // Clear old markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current.clear();

    const validAttractions = attractions.filter(
      (a) => a.lat != null && a.lon != null && !isNaN(a.lat) && !isNaN(a.lon)
    );

    if (validAttractions.length === 0) {
      if (destLat && destLon) {
        map.setView([destLat, destLon], 12);
      }
      return;
    }

    const bounds = L.latLngBounds();

    validAttractions.forEach((attraction) => {
      const isSelected = selectedAttraction?.id === attraction.id;
      const marker = L.marker([attraction.lat, attraction.lon], {
        icon: createPinIcon(isSelected)
      }).addTo(map);

      // Popup content with warm color palette
      const popupHtml = `
        <div style="font-family: 'Plus Jakarta Sans', sans-serif; padding: 2px; max-width: 200px;">
          <h4 style="margin: 0 0 4px 0; font-size: 13px; font-weight: 700; color: #352B23;">${attraction.name}</h4>
          <span style="font-size: 11px; background: #FFE9A9; color: #352B23; padding: 2px 6px; border-radius: 4px; font-weight: 600;">${attraction.category}</span>
          ${
            attraction.distanceMeters
              ? `<p style="margin: 6px 0 0 0; font-size: 11px; color: #FF933E; font-weight: 600;">~${(
                  attraction.distanceMeters / 1000
                ).toFixed(1)} km away</p>`
              : ''
          }
        </div>
      `;
      marker.bindPopup(popupHtml);

      marker.on('click', () => {
        onSelectAttraction(attraction);
      });

      markersRef.current.set(attraction.id, marker);
      bounds.extend([attraction.lat, attraction.lon]);
    });

    if (destLat && destLon) {
      bounds.extend([destLat, destLon]);
    }

    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [30, 30], maxZoom: 15 });
    }
  }, [attractions, mapReady, destLat, destLon]);

  // Handle selected attraction pan/zoom
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !mapReady || !selectedAttraction) return;

    markersRef.current.forEach((marker, id) => {
      const isSelected = id === selectedAttraction.id;
      marker.setIcon(createPinIcon(isSelected));
      if (isSelected) {
        marker.openPopup();
      }
    });

    if (selectedAttraction.lat != null && selectedAttraction.lon != null) {
      map.flyTo([selectedAttraction.lat, selectedAttraction.lon], 14, {
        duration: 0.8
      });
    }
  }, [selectedAttraction, mapReady]);

  // Invalidate size on resize or collapse toggle
  useEffect(() => {
    if (mapInstanceRef.current) {
      setTimeout(() => {
        mapInstanceRef.current?.invalidateSize();
      }, 200);
    }
  }, [isCollapsed, format]);

  if (isCollapsed) {
    return (
      <div
        style={{
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: '12px',
          padding: '10px 14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '16px',
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 600, color: 'var(--color-text)' }}>
          <MapPin size={16} color="var(--color-primary)" />
          <span>Interactive Map ({attractions.length} pins)</span>
        </div>
        <button
          type="button"
          onClick={onToggleCollapse}
          className="btn-secondary"
          style={{ padding: '5px 10px', fontSize: '12px' }}
        >
          <Maximize2 size={13} />
          <span>Show Map</span>
        </button>
      </div>
    );
  }

  return (
    <div
      className="tourism-card"
      style={{
        height: format === 'sidebar' ? '280px' : '420px',
        position: 'relative',
        marginBottom: '16px',
        overflow: 'hidden'
      }}
    >
      {/* Map header toolbar */}
      <div
        style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          zIndex: 400,
          display: 'flex',
          gap: '6px'
        }}
      >
        {onToggleCollapse && (
          <button
            type="button"
            onClick={onToggleCollapse}
            className="btn-secondary"
            title="Collapse Map"
            style={{
              padding: '6px',
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(4px)',
              boxShadow: '0 2px 8px rgba(53,43,35,0.15)'
            }}
          >
            <Minimize2 size={14} />
          </button>
        )}
      </div>

      {/* Map Canvas */}
      <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />
    </div>
  );
}
