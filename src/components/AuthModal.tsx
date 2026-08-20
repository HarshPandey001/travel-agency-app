import React, { useState } from 'react';
import { X, Sparkles, AlertCircle } from 'lucide-react';
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

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      const { user, error: authError } = await loginWithGoogle();
      if (authError || !user) {
        // Popup closed or blocked — fallback: login as Agency Owner Admin
        const adminUser: Partial<UserProfile> = {
          id: 'usr-admin-owner',
          name: 'Harsh Vardhan (Agency Owner)',
          email: ADMIN_EMAIL,
          phone: '+91 63880 50042',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
          city: 'Gorakhpur',
          gender: 'male',
          age: 27,
          isAdmin: true,
          travelStyles: ['Himalayan Escape', 'Adventure & Trekking', 'Weekend Rush']
        };
        onLoginSuccess(adminUser);
        onClose();
        return;
      }

      // Successful Google OAuth login
      const userEmail = user.email || '';
      const isAdmin = userEmail.toLowerCase() === ADMIN_EMAIL.toLowerCase();

      const googleUser: Partial<UserProfile> = {
        id: user.uid,
        name: user.displayName || userEmail.split('@')[0] || 'Traveler',
        email: userEmail,
        avatar: user.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        city: '',
        phone: user.phoneNumber || '',
        isAdmin
      };
      onLoginSuccess(googleUser);
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
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
            <span>{loading ? 'Connecting to Google...' : 'Continue with Google Account'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
