import React, { useState } from "react";
import "../CSS/register.css";
import "../CSS/global-loading.css";
import { ToastContainer, toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmpassword: "",
    ennumber: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmpassword) {
      toast.error("Password Is Not Matching !!!");
      return;
    }

    setIsLoading(true);
    try {
      const data = await fetch("http://localhost:5050/bin/registerstudent", {
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

      if (result.status !== 201) {
        setIsLoading(false);
        toast.error(result.message);
        return;
      }

      if (result.status === 201) {
        toast.success("Successfully Registered! Redirecting to login...");
        setFormData({
          name: "",
          email: "",
          password: "",
          confirmpassword: "",
          ennumber: "",
        });

        // Redirect to login page after short delay
        setTimeout(() => {
          setIsLoading(false);
          navigate("/login");
        }, 1500);
      }
    } catch (error) {
      setIsLoading(false);
      toast.error("Registration failed. Please try again.");
    }
  };

  return (
    <>
      {isLoading && (
        <div className="global-loading-overlay">
          <div className="global-loading-spinner">
            <Loader2 className="global-spinner-icon" size={48} />
            <p>Creating your account...</p>
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
