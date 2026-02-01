import React, { useState, useEffect } from 'react';
import { 
    CalendarClock, Map as MapIcon, Wallet, BookOpen, Anchor 
} from 'lucide-react';
import Timeline from './components/Timeline';
import Budget from './components/Budget';
import Guide from './components/Guide';
import MapComponent from './components/MapComponent';
import ActivityDetailModal from './components/ActivityDetailModal';
import { INITIAL_ITINERARY, SHIP_DEPARTURE_TIME, ARRIVAL_TIME, ONBOARD_TIME } from './constants';
import { Activity, Coords } from './types';

const App = () => {
    const [itinerary, setItinerary] = useState<Activity[]>(INITIAL_ITINERARY);
    const [activeTab, setActiveTab] = useState<'timeline' | 'map' | 'budget' | 'guide'>('timeline');
    const [userLocation, setUserLocation] = useState<Coords | null>(null);
    const [mapFocus, setMapFocus] = useState<Coords | null>(null);
    
    // State for selected activity detail, can include config like { activity, autoOpenAudio: true }
    const [selectedActivityConfig, setSelectedActivityConfig] = useState<{activity: Activity, autoOpenAudio: boolean} | null>(null);
    
    const [countdown, setCountdown] = useState('');
    const [countdownLabel, setCountdownLabel] = useState('Salida');

    useEffect(() => {
        if ('geolocation' in navigator) {
            const id = navigator.geolocation.watchPosition(
                p => setUserLocation({ lat: p.coords.latitude, lng: p.coords.longitude }),
                e => console.warn(e),
                { enableHighAccuracy: true }
            );
            return () => navigator.geolocation.clearWatch(id);
        }
    }, []);

    // Smart Countdown
    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date();
            
            // Parse Times
            const [ah, am] = ARRIVAL_TIME.split(':').map(Number);
            const arrivalDate = new Date(); arrivalDate.setHours(ah, am, 0, 0);

            const [oh, om] = ONBOARD_TIME.split(':').map(Number);
            const onboardDate = new Date(); onboardDate.setHours(oh, om, 0, 0);

            let target, label;

            if (now < arrivalDate) {
                target = arrivalDate;
                label = "Faltan para Llegada";
            } else {
                target = onboardDate;
                label = "Tiempo Restante";
            }

            setCountdownLabel(label);

            const diff = target.getTime() - now.getTime();
            
            if (diff <= 0 && target === onboardDate) setCountdown("¡A BORDO!");
            else if (diff <= 0 && target === arrivalDate) setCountdown("¡LLEGANDO!");
            else {
                const hr = Math.floor(diff/(1000*60*60));
                const mn = Math.floor((diff%(1000*60*60))/(1000*60));
                const sc = Math.floor((diff%(1000*60))/1000);
                setCountdown(`${hr}h ${mn}m ${sc}s`);
            }
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const handleToggleComplete = (id: string) => {
        setItinerary(prev => prev.map(a => a.id === id ? { ...a, completed: !a.completed } : a));
    };

    const handleLocate = (c1: Coords, _c2?: Coords) => {
        setMapFocus(c1);
        setActiveTab('map');
    };
    
    const handleSelectActivity = (activity: Activity, autoOpenAudio = false) => {
        setSelectedActivityConfig({ activity, autoOpenAudio });
    };

    return (
        <div className="flex flex-col h-screen bg-slate-50 text-slate-900 font-sans overflow-hidden select-none">
            <header className="bg-fjord-900 text-white p-3 shadow-md z-20 flex justify-between items-center shrink-0">
                <div className="flex items-center">
                    <Anchor className="mr-2 text-sunset-500" size={20} />
                    <div>
                        <h1 className="font-bold text-sm leading-none">Todos a Bordo: {ONBOARD_TIME}</h1>
                        <p className="text-[10px] text-fjord-200">Salida Barco: {SHIP_DEPARTURE_TIME}</p>
                    </div>
                </div>
                <div className="text-right">
                     <div className="text-[10px] text-sunset-200 uppercase tracking-widest">{countdownLabel}</div>
                     <div className="text-xl font-mono font-bold text-sunset-500 tabular-nums">{countdown}</div>
                </div>
            </header>

            <main className="flex-1 overflow-hidden relative">
                {activeTab === 'timeline' && <div className="h-full overflow-y-auto"><Timeline itinerary={itinerary} onToggleComplete={handleToggleComplete} onLocate={handleLocate} userLocation={userLocation} onSelectActivity={handleSelectActivity} /></div>}
                {activeTab === 'map' && <MapComponent activities={itinerary} userLocation={userLocation} focusedLocation={mapFocus} />}
                {activeTab === 'budget' && <Budget itinerary={itinerary} />}
                {activeTab === 'guide' && <Guide userLocation={userLocation} />}
            </main>

            {selectedActivityConfig && (
                <ActivityDetailModal 
                    activity={selectedActivityConfig.activity} 
                    initialAutoOpen={selectedActivityConfig.autoOpenAudio}
                    onClose={() => setSelectedActivityConfig(null)} 
                />
            )}

            <nav className="bg-white border-t border-slate-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-30 pb-safe shrink-0">
                <div className="flex justify-around items-center h-16">
                    <button onClick={() => setActiveTab('timeline')} className={`flex flex-col items-center w-full h-full justify-center transition-colors ${activeTab === 'timeline' ? 'text-fjord-600' : 'text-slate-300'}`}>
                        <CalendarClock size={24} strokeWidth={activeTab === 'timeline' ? 2.5 : 2} />
                        <span className="text-[10px] mt-1 font-bold">Itinerario</span>
                    </button>
                    <button onClick={() => setActiveTab('map')} className={`flex flex-col items-center w-full h-full justify-center transition-colors ${activeTab === 'map' ? 'text-fjord-600' : 'text-slate-300'}`}>
                        <MapIcon size={24} strokeWidth={activeTab === 'map' ? 2.5 : 2} />
                        <span className="text-[10px] mt-1 font-bold">Mapa</span>
                    </button>
                    <button onClick={() => setActiveTab('budget')} className={`flex flex-col items-center w-full h-full justify-center transition-colors ${activeTab === 'budget' ? 'text-fjord-600' : 'text-slate-300'}`}>
                        <Wallet size={24} strokeWidth={activeTab === 'budget' ? 2.5 : 2} />
                        <span className="text-[10px] mt-1 font-bold">Gastos</span>
                    </button>
                    <button onClick={() => setActiveTab('guide')} className={`flex flex-col items-center w-full h-full justify-center transition-colors ${activeTab === 'guide' ? 'text-fjord-600' : 'text-slate-300'}`}>
                        <BookOpen size={24} strokeWidth={activeTab === 'guide' ? 2.5 : 2} />
                        <span className="text-[10px] mt-1 font-bold">Guía</span>
                    </button>
                </div>
            </nav>
        </div>
    );
};

export default App;