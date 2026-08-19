import React from 'react';
import { Compass, ShieldCheck, HeartHandshake, Phone, Mail, MapPin } from 'lucide-react';

interface FooterProps {
  onNavigate: (tab: 'home' | 'explore' | 'safety' | 'legal' | 'admin') => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center font-bold text-slate-950 shadow-lg">
                <Compass className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold font-display text-white">WanderVibe Agency</span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-md">
              WanderVibe is a licensed Social Travel Agency specializing in curated group expeditions. We organize destination transportation, Swiss alpine camps & resorts, day-by-day itineraries, and certified trip leadership.
            </p>

            <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-2xl text-xs space-y-1">
              <p className="font-bold text-emerald-400">Value Proposition:</p>
              <p className="italic text-slate-300">
                "Travel somewhere new. Meet people you've never met. Experience the journey together."
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3 text-xs">
            <h4 className="font-bold uppercase tracking-wider text-white text-xs">Agency Navigation</h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => onNavigate('home')} className="hover:text-emerald-400 transition-colors">
                  Home & Overview
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('explore')} className="hover:text-emerald-400 transition-colors">
                  Explore Upcoming Group Trips
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('legal')} className="hover:text-emerald-400 transition-colors font-bold text-emerald-400">
                  ⚖️ Refund & Razorpay Terms
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('safety')} className="hover:text-emerald-400 transition-colors">
                  Traveler Conduct & Safety Policy
                </button>
              </li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div className="space-y-3 text-xs">
            <h4 className="font-bold uppercase tracking-wider text-white text-xs">Agency Support Desk</h4>
            <div className="space-y-2 text-slate-400">
              <p className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-emerald-400" />
                <span>+91 63880 50042 (Harsh Pandey Owner Desk)</span>
              </p>
              <p className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-cyan-400" />
                <span>mynameisharshji@gmail.com</span>
              </p>
              <p className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <span>Sector 5, C-133, GIDA, Gorakhpur, UP - 273209</span>
              </p>
            </div>
          </div>

        </div>

        {/* Bottom Disclaimer & Copyright */}
        <div className="border-t border-slate-900 pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-4">
          <p>© 2026 WanderVibe Social Travel Agency (Prop. Harsh Pandey). Razorpay RBI Compliant Merchant.</p>
          <div className="flex space-x-4">
            <button onClick={() => onNavigate('legal')} className="hover:text-slate-400">Privacy Policy</button>
            <span>•</span>
            <button onClick={() => onNavigate('legal')} className="hover:text-slate-400 font-bold text-slate-400">Refund Policy</button>
            <span>•</span>
            <button onClick={() => onNavigate('legal')} className="hover:text-slate-400">Razorpay Merchant Disclosure</button>
          </div>
        </div>

      </div>
    </footer>
  );
};
