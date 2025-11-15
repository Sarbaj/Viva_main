import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "../CSS/login.css";
import "../CSS/global-loading.css";
import { Link, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

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
    setIsLoading(true);
    try {
      const response = await fetch(
        "http://localhost:5050/bin/login",
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
        setIsLoading(false);
        toast.error(errorData.message);
        throw new Error(errorData.message || "Login failed");
      }

      const data = await response.json();

      // Store the token in localStorage
      localStorage.setItem("authToken", data.token);
      
      // Fetch user info to determine role-based redirect
      const userResponse = await fetch(
        "http://localhost:5050/bin/getUsername",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token: data.token }),
        }
      );

      if (userResponse.ok) {
        const userData = await userResponse.json();
        const userRole = userData.payload.role;
        
        toast.success("Login Successful! Redirecting...");
        
        // Redirect based on user role
        setTimeout(() => {
          setIsLoading(false);
          if (userRole === "0") {
            // Student - redirect to home
            navigate("/");
          } else if (userRole === "1") {
            // Teacher - redirect to home
            navigate("/");
          } else if (userRole === "2") {
            // Admin - redirect to home
            navigate("/");
          } else {
            // Default fallback
            navigate("/");
          }
        }, 1500);
      } else {
        // Fallback if user info fetch fails
        toast.success("Login Successful! Redirecting...");
        setTimeout(() => {
          setIsLoading(false);
          navigate("/");
        }, 1500);
      }
    } catch (error) {
      console.error("Error during login:", error);
      setIsLoading(false);
    }
  }

  return (
    <>
      {isLoading && (
        <div className="global-loading-overlay">
          <div className="global-loading-spinner">
            <Loader2 className="global-spinner-icon" size={48} />
            <p>Logging in...</p>
          </div>
        </div>
      )}
      <div className="auth-login-wrapper">
        <form className="login-form">
          {/* <h2
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
          </h2> */}
          <h2>Welcome Back</h2>

          <label>ENROLLMENT NUMBER</label>
          <input
            type="text"
            name="email"
            placeholder="24034211***"
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
            disabled={isLoading}
          />

          <button onClick={(e) => handleSubmit(e)} disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
          </button>

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
