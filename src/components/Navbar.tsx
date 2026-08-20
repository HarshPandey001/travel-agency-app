import React from 'react';
import { Compass, User, ShieldCheck, LayoutDashboard, Sparkles, Phone, LogOut, Ticket, Coins } from 'lucide-react';
import { UserProfile, isUserAdmin } from '../types';

interface NavbarProps {
  activeTab: 'home' | 'explore' | 'safety' | 'legal' | 'admin' | 'profile' | 'my-bookings';
  setActiveTab: (tab: 'home' | 'explore' | 'safety' | 'legal' | 'admin' | 'profile' | 'my-bookings') => void;
  currentUser: UserProfile | null;
  onOpenAuthModal: () => void;
  onLogout: () => void;
  onOpenCoinsModal?: () => void;
  onOpenHotlineModal?: () => void;
  hasMissingPhone?: boolean;
  userBookingsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  onOpenAuthModal,
  onLogout,
  onOpenCoinsModal,
  onOpenHotlineModal,
  hasMissingPhone,
  userBookingsCount
}) => {
  const isAuthorizedAdmin = currentUser && (
    currentUser.isAdmin ||
    isUserAdmin(currentUser.email)
  );

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo */}
          <button 
            onClick={() => setActiveTab('home')} 
            className="flex items-center space-x-3 group focus:outline-none text-left"
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <Compass className="w-6 h-6 text-slate-950 font-bold" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-bold font-display tracking-tight text-white group-hover:text-emerald-400 transition-colors">
                  WanderVibe
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                  Agency
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">Curated Social Group Trips</p>
            </div>
          </button>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            <button
              onClick={() => setActiveTab('home')}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'home'
                  ? 'bg-slate-800 text-emerald-400 shadow-inner'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => setActiveTab('explore')}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center space-x-1.5 ${
                activeTab === 'explore'
                  ? 'bg-slate-800 text-emerald-400 shadow-inner'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>Explore Trips</span>
            </button>
            <button
              onClick={() => setActiveTab('safety')}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center space-x-1.5 ${
                activeTab === 'safety'
                  ? 'bg-slate-800 text-emerald-400 shadow-inner'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Trust & Safety</span>
            </button>

            <button
              onClick={() => setActiveTab('legal')}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center space-x-1.5 ${
                activeTab === 'legal'
                  ? 'bg-slate-800 text-emerald-400 shadow-inner'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <span>⚖️ Refund Terms</span>
            </button>

            {isAuthorizedAdmin && (
              <button
                onClick={() => setActiveTab('admin')}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center space-x-1.5 ${
                  activeTab === 'admin'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/50 border border-slate-700/50'
                }`}
              >
                <LayoutDashboard className="w-4 h-4 text-amber-400" />
                <span>Agency Panel</span>
              </button>
            )}
          </nav>

          {/* Right Action & User Profile Section */}
          <div className="flex items-center space-x-3">
            
            {/* Direct Trips Action */}
            <button
              onClick={onOpenHotlineModal}
              className="hidden md:flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700 px-3 py-2 rounded-xl text-xs font-bold transition-all"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>📞 24/7 Hotline</span>
            </button>

            <button
              onClick={onOpenCoinsModal}
              className="hidden sm:flex items-center space-x-1.5 bg-amber-400/10 hover:bg-amber-400/20 text-amber-300 border border-amber-400/30 px-3.5 py-2 rounded-xl text-xs font-bold transition-all hover:scale-105"
            >
              <Coins className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span>🪙 500 Coins</span>
            </button>

            <button
              onClick={() => setActiveTab('explore')}
              className="hidden lg:flex items-center space-x-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 px-4 py-2.5 rounded-xl text-sm font-bold shadow-md shadow-emerald-500/20 transition-all hover:scale-105"
            >
              <Sparkles className="w-4 h-4" />
              <span>Book Group Seat</span>
            </button>

            {currentUser ? (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setActiveTab('my-bookings')}
                  className={`p-2.5 rounded-xl transition-all relative ${
                    activeTab === 'my-bookings'
                      ? 'bg-slate-800 text-emerald-400'
                      : 'text-slate-300 hover:bg-slate-800/60'
                  }`}
                  title="My Booking Vouchers"
                >
                  <Ticket className="w-5 h-5" />
                  {userBookingsCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 text-slate-950 text-[10px] font-extrabold rounded-full flex items-center justify-center">
                      {userBookingsCount}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setActiveTab('profile')}
                  className={`flex items-center space-x-2 p-1.5 pr-3 rounded-xl border transition-all ${
                    activeTab === 'profile'
                      ? 'bg-slate-800 border-emerald-500/50 text-emerald-400'
                      : 'bg-slate-800/40 border-slate-700 hover:border-slate-600 text-slate-200'
                  }`}
                >
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-8 h-8 rounded-lg object-cover ring-2 ring-emerald-500/30"
                  />
                  <div className="text-left hidden sm:block">
                    <p className="text-xs font-bold truncate max-w-[100px]">{currentUser.name}</p>
                    {hasMissingPhone ? (
                      <p className="text-[10px] text-amber-400 font-semibold flex items-center">
                        <Phone className="w-2.5 h-2.5 mr-0.5" /> + Add Phone
                      </p>
                    ) : (
                      <p className="text-[10px] text-slate-400">{currentUser.city}</p>
                    )}
                  </div>
                </button>

                <button
                  onClick={onLogout}
                  className="p-2.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800/60 rounded-xl transition-colors"
                  title="Log out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuthModal}
                className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:border-slate-500"
              >
                <User className="w-4 h-4 text-emerald-400" />
                <span>Sign In / Register</span>
              </button>
            )}
          </div>

        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden flex items-center justify-around bg-slate-900 border-t border-slate-800 py-2.5 px-2">
        <button
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center space-y-1 text-xs font-medium ${
            activeTab === 'home' ? 'text-emerald-400' : 'text-slate-400'
          }`}
        >
          <Compass className="w-5 h-5" />
          <span>Home</span>
        </button>
        <button
          onClick={() => setActiveTab('explore')}
          className={`flex flex-col items-center space-y-1 text-xs font-medium ${
            activeTab === 'explore' ? 'text-emerald-400' : 'text-slate-400'
          }`}
        >
          <Compass className="w-5 h-5" />
          <span>Trips</span>
        </button>
        <button
          onClick={() => setActiveTab('safety')}
          className={`flex flex-col items-center space-y-1 text-xs font-medium ${
            activeTab === 'safety' ? 'text-emerald-400' : 'text-slate-400'
          }`}
        >
          <ShieldCheck className="w-5 h-5" />
          <span>Safety</span>
        </button>
        {isAuthorizedAdmin && (
          <button
            onClick={() => setActiveTab('admin')}
            className={`flex flex-col items-center space-y-1 text-xs font-medium ${
              activeTab === 'admin' ? 'text-emerald-400' : 'text-slate-400'
            }`}
          >
            <LayoutDashboard className="w-5 h-5 text-amber-400" />
            <span>Admin</span>
          </button>
        )}
        {currentUser ? (
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex flex-col items-center space-y-1 text-xs font-medium ${
              activeTab === 'profile' ? 'text-emerald-400' : 'text-slate-400'
            }`}
          >
            <User className="w-5 h-5" />
            <span>Profile</span>
          </button>
        ) : (
          <button
            onClick={onOpenAuthModal}
            className="flex flex-col items-center space-y-1 text-xs font-medium text-emerald-400"
          >
            <User className="w-5 h-5" />
            <span>Sign In</span>
          </button>
        )}
      </div>
    </header>
  );
};
