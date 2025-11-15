# 📧 Email System Setup Instructions

## Complete Email Verification & Result Notification System

This system includes:
✅ Email verification with OTP on registration
✅ Automatic result emails after viva submission
✅ Beautiful HTML email templates
✅ Secure OTP system with expiry

---

## 🚀 Setup Steps

### 1. Install Dependencies

```bash
cd Viva_main/BACKEND
npm install
```

This will install `nodemailer` package automatically.

---

### 2. Gmail Setup (For Sending Emails)

#### Step 1: Enable 2-Step Verification
1. Go to your Google Account: https://myaccount.google.com/
2. Click on **Security** in the left sidebar
3. Scroll down to **2-Step Verification**
4. Click **Get Started** and follow the instructions

#### Step 2: Generate App Password
1. After enabling 2-Step Verification, go back to **Security**
2. Scroll to **2-Step Verification** section
3. At the bottom, click on **App passwords**
4. Select **Mail** as the app
5. Select **Other (Custom name)** as the device
6. Enter "Viva Portal" as the name
7. Click **Generate**
8. **Copy the 16-character password** (it will look like: `abcd efgh ijkl mnop`)

---

### 3. Configure Environment Variables

1. Open `Viva_main/BACKEND/.env` file
2. Add these lines (replace with your actual values):

```env
# Email Configuration
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_16_character_app_password
```

**Example:**
```env
EMAIL_USER=vivaport al@gmail.com
EMAIL_PASSWORD=abcd efgh ijkl mnop
```

⚠️ **Important:** 
- Use the **App Password**, NOT your regular Gmail password
- Remove all spaces from the app password

---

### 4. Test the System

#### Test Email Verification:
1. Start the backend server: `npm run dev`
2. Go to the registration page
3. Fill in the form with a real email address
4. Click "Register"
5. Check your email for the OTP
6. Enter the OTP to verify

#### Test Result Email:
1. Login as a student
2. Take a viva test
3. Submit the test
4. Check your email for the result

---

## 📋 Features Implemented

### 1. Email Verification on Registration
- **OTP Generation:** 6-digit random code
- **OTP Expiry:** 10 minutes
- **Resend OTP:** Available after expiry
- **Beautiful Modal:** Clean UI for OTP input
- **Auto-focus:** Smooth input experience
- **Paste Support:** Can paste 6-digit code

### 2. Result Email After Viva Submission
- **Sent Automatically:** After marks are evaluated
- **Comprehensive Details:**
  - Student name, enrollment, email
  - Class name and viva title
  - Total score and percentage
  - Performance badge (Excellent/Good/Keep Practicing)
  - Personalized advice based on performance
  - Question-by-question breakdown
  - Correct/incorrect indicators

### 3. Security Features
- OTP expires in 10 minutes
- Encrypted password storage
- Email validation
- Rate limiting ready
- Secure token generation

---

## 🎨 Email Templates

### OTP Email
- Purple gradient header
- Large OTP display
- Security warning
- Professional footer

### Result Email
- Score circle with percentage
- Performance badge with color coding
- Detailed question breakdown
- Personalized advice
- Professional design

---

## 🔧 Troubleshooting

### Email Not Sending?
1. **Check Gmail Settings:**
   - 2-Step Verification enabled?
   - App Password generated correctly?
   - No spaces in app password?

2. **Check .env File:**
   - EMAIL_USER is correct?
   - EMAIL_PASSWORD is the app password (not regular password)?

3. **Check Console:**
   - Look for error messages in backend console
   - Check if nodemailer is installed

### OTP Not Received?
1. Check spam/junk folder
2. Verify email address is correct
3. Check backend console for errors
4. Try resending OTP

### Result Email Not Received?
1. Check if viva was submitted successfully
2. Check backend console for email sending logs
3. Verify student email is correct in database
4. Check spam folder

---

## 📊 Database Changes

### User Model Updates:
```javascript
{
  isVerified: Boolean,  // Email verification status
  otp: String,          // Current OTP
  otpExpiry: Date       // OTP expiration time
}
```

---

## 🔐 Security Best Practices

1. **Never commit .env file** to version control
2. **Use App Passwords** instead of regular passwords
3. **Rotate App Passwords** periodically
4. **Monitor email sending** for abuse
5. **Implement rate limiting** for OTP requests

---

## 📱 User Flow

### Registration Flow:
1. Student fills registration form
2. Clicks "Register"
3. OTP sent to email
4. Modal appears for OTP input
5. Student enters OTP
6. Email verified
7. Account created
8. Redirect to login

### Result Email Flow:
1. Student submits viva
2. Marks calculated
3. Result saved to database
4. Email sent automatically
5. Student receives detailed result

---

## 🎯 Performance Levels

- **🌟 Excellent (80%+):** Outstanding performance message
- **👍 Good (60-79%):** Encouraging message
- **📚 Keep Practicing (<60%):** Motivational message

---

## 💡 Tips

1. **Test with real email** first
2. **Check spam folder** if emails don't arrive
3. **Use Gmail** for best compatibility
4. **Keep app password secure**
5. **Monitor email quota** (Gmail has daily limits)

---

## 🆘 Support

If you encounter issues:
1. Check backend console logs
2. Verify .env configuration
3. Test with a different email
4. Check Gmail security settings
5. Ensure nodemailer is installed

---

## ✅ Checklist

- [ ] nodemailer installed
- [ ] Gmail 2-Step Verification enabled
- [ ] App Password generated
- [ ] .env file configured
- [ ] Backend server running
- [ ] Test registration with OTP
- [ ] Test result email
- [ ] Check spam folder
- [ ] Verify all emails received

---

**🎉 You're all set! The email system is ready to use.**
