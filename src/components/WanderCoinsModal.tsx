import React, { useState } from 'react';
import { Sparkles, Coins, Gift, Share2, Copy, Check, X, ArrowRight, ShieldCheck } from 'lucide-react';
import { UserProfile } from '../types';

interface WanderCoinsModalProps {
  currentUser: UserProfile | null;
  onClose: () => void;
}

export const WanderCoinsModal: React.FC<WanderCoinsModalProps> = ({ currentUser, onClose }) => {
  const [copied, setCopied] = useState(false);
  const referralCode = currentUser ? `${currentUser.name.split(' ')[0].toUpperCase()}-VIBE-2026` : 'WANDERVIBE-500';

  const handleCopyCode = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative text-white my-8 space-y-6">
        
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-2 rounded-full hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-amber-500/10 border-2 border-amber-500/30 text-amber-400 rounded-3xl mx-auto flex items-center justify-center shadow-xl shadow-amber-500/10">
            <Coins className="w-8 h-8 animate-bounce" />
          </div>
          <span className="bg-amber-400/10 text-amber-300 text-xs font-bold uppercase tracking-widest px-3.5 py-1 rounded-full border border-amber-400/20 inline-block">
            WanderVibe Social Rewards
          </span>
          <h3 className="text-2xl font-bold font-display text-white">
            WanderCoins & Referrals
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Earn 🪙 500 WanderCoins (₹500 value) on every trip completed or when inviting travel buddies!
          </p>
        </div>

        {/* User Balance Box */}
        <div className="bg-gradient-to-br from-amber-950/40 via-slate-950 to-slate-950 p-5 rounded-2xl border border-amber-500/30 text-center space-y-1">
          <span className="text-[11px] text-amber-400 uppercase font-bold tracking-wider">Your Redeemable Balance</span>
          <div className="text-3xl font-black font-display text-amber-400 flex items-center justify-center space-x-2">
            <span>🪙 500 Coins</span>
            <span className="text-sm text-slate-400 font-sans font-normal">(= ₹500 Off)</span>
          </div>
          <p className="text-[10px] text-slate-500">Auto-applied at Razorpay / UPI checkout on your next booking!</p>
        </div>

        {/* Invite Friends Section */}
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3 text-xs">
          <div className="flex items-center space-x-2 text-white font-bold">
            <Gift className="w-4 h-4 text-emerald-400" />
            <span>Invite Friends & Share Referral Pass</span>
          </div>
          <p className="text-slate-400 text-[11px] leading-relaxed">
            Share your unique code with friends. They get ₹500 off on their first social group trip, and you get 500 WanderCoins when they board!
          </p>

          <div className="flex items-center space-x-2 pt-1">
            <div className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-amber-300 font-bold">
              {referralCode}
            </div>
            <button
              onClick={handleCopyCode}
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center space-x-1.5 shadow-md"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy Code'}</span>
            </button>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold py-3 rounded-2xl text-xs"
        >
          Got it, Close
        </button>

      </div>
    </div>
  );
};
