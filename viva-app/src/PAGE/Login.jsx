import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "../CSS/login.css";
import { Link } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });

  useEffect(() => {
    const token = localStorage.removeItem("authToken");
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const response = await fetch(
        "https://vivabackend.onrender.com/bin/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ennumber: formData.email,
            password: formData.password,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.message);
        throw new Error(errorData.message || "Login failed");
      }

      const data = await response.json();

      // Store the token in sessionStorage
      localStorage.setItem("authToken", data.token);
      toast.success("Success Login");
      // Redirect to the main page
      window.location.href = "/";
    } catch (error) {
      console.error("Error during login:", error);
    }
  }

  return (
    <>
      <div className="login-wrapper">
        <form className="login-form">
          <h2
            style={{
              position: "absolute",
              top: "5px",
              padding: "2px 5px",
              cursor: "pointer",
              right: "5px",
              background: "black",
              color: "white",
              borderRadius: "8px",
            }}
          >
            X
          </h2>
          <h2>Welcome Back</h2>

          <label>ENROLLMENT NUMBER</label>
          <input
            type="text"
            name="email"
            placeholder="24034211***"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <label>Password</label>
          <input
            type="password"
            name="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <button onClick={(e) => handleSubmit(e)}>Login</button>

          <p className="register-text">
            Don’t have an account? <Link to="/register">Register </Link>
          </p>
        </form>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={3000} // 3 seconds
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
        draggable
        pauseOnFocusLoss
      />
    </>
  );
};

export default Login;
