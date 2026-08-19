import React from 'react';
import { Booking } from '../types';
import { Ticket, MapPin, Calendar, Clock, Bus, Phone, Download, Printer, CheckCircle, ShieldCheck, Sparkles } from 'lucide-react';

interface TicketVoucherProps {
  booking: Booking;
  onClose?: () => void;
}

export const TicketVoucher: React.FC<TicketVoucherProps> = ({ booking, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-2xl mx-auto shadow-2xl text-white my-6">
      
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-slate-950 flex items-center justify-center font-bold shadow-lg shadow-emerald-500/20">
            <Ticket className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs uppercase font-bold tracking-widest text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                Official Agency Pass
              </span>
              <span className="text-xs text-slate-400">ID: {booking.id}</span>
            </div>
            <h3 className="text-xl font-bold font-display text-white mt-0.5">
              Group Travel Seat Voucher
            </h3>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => {
              const text = `🎉 *WanderVibe Social Travel Pass*\n📍 *Trip:* ${booking.tripTitle}\n💺 *Seats:* #${booking.seatNumbers.join(', #')}\n🚉 *Pickup Point:* ${booking.pickupPoint}\n🆔 *Booking ID:* ${booking.id}\n✨ *Agency Owner & Helpline:* Harsh Pandey (+91 63880 50042)\n📍 *Gorakhpur HQ:* Sector 5, C-133, GIDA, Gorakhpur`;
              window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
            }}
            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-3.5 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-transform hover:scale-105 shadow-md"
          >
            <span>📲 WhatsApp Pass</span>
          </button>

          <button
            onClick={handlePrint}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Print Ticket</span>
          </button>
        </div>
      </div>

      {/* Main Ticket Layout - Boarding Pass Style */}
      <div className="my-6 bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden relative shadow-inner">
        
        {/* Top Accent Line */}
        <div className="h-2 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500"></div>

        <div className="p-6 space-y-6">
          
          {/* Trip Info Header */}
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-800/80 pb-5">
            <div>
              <p className="text-xs font-semibold text-emerald-400 uppercase tracking-widest flex items-center space-x-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Curated Agency Expedition</span>
              </p>
              <h4 className="text-2xl font-bold font-display text-white mt-1">
                {booking.tripTitle}
              </h4>
              <p className="text-xs text-slate-400 mt-0.5 flex items-center space-x-1">
                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                <span>Route: {booking.startingLocation} Hub → {booking.destination}</span>
              </p>
            </div>

            <div className="bg-emerald-500/10 border border-emerald-500/30 p-3 rounded-2xl text-center min-w-[120px]">
              <span className="text-[10px] text-emerald-400 uppercase font-bold block">CONFIRMED SEATS</span>
              <span className="text-2xl font-black text-white">
                #{booking.seatNumbers.join(', #')}
              </span>
            </div>
          </div>

          {/* Logistics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 space-y-1">
              <div className="flex items-center space-x-2 text-xs text-slate-400">
                <Calendar className="w-4 h-4 text-cyan-400" />
                <span className="font-semibold text-slate-300">Travel Dates</span>
              </div>
              <p className="text-sm font-bold text-white">
                {booking.startDate} to {booking.endDate}
              </p>
            </div>

            <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 space-y-1">
              <div className="flex items-center space-x-2 text-xs text-slate-400">
                <Clock className="w-4 h-4 text-amber-400" />
                <span className="font-semibold text-slate-300">Reporting Time</span>
              </div>
              <p className="text-sm font-bold text-amber-300">
                {booking.reportingTime}
              </p>
            </div>

            <div className="sm:col-span-2 bg-slate-900/80 p-4 rounded-2xl border border-slate-800 space-y-1">
              <div className="flex items-center space-x-2 text-xs text-slate-400">
                <MapPin className="w-4 h-4 text-emerald-400" />
                <span className="font-semibold text-slate-300">Pickup Location & Landmark</span>
              </div>
              <p className="text-sm font-bold text-white">
                {booking.pickupPoint}
              </p>
            </div>

          </div>

          {/* Passenger & Emergency Info */}
          <div className="border-t border-slate-800/80 pt-5 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <p className="text-slate-400 font-semibold mb-1">Primary Traveler</p>
              <p className="font-bold text-white text-sm">{booking.primaryTraveler.fullName}</p>
              <p className="text-slate-400">{booking.primaryTraveler.phone} • {booking.primaryTraveler.city}</p>
            </div>

            <div>
              <p className="text-slate-400 font-semibold mb-1">Agency Owner & 24/7 Helpline</p>
              <p className="font-bold text-emerald-400 text-sm flex items-center space-x-1">
                <Phone className="w-3.5 h-3.5" />
                <span>+91 63880 50042 (Harsh Pandey)</span>
              </p>
              <p className="text-slate-400 text-[10px] mt-0.5">Sector 5, C-133, GIDA, Gorakhpur, UP</p>
            </div>
          </div>

          {/* QR Code & Barcode Section */}
          <div className="border-t border-slate-800/80 pt-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-200">
                Amount Paid via Razorpay: <span className="text-emerald-400">₹{booking.totalAmountPaid.toLocaleString('en-IN')}</span>
              </p>
              {booking.remainingBalanceDue && booking.remainingBalanceDue > 0 ? (
                <p className="text-xs font-bold text-amber-400 mt-0.5">
                  ⏳ Remaining Balance Due at Departure Hub: ₹{booking.remainingBalanceDue.toLocaleString('en-IN')}
                </p>
              ) : (
                <p className="text-[11px] text-emerald-400 font-semibold mt-0.5">
                  ✓ 100% Full Fare Paid In Advance
                </p>
              )}
              <p className="text-[10px] text-slate-400 mt-0.5">Payment ID: {booking.paymentId}</p>
            </div>

            {/* Simulated Digital Ticket QR Code */}
            <div className="flex items-center space-x-3 bg-white p-2.5 rounded-2xl shadow-md">
              <div className="w-16 h-16 bg-slate-950 p-1 rounded-xl flex flex-col justify-between">
                <div className="grid grid-cols-4 gap-0.5">
                  {Array.from({ length: 16 }).map((_, i) => (
                    <div key={i} className={`w-2 h-2 rounded-xs ${i % 2 === 0 ? 'bg-white' : 'bg-slate-800'}`}></div>
                  ))}
                </div>
                <span className="text-[7px] text-center text-emerald-400 font-mono">WV-PASS</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Safety Note */}
        <div className="bg-slate-900 px-6 py-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>Please bring valid Govt Photo ID (Aadhaar/DL) at pickup point. Departure is punctual.</span>
        </div>

      </div>

      {onClose && (
        <div className="text-center pt-2">
          <button
            onClick={onClose}
            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-6 py-2.5 rounded-xl text-xs shadow-lg"
          >
            Done / Back to Home
          </button>
        </div>
      )}

    </div>
  );
};
