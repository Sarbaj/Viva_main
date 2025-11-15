# 🧪 Testing Email Verification System

## Quick Debugging Guide

### Step 1: Start Backend Server
```bash
cd Viva_main/BACKEND
npm run dev
```

**Expected Output:**
```
Server running on port 5050
MongoDB connected
```

### Step 2: Test Registration

1. **Open Browser Console** (F12)
2. **Go to Registration Page**
3. **Fill in the form** with a REAL email address
4. **Click Register**

### Step 3: Check Console Logs

**Frontend Console (Browser):**
```
Sending OTP request for: your_email@gmail.com
OTP Response: { success: true, message: "OTP sent to your email" }
```

**Backend Console (Terminal):**
```
📧 OTP Request received for: your_email@gmail.com
🔑 Generated OTP: 123456
✅ Created new user with OTP
📨 Sending OTP email to: your_email@gmail.com
✅ OTP email sent successfully
```

### Step 4: Check Email

1. **Check Inbox** - Look for email from vivaportalai@gmail.com
2. **Check Spam/Junk** - Sometimes emails go there
3. **Wait 1-2 minutes** - Email delivery can take time

### Step 5: Enter OTP

1. **Copy the 6-digit code** from email
2. **Paste or type** in the OTP modal
3. **Click "Verify Email"**

---

## 🐛 Troubleshooting

### Problem: "Failed to send OTP"

**Check:**
1. Is backend server running?
2. Is MongoDB connected?
3. Check backend console for errors

**Solution:**
```bash
# Restart backend
cd Viva_main/BACKEND
npm run dev
```

### Problem: Email not received

**Check:**
1. Spam/Junk folder
2. Email address is correct
3. Gmail app password is valid

**Test Email Config:**
```bash
cd Viva_main/BACKEND
node -e "const nodemailer = require('nodemailer'); const t = nodemailer.createTransport({ service: 'gmail', auth: { user: 'vivaportalai@gmail.com', pass: 'uvlxasuyfxzvjqxh' } }); t.verify().then(() => console.log('✅ OK')).catch(e => console.error('❌', e.message));"
```

### Problem: OTP Modal not showing

**Check:**
1. Browser console for errors
2. Network tab for API response
3. Make sure `showOTPModal` state is true

**Debug:**
```javascript
// Add this in Register.jsx handleSubmit
console.log("Setting showOTPModal to true");
setShowOTPModal(true);
```

### Problem: "Invalid OTP"

**Check:**
1. OTP is 6 digits
2. OTP not expired (10 minutes)
3. Entered correctly (no spaces)

**Solution:**
- Click "Resend OTP" if expired
- Copy-paste OTP from email

### Problem: "Email already exists"

**Solution:**
- Use a different email
- Or delete the user from MongoDB:
```javascript
// In MongoDB
db.users.deleteOne({ email: "your_email@gmail.com" })
```

---

## 📊 Expected Flow

### Successful Registration:
```
1. Fill form → Click Register
   ↓
2. Backend: Generate OTP → Save to DB
   ↓
3. Backend: Send email with OTP
   ↓
4. Frontend: Show OTP modal
   ↓
5. User: Check email → Enter OTP
   ↓
6. Backend: Verify OTP → Mark as verified
   ↓
7. Frontend: Success → Redirect to login
```

---

## 🔍 Manual Testing Checklist

- [ ] Backend server is running
- [ ] MongoDB is connected
- [ ] Email config in .env is correct
- [ ] nodemailer is installed
- [ ] Registration form submits
- [ ] OTP is generated (check backend console)
- [ ] Email is sent (check backend console)
- [ ] Email is received (check inbox/spam)
- [ ] OTP modal appears
- [ ] OTP can be entered
- [ ] OTP verification works
- [ ] Redirect to login works

---

## 🎯 Quick Test Commands

### Test 1: Check Email Config
```bash
cd Viva_main/BACKEND
node -e "require('dotenv').config(); console.log('EMAIL_USER:', process.env.EMAIL_USER); console.log('EMAIL_PASSWORD:', process.env.EMAIL_PASSWORD ? '✅ Set' : '❌ Not set');"
```

### Test 2: Test Email Sending
```bash
cd Viva_main/BACKEND
node -e "const nodemailer = require('nodemailer'); const t = nodemailer.createTransport({ service: 'gmail', auth: { user: process.env.EMAIL_USER || 'vivaportalai@gmail.com', pass: process.env.EMAIL_PASSWORD || 'uvlxasuyfxzvjqxh' } }); t.sendMail({ from: 'vivaportalai@gmail.com', to: 'YOUR_EMAIL@gmail.com', subject: 'Test', text: 'Test email' }).then(() => console.log('✅ Sent')).catch(e => console.error('❌', e.message));"
```

### Test 3: Check Database Connection
```bash
cd Viva_main/BACKEND
node -e "const mongoose = require('mongoose'); require('dotenv').config(); mongoose.connect(process.env.DATABASEURI).then(() => { console.log('✅ MongoDB connected'); process.exit(0); }).catch(e => { console.error('❌', e.message); process.exit(1); });"
```

---

## 📝 Common Issues & Solutions

| Issue | Cause | Solution |
|-------|-------|----------|
| "Failed to send OTP" | Backend not running | Start backend server |
| Email not received | Wrong email config | Check .env file |
| "Invalid OTP" | OTP expired | Click "Resend OTP" |
| Modal not showing | JavaScript error | Check browser console |
| "Email already exists" | User already registered | Use different email or delete from DB |

---

## ✅ Success Indicators

**You'll know it's working when:**
1. ✅ Backend console shows "OTP email sent successfully"
2. ✅ You receive email with OTP
3. ✅ OTP modal appears on frontend
4. ✅ OTP verification succeeds
5. ✅ Redirected to login page

---

## 🆘 Still Not Working?

1. **Check all console logs** (both frontend and backend)
2. **Verify .env file** has correct email credentials
3. **Test email config** with the commands above
4. **Check spam folder** for emails
5. **Try with a different email** address
6. **Restart backend server**
7. **Clear browser cache** and try again

---

**Need Help?**
- Check backend console for detailed error messages
- Check browser console for frontend errors
- Verify all steps in EMAIL_SETUP_INSTRUCTIONS.md
