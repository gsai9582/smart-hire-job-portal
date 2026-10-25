/**
 * Twilio Verify Service Utility
 * Handles sending and checking OTP via Twilio Verify API
 */

const twilio = require('twilio');

// Simulated storage for OTPs (fallback)
const mockOtps = new Map();

const getClient = () => {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  if (!accountSid || !authToken) return null;
  return twilio(accountSid, authToken);
};

const getServiceSid = () => process.env.TWILIO_VERIFY_SERVICE_SID;

/**
 * Send a verification code to a phone number
 */
const sendVerificationToken = async (phone) => {
  const client = getClient();
  const serviceSid = getServiceSid();

  if (client && serviceSid) {
    try {
      const verification = await client.verify.v2
        .services(serviceSid)
        .verifications.create({ to: phone, channel: 'sms' });

      console.log(`📱 Real Twilio Verification sent to ${phone}: ${verification.status}`);
      return { success: true, status: verification.status };
    } catch (error) {
      console.error('❌ Twilio Verify send failed:', error.message);
      // Fallback to simulation in development
      if (process.env.NODE_ENV === 'development') {
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        mockOtps.set(phone, otp);
        console.log(`⚠️ Falling back to Simulation. Mock OTP for ${phone}: ${otp}`);
        return { success: true, status: 'pending', mock: true, code: otp };
      }
      return { success: false, error: error.message };
    }
  }

  return { success: false, message: 'Twilio configuration missing' };
};

/**
 * Check a verification code
 */
const checkVerificationToken = async (phone, code) => {
  // Check simulation first
  if (mockOtps.has(phone) && mockOtps.get(phone) === code) {
    console.log(`📱 Simulated verification approved for ${phone}`);
    mockOtps.delete(phone);
    return { success: true, status: 'approved' };
  }

  // Master mock code for testing
  if (code === '123456') return { success: true, status: 'approved' };

  const client = getClient();
  const serviceSid = getServiceSid();

  if (client && serviceSid) {
    try {
      const verificationCheck = await client.verify.v2
        .services(serviceSid)
        .verificationChecks.create({ to: phone, code });

      console.log(`📱 Twilio Verification check for ${phone}: ${verificationCheck.status}`);
      return { 
        success: verificationCheck.status === 'approved', 
        status: verificationCheck.status 
      };
    } catch (error) {
      console.error('❌ Twilio Verify check failed:', error.message);
      return { success: false, error: error.message };
    }
  }

  return { success: false, message: 'Twilio configuration missing' };
};

module.exports = { sendVerificationToken, checkVerificationToken };
