import React, { useState } from 'react';
import { UserProfile, Booking, TravelStyle } from '../types';
import { TicketVoucher } from './TicketVoucher';
import { User, Phone, MapPin, Sparkles, Ticket, Check, ShieldCheck, Heart, Camera, Mountain, Coffee, Utensils } from 'lucide-react';

interface UserProfileModalProps {
  user: UserProfile;
  bookings: Booking[];
  onUpdateProfile: (updatedProfile: Partial<UserProfile>) => void;
  onClose: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  user,
  bookings,
  onUpdateProfile,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'bookings'>('profile');
  const [phoneInput, setPhoneInput] = useState(user.phone || '');
  const [cityInput, setCityInput] = useState(user.city || '');
  const [selectedStyles, setSelectedStyles] = useState<TravelStyle[]>(user.travelStyles || []);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [selectedVoucherBooking, setSelectedVoucherBooking] = useState<Booking | null>(null);

  const availableTravelStyles: TravelStyle[] = [
    'Adventure & Trekking',
    'Nature & Camping',
    'Himalayan Escape',
    'Culture & Heritage',
    'Beach & Coastal Vibes',
    'Relaxation & Stargazing',
    'Photography & Sunsets',
    'Weekend Rush'
  ];

  const handleToggleStyle = (style: TravelStyle) => {
    if (selectedStyles.includes(style)) {
      setSelectedStyles(prev => prev.filter(s => s !== style));
    } else {
      setSelectedStyles(prev => [...prev, style]);
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      phone: phoneInput,
      city: cityInput,
      travelStyles: selectedStyles
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-4xl mx-auto shadow-2xl text-white space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div className="flex items-center space-x-4">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-16 h-16 rounded-2xl object-cover ring-4 ring-emerald-500/30 shadow-lg"
          />
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-2xl font-bold font-display text-white">{user.name}</h2>
              <span className="bg-emerald-500/10 text-emerald-400 text-xs px-2.5 py-0.5 rounded-full border border-emerald-500/20 font-bold">
                Verified Traveler
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">{user.email}</p>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex space-x-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'profile'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            👤 Profile & Preferences
          </button>
          <button
            onClick={() => setActiveTab('bookings')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
              activeTab === 'bookings'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Ticket className="w-3.5 h-3.5" />
            <span>My Booking Passes ({bookings.length})</span>
          </button>
        </div>
      </div>

      {/* TAB 1: PROFILE & PHONE & PREFERENCES */}
      {activeTab === 'profile' && (
        <form onSubmit={handleSaveProfile} className="space-y-6">
          
          {savedSuccess && (
            <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-3.5 rounded-2xl text-xs flex items-center space-x-2 font-bold">
              <Check className="w-4 h-4" />
              <span>Profile & Travel Preferences Saved Successfully!</span>
            </div>
          )}

          {/* Traveler Badges & Status */}
          <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 p-5 rounded-3xl border border-slate-800 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Earned Traveler Badges & Verification Status</span>
            </h3>

            <div className="flex flex-wrap gap-2 text-xs font-bold">
              <span className="bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 px-3 py-1 rounded-xl flex items-center space-x-1">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Verified Social Traveler</span>
              </span>
              <span className="bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 px-3 py-1 rounded-xl flex items-center space-x-1">
                <Mountain className="w-3.5 h-3.5 text-cyan-400" />
                <span>Himalayan Expedition Pioneer</span>
              </span>
              <span className="bg-amber-400/10 text-amber-300 border border-amber-400/30 px-3 py-1 rounded-xl flex items-center space-x-1">
                <span>🪙 500 WanderCoins Balance</span>
              </span>
              <span className="bg-slate-900 text-slate-300 border border-slate-700 px-3 py-1 rounded-xl flex items-center space-x-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Govt ID Verified</span>
              </span>
            </div>
          </div>

          {/* Contact Details Section */}
          <div className="bg-slate-950 p-5 rounded-3xl border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Phone className="w-4 h-4 text-emerald-400" />
              <span>Travel Contact & City Details</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Mobile / WhatsApp Number (For Trip Alerts)
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    value={phoneInput}
                    onChange={(e) => setPhoneInput(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full bg-slate-900 border border-slate-700 focus:border-emerald-500 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Current City
                </label>
                <input
                  type="text"
                  value={cityInput}
                  onChange={(e) => setCityInput(e.target.value)}
                  placeholder="e.g. Gorakhpur, Lucknow, Delhi"
                  className="w-full bg-slate-900 border border-slate-700 focus:border-emerald-500 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Optional Travel Preferences */}
          <div className="bg-slate-950 p-5 rounded-3xl border border-slate-800 space-y-4">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Travel Preferences & Vibe Tags</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Select your travel styles so we can recommend suitable group trips.
              </p>
            </div>

            <div className="flex flex-wrap gap-2.5">
              {availableTravelStyles.map((style) => {
                const isSelected = selectedStyles.includes(style);
                return (
                  <button
                    key={style}
                    type="button"
                    onClick={() => handleToggleStyle(style)}
                    className={`px-3.5 py-2 rounded-2xl text-xs font-semibold border transition-all ${
                      isSelected
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-sm'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {isSelected ? '✓ ' : '+ '} {style}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Earned Badges */}
          <div className="bg-slate-950 p-5 rounded-3xl border border-slate-800 space-y-3">
            <h3 className="text-sm font-bold text-white">Earned Traveler Badges</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {user.badges.map((badge, idx) => (
                <div key={idx} className="bg-slate-900 p-3.5 rounded-2xl border border-slate-800 flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center font-bold text-sm">
                    ✨
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">{badge.title}</p>
                    <p className="text-[10px] text-slate-400">{badge.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* REFERRAL & WANDERCOINS VERIFICATION RULES CARD */}
          <div className="bg-gradient-to-r from-amber-950/40 via-slate-900 to-amber-950/40 border border-amber-500/30 p-5 rounded-3xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-lg">🪙</span>
                <div>
                  <h4 className="text-sm font-bold text-amber-300">Referral Program & WanderCoins Rules</h4>
                  <p className="text-[11px] text-slate-300">Invite friends & get 🪙 500 Coins (₹500 value)</p>
                </div>
              </div>
              <span className="bg-amber-500/10 text-amber-300 text-xs font-mono font-bold px-3 py-1 rounded-xl border border-amber-500/30">
                CODE: HARSH-VIBE-2026
              </span>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800/80 text-xs space-y-2 text-slate-300">
              <div className="flex items-start space-x-2">
                <span className="text-amber-400 font-bold">1.</span>
                <p>Give your Referral Code <strong>HARSH-VIBE-2026</strong> to your travel buddy. They get <strong>₹500 instant discount</strong> on checkout.</p>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-amber-400 font-bold">2.</span>
                <p className="text-emerald-300 font-semibold">
                  ⚡ <strong>Payment Verification Rule:</strong> WanderCoins (🪙 500) are credited to YOUR balance ONLY AFTER your referred friend completes a successful seat booking & Razorpay payment!
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-6 py-3 rounded-2xl text-xs shadow-lg shadow-emerald-500/20 transition-all hover:scale-105"
            >
              Save Profile & Preferences
            </button>
          </div>

        </form>
      )}

      {/* TAB 2: MY BOOKINGS & TICKETS */}
      {activeTab === 'bookings' && (
        <div className="space-y-4">
          {selectedVoucherBooking ? (
            <div>
              <button
                onClick={() => setSelectedVoucherBooking(null)}
                className="mb-4 text-xs text-slate-400 hover:text-white font-bold underline"
              >
                ← Back to Bookings List
              </button>
              <TicketVoucher booking={selectedVoucherBooking} />
            </div>
          ) : bookings.length === 0 ? (
            <div className="bg-slate-950 p-8 rounded-3xl border border-slate-800 text-center space-y-2">
              <Ticket className="w-10 h-10 text-slate-600 mx-auto" />
              <p className="text-sm font-bold text-white">No Active Bookings Yet</p>
              <p className="text-xs text-slate-400">Explore trips and reserve your seat to get a printable voucher pass!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {bookings.map((b) => (
                <div
                  key={b.id}
                  className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-3 hover:border-emerald-500/40 transition-colors"
                >
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                        {b.status}
                      </span>
                      <span className="text-xs text-slate-400">Pass ID: {b.id}</span>
                    </div>
                    <h4 className="text-base font-bold text-white mt-1">{b.tripTitle}</h4>
                    <p className="text-xs text-slate-400">
                      📅 {b.startDate} to {b.endDate} • 💺 Seat #{b.seatNumbers.join(', #')}
                    </p>
                  </div>

                  <button
                    onClick={() => setSelectedVoucherBooking(b)}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-4 py-2 rounded-xl text-xs font-bold transition-all"
                  >
                    View Digital Voucher Pass
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
};
