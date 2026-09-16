'use client';
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const iconUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png';
const iconRetinaUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png';
const shadowUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl,
  iconRetinaUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

interface MapPickerCoreProps {
  lat: string | null;
  lng: string | null;
  address?: string | null;
  onChange: (lat: string, lng: string) => void;
  onAddressFetch?: (address: string) => void;
}

function LocationMarker({ position, setPosition }: { position: L.LatLng | null, setPosition: (p: L.LatLng) => void }) {
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
    },
  });
  return position === null ? null : <Marker position={position} />;
}

function RecenterAutomatically({ lat, lng }: { lat: number, lng: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng]);
  }, [lat, lng, map]);
  return null;
}

export default function MapPickerCore({ lat, lng, address, onChange, onAddressFetch }: MapPickerCoreProps) {
  const [position, setPosition] = useState<L.LatLng | null>(null);
  const [lastFetchedAddress, setLastFetchedAddress] = useState<string | null>(null);

  useEffect(() => {
    if (lat && lng && !isNaN(Number(lat)) && !isNaN(Number(lng))) {
      setPosition(new L.LatLng(Number(lat), Number(lng)));
    }
  }, [lat, lng]);

  const handleSetPosition = async (newPos: L.LatLng) => {
    setPosition(newPos);
    onChange(newPos.lat.toString(), newPos.lng.toString());
    
    if (onAddressFetch) {
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${newPos.lat}&lon=${newPos.lng}&accept-language=ar,en`);
        const data = await res.json();
        if (data && data.display_name) {
          setLastFetchedAddress(data.display_name);
          onAddressFetch(data.display_name);
        }
      } catch (error) {
        console.error("Reverse geocoding failed", error);
      }
    }
  };

  useEffect(() => {
    if (!address || address.trim() === '' || address === lastFetchedAddress) return;

    const timeoutId = setTimeout(async () => {
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`);
        const data = await res.json();
        if (data && data.length > 0) {
          const newLat = parseFloat(data[0].lat);
          const newLng = parseFloat(data[0].lon);
          if (!isNaN(newLat) && !isNaN(newLng)) {
            const newPos = new L.LatLng(newLat, newLng);
            setPosition(newPos);
            onChange(newLat.toString(), newLng.toString());
            setLastFetchedAddress(address);
          }
        }
      } catch (error) {
        console.error("Forward geocoding failed", error);
      }
    }, 1500);

    return () => clearTimeout(timeoutId);
  }, [address, lastFetchedAddress, onChange]);

  const defaultCenter: [number, number] = [24.7136, 46.6753];
  const mapCenter = position ? [position.lat, position.lng] : defaultCenter;

  return (
    <div className="w-full h-[400px] rounded-xl overflow-hidden border border-border relative" style={{ zIndex: 0 }}>
      <MapContainer
        center={mapCenter as [number, number]}
        zoom={12}
        style={{ height: '100%', width: '100%', zIndex: 0 }}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker position={position} setPosition={handleSetPosition} />
        {position && <RecenterAutomatically lat={position.lat} lng={position.lng} />}
      </MapContainer>
    </div>
  );
}
