import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../REDUX/UserSlice";
import {
  HelpCircle,
  BookOpen,
  Upload,
  Search,
  CalendarDays,
  Users,
  FileText,
  Megaphone,
  LogOut,
  Plus,
  Clock,
  Bell,
  RefreshCw,
} from "lucide-react";
import "../CSS/home.css";

const Home = () => {
  const dispatch = useDispatch();
  const { UserInfo, isLogin } = useSelector((state) => state.user);
  const [userstatus, setuserstatus] = useState(isLogin);
  const [username, setUsername] = useState(null);

  useEffect(() => {
    if (UserInfo && UserInfo.length > 0) {
      setUsername(UserInfo[0].payload.name);
      dispatch(login);
      setuserstatus(true);
    }
  }, [UserInfo]);

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
                  Welcome
                  <span className="gradient-text"> {username}</span>
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
              {UserInfo.length > 0 ? (
                <></>
              ) : (
                <>
                  <Link to="/login" className="btn-primary">
                    Start Free Trial
                  </Link>
                  <button className="btn-secondary">▶ Watch Demo</button>
                </>
              )}
            </div>
          </section>

          {/* Stats Section */}
          <section className="stats">
            <div>
              <h2>50K+</h2>
              <p>Active Users</p>
            </div>
            <div>
              <h2>98%</h2>
              <p>Satisfaction Rate</p>
            </div>
            <div>
              <h2>1M+</h2>
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
            <div className="feature-card">
              <div className="icon purple">🧠</div>
              <h2>AI-Powered Viva Tests</h2>
              <p>
                Advanced artificial intelligence conducts personalized oral
                examinations, adapting questions based on student responses and
                knowledge level.
              </p>
              <ul>
                <li>✅ Natural Language Processing</li>
                <li>✅ Adaptive Questioning</li>
                <li>✅ Real-time Analysis</li>
              </ul>
              <a href="#">Explore Feature →</a>
            </div>

            <div className="feature-card">
              <div className="icon orange">📊</div>
              <h2>Advanced Analytics Dashboard</h2>
              <p>
                Comprehensive performance tracking with detailed insights,
                progress visualization, and predictive learning analytics.
              </p>
              <ul>
                <li>✅ Performance Metrics</li>
                <li>✅ Progress Tracking</li>
                <li>✅ Predictive Insights</li>
              </ul>
              <a href="#">Explore Feature →</a>
            </div>

            <div className="feature-card">
              <div className="icon purple">🛡️</div>
              <h2>Anti-Cheat Technology</h2>
              <p>
                Sophisticated monitoring system detecting tab switching,
                copy-paste attempts, and unusual behavioral patterns during
                assessments.
              </p>
              <ul>
                <li>✅ Tab Monitoring</li>
                <li>✅ Behavior Analysis</li>
                <li>✅ Secure Environment</li>
              </ul>
              <a href="#">Explore Feature →</a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
