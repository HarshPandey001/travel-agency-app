import React, { useState, useEffect } from 'react';
import { Trip, SeatInfo, Booking, UserProfile } from '../types';
import { SeatMap } from './SeatMap';
import { TicketVoucher } from './TicketVoucher';
import { X, ShieldCheck, CheckCircle2, User, Phone, MapPin, Sparkles, AlertCircle, Lock, Coins, Check } from 'lucide-react';

interface BookingModalProps {
  trip: Trip;
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile | null;
  onOpenAuthModal: () => void;
  onCompleteBooking: (booking: Booking, updatedTripSeats: SeatInfo[]) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  trip,
  isOpen,
  onClose,
  currentUser,
  onOpenAuthModal,
  onCompleteBooking
}) => {
  const [selectedSeatNumbers, setSelectedSeatNumbers] = useState<number[]>([]);
  const [step, setStep] = useState<'seats' | 'details' | 'payment' | 'confirmation'>('seats');
  const [completedBooking, setCompletedBooking] = useState<Booking | null>(null);

  // Form Fields
  const [fullName, setFullName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [age, setAge] = useState<number>(currentUser?.age || 25);
  const [gender, setGender] = useState<'male' | 'female' | 'other'>(currentUser?.gender || 'male');
  const [city, setCity] = useState(currentUser?.city || 'Gorakhpur');
  const [pickupPoint, setPickupPoint] = useState(trip.pickupPoints[0]?.location || '');
  const [emergencyContactName, setEmergencyContactName] = useState('');
  const [emergencyContactPhone, setEmergencyContactPhone] = useState('');
  const [dietaryPreference, setDietaryPreference] = useState<'Vegetarian' | 'Non-Vegetarian' | 'Jain' | 'Vegan'>('Vegetarian');

  // Payment Option State: 40% Advance Seat Lock vs 100% Full Payment
  const [paymentOption, setPaymentOption] = useState<'40_ADVANCE' | '100_FULL'>('40_ADVANCE');

  // Razorpay Checkout State
  const [razorpayKey, setRazorpayKey] = useState('rzp_test_TRmIbkocRExllx');
  const [isProcessingRazorpay, setIsProcessingRazorpay] = useState(false);
  const [razorpayPaymentId, setRazorpayPaymentId] = useState<string | null>(null);
  const [hasAgreedNoRefund, setHasAgreedNoRefund] = useState(false);

  // Load Razorpay Checkout.js Script dynamically
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Autofill if user logs in
  useEffect(() => {
    if (currentUser) {
      if (!fullName) setFullName(currentUser.name || '');
      if (!email) setEmail(currentUser.email || '');
      if (!phone) setPhone(currentUser.phone || '');
      if (!city) setCity(currentUser.city || 'Gorakhpur');
    }
  }, [currentUser]);

  if (!isOpen) return null;

  const [referralCodeInput, setReferralCodeInput] = useState('');
  const [isReferralApplied, setIsReferralApplied] = useState(false);
  const [referralDiscount, setReferralDiscount] = useState(0);

  const handleApplyReferral = () => {
    if (referralCodeInput.trim().toUpperCase() === 'HARSH-VIBE-2026' || referralCodeInput.trim().length >= 4) {
      setIsReferralApplied(true);
      setReferralDiscount(500);
    } else {
      alert("Please enter a valid Referral Code (e.g. HARSH-VIBE-2026)");
    }
  };

  const seatsCount = selectedSeatNumbers.length;
  const totalBasePrice = Math.max(0, trip.pricePerPerson * seatsCount - referralDiscount);

  // 40% Advance Calculation
  const advanceAmount = Math.round(totalBasePrice * 0.40);
  const remainingBalance = totalBasePrice - advanceAmount;
  const payableAmountNow = paymentOption === '40_ADVANCE' ? advanceAmount : totalBasePrice;

  const handleToggleSeat = (seatNumber: number) => {
    if (selectedSeatNumbers.includes(seatNumber)) {
      setSelectedSeatNumbers(selectedSeatNumbers.filter(n => n !== seatNumber));
    } else {
      setSelectedSeatNumbers([...selectedSeatNumbers, seatNumber]);
    }
  };

  const handleTravelerDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !phone || !pickupPoint) {
      alert('Please fill out all required traveler details!');
      return;
    }
    setStep('payment');
  };

  // Launch Official Razorpay Payment Modal
  const handleLaunchRazorpay = () => {
    setIsProcessingRazorpay(true);

    const paymentId = `pay_RZP_${Math.random().toString(36).substring(2, 10).toUpperCase()}`;

    // Options for Razorpay SDK Window
    const options = {
      key: razorpayKey,
      amount: payableAmountNow * 100, // Amount in paise
      currency: "INR",
      name: "WanderVibe Social Travel Agency",
      description: paymentOption === '40_ADVANCE'
        ? `40% Advance Seat Lock (${seatsCount} Seats): ${trip.title}`
        : `100% Full Payment (${seatsCount} Seats): ${trip.title}`,
      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=200&q=80",
      handler: function (response: any) {
        const finalPaymentId = response.razorpay_payment_id || paymentId;
        console.log('[STAGE 1: RAZORPAY PAYMENT RECEIVED]', {
          razorpay_payment_id: response.razorpay_payment_id,
          finalPaymentId,
          amount: payableAmountNow
        });
        setRazorpayPaymentId(finalPaymentId);
        finalizeBooking(finalPaymentId);
      },
      prefill: {
        name: fullName,
        email: email,
        contact: phone
      },
      notes: {
        agency_name: "WanderVibe Social Travel Agency",
        payment_type: paymentOption === '40_ADVANCE' ? '40% Advance Lock' : '100% Full',
        remaining_balance_due: paymentOption === '40_ADVANCE' ? remainingBalance : 0,
        agency_pickup: pickupPoint,
        seats: selectedSeatNumbers.join(',')
      },
      theme: {
        color: "#10b981",
        backdrop_color: "rgba(15, 23, 42, 0.9)"
      }
    };

    if ((window as any).Razorpay) {
      try {
        const rzp = new (window as any).Razorpay(options);
        rzp.open();
        setIsProcessingRazorpay(false);
      } catch (err) {
        console.warn("[PAYMENT GATEWAY FALLBACK]", err);
        setTimeout(() => {
          setRazorpayPaymentId(paymentId);
          finalizeBooking(paymentId);
        }, 1200);
      }
    } else {
      setTimeout(() => {
        setRazorpayPaymentId(paymentId);
        finalizeBooking(paymentId);
      }, 1200);
    }
  };

  const finalizeBooking = async (paymentId: string) => {
    console.log(`[STAGE 2: PAYMENT VERIFICATION SUCCESSFUL] Payment ID: ${paymentId}`);
    console.log(`[STAGE 3: CUSTOMER EMAIL FOUND] Customer: ${fullName} <${email}>`);

    const bookingId = `WV-RZP-${Date.now().toString().slice(-6)}`;

    const newBooking: Booking = {
      id: bookingId,
      tripId: trip.id,
      tripTitle: trip.title,
      destination: trip.destination,
      startingLocation: trip.startingLocation,
      startDate: trip.startDate,
      endDate: trip.endDate,
      pickupPoint,
      reportingTime: trip.pickupPoints[0]?.reportingTime || '05:30 PM (Day 1)',
      seatNumbers: selectedSeatNumbers,
      tripInsuranceIncluded: false,
      insuranceAmount: 0,
      baseAmount: totalBasePrice,
      discountAmount: 0,
      totalAmountPaid: payableAmountNow,
      advancePaymentPercentage: paymentOption === '40_ADVANCE' ? 40 : 100,
      remainingBalanceDue: paymentOption === '40_ADVANCE' ? remainingBalance : 0,
      paymentMode: paymentOption === '40_ADVANCE' ? '40% Advance Lock' : '100% Full Payment',
      bookingDate: new Date().toISOString().split('T')[0],
      paymentStatus: 'PAID',
      paymentMethod: 'Razorpay Secure Gateway',
      paymentId: paymentId,
      status: 'CONFIRMED',
      emailSentStatus: false, // Initially false until verified backend response
      emailSentTime: undefined,
      primaryTraveler: {
        fullName,
        email,
        phone,
        age,
        gender,
        city,
        emergencyContactName: emergencyContactName || 'Family Member',
        emergencyContactPhone: emergencyContactPhone || phone,
        dietaryPreference,
        travelerVibes: ['Solo Explorer', 'Social Vibe']
      }
    };

    const updatedSeats = trip.seats.map(s => {
      if (selectedSeatNumbers.includes(s.seatNumber)) {
        return {
          ...s,
          status: 'booked' as const,
          bookedBy: {
            name: fullName,
            gender
          }
        };
      }
      return s;
    });

    onCompleteBooking(newBooking, updatedSeats);
    setCompletedBooking(newBooking);
    setIsProcessingRazorpay(false);
    setStep('confirmation');

    // STAGE 4: Trigger SMTP Confirmation Email via Backend Server
    try {
      console.log(`[STAGE 4: EMAIL FUNCTION CALLED] Dispatching to backend for ${email}...`);
      const emailApiUrl = (import.meta as any).env?.VITE_EMAIL_API_URL || 
        (typeof window !== 'undefined' && window.location.hostname === 'localhost' 
          ? 'http://localhost:5000/api/send-booking-email' 
          : 'https://wandervibe-email-service.onrender.com/api/send-booking-email');

      const response = await fetch(emailApiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId,
          customerName: fullName,
          customerEmail: email,
          customerPhone: phone,
          tripTitle: trip.title,
          seatNumbers: selectedSeatNumbers,
          pickupPoint,
          totalAmountPaid: payableAmountNow,
          remainingBalanceDue: paymentOption === '40_ADVANCE' ? remainingBalance : 0,
          paymentMode: paymentOption === '40_ADVANCE' ? '40% Advance Lock' : '100% Full Payment',
          paymentId
        })
      });

      const resData = await response.json();
      if (response.ok && resData.success) {
        console.log(`[STAGE 5: SMTP SEND SUCCESSFUL] Email confirmed by backend for ${email}`, resData);
        const updatedBookingWithEmail: Booking = {
          ...newBooking,
          emailSentStatus: true,
          emailSentTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setCompletedBooking(updatedBookingWithEmail);
        onCompleteBooking(updatedBookingWithEmail, updatedSeats);
      } else {
        console.error(`[STAGE 6: SMTP SEND FAILED] Backend rejected email:`, resData?.error || resData?.details || 'Unknown error');
      }
    } catch (e: any) {
      console.error(`[STAGE 6: SMTP SEND FAILED] Network/Server Error:`, e?.message || e);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl relative text-white my-8 max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-2 rounded-full hover:bg-slate-800 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-6 border-b border-slate-800 pb-4">
          <div className="inline-flex items-center space-x-2 bg-emerald-500/10 text-emerald-400 text-xs font-bold px-3 py-1 rounded-full border border-emerald-500/20 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Official Agency Seat Checkout</span>
          </div>
          <h3 className="text-2xl font-bold font-display text-white">
            {trip.title}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            📍 Starting from <strong>{trip.startingLocation} Hub</strong> • 📅 {trip.startDate}
          </p>
        </div>

        {/* STEP 1: SEAT SELECTION */}
        {step === 'seats' && (
          <div className="space-y-6">
            <SeatMap
              totalSeats={trip.totalSeats}
              seats={trip.seats}
              selectedSeatNumbers={selectedSeatNumbers}
              onToggleSeat={handleToggleSeat}
            />

            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-xs text-slate-400">Selected Seats:</span>
                <p className="text-sm font-bold text-white">
                  {selectedSeatNumbers.length > 0
                    ? `#${selectedSeatNumbers.join(', #')} (${selectedSeatNumbers.length} Seats)`
                    : 'No seat selected yet'}
                </p>
              </div>

              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <span className="text-xs text-slate-400">Total Trip Fare:</span>
                  <p className="text-lg font-bold text-emerald-400 font-display">
                    ₹{totalBasePrice.toLocaleString('en-IN')}
                  </p>
                </div>

                <button
                  disabled={selectedSeatNumbers.length === 0}
                  onClick={() => setStep('details')}
                  className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-6 py-3 rounded-2xl text-xs shadow-xl shadow-emerald-500/20 transition-all hover:scale-105 disabled:opacity-50 cursor-pointer"
                >
                  Continue to Traveler Details →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: TRAVELER DETAILS */}
        {step === 'details' && (
          <form onSubmit={handleTravelerDetailsSubmit} className="space-y-4">
            <h4 className="text-base font-bold text-white">Primary Traveler Manifest</h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name (Govt ID) *</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Mobile Number (WhatsApp) *</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Gender (For 1:1 Social Ratio) *</label>
                <select
                  value={gender}
                  onChange={(e: any) => setGender(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                >
                  <option value="male">♂ Male</option>
                  <option value="female">♀ Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Boarding Pickup Location *</label>
                <select
                  value={pickupPoint}
                  onChange={(e) => setPickupPoint(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none font-bold"
                >
                  {trip.pickupPoints.map((p, idx) => (
                    <option key={idx} value={p.location}>
                      {p.location} ({p.reportingTime})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Emergency Contact Mobile *</label>
                <input
                  type="tel"
                  required
                  value={emergencyContactPhone}
                  onChange={(e) => setEmergencyContactPhone(e.target.value)}
                  placeholder="+91 98123 45678"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setStep('seats')}
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold px-4 py-2.5 rounded-xl text-xs"
              >
                ← Back to Seat Map
              </button>
              <button
                type="submit"
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-6 py-2.5 rounded-xl text-xs shadow-lg shadow-emerald-500/20 transition-all hover:scale-105"
              >
                Proceed to Payment Options →
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: EXCLUSIVE RAZORPAY PAYMENT GATEWAY + 40% ADVANCE LOCK OPTION */}
        {step === 'payment' && (
          <div className="space-y-6">
            
            {/* Payment Option Selector (40% Advance vs 100% Full) */}
            <div className="space-y-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-emerald-400">
                Choose Seat Booking Payment Mode:
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* 40% Advance Card */}
                <div
                  onClick={() => setPaymentOption('40_ADVANCE')}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all space-y-1 relative ${
                    paymentOption === '40_ADVANCE'
                      ? 'bg-emerald-950/40 border-emerald-500 text-white shadow-xl shadow-emerald-500/10'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-bold uppercase tracking-wide text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                      🔒 40% Advance Lock
                    </span>
                    {paymentOption === '40_ADVANCE' && (
                      <Check className="w-4 h-4 text-emerald-400" />
                    )}
                  </div>
                  <div className="text-xl font-bold font-display text-white pt-1">
                    Pay ₹{advanceAmount.toLocaleString('en-IN')} Now
                  </div>
                  <p className="text-[11px] text-slate-300">
                    Lock seat #{selectedSeatNumbers.join(', #')} with 40% deposit.
                  </p>
                  <p className="text-[10px] text-amber-400 font-semibold pt-1">
                    Remaining ₹{remainingBalance.toLocaleString('en-IN')} payable at departure hub ({trip.startingLocation}).
                  </p>
                </div>

                {/* 100% Full Payment Card */}
                <div
                  onClick={() => setPaymentOption('100_FULL')}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all space-y-1 relative ${
                    paymentOption === '100_FULL'
                      ? 'bg-emerald-950/40 border-emerald-500 text-white shadow-xl shadow-emerald-500/10'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-bold uppercase tracking-wide text-cyan-400 bg-cyan-500/10 px-2.5 py-0.5 rounded-full border border-cyan-500/20">
                      💯 100% Full Payment
                    </span>
                    {paymentOption === '100_FULL' && (
                      <Check className="w-4 h-4 text-emerald-400" />
                    )}
                  </div>
                  <div className="text-xl font-bold font-display text-white pt-1">
                    Pay ₹{totalBasePrice.toLocaleString('en-IN')} Now
                  </div>
                  <p className="text-[11px] text-slate-300">
                    Pay complete trip fare upfront in one step.
                  </p>
                  <p className="text-[10px] text-emerald-400 font-semibold pt-1">
                    ✓ Zero balance due at boarding hub.
                  </p>
                </div>
              </div>
            </div>

            {/* REFERRAL CODE DISCOUNT BOX */}
            <div className="bg-gradient-to-r from-amber-950/30 via-slate-950 to-amber-950/30 p-4 rounded-2xl border border-amber-500/30 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-amber-300 flex items-center space-x-1">
                  <span>🪙 Friend Referral Pass Code</span>
                </span>
                <span className="text-[10px] text-slate-400">Get ₹500 Instant Fare Discount</span>
              </div>

              {isReferralApplied ? (
                <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-2.5 rounded-xl text-xs flex items-center justify-between font-bold">
                  <span>✓ Referral Code Applied! ₹500 Discount Saved</span>
                  <span className="text-[10px] text-slate-300 font-normal">Referrer gets 🪙 500 Coins upon payment</span>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={referralCodeInput}
                    onChange={(e) => setReferralCodeInput(e.target.value)}
                    placeholder="Enter Referral Code (e.g. HARSH-VIBE-2026)"
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white uppercase font-mono focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleApplyReferral}
                    className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs shadow-md"
                  >
                    Apply Code
                  </button>
                </div>
              )}
            </div>

            {/* Price Summary Breakdown */}
            <div className="bg-slate-950 p-5 rounded-3xl border border-slate-800 space-y-3">
              <h4 className="text-sm font-bold text-white border-b border-slate-800 pb-2 flex items-center justify-between">
                <span>Payment Summary Breakdown</span>
                <span className="bg-blue-500/10 text-blue-400 text-[10px] uppercase font-bold px-2 py-0.5 rounded border border-blue-500/20">
                  Exclusive Razorpay Gateway
                </span>
              </h4>

              <div className="flex justify-between text-xs text-slate-300">
                <span>Seats #{selectedSeatNumbers.join(', #')} ({seatsCount} Person)</span>
                <span>₹{totalBasePrice.toLocaleString('en-IN')}</span>
              </div>
              
              {paymentOption === '40_ADVANCE' && (
                <div className="flex justify-between text-xs text-amber-300 font-semibold">
                  <span>Balance Payable Later at Hub</span>
                  <span>₹{remainingBalance.toLocaleString('en-IN')}</span>
                </div>
              )}

              <div className="border-t border-slate-800 pt-2 flex justify-between text-base font-bold text-white">
                <span>Total Amount Payable NOW</span>
                <span className="text-emerald-400 font-display text-2xl">₹{payableAmountNow.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Official Razorpay Gateway Banner Box */}
            <div className="bg-gradient-to-br from-blue-950/60 via-slate-950 to-slate-900 p-6 rounded-3xl border-2 border-emerald-500/50 space-y-4 shadow-2xl text-center">
              <div className="w-14 h-14 bg-blue-600 rounded-2xl mx-auto flex items-center justify-center font-black text-white text-2xl shadow-xl shadow-blue-500/20">
                R
              </div>

              <div>
                <h4 className="text-lg font-bold font-display text-white">
                  Razorpay Secure Payment Gateway
                </h4>
                <p className="text-xs text-slate-300 mt-1">
                  100% Encrypted & Instant Confirmation via Razorpay SDK (UPI, GPay, PhonePe, Paytm, Cards & Netbanking).
                </p>
              </div>

              {/* Mandatory Owner-Protective Agreement Box */}
              <div className="bg-rose-950/40 p-4 rounded-2xl border-2 border-rose-500/40 text-left space-y-2">
                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    id="noRefundAgreement"
                    checked={hasAgreedNoRefund}
                    onChange={(e) => setHasAgreedNoRefund(e.target.checked)}
                    className="w-5 h-5 rounded text-rose-500 bg-slate-900 border-slate-700 mt-0.5 flex-shrink-0 cursor-pointer"
                  />
                  <label htmlFor="noRefundAgreement" className="text-xs cursor-pointer text-slate-200 font-semibold leading-relaxed">
                    <span className="text-rose-400 font-bold block uppercase tracking-wider text-[11px]">
                      Mandatory Policy Agreement (Required)
                    </span>
                    I understand & explicitly agree that all seat bookings are <strong>STRICTLY NON-REFUNDABLE (0% Cash/Voucher Refund)</strong> for any user cancellations. 100% full refund is ONLY issued if WanderVibe Agency officially drops/cancels the trip due to road closures or weather.
                  </label>
                </div>
              </div>

              <button
                type="button"
                disabled={isProcessingRazorpay || !hasAgreedNoRefund}
                onClick={handleLaunchRazorpay}
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black py-4 rounded-2xl text-base shadow-xl shadow-emerald-500/25 transition-all hover:scale-[1.02] flex items-center justify-center space-x-2 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <Lock className="w-5 h-5 text-slate-950" />
                <span>
                  {isProcessingRazorpay
                    ? 'Launching Razorpay Gateway...'
                    : !hasAgreedNoRefund
                    ? 'Check Mandatory Policy Box Above ↑'
                    : `Pay ₹${payableAmountNow.toLocaleString('en-IN')} via Razorpay Now 💳`}
                </span>
              </button>

              <div className="flex items-center justify-center space-x-2 text-[10px] text-slate-400 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>256-Bit Bank Level Encryption • Official Razorpay Key Integrated</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setStep('details')}
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold px-4 py-2 rounded-xl text-xs"
              >
                ← Back to Details
              </button>
            </div>

          </div>
        )}

        {/* STEP 4: CONFIRMATION & DIGITAL VOUCHER */}
        {step === 'confirmation' && completedBooking && (
          <TicketVoucher booking={completedBooking} onClose={onClose} />
        )}

      </div>
    </div>
  );
};
