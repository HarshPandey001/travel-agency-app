import express from 'express';
import nodemailer from 'nodemailer';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: '*' }));
app.use(express.json());

// Configure Nodemailer Transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: Number(process.env.SMTP_PORT) || 465,
  secure: Boolean(process.env.SMTP_SECURE !== 'false'), // true for 465, false for 587
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// Health Check endpoint for Render
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'WanderVibe Email Dispatcher', timestamp: new Date().toISOString() });
});

// POST Endpoint: Send Booking Confirmation Email
app.post('/api/send-booking-email', async (req, res) => {
  try {
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
      paymentId
    } = req.body;

    if (!customerEmail) {
      return res.status(400).json({ error: 'Missing customer email' });
    }

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
          .due { color: #fbbf24; font-weight: bold; }
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

          <h2 style="font-size: 18px; margin-top: 0;">Hi ${customerName}, your seat is locked! 🎉</h2>
          <p style="color: #cbd5e1; font-size: 14px;">Thank you for booking with WanderVibe Social Travel Agency. Here are your official trip voucher details:</p>

          <div style="background: #0f172a; padding: 15px; border-radius: 12px; margin: 20px 0; border: 1px solid #334155;">
            <div class="detail-row">
              <span class="label">Trip Name:</span>
              <span class="value">${tripTitle}</span>
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
            <div class="detail-row">
              <span class="label">Remaining Balance Due at Hub:</span>
              <span class="due">₹${Number(remainingBalanceDue).toLocaleString('en-IN')}</span>
            </div>
            ` : ''}
            <div class="detail-row">
              <span class="label">Razorpay Payment ID:</span>
              <span class="value">${paymentId || 'rzp_paid'}</span>
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

    // Dispatch email
    const mailOptions = {
      from: `"WanderVibe Travel Pass" <${process.env.SMTP_USER}>`,
      to: customerEmail,
      subject: `🎉 Booking Confirmed! Pass ID: ${bookingId} - ${tripTitle}`,
      html: htmlContent
    };

    await transporter.sendMail(mailOptions);
    console.log(`[SMTP SUCCESS] Sent confirmation email for booking ${bookingId} to ${customerEmail}`);
    res.json({ success: true, message: `Email dispatched to ${customerEmail}` });

  } catch (err) {
    console.error("[SMTP ERROR]", err);
    res.status(500).json({ error: 'Failed to send confirmation email', details: err?.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 WanderVibe SMTP Email Server running on port ${PORT}`);
});
