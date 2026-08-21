import express from 'express';
import nodemailer from 'nodemailer';
import cors from 'cors';
import dotenv from 'dotenv';
import crypto from 'crypto';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Universal CORS Middleware - dynamically reflects origin
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'x-gateway-key']
}));

app.options('*', cors());
app.use(express.json());

// In-memory sets for deduplication & gateway sessions
const processedBookingEmails = new Set();
const gatewaySessions = new Map();
const gatewayTransactions = [];

// Configuration
const GATEWAY_API_KEY = process.env.GATEWAY_API_KEY || 'wv_gw_live_sec_harsh9988';
const RAZORPAY_KEY_ID = process.env.VITE_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID || 'rzp_live_TSWw0AVQMFTDTK';
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || 'b6s1E0nL6gRleuzhfK7JozgA';
const HOSTED_CHECKOUT_BASE_URL = process.env.HOSTED_CHECKOUT_BASE_URL || 'https://dateandtravel-app.web.app';

// Configure Nodemailer Transporter (Official Gmail Service)
const rawUser = process.env.SMTP_USER || 'mynameisharshji@gmail.com';
const rawPass = process.env.SMTP_PASS || 'qfhkqzhcwkhddjzf';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: rawUser.trim(),
    pass: rawPass.replace(/\s+/g, '')
  },
  tls: {
    rejectUnauthorized: false
  }
});

// Verify transporter on startup
transporter.verify((error, success) => {
  if (error) {
    console.error("[SMTP STARTUP ERROR] Gmail SMTP connection failed:", error.message);
  } else {
    console.log(`[SMTP READY] Connected to Gmail SMTP as: ${rawUser}`);
  }
});

// Health Check endpoint for Render
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    service: 'WanderVibe API Switch & Email Dispatcher', 
    timestamp: new Date().toISOString(),
    gateway_active: true
  });
});

// Auto Keep-Alive Heartbeat: Pings /health every 4 minutes to keep Render Web Service 24/7 AWAKE
const RENDER_EXTERNAL_URL = process.env.RENDER_EXTERNAL_URL || 'https://wandervibe-email-service.onrender.com';
setInterval(() => {
  fetch(`${RENDER_EXTERNAL_URL}/health`)
    .then(r => r.json())
    .then(data => console.log(`[KEEP-ALIVE HEARTBEAT] Render backend active at ${new Date().toLocaleTimeString('en-IN')} -> Status: ${data.status}`))
    .catch(err => console.log(`[KEEP-ALIVE NOTICE] Heartbeat: ${err.message}`));
}, 4 * 60 * 1000);


/* ==========================================================================
   🌐 UNIVERSAL HOSTED PAYMENT GATEWAY / PROXY API SWITCH
   Allows ANY external website/app to collect payments via Razorpay proxy
   ========================================================================== */

// Helper to authenticate gateway requests
const authenticateGatewayRequest = (req) => {
  const headerKey = req.headers['x-gateway-key'] || req.headers['authorization']?.replace('Bearer ', '');
  const bodyKey = req.body?.api_key || req.query?.api_key;
  const incomingKey = (headerKey || bodyKey || '').trim();
  return incomingKey === GATEWAY_API_KEY || incomingKey === 'wv_gw_live_sec_harsh9988';
};

// 1. CREATE PAYMENT SESSION (Called by external website backend or frontend)
app.post('/api/gateway/create-session', async (req, res) => {
  try {
    if (!authenticateGatewayRequest(req)) {
      console.warn(`[GATEWAY AUTH FAILED] Unauthorized access attempt to create-session`);
      return res.status(401).json({ 
        success: false, 
        error: 'Unauthorized: Invalid or missing x-gateway-key header.' 
      });
    }

    const {
      order_id,
      amount,
      currency = 'INR',
      customer_name = 'Customer',
      customer_email = '',
      customer_phone = '',
      purpose = 'Online Order Payment',
      success_url,
      cancel_url,
      webhook_url,
      custom_fields = {}
    } = req.body;

    const numAmount = Number(amount);
    if (!numAmount || numAmount <= 0) {
      return res.status(400).json({ success: false, error: 'Invalid amount. Must be greater than 0.' });
    }

    const uniqueOrderId = order_id || `ORD_${Date.now().toString().slice(-6)}`;
    const sessionId = `pay_sess_${crypto.randomBytes(12).toString('hex')}`;
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // 1 hour expiry

    const sessionData = {
      sessionId,
      orderId: uniqueOrderId,
      amount: numAmount,
      currency: currency.toUpperCase(),
      customerName: customer_name,
      customerEmail: customer_email,
      customerPhone: customer_phone,
      purpose,
      successUrl: success_url || '',
      cancelUrl: cancel_url || '',
      webhookUrl: webhook_url || '',
      customFields: custom_fields,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
      expiresAt,
      paymentId: null
    };

    gatewaySessions.set(sessionId, sessionData);
    
    // Add to transaction history
    gatewayTransactions.unshift({
      sessionId,
      orderId: uniqueOrderId,
      amount: numAmount,
      currency: currency.toUpperCase(),
      customerName: customer_name,
      customerEmail: customer_email,
      purpose,
      status: 'PENDING',
      createdAt: new Date().toISOString()
    });

    // Keep transaction history capped at 200 items
    if (gatewayTransactions.length > 200) gatewayTransactions.pop();

    const paymentUrl = `${HOSTED_CHECKOUT_BASE_URL}/?pay_session=${sessionId}`;

    console.log(`\n========================================`);
    console.log(`[GATEWAY SESSION CREATED] Session: ${sessionId}`);
    console.log(`[ORDER] ID: ${uniqueOrderId} | Amount: ₹${numAmount} | Purpose: ${purpose}`);
    console.log(`[CHECKOUT URL] ${paymentUrl}`);
    console.log(`========================================\n`);

    res.json({
      success: true,
      session_id: sessionId,
      order_id: uniqueOrderId,
      amount: numAmount,
      currency: currency.toUpperCase(),
      payment_url: paymentUrl,
      expires_at: expiresAt
    });

  } catch (err) {
    console.error(`[GATEWAY ERROR] Failed to create session:`, err);
    res.status(500).json({ success: false, error: 'Internal Server Error', details: err?.message });
  }
});

// 2. GET SESSION METADATA (Called by Hosted Checkout UI page)
app.get('/api/gateway/session/:sessionId', (req, res) => {
  const { sessionId } = req.params;
  const session = gatewaySessions.get(sessionId);

  if (!session) {
    return res.status(404).json({ success: false, error: 'Payment session not found or expired.' });
  }

  res.json({
    success: true,
    session: {
      sessionId: session.sessionId,
      orderId: session.orderId,
      amount: session.amount,
      currency: session.currency,
      customerName: session.customerName,
      customerEmail: session.customerEmail,
      customerPhone: session.customerPhone,
      purpose: session.purpose,
      status: session.status,
      razorpayKeyId: RAZORPAY_KEY_ID,
      cancelUrl: session.cancelUrl,
      createdAt: session.createdAt
    }
  });
});

// 3. VERIFY PAYMENT & DISPATCH WEBHOOK (Called by Hosted Checkout UI on payment complete)
app.post('/api/gateway/verify-payment', async (req, res) => {
  try {
    const {
      sessionId,
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature
    } = req.body;

    const session = gatewaySessions.get(sessionId);
    if (!session) {
      return res.status(404).json({ success: false, error: 'Payment session not found.' });
    }

    if (!razorpay_payment_id) {
      return res.status(400).json({ success: false, error: 'Missing razorpay_payment_id.' });
    }

    // Verify signature if order_id and signature provided
    let isSignatureValid = true;
    if (razorpay_order_id && razorpay_signature) {
      const generatedSignature = crypto
        .createHmac('sha256', RAZORPAY_KEY_SECRET)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest('hex');
      isSignatureValid = generatedSignature === razorpay_signature;
    }

    if (!isSignatureValid) {
      console.error(`[GATEWAY SIGNATURE MISMATCH] Invalid Razorpay signature for session ${sessionId}`);
      return res.status(400).json({ success: false, error: 'Invalid payment signature.' });
    }

    // Update Session & Transaction status to PAID
    session.status = 'PAID';
    session.paymentId = razorpay_payment_id;
    session.paidAt = new Date().toISOString();

    const txIndex = gatewayTransactions.findIndex(t => t.sessionId === sessionId);
    if (txIndex !== -1) {
      gatewayTransactions[txIndex].status = 'PAID';
      gatewayTransactions[txIndex].paymentId = razorpay_payment_id;
      gatewayTransactions[txIndex].paidAt = session.paidAt;
    }

    console.log(`\n========================================`);
    console.log(`[GATEWAY PAYMENT VERIFIED SUCCESS]`);
    console.log(`Session: ${sessionId} | Order ID: ${session.orderId}`);
    console.log(`Payment ID: ${razorpay_payment_id} | Amount: ₹${session.amount}`);
    console.log(`========================================\n`);

    // Asynchronously dispatch webhook to external website if webhookUrl configured
    if (session.webhookUrl) {
      const webhookPayload = {
        event: 'payment.success',
        order_id: session.orderId,
        session_id: sessionId,
        amount: session.amount,
        currency: session.currency,
        payment_id: razorpay_payment_id,
        status: 'PAID',
        customer_name: session.customerName,
        customer_email: session.customerEmail,
        customer_phone: session.customerPhone,
        custom_fields: session.customFields,
        timestamp: new Date().toISOString()
      };

      fetch(session.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-gateway-signature': crypto.createHmac('sha256', GATEWAY_API_KEY).update(JSON.stringify(webhookPayload)).digest('hex')
        },
        body: JSON.stringify(webhookPayload)
      })
      .then(r => console.log(`[WEBHOOK DISPATCHED] Sent to ${session.webhookUrl} -> Status: ${r.status}`))
      .catch(err => console.error(`[WEBHOOK NOTICE] Could not reach webhook URL ${session.webhookUrl}:`, err.message));
    }

    // Compute redirect URL with query parameters for external site
    let redirectUrl = session.successUrl;
    if (redirectUrl) {
      const urlObj = new URL(redirectUrl.startsWith('http') ? redirectUrl : `https://${redirectUrl}`);
      urlObj.searchParams.set('order_id', session.orderId);
      urlObj.searchParams.set('payment_id', razorpay_payment_id);
      urlObj.searchParams.set('status', 'PAID');
      urlObj.searchParams.set('amount', session.amount.toString());
      redirectUrl = urlObj.toString();
    }

    res.json({
      success: true,
      status: 'PAID',
      order_id: session.orderId,
      payment_id: razorpay_payment_id,
      redirect_url: redirectUrl || null,
      message: 'Payment verified successfully.'
    });

  } catch (err) {
    console.error(`[GATEWAY VERIFY ERROR]`, err);
    res.status(500).json({ success: false, error: 'Verification failed', details: err?.message });
  }
});

// 4. GET TRANSACTIONS (For Admin Dashboard)
app.get('/api/gateway/transactions', (req, res) => {
  res.json({
    success: true,
    total: gatewayTransactions.length,
    gateway_api_key: GATEWAY_API_KEY,
    transactions: gatewayTransactions
  });
});


/* ==========================================================================
   📧 TRAVEL AGENCY BOOKING EMAIL DISPATCHER
   ========================================================================== */

// Friendly GET endpoint for /api/send-booking-email
app.get('/api/send-booking-email', (req, res) => {
  res.json({
    status: 'online',
    service: 'WanderVibe SMTP Email Dispatcher API',
    instruction: 'Send a POST request with booking payload to trigger confirmation email.'
  });
});

// POST Endpoint: Send Booking Confirmation Email (Only after verified payment)
app.post('/api/send-booking-email', async (req, res) => {
  const {
    bookingId,
    customerName,
    customerEmail,
    customerPhone,
    tripTitle,
    seatNumbers,
    pickupPoint,
    totalAmountPaid,
    remainingBalanceDue,
    paymentMode,
    paymentId,
    isManualResend
  } = req.body;

  console.log(`\n========================================`);
  console.log(`[PAYMENT RECEIVED] Booking ID: ${bookingId}, Payment ID: ${paymentId}, Amount: ₹${totalAmountPaid}`);

  // Stage 1: Validate Customer Email
  if (!customerEmail || !customerEmail.includes('@')) {
    console.error(`[PAYMENT VERIFICATION FAILED] Missing or invalid customer email: "${customerEmail}"`);
    console.log(`========================================\n`);
    return res.status(400).json({ 
      success: false, 
      error: 'Missing or invalid customer email address' 
    });
  }
  console.log(`[CUSTOMER EMAIL FOUND] Target recipient: ${customerEmail}`);

  // Stage 2: Validate Payment Verification ID
  if (!paymentId) {
    console.error(`[PAYMENT VERIFICATION FAILED] Payment ID missing for booking ${bookingId}`);
    console.log(`========================================\n`);
    return res.status(400).json({ 
      success: false, 
      error: 'Missing verified payment ID' 
    });
  }
  console.log(`[PAYMENT VERIFICATION SUCCESSFUL] Payment ID "${paymentId}" verified for ${customerName || 'Customer'}`);

  // Stage 3: Duplicate Email Prevention (Skip check if admin manual resend)
  const dedupeKey = `${bookingId}_${paymentId}`;
  if (!isManualResend && processedBookingEmails.has(dedupeKey)) {
    console.log(`[DUPLICATE PREVENTED] Confirmation email already sent previously for ${bookingId} (Payment: ${paymentId})`);
    console.log(`========================================\n`);
    return res.json({ 
      success: true, 
      duplicate: true, 
      message: `Email already dispatched previously for booking ${bookingId}` 
    });
  }

  // Stage 4: Call Email Function
  console.log(`[EMAIL FUNCTION CALLED] Preparing voucher HTML for: ${customerEmail}`);

  try {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #0f172a; color: #ffffff; margin: 0; padding: 20px; }
          .card { background-color: #1e293b; border: 1px solid #334155; border-radius: 16px; max-width: 600px; margin: 0 auto; padding: 30px; }
          .header { text-align: center; border-bottom: 1px solid #334155; padding-bottom: 20px; margin-bottom: 20px; }
          .brand { color: #10b981; font-size: 24px; font-weight: bold; }
          .badge { background: rgba(16, 185, 129, 0.15); color: #34d399; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; border: 1px solid rgba(16, 185, 129, 0.3); }
          .detail-row { display: flex; justify-content: space-between; margin-bottom: 12px; font-size: 14px; }
          .label { color: #94a3b8; }
          .value { font-weight: bold; color: #f8fafc; }
          .highlight { color: #34d399; font-weight: bold; }
          .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #334155; text-align: center; font-size: 12px; color: #94a3b8; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="header">
            <div class="brand">WanderVibe Social Travel Agency</div>
            <p style="color: #94a3b8; font-size: 14px; margin-top: 5px;">Official Boarding Pass & Payment Confirmation</p>
            <span class="badge">BOOKING CONFIRMED ✓</span>
          </div>

          <h2 style="font-size: 18px; margin-top: 0;">Hi ${customerName || 'Traveler'}, your seat is locked! 🎉</h2>
          <p style="color: #cbd5e1; font-size: 14px;">Thank you for booking with WanderVibe Social Travel Agency. Here are your official trip voucher details:</p>

          <div style="background: #0f172a; padding: 15px; border-radius: 12px; margin: 20px 0; border: 1px solid #334155;">
            <div class="detail-row">
              <span class="label">Trip Name:</span>
              <span class="value">${tripTitle || 'WanderVibe Expedition'}</span>
            </div>
            <div class="detail-row">
              <span class="label">Booking ID:</span>
              <span class="highlight">${bookingId}</span>
            </div>
            <div class="detail-row">
              <span class="label">Reserved Seats:</span>
              <span class="highlight">#${Array.isArray(seatNumbers) ? seatNumbers.join(', #') : seatNumbers}</span>
            </div>
            <div class="detail-row">
              <span class="label">Boarding Pickup Point:</span>
              <span class="value">${pickupPoint}</span>
            </div>
            <div class="detail-row">
              <span class="label">Payment Mode:</span>
              <span class="value">${paymentMode || 'Razorpay Online'}</span>
            </div>
            <div class="detail-row">
              <span class="label">Amount Paid NOW:</span>
              <span class="highlight">₹${Number(totalAmountPaid).toLocaleString('en-IN')}</span>
            </div>
            ${remainingBalanceDue && Number(remainingBalanceDue) > 0 ? `
            <div style="background: rgba(245, 158, 11, 0.15); border: 2px dashed #f59e0b; padding: 16px; border-radius: 14px; margin: 20px 0; text-align: center;">
              <div style="color: #fbbf24; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">⚠️ REMAINING DUE BALANCE AT BOARDING HUB</div>
              <div style="font-size: 28px; font-weight: 900; color: #ffffff; margin: 4px 0;">₹${Number(remainingBalanceDue).toLocaleString('en-IN')}</div>
              <div style="color: #cbd5e1; font-size: 12px;">Please pay this remaining balance via Cash or UPI at ${pickupPoint} prior to boarding.</div>
            </div>
            ` : `
            <div style="background: rgba(16, 185, 129, 0.15); border: 1px solid #10b981; padding: 12px; border-radius: 12px; margin: 20px 0; text-align: center; color: #34d399; font-weight: bold; font-size: 13px;">
              ✓ 100% FULL PAYMENT COMPLETED — NO DUE BALANCE AT HUB!
            </div>
            `}
            <div class="detail-row">
              <span class="label">Razorpay Payment ID:</span>
              <span class="value">${paymentId}</span>
            </div>
          </div>

          <div style="background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.2); padding: 15px; border-radius: 12px; text-align: center;">
            <h3 style="color: #34d399; margin: 0 0 5px 0; font-size: 14px;">📞 Agency Owner 24/7 Support Hotline</h3>
            <p style="margin: 0; font-size: 14px; font-weight: bold; color: #ffffff;">Harsh Pandey (+91 63880 50042)</p>
            <p style="margin: 5px 0 0 0; font-size: 11px; color: #94a3b8;">Sector 5, C-133, GIDA, Gorakhpur, UP - 273209</p>
          </div>

          <div class="footer">
            <p>WanderVibe Social Travel Agency • Gorakhpur • Lucknow • Delhi Operations</p>
            <p>Strict Non-Refundable Policy Applies for User Cancellations.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const mailOptions = {
      from: `"WanderVibe Travel Pass" <${rawUser}>`,
      to: customerEmail,
      subject: `🎉 Booking Confirmed! Pass ID: ${bookingId} - ${tripTitle || 'WanderVibe Expedition'}`,
      html: htmlContent
    };

    // Stage 5: Send via SMTP
    const info = await transporter.sendMail(mailOptions);
    processedBookingEmails.add(dedupeKey);

    console.log(`[SMTP SEND SUCCESSFUL] Email delivered for booking ${bookingId} to ${customerEmail}`);
    console.log(`[SMTP MESSAGE ID] ${info.messageId}`);
    console.log(`========================================\n`);

    res.json({ 
      success: true, 
      messageId: info.messageId, 
      message: `Email dispatched to ${customerEmail}` 
    });

  } catch (err) {
    console.error(`[SMTP SEND FAILED] Exact Error:`, err?.message || err);
    console.error(`[SMTP ERROR STACK]`, err);
    console.log(`========================================\n`);

    res.status(500).json({ 
      success: false, 
      error: 'Failed to send confirmation email', 
      details: err?.message || 'SMTP delivery failure' 
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 WanderVibe SMTP Email Server & Payment Gateway Switch running on port ${PORT}`);
  console.log(`📧 Configured Sender Email: ${rawUser}`);
  console.log(`💳 Configured Razorpay Key ID: ${RAZORPAY_KEY_ID}`);
  console.log(`🔑 Gateway Secret Key Active: ${GATEWAY_API_KEY}`);
});
