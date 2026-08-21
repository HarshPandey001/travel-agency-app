import React, { useState } from 'react';
import { Trip, Booking, SeatInfo, TripAnnouncement, UserProfile, ADMIN_EMAIL } from '../types';
import { DESTINATION_PRESETS, TripPreset } from '../data/tripPresets';
import { SeatMap } from './SeatMap';
import { ImageUploader } from './ImageUploader';
import { AdminGeminiAssistant } from './AdminGeminiAssistant';
import { LayoutDashboard, Plus, Trash2, Edit3, Users, DollarSign, Bus, Megaphone, ShieldCheck, Sparkles, CheckCircle, AlertCircle, MapPin, Calendar, Lock, ShieldAlert, KeyRound, User, Rocket, Compass, Filter, X, Zap, Copy, Check, Eye, EyeOff, Code, Globe, ArrowUpRight, CheckCircle2, RefreshCw, Repeat } from 'lucide-react';

interface AdminDashboardProps {
  trips: Trip[];
  bookings: Booking[];
  announcements: TripAnnouncement[];
  currentUser: UserProfile | null;
  onOpenAuthModal: () => void;
  onCreateTrip: (newTrip: Trip) => void;
  onUpdateTrip: (updatedTrip: Trip) => void;
  onDeleteTrip: (tripId: string) => void;
  onSendAnnouncement: (announcement: TripAnnouncement) => void;
  onCancelBooking?: (bookingId: string, cancellationReason: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  trips,
  bookings,
  announcements,
  currentUser,
  onOpenAuthModal,
  onCreateTrip,
  onUpdateTrip,
  onDeleteTrip,
  onSendAnnouncement,
  onCancelBooking
}) => {
  const [activeTab, setActiveTab] = useState<'trips' | 'seat_mgmt' | 'roster' | 'cancelled_tickets' | 'announcements' | 'gemini_ai' | 'gateway_api'>('trips');
  const [cancellingBooking, setCancellingBooking] = useState<Booking | null>(null);
  const [cancellationReasonInput, setCancellationReasonInput] = useState<string>('Traveler Cancellation Request / Refund Processed');
  const [isCreatingTrip, setIsCreatingTrip] = useState(false);
  const [isPresetLibraryOpen, setIsPresetLibraryOpen] = useState(false);
  const [selectedRegionFilter, setSelectedRegionFilter] = useState<string>('All');
  const [selectedHubFilter, setSelectedHubFilter] = useState<string>('All');

  const [selectedSeatMgmtTripId, setSelectedSeatMgmtTripId] = useState<string>(trips[0]?.id || '');
  const [selectedRosterTripId, setSelectedRosterTripId] = useState<string>(trips[0]?.id || '');
  const [resendingBookingId, setResendingBookingId] = useState<string | null>(null);

  // Universal Payment Gateway API State
  const [gatewayApiKey, setGatewayApiKey] = useState('wv_gw_live_sec_harsh9988');
  const [showApiKey, setShowApiKey] = useState(false);
  const [isCopiedKey, setIsCopiedKey] = useState(false);
  const [isCopiedEndpoint, setIsCopiedEndpoint] = useState(false);
  const [codeTab, setCodeTab] = useState<'node' | 'php' | 'python' | 'curl'>('node');

  // Test Payment Session Generator State
  const [testMode, setTestMode] = useState<'ONE_TIME' | 'AUTOPAY'>('ONE_TIME');
  const [testFrequency, setTestFrequency] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('monthly');
  const [testAmount, setTestAmount] = useState(499);
  const [testOrderId, setTestOrderId] = useState(`ORD_${Math.floor(100000 + Math.random() * 900000)}`);
  const [testCustomerName, setTestCustomerName] = useState('Harsh Customer');
  const [testCustomerEmail, setTestCustomerEmail] = useState('customer@example.com');
  const [testPurpose, setTestPurpose] = useState('SaaS Premium Subscription');
  const [createdPaymentUrl, setCreatedPaymentUrl] = useState<string | null>(null);
  const [isGeneratingSession, setIsGeneratingSession] = useState(false);
  const [gatewayTransactionsList, setGatewayTransactionsList] = useState<any[]>([]);
  const [isLoadingGatewayTxs, setIsLoadingGatewayTxs] = useState(false);

  const fetchGatewayTransactions = async () => {
    try {
      setIsLoadingGatewayTxs(true);
      const baseUrl = (import.meta as any).env?.VITE_BACKEND_URL || 
        (typeof window !== 'undefined' && window.location.hostname === 'localhost' 
          ? 'http://localhost:5000' 
          : 'https://wandervibe-email-service.onrender.com');
      const res = await fetch(`${baseUrl}/api/gateway/transactions`);
      const data = await res.json();
      if (data.success && Array.isArray(data.transactions)) {
        setGatewayTransactionsList(data.transactions);
      }
    } catch (e) {
      console.warn("Could not fetch gateway txs:", e);
    } finally {
      setIsLoadingGatewayTxs(false);
    }
  };

  const handleCreateTestGatewaySession = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGeneratingSession(true);
    setCreatedPaymentUrl(null);

    try {
      const baseUrl = (import.meta as any).env?.VITE_BACKEND_URL || 
        (typeof window !== 'undefined' && window.location.hostname === 'localhost' 
          ? 'http://localhost:5000' 
          : 'https://wandervibe-email-service.onrender.com');

      const response = await fetch(`${baseUrl}/api/gateway/create-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-gateway-key': gatewayApiKey
        },
        body: JSON.stringify({
          order_id: testOrderId,
          amount: testAmount,
          customer_name: testCustomerName,
          customer_email: testCustomerEmail,
          purpose: testPurpose,
          mode: testMode,
          recurring_frequency: testFrequency,
          success_url: window.location.origin,
          cancel_url: window.location.origin
        })
      });

      const data = await response.json();
      if (response.ok && data.success && data.payment_url) {
        setCreatedPaymentUrl(data.payment_url);
        fetchGatewayTransactions();
      } else {
        alert("Gateway Error: " + (data.error || 'Failed to create session'));
      }
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setIsGeneratingSession(false);
    }
  };

  const handleResendEmail = async (booking: Booking) => {
    setResendingBookingId(booking.id);
    const targetEmail = booking.primaryTraveler?.email || currentUser?.email || 'mynameisharshji@gmail.com';
    const targetName = booking.primaryTraveler?.fullName || currentUser?.name || 'Traveler';

    try {
      const emailApiUrl = (import.meta as any).env?.VITE_EMAIL_API_URL || 
        (typeof window !== 'undefined' && window.location.hostname === 'localhost' 
          ? 'http://localhost:5000/api/send-booking-email' 
          : 'https://wandervibe-email-service.onrender.com/api/send-booking-email');
      
      const response = await fetch(emailApiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId: booking.id,
          customerName: targetName,
          customerEmail: targetEmail,
          customerPhone: booking.primaryTraveler?.phone || '+91 63880 50042',
          tripTitle: booking.tripTitle || 'WanderVibe Social Group Trip',
          seatNumbers: booking.seatNumbers || [1],
          pickupPoint: booking.pickupPoint || 'Gorakhpur Railway Station Gate 1',
          totalAmountPaid: booking.totalAmountPaid || 0,
          remainingBalanceDue: booking.remainingBalanceDue || 0,
          paymentMode: booking.paymentMode || '100% Full Payment',
          paymentId: booking.paymentId || 'rzp_paid',
          isManualResend: true
        })
      });
      const res = await response.json();
      if (res.success) {
        alert(`✅ Booking Voucher Email resent to ${targetEmail}!`);
      } else {
        alert(`Notice: ${res.error || 'Check server status'}`);
      }
    } catch (e: any) {
      alert(`Email Notice: ${e?.message || 'Could not connect to SMTP server'}`);
    } finally {
      setResendingBookingId(null);
    }
  };

  // Announcement Form State
  const [announcementTripId, setAnnouncementTripId] = useState(trips[0]?.id || '');
  const [announcementTitle, setAnnouncementTitle] = useState('');
  const [announcementMsg, setAnnouncementMsg] = useState('');
  const [announcementUrgent, setAnnouncementUrgent] = useState(false);

  // New Custom Trip Form State
  const [newTitle, setNewTitle] = useState('');
  const [newTagline, setNewTagline] = useState('');
  const [newDestination, setNewDestination] = useState('');
  const [newStartingLocation, setNewStartingLocation] = useState<'Gorakhpur' | 'Lucknow' | 'Delhi'>('Gorakhpur');
  const [newStartDate, setNewStartDate] = useState('2026-10-01');
  const [newEndDate, setNewEndDate] = useState('2026-10-05');
  const [newDurationDays, setNewDurationDays] = useState(5);
  const [newDurationNights, setNewDurationNights] = useState(4);
  const [newPrice, setNewPrice] = useState(8999);
  const [newVehicleType, setNewVehicleType] = useState<'AC Force Traveller (20 Seater)' | 'AC Force Urbania (12 Seater)' | 'AC Luxury Volvo Coach (30 Seater)'>('AC Force Traveller (20 Seater)');
  const [newTotalSeats, setNewTotalSeats] = useState(20);
  const [newCoverImage, setNewCoverImage] = useState('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80');

  // Verify Admin Security Permission
  const isAuthorizedAdmin = currentUser && (
    currentUser.isAdmin ||
    currentUser.email.toLowerCase() === ADMIN_EMAIL.toLowerCase()
  );

  // UNAUTHORIZED LOCK SCREEN
  if (!isAuthorizedAdmin) {
    return (
      <div className="bg-slate-900 border-2 border-rose-500/40 rounded-3xl p-8 sm:p-12 max-w-2xl mx-auto text-center shadow-2xl text-white my-8 space-y-6">
        <div className="w-16 h-16 bg-rose-500/10 border-2 border-rose-500/30 text-rose-400 rounded-3xl mx-auto flex items-center justify-center shadow-lg">
          <Lock className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="bg-rose-500/10 text-rose-400 text-xs uppercase font-bold tracking-widest px-3.5 py-1 rounded-full border border-rose-500/20">
            Security Access Locked
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-white mt-1">
            Agency Admin Panel Restricted
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-md mx-auto">
            The Agency Management Panel is strictly restricted to the authorized agency owner account (<strong className="text-amber-400">{ADMIN_EMAIL}</strong>).
          </p>
        </div>

        {currentUser ? (
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs space-y-1">
            <p className="text-slate-400">Currently Logged In As:</p>
            <p className="font-bold text-white text-sm">{currentUser.name} ({currentUser.email})</p>
            <p className="text-rose-400 text-[11px] font-semibold">❌ Not authorized for Agency Control Panel</p>
          </div>
        ) : (
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs text-slate-400">
            No account logged in. Please sign in as the agency admin (<strong className="text-white">{ADMIN_EMAIL}</strong>).
          </div>
        )}

        <div className="pt-2">
          <button
            onClick={onOpenAuthModal}
            className="bg-gradient-to-r from-amber-500 to-emerald-500 hover:from-amber-400 hover:to-emerald-400 text-slate-950 font-bold px-6 py-3.5 rounded-2xl text-xs shadow-xl shadow-amber-500/20 transition-all hover:scale-105 inline-flex items-center space-x-2"
          >
            <KeyRound className="w-4 h-4" />
            <span>Sign In as Admin ({ADMIN_EMAIL})</span>
          </button>
        </div>
      </div>
    );
  }

  // Stats
  const totalRevenue = bookings.reduce((acc, b) => acc + b.totalAmountPaid, 0);
  const totalTravelersCount = bookings.reduce((acc, b) => acc + b.seatNumbers.length, 0);
  const totalSeatsAcrossTrips = trips.reduce((acc, t) => acc + t.totalSeats, 0);
  const totalBookedSeatsAcrossTrips = trips.reduce((acc, t) => acc + t.seats.filter(s => s.status === 'booked' || s.status === 'blocked').length, 0);
  const occupancyPercentage = totalSeatsAcrossTrips > 0 ? Math.round((totalBookedSeatsAcrossTrips / totalSeatsAcrossTrips) * 100) : 0;

  // Launch Trip from Preset Template
  const handleLaunchPreset = (preset: TripPreset) => {
    const seats: SeatInfo[] = [];
    for (let i = 1; i <= preset.totalSeats; i++) {
      const row = Math.ceil(i / 2);
      const col = (i % 2 === 1) ? 1 : 2;
      seats.push({
        id: `seat-${i}`,
        seatNumber: i,
        row,
        column: col,
        isWindow: i % 2 !== 0 || i === preset.totalSeats,
        isAisle: i % 2 === 0,
        status: 'available'
      });
    }

    const createdTrip: Trip = {
      id: `trip-${preset.id}-${Date.now().toString().slice(-4)}`,
      title: preset.title,
      tagline: preset.tagline,
      destination: preset.destination,
      state: preset.state,
      startingLocation: preset.startingLocation,
      startDate: '2026-10-15',
      endDate: '2026-10-20',
      durationDays: preset.durationDays,
      durationNights: preset.durationNights,
      pricePerPerson: preset.pricePerPerson,
      originalPrice: preset.originalPrice,
      featured: true,
      travelStyle: preset.travelStyle,
      vehicleType: preset.vehicleType,
      vehicleDetails: {
        name: `${preset.vehicleType} Express`,
        isAC: true,
        hasPushbackSeats: true,
        hasChargingPorts: true,
        hasMusicSystem: true,
        sanitized: true,
        registrationState: 'UP-53'
      },
      totalSeats: preset.totalSeats,
      seats,
      accommodationDetails: {
        hotelName: preset.accommodationName,
        roomType: 'Triple / Quad sharing in 3-Star Resort',
        amenities: ['24/7 Hot Water', 'Mountain View Balcony', 'High-Speed Wi-Fi', 'Campfire Lawn'],
        images: [preset.coverImage]
      },
      foodDetails: {
        summary: 'Daily Buffet Breakfast & Dinner',
        mealPlan: 'MAP Plan',
        vegNonVegAvailable: true
      },
      itinerary: [
        {
          dayNumber: 1,
          title: `Boarding from ${preset.startingLocation} Hub & Overnight Scenic Drive`,
          location: `${preset.startingLocation} Hub`,
          description: `Meet fellow travelers at ${preset.startingLocation} departure terminal. Icebreaker briefing by Trip Captain, luggage loading, and departure in AC Traveller.`,
          highlights: ['Group Meet & Greet', 'Comfortable AC Pushback Drive'],
          mealsIncluded: ['Dinner']
        },
        {
          dayNumber: 2,
          title: `Arrival at ${preset.destination} & Check-in`,
          location: preset.destination,
          description: `Check into ${preset.accommodationName}, refresh, and head out for afternoon sightseeing.`,
          highlights: preset.highlights.slice(0, 3),
          mealsIncluded: ['Breakfast', 'Dinner']
        }
      ],
      inclusions: [
        `Round-trip transport from ${preset.startingLocation} Hub`,
        'State road taxes, tolls, parking, fuel & driver allowance',
        `Accommodation at ${preset.accommodationName}`,
        'Daily breakfasts and dinners',
        'Certified Agency Trip Captain'
      ],
      exclusions: ['Personal expenses & adventure activity fees'],
      activities: preset.highlights,
      pickupPoints: [
        {
          location: `${preset.startingLocation} Main Station Gate`,
          reportingTime: '05:30 PM (Day 1)',
          googleMapsLandmark: `${preset.startingLocation} Central Terminal`
        }
      ],
      dropPoints: [{ location: `${preset.startingLocation} Hub`, approxTime: '10:00 AM' }],
      coverImage: preset.coverImage,
      galleryImages: [preset.coverImage],
      tripCaptain: {
        name: 'Vikram "Vicky" Negi',
        phone: '+91 94180 55432',
        bio: 'Mountaineering graduate from NIM with 7+ years leading group trips.',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
        experienceYears: 7,
        rating: 4.95
      },
      cancellationPolicy: 'Full refund up to 7 days before departure.',
      tripRules: ['Strict zero-tolerance policy against misconduct.', 'Punctuality is mandatory.'],
      status: 'published',
      createdAt: new Date().toISOString().split('T')[0]
    };

    onCreateTrip(createdTrip);
    setIsPresetLibraryOpen(false);
  };

  // Pre-fill Custom Trip Form with Preset details so Admin can Edit & Customize Before Publishing
  const handleEditPresetBeforeLaunch = (preset: TripPreset) => {
    setNewTitle(preset.title);
    setNewTagline(preset.tagline);
    setNewDestination(preset.destination);
    setNewStartingLocation(preset.startingLocation);
    setNewDurationDays(preset.durationDays);
    setNewDurationNights(preset.durationNights);
    setNewPrice(preset.pricePerPerson);
    setNewVehicleType(preset.vehicleType as any || 'AC Force Traveller (20 Seater)');
    setNewTotalSeats(preset.totalSeats);
    setNewCoverImage(preset.coverImage);
    setIsPresetLibraryOpen(false);
    setIsCreatingTrip(true);
  };

  const [isGeminiGenerating, setIsGeminiGenerating] = useState(false);

  const handleGeminiAutoGenerateTrip = () => {
    setIsGeminiGenerating(true);
    setTimeout(() => {
      const geminiIdeas = [
        {
          title: "SPITI VALLEY SNOW EXPEDITION 2026",
          tagline: "Sub-zero starry nights, ancient Key Monastery & 1:1 social vibe.",
          destination: "Spiti Valley",
          hub: "Gorakhpur" as const,
          price: 8999,
          image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80"
        },
        {
          title: "NEPAL POKHARA & ANNAPURNA PASS",
          tagline: "Fewa Lake boating, Himalayan sunrise, and night market fun.",
          destination: "Pokhara, Nepal",
          hub: "Gorakhpur" as const,
          price: 7999,
          image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80"
        },
        {
          title: "KASOL & KHEERGANGA RIVERSIDE CAMPING",
          tagline: "Parvati Valley cafes, hot springs trek & acoustic bonfire night.",
          destination: "Kasol, Himachal",
          hub: "Lucknow" as const,
          price: 6499,
          image: "https://images.unsplash.com/photo-1597074866923-dc0589150358?auto=format&fit=crop&w=1200&q=80"
        },
        {
          title: "LADAKH PANGONG TSO MOTORBIKE CIRCUIT",
          tagline: "Khardung La pass, blue salt water lake & stargazing domes.",
          destination: "Ladakh",
          hub: "Delhi" as const,
          price: 14999,
          image: "https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=1200&q=80"
        }
      ];

      const picked = geminiIdeas[Math.floor(Math.random() * geminiIdeas.length)];
      setNewTitle(picked.title);
      setNewTagline(picked.tagline);
      setNewDestination(picked.destination);
      setNewStartingLocation(picked.hub);
      setNewPrice(picked.price);
      setNewCoverImage(picked.image);
      setNewDurationDays(5);
      setNewDurationNights(4);
      setNewTotalSeats(20);
      setIsGeminiGenerating(false);
    }, 600);
  };

  const handleBlockUnblockSeat = (trip: Trip, seatNumber: number) => {
    const updatedSeats = trip.seats.map(s => {
      if (s.seatNumber === seatNumber) {
        if (s.status === 'available') {
          return { ...s, status: 'blocked' as const };
        } else if (s.status === 'blocked') {
          return { ...s, status: 'available' as const };
        }
      }
      return s;
    });

    onUpdateTrip({
      ...trip,
      seats: updatedSeats
    });
  };

  const handleCreateTripSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newDestination) return;

    const seats: SeatInfo[] = [];
    for (let i = 1; i <= newTotalSeats; i++) {
      const row = Math.ceil(i / 2);
      const col = (i % 2 === 1) ? 1 : 2;
      seats.push({
        id: `seat-${i}`,
        seatNumber: i,
        row,
        column: col,
        isWindow: i % 2 !== 0 || i === newTotalSeats,
        isAisle: i % 2 === 0,
        status: 'available'
      });
    }

    const createdTrip: Trip = {
      id: `trip-${Date.now().toString().slice(-6)}`,
      title: newTitle,
      tagline: newTagline || 'Experience curated group travel.',
      destination: newDestination,
      state: newDestination.split(',')[1]?.trim() || 'India',
      startingLocation: newStartingLocation,
      startDate: newStartDate,
      endDate: newEndDate,
      durationDays: newDurationDays,
      durationNights: newDurationNights,
      pricePerPerson: newPrice,
      originalPrice: Math.round(newPrice * 1.25),
      featured: true,
      travelStyle: ['Himalayan Escape', 'Adventure & Trekking'],
      vehicleType: newVehicleType,
      vehicleDetails: {
        name: `${newVehicleType} Express Coach`,
        isAC: true,
        hasPushbackSeats: true,
        hasChargingPorts: true,
        hasMusicSystem: true,
        sanitized: true,
        registrationState: 'UP-53'
      },
      totalSeats: newTotalSeats,
      seats,
      accommodationDetails: {
        hotelName: 'Riverside Alpine Resort',
        roomType: 'Triple / Quad sharing',
        amenities: ['Geyser Hot Water', 'Mountain Balcony', 'Wi-Fi', 'Campfire'],
        images: [newCoverImage]
      },
      foodDetails: {
        summary: 'Daily Buffet Breakfast & Dinner',
        mealPlan: 'MAP Plan',
        vegNonVegAvailable: true
      },
      itinerary: [
        {
          dayNumber: 1,
          title: `Boarding from ${newStartingLocation} Hub & Scenic Drive`,
          location: `${newStartingLocation} -> Departure Terminal`,
          description: 'Meet fellow travelers, luggage loading, and departure in AC Traveller with custom road-trip music.',
          highlights: ['Group Meet & Greet', 'Comfortable AC Transit'],
          mealsIncluded: ['Dinner']
        }
      ],
      inclusions: [
        `Round-trip transport from ${newStartingLocation} in AC vehicle`,
        'State permits, tolls, parking, fuel & driver charges',
        'Accommodation in 3-star stay / camps',
        'Daily breakfasts and dinners',
        'Certified Agency Trip Captain'
      ],
      exclusions: ['Personal shopping & sports activity fees'],
      activities: ['Local Sightseeing', 'Group Bonfire', 'Nature Walk'],
      pickupPoints: [
        {
          location: `${newStartingLocation} Main Station Gate`,
          reportingTime: '06:00 PM (Day 1)',
          googleMapsLandmark: 'Main Station Parking'
        }
      ],
      dropPoints: [{ location: `${newStartingLocation} Main Terminal`, approxTime: '10:00 AM' }],
      coverImage: newCoverImage,
      galleryImages: [newCoverImage],
      tripCaptain: {
        name: 'Vikram "Vicky" Negi',
        phone: '+91 94180 55432',
        bio: 'Senior Travel Captain with 7+ years experience leading group expeditions.',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
        experienceYears: 7,
        rating: 4.9
      },
      cancellationPolicy: 'Full refund up to 7 days before departure.',
      tripRules: ['Zero-tolerance policy against misconduct.', 'Punctuality is mandatory.'],
      status: 'published',
      createdAt: new Date().toISOString().split('T')[0]
    };

    onCreateTrip(createdTrip);
    setIsCreatingTrip(false);
    setNewTitle('');
    setNewDestination('');
  };

  const handlePostAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!announcementTitle || !announcementMsg) return;

    const targetTrip = trips.find(t => t.id === announcementTripId);

    const announcement: TripAnnouncement = {
      id: `anc-${Date.now().toString().slice(-6)}`,
      tripId: announcementTripId,
      tripTitle: targetTrip?.title || 'Trip Update',
      title: announcementTitle,
      message: announcementMsg,
      date: new Date().toISOString().split('T')[0],
      urgent: announcementUrgent,
      sentBy: 'Agency Admin Desk'
    };

    onSendAnnouncement(announcement);
    setAnnouncementTitle('');
    setAnnouncementMsg('');
    setAnnouncementUrgent(false);
    alert('Announcement sent to all booked travelers on this trip!');
  };

  const selectedSeatMgmtTrip = trips.find(t => t.id === selectedSeatMgmtTripId) || trips[0];
  const selectedRosterTrip = trips.find(t => t.id === selectedRosterTripId) || trips[0];
  const tripBookings = bookings.filter(b => b.tripId === selectedRosterTripId);

  // Filter Presets Library
  const filteredPresets = DESTINATION_PRESETS.filter(p => {
    const matchesRegion = selectedRegionFilter === 'All' || p.region === selectedRegionFilter;
    const matchesHub = selectedHubFilter === 'All' || p.startingLocation === selectedHubFilter;
    return matchesRegion && matchesHub;
  });

  return (
    <div className="space-y-8 pb-16 text-white">
      
      {/* Admin Header & Stats */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 bg-amber-400/10 text-amber-300 border border-amber-400/20 px-3.5 py-1 rounded-full text-xs font-bold mb-2">
              <Lock className="w-3.5 h-3.5" />
              <span>Owner Panel: {ADMIN_EMAIL}</span>
            </div>
            <h1 className="text-3xl font-bold font-display text-white">
              Travel Agency Management Panel
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsPresetLibraryOpen(true)}
              className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 font-bold px-5 py-3 rounded-2xl text-xs flex items-center space-x-2 shadow-lg shadow-cyan-500/20 transition-all hover:scale-105"
            >
              <Sparkles className="w-4 h-4" />
              <span>✨ 1-Click Launch (40+ Presets)</span>
            </button>

            <button
              onClick={() => setIsCreatingTrip(true)}
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-5 py-3 rounded-2xl text-xs flex items-center space-x-2 shadow-lg shadow-emerald-500/20 transition-all hover:scale-105"
            >
              <Plus className="w-4 h-4" />
              <span>Create Custom Trip</span>
            </button>
          </div>
        </div>

        {/* Top Key Metrics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
            <span className="text-[11px] text-slate-400 uppercase font-bold tracking-wider flex items-center space-x-1">
              <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
              <span>Total Revenue</span>
            </span>
            <p className="text-2xl font-black font-display text-emerald-400">
              ₹{totalRevenue.toLocaleString('en-IN')}
            </p>
            <p className="text-[10px] text-slate-500">{bookings.length} Confirmed Bookings</p>
          </div>

          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
            <span className="text-[11px] text-slate-400 uppercase font-bold tracking-wider flex items-center space-x-1">
              <Users className="w-3.5 h-3.5 text-cyan-400" />
              <span>Booked Passengers</span>
            </span>
            <p className="text-2xl font-black font-display text-cyan-400">
              {totalTravelersCount} Travelers
            </p>
            <p className="text-[10px] text-slate-500">Across {trips.length} Active Trips</p>
          </div>

          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
            <span className="text-[11px] text-slate-400 uppercase font-bold tracking-wider flex items-center space-x-1">
              <Bus className="w-3.5 h-3.5 text-amber-400" />
              <span>Average Occupancy</span>
            </span>
            <p className="text-2xl font-black font-display text-amber-400">
              {occupancyPercentage}%
            </p>
            <p className="text-[10px] text-slate-500">{totalBookedSeatsAcrossTrips} / {totalSeatsAcrossTrips} Total Vehicle Seats</p>
          </div>

          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
            <span className="text-[11px] text-slate-400 uppercase font-bold tracking-wider flex items-center space-x-1">
              <Sparkles className="w-3.5 h-3.5 text-teal-400" />
              <span>Active Trips</span>
            </span>
            <p className="text-2xl font-black font-display text-teal-400">
              {trips.length} Destinations
            </p>
            <p className="text-[10px] text-slate-500">Gorakhpur, LKO & DEL Hubs</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 border-t border-slate-800 pt-4">
          <button
            onClick={() => setActiveTab('trips')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'trips'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-md'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            🗺 Manage Trips ({trips.length})
          </button>

          <button
            onClick={() => setActiveTab('seat_mgmt')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'seat_mgmt'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-md'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            💺 Block/Configure Vehicle Seats
          </button>

          <button
            onClick={() => setActiveTab('roster')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
              activeTab === 'roster'
                ? 'bg-amber-400 text-slate-950 font-bold shadow-md shadow-amber-400/20'
                : 'bg-amber-950/40 text-amber-300 hover:bg-amber-900/50 border border-amber-500/30'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>📋 Bookings List ({bookings.filter(b => b.status !== 'CANCELLED').length})</span>
          </button>

          <button
            onClick={() => setActiveTab('cancelled_tickets')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
              activeTab === 'cancelled_tickets'
                ? 'bg-rose-500 text-white font-bold shadow-md shadow-rose-500/20'
                : 'bg-rose-950/40 text-rose-300 hover:bg-rose-900/50 border border-rose-500/30'
            }`}
          >
            <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
            <span>🚨 Cancelled Tickets & Refunds ({bookings.filter(b => b.status === 'CANCELLED').length})</span>
          </button>

          <button
            onClick={() => setActiveTab('announcements')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'announcements'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-md'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            📢 Send Announcements ({announcements.length})
          </button>

          <button
            onClick={() => setActiveTab('gemini_ai')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
              activeTab === 'gemini_ai'
                ? 'bg-purple-600 text-white font-bold shadow-md shadow-purple-500/20'
                : 'bg-purple-950/40 text-purple-300 hover:bg-purple-900/50 border border-purple-500/30'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-spin-slow" />
            <span>🤖 Gemini AI Copilot</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('gateway_api');
              fetchGatewayTransactions();
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
              activeTab === 'gateway_api'
                ? 'bg-cyan-400 text-slate-950 font-bold shadow-md shadow-cyan-400/25'
                : 'bg-cyan-950/40 text-cyan-300 hover:bg-cyan-900/50 border border-cyan-500/30'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>⚡ Universal Payment Switch & API</span>
          </button>
        </div>

      </div>

      {/* 40+ PRESET DESTINATION TEMPLATES LIBRARY MODAL */}
      {isPresetLibraryOpen && (
        <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center bg-slate-950/85 backdrop-blur-md p-3 sm:p-6 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-5xl w-full p-4 sm:p-8 shadow-2xl relative text-white my-auto max-h-[90vh] flex flex-col">
            
            <button
              onClick={() => setIsPresetLibraryOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white p-2 rounded-full hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-6">
              <div className="inline-flex items-center space-x-2 bg-emerald-500/10 text-emerald-400 text-xs font-bold px-3 py-1 rounded-full border border-emerald-500/20 mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>40+ Pre-Configured Social Trip Presets</span>
              </div>
              <h3 className="text-2xl font-bold font-display text-white">
                Destination Template Library
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Select any curated trip template starting from <strong>Gorakhpur (GKP)</strong>, <strong>Lucknow (LKO)</strong>, <strong>Delhi (DEL)</strong>, or <strong>Nepal International</strong> to publish live in 1 click!
              </p>
            </div>

            {/* Filter Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-950 p-3 rounded-2xl border border-slate-800 mb-4">
              <div className="flex flex-wrap gap-1.5">
                {['All', 'Himachal', 'Nepal International', 'Uttarakhand', 'Kashmir & Ladakh', 'Rajasthan & Desert', 'Northeast & East', 'South India & Beaches'].map((region) => (
                  <button
                    key={region}
                    onClick={() => setSelectedRegionFilter(region)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                      selectedRegionFilter === region
                        ? 'bg-emerald-500 text-slate-950 shadow-md'
                        : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    {region}
                  </button>
                ))}
              </div>

              <div className="flex items-center space-x-2 text-xs">
                <span className="text-slate-400 font-bold">Starting Hub:</span>
                <select
                  value={selectedHubFilter}
                  onChange={(e) => setSelectedHubFilter(e.target.value)}
                  className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-1 text-xs text-white focus:outline-none"
                >
                  <option value="All">All Hubs (GKP / LKO / DEL)</option>
                  <option value="Gorakhpur">Gorakhpur Hub</option>
                  <option value="Lucknow">Lucknow Hub</option>
                  <option value="Delhi">Delhi Hub</option>
                </select>
              </div>
            </div>

            {/* Presets Grid */}
            <div className="overflow-y-auto flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pr-1">
              {filteredPresets.map((preset) => (
                <div key={preset.id} className="bg-slate-950 border border-slate-800 hover:border-emerald-500/50 rounded-2xl overflow-hidden flex flex-col justify-between group transition-all">
                  <div className="relative h-40">
                    <img
                      src={preset.coverImage}
                      alt={preset.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
                    <div className="absolute top-2 left-2 flex items-center space-x-1.5">
                      <span className="bg-slate-900/90 text-emerald-400 font-bold text-[10px] px-2.5 py-0.5 rounded-full border border-slate-700">
                        📍 {preset.startingLocation} Hub
                      </span>
                      <span className="bg-slate-900/90 text-slate-300 font-bold text-[10px] px-2.5 py-0.5 rounded-full border border-slate-700">
                        {preset.region}
                      </span>
                    </div>
                    <div className="absolute bottom-2 left-2 right-2">
                      <h4 className="text-sm font-bold font-display text-white line-clamp-1">{preset.title}</h4>
                    </div>
                  </div>

                  <div className="p-3.5 space-y-3 flex-1 flex flex-col justify-between text-xs">
                    <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">{preset.tagline}</p>

                    <div className="space-y-1 bg-slate-900 p-2 rounded-xl border border-slate-800/80 text-[11px]">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Duration & Vehicle:</span>
                        <span className="font-bold text-white">{preset.durationDays}D/{preset.durationNights}N • {preset.totalSeats} Seats</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Suggested Price:</span>
                        <span className="font-bold text-emerald-400">₹{preset.pricePerPerson.toLocaleString('en-IN')}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <button
                        onClick={() => handleLaunchPreset(preset)}
                        className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-2 rounded-xl text-xs flex items-center justify-center space-x-1 shadow-md transition-transform active:scale-95"
                      >
                        <Rocket className="w-3.5 h-3.5" />
                        <span>🚀 1-Click Launch</span>
                      </button>

                      <button
                        onClick={() => handleEditPresetBeforeLaunch(preset)}
                        className="w-full bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 font-bold py-2 rounded-xl text-xs flex items-center justify-center space-x-1 transition-colors"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>✏️ Edit & Launch</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      )}

      {/* CREATE CUSTOM TRIP MODAL */}
      {isCreatingTrip && (
        <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center bg-slate-950/85 backdrop-blur-md p-3 sm:p-6 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full p-5 sm:p-8 shadow-2xl relative text-white my-auto max-h-[90vh] overflow-y-auto space-y-6">
            
            {/* Sticky Header with Close Button */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 sticky top-0 bg-slate-900 z-10">
              <div>
                <span className="text-xs uppercase font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                  Custom Expedition Form
                </span>
                <h3 className="text-xl sm:text-2xl font-bold font-display text-white mt-1">
                  Create Custom Agency Trip
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsCreatingTrip(false)}
                className="text-slate-400 hover:text-white p-2 rounded-full hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Gemini AI 1-Click Auto-Fill Bar */}
            <div className="bg-purple-950/40 border border-purple-500/30 p-3 rounded-2xl flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center space-x-2 text-xs text-purple-300">
                <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
                <span className="font-semibold">Auto-fill title, tagline, price & cover photo using Gemini AI</span>
              </div>
              <button
                type="button"
                onClick={handleGeminiAutoGenerateTrip}
                disabled={isGeminiGenerating}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold px-3.5 py-1.5 rounded-xl text-xs flex items-center space-x-1.5 shadow-md shadow-purple-500/20"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isGeminiGenerating ? 'Gemini AI Generating...' : '✨ Auto-Fill with Gemini AI'}</span>
              </button>
            </div>
            
            <form onSubmit={handleCreateTripSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Trip Title *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. SPITI VALLEY SNOW EXPEDITION"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-sm focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Tagline</label>
                <input
                  type="text"
                  value={newTagline}
                  onChange={(e) => setNewTagline(e.target.value)}
                  placeholder="e.g. High mountain passes, monasteries, and stargazing."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-sm focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Destination *</label>
                  <input
                    type="text"
                    required
                    value={newDestination}
                    onChange={(e) => setNewDestination(e.target.value)}
                    placeholder="e.g. Kaza, Himachal Pradesh"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-sm focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Starting Hub *</label>
                  <select
                    value={newStartingLocation}
                    onChange={(e: any) => setNewStartingLocation(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs focus:outline-none text-white font-bold"
                  >
                    <option value="Gorakhpur">📍 Gorakhpur Hub (GKP)</option>
                    <option value="Lucknow">📍 Lucknow Hub (LKO)</option>
                    <option value="Delhi">📍 Delhi Hub (DEL)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={newStartDate}
                    onChange={(e) => setNewStartDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">End Date</label>
                  <input
                    type="date"
                    value={newEndDate}
                    onChange={(e) => setNewEndDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Price / Person (₹)</label>
                  <input
                    type="number"
                    value={newPrice}
                    onChange={(e) => setNewPrice(parseInt(e.target.value) || 5000)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Total Seats</label>
                  <input
                    type="number"
                    value={newTotalSeats}
                    onChange={(e) => setNewTotalSeats(parseInt(e.target.value) || 20)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Vehicle Type</label>
                  <select
                    value={newVehicleType}
                    onChange={(e: any) => setNewVehicleType(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2 py-2 text-xs focus:outline-none"
                  >
                    <option value="AC Force Traveller (20 Seater)">20-Seater Traveller</option>
                    <option value="AC Force Urbania (12 Seater)">12-Seater Urbania</option>
                    <option value="AC Luxury Volvo Coach (30 Seater)">30-Seater Volvo</option>
                  </select>
                </div>
              </div>

              <div>
                <ImageUploader
                  label="Trip Destination Cover Photo"
                  value={newCoverImage}
                  onChange={(url) => setNewCoverImage(url)}
                  helperText="Upload image file from device (Cloudinary API / DataURL) or pick HD preset."
                />
              </div>

              <div className="flex justify-end space-x-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsCreatingTrip(false)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold px-4 py-2 rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-6 py-2 rounded-xl text-xs"
                >
                  Publish Trip
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TAB 1: MANAGE TRIPS LIST */}
      {activeTab === 'trips' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {trips.map((trip) => {
              const bookedCount = trip.seats.filter(s => s.status === 'booked' || s.status === 'blocked').length;
              const availableSeats = trip.totalSeats - bookedCount;

              return (
                <div key={trip.id} className="bg-slate-900 border border-slate-800 p-5 rounded-3xl space-y-4 shadow-xl">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                        {trip.startingLocation} Hub → {trip.destination.split(',')[0]}
                      </span>
                      <h4 className="text-base font-bold text-white mt-1">{trip.title}</h4>
                      <p className="text-xs text-slate-400">📅 {trip.startDate} to {trip.endDate}</p>
                    </div>

                    <button
                      onClick={() => onDeleteTrip(trip.id)}
                      className="text-slate-500 hover:text-rose-400 p-2 rounded-xl hover:bg-slate-800 transition-colors"
                      title="Delete trip"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center text-xs bg-slate-950 p-3 rounded-2xl border border-slate-800">
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase font-bold block">Capacity</span>
                      <span className="font-bold text-white">{trip.totalSeats} Seats</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase font-bold block">Booked</span>
                      <span className="font-bold text-amber-400">{bookedCount}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase font-bold block">Available</span>
                      <span className="font-bold text-emerald-400">{availableSeats}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="font-bold text-white">₹{trip.pricePerPerson.toLocaleString('en-IN')} / person</span>
                    <button
                      onClick={() => {
                        setSelectedSeatMgmtTripId(trip.id);
                        setActiveTab('seat_mgmt');
                      }}
                      className="bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700 px-3 py-1.5 rounded-xl font-bold transition-colors"
                    >
                      Manage Seats & Layout →
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: SEAT BLOCK / CONFIGURATION */}
      {activeTab === 'seat_mgmt' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-white">Manual Seat Inventory & Block Controls</h3>
              <p className="text-xs text-slate-400">Click any seat to manually block it for offline agency bookings or unblock it.</p>
            </div>

            <select
              value={selectedSeatMgmtTripId}
              onChange={(e) => setSelectedSeatMgmtTripId(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-xs font-bold text-white focus:outline-none"
            >
              {trips.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.title} ({t.totalSeats} Seats)
                </option>
              ))}
            </select>
          </div>

          {selectedSeatMgmtTrip && (
            <div className="space-y-6">
              <SeatMap
                totalSeats={selectedSeatMgmtTrip.totalSeats}
                seats={selectedSeatMgmtTrip.seats}
                selectedSeatNumbers={[]}
                onToggleSeat={(seatNum) => handleBlockUnblockSeat(selectedSeatMgmtTrip, seatNum)}
              />

              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs text-slate-400 flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>
                  Admin Seat Control Mode: Clicking an available seat toggles its state between <strong>Available</strong> and <strong>Blocked (Agency Reserved)</strong>.
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: PASSENGER ROSTER */}
      {activeTab === 'roster' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-white">Booked Passenger Manifest</h3>
              <p className="text-xs text-slate-400">View traveler roster, emergency contact numbers, and dietary preferences.</p>
            </div>

            <select
              value={selectedRosterTripId}
              onChange={(e) => setSelectedRosterTripId(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-xs font-bold text-white focus:outline-none"
            >
              {trips.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.title} ({bookings.filter(b => b.tripId === t.id).length} Bookings)
                </option>
              ))}
            </select>
          </div>

          {tripBookings.length === 0 ? (
            <div className="bg-slate-950 p-8 rounded-2xl text-center text-xs text-slate-500">
              No confirmed bookings registered for this trip yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-bold tracking-wider">
                  <tr>
                    <th className="p-3">Booking ID</th>
                    <th className="p-3">Seats</th>
                    <th className="p-3">Traveler Name</th>
                    <th className="p-3">Phone & Email</th>
                    <th className="p-3">Paid / Hub Due</th>
                    <th className="p-3">Email Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {tripBookings.map((b) => {
                    const cleanPhone = (b.primaryTraveler.phone || '').replace(/\D/g, '');
                    const waPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;

                    return (
                      <tr key={b.id} className="hover:bg-slate-800/40">
                        <td className="p-3 font-mono font-bold text-emerald-400">
                          {b.id}
                          {b.status === 'CANCELLED' && (
                            <span className="block text-[9px] text-rose-400 uppercase font-bold">CANCELLED</span>
                          )}
                        </td>
                        <td className="p-3 font-bold text-white">#{b.seatNumbers.join(', #')}</td>
                        <td className="p-3 font-bold text-white">
                          {b.primaryTraveler.fullName} ({b.primaryTraveler.gender}, {b.primaryTraveler.age})
                        </td>
                        <td className="p-3 space-y-0.5">
                          {b.primaryTraveler.phone ? (
                            <a href={`tel:${b.primaryTraveler.phone}`} className="font-bold text-cyan-400 hover:underline flex items-center space-x-1">
                              <span>📞 {b.primaryTraveler.phone}</span>
                            </a>
                          ) : (
                            <span className="text-[10px] text-slate-500 italic block">No Mobile</span>
                          )}
                          <a href={`mailto:${b.primaryTraveler.email}`} className="text-[11px] text-slate-300 hover:text-emerald-400 block truncate max-w-[180px]" title={b.primaryTraveler.email}>
                            ✉️ {b.primaryTraveler.email}
                          </a>
                          <span className="text-[10px] text-slate-500 block">📍 {b.primaryTraveler.city}</span>
                        </td>
                        <td className="p-3">
                          <div className="font-bold text-emerald-400">Paid: ₹{b.totalAmountPaid.toLocaleString('en-IN')}</div>
                          {b.remainingBalanceDue && b.remainingBalanceDue > 0 ? (
                            <span className="inline-block bg-amber-500/10 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded text-[10px] font-bold mt-0.5">
                              ⚠️ Hub Due: ₹{b.remainingBalanceDue.toLocaleString('en-IN')}
                            </span>
                          ) : (
                            <span className="inline-block bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded text-[10px] font-bold mt-0.5">
                              ✓ 100% Paid
                            </span>
                          )}
                        </td>
                        <td className="p-3">
                          <div className="space-y-1">
                            <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded text-[10px] font-bold flex items-center space-x-1 w-fit">
                              <span>📧 Email Sent ✓</span>
                            </span>
                            <button
                              type="button"
                              onClick={() => handleResendEmail(b)}
                              disabled={resendingBookingId === b.id}
                              className="text-[10px] text-slate-400 hover:text-white underline font-semibold flex items-center space-x-1"
                            >
                              <span>{resendingBookingId === b.id ? 'Sending...' : '🔄 Resend Mail'}</span>
                            </button>
                          </div>
                        </td>
                        <td className="p-3 text-right">
                          {b.status === 'CANCELLED' ? (
                            <span className="bg-rose-500/20 text-rose-300 border border-rose-500/30 px-2 py-1 rounded-xl text-[10px] font-bold">
                              CANCELLED
                            </span>
                          ) : (
                            <div className="flex items-center justify-end space-x-2">
                              {waPhone && (
                                <a
                                  href={`https://wa.me/${waPhone}?text=${encodeURIComponent(
                                    `Hi ${b.primaryTraveler.fullName}! Your WanderVibe trip pass (ID: ${b.id}) for ${b.tripTitle} is CONFIRMED. Reserved Seats: #${b.seatNumbers.join(', #')}. Pickup: ${b.pickupPoint}. Paid: ₹${b.totalAmountPaid}. Due at Hub: ₹${b.remainingBalanceDue || 0}. Lead Owner Helpline: +91 63880 50042.`
                                  )}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 px-2.5 py-1.5 rounded-xl font-bold text-[11px] transition-all"
                                >
                                  📲 WhatsApp
                                </a>
                              )}
                              <button
                                type="button"
                                onClick={() => setCancellingBooking(b)}
                                className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 hover:border-rose-500/50 px-2.5 py-1.5 rounded-xl font-bold text-[11px] transition-all flex items-center space-x-1"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Cancel</span>
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: SEND ANNOUNCEMENTS */}
      {activeTab === 'announcements' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <form onSubmit={handlePostAnnouncement} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <Megaphone className="w-4 h-4 text-emerald-400" />
              <span>Broadcast Trip Announcement</span>
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Target Trip</label>
              <select
                value={announcementTripId}
                onChange={(e) => setAnnouncementTripId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
              >
                {trips.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Announcement Title</label>
              <input
                type="text"
                required
                value={announcementTitle}
                onChange={(e) => setAnnouncementTitle(e.target.value)}
                placeholder="e.g. Pickup Location Reporting Time Shifted by 15 Mins"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Message Details</label>
              <textarea
                required
                rows={3}
                value={announcementMsg}
                onChange={(e) => setAnnouncementMsg(e.target.value)}
                placeholder="Dear travelers, please reach the Gorakhpur Station VIP parking by 05:30 PM..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white focus:outline-none"
              />
            </div>

            <div className="flex items-center space-x-2 pt-1">
              <input
                type="checkbox"
                id="urgent"
                checked={announcementUrgent}
                onChange={(e) => setAnnouncementUrgent(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-500 bg-slate-950 border-slate-700"
              />
              <label htmlFor="urgent" className="text-xs text-amber-300 font-semibold cursor-pointer">
                Mark as Urgent Safety Alert (SMS Highlight)
              </label>
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-2.5 px-4 rounded-xl text-xs shadow-lg shadow-emerald-500/20 transition-all"
            >
              Send Announcement to Booked Passengers
            </button>
          </form>

          {/* Announcement Logs */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
            <h3 className="text-base font-bold text-white">Recent Trip Announcements</h3>
            <div className="space-y-3">
              {announcements.map((anc) => (
                <div key={anc.id} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">{anc.title}</span>
                    <span className="text-[10px] text-slate-500">{anc.date}</span>
                  </div>
                  <p className="text-slate-400 text-[11px]">{anc.tripTitle}</p>
                  <p className="text-slate-300 leading-relaxed pt-1">{anc.message}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: CANCELLED TICKETS & REFUNDS DESK */}
      {activeTab === 'cancelled_tickets' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-xs uppercase font-bold text-rose-400 bg-rose-500/10 px-2.5 py-0.5 rounded-full border border-rose-500/20">
                Refunds & Cancellation Audit Log
              </span>
              <h3 className="text-xl font-bold font-display text-white mt-1">
                🚨 Cancelled Passenger Bookings ({bookings.filter(b => b.status === 'CANCELLED').length})
              </h3>
              <p className="text-xs text-slate-400">All cancelled tickets, released bus seats, and refund details.</p>
            </div>
          </div>

          {bookings.filter(b => b.status === 'CANCELLED').length === 0 ? (
            <div className="bg-slate-950 p-12 rounded-2xl text-center text-xs text-slate-500 space-y-2">
              <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto" />
              <p className="font-bold text-slate-300">No Cancelled Tickets!</p>
              <p>All passenger bookings are 100% active and confirmed across departures.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-bold tracking-wider">
                  <tr>
                    <th className="p-3">Booking ID</th>
                    <th className="p-3">Trip Name</th>
                    <th className="p-3">Primary Traveler</th>
                    <th className="p-3">Contact Details</th>
                    <th className="p-3">Seats Released</th>
                    <th className="p-3">Paid Amount</th>
                    <th className="p-3">Cancellation Reason</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {bookings.filter(b => b.status === 'CANCELLED').map((b) => (
                    <tr key={b.id} className="hover:bg-slate-800/40">
                      <td className="p-3 font-mono font-bold text-rose-400">{b.id}</td>
                      <td className="p-3 font-bold text-white max-w-[160px] truncate">{b.tripTitle}</td>
                      <td className="p-3 font-bold text-white">
                        {b.primaryTraveler.fullName}
                      </td>
                      <td className="p-3 text-[11px]">
                        <a href={`tel:${b.primaryTraveler.phone}`} className="text-cyan-400 font-bold hover:underline">
                          📞 {b.primaryTraveler.phone}
                        </a>
                        <div className="text-[10px] text-slate-500">{b.primaryTraveler.email}</div>
                      </td>
                      <td className="p-3 font-bold text-emerald-400">
                        #{b.seatNumbers.join(', #')} (Available on Bus Map)
                      </td>
                      <td className="p-3 font-bold text-white">
                        ₹{b.totalAmountPaid.toLocaleString('en-IN')}
                      </td>
                      <td className="p-3 text-slate-300 text-[11px] max-w-[200px]">
                        {b.cancellationReason || 'Cancelled by Admin Desk'}
                      </td>
                      <td className="p-3">
                        <span className="bg-rose-500/20 text-rose-300 border border-rose-500/30 px-2.5 py-1 rounded-xl text-[10px] font-bold inline-block">
                          CANCELLED & SEATS FREED
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 5: GOOGLE GEMINI AI COPILOT & PHOTO GENERATOR */}
      {activeTab === 'gemini_ai' && (
        <AdminGeminiAssistant
          onApplyImageToTrip={(imgUrl) => {
            setNewCoverImage(imgUrl);
            setIsCreatingTrip(true);
          }}
        />
      )}

      {/* TAB 6: UNIVERSAL PAYMENT GATEWAY SWITCH & API DASHBOARD */}
      {activeTab === 'gateway_api' && (
        <div className="space-y-6 text-white">
          
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-cyan-950/80 via-slate-900 to-slate-950 p-6 sm:p-8 rounded-3xl border border-cyan-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="space-y-2 relative z-10">
              <span className="text-[10px] uppercase font-bold tracking-widest text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">
                UNIVERSAL RAZORPAY PROXY SWITCH
              </span>
              <h3 className="text-2xl font-black font-display text-white">
                Universal Hosted Payment Gateway & API
              </h3>
              <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
                Connect <strong>any of your external websites, apps, or client stores</strong> to collect payments via your single Razorpay merchant account. Your external websites call your API, customer pays on your secure hosted checkout, and webhook notifies the external site automatically!
              </p>
            </div>

            <div className="flex items-center space-x-3 relative z-10 flex-shrink-0">
              <button
                onClick={fetchGatewayTransactions}
                disabled={isLoadingGatewayTxs}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-3 rounded-2xl text-xs font-semibold flex items-center space-x-2 border border-slate-700 transition-colors"
              >
                <RefreshCw className={`w-4 h-4 ${isLoadingGatewayTxs ? 'animate-spin' : ''}`} />
                <span>Refresh Live Log</span>
              </button>
            </div>
          </div>

          {/* Secret API Key & Gateway Endpoints Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Merchant API Secret Key Box */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 flex items-center space-x-2">
                  <KeyRound className="w-4 h-4 text-cyan-400" />
                  <span>Gateway Secret API Key</span>
                </span>
                <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2.5 py-0.5 rounded-full border border-emerald-500/20 font-mono">
                  LIVE SECRET
                </span>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">
                Pass this key in the <code className="text-cyan-300 bg-slate-950 px-1.5 py-0.5 rounded">x-gateway-key</code> header when creating payment sessions from your other websites.
              </p>

              <div className="flex items-center space-x-2 bg-slate-950 p-2.5 rounded-2xl border border-slate-800 font-mono text-xs">
                <input
                  type={showApiKey ? 'text' : 'password'}
                  readOnly
                  value={gatewayApiKey}
                  className="flex-1 bg-transparent text-slate-200 outline-none px-2 text-xs"
                />
                <button
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors"
                  title="Show/Hide Key"
                >
                  {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(gatewayApiKey);
                    setIsCopiedKey(true);
                    setTimeout(() => setIsCopiedKey(false), 2000);
                  }}
                  className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-3 py-1.5 rounded-xl text-xs flex items-center space-x-1 transition-all"
                >
                  {isCopiedKey ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{isCopiedKey ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <div className="text-[11px] text-slate-400 flex items-center space-x-2 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                <span>Keep this secret. Never share it with untrusted clients.</span>
              </div>
            </div>

            {/* REST API Endpoints Box */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 flex items-center space-x-2">
                  <Globe className="w-4 h-4 text-emerald-400" />
                  <span>Universal API Endpoints</span>
                </span>
                <span className="text-[10px] bg-cyan-500/10 text-cyan-400 px-2.5 py-0.5 rounded-full border border-cyan-500/20 font-mono">
                  HTTPS REST
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold text-emerald-400">1. Create Checkout Session (POST)</span>
                    <button
                      onClick={() => {
                        const url = 'https://wandervibe-email-service.onrender.com/api/gateway/create-session';
                        navigator.clipboard.writeText(url);
                        setIsCopiedEndpoint(true);
                        setTimeout(() => setIsCopiedEndpoint(false), 2000);
                      }}
                      className="text-[10px] text-cyan-400 hover:underline flex items-center space-x-1"
                    >
                      <span>{isCopiedEndpoint ? '✓ Copied' : 'Copy URL'}</span>
                    </button>
                  </div>
                  <code className="text-slate-300 block font-mono text-[11px] break-all">
                    https://wandervibe-email-service.onrender.com/api/gateway/create-session
                  </code>
                </div>

                <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-cyan-400">2. Hosted Checkout Domain</span>
                  <code className="text-slate-300 block font-mono text-[11px] break-all">
                    https://dateandtravel-app.web.app/?pay_session=&#123;session_id&#125;
                  </code>
                </div>
              </div>
            </div>

          </div>

          {/* Live Interactive Test Checkout Generator */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                LIVE TEST GENERATOR
              </span>
              <h4 className="text-lg font-bold text-white mt-1">Generate Instant Test Payment Link</h4>
              <p className="text-xs text-slate-400">
                Fill the form below to generate a real, working payment session link to test from your browser:
              </p>
            </div>

            <form onSubmit={handleCreateTestGatewaySession} className="space-y-4 text-xs">
              
              {/* Payment Mode Selector */}
              <div>
                <label className="block text-slate-400 font-semibold mb-1.5">Select Gateway Mode *</label>
                <div className="grid grid-cols-2 gap-3 max-w-md">
                  <button
                    type="button"
                    onClick={() => {
                      setTestMode('ONE_TIME');
                      setTestPurpose('Product Purchase');
                    }}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                      testMode === 'ONE_TIME'
                        ? 'bg-emerald-500/15 border-emerald-500 text-white font-bold'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center space-x-1.5 text-xs font-bold text-emerald-400 mb-0.5">
                      <Zap className="w-3.5 h-3.5" />
                      <span>1. Standard One-Time</span>
                    </div>
                    <p className="text-[10px] text-slate-400 font-normal">Normal 1-time instant checkout</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setTestMode('AUTOPAY');
                      setTestPurpose('SaaS Recurring Subscription');
                    }}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                      testMode === 'AUTOPAY'
                        ? 'bg-cyan-500/15 border-cyan-500 text-white font-bold'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center space-x-1.5 text-xs font-bold text-cyan-400 mb-0.5">
                      <Repeat className="w-3.5 h-3.5" />
                      <span>2. UPI AutoPay Mandate</span>
                    </div>
                    <p className="text-[10px] text-slate-400 font-normal">Recurring monthly/yearly e-mandate</p>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">
                    {testMode === 'AUTOPAY' ? 'Recurring Amount (₹ / Cycle) *' : 'Amount (₹ INR) *'}
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={testAmount}
                    onChange={(e) => setTestAmount(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white font-bold text-sm focus:outline-none"
                  />
                </div>

                {testMode === 'AUTOPAY' && (
                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">Billing Frequency *</label>
                    <select
                      value={testFrequency}
                      onChange={(e: any) => setTestFrequency(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white text-xs font-semibold focus:outline-none"
                    >
                      <option value="monthly">Monthly (Every 30 Days)</option>
                      <option value="yearly">Yearly (Every 365 Days)</option>
                      <option value="weekly">Weekly (Every 7 Days)</option>
                      <option value="daily">Daily (Micro-Subscription)</option>
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Order Reference ID *</label>
                  <input
                    type="text"
                    required
                    value={testOrderId}
                    onChange={(e) => setTestOrderId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white font-mono focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Customer Name</label>
                  <input
                    type="text"
                    value={testCustomerName}
                    onChange={(e) => setTestCustomerName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Customer Email</label>
                  <input
                    type="email"
                    value={testCustomerEmail}
                    onChange={(e) => setTestCustomerEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none"
                  />
                </div>

                <div className={testMode === 'AUTOPAY' ? 'sm:col-span-2' : 'sm:col-span-2'}>
                  <label className="block text-slate-400 font-semibold mb-1">Purpose / Plan Name</label>
                  <input
                    type="text"
                    value={testPurpose}
                    onChange={(e) => setTestPurpose(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isGeneratingSession}
                  className={`bg-gradient-to-r ${testMode === 'AUTOPAY' ? 'from-cyan-500 to-teal-400 shadow-cyan-500/20' : 'from-emerald-500 to-teal-400 shadow-emerald-500/20'} hover:opacity-90 text-slate-950 font-bold px-6 py-3.5 rounded-2xl text-xs flex items-center space-x-2 shadow-lg transition-all hover:scale-[1.01] cursor-pointer disabled:opacity-50`}
                >
                  {testMode === 'AUTOPAY' ? <Repeat className="w-4 h-4" /> : <Zap className="w-4 h-4" />}
                  <span>{isGeneratingSession ? 'Generating Mandate...' : testMode === 'AUTOPAY' ? 'Generate UPI AutoPay Mandate Link ⚡' : 'Generate Live Checkout URL ⚡'}</span>
                </button>
              </div>
            </form>

            {createdPaymentUrl && (
              <div className="bg-emerald-950/40 border-2 border-emerald-500/40 p-5 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-400 flex items-center space-x-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Live Checkout URL Created Successfully!</span>
                  </span>
                  <a
                    href={createdPaymentUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-3 py-1 rounded-xl text-xs flex items-center space-x-1"
                  >
                    <span>Open Checkout</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>

                <div className="flex items-center space-x-2 bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-xs text-slate-200 break-all">
                  <span className="flex-1 truncate">{createdPaymentUrl}</span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(createdPaymentUrl);
                      alert("Checkout URL copied!");
                    }}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1 rounded-lg text-xs flex-shrink-0"
                  >
                    Copy Link
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Integration Code Snippets (Node.js, PHP, Python, cURL) */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-cyan-400 bg-cyan-500/10 px-2.5 py-0.5 rounded-full border border-cyan-500/20">
                  DEVELOPER INTEGRATION
                </span>
                <h4 className="text-lg font-bold text-white mt-1">Copy-Paste Integration Code for Other Websites</h4>
              </div>

              {/* Code Tab Switcher */}
              <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
                <button
                  onClick={() => setCodeTab('node')}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                    codeTab === 'node' ? 'bg-cyan-500 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Node.js / JS
                </button>
                <button
                  onClick={() => setCodeTab('php')}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                    codeTab === 'php' ? 'bg-cyan-500 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  PHP
                </button>
                <button
                  onClick={() => setCodeTab('python')}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                    codeTab === 'python' ? 'bg-cyan-500 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Python
                </button>
                <button
                  onClick={() => setCodeTab('curl')}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                    codeTab === 'curl' ? 'bg-cyan-500 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  cURL
                </button>
              </div>
            </div>

            {/* Code Snippet Box */}
            <div className="bg-slate-950 p-4 sm:p-5 rounded-2xl border border-slate-800 relative font-mono text-xs text-cyan-300 overflow-x-auto">
              <button
                onClick={() => {
                  let textToCopy = '';
                  const isAuto = testMode === 'AUTOPAY';
                  if (codeTab === 'node') {
                    textToCopy = `// In your external website (Node.js / Express / Frontend):
const response = await fetch("https://wandervibe-email-service.onrender.com/api/gateway/create-session", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "x-gateway-key": "${gatewayApiKey}"
  },
  body: JSON.stringify({
    order_id: "${isAuto ? 'SUB_99882' : 'ORD_99882'}",
    amount: ${testAmount}, // ₹${testAmount}
    mode: "${testMode}", // "${testMode}"
    ${isAuto ? `recurring_frequency: "${testFrequency}", // 'monthly' | 'yearly' | 'weekly'\n    recurring_cycles: 12,\n` : ''}customer_name: "Customer Name",
    customer_email: "customer@gmail.com",
    purpose: "${testPurpose}",
    success_url: "https://your-site.com/payment-success",
    cancel_url: "https://your-site.com/payment-cancel",
    webhook_url: "https://your-site.com/api/webhook"
  })
});

const data = await response.json();
// Redirect customer to the secure checkout page:
window.location.href = data.payment_url;`;
                  } else if (codeTab === 'php') {
                    textToCopy = `<?php
// In your PHP Website:
$payload = json_encode([
    "order_id" => "${isAuto ? 'SUB_' : 'ORD_'}" . time(),
    "amount" => ${testAmount},
    "mode" => "${testMode}",
    ${isAuto ? `"recurring_frequency" => "${testFrequency}",\n    "recurring_cycles" => 12,\n` : ''}"customer_name" => "Customer Name",
    "customer_email" => "customer@gmail.com",
    "purpose" => "${testPurpose}",
    "success_url" => "https://your-site.com/success.php",
    "cancel_url" => "https://your-site.com/cancel.php",
    "webhook_url" => "https://your-site.com/webhook.php"
]);

$ch = curl_init("https://wandervibe-email-service.onrender.com/api/gateway/create-session");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Content-Type: application/json",
    "x-gateway-key: ${gatewayApiKey}"
]);

$response = json_decode(curl_exec($ch), true);
curl_close($ch);

// Redirect user to payment checkout:
header("Location: " . $response["payment_url"]);
exit;
?>`;
                  } else if (codeTab === 'python') {
                    textToCopy = `import requests

# In your Python / Django / Flask Backend:
response = requests.post(
    "https://wandervibe-email-service.onrender.com/api/gateway/create-session",
    headers={
        "Content-Type": "application/json",
        "x-gateway-key": "${gatewayApiKey}"
    },
    json={
        "order_id": "${isAuto ? 'SUB_12345' : 'ORD_12345'}",
        "amount": ${testAmount},
        "mode": "${testMode}",
        ${isAuto ? `"recurring_frequency": "${testFrequency}",\n        "recurring_cycles": 12,\n` : ''}"customer_name": "Rahul Verma",
        "customer_email": "rahul@gmail.com",
        "purpose": "${testPurpose}",
        "success_url": "https://your-site.com/success",
        "cancel_url": "https://your-site.com/cancel",
        "webhook_url": "https://your-site.com/api/webhook"
    }
)

data = response.json()
# Redirect customer to: data["payment_url"]`;
                  } else {
                    textToCopy = `curl -X POST "https://wandervibe-email-service.onrender.com/api/gateway/create-session" \\
  -H "Content-Type: application/json" \\
  -H "x-gateway-key: ${gatewayApiKey}" \\
  -d '{
    "order_id": "${isAuto ? 'SUB_99882' : 'ORD_99882'}",
    "amount": ${testAmount},
    "mode": "${testMode}",
    ${isAuto ? `"recurring_frequency": "${testFrequency}",\n    "recurring_cycles": 12,\n` : ''}"customer_name": "John Doe",
    "customer_email": "john@example.com",
    "purpose": "${testPurpose}",
    "success_url": "https://your-site.com/success",
    "cancel_url": "https://your-site.com/cancel"
  }'`;
                  }
                  navigator.clipboard.writeText(textToCopy);
                  alert("Code snippet copied to clipboard!");
                }}
                className="absolute top-4 right-4 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold px-3 py-1.5 rounded-xl text-[11px] flex items-center space-x-1 border border-slate-700 cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Code</span>
              </button>

              <pre className="whitespace-pre">
                {codeTab === 'node' && `// In your external website (Node.js / Express / Frontend):
const response = await fetch("https://wandervibe-email-service.onrender.com/api/gateway/create-session", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "x-gateway-key": "${gatewayApiKey}"
  },
  body: JSON.stringify({
    order_id: "${testMode === 'AUTOPAY' ? 'SUB_99882' : 'ORD_99882'}",
    amount: ${testAmount}, // ₹${testAmount}
    mode: "${testMode}", // "${testMode}"
    ${testMode === 'AUTOPAY' ? `recurring_frequency: "${testFrequency}", // 'monthly' | 'yearly' | 'weekly'\n    recurring_cycles: 12,\n    ` : ''}customer_name: "Customer Name",
    customer_email: "customer@gmail.com",
    purpose: "${testPurpose}",
    success_url: "https://your-site.com/payment-success",
    cancel_url: "https://your-site.com/payment-cancel",
    webhook_url: "https://your-site.com/api/webhook"
  })
});

const data = await response.json();
// Redirect customer to the secure checkout page:
window.location.href = data.payment_url;`}

                {codeTab === 'php' && `<?php
// In your PHP Website:
$payload = json_encode([
    "order_id" => "${testMode === 'AUTOPAY' ? 'SUB_' : 'ORD_'}" . time(),
    "amount" => ${testAmount},
    "mode" => "${testMode}",
    ${testMode === 'AUTOPAY' ? `"recurring_frequency" => "${testFrequency}",\n    "recurring_cycles" => 12,\n    ` : ''}"customer_name" => "Customer Name",
    "customer_email" => "customer@gmail.com",
    "purpose" => "${testPurpose}",
    "success_url" => "https://your-site.com/success.php",
    "cancel_url" => "https://your-site.com/cancel.php",
    "webhook_url" => "https://your-site.com/webhook.php"
]);

$ch = curl_init("https://wandervibe-email-service.onrender.com/api/gateway/create-session");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Content-Type: application/json",
    "x-gateway-key: ${gatewayApiKey}"
]);

$response = json_decode(curl_exec($ch), true);
curl_close($ch);

// Redirect user to payment checkout:
header("Location: " . $response["payment_url"]);
exit;
?>`}

                {codeTab === 'python' && `import requests

# In your Python / Django / Flask Backend:
response = requests.post(
    "https://wandervibe-email-service.onrender.com/api/gateway/create-session",
    headers={
        "Content-Type": "application/json",
        "x-gateway-key": "${gatewayApiKey}"
    },
    json={
        "order_id": "${testMode === 'AUTOPAY' ? 'SUB_12345' : 'ORD_12345'}",
        "amount": ${testAmount},
        "mode": "${testMode}",
        ${testMode === 'AUTOPAY' ? `"recurring_frequency": "${testFrequency}",\n        "recurring_cycles": 12,\n        ` : ''}"customer_name": "Rahul Verma",
        "customer_email": "rahul@gmail.com",
        "purpose": "${testPurpose}",
        "success_url": "https://your-site.com/success",
        "cancel_url": "https://your-site.com/cancel",
        "webhook_url": "https://your-site.com/api/webhook"
    }
)

data = response.json()
# Redirect customer to: data["payment_url"]`}

                {codeTab === 'curl' && `curl -X POST "https://wandervibe-email-service.onrender.com/api/gateway/create-session" \\
  -H "Content-Type: application/json" \\
  -H "x-gateway-key: ${gatewayApiKey}" \\
  -d '{
    "order_id": "${testMode === 'AUTOPAY' ? 'SUB_99882' : 'ORD_99882'}",
    "amount": ${testAmount},
    "mode": "${testMode}",
    ${testMode === 'AUTOPAY' ? `"recurring_frequency": "${testFrequency}",\n    "recurring_cycles": 12,\n    ` : ''}"customer_name": "John Doe",
    "customer_email": "john@example.com",
    "purpose": "${testPurpose}",
    "success_url": "https://your-site.com/success",
    "cancel_url": "https://your-site.com/cancel"
  }'`}
              </pre>
            </div>
          </div>

          {/* Cross-Website Transactions History */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-lg font-bold text-white">Cross-Website Gateway Transactions</h4>
                <p className="text-xs text-slate-400">Live feed of payments processed through the proxy switch</p>
              </div>
              <span className="text-xs text-cyan-400 font-bold bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">
                {gatewayTransactionsList.length} Sessions Logged
              </span>
            </div>

            {gatewayTransactionsList.length === 0 ? (
              <div className="bg-slate-950 p-8 rounded-2xl border border-slate-800 text-center text-xs text-slate-400 space-y-1">
                <p className="font-semibold text-slate-300">No external gateway transactions yet.</p>
                <p className="text-[11px] text-slate-500">Generate a test payment link above or integrate the API in your external website to see live payments here!</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                    <tr>
                      <th className="p-3">Order Reference</th>
                      <th className="p-3">Customer</th>
                      <th className="p-3">Purpose</th>
                      <th className="p-3">Amount</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Created</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-sans">
                    {gatewayTransactionsList.map((tx, i) => (
                      <tr key={i} className="hover:bg-slate-800/40 transition-colors">
                        <td className="p-3 font-mono font-bold text-slate-200">
                          {tx.orderId}
                          <div className="text-[10px] text-slate-500 font-normal">{tx.sessionId}</div>
                        </td>
                        <td className="p-3">
                          <div className="font-semibold text-white">{tx.customerName || 'Guest'}</div>
                          <div className="text-[10px] text-slate-400">{tx.customerEmail || 'No Email'}</div>
                        </td>
                        <td className="p-3 text-slate-300">{tx.purpose}</td>
                        <td className="p-3 font-bold text-emerald-400 text-sm">
                          ₹{Number(tx.amount).toLocaleString('en-IN')}
                        </td>
                        <td className="p-3">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            tx.status === 'PAID'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          }`}>
                            {tx.status === 'PAID' ? '✓ PAID' : '⏳ PENDING'}
                          </span>
                        </td>
                        <td className="p-3 text-slate-400 text-[11px]">
                          {new Date(tx.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>
      )}

      {/* TICKET CANCELLATION CONFIRMATION MODAL */}
      {cancellingBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-rose-500/30 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5 text-white relative">
            <div className="flex items-center space-x-3 text-rose-400">
              <div className="w-10 h-10 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-5 h-5 text-rose-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold font-display text-white">Cancel Passenger Ticket</h3>
                <p className="text-xs text-slate-400">Booking ID: {cancellingBooking.id}</p>
              </div>
            </div>

            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">Traveler:</span>
                <span className="font-bold text-white">{cancellingBooking.primaryTraveler.fullName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Seats:</span>
                <span className="font-bold text-emerald-400">#{cancellingBooking.seatNumbers.join(', #')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Amount Paid:</span>
                <span className="font-bold text-white">₹{cancellingBooking.totalAmountPaid.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Reason for Cancellation (Stored in Agency Records)
              </label>
              <textarea
                rows={2}
                value={cancellationReasonInput}
                onChange={(e) => setCancellationReasonInput(e.target.value)}
                placeholder="e.g. Traveler requested cancellation / Refund processed via UPI"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none"
              />
            </div>

            <div className="flex space-x-3">
              <button
                type="button"
                onClick={() => setCancellingBooking(null)}
                className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-2.5 rounded-xl text-xs transition-colors"
              >
                Keep Ticket
              </button>
              <button
                type="button"
                onClick={() => {
                  if (onCancelBooking) {
                    onCancelBooking(cancellingBooking.id, cancellationReasonInput);
                  }
                  setCancellingBooking(null);
                }}
                className="flex-1 bg-rose-600 hover:bg-rose-500 text-white font-bold py-2.5 rounded-xl text-xs shadow-lg shadow-rose-600/20 transition-all"
              >
                Confirm Ticket Cancellation ❌
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
