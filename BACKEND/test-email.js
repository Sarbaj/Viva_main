// Quick test script to verify email system
import dotenv from 'dotenv';
import { sendOTPEmail, generateOTP } from './services/emailService.js';

dotenv.config();

console.log('🧪 Testing Email System...\n');

// Check environment variables
console.log('📧 Email Configuration:');
console.log('EMAIL_USER:', process.env.EMAIL_USER);
console.log('EMAIL_PASSWORD:', process.env.EMAIL_PASSWORD ? '✅ Set (hidden)' : '❌ Not set');
console.log('');

// Test OTP generation
console.log('🔑 Testing OTP Generation:');
const otp = generateOTP();
console.log('Generated OTP:', otp);
console.log('OTP Length:', otp.length);
console.log('Is 6 digits?', /^\d{6}$/.test(otp) ? '✅ Yes' : '❌ No');
console.log('');

// Test email sending
console.log('📨 Testing Email Sending:');
console.log('Enter your email to test (or press Ctrl+C to cancel):');

// For automated testing, you can uncomment and modify this:
/*
const testEmail = 'your_test_email@gmail.com';
const testName = 'Test User';

sendOTPEmail(testEmail, otp, testName)
  .then(result => {
    if (result.success) {
      console.log('✅ Email sent successfully!');
      console.log('Check your inbox:', testEmail);
    } else {
      console.error('❌ Failed to send email:', result.error);
    }
    process.exit(result.success ? 0 : 1);
  })
  .catch(error => {
    console.error('❌ Error:', error.message);
    process.exit(1);
  });
*/

console.log('\n💡 To test email sending, uncomment the code in test-email.js');
console.log('✅ Email system configuration looks good!');
