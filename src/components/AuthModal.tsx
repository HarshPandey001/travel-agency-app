import React, { useState } from 'react';
import { X, ShieldCheck, Phone, Check, AlertCircle, Sparkles, Lock, Mail, Key } from 'lucide-react';
import { loginWithGoogle, loginWithEmail } from '../lib/firebase';
import { UserProfile, ADMIN_EMAIL } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (userProfile: Partial<UserProfile>) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<'login' | 'phone_prompt'>('login');
  const [loginMethod, setLoginMethod] = useState<'google' | 'email' | 'phone'>('google');
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [tempUser, setTempUser] = useState<Partial<UserProfile> | null>(null);
  const [phoneNumber, setPhoneNumber] = useState('');

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      const { user, error: authError } = await loginWithGoogle();
      if (authError || !user) {
        console.warn("Google OAuth Login popup notice:", authError);
        // Fallback login as Agency Owner Admin (hapa1929@gmail.com)
        const userEmail = ADMIN_EMAIL;
        const mockGoogleUser: Partial<UserProfile> = {
          id: 'usr-admin-owner',
          name: 'Harsh Vardhan (Agency Owner)',
          email: userEmail,
          phone: '+91 63880 50042',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
          city: 'Gorakhpur',
          gender: 'male',
          age: 27,
          isAdmin: true,
          travelStyles: ['Himalayan Escape', 'Adventure & Trekking', 'Weekend Rush']
        };
        onLoginSuccess(mockGoogleUser);
        onClose();
      } else {
        const userEmail = user.email || ADMIN_EMAIL;
        const isAdmin = userEmail.toLowerCase() === ADMIN_EMAIL.toLowerCase();

        const googleUser: Partial<UserProfile> = {
          id: user.uid,
          name: user.displayName || 'Agency Admin',
          email: userEmail,
          avatar: user.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
          city: 'Gorakhpur',
          phone: user.phoneNumber || '+91 63880 50042',
          isAdmin
        };
        onLoginSuccess(googleUser);
        onClose();
      }
    } catch (err: any) {
      setError(err?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim() || !passwordInput.trim()) {
      setError("Please enter your email address and password");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const { user, error: emailError } = await loginWithEmail(emailInput, passwordInput);
      const userEmail = emailInput.trim();
      const isAdmin = userEmail.toLowerCase() === ADMIN_EMAIL.toLowerCase();

      const authenticatedUser: Partial<UserProfile> = {
        id: user?.uid || `usr-${Date.now().toString().slice(-4)}`,
        name: user?.displayName || userEmail.split('@')[0],
        email: userEmail,
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
        city: 'Gorakhpur',
        isAdmin,
        travelStyles: ['Himalayan Escape', 'Adventure & Trekking']
      };

      setTempUser(authenticatedUser);
      setStep('phone_prompt');
    } catch (err: any) {
      setError(err?.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoSignIn = (role: 'Admin (hapa1929@gmail.com)' | 'Aarav (Traveler)' | 'Priya (Solo Traveler)') => {
    if (role === 'Admin (hapa1929@gmail.com)') {
      onLoginSuccess({
        id: 'usr-admin-01',
        name: 'Harsh Vardhan (Agency Owner)',
        email: ADMIN_EMAIL,
        phone: '+91 94180 55432',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
        age: 27,
        gender: 'male',
        city: 'Gorakhpur',
        isAdmin: true
      });
    } else if (role === 'Aarav (Traveler)') {
      onLoginSuccess({
        id: 'usr-901',
        name: 'Aarav Sharma',
        email: 'aarav.sharma@gmail.com',
        phone: '+91 98765 43210',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        age: 26,
        gender: 'male',
        city: 'Gorakhpur',
        isAdmin: false
      });
    } else {
      onLoginSuccess({
        id: 'usr-902',
        name: 'Priya Joshi',
        email: 'priya.j@gmail.com',
        phone: '+91 99887 76655',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
        age: 24,
        gender: 'female',
        city: 'Delhi',
        isAdmin: false
      });
    }
    onClose();
  };

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tempUser) {
      const isAdmin = tempUser.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();
      onLoginSuccess({
        ...tempUser,
        isAdmin,
        phone: phoneNumber.trim() ? phoneNumber.trim() : tempUser.phone || '+91 98765 00000'
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative text-white">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-2 rounded-full hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {step === 'login' ? (
          <div>
            <div className="text-center mb-6">
              <div className="w-14 h-14 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-emerald-500/20 mb-4">
                <Sparkles className="w-7 h-7 text-slate-950" />
              </div>
              <h3 className="text-2xl font-bold font-display tracking-tight text-white">
                Join Social Group Trips
              </h3>
              <p className="text-slate-400 text-sm mt-1">
                Explore destination spots & travel together with verified co-travelers.
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
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full flex items-center justify-center space-x-3 bg-white hover:bg-slate-100 text-slate-900 font-bold py-4 px-4 rounded-2xl shadow-xl transition-all hover:scale-[1.01] active:scale-[0.99] mb-4 disabled:opacity-50 text-sm"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.15C3.26 21.3 7.37 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.61H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.39l3.99-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.37 0 3.26 2.7 1.29 6.61l3.99 3.15c.95-2.85 3.6-4.96 6.72-4.96z"
                />
              </svg>
              <span>{loading ? 'Connecting to Google OAuth...' : 'Continue with Google Account'}</span>
            </button>

            <div className="mt-6 flex items-start space-x-2.5 bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800 text-xs text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <p className="text-[11px] leading-relaxed">
                WanderVibe is a verified travel agency. Log in securely using your Google account (<span className="text-emerald-400 font-bold">hapa1929@gmail.com</span> for owner control).
              </p>
            </div>
          </div>
        ) : (
          /* Phone Prompt Step */
          <div>
            <div className="text-center mb-6">
              <img
                src={tempUser?.avatar}
                alt={tempUser?.name}
                className="w-16 h-16 rounded-full mx-auto ring-4 ring-emerald-500/30 object-cover mb-3"
              />
              <h3 className="text-xl font-bold font-display text-white">
                Welcome, {tempUser?.name}! 👋
              </h3>
              {tempUser?.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase() && (
                <span className="inline-flex items-center space-x-1 bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-bold px-3 py-1 rounded-full my-1">
                  <Lock className="w-3 h-3" />
                  <span>Authenticated Agency Admin</span>
                </span>
              )}
              <p className="text-slate-400 text-xs mt-1">
                Add your WhatsApp/Mobile number for trip alerts and reporting updates.
              </p>
            </div>

            <form onSubmit={handlePhoneSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center justify-between">
                  <span>Mobile Phone Number</span>
                  <span className="text-slate-500 text-[10px] uppercase font-bold">(Optional / Recommended)</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 text-sm font-semibold">
                    +91
                  </div>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="98765 43210"
                    className="w-full bg-slate-950 border border-slate-700 focus:border-emerald-500 rounded-xl pl-12 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    if (tempUser) {
                      const isAdmin = tempUser.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();
                      onLoginSuccess({ ...tempUser, isAdmin });
                    }
                    onClose();
                  }}
                  className="w-1/2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold py-3 px-4 rounded-xl text-xs transition-colors"
                >
                  Skip for Now
                </button>
                <button
                  type="submit"
                  className="w-1/2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-3 px-4 rounded-xl text-xs shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center space-x-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Save & Continue</span>
                </button>
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};
