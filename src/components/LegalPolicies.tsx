import React, { useState } from 'react';
import { ShieldCheck, FileText, Lock, AlertCircle, CheckCircle2, Phone, Mail, MapPin, Scale, XCircle } from 'lucide-react';
import { ADMIN_EMAIL } from '../types';

export const LegalPolicies: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'refund' | 'privacy' | 'terms' | 'razorpay'>('refund');

  return (
    <div className="space-y-8 pb-20 text-white max-w-5xl mx-auto">
      
      {/* Page Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 text-center shadow-2xl space-y-3">
        <div className="inline-flex items-center space-x-2 bg-emerald-500/10 text-emerald-400 px-4 py-1.5 rounded-full text-xs font-bold border border-emerald-500/20">
          <Scale className="w-4 h-4 text-emerald-400" />
          <span>Razorpay Merchant Compliance & Agency Owner Legal Protections</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold font-display text-white">
          Strict Non-Refundable Policy & Merchant Terms
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Official legal guidelines for WanderVibe Social Travel Agency operations, payment processing via Razorpay, seat reservation rules, and traveler safety standards.
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 justify-center border-b border-slate-800 pb-4">
        {[
          { id: 'refund', label: '🚫 Strict Non-Refundable Policy' },
          { id: 'terms', label: '📜 Terms of Service & Agency Rules' },
          { id: 'privacy', label: '🔒 Data Privacy Policy (IT Act 2000)' },
          { id: 'razorpay', label: '💳 Razorpay Merchant Disclosure' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSection(tab.id as any)}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all ${
              activeSection === tab.id
                ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* SECTION 1: STRICT NON-REFUNDABLE POLICY */}
      {activeSection === 'refund' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl text-xs leading-relaxed text-slate-300">
          <div className="flex items-center space-x-3 border-b border-slate-800 pb-4">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center justify-center font-bold">
              🚫
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Strict Non-Refundable Seat Booking Policy</h2>
              <p className="text-[11px] text-slate-400">Owner-Protective Rules: 0% Cash or Voucher refund on user-initiated cancellations.</p>
            </div>
          </div>

          {/* Critical Highlight Box */}
          <div className="bg-gradient-to-r from-rose-950/80 via-slate-950 to-slate-950 p-5 rounded-2xl border-2 border-rose-500/50 text-slate-200 space-y-3 shadow-xl">
            <div className="flex items-center space-x-2 font-black text-rose-400 text-sm uppercase tracking-wider">
              <XCircle className="w-5 h-5 flex-shrink-0 text-rose-400" />
              <span>STRICT NO REFUND POLICY (USER CANCELLATIONS = 0% REFUND)</span>
            </div>
            <p className="text-xs leading-relaxed text-slate-300">
              All seat reservations, tickets, and booking advances made on WanderVibe Agency platform are <strong>STRICTLY NON-REFUNDABLE AND NON-TRANSFERABLE</strong> for any user-initiated cancellations, personal emergencies, change of plans, or missed vehicle reporting times.
            </p>
          </div>

          <div className="space-y-4 pt-2">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider text-emerald-400">
              1. The ONLY Situation Where Refunds Are Issued: Agency-Initiated Cancelation
            </h3>
            <p className="bg-slate-950 p-4 rounded-2xl border border-emerald-500/40 text-emerald-300 font-medium">
              ✓ <strong>100% Full Refund:</strong> Full payment refund (without any deductions) will be processed ONLY AND EXCLUSIVELY if WanderVibe Agency officially drops or cancels the trip due to severe weather, landslide road closures, or agency logistics cancellation.
            </p>

            <h3 className="text-sm font-bold text-white uppercase tracking-wider text-rose-400 pt-2">
              2. User Cancellations Breakdown (0% Cash / 0% Voucher Refund)
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase text-[10px]">
                    <th className="p-3">Cancellation Trigger</th>
                    <th className="p-3">Eligible Refund Amount</th>
                    <th className="p-3">Legal & Operational Rationale</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  <tr>
                    <td className="p-3 font-semibold text-white">Passenger Cancels (Any Reason)</td>
                    <td className="p-3 font-bold text-rose-400">0% Refund (Strictly Non-Refundable)</td>
                    <td className="p-3">Covers non-refundable AC Traveller vehicle advance, driver fees, and hotel blockings.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-white">Missed Vehicle Reporting Time</td>
                    <td className="p-3 font-bold text-rose-400">0% Refund (No-Show Clause)</td>
                    <td className="p-3">Departure vehicle will not wait past scheduled hub reporting times.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-emerald-400 font-bold">Agency Drops / Cancels Trip</td>
                    <td className="p-3 font-bold text-emerald-400">100% Full Cash Refund</td>
                    <td className="p-3">Credited back via Razorpay to original payment account within 5-7 RBI business days.</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-[11px] text-slate-400">
              By checking the mandatory agreement box before initiating Razorpay checkout, the passenger explicitly accepts and agrees to these strict non-refundable terms.
            </p>
          </div>
        </div>
      )}

      {/* SECTION 2: TERMS OF SERVICE */}
      {activeSection === 'terms' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl text-xs leading-relaxed text-slate-300">
          <div className="flex items-center space-x-3 border-b border-slate-800 pb-4">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center font-bold">
              📜
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Terms of Service & Code of Conduct</h2>
              <p className="text-[11px] text-slate-400">Rules governing social travel behavior, boarding hubs, and trip captain authority.</p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white text-cyan-400">1. Social Travel & 1:1 Group Dynamic Standard</h3>
            <p>
              WanderVibe operates exclusively as a legitimate, curated social travel agency organizing group road trips for independent individuals and friends. The agency facilitates transport, accommodation, itineraries, and group activities. Personal interactions between participants are entirely independent of the agency. Zero harassment, misconduct, or disruptive behavior is tolerated.
            </p>

            <h3 className="text-sm font-bold text-white text-cyan-400">2. Mandatory Identification & Punctuality</h3>
            <p>
              All passengers must present a government-issued photo ID (Aadhaar / Voter ID / Passport) at the starting departure hub (Gorakhpur, Lucknow, or Delhi). Reporting times specified on ticket vouchers are strictly enforced to maintain vehicle itineraries.
            </p>
          </div>
        </div>
      )}

      {/* SECTION 3: DATA PRIVACY POLICY */}
      {activeSection === 'privacy' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl text-xs leading-relaxed text-slate-300">
          <div className="flex items-center space-x-3 border-b border-slate-800 pb-4">
            <div className="w-10 h-10 rounded-2xl bg-teal-500/10 text-teal-400 border border-teal-500/20 flex items-center justify-center font-bold">
              🔒
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Data Privacy Policy (IT Act 2000 Compliant)</h2>
              <p className="text-[11px] text-slate-400">How we collect, protect, and process traveler data under Indian cyber laws.</p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white text-teal-400">1. Information Collection & Usage</h3>
            <p>
              We collect traveler names, mobile numbers, emergency contact details, age, and dietary preferences solely for trip coordination, state transit permits, hotel check-ins, and safety notifications.
            </p>

            <h3 className="text-sm font-bold text-white text-teal-400">2. Data Security & Third-Party Sharing</h3>
            <p>
              Traveler phone numbers and personal contact details are NEVER sold, rented, or publicly disclosed. Payment transactions are processed through 256-bit SSL encrypted channels via Razorpay Financial Software Services.
            </p>
          </div>
        </div>
      )}

      {/* SECTION 4: RAZORPAY MERCHANT DISCLOSURE */}
      {activeSection === 'razorpay' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl text-xs leading-relaxed text-slate-300">
          <div className="flex items-center space-x-3 border-b border-slate-800 pb-4">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center font-bold">
              💳
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Razorpay Merchant Official Disclosure</h2>
              <p className="text-[11px] text-slate-400">Official business entity information published as required by Razorpay Payment Terms.</p>
            </div>
          </div>

          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <span className="text-slate-400 font-bold block text-[11px]">Registered Merchant Entity & Proprietor:</span>
                <span className="text-white font-bold text-sm">Harsh Pandey (WanderVibe Social Travel Agency)</span>
              </div>
              <div>
                <span className="text-slate-400 font-bold block text-[11px]">Registered Headquarter Address:</span>
                <span className="text-white font-semibold text-xs">Sector 5, C-133, GIDA, Gorakhpur, Uttar Pradesh - 273209</span>
              </div>
              <div>
                <span className="text-slate-400 font-bold block text-[11px]">Authorized Owner Email:</span>
                <span className="text-amber-400 font-mono font-bold text-xs">{ADMIN_EMAIL}</span>
              </div>
              <div>
                <span className="text-slate-400 font-bold block text-[11px]">Official Owner Helpline / WhatsApp:</span>
                <span className="text-emerald-400 font-bold text-xs">+91 63880 50042 (Harsh Pandey)</span>
              </div>
            </div>
          </div>

          <p className="text-[11px] text-slate-400">
            All online card, UPI, and Netbanking transactions are acquired and settled securely via Razorpay Software Private Limited under RBI Payment Aggregator Guidelines.
          </p>
        </div>
      )}

    </div>
  );
};
