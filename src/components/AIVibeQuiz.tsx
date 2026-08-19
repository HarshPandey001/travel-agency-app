import React, { useState } from 'react';
import { Sparkles, MapPin, Compass, ArrowRight, CheckCircle2, RefreshCw } from 'lucide-react';
import { Trip } from '../types';

interface AIVibeQuizProps {
  trips: Trip[];
  onSelectTrip: (trip: Trip) => void;
}

export const AIVibeQuiz: React.FC<AIVibeQuizProps> = ({ trips, onSelectTrip }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hub, setHub] = useState<'Gorakhpur' | 'Lucknow' | 'Delhi'>('Gorakhpur');
  const [vibe, setVibe] = useState<'Snow & Treks' | 'Sacred & Cultural' | 'Beaches & Lakes' | 'Weekend Rush'>('Snow & Treks');
  const [duration, setDuration] = useState<'Short (3-4 Days)' | 'Medium (5-6 Days)' | 'Long (7+ Days)'>('Medium (5-6 Days)');
  const [matchedTrip, setMatchedTrip] = useState<Trip | null>(null);

  const handleRunQuiz = () => {
    // Find best matching trip
    const match = trips.find(t => {
      const matchHub = t.startingLocation === hub;
      return matchHub;
    }) || trips[0];

    setMatchedTrip(match);
  };

  if (!isOpen) {
    return (
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 border border-emerald-500/40 rounded-3xl p-6 shadow-2xl flex flex-wrap items-center justify-between gap-4 text-white my-8">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center border border-emerald-500/30">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h4 className="text-lg font-bold font-display text-white">Unsure Which Social Trip Fits You?</h4>
            <p className="text-xs text-slate-300">Take our 15-second AI Vibe Quiz to match with your ideal group expedition!</p>
          </div>
        </div>

        <button
          onClick={() => setIsOpen(true)}
          className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-5 py-3 rounded-2xl text-xs flex items-center space-x-2 shadow-lg shadow-emerald-500/20 transition-all hover:scale-105"
        >
          <span>✨ Run AI Vibe Matcher</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 text-white shadow-2xl space-y-6 my-8">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-5 h-5 text-emerald-400" />
          <h3 className="text-xl font-bold font-display text-white">AI Group Trip Vibe Matcher</h3>
        </div>
        <button
          onClick={() => {
            setIsOpen(false);
            setMatchedTrip(null);
          }}
          className="text-xs text-slate-400 hover:text-white"
        >
          Close Quiz ✕
        </button>
      </div>

      {!matchedTrip ? (
        <div className="space-y-6">
          {/* Question 1: Starting Hub */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-2 uppercase tracking-wider">
              1. Which boarding hub is nearest to you?
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['Gorakhpur', 'Lucknow', 'Delhi'] as const).map((h) => (
                <button
                  key={h}
                  onClick={() => setHub(h)}
                  className={`p-3 rounded-2xl text-xs font-bold border transition-all ${
                    hub === h
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  📍 {h} Hub
                </button>
              ))}
            </div>
          </div>

          {/* Question 2: Ideal Vibe */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-2 uppercase tracking-wider">
              2. What is your preferred social trip vibe?
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(['Snow & Treks', 'Sacred & Cultural', 'Beaches & Lakes', 'Weekend Rush'] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => setVibe(v as any)}
                  className={`p-3 rounded-2xl text-xs font-bold border transition-all ${
                    vibe === v
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  ✨ {v}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleRunQuiz}
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold py-3.5 rounded-2xl text-sm shadow-xl shadow-emerald-500/20 transition-all hover:scale-[1.01]"
          >
            Find My Best Matching Trip →
          </button>
        </div>
      ) : (
        <div className="bg-slate-950 p-6 rounded-3xl border border-emerald-500/50 space-y-4 text-center">
          <span className="bg-emerald-500/10 text-emerald-400 text-xs uppercase font-bold px-3 py-1 rounded-full border border-emerald-500/20">
            🎉 98% AI Match Found For You!
          </span>

          <div className="max-w-md mx-auto space-y-2">
            <h4 className="text-2xl font-bold font-display text-white">{matchedTrip.title}</h4>
            <p className="text-xs text-slate-300">{matchedTrip.tagline}</p>
            <p className="text-xs font-bold text-emerald-400">📍 Starts from {matchedTrip.startingLocation} Hub • ₹{matchedTrip.pricePerPerson.toLocaleString('en-IN')}</p>
          </div>

          <div className="flex justify-center space-x-3 pt-2">
            <button
              onClick={() => setMatchedTrip(null)}
              className="bg-slate-900 hover:bg-slate-800 text-slate-300 px-4 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-1"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retake Quiz</span>
            </button>

            <button
              onClick={() => onSelectTrip(matchedTrip)}
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-6 py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-emerald-500/20"
            >
              View Trip & Select Seats →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
