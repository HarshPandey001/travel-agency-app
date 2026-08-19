import React, { useState } from 'react';
import { Star, MessageCircle, ThumbsUp, Sparkles, CheckCircle2, User, Camera } from 'lucide-react';

export interface Review {
  id: string;
  travelerName: string;
  travelerCity: string;
  tripTitle: string;
  rating: number;
  date: string;
  comment: string;
  photoUrl?: string;
  helpfulCount: number;
}

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    travelerName: 'Priya Srivastava',
    travelerCity: 'Gorakhpur Hub',
    tripTitle: 'MANALI & SOLANG SOCIAL EXPEDITION',
    rating: 5,
    date: 'August 14, 2026',
    comment: 'I was hesitant to travel solo for the first time, but WanderVibe agency made it so safe and fun! Met 18 amazing strangers, 1:1 gender balance was perfect. Captain Vicky is super caring! 🏔🔥',
    photoUrl: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=600&q=80',
    helpfulCount: 42
  },
  {
    id: 'rev-2',
    travelerName: 'Aditya Verma',
    travelerCity: 'Lucknow Hub',
    tripTitle: 'KASOL & KHEERGANGA HOT SPRINGS TREK',
    rating: 5,
    date: 'August 02, 2026',
    comment: 'Boarded from Lucknow Hub. The AC Traveller was super comfortable with pushback seats. Bonfire night by Parvati river was unforgettable! 🎸⛺️',
    photoUrl: 'https://images.unsplash.com/photo-1596895111956-bf1cf0599ce5?auto=format&fit=crop&w=600&q=80',
    helpfulCount: 28
  },
  {
    id: 'rev-3',
    travelerName: 'Sneha Pandey',
    travelerCity: 'Gorakhpur Hub',
    tripTitle: 'NEPAL HIGHLIGHTS: KATHMANDU & POKHARA LAKES',
    rating: 5,
    date: 'July 28, 2026',
    comment: 'Nepal trip from Gorakhpur border transit was hassle-free! Beautiful Phewa Lake boating and Sarangkot sunrise. Loved the squad chat feature too! 🇳🇵✨',
    photoUrl: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=600&q=80',
    helpfulCount: 35
  }
];

export const TravelerReviewsFeed: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [helpfulLikes, setHelpfulLikes] = useState<Record<string, number>>({});

  const handleLike = (id: string) => {
    setHelpfulLikes(prev => ({
      ...prev,
      [id]: (prev[id] || 0) + 1
    }));
  };

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 text-white space-y-6 shadow-2xl">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="inline-flex items-center space-x-2 bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full text-xs font-bold border border-emerald-500/20 mb-1">
            <Star className="w-3.5 h-3.5 fill-emerald-400" />
            <span>4.95 / 5.0 Rating Across 1,200+ Travelers</span>
          </div>
          <h3 className="text-2xl font-bold font-display text-white">
            Verified Traveler Reviews & Social Stories
          </h3>
          <p className="text-xs text-slate-400">Read authentic feedback from solo travelers and friends who booked starting from Gorakhpur, Lucknow & Delhi.</p>
        </div>
      </div>

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {reviews.map((rev) => {
          const extraLikes = helpfulLikes[rev.id] || 0;
          return (
            <div key={rev.id} className="bg-slate-900 border border-slate-800 hover:border-emerald-500/40 p-5 rounded-3xl space-y-4 flex flex-col justify-between group transition-all">
              
              <div className="space-y-3">
                {/* Traveler Info Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-slate-950 font-black text-sm flex items-center justify-center shadow-md">
                      {rev.travelerName.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white flex items-center space-x-1">
                        <span>{rev.travelerName}</span>
                        <CheckCircle2 className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                      </h4>
                      <p className="text-[10px] text-slate-400">📍 {rev.travelerCity}</p>
                    </div>
                  </div>

                  <div className="flex items-center text-amber-400 space-x-0.5 text-xs font-bold bg-slate-950 px-2 py-1 rounded-lg border border-slate-800">
                    <Star className="w-3 h-3 fill-amber-400" />
                    <span>{rev.rating}.0</span>
                  </div>
                </div>

                {/* Photo Preview if available */}
                {rev.photoUrl && (
                  <div className="relative h-32 rounded-2xl overflow-hidden border border-slate-800">
                    <img src={rev.photoUrl} alt={rev.tripTitle} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
                    <span className="absolute bottom-2 left-2 text-[10px] text-emerald-300 font-bold bg-slate-950/80 px-2 py-0.5 rounded-full border border-slate-800">
                      {rev.tripTitle.split(' ')[0]} Trip Memory
                    </span>
                  </div>
                )}

                <p className="text-xs text-slate-300 leading-relaxed italic">
                  "{rev.comment}"
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                <span>{rev.date}</span>
                <button
                  onClick={() => handleLike(rev.id)}
                  className="flex items-center space-x-1 hover:text-emerald-400 transition-colors bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800"
                >
                  <ThumbsUp className="w-3 h-3 text-emerald-400" />
                  <span>Helpful ({rev.helpfulCount + extraLikes})</span>
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
