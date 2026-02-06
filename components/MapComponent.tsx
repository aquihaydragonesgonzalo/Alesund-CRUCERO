import React, { useRef, useEffect, useState } from 'react';
import L from 'leaflet';
import { Activity, Coords, CustomMarker } from '../types';

interface MapComponentProps {
    activities: Activity[];
    userLocation: Coords | null;
    focusedLocation: Coords | null;
}

const MapComponent: React.FC<MapComponentProps> = ({ activities, userLocation, focusedLocation }) => {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<L.Map | null>(null);
    const layersRef = useRef<L.Layer[]>([]);
    
    // State for Custom Markers (Waypoints)
    const [customMarkers, setCustomMarkers] = useState<CustomMarker[]>([]);

    // Load markers from LocalStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem('alesund_custom_markers');
        if (saved) {
            try {
                setCustomMarkers(JSON.parse(saved));
            } catch (e) {
                console.error("Error parsing custom markers", e);
            }
        }
    }, []);

    // Save markers to LocalStorage whenever they change
    useEffect(() => {
        localStorage.setItem('alesund_custom_markers', JSON.stringify(customMarkers));
    }, [customMarkers]);

    const handleAddPoint = (lat: number, lng: number) => {
        // eslint-disable-next-line no-alert
        const title = window.prompt("Nombre para este punto de interés:");
        if (title && title.trim() !== "") {
            const newMarker: CustomMarker = {
                id: Date.now().toString(),
                lat,
                lng,
                title: title.trim(),
                timestamp: Date.now()
            };
            setCustomMarkers(prev => [...prev, newMarker]);
        }
    };

    const handleDeletePoint = (id: string) => {
        // eslint-disable-next-line no-restricted-globals, no-alert
        if(confirm("¿Eliminar este punto guardado?")) {
            setCustomMarkers(prev => prev.filter(m => m.id !== id));
        }
    };

    // Initialize Map
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
            layers: [streetLayer], 
            zoomControl: false 
        });

        // Add Zoom Control
        L.control.zoom({ position: 'topleft' }).addTo(map);

        // 3. Add Layer Control
        const baseMaps = {
            "Callejero": streetLayer,
            "Satélite": satelliteLayer
        };
        L.control.layers(baseMaps, undefined, { position: 'topright' }).addTo(map);

        // 4. Click Event for Custom Markers
        map.on('click', (e: L.LeafletMouseEvent) => {
            handleAddPoint(e.latlng.lat, e.latlng.lng);
        });

        mapInstanceRef.current = map;
        
        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Empty dependency to run once

    // Render Layers (Activity Markers + Custom Markers)
    useEffect(() => {
        const map = mapInstanceRef.current;
        if (!map) return;
        
        // Clean up previous layers
        layersRef.current.forEach(l => l.remove());
        layersRef.current = [];

        // --- Helper: Create Icon ---
        const createIcon = (color: string) => L.divIcon({
            className: 'custom-pin',
            html: `<div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); border: 2px solid white; box-shadow: 2px 2px 4px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center;"><div style="width: 8px; height: 8px; background: white; border-radius: 50%; transform: rotate(45deg);"></div></div>`,
            iconSize: [24, 24],
            iconAnchor: [12, 24],
            popupAnchor: [0, -24]
        });

        // 1. Itinerary Markers (Blue)
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

        // 2. Custom Markers (Violet)
        customMarkers.forEach(m => {
            const marker = L.marker([m.lat, m.lng], { icon: createIcon('#9333ea') }).addTo(map);
            
            // Custom Popup with Delete Button
            const div = document.createElement('div');
            div.innerHTML = `
                <div class="font-bold text-sm mb-1">${m.title}</div>
                <div class="text-xs text-slate-500 mb-2">Tus Puntos Guardados</div>
            `;
            const btn = document.createElement('button');
            btn.innerText = "Eliminar Punto";
            btn.className = "w-full bg-red-100 hover:bg-red-200 text-red-600 text-xs py-1 px-2 rounded font-bold transition-colors";
            btn.onclick = () => {
                handleDeletePoint(m.id);
                map.closePopup();
            };
            div.appendChild(btn);

            marker.bindPopup(div);
            layersRef.current.push(marker);
        });

        // 3. User Location (Bright Blue)
        if (userLocation) {
            const userMarker = L.circleMarker([userLocation.lat, userLocation.lng], { radius: 8, fillColor: '#3b82f6', color: '#fff', weight: 3, fillOpacity: 1 }).addTo(map);
            layersRef.current.push(userMarker);
        }
    }, [activities, userLocation, customMarkers]); // Re-run when customMarkers changes

    // Handle Focus
    useEffect(() => {
        if(mapInstanceRef.current && focusedLocation) {
            mapInstanceRef.current.setView([focusedLocation.lat, focusedLocation.lng], 18, { animate: true, duration: 1.5 });
        }
    }, [focusedLocation]);

    return (
        <div className="relative w-full h-full">
            <div ref={mapContainerRef} className="w-full h-full bg-slate-100" />
            
            {/* Instruction Overlay */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur px-3 py-1.5 rounded-full shadow-md z-[400] text-xs font-medium text-slate-600 pointer-events-none border border-slate-200 flex items-center">
               <span className="w-2 h-2 bg-purple-600 rounded-full mr-2"></span> Toca el mapa para añadir puntos
            </div>
        </div>
    );
};

export default MapComponent;