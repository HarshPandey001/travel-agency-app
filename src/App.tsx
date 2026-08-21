import React, { useState, useEffect } from 'react';
import { Trip, Booking, UserProfile, SeatInfo, TripAnnouncement, ADMIN_EMAIL, isUserAdmin } from './types';
import { INITIAL_TRIPS, INITIAL_USER, INITIAL_BOOKINGS, INITIAL_ANNOUNCEMENTS } from './data/initialData';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { ExploreTrips } from './components/ExploreTrips';
import { TripDetails } from './components/TripDetails';
import { BookingModal } from './components/BookingModal';
import { UserProfileModal } from './components/UserProfileModal';
import { AdminDashboard } from './components/AdminDashboard';
import { AuthModal } from './components/AuthModal';
import { Footer } from './components/Footer';
import { WanderCoinsModal } from './components/WanderCoinsModal';
import { CaptainHotlineModal } from './components/CaptainHotlineModal';
import { LegalPolicies } from './components/LegalPolicies';
import { GatewayCheckout } from './components/GatewayCheckout';
import { onAuthStateChanged, auth, logoutFirebase, checkRedirectResult, extractGoogleUserData } from './lib/firebase';
import { ShieldCheck, Megaphone, Bell, Sparkles, Phone, CheckCircle, ArrowRight } from 'lucide-react';

export default function App() {
  // Check if Gateway Hosted Checkout URL
  const [gatewaySessionId] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null;
    const urlParams = new URLSearchParams(window.location.search);
    const paySession = urlParams.get('pay_session') || urlParams.get('session_id') || urlParams.get('session');
    if (paySession) return paySession;

    // Check path /pay/:sessionId
    const pathParts = window.location.pathname.split('/');
    const payIndex = pathParts.indexOf('pay');
    if (payIndex !== -1 && pathParts[payIndex + 1]) {
      return pathParts[payIndex + 1];
    }
    return null;
  });

  // Navigation State
  const [activeTab, setActiveTab] = useState<'home' | 'explore' | 'trip-details' | 'safety' | 'legal' | 'admin' | 'profile' | 'my-bookings'>('home');
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  
  // Data Persistence State
  const [trips, setTrips] = useState<Trip[]>(() => {
    const saved = localStorage.getItem('wv_trips');
    return saved ? JSON.parse(saved) : INITIAL_TRIPS;
  });

  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem('wv_bookings');
    return saved ? JSON.parse(saved) : INITIAL_BOOKINGS;
  });

  const [announcements, setAnnouncements] = useState<TripAnnouncement[]>(() => {
    const saved = localStorage.getItem('wv_announcements');
    return saved ? JSON.parse(saved) : INITIAL_ANNOUNCEMENTS;
  });

  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('wv_user');
    if (!saved) return null;
    try {
      const parsed = JSON.parse(saved);
      if (!parsed.email || parsed.email === 'traveler@gmail.com' || parsed.email === 'aarav.sharma@gmail.com') {
        localStorage.removeItem('wv_user');
        return null;
      }
      return parsed;
    } catch {
      localStorage.removeItem('wv_user');
      return null;
    }
  });

  // Modal States
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isCoinsModalOpen, setIsCoinsModalOpen] = useState(false);
  const [isHotlineModalOpen, setIsHotlineModalOpen] = useState(false);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('wv_trips', JSON.stringify(trips));
  }, [trips]);

  useEffect(() => {
    localStorage.setItem('wv_bookings', JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem('wv_announcements', JSON.stringify(announcements));
  }, [announcements]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('wv_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('wv_user');
    }
  }, [currentUser]);

  // Firebase Auth State Observer: Handles Google Signup/Login
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const data = extractGoogleUserData(firebaseUser);
        const isAdmin = isUserAdmin(data.email);
        
        handleLoginSuccess({
          id: data.id,
          name: data.name || (isAdmin ? 'Harsh Vardhan (Admin)' : 'Traveler'),
          email: data.email,
          avatar: data.avatar || (isAdmin
            ? 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80'
            : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'),
          phone: data.phone,
          isAdmin
        });
      }
    });

    // Also check redirect result if page redirected
    checkRedirectResult().then(({ user }) => {
      if (user) {
        const data = extractGoogleUserData(user);
        const isAdmin = isUserAdmin(data.email);
        handleLoginSuccess({
          id: data.id,
          name: data.name || (isAdmin ? 'Harsh Vardhan (Admin)' : 'Traveler'),
          email: data.email,
          avatar: data.avatar || (isAdmin
            ? 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80'
            : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'),
          phone: data.phone,
          isAdmin
        });
      }
    });

    return () => unsubscribe();
  }, []);



  // Handlers
  const handleSelectTrip = (trip: Trip) => {
    setSelectedTrip(trip);
    setActiveTab('trip-details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenBookingModal = (trip: Trip) => {
    setSelectedTrip(trip);
    setIsBookingModalOpen(true);
  };

  const handleCompleteBooking = (newBooking: Booking, updatedTripSeats: SeatInfo[]) => {
    setBookings(prev => [newBooking, ...prev]);

    // Update seats in trips state
    setTrips(prevTrips =>
      prevTrips.map(t => {
        if (t.id === newBooking.tripId) {
          return {
            ...t,
            seats: updatedTripSeats
          };
        }
        return t;
      })
    );

    if (selectedTrip && selectedTrip.id === newBooking.tripId) {
      setSelectedTrip({
        ...selectedTrip,
        seats: updatedTripSeats
      });
    }
  };

  const handleCreateTrip = (newTrip: Trip) => {
    setTrips(prev => [newTrip, ...prev]);
  };

  const handleUpdateTrip = (updatedTrip: Trip) => {
    setTrips(prev => prev.map(t => t.id === updatedTrip.id ? updatedTrip : t));
    if (selectedTrip?.id === updatedTrip.id) {
      setSelectedTrip(updatedTrip);
    }
  };

  const handleDeleteTrip = (tripId: string) => {
    setTrips(prev => prev.filter(t => t.id !== tripId));
    if (selectedTrip?.id === tripId) {
      setSelectedTrip(null);
      setActiveTab('explore');
    }
  };

  const handleSendAnnouncement = (announcement: TripAnnouncement) => {
    setAnnouncements(prev => [announcement, ...prev]);
  };

  const handleCancelBooking = (bookingId: string, cancellationReason: string = 'Cancelled by Agency Admin Desk') => {
    const targetBooking = bookings.find(b => b.id === bookingId);
    if (!targetBooking) return;

    // Mark booking as cancelled in state
    setBookings(prev => prev.map(b => {
      if (b.id === bookingId) {
        return {
          ...b,
          status: 'cancelled' as const,
          cancellationReason
        };
      }
      return b;
    }));

    // Release bus seats back to available
    setTrips(prev => prev.map(t => {
      if (t.id === targetBooking.tripId) {
        const updatedSeats = t.seats.map(s => {
          if (targetBooking.seatNumbers.includes(s.seatNumber)) {
            return {
              ...s,
              status: 'available' as const,
              bookedBy: undefined
            };
          }
          return s;
        });
        return {
          ...t,
          seats: updatedSeats
        };
      }
      return t;
    }));
  };

  const handleLoginSuccess = (userPartial: Partial<UserProfile>) => {
    const userEmail = (userPartial.email || '').trim().toLowerCase();
    if (!userEmail) return;

    const isAdmin = userPartial.isAdmin !== undefined
      ? userPartial.isAdmin
      : isUserAdmin(userEmail);

    const userName = userPartial.name || userEmail.split('@')[0] || (isAdmin ? 'Harsh Vardhan (Admin)' : 'Traveler');

    const updatedUser: UserProfile = {
      id: userPartial.id || `usr-${Date.now()}`,
      name: userName,
      email: userEmail,
      phone: userPartial.phone || '',
      avatar: userPartial.avatar || (isAdmin
        ? 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80'
        : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'),
      age: userPartial.age || 25,
      gender: userPartial.gender || 'male',
      city: userPartial.city || 'Gorakhpur',
      bio: userPartial.bio || 'Curated travel enthusiast.',
      travelStyles: userPartial.travelStyles || ['Himalayan Escape', 'Adventure & Trekking'],
      travelInterests: userPartial.travelInterests || ['Mountain Trips', 'Trekking'],
      badges: userPartial.badges || [{ title: 'Social Explorer', icon: 'Sparkles', description: 'Joined group travel' }],
      joinedDate: userPartial.joinedDate || new Date().toISOString().split('T')[0],
      isAdmin
    };

    setCurrentUser(updatedUser);
    localStorage.setItem('wv_user', JSON.stringify(updatedUser));
    if (isAdmin) {
      setActiveTab('admin');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleLogout = () => {
    logoutFirebase();
    setCurrentUser(null);
    setActiveTab('home');
  };

  // User missing phone indicator
  const hasMissingPhone = currentUser ? !currentUser.phone || currentUser.phone.trim() === '' : false;
  const userBookings = currentUser ? bookings.filter(b => b.primaryTraveler.email === currentUser.email || b.primaryTraveler.phone === currentUser.phone) : bookings;

  // If hosted gateway checkout session, render standalone page
  if (gatewaySessionId) {
    return <GatewayCheckout sessionId={gatewaySessionId} />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col selection:bg-emerald-500 selection:text-slate-950">
      
      {/* Announcement Notification Banner */}
      {announcements.length > 0 && (
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-slate-950 font-bold px-4 py-2 text-xs text-center flex items-center justify-center space-x-2">
          <Megaphone className="w-4 h-4 flex-shrink-0 animate-bounce" />
          <span className="truncate">
            <strong>{announcements[0].tripTitle}:</strong> {announcements[0].title} — "{announcements[0].message}"
          </span>
        </div>
      )}

      {/* Main Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        currentUser={currentUser}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
        onOpenCoinsModal={() => setIsCoinsModalOpen(true)}
        onOpenHotlineModal={() => setIsHotlineModalOpen(true)}
        hasMissingPhone={hasMissingPhone}
        userBookingsCount={userBookings.length}
      />

      {/* Main Application Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* VIEW 1: HOME LANDING PAGE */}
        {activeTab === 'home' && (
          <LandingPage
            trips={trips}
            onSelectTrip={handleSelectTrip}
            onExploreClick={() => {
              setActiveTab('explore');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onSafetyClick={() => {
              setActiveTab('safety');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {/* VIEW 2: EXPLORE TRIPS */}
        {activeTab === 'explore' && (
          <ExploreTrips
            trips={trips}
            onSelectTrip={handleSelectTrip}
          />
        )}

        {/* VIEW 3: TRIP DETAILS VIEW */}
        {activeTab === 'trip-details' && selectedTrip && (
          <TripDetails
            trip={selectedTrip}
            currentUser={currentUser}
            onBack={() => setActiveTab('explore')}
            onBookNow={handleOpenBookingModal}
          />
        )}

        {/* VIEW 4: TRUST & SAFETY PAGE */}
        {activeTab === 'safety' && (
          <div className="space-y-8 pb-16">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-4">
              <div className="inline-flex items-center space-x-2 bg-emerald-500/10 text-emerald-400 px-3.5 py-1 rounded-full text-xs font-bold border border-emerald-500/20">
                <ShieldCheck className="w-4 h-4" />
                <span>Travel Organizer Standard</span>
              </div>
              <h1 className="text-3xl font-bold font-display text-white">
                Trust, Safety & Social Travel Code of Conduct
              </h1>
              <p className="text-slate-300 text-sm leading-relaxed max-w-3xl">
                WanderVibe operates as a registered travel agency organizing curated group trips. We manage destination itineraries, AC transportation, stays, and activities. Personal connections formed between participants are entirely their own choice.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-3">
                <h3 className="text-lg font-bold text-emerald-400 flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5" />
                  <span>Agency Responsibilities</span>
                </h3>
                <ul className="space-y-2 text-xs text-slate-300">
                  <li>• Commercial sanitized pushback AC vehicles (Force Traveller / Urbania / Volvo)</li>
                  <li>• Pre-inspected 3-star resorts, heritage stays & riverside camps</li>
                  <li>• Full-time certified Trip Captain with emergency medical training</li>
                  <li>• Day-by-day sightseeing permits and state transport clearances</li>
                </ul>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-3">
                <h3 className="text-lg font-bold text-amber-400 flex items-center space-x-2">
                  <ShieldCheck className="w-5 h-5" />
                  <span>Traveler Code of Conduct</span>
                </h3>
                <ul className="space-y-2 text-xs text-slate-300">
                  <li>• Strict zero-tolerance for any non-consensual behavior or harassment</li>
                  <li>• Mutual respect towards co-travelers and local Himalayan cultures</li>
                  <li>• Punctuality at all designated pickup and departure points</li>
                  <li>• Valid Govt photo ID required before vehicle boarding</li>
                </ul>
              </div>

            </div>
          </div>
        )}

        {/* VIEW 5: LEGAL POLICIES & RAZORPAY TERMS */}
        {activeTab === 'legal' && (
          <LegalPolicies />
        )}

        {/* VIEW 5: ADMIN DASHBOARD */}
        {activeTab === 'admin' && (
          <AdminDashboard
            trips={trips}
            bookings={bookings}
            announcements={announcements}
            currentUser={currentUser}
            onOpenAuthModal={() => setIsAuthModalOpen(true)}
            onCreateTrip={handleCreateTrip}
            onUpdateTrip={handleUpdateTrip}
            onDeleteTrip={handleDeleteTrip}
            onSendAnnouncement={handleSendAnnouncement}
            onCancelBooking={handleCancelBooking}
          />
        )}

        {/* VIEW 6: USER PROFILE & PREFERENCES */}
        {(activeTab === 'profile' || activeTab === 'my-bookings') && currentUser && (
          <UserProfileModal
            user={currentUser}
            bookings={userBookings}
            onUpdateProfile={(updated) => handleLoginSuccess(updated)}
            onClose={() => setActiveTab('home')}
          />
        )}

      </main>

      {/* Footer Component */}
      <Footer onNavigate={(tab) => {
        setActiveTab(tab);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }} />

      {/* Auth Modal (Firebase Google Sign In + Phone Collector) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Checkout & Seat Booking Modal */}
      {isBookingModalOpen && selectedTrip && (
        <BookingModal
          trip={selectedTrip}
          isOpen={isBookingModalOpen}
          onClose={() => setIsBookingModalOpen(false)}
          currentUser={currentUser}
          onOpenAuthModal={() => setIsAuthModalOpen(true)}
          onCompleteBooking={handleCompleteBooking}
        />
      )}

      {/* WanderCoins & Referral Program Modal */}
      {isCoinsModalOpen && (
        <WanderCoinsModal
          currentUser={currentUser}
          onClose={() => setIsCoinsModalOpen(false)}
        />
      )}

      {/* 24/7 Agency Safety & Trip Captain Hotline Modal */}
      {isHotlineModalOpen && (
        <CaptainHotlineModal
          onClose={() => setIsHotlineModalOpen(false)}
        />
      )}

    </div>
  );
}
