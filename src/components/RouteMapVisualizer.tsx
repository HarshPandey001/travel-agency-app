import React from 'react';
import { MapPin, Navigation, Compass, Thermometer, CloudSnow, Sun, Shield } from 'lucide-react';
import { Trip } from '../types';

interface RouteMapVisualizerProps {
  trip: Trip;
}

export const RouteMapVisualizer: React.FC<RouteMapVisualizerProps> = ({ trip }) => {
  const isSnowRegion = trip.destination.toLowerCase().includes('manali') || 
                       trip.destination.toLowerCase().includes('spiti') || 
                       trip.destination.toLowerCase().includes('kedarkantha') ||
                       trip.destination.toLowerCase().includes('auli') ||
                       trip.destination.toLowerCase().includes('kashmir') ||
                       trip.destination.toLowerCase().includes('ladakh');

  const waypoints = [
    { title: `${trip.startingLocation} Hub`, desc: 'Boarding Terminal & Group Intro', dist: '0 KM', temp: '26°C' },
    { title: 'Highway Transit Stop', desc: 'Meals, Chai & Restroom Break', dist: '180 KM', temp: '22°C' },
    { title: 'Himalayan Base Entry', desc: 'State Transit Permit Verification', dist: '340 KM', temp: '14°C' },
    { title: trip.destination, desc: 'Hotel Check-in & Riverside Camps', dist: '520 KM', temp: isSnowRegion ? '-2°C (Snow Points)' : '18°C' }
  ];

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 text-white space-y-5 shadow-2xl">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <span className="bg-emerald-500/10 text-emerald-400 text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full border border-emerald-500/20">
            📍 Interactive Expedition Route
          </span>
          <h4 className="text-base font-bold font-display text-white mt-1">
            {trip.startingLocation} Hub to {trip.destination}
          </h4>
        </div>

        <div className="flex items-center space-x-3 text-xs font-semibold">
          <div className="bg-slate-900 border border-slate-800 text-slate-300 px-3 py-1.5 rounded-xl flex items-center space-x-1.5">
            {isSnowRegion ? <CloudSnow className="w-4 h-4 text-cyan-400" /> : <Sun className="w-4 h-4 text-amber-400" />}
            <span>{isSnowRegion ? 'Sub-Zero Snow Point' : 'Pleasant Mountain Climate'}</span>
          </div>
        </div>
      </div>

      {/* Visual Timeline Route */}
      <div className="relative py-2">
        {/* Connecting Line */}
        <div className="hidden sm:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-cyan-500 to-teal-500 -translate-y-1/2 rounded-full z-0"></div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 relative z-10">
          {waypoints.map((wp, idx) => (
            <div key={idx} className="bg-slate-900 border border-slate-800 hover:border-emerald-500/50 p-4 rounded-2xl space-y-2 transition-all group">
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-xl bg-emerald-500 text-slate-950 font-black text-xs flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  {idx + 1}
                </div>
                <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-md border border-cyan-500/20">
                  {wp.dist}
                </span>
              </div>

              <div>
                <h5 className="text-xs font-bold text-white line-clamp-1">{wp.title}</h5>
                <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5">{wp.desc}</p>
              </div>

              <div className="text-[10px] text-slate-400 flex items-center space-x-1 pt-1 border-t border-slate-800/80">
                <Thermometer className="w-3 h-3 text-amber-400" />
                <span>Forecast: <strong>{wp.temp}</strong></span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-slate-900 p-3 rounded-2xl border border-slate-800 text-[11px] text-slate-400 flex items-center space-x-2">
        <Shield className="w-4 h-4 text-emerald-400 flex-shrink-0" />
        <span>
          Full Agency GPS Tracking & Certified Trip Captain escort active throughout the route from {trip.startingLocation} Hub.
        </span>
      </div>
    </div>
  );
};
