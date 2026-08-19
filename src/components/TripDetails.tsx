import React, { useState } from 'react';
import { Trip, UserProfile } from '../types';
import { MapPin, Calendar, Bus, Users, ShieldCheck, CheckCircle2, XCircle, Clock, Utensils, Hotel, Sparkles, ArrowLeft, ChevronDown, ChevronUp, Star, Phone, AlertCircle } from 'lucide-react';
import { RouteMapVisualizer } from './RouteMapVisualizer';
import { SocialSquadChat } from './SocialSquadChat';

interface TripDetailsProps {
  trip: Trip;
  currentUser?: UserProfile | null;
  onBack: () => void;
  onBookNow: (trip: Trip) => void;
}

export const TripDetails: React.FC<TripDetailsProps> = ({ trip, currentUser = null, onBack, onBookNow }) => {
  const [activeTab, setActiveTab] = useState<'itinerary' | 'stay' | 'pickups' | 'rules'>('itinerary');
  const [openDay, setOpenDay] = useState<number | null>(1);

  const bookedCount = trip.seats.filter(s => s.status === 'booked' || s.status === 'blocked').length;
  const availableSeats = trip.totalSeats - bookedCount;

  return (
    <div className="space-y-8 pb-24 text-white">
      
      {/* Top Navigation */}
      <button
        onClick={onBack}
        className="inline-flex items-center space-x-2 text-xs font-bold text-slate-400 hover:text-white bg-slate-900 px-4 py-2 rounded-xl border border-slate-800 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Explore Trips</span>
      </button>

      {/* Hero Header Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl relative">
        <div className="relative h-72 sm:h-96">
          <img
            src={trip.coverImage}
            alt={trip.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent"></div>

          {/* Floating Badges */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
            <span className="bg-slate-950/80 backdrop-blur-md text-emerald-400 border border-emerald-500/30 text-xs font-bold px-3.5 py-1.5 rounded-full flex items-center space-x-1.5">
              <MapPin className="w-3.5 h-3.5" />
              <span>Starting from {trip.startingLocation} Hub</span>
            </span>

            <span className={`text-xs font-bold px-4 py-1.5 rounded-full backdrop-blur-md border ${
              availableSeats <= 5
                ? 'bg-rose-500/90 text-white border-rose-400 animate-pulse'
                : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
            }`}>
              💺 {availableSeats} / {trip.totalSeats} Seats Available
            </span>
          </div>

          {/* Hero Bottom Info */}
          <div className="absolute bottom-6 left-6 right-6 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              {trip.travelStyle.map((style, i) => (
                <span key={i} className="bg-slate-950/80 text-xs text-slate-300 px-3 py-1 rounded-full border border-slate-800 font-semibold">
                  {style}
                </span>
              ))}
            </div>
            <h1 className="text-3xl sm:text-5xl font-black font-display text-white">
              {trip.title}
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl font-medium">
              {trip.tagline}
            </p>
          </div>
        </div>

        {/* Key Quick Info Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-6 bg-slate-950/80 border-t border-slate-800">
          <div>
            <span className="text-[11px] text-slate-500 uppercase font-bold tracking-wider block">Duration</span>
            <span className="text-base font-bold text-white flex items-center space-x-1 mt-0.5">
              <Calendar className="w-4 h-4 text-cyan-400" />
              <span>{trip.durationDays} Days / {trip.durationNights} Nights</span>
            </span>
          </div>

          <div>
            <span className="text-[11px] text-slate-500 uppercase font-bold tracking-wider block">Vehicle</span>
            <span className="text-base font-bold text-white flex items-center space-x-1 mt-0.5">
              <Bus className="w-4 h-4 text-amber-400" />
              <span className="truncate">{trip.vehicleType}</span>
            </span>
          </div>

          <div>
            <span className="text-[11px] text-slate-500 uppercase font-bold tracking-wider block">Dates</span>
            <span className="text-base font-bold text-white mt-0.5 block">
              {trip.startDate} to {trip.endDate}
            </span>
          </div>

          <div>
            <span className="text-[11px] text-slate-500 uppercase font-bold tracking-wider block">Price Per Person</span>
            <div className="flex items-baseline space-x-1.5 mt-0.5">
              <span className="text-2xl font-black font-display text-emerald-400">
                ₹{trip.pricePerPerson.toLocaleString('en-IN')}
              </span>
              {trip.originalPrice && (
                <span className="text-xs text-slate-500 line-through">
                  ₹{trip.originalPrice.toLocaleString('en-IN')}
                </span>
              )}
            </div>
          </div>
        </div>

      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (2/3): Tabs, Itinerary, Stay, Pickup & Rules */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Co-Travelers Vibe Snippet */}
          {trip.coTravelerSnippet && (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-teal-500/10 text-teal-400 border border-teal-500/20 flex items-center justify-center font-bold">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400">Group Demographics</h4>
                  <p className="text-sm font-bold text-white">
                    Age Group: {trip.coTravelerSnippet.ageRange} • {trip.coTravelerSnippet.soloTravelerCount} Solo Travelers Joined
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {trip.coTravelerSnippet.vibes.map((vibe, idx) => (
                  <span key={idx} className="bg-slate-950 text-emerald-400 text-xs px-2.5 py-1 rounded-xl border border-slate-800 font-semibold">
                    ✨ {vibe}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Navigation Tabs */}
          <div className="flex space-x-2 border-b border-slate-800 pb-3">
            <button
              onClick={() => setActiveTab('itinerary')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'itinerary'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              🗓 Day-by-Day Itinerary
            </button>
            <button
              onClick={() => setActiveTab('stay')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'stay'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              🏨 Hotel & Meals
            </button>
            <button
              onClick={() => setActiveTab('pickups')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'pickups'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              📍 Pickup & Drop Points
            </button>
            <button
              onClick={() => setActiveTab('rules')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'rules'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              🛡 Rules & Policies
            </button>
          </div>

          {/* Interactive Expedition Route Visualizer */}
          <RouteMapVisualizer trip={trip} />

          {/* TAB 1: ITINERARY ACCORDION */}
          {activeTab === 'itinerary' && (
            <div className="space-y-4">
              {trip.itinerary.map((day) => {
                const isOpen = openDay === day.dayNumber;
                return (
                  <div key={day.dayNumber} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden transition-all">
                    <button
                      onClick={() => setOpenDay(isOpen ? null : day.dayNumber)}
                      className="w-full p-4 sm:p-5 flex items-center justify-between text-left focus:outline-none hover:bg-slate-800/40"
                    >
                      <div className="flex items-center space-x-3">
                        <span className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-black font-display text-sm flex items-center justify-center flex-shrink-0">
                          D{day.dayNumber}
                        </span>
                        <div>
                          <h4 className="text-sm font-bold text-white">{day.title}</h4>
                          <p className="text-xs text-slate-400 flex items-center space-x-1 mt-0.5">
                            <MapPin className="w-3 h-3 text-slate-500" />
                            <span>{day.location}</span>
                          </p>
                        </div>
                      </div>

                      {isOpen ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                    </button>

                    {isOpen && (
                      <div className="px-5 pb-5 pt-2 border-t border-slate-800/80 space-y-3 text-xs text-slate-300">
                        <p className="leading-relaxed text-slate-300">{day.description}</p>
                        
                        <div>
                          <p className="font-bold text-slate-400 mb-1.5 uppercase text-[10px] tracking-wider">Day Highlights:</p>
                          <div className="flex flex-wrap gap-2">
                            {day.highlights.map((h, idx) => (
                              <span key={idx} className="bg-slate-950 text-emerald-300 px-2.5 py-1 rounded-lg border border-slate-800 font-semibold">
                                ✓ {h}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 pt-2 text-[11px] text-slate-400">
                          <Utensils className="w-3.5 h-3.5 text-amber-400" />
                          <span>Meals Included: <strong>{day.mealsIncluded.join(', ')}</strong></span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB 2: STAY & MEALS */}
          {activeTab === 'stay' && (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6">
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-emerald-400 font-bold text-sm">
                  <Hotel className="w-5 h-5" />
                  <span>{trip.accommodationDetails.hotelName}</span>
                </div>
                <p className="text-xs text-slate-300">
                  Sharing Config: <strong>{trip.accommodationDetails.roomType}</strong>
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {trip.accommodationDetails.images.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt="Hotel stay"
                      className="w-full h-32 object-cover rounded-2xl border border-slate-800"
                    />
                  ))}
                </div>
                <div className="flex flex-wrap gap-2 pt-2">
                  {trip.accommodationDetails.amenities.map((am, i) => (
                    <span key={i} className="bg-slate-950 text-slate-300 text-xs px-3 py-1 rounded-xl border border-slate-800">
                      🏢 {am}
                    </span>
                  ))}
                </div>
              </div>

              <div className="border-t border-slate-800 pt-5 space-y-2">
                <h4 className="text-sm font-bold text-white flex items-center space-x-2">
                  <Utensils className="w-4 h-4 text-amber-400" />
                  <span>Food & Dining Plan</span>
                </h4>
                <p className="text-xs text-slate-300">{trip.foodDetails.summary}</p>
                <p className="text-xs text-emerald-400 font-semibold">{trip.foodDetails.mealPlan}</p>
              </div>
            </div>
          )}

          {/* TAB 3: PICKUP & DROP */}
          {activeTab === 'pickups' && (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6">
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-white flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-emerald-400" />
                  <span>Official Boarding & Pickup Locations</span>
                </h4>
                {trip.pickupPoints.map((pickup, i) => (
                  <div key={i} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
                    <div className="flex justify-between items-center text-xs font-bold text-white">
                      <span>{pickup.location}</span>
                      <span className="text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-md">{pickup.reportingTime}</span>
                    </div>
                    <p className="text-xs text-slate-400">Landmark: {pickup.googleMapsLandmark}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: RULES & POLICIES */}
          {activeTab === 'rules' && (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 text-xs text-slate-300">
              <div className="space-y-2">
                <h4 className="text-sm font-bold text-white flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Trip Conduct Guidelines</span>
                </h4>
                <ul className="space-y-2">
                  {trip.tripRules.map((rule, idx) => (
                    <li key={idx} className="flex items-start space-x-2">
                      <span className="text-emerald-400 font-bold">•</span>
                      <span>{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border-t border-slate-800 pt-4 space-y-2">
                <h4 className="text-sm font-bold text-white">Cancellation Policy</h4>
                <p className="leading-relaxed bg-slate-950 p-4 rounded-2xl border border-slate-800">
                  {trip.cancellationPolicy}
                </p>
              </div>
            </div>
          )}

          {/* Inclusions & Exclusions Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>What's Included</span>
              </h4>
              <ul className="space-y-2 text-xs text-slate-300">
                {trip.inclusions.map((inc, i) => (
                  <li key={i} className="flex items-start space-x-2">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span>{inc}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center space-x-1.5">
                <XCircle className="w-4 h-4" />
                <span>What's Excluded</span>
              </h4>
              <ul className="space-y-2 text-xs text-slate-400">
                {trip.exclusions.map((exc, i) => (
                  <li key={i} className="flex items-start space-x-2">
                    <span className="text-rose-400 font-bold">✗</span>
                    <span>{exc}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>

        {/* Right Column (1/3): Trip Captain Profile & Booking Card */}
        <div className="space-y-6">
          
          {/* Sticky Booking CTA Box */}
          <div className="bg-slate-900 border-2 border-emerald-500/40 rounded-3xl p-6 shadow-2xl space-y-5 sticky top-24">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs text-slate-400">Per Person Fare</span>
                <p className="text-3xl font-black font-display text-white">
                  ₹{trip.pricePerPerson.toLocaleString('en-IN')}
                </p>
              </div>

              <div className="text-right">
                <span className="text-xs font-bold text-emerald-400 block">💺 {availableSeats} Seats Left</span>
                <span className="text-[10px] text-slate-500">{trip.totalSeats} Total Seats</span>
              </div>
            </div>

            {/* Vehicle spec badge */}
            <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 space-y-1.5 text-xs text-slate-300">
              <div className="flex justify-between font-bold">
                <span>{trip.vehicleDetails.name}</span>
                <span className="text-amber-400">AC Executive</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Pushback seats • USB Charging • Sanitized • Music
              </p>
            </div>

            <button
              onClick={() => onBookNow(trip)}
              disabled={availableSeats === 0}
              className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-800 text-slate-950 font-bold py-3.5 px-4 rounded-2xl text-sm shadow-xl shadow-emerald-500/20 transition-all hover:scale-[1.02] flex items-center justify-center space-x-2"
            >
              <Bus className="w-5 h-5" />
              <span>{availableSeats > 0 ? 'Select Seat & Book Now' : 'Trip Sold Out'}</span>
            </button>

            <div className="text-center text-[11px] text-slate-400 space-y-1">
              <p>🔒 Instant seat lock with digital ticket pass</p>
              <p>Free cancellation up to 7 days before departure</p>
            </div>
          </div>

          {/* Trip Captain Profile */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
            <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-emerald-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Your Certified Trip Captain</span>
            </div>

            <div className="flex items-center space-x-3">
              <img
                src={trip.tripCaptain.avatar}
                alt={trip.tripCaptain.name}
                className="w-14 h-14 rounded-2xl object-cover ring-2 ring-emerald-500/40"
              />
              <div>
                <h4 className="text-base font-bold text-white">{trip.tripCaptain.name}</h4>
                <div className="flex items-center space-x-2 text-xs text-slate-400 mt-0.5">
                  <span className="text-amber-400 font-bold">★ {trip.tripCaptain.rating}</span>
                  <span>• {trip.tripCaptain.experienceYears} Years Exp</span>
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-3 rounded-2xl border border-slate-800">
              "{trip.tripCaptain.bio}"
            </p>
          </div>

          {/* Live Pre-Trip Social Squad Room */}
          <SocialSquadChat tripId={trip.id} tripTitle={trip.title} currentUser={currentUser} />

        </div>

      </div>

    </div>
  );
};
