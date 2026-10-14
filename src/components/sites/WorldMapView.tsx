import React, { useState } from 'react';
import { MapPin, Search, Compass, Navigation, Layers, Globe } from 'lucide-react';

interface City {
  name: string;
  country: string;
  bbox: string; // minlon,minlat,maxlon,maxlat
}

const CITIES: City[] = [
  { name: 'Tokyo', country: 'Japan', bbox: '139.65,35.65,139.78,35.72' },
  { name: 'Paris', country: 'France', bbox: '2.28,48.83,2.40,48.88' },
  { name: 'New York', country: 'USA', bbox: '-74.02,40.70,-73.93,40.78' },
  { name: 'London', country: 'UK', bbox: '-0.15,51.49,-0.05,51.53' },
  { name: 'Moscow', country: 'Russia', bbox: '37.55,55.72,37.68,55.78' },
  { name: 'San Francisco', country: 'USA', bbox: '-122.45,37.75,-122.38,37.81' },
];

export const WorldMapView: React.FC = () => {
  const [selectedCity, setSelectedCity] = useState<City>(CITIES[0]);
  const [searchInput, setSearchInput] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const found = CITIES.find((c) =>
      c.name.toLowerCase().includes(searchInput.toLowerCase()) ||
      c.country.toLowerCase().includes(searchInput.toLowerCase())
    );
    if (found) {
      setSelectedCity(found);
      setSearchInput('');
    }
  };

  return (
    <div className="flex-1 h-full flex flex-col bg-slate-950 text-white select-none overflow-hidden">
      {/* Top Map Bar */}
      <header className="h-12 bg-slate-900 border-b border-slate-800 px-4 flex items-center justify-between z-20">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
            <Compass className="w-4 h-4" />
          </div>
          <span className="font-bold text-xs text-white">World Maps</span>
          <span className="text-xs text-slate-400 font-mono">[{selectedCity.name}, {selectedCity.country}]</span>
        </div>

        {/* Quick City Presets */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {CITIES.map((city) => (
            <button
              key={city.name}
              onClick={() => setSelectedCity(city)}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                selectedCity.name === city.name
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-750'
              }`}
            >
              {city.name}
            </button>
          ))}
        </div>
      </header>

      {/* Interactive Map Iframe */}
      <div className="flex-1 relative bg-slate-900">
        <iframe
          key={selectedCity.name}
          title={`Map of ${selectedCity.name}`}
          className="w-full h-full border-none"
          src={`https://www.openstreetmap.org/export/embed.html?bbox=${selectedCity.bbox}&layer=mapnik`}
        />

        {/* Floating City Card */}
        <div className="absolute bottom-5 left-5 z-10 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 p-3.5 rounded-xl shadow-2xl max-w-xs">
          <div className="flex items-center gap-2 mb-1">
            <MapPin className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-white">{selectedCity.name}</h3>
          </div>
          <p className="text-xs text-slate-400">
            High-resolution satellite cartography provided via OpenStreetMap.
          </p>
        </div>
      </div>
    </div>
  );
};
