import React, { useState } from 'react';
import { X, Sparkles, AlertCircle, Mail, User, ShieldCheck, ArrowRight } from 'lucide-react';
import { loginWithGoogle } from '../lib/firebase';
import { UserProfile, ADMIN_EMAIL } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (userProfile: Partial<UserProfile>) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emailInput, setEmailInput] = useState('');
  const [nameInput, setNameInput] = useState('');

  if (!isOpen) return null;

  // Real Email Submit Handler (If email == hapa1929@gmail.com -> Admin, else Client)
  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = emailInput.trim().toLowerCase();
    
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    const isAdmin = cleanEmail === ADMIN_EMAIL.toLowerCase();
    const userName = nameInput.trim() 
      ? nameInput.trim() 
      : (isAdmin ? 'Harsh Vardhan (Admin)' : cleanEmail.split('@')[0]);

    const userProfile: Partial<UserProfile> = {
      id: isAdmin ? 'usr-admin-owner' : `usr-${Date.now().toString().slice(-5)}`,
      name: userName,
      email: cleanEmail,
      avatar: isAdmin 
        ? 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80'
        : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      city: 'Gorakhpur',
      gender: 'male',
      age: isAdmin ? 27 : 24,
      isAdmin,
      travelStyles: ['Himalayan Escape', 'Adventure & Trekking']
    };

    onLoginSuccess(userProfile);
    onClose();
  };

  // Google OAuth Handler
  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      const { user, error: authError } = await loginWithGoogle();
      if (authError || !user) {
        // If Google OAuth domain is unauthorized in Firebase Console, prompt to use email directly
        setError('Google Auth unavailable on this domain. Enter your email below to continue.');
        return;
      }

      const userEmail = (user.email || '').toLowerCase();
      const isAdmin = userEmail === ADMIN_EMAIL.toLowerCase();

      const googleUser: Partial<UserProfile> = {
        id: user.uid,
        name: user.displayName || userEmail.split('@')[0] || (isAdmin ? 'Harsh (Admin)' : 'Traveler'),
        email: userEmail,
        avatar: user.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        city: '',
        phone: user.phoneNumber || '',
        isAdmin
      };
      onLoginSuccess(googleUser);
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Login failed. Please enter your email below.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative text-white">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-2 rounded-full hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div>
          <div className="text-center mb-6">
            <div className="w-14 h-14 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-emerald-500/20 mb-4">
              <Sparkles className="w-7 h-7 text-slate-950" />
            </div>
            <h3 className="text-2xl font-bold font-display tracking-tight text-white">
              Log in to WanderVibe
            </h3>
            <p className="text-slate-400 text-xs sm:text-sm mt-1">
              Admin & Traveler access portal
            </p>
          </div>

          {error && (
            <div className="mb-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs p-3 rounded-xl flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Google 1-Click Login Button */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center space-x-3 bg-white hover:bg-slate-100 text-slate-900 font-bold py-3.5 px-4 rounded-2xl shadow-xl transition-all hover:scale-[1.01] active:scale-[0.99] mb-4 disabled:opacity-50 text-sm cursor-pointer"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z" />
              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.15C3.26 21.3 7.37 24 12 24z" />
              <path fill="#FBBC05" d="M5.28 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.61H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.39l3.99-3.15z" />
              <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.37 0 3.26 2.7 1.29 6.61l3.99 3.15c.95-2.85 3.6-4.96 6.72-4.96z" />
            </svg>
            <span>{loading ? 'Connecting...' : 'Continue with Google Account'}</span>
          </button>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-800"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-slate-900 px-3 text-slate-500 font-semibold tracking-wider">or sign in with email</span>
            </div>
          </div>

          {/* Direct Email Form */}
          <form onSubmit={handleEmailSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Email Address <span className="text-emerald-400">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="e.g. hapa1929@gmail.com or user@gmail.com"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Your Name <span className="text-slate-500 font-normal">(Optional)</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  placeholder="e.g. Harsh / Priya / Rahul"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold py-3 px-4 rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center space-x-2 text-sm cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
            >
              <span>Continue & Log In</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-4 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-[11px] text-slate-400 text-center flex items-center justify-center space-x-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
            <span><code>hapa1929@gmail.com</code> unlocks Agency Admin Panel automatically.</span>
          </div>

        </div>
      </div>
    </div>
  );
};
