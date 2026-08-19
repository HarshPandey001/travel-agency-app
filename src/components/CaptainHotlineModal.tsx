import React from 'react';
import { Phone, ShieldCheck, AlertCircle, X, MapPin, CheckCircle2, User, Clock, Heart } from 'lucide-react';

interface CaptainHotlineModalProps {
  onClose: () => void;
}

export const CaptainHotlineModal: React.FC<CaptainHotlineModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative text-white my-8 space-y-6">
        
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-2 rounded-full hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-emerald-500/10 border-2 border-emerald-500/30 text-emerald-400 rounded-3xl mx-auto flex items-center justify-center shadow-xl shadow-emerald-500/10">
            <Phone className="w-8 h-8 animate-bounce text-emerald-400" />
          </div>
          <span className="bg-emerald-500/10 text-emerald-400 text-xs font-bold uppercase tracking-widest px-3.5 py-1 rounded-full border border-emerald-500/20 inline-block">
            24/7 Agency Safety Hotline
          </span>
          <h3 className="text-2xl font-bold font-display text-white">
            Trip Captain & Emergency Helpline
          </h3>
          <p className="text-xs text-slate-400">
            Have questions about pickup points, luggage, or safety? Speak directly with your certified agency Trip Captain!
          </p>
        </div>

        {/* Lead Agency Owner & Director Card */}
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
          <div className="flex items-center space-x-3">
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80"
              alt="Harsh Pandey"
              className="w-12 h-12 rounded-2xl object-cover ring-2 ring-emerald-500/40"
            />
            <div>
              <h4 className="text-sm font-bold text-white">Harsh Pandey</h4>
              <p className="text-[11px] text-emerald-400 font-semibold">Agency Founder & Expedition Lead</p>
              <p className="text-[10px] text-slate-400">Sector 5, C-133, GIDA, Gorakhpur HQ</p>
            </div>
          </div>

          <a
            href="tel:+916388050042"
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-3 rounded-xl text-xs flex items-center justify-center space-x-2 shadow-lg shadow-emerald-500/20 transition-all hover:scale-105"
          >
            <Phone className="w-4 h-4 fill-slate-950" />
            <span>Call Harsh Pandey: +91 63880 50042</span>
          </a>
        </div>

        {/* Emergency Assistance Directory */}
        <div className="space-y-2 text-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
            Emergency Services & Hub Desk
          </span>

          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <a href="tel:+919816012345" className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-slate-300 hover:text-white flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-cyan-400 flex-shrink-0" />
              <span>Gorakhpur Hub Desk</span>
            </a>
            <a href="tel:+919816067890" className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-slate-300 hover:text-white flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-cyan-400 flex-shrink-0" />
              <span>Lucknow Hub Desk</span>
            </a>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-2.5 rounded-xl text-xs"
        >
          Close Hotline Modal
        </button>

      </div>
    </div>
  );
};
