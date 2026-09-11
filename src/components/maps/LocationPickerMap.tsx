import React, { useEffect, useRef } from 'react';
import L from 'leaflet';

interface LocationPickerMapProps {
  latitude: number;
  longitude: number;
  onLocationSelect: (lat: number, lng: number) => void;
  className?: string;
}

export const LocationPickerMap: React.FC<LocationPickerMapProps> = ({
  latitude,
  longitude,
  onLocationSelect,
  className = 'h-64 sm:h-80 w-full rounded-xl'
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current).setView([latitude, longitude], 14);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);

      const customIcon = L.divIcon({
        className: 'custom-pin-marker',
        html: `<div style="background-color: #16a34a; width: 26px; height: 26px; border-radius: 50%; border: 3px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.35); display: flex; align-items: center; justify-content: center;"><div style="width: 8px; height: 8px; background-color: white; border-radius: 50%;"></div></div>`,
        iconSize: [26, 26],
        iconAnchor: [13, 13]
      });

      const marker = L.marker([latitude, longitude], {
        draggable: true,
        icon: customIcon
      }).addTo(map);

      marker.on('dragend', () => {
        const pos = marker.getLatLng();
        onLocationSelect(Number(pos.lat.toFixed(6)), Number(pos.lng.toFixed(6)));
      });

      map.on('click', (e: L.LeafletMouseEvent) => {
        marker.setLatLng(e.latlng);
        onLocationSelect(Number(e.latlng.lat.toFixed(6)), Number(e.latlng.lng.toFixed(6)));
      });

      mapInstanceRef.current = map;
      markerRef.current = marker;
    } else {
      mapInstanceRef.current.setView([latitude, longitude], mapInstanceRef.current.getZoom());
      if (markerRef.current) {
        markerRef.current.setLatLng([latitude, longitude]);
      }
    }
  }, [latitude, longitude, onLocationSelect]);

  return (
    <div className="relative">
      <div ref={mapContainerRef} className={`${className} z-0 shadow-inner border border-slate-300`} />
      <div className="absolute bottom-2 left-2 z-10 bg-white/90 backdrop-blur-xs text-[10px] text-slate-700 px-2 py-1 rounded shadow border border-slate-200">
        📍 Drag pin or click map to adjust exact spot
      </div>
    </div>
  );
};
