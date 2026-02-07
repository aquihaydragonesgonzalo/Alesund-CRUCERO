import React, { useRef, useEffect, useState } from 'react';
import L from 'leaflet';
import { MapPin, X, Save, Type, AlignLeft } from 'lucide-react';
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
    
    // State for the "Add POI" Modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [tempCoords, setTempCoords] = useState<Coords | null>(null);
    const [newPoiTitle, setNewPoiTitle] = useState('');
    const [newPoiDesc, setNewPoiDesc] = useState('');

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

    const handleMapClick = (lat: number, lng: number) => {
        setTempCoords({ lat, lng });
        setNewPoiTitle('');
        setNewPoiDesc('');
        setIsModalOpen(true);
    };

    const saveMarker = () => {
        if (!tempCoords || !newPoiTitle.trim()) return;

        const newMarker: CustomMarker = {
            id: Date.now().toString(),
            lat: tempCoords.lat,
            lng: tempCoords.lng,
            title: newPoiTitle.trim(),
            description: newPoiDesc.trim() || undefined,
            timestamp: Date.now()
        };

        setCustomMarkers(prev => [...prev, newMarker]);
        closeModal();
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setTempCoords(null);
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
            handleMapClick(e.latlng.lat, e.latlng.lng);
        });

        mapInstanceRef.current = map;
        
        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Empty dependency to run once - click handler uses external state setter which is stable

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
            const descHtml = m.description ? `<div class="text-xs text-slate-600 mb-2 whitespace-pre-wrap leading-relaxed border-l-2 border-purple-200 pl-2">${m.description}</div>` : '';
            
            div.innerHTML = `
                <div class="font-bold text-sm mb-1 text-purple-900">${m.title}</div>
                ${descHtml}
                <div class="text-[10px] text-slate-400 uppercase tracking-wider mb-2">Punto Personalizado</div>
            `;
            const btn = document.createElement('button');
            btn.innerText = "Eliminar";
            btn.className = "w-full bg-red-50 hover:bg-red-100 text-red-600 text-xs py-1.5 px-2 rounded font-bold transition-colors border border-red-100 mt-1";
            
            // We can't attach React event handlers easily to HTML strings in Leaflet popups
            // So we assign directly to the DOM element after creation
            btn.onclick = (e) => {
                e.stopPropagation(); // Prevent map click
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
            
            {/* Instruction Overlay (Only visible when modal is closed) */}
            {!isModalOpen && (
                <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur px-3 py-1.5 rounded-full shadow-md z-[400] text-xs font-medium text-slate-600 pointer-events-none border border-slate-200 flex items-center">
                    <span className="w-2 h-2 bg-purple-600 rounded-full mr-2 animate-pulse"></span> Toca el mapa para añadir puntos
                </div>
            )}

            {/* Custom POI Modal Overlay */}
            {isModalOpen && (
                <div className="absolute inset-0 z-[2000] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden scale-100 animate-in zoom-in-95 duration-200">
                        {/* Modal Header */}
                        <div className="bg-gradient-to-r from-purple-100 to-white p-4 border-b border-purple-100 flex justify-between items-center">
                            <div className="flex items-center text-purple-800">
                                <MapPin size={20} className="mr-2" />
                                <h3 className="font-bold text-lg">Nuevo Punto</h3>
                            </div>
                            <button onClick={closeModal} className="p-1 rounded-full hover:bg-slate-100 text-slate-400 transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-5 space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Nombre del Lugar</label>
                                <div className="relative">
                                    <div className="absolute top-3 left-3 text-slate-400">
                                        <Type size={16} />
                                    </div>
                                    <input 
                                        type="text" 
                                        autoFocus
                                        value={newPoiTitle}
                                        onChange={(e) => setNewPoiTitle(e.target.value)}
                                        placeholder="Ej: Tienda de souvenirs"
                                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all text-sm font-medium"
                                    />
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Descripción (Opcional)</label>
                                <div className="relative">
                                    <div className="absolute top-3 left-3 text-slate-400">
                                        <AlignLeft size={16} />
                                    </div>
                                    <textarea 
                                        value={newPoiDesc}
                                        onChange={(e) => setNewPoiDesc(e.target.value)}
                                        placeholder="Horarios, precios, notas..."
                                        rows={3}
                                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all text-sm resize-none"
                                    />
                                </div>
                            </div>

                            <div className="pt-2 flex space-x-3">
                                <button 
                                    onClick={closeModal}
                                    className="flex-1 py-3 text-sm font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button 
                                    onClick={saveMarker}
                                    disabled={!newPoiTitle.trim()}
                                    className={`flex-1 py-3 text-sm font-bold text-white rounded-xl shadow-md flex items-center justify-center transition-all ${!newPoiTitle.trim() ? 'bg-slate-300 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700 active:scale-95'}`}
                                >
                                    <Save size={18} className="mr-2" />
                                    Guardar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MapComponent;