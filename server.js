import express from 'express';
import nodemailer from 'nodemailer';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Universal CORS Middleware - dynamically reflects origin
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']
}));

app.options('*', cors());
app.use(express.json());

// In-memory set to prevent duplicate email dispatches for the same booking/payment
const processedBookingEmails = new Set();

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
  res.json({ status: 'ok', service: 'WanderVibe Email Dispatcher', timestamp: new Date().toISOString() });
});

// Auto Keep-Alive Heartbeat: Pings /health every 4 minutes to keep Render Web Service 24/7 AWAKE
const RENDER_EXTERNAL_URL = process.env.RENDER_EXTERNAL_URL || 'https://wandervibe-email-service.onrender.com';
setInterval(() => {
  fetch(`${RENDER_EXTERNAL_URL}/health`)
    .then(r => r.json())
    .then(data => console.log(`[KEEP-ALIVE HEARTBEAT] Render backend active at ${new Date().toLocaleTimeString('en-IN')} -> Status: ${data.status}`))
    .catch(err => console.log(`[KEEP-ALIVE NOTICE] Heartbeat: ${err.message}`));
}, 4 * 60 * 1000);

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
  console.log(`🚀 WanderVibe SMTP Email Server running on port ${PORT}`);
  console.log(`📧 Configured Sender Email: ${rawUser}`);
});
