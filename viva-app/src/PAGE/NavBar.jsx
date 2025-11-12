import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "../CSS/navbar.css";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { addBasicInfo } from "../REDUX/UserSlice";
import { Bell, BarChart2, Users, BookOpen, Menu, X } from "lucide-react"; // added Menu + X
import Login from "./Login";

const NavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [Role, SetRole] = useState("");
  const [username, setUsername] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false); // ✅ NEW
  const dispatch = useDispatch();
  const { UserInfo } = useSelector((state) => state.user);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setIsLoggedIn(false);
    SetRole("5");
    window.location.href = "/login";
  };

  useEffect(() => {
    if (UserInfo && UserInfo.length > 0) {
      setUsername(UserInfo[0].name);
    }
  }, [UserInfo]);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const token = localStorage.getItem("authToken");
        
        // If no token, user is logged out
        if (!token) {
          setIsLoggedIn(false);
          SetRole("");
          return;
        }

        // If UserInfo already exists in Redux, use it
        if (UserInfo && UserInfo.length > 0) {
          setIsLoggedIn(true);
          setUsername(UserInfo[0].payload.name);
          SetRole(UserInfo[0].payload.role);
          return;
        }

        // Fetch user info from API
        const response = await fetch(
          "https://vivabackend.onrender.com/bin/getUsername",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token }),
          }
        );

        if (!response.ok) {
          // Invalid token, clear it
          localStorage.removeItem("authToken");
          setIsLoggedIn(false);
          SetRole("");
          return;
        }

        setIsLoggedIn(true);
        const data = await response.json();
        dispatch(addBasicInfo(data));
        setUsername(data.payload.name);
        SetRole(data.payload.role);
      } catch (error) {
        console.log("error verifying token");
        setIsLoggedIn(false);
        SetRole("");
      }
    };
    verifyToken();
  }, [dispatch, location, UserInfo]);

  return (
    <nav className="navbar glassy-nav">
      {/* Logo */}
      <Link to={"/"} style={{ textDecoration: "none" }}>
        <div className="logo">
          <span className="logo-icon">🎓</span>
          <div>
            <h1 className="logo-text">AI Viva</h1>
            <p className="logo-sub">Smart Assessments</p>
          </div>
        </div>
      </Link>

      {/* Hamburger Icon (Mobile Only) */}
      <button
        className="menu-toggle"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        {isMenuOpen ? <X size={26} /> : <Menu size={26} />}
      </button>

      {/* Links */}
      <div className={`nav-links ${isMenuOpen ? "active" : ""}`}>
        {(isMenuOpen === true) & (isLoggedIn == false) ? (
          <>
            <Link to="/login" className="signin-link">
              Sign In
            </Link>
          </>
        ) : (
          <> </>
        )}

        {Role === "1" && (
          <>
            <Link
              to="/teacherdashboard"
              className="nav-link"
              onClick={() => setIsMenuOpen(false)}
            >
              <BarChart2 size={16} /> Dashboard
            </Link>
            <Link
              to="/resources"
              className="nav-link"
              onClick={() => setIsMenuOpen(false)}
            >
              <BookOpen size={16} /> Resources
            </Link>
            <Link
              to="/analytics"
              className="nav-link"
              onClick={() => setIsMenuOpen(false)}
            >
              <BarChart2 size={16} /> Analytics
            </Link>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </>
        )}
        {isLoggedIn && Role == 0 && (
          <>
            <Link
              to="/join"
              className="nav-link"
              onClick={() => setIsMenuOpen(false)}
            >
              <Users size={16} /> Classes
            </Link>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </>
        )}
      </div>

      {/* Right Side */}
      <div className="nav-right">
        <div className="notification">
          <Bell size={20} />
          <span className="badge">3</span>
        </div>
        {isLoggedIn ? (
          <></>
        ) : (
          // <Login />
          <>
            <Link to="/login" className="signin-link">
              Sign In
            </Link>
            <Link to="/register" className="get-started-btn">
              Get Started
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
