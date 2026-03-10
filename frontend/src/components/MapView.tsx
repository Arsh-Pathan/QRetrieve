import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

interface MapViewProps {
  lat: number;
  lng: number;
  label?: string;
  className?: string;
}

export function MapView({ lat, lng, label = 'Found here', className = '' }: MapViewProps) {
  return (
    <div className={`rounded-2xl overflow-hidden ${className}`}>
      <MapContainer
        center={[lat, lng]}
        zoom={15}
        style={{ height: '300px', width: '100%' }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[lat, lng]}>
          <Popup>{label}</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
