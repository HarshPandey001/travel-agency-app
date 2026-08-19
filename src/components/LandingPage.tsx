import React from 'react';
import { Compass, Users, Bus, ShieldCheck, HeartHandshake, Sparkles, MapPin, ArrowRight, Star, CheckCircle, Calendar, PhoneCall, Award, Coffee, Mountain } from 'lucide-react';
import { Trip } from '../types';
import { TripCard } from './TripCard';
import { AIVibeQuiz } from './AIVibeQuiz';
import { TravelerReviewsFeed } from './TravelerReviewsFeed';

interface LandingPageProps {
  trips: Trip[];
  onSelectTrip: (trip: Trip) => void;
  onExploreClick: () => void;
  onSafetyClick: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  trips,
  onSelectTrip,
  onExploreClick,
  onSafetyClick
}) => {
  const featuredTrips = trips.filter(t => t.featured || t.status === 'filling_fast').slice(0, 3);

  return (
    <div className="space-y-16 pb-16 text-white">
      
      {/* HERO SECTION */}
      <section className="relative min-h-[580px] sm:min-h-[640px] flex items-center justify-center rounded-3xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl px-4 sm:px-8 mt-4">
        {/* Background Image Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1920&q=80"
            alt="Social Travel Hero"
            className="w-full h-full object-cover opacity-30 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent"></div>
        </div>

        {/* Hero Content Box */}
        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6 my-10">
          
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-cyan-500/20 border border-emerald-500/40 px-4 py-2 rounded-full text-xs font-black text-emerald-300 backdrop-blur-md shadow-lg shadow-emerald-500/10">
            <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span>🔥 India's #1 Social Group Travel Network • ♂♀ 1:1 Gender Balanced Squads</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black font-display tracking-tight text-white leading-tight">
            Stop Waiting For Cancelled Plans. <br />
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
              Travel Solo. Return With Lifelong Friends.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-200 max-w-2xl mx-auto font-medium leading-relaxed">
            Join 20 like-minded solo travelers & friends on curated mountain expeditions. We manage luxury AC transport from <strong>Gorakhpur</strong>, <strong>Lucknow</strong> & <strong>Delhi</strong>, 3-star resort stays, campfire jam sessions, and epic itineraries!
          </p>

          {/* Call to Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={onExploreClick}
              className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold px-8 py-4 rounded-2xl text-base shadow-xl shadow-emerald-500/20 transition-all hover:scale-105 flex items-center space-x-2"
            >
              <Compass className="w-5 h-5" />
              <span>Explore Upcoming Trips</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <button
              onClick={onSafetyClick}
              className="bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold px-6 py-4 rounded-2xl text-sm transition-all flex items-center space-x-2 backdrop-blur-md"
            >
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span>How Social Travel Works</span>
            </button>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 border-t border-slate-800/80 max-w-3xl mx-auto">
            <div className="p-3 bg-slate-900/40 rounded-2xl border border-slate-800/60 backdrop-blur-xs">
              <p className="text-2xl font-black font-display text-emerald-400">100%</p>
              <p className="text-xs text-slate-400">Agency Organized</p>
            </div>
            <div className="p-3 bg-slate-900/40 rounded-2xl border border-slate-800/60 backdrop-blur-xs">
              <p className="text-2xl font-black font-display text-teal-400">20-Seater</p>
              <p className="text-xs text-slate-400">AC Executive Coaches</p>
            </div>
            <div className="p-3 bg-slate-900/40 rounded-2xl border border-slate-800/60 backdrop-blur-xs">
              <p className="text-2xl font-black font-display text-cyan-400">4.9 ★</p>
              <p className="text-xs text-slate-400">Traveler Rating</p>
            </div>
            <div className="p-3 bg-slate-900/40 rounded-2xl border border-slate-800/60 backdrop-blur-xs">
              <p className="text-2xl font-black font-display text-amber-400">12,000+</p>
              <p className="text-xs text-slate-400">Kilometers Covered</p>
            </div>
          </div>

        </div>
      </section>

      {/* HOW SOCIAL TRAVEL WORKS - THE MODEL */}
      <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-xl space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center space-x-1.5 text-xs font-bold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
            <Users className="w-3.5 h-3.5" />
            <span>The Social Travel Model</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold font-display text-white">
            How WanderVibe Group Trips Work
          </h2>
          <p className="text-slate-400 text-sm">
            We are a registered travel agency. We manage all logistics so strangers and friends can travel together safely.
          </p>
        </div>

        {/* 3 Step Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 relative space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center font-black font-display text-xl">
              01
            </div>
            <h3 className="text-lg font-bold text-white flex items-center space-x-2">
              <Bus className="w-5 h-5 text-amber-400" />
              <span>Independent Seat Booking</span>
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Example: A 20-seat AC Traveller leaves from <strong>Gorakhpur to Manali</strong>. Solo travelers, friends, or pairs reserve their own seats on our live seat map.
            </p>
          </div>

          <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 relative space-y-3">
            <div className="w-12 h-12 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20 flex items-center justify-center font-black font-display text-xl">
              02
            </div>
            <h3 className="text-lg font-bold text-white flex items-center space-x-2">
              <Coffee className="w-5 h-5 text-cyan-400" />
              <span>Full Agency Logistics</span>
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              We provide sanitized AC coaches, verified 3-star stays or alpine riverside camps, daily meals, local sightseeing permits, and an experienced Trip Captain.
            </p>
          </div>

          <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 relative space-y-3">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center font-black font-display text-xl">
              03
            </div>
            <h3 className="text-lg font-bold text-white flex items-center space-x-2">
              <HeartHandshake className="w-5 h-5 text-emerald-400" />
              <span>Natural Connection & Vibes</span>
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Travelers converse, share campfire stories, hike together, and make lifelong friends naturally. Any personal connections formed are completely your own.
            </p>
          </div>

        </div>
      </section>

      {/* AI Vibe Quiz Matcher */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AIVibeQuiz trips={trips} onSelectTrip={onSelectTrip} />
      </section>

      {/* FEATURED UPCOMING TRIPS */}
      <section className="space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 block mb-1">
              🔥 Handpicked Journeys
            </span>
            <h2 className="text-3xl font-bold font-display text-white">
              Upcoming Social Trips
            </h2>
          </div>

          <button
            onClick={onExploreClick}
            className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center space-x-1 transition-colors"
          >
            <span>View All {trips.length} Available Trips</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredTrips.map((trip) => (
            <TripCard key={trip.id} trip={trip} onSelectTrip={onSelectTrip} />
          ))}
        </div>
      </section>

      {/* TRUST & SAFETY HIGHLIGHT BANNER */}
      <section className="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-emerald-500/30 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center space-x-2 bg-emerald-500/20 text-emerald-300 px-3.5 py-1 rounded-full text-xs font-bold border border-emerald-500/30">
            <ShieldCheck className="w-4 h-4" />
            <span>Traveler Safety & Zero Tolerance Conduct</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold font-display text-white">
            Safe, Structured & Respectful Travel Environment
          </h2>

          <p className="text-slate-300 text-sm leading-relaxed">
            Our group trips enforce strict traveler conduct guidelines. Every trip is led by a background-verified Trip Captain trained in first aid and group coordination.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs text-slate-300">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Zero tolerance for harassment or non-consensual behavior</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Dedicated 24/7 Agency emergency helpline & captain tracking</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Solo female traveler friendly with preferred seat distribution</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Transparent cancellation & 100% verified stay locations</span>
            </div>
          </div>
        </div>
      </section>

      {/* CUSTOMER REVIEWS */}
      <section className="space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
            💬 Real Traveler Stories
          </span>
          <h2 className="text-3xl font-bold font-display text-white">
            What Co-Travelers Say
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
            <div className="flex items-center space-x-1 text-amber-400">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
            <p className="text-xs text-slate-300 italic leading-relaxed">
              "I booked the Gorakhpur to Manali trip solo. Within 2 hours in the Traveller, we were singing songs and playing games. The trip captain Vicky made everyone feel super comfortable!"
            </p>
            <div className="flex items-center space-x-3 pt-2 border-t border-slate-800">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
                alt="Traveler"
                className="w-10 h-10 rounded-full object-cover ring-2 ring-emerald-500/30"
              />
              <div>
                <p className="text-xs font-bold text-white">Kavya Verma</p>
                <p className="text-[10px] text-slate-400">Lucknow • Manali Expedition</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
            <div className="flex items-center space-x-1 text-amber-400">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
            <p className="text-xs text-slate-300 italic leading-relaxed">
              "Great vehicle condition, clear seat map during booking, and awesome bonfires at Sissu. WanderVibe handles logistics like a pro agency."
            </p>
            <div className="flex items-center space-x-3 pt-2 border-t border-slate-800">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80"
                alt="Traveler"
                className="w-10 h-10 rounded-full object-cover ring-2 ring-emerald-500/30"
              />
              <div>
                <p className="text-xs font-bold text-white">Tanmay Saxena</p>
                <p className="text-[10px] text-slate-400">Gorakhpur • Kasol Weekender</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
            <div className="flex items-center space-x-1 text-amber-400">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
            <p className="text-xs text-slate-300 italic leading-relaxed">
              "As a solo female traveler, safety was my #1 priority. The agency communicated everything upfront and the group vibes were super respectful."
            </p>
            <div className="flex items-center space-x-3 pt-2 border-t border-slate-800">
              <img
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80"
                alt="Traveler"
                className="w-10 h-10 rounded-full object-cover ring-2 ring-emerald-500/30"
              />
              <div>
                <p className="text-xs font-bold text-white">Ananya Roy</p>
                <p className="text-[10px] text-slate-400">Varanasi • Meghalaya Expedition</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Social Reviews Feed */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <TravelerReviewsFeed />
      </section>

    </div>
  );
};
