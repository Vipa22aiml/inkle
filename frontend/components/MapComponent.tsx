'use client';

import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Icon, DivIcon } from 'leaflet';
import { useEffect, useState } from 'react';

// Fix for default marker icon in Next.js
const defaultIcon = new Icon({
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

// Custom numbered icon factory
const createNumberedIcon = (number: number) => {
    return new DivIcon({
        className: 'custom-marker',
        html: `<div style="background-color: #ef4444; color: white; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; font-weight: bold; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">${number}</div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
    });
};

interface MapProps {
    places: any[];
    restaurants: any[];
    route: any;
    center: { lat: number; lon: number } | null;
}

// Component to handle map view updates
function RecenterAutomatically({ lat, lon }: { lat: number; lon: number }) {
    const map = useMap();
    useEffect(() => {
        map.setView([lat, lon], 13);
    }, [lat, lon, map]);
    return null;
}

export default function MapComponent({ places, restaurants, route, center }: MapProps) {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) return <div className="h-full w-full bg-gray-100 animate-pulse rounded-xl" />;

    const mapCenter = center ? [center.lat, center.lon] : [51.505, -0.09];

    // Decode polyline if available (Google Routes returns encoded polyline)
    const polylinePositions = places.map(p => [p.lat, p.lon]);

    return (
        <MapContainer center={mapCenter as [number, number]} zoom={13} scrollWheelZoom={false} dragging={true} className="h-full w-full rounded-xl z-0">
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {center && <RecenterAutomatically lat={center.lat} lon={center.lon} />}

            {/* Attractions Markers (Numbered) */}
            {places.map((place, idx) => (
                <Marker key={`place-${idx}`} position={[place.lat, place.lon]} icon={createNumberedIcon(idx + 1)}>
                    <Popup>
                        <div className="font-bold">{idx + 1}. {place.name}</div>
                        <div className="text-xs">{place.address}</div>
                    </Popup>
                </Marker>
            ))}

            {/* Restaurant Markers */}
            {restaurants.map((place, idx) => (
                <Marker key={`rest-${idx}`} position={[place.lat, place.lon]} icon={defaultIcon} opacity={0.7}>
                    <Popup>
                        <div className="font-bold">🍽️ {place.name}</div>
                        <div className="text-xs">{place.address}</div>
                        <div className="text-xs">Rating: {place.rating}</div>
                    </Popup>
                </Marker>
            ))}

            {/* Route Line */}
            {polylinePositions.length > 1 && (
                <Polyline positions={polylinePositions as [number, number][]} color="blue" dashArray="5, 10" />
            )}
        </MapContainer>
    );
}
