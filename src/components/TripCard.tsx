import React from 'react';
import { MapPin, Calendar, Bus, Users, Sparkles, ArrowRight, Shield } from 'lucide-react';
import { Trip } from '../types';

interface TripCardProps {
  trip: Trip;
  onSelectTrip: (trip: Trip) => void;
}

export const TripCard: React.FC<TripCardProps> = ({ trip, onSelectTrip }) => {
  const bookedCount = trip.seats.filter(s => s.status === 'booked' || s.status === 'blocked').length;
  const availableSeats = trip.totalSeats - bookedCount;
  const maleCount = trip.seats.filter(s => s.bookedBy?.gender === 'male').length;
  const femaleCount = trip.seats.filter(s => s.bookedBy?.gender === 'female').length;

  return (
    <div className="bg-slate-900 border border-slate-800 hover:border-emerald-500/50 rounded-3xl overflow-hidden shadow-xl hover:shadow-emerald-500/10 transition-all duration-300 group flex flex-col h-full text-white">
      
      {/* Top Image Banner with Badges */}
      <div className="relative h-52 sm:h-56 overflow-hidden">
        <img
          src={trip.coverImage}
          alt={trip.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
        
        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <span className="bg-slate-900/80 backdrop-blur-md text-slate-200 text-xs font-bold px-3 py-1.5 rounded-full border border-slate-700/60 flex items-center space-x-1">
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            <span>{trip.startingLocation} Hub</span>
          </span>

          <span className={`text-xs font-bold px-3 py-1.5 rounded-full backdrop-blur-md border ${
            availableSeats <= 5
              ? 'bg-rose-500/80 text-white border-rose-400/50 animate-pulse'
              : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
          }`}>
            💺 {availableSeats} seats left
          </span>
        </div>

        {/* Title overlay on bottom of image */}
        <div className="absolute bottom-3 left-4 right-4">
          <div className="flex items-center space-x-2 text-[11px] font-semibold text-emerald-400 uppercase tracking-widest mb-1">
            <Sparkles className="w-3 h-3" />
            <span>{trip.travelStyle[0] || 'Social Expedition'}</span>
          </div>
          <h3 className="text-xl font-bold font-display text-white line-clamp-1 leading-snug">
            {trip.title}
          </h3>
        </div>
      </div>

      {/* Main Content Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        
        {/* Key Trip Info Grid */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-xs text-slate-300 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-emerald-400" />
              <span className="font-semibold">{trip.startingLocation} → {trip.destination.split(',')[0]}</span>
            </div>
            <div className="flex items-center space-x-1.5 text-slate-400">
              <Calendar className="w-3.5 h-3.5 text-cyan-400" />
              <span>{trip.durationDays}D / {trip.durationNights}N</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-300 bg-slate-950/40 p-2.5 rounded-xl border border-slate-800/80">
            <div className="flex items-center space-x-2">
              <Bus className="w-4 h-4 text-amber-400" />
              <span className="truncate max-w-[150px]">{trip.vehicleType}</span>
            </div>
            <span className="text-[10px] font-bold bg-slate-900 text-cyan-300 px-2 py-0.5 rounded-md border border-cyan-500/20">
              ♂ {maleCount} • ♀ {femaleCount} (1:1 Ratio)
            </span>
          </div>
        </div>

        {/* Highlights List */}
        <div className="space-y-1.5 text-xs text-slate-400">
          <p className="text-[11px] uppercase font-bold text-slate-500 tracking-wider">Includes:</p>
          <div className="grid grid-cols-2 gap-1.5">
            {trip.inclusions.slice(0, 4).map((inc, i) => (
              <div key={i} className="flex items-center space-x-1.5 text-slate-300">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0"></span>
                <span className="truncate">{inc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Price & CTA Button */}
        <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-400 block font-medium">All-Inclusive Seat</span>
            <div className="flex items-baseline space-x-1.5">
              <span className="text-2xl font-black font-display text-white">
                ₹{trip.pricePerPerson.toLocaleString('en-IN')}
              </span>
              {trip.originalPrice && (
                <span className="text-xs text-slate-500 line-through">
                  ₹{trip.originalPrice.toLocaleString('en-IN')}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={() => onSelectTrip(trip)}
            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-xs flex items-center space-x-1.5 shadow-lg shadow-emerald-500/20 transition-all hover:scale-105"
          >
            <span>View Trip</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
