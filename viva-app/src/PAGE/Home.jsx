import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login, addBasicInfo } from "../REDUX/UserSlice";
import {
  Brain,
  BarChart3,
  BarChart2,
  Shield,
  Sparkles,
  Zap,
  CheckCircle2,
  TrendingUp,
  Lock,
  Eye,
  Activity,
  BookOpen,
} from "lucide-react";
import "../CSS/home.css";

const Home = () => {
  const dispatch = useDispatch();
  const { UserInfo, isLogin } = useSelector((state) => state.user);
  const [userstatus, setuserstatus] = useState(isLogin);
  const [username, setUsername] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [stats, setStats] = useState({ users: 0, satisfaction: 0, assessments: 0 });

  // Verify token and fetch user info on mount
  useEffect(() => {
    const verifyToken = async () => {
      try {
        const token = localStorage.getItem("authToken");
        
        // If no token, user is not logged in
        if (!token) {
          setIsLoadingUser(false);
          return;
        }

        // If UserInfo already exists in Redux, use it
        if (UserInfo && UserInfo.length > 0) {
          setUsername(UserInfo[0].payload.name);
          setUserRole(UserInfo[0].payload.role);
          dispatch(login());
          setuserstatus(true);
          setIsLoadingUser(false);
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
          setIsLoadingUser(false);
          return;
        }

        const data = await response.json();
        
        // Dispatch to Redux
        dispatch(addBasicInfo(data));
        dispatch(login());
        
        // Set local state
        setUsername(data.payload.name);
        setUserRole(data.payload.role);
        setuserstatus(true);
        setIsLoadingUser(false);
      } catch (error) {
        console.log("Error verifying token:", error);
        setIsLoadingUser(false);
      }
    };

    verifyToken();
  }, [dispatch]);

  // Update local state when UserInfo changes
  useEffect(() => {
    if (UserInfo && UserInfo.length > 0) {
      setUsername(UserInfo[0].payload.name);
      setUserRole(UserInfo[0].payload.role);
      dispatch(login());
      setuserstatus(true);
    }
  }, [UserInfo, dispatch]);

  // Animate stats counter
  useEffect(() => {
    const duration = 2000; // 2 seconds
    const steps = 60;
    const interval = duration / steps;
    
    const targets = { users: 50, satisfaction: 98, assessments: 1 };
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      
      setStats({
        users: Math.floor(targets.users * progress),
        satisfaction: Math.floor(targets.satisfaction * progress),
        assessments: Math.floor(targets.assessments * progress * 10) / 10,
      });

      if (currentStep >= steps) {
        setStats(targets);
        clearInterval(timer);
      }
    }, interval);

    return () => clearInterval(timer);
  }, []);

  function FeatureCard({ icon, title, description }) {
    return (
      <div className="feature-card glass-card">
        <div className="feature-icon">{icon}</div>
        <div className="feature-text">
          <h3>{title}</h3>
          <p>{description}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="maindiv">
        <div className="home-container">
          <section className="hero">
            <span className="badgehome">AI-Powered Education Platform</span>
            {UserInfo.length > 0 ? (
              <>
                <h1>
                  Welcome <span>-</span> 
                  <span className="gradient-text">{username}</span>
                </h1>
              </>
            ) : (
              <>
                <h1>
                  Transform Education with <br />
                  <span className="gradient-text">AI Excellence</span>
                </h1>
              </>
            )}

            <p className="subtitle">
              Experience the future of learning with our premium education
              platform. AI-powered assessments, real-time analytics, and
              seamless collaboration for teachers and students.
            </p>

            <div className="cta-buttons">
              {isLoadingUser ? (
                <div className="loading-buttons">
                  <div className="skeleton-btn"></div>
                </div>
              ) : UserInfo.length > 0 ? (
                <>
                  {userRole === "0" && (
                    <Link to="/join" className="btn-navbar-style">
                      <BookOpen size={18} /> My Classes
                    </Link>
                  )}
                  {userRole === "1" && (
                    <Link to="/teacherdashboard" className="btn-navbar-style">
                      <BarChart2 size={18} /> Dashboard
                    </Link>
                  )}
                  {userRole === "2" && (
                    <Link to="/analytics" className="btn-navbar-style">
                      <Activity size={18} /> Analytics
                    </Link>
                  )}
                </>
              ) : (
                <>
                  <Link to="/register" className="btn-primary glow-border">
                    Start Free Trial
                  </Link>
                  <button className="btn-secondary">▶ Watch Demo</button>
                </>
              )}
            </div>
          </section>

          {/* Stats Section */}
          <section className="stats">
            <div className="stat-item">
              <h2 className="stat-number">{stats.users}K+</h2>
              <p>Active Users</p>
            </div>
            <div className="stat-item">
              <h2 className="stat-number">{stats.satisfaction}%</h2>
              <p>Satisfaction Rate</p>
            </div>
            <div className="stat-item">
              <h2 className="stat-number">{stats.assessments}M+</h2>
              <p>Assessments</p>
            </div>
          </section>
        </div>

        <div className="maindiv2">
          <div className="header">
            <button className="premium-btn">Premium Features</button>
            <h1>
              <span className="highlight">Revolutionary</span> <br />
              Education Technology
            </h1>
            <p>
              Experience cutting-edge features designed to transform the way
              teachers teach and students learn. Built with modern technology
              and award-winning design.
            </p>
          </div>

          <div className="features">
            <div className="feature-card animated-card">
              <div className="icon-container purple-gradient">
                <Brain className="animated-icon" size={36} />
                <Sparkles className="sparkle-icon" size={16} />
              </div>
              <h2>AI-Powered Viva Tests</h2>
              <p>
                Advanced artificial intelligence conducts personalized oral
                examinations, adapting questions based on student responses and
                knowledge level.
              </p>
              <ul>
                <li><CheckCircle2 size={16} className="check-icon" /> Natural Language Processing</li>
                <li><CheckCircle2 size={16} className="check-icon" /> Adaptive Questioning</li>
                <li><CheckCircle2 size={16} className="check-icon" /> Real-time Analysis</li>
              </ul>
            </div>

            <div className="feature-card animated-card">
              <div className="icon-container orange-gradient">
                <BarChart3 className="animated-icon" size={36} />
                <TrendingUp className="sparkle-icon" size={16} />
              </div>
              <h2>Advanced Analytics Dashboard</h2>
              <p>
                Comprehensive performance tracking with detailed insights,
                progress visualization, and predictive learning analytics.
              </p>
              <ul>
                <li><CheckCircle2 size={16} className="check-icon" /> Performance Metrics</li>
                <li><CheckCircle2 size={16} className="check-icon" /> Progress Tracking</li>
                <li><CheckCircle2 size={16} className="check-icon" /> Predictive Insights</li>
              </ul>
            </div>

            <div className="feature-card animated-card">
              <div className="icon-container blue-gradient">
                <Shield className="animated-icon" size={36} />
                <Lock className="sparkle-icon" size={16} />
              </div>
              <h2>Anti-Cheat Technology</h2>
              <p>
                Sophisticated monitoring system detecting tab switching,
                copy-paste attempts, and unusual behavioral patterns during
                assessments.
              </p>
              <ul>
                <li><CheckCircle2 size={16} className="check-icon" /> Tab Monitoring</li>
                <li><CheckCircle2 size={16} className="check-icon" /> Behavior Analysis</li>
                <li><CheckCircle2 size={16} className="check-icon" /> Secure Environment</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
