import React, { useRef, useEffect } from 'react';
import L from 'leaflet';
import { Activity, Coords } from '../types';

interface MapComponentProps {
    activities: Activity[];
    userLocation: Coords | null;
    focusedLocation: Coords | null;
}

const MapComponent: React.FC<MapComponentProps> = ({ activities, userLocation, focusedLocation }) => {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<L.Map | null>(null);
    const layersRef = useRef<L.Layer[]>([]);

    useEffect(() => {
        if (!mapContainerRef.current || mapInstanceRef.current) return;
        
        // 1. Define Base Layers
        const streetLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { 
            maxZoom: 19,
            attribution: '© OpenStreetMap' 
        });

        const satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
            attribution: 'Tiles © Esri',
            maxZoom: 19
        });

        // 2. Initialize Map with default layer (Street)
        const map = L.map(mapContainerRef.current, {
            center: [62.4722, 6.1497],
            zoom: 13,
            layers: [streetLayer], // Start with street layer
            zoomControl: false // We add zoom control manually below to control position/order if needed
        });

        // Add Zoom Control
        L.control.zoom({ position: 'topleft' }).addTo(map);

        // 3. Add Layer Control (Toggle between Street and Satellite)
        const baseMaps = {
            "Callejero": streetLayer,
            "Satélite": satelliteLayer
        };
        
        L.control.layers(baseMaps, undefined, { position: 'topright' }).addTo(map);

        mapInstanceRef.current = map;
        
        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
    }, []);

    useEffect(() => {
        const map = mapInstanceRef.current;
        if (!map) return;
        
        layersRef.current.forEach(l => l.remove());
        layersRef.current = [];

        // Custom Icons
        const createIcon = (color: string) => L.divIcon({
            className: 'custom-pin',
            html: `<div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); border: 2px solid white; box-shadow: 2px 2px 4px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center;"><div style="width: 8px; height: 8px; background: white; border-radius: 50%; transform: rotate(45deg);"></div></div>`,
            iconSize: [24, 24],
            iconAnchor: [12, 24],
            popupAnchor: [0, -24]
        });

        activities.forEach(act => {
            const marker = L.marker([act.coords.lat, act.coords.lng], { icon: createIcon('#2A5B87') })
                .addTo(map).bindPopup(`<b>${act.title}</b><br/>${act.locationName}`);
            layersRef.current.push(marker);

            if (act.endCoords) {
                 const endMarker = L.marker([act.endCoords.lat, act.endCoords.lng], { icon: createIcon('#3A7D44') })
                    .addTo(map).bindPopup(`<b>Fin: ${act.title}</b>`);
                layersRef.current.push(endMarker);
                const polyline = L.polyline([[act.coords.lat, act.coords.lng], [act.endCoords.lat, act.endCoords.lng]], { color: '#2A5B87', weight: 4, opacity: 0.6, dashArray: '10, 10' }).addTo(map);
                layersRef.current.push(polyline);
            }
        });

        if (userLocation) {
            const userMarker = L.circleMarker([userLocation.lat, userLocation.lng], { radius: 8, fillColor: '#3b82f6', color: '#fff', weight: 3, fillOpacity: 1 }).addTo(map);
            layersRef.current.push(userMarker);
        }
    }, [activities, userLocation]);

    useEffect(() => {
        if(mapInstanceRef.current && focusedLocation) {
            mapInstanceRef.current.setView([focusedLocation.lat, focusedLocation.lng], 18, { animate: true, duration: 1.5 });
        }
    }, [focusedLocation]);

    return <div ref={mapContainerRef} className="w-full h-full bg-slate-100" />;
};

export default MapComponent;