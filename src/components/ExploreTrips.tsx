import React, { useState, useMemo } from 'react';
import { Trip, TravelStyle } from '../types';
import { TripCard } from './TripCard';
import { Search, Filter, MapPin, Calendar, Compass, ArrowUpDown, Sparkles, SlidersHorizontal } from 'lucide-react';

interface ExploreTripsProps {
  trips: Trip[];
  onSelectTrip: (trip: Trip) => void;
}

export const ExploreTrips: React.FC<ExploreTripsProps> = ({ trips, onSelectTrip }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedHub, setSelectedHub] = useState<string>('All');
  const [selectedStyle, setSelectedStyle] = useState<string>('All');
  const [maxPrice, setMaxPrice] = useState<number>(25000);
  const [sortBy, setSortBy] = useState<'date' | 'price_low' | 'price_high' | 'seats'>('date');

  // Available Hubs
  const availableHubs = useMemo(() => {
    const hubs = Array.from(new Set(trips.map(t => t.startingLocation)));
    return ['All', ...hubs];
  }, [trips]);

  // Available Styles
  const availableStyles = [
    'All',
    'Himalayan Escape',
    'Adventure & Trekking',
    'Nature & Camping',
    'Culture & Heritage',
    'Beach & Coastal Vibes'
  ];

  // Filtered & Sorted Trips
  const filteredTrips = useMemo(() => {
    return trips.filter((t) => {
      const matchesSearch =
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.startingLocation.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesHub = selectedHub === 'All' || t.startingLocation === selectedHub;
      const matchesStyle = selectedStyle === 'All' || t.travelStyle.includes(selectedStyle as TravelStyle);
      const matchesPrice = t.pricePerPerson <= maxPrice;

      return matchesSearch && matchesHub && matchesStyle && matchesPrice;
    }).sort((a, b) => {
      if (sortBy === 'price_low') return a.pricePerPerson - b.pricePerPerson;
      if (sortBy === 'price_high') return b.pricePerPerson - a.pricePerPerson;
      if (sortBy === 'seats') {
        const availA = a.totalSeats - a.seats.filter(s => s.status === 'booked').length;
        const availB = b.totalSeats - b.seats.filter(s => s.status === 'booked').length;
        return availB - availA;
      }
      return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
    });
  }, [trips, searchQuery, selectedHub, selectedStyle, maxPrice, sortBy]);

  return (
    <div className="space-y-8 pb-16 text-white">
      
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="max-w-2xl space-y-2 relative z-10">
          <div className="inline-flex items-center space-x-2 bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full text-xs font-bold border border-emerald-500/20">
            <Compass className="w-3.5 h-3.5" />
            <span>Social Group Trip Catalog</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold font-display text-white">
            Explore Curated Group Journeys
          </h1>
          <p className="text-slate-400 text-sm">
            Find trips leaving from Gorakhpur, Delhi, Mumbai and more. Book individual seats and travel together.
          </p>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
        
        {/* Search Bar & Dropdowns */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          
          {/* Search Input */}
          <div className="md:col-span-2 relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search destination, e.g. Manali, Kasol, Spiti..."
              className="w-full bg-slate-950 border border-slate-700 focus:border-emerald-500 rounded-2xl pl-10 pr-4 py-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none"
            />
          </div>

          {/* Starting Hub */}
          <div>
            <select
              value={selectedHub}
              onChange={(e) => setSelectedHub(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 focus:border-emerald-500 rounded-2xl px-3.5 py-3 text-xs sm:text-sm text-white focus:outline-none"
            >
              <option value="All">📍 All Starting Hubs</option>
              {availableHubs.filter(h => h !== 'All').map((h) => (
                <option key={h} value={h}>
                  📍 Starting: {h}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div>
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 focus:border-emerald-500 rounded-2xl px-3.5 py-3 text-xs sm:text-sm text-white focus:outline-none"
            >
              <option value="date">📅 Sort by Departure Date</option>
              <option value="price_low">💰 Price: Low to High</option>
              <option value="price_high">💰 Price: High to Low</option>
              <option value="seats">💺 Most Seats Available</option>
            </select>
          </div>

        </div>

        {/* Travel Style Chips */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800">
          <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-xs text-slate-500 font-bold uppercase tracking-wider flex items-center space-x-1">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Vibe:</span>
            </span>
            {availableStyles.map((style) => (
              <button
                key={style}
                onClick={() => setSelectedStyle(style)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedStyle === style
                    ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {style}
              </button>
            ))}
          </div>

          {/* Max Price Slider */}
          <div className="flex items-center space-x-3 text-xs text-slate-400 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
            <span>Max Price: <strong className="text-emerald-400">₹{maxPrice.toLocaleString('en-IN')}</strong></span>
            <input
              type="range"
              min={5000}
              max={30000}
              step={1000}
              value={maxPrice}
              onChange={(e) => setMaxPrice(parseInt(e.target.value))}
              className="accent-emerald-500 w-24 cursor-pointer"
            />
          </div>
        </div>

      </div>

      {/* Trips Grid */}
      {filteredTrips.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center space-y-3">
          <Compass className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-white">No Trips Found Matching Criteria</h3>
          <p className="text-xs text-slate-400">Try adjusting your filters or price slider.</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedHub('All');
              setSelectedStyle('All');
              setMaxPrice(25000);
            }}
            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTrips.map((trip) => (
            <TripCard key={trip.id} trip={trip} onSelectTrip={onSelectTrip} />
          ))}
        </div>
      )}

    </div>
  );
};
