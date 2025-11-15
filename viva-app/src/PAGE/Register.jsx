import React, { useState, useEffect } from "react";
import "../CSS/register.css";
import "../CSS/global-loading.css";
import { ToastContainer, toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { Loader2, Mail, Clock } from "lucide-react";
import { getApiUrl } from "../utils/api";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmpassword: "",
    ennumber: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  const [canResend, setCanResend] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Timer countdown
  useEffect(() => {
    if (showOTPModal && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [showOTPModal, timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmpassword) {
      toast.error("Password Is Not Matching !!!");
      return;
    }

    setIsLoading(true);
    try {
      console.log("Sending OTP request for:", formData.email);
      
      const data = await fetch(getApiUrl("bin/send-otp"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          ennumber: formData.ennumber,
        }),
      });
      
      const result = await data.json();
      console.log("OTP Response:", result);

      setIsLoading(false);

      if (!result.success) {
        toast.error(result.message || "Failed to send OTP");
        console.error("OTP Error:", result);
        return;
      }

      toast.success("OTP sent to your email! Check your inbox.");
      setShowOTPModal(true);
      setTimeLeft(600); // Reset timer
      setCanResend(false);
    } catch (error) {
      setIsLoading(false);
      console.error("Error sending OTP:", error);
      toast.error("Failed to send OTP. Please check your internet connection.");
    }
  };

  const handleOTPChange = (index, value) => {
    if (value.length > 1) return; // Only allow single digit
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  const handleOTPPaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    const newOtp = pastedData.split("");
    setOtp([...newOtp, ...Array(6 - newOtp.length).fill("")]);
  };

  const handleVerifyOTP = async () => {
    const otpString = otp.join("");
    
    if (otpString.length !== 6) {
      toast.error("Please enter complete OTP");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(getApiUrl("bin/verify-otp"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          otp: otpString,
        }),
      });
      const result = await response.json();

      setIsLoading(false);

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success("Email verified successfully! Redirecting to login...");
      setShowOTPModal(false);
      
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      setIsLoading(false);
      toast.error("Verification failed. Please try again.");
    }
  };

  const handleResendOTP = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(getApiUrl("bin/resend-otp"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
        }),
      });
      const result = await response.json();

      setIsLoading(false);

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success("New OTP sent to your email!");
      setTimeLeft(600);
      setCanResend(false);
      setOtp(["", "", "", "", "", ""]);
    } catch (error) {
      setIsLoading(false);
      toast.error("Failed to resend OTP. Please try again.");
    }
  };

  return (
    <>
      {isLoading && (
        <div className="global-loading-overlay">
          <div className="global-loading-spinner">
            <Loader2 className="global-spinner-icon" size={48} />
            <p>Processing...</p>
          </div>
        </div>
      )}

      {/* OTP Verification Modal */}
      {showOTPModal && (
        <div className="otp-modal-overlay">
          <div className="otp-modal-content">
            <div className="otp-modal-header">
              <Mail size={48} className="otp-icon" />
              <h2>Verify Your Email</h2>
              <p>We've sent a 6-digit code to</p>
              <p className="otp-email">{formData.email}</p>
            </div>

            <div className="otp-input-container">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleOTPChange(index, e.target.value)}
                  onPaste={index === 0 ? handleOTPPaste : undefined}
                  className="otp-input"
                  disabled={isLoading}
                />
              ))}
            </div>

            <div className="otp-timer">
              <Clock size={16} />
              <span>Time remaining: {formatTime(timeLeft)}</span>
            </div>

            <button
              className="otp-verify-btn"
              onClick={handleVerifyOTP}
              disabled={isLoading || otp.join("").length !== 6}
            >
              Verify Email
            </button>

            <button
              className="otp-resend-btn"
              onClick={handleResendOTP}
              disabled={!canResend || isLoading}
            >
              {canResend ? "Resend OTP" : `Resend in ${formatTime(timeLeft)}`}
            </button>

            <button
              className="otp-cancel-btn"
              onClick={() => setShowOTPModal(false)}
              disabled={isLoading}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="auth-register-wrapper">
        <form className="register-form" onSubmit={handleSubmit}>
          <h2>Create Account</h2>

          <label>Full Name</label>
          <input
            type="text"
            name="name"
            placeholder="Your full name"
            value={formData.name}
            onChange={handleChange}
            required
            disabled={isLoading}
          />

          <label>Email</label>
          <input
            type="email"
            name="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={isLoading}
          />

          <label>Password</label>
          <input
            type="password"
            name="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            required
            minLength={6}
            disabled={isLoading}
          />
          <label>Confirm Password</label>
          <input
            type="password"
            name="confirmpassword"
            placeholder="••••••••"
            value={formData.confirmpassword}
            onChange={handleChange}
            required
            minLength={6}
            disabled={isLoading}
          />

          <label>Enrollment Number</label>
          <input
            type="text"
            name="ennumber"
            placeholder="Enrollment number"
            value={formData.ennumber}
            onChange={handleChange}
            required
            disabled={isLoading}
          />

          <button type="submit" disabled={isLoading}>
            {isLoading ? "Registering..." : "Register"}
          </button>

          <p className="login-text">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </form>
        <ToastContainer
          position="top-center"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          pauseOnHover
          draggable
          pauseOnFocusLoss
        />
      </div>
    </>
  );
};

export default Register;
