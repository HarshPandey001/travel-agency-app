import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  CheckCircle2, 
  AlertCircle, 
  CreditCard, 
  ArrowRight, 
  ExternalLink, 
  Zap, 
  RefreshCw,
  Clock,
  User,
  Mail,
  Phone
} from 'lucide-react';

interface GatewaySession {
  sessionId: string;
  orderId: string;
  amount: number;
  currency: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  purpose: string;
  status: 'PENDING' | 'PAID' | 'FAILED';
  razorpayKeyId: string;
  cancelUrl?: string;
  createdAt: string;
}

interface GatewayCheckoutProps {
  sessionId: string;
}

export const GatewayCheckout: React.FC<GatewayCheckoutProps> = ({ sessionId }) => {
  const [session, setSession] = useState<GatewaySession | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(3);

  // 1. Fetch Session from Backend
  useEffect(() => {
    const fetchSession = async () => {
      try {
        setLoading(true);
        const baseUrl = (import.meta as any).env?.VITE_BACKEND_URL || 
          (typeof window !== 'undefined' && window.location.hostname === 'localhost' 
            ? 'http://localhost:5000' 
            : 'https://wandervibe-email-service.onrender.com');

        const response = await fetch(`${baseUrl}/api/gateway/session/${sessionId}`);
        const data = await response.json();

        if (response.ok && data.success && data.session) {
          setSession(data.session);
          if (data.session.status === 'PAID') {
            setPaymentSuccess(true);
          }
        } else {
          setError(data.error || 'Payment session is invalid or has expired.');
        }
      } catch (err: any) {
        setError(err.message || 'Could not connect to payment gateway.');
      } finally {
        setLoading(false);
      }
    };

    if (sessionId) {
      fetchSession();
    } else {
      setError('No payment session ID provided.');
      setLoading(false);
    }
  }, [sessionId]);

  // 2. Load Razorpay SDK dynamically
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      try {
        document.body.removeChild(script);
      } catch (e) {}
    };
  }, []);

  // 3. Launch Razorpay Payment
  const handlePayNow = () => {
    if (!session) return;
    setIsProcessing(true);

    const options = {
      key: session.razorpayKeyId || 'rzp_live_TSWw0AVQMFTDTK',
      amount: session.amount * 100, // in paise
      currency: session.currency || 'INR',
      name: "Secure Payment Gateway",
      description: session.purpose || `Order #${session.orderId}`,
      image: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=200&q=80",
      handler: async function (response: any) {
        console.log("[GATEWAY RAZORPAY RESPONSE]", response);
        await verifyPayment(response);
      },
      prefill: {
        name: session.customerName || '',
        email: session.customerEmail || '',
        contact: session.customerPhone || ''
      },
      notes: {
        gateway_session_id: session.sessionId,
        merchant_order_id: session.orderId
      },
      theme: {
        color: "#10b981",
        backdrop_color: "rgba(15, 23, 42, 0.95)"
      },
      modal: {
        ondismiss: function () {
          setIsProcessing(false);
        }
      }
    };

    if ((window as any).Razorpay) {
      try {
        const rzp = new (window as any).Razorpay(options);
        rzp.open();
      } catch (err: any) {
        console.error("Razorpay open error:", err);
        setIsProcessing(false);
        alert("Could not open Razorpay checkout: " + err.message);
      }
    } else {
      setIsProcessing(false);
      alert("Razorpay checkout SDK is loading. Please try again in 2 seconds.");
    }
  };

  // 4. Verify Payment with Gateway Backend
  const verifyPayment = async (razorpayResponse: any) => {
    try {
      const baseUrl = (import.meta as any).env?.VITE_BACKEND_URL || 
        (typeof window !== 'undefined' && window.location.hostname === 'localhost' 
          ? 'http://localhost:5000' 
          : 'https://wandervibe-email-service.onrender.com');

      const res = await fetch(`${baseUrl}/api/gateway/verify-payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          razorpay_payment_id: razorpayResponse.razorpay_payment_id,
          razorpay_order_id: razorpayResponse.razorpay_order_id,
          razorpay_signature: razorpayResponse.razorpay_signature
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setPaymentSuccess(true);
        if (data.redirect_url) {
          setRedirectUrl(data.redirect_url);
        }
      } else {
        alert("Payment verification failed: " + (data.error || 'Unknown error'));
      }
    } catch (err: any) {
      console.error("Verification error:", err);
      alert("Error verifying payment with gateway: " + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  // 5. Handle Auto-Redirect Countdown
  useEffect(() => {
    if (paymentSuccess && redirectUrl) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            window.location.href = redirectUrl;
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [paymentSuccess, redirectUrl]);

  // Loading Screen
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 text-white">
        <div className="w-14 h-14 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin mb-4"></div>
        <p className="text-sm font-semibold text-slate-300">Initializing Secure Checkout Session...</p>
        <span className="text-xs text-slate-500 mt-1">256-Bit SSL Encrypted Channel</span>
      </div>
    );
  }

  // Error Screen
  if (error || !session) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 max-w-md w-full text-center space-y-4 shadow-2xl">
          <div className="w-16 h-16 bg-rose-500/10 border border-rose-500/30 rounded-2xl flex items-center justify-center mx-auto text-rose-400">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-white">Invalid Checkout Session</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            {error || 'This payment session does not exist or has expired. Please initiate payment again from the merchant website.'}
          </p>
          <div className="pt-2">
            <button
              onClick={() => window.history.back()}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-6 py-2.5 rounded-xl transition-colors"
            >
              ← Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  // SUCCESS SCREEN (with auto-redirect)
  if (paymentSuccess) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="bg-slate-900 border border-emerald-500/40 rounded-3xl p-8 max-w-md w-full text-center space-y-6 shadow-2xl shadow-emerald-500/10">
          <div className="w-20 h-20 bg-emerald-500/20 border-2 border-emerald-500 rounded-full flex items-center justify-center mx-auto text-emerald-400 animate-bounce">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-1">
            <span className="text-[10px] uppercase font-black tracking-widest text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              PAYMENT VERIFIED & CONFIRMED
            </span>
            <h2 className="text-2xl font-black text-white pt-2">₹{session.amount.toLocaleString('en-IN')} Paid</h2>
            <p className="text-xs text-slate-400">Order Reference: <strong className="text-white">{session.orderId}</strong></p>
          </div>

          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-left text-xs space-y-2">
            <div className="flex justify-between text-slate-400">
              <span>Item / Purpose:</span>
              <span className="text-white font-semibold">{session.purpose}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Customer:</span>
              <span className="text-white font-semibold">{session.customerName || 'Customer'}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Status:</span>
              <span className="text-emerald-400 font-bold">PAID (Complete)</span>
            </div>
          </div>

          {redirectUrl ? (
            <div className="space-y-3 pt-2">
              <p className="text-xs text-slate-300 font-medium flex items-center justify-center space-x-1.5">
                <Clock className="w-4 h-4 text-emerald-400 animate-spin" />
                <span>Redirecting back to merchant in <strong>{countdown}s</strong>...</span>
              </p>
              <a
                href={redirectUrl}
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-3.5 rounded-xl text-xs flex items-center justify-center space-x-2 transition-all hover:scale-105 shadow-lg shadow-emerald-500/20 block cursor-pointer"
              >
                <span>Click here if not redirected automatically</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          ) : (
            <div className="text-xs text-slate-400 pt-2">
              You can now safely close this window.
            </div>
          )}
        </div>
      </div>
    );
  }

  // MAIN HOSTED CHECKOUT SCREEN
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-between py-8 px-4 text-slate-100 font-sans">
      
      {/* Top Header */}
      <header className="max-w-xl mx-auto w-full flex items-center justify-between pb-6">
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 bg-emerald-500 rounded-xl flex items-center justify-center font-black text-slate-950 text-base shadow-lg shadow-emerald-500/20">
            <Zap className="w-5 h-5 text-slate-950" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-white tracking-wide">Universal Gateway Proxy</h1>
            <p className="text-[10px] text-slate-400">Razorpay Encrypted Switch</p>
          </div>
        </div>

        <div className="flex items-center space-x-1.5 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-full text-[11px] text-emerald-400 font-semibold">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>256-Bit SSL Secured</span>
        </div>
      </header>

      {/* Main Checkout Card */}
      <main className="max-w-xl mx-auto w-full">
        <div className="bg-slate-900 border border-slate-800/80 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl shadow-slate-950 relative overflow-hidden">
          
          {/* Subtle Top Accent Glow */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500"></div>

          {/* Amount and Order Banner */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                HOSTED CHECKOUT
              </span>
              <h2 className="text-xl font-bold text-white mt-1">
                {session.purpose || 'Payment Request'}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Order ID: <span className="font-mono text-slate-300">{session.orderId}</span>
              </p>
            </div>

            <div className="text-left sm:text-right bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800 w-full sm:w-auto">
              <span className="text-[10px] text-slate-400 font-semibold uppercase block">Amount Due</span>
              <div className="text-3xl font-black text-emerald-400 font-display">
                ₹{session.amount.toLocaleString('en-IN')}
              </div>
            </div>
          </div>

          {/* Customer Summary (if provided) */}
          {(session.customerName || session.customerEmail || session.customerPhone) && (
            <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 space-y-2">
              <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 block mb-1">
                Billing Details
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {session.customerName && (
                  <div className="flex items-center space-x-2 text-slate-300">
                    <User className="w-3.5 h-3.5 text-slate-500" />
                    <span>{session.customerName}</span>
                  </div>
                )}
                {session.customerEmail && (
                  <div className="flex items-center space-x-2 text-slate-300">
                    <Mail className="w-3.5 h-3.5 text-slate-500" />
                    <span>{session.customerEmail}</span>
                  </div>
                )}
                {session.customerPhone && (
                  <div className="flex items-center space-x-2 text-slate-300">
                    <Phone className="w-3.5 h-3.5 text-slate-500" />
                    <span>{session.customerPhone}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Payment Methods Supported */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-300 font-semibold">
              <span>Supported Instant Payment Modes:</span>
              <span className="text-emerald-400 font-bold">0% Convenience Fee</span>
            </div>

            <div className="grid grid-cols-3 gap-2.5 text-center text-[11px] font-semibold text-slate-300">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex flex-col items-center justify-center space-y-1">
                <span className="text-emerald-400 font-bold">📱 UPI</span>
                <span className="text-[9px] text-slate-400">GPay, PhonePe, Paytm</span>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex flex-col items-center justify-center space-y-1">
                <span className="text-cyan-400 font-bold">💳 Cards</span>
                <span className="text-[9px] text-slate-400">Debit / Credit Cards</span>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex flex-col items-center justify-center space-y-1">
                <span className="text-indigo-400 font-bold">🏦 Banking</span>
                <span className="text-[9px] text-slate-400">Netbanking & Wallets</span>
              </div>
            </div>
          </div>

          {/* Pay Button */}
          <div className="space-y-3 pt-2">
            <button
              onClick={handlePayNow}
              disabled={isProcessing}
              className="w-full bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black py-4 rounded-2xl text-base shadow-xl shadow-emerald-500/25 transition-all hover:scale-[1.02] flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
            >
              <Lock className="w-5 h-5 text-slate-950" />
              <span>
                {isProcessing
                  ? 'Connecting to Razorpay...'
                  : `Proceed to Pay ₹${session.amount.toLocaleString('en-IN')}`}
              </span>
            </button>

            {session.cancelUrl && (
              <div className="text-center">
                <a
                  href={session.cancelUrl}
                  className="text-xs text-slate-500 hover:text-slate-400 underline transition-colors"
                >
                  Cancel & Return to Merchant Website
                </a>
              </div>
            )}
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-xl mx-auto w-full text-center text-[11px] text-slate-500 pt-6 space-y-1">
        <p>Powered by Universal Hosted Payment Gateway Proxy • 100% Encrypted via Razorpay Live</p>
        <p>Merchant Signature Verified • Session: <span className="font-mono text-slate-400">{session.sessionId}</span></p>
      </footer>

    </div>
  );
};
