import React from 'react'
import { useState } from 'react';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../CSS/home.css';
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
  RefreshCw
} from "lucide-react";
import { useDispatch, useSelector} from "react-redux";
import { login } from '../REDUX/UserSlice';
const Home = () => {
  const dispatch=useDispatch()
     const { UserInfo } = useSelector((state) => state.user);
     const { isLogin } = useSelector((state) => state.user);
     const [userstatus, setuserstatus] = useState(isLogin)
     const [username, setUsername] = useState(null)
       useEffect(() => {
      if (UserInfo && UserInfo.length > 0) {
        setUsername(UserInfo[0].payload.name);
        dispatch(login)
        setuserstatus(true)
        
      }
    }, [UserInfo]);

  
function FeatureCard({ icon, title, description }) {
  return (
    <div className="feature-card" >
      <div className="feature-header">
        <div className="icon-container">{icon}</div>
        <h2>{title}</h2>
      </div>
      <p className="feature-description">{description}</p>
    </div>
  );
}



 return (
  <>
  {userstatus === false ? (
  <>
  <center>
    <div className="home-container">
      {/* Hero Section */}
      <div className="hero-section">
        <h1>Welcome to AI Viva App 🤖</h1>
        <p>
          Empower your learning with AI-driven viva practice. Automatically generated
          questions, anti-cheat protections, and real-time evaluation to boost your confidence!
        </p>
      </div>

      {/* Features Section */}
      <div className="features-section">
        <h2>🔥 Features</h2>
        <ul>
          <li>🎯 Viva questions generated from syllabus using AI</li>
          <li>🔒 Anti-cheat mechanisms (tab switch, timer, logs)</li>
          <li>📈 Instant result and feedback</li>
          <li>👨‍🏫 Teacher & Student dashboards</li>
          <li>🧠 Topic-based learning for any subject</li>
        </ul>
      </div>

      {/* How It Works Section */}
      <div className="how-it-works">
        <h2>🚀 How It Works</h2>
        <ol>
          <li>Join <strong>Viva</strong> and <strong>Take Test</strong></li>
          <li>AI generates viva questions based on syllabus</li>
          <li>Answer them in a time-bound and secure environment</li>
          <li>Get real-time feedback</li>
        </ol>
      </div>

      {/* Testimonials Section */}
      <div className="testimonials">
        <h2>💬 What Users Say</h2>
        <div className="testimonial-card">
          <p>
            "This app helped me prepare for my practicals quickly and effectively. The best part is the
            anti-cheat features that make it feel like a real exam!" – <strong>Riya S., MCA Student</strong>
          </p>
        </div>
        <div className="testimonial-card">
          <p>
            "As a teacher, I can monitor students' progress and create class-specific viva tests.
            Brilliant tool!" – <strong>Prof. Sharma, Computer Science Dept.</strong>
          </p>
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="cta-section">
        <h2>🎓 Ready to Experience AI-Powered Viva?</h2>
        <p>Login or register to get started. No more boring preparations!</p>
        <Link
  to="/login"
  style={{
    background: "#62686ed3",
    border: "none",
    color: "white",
    padding: "12px 24px",
    fontSize: "1rem",
    borderRadius: "6px",
    cursor: "pointer",
    textDecoration: "none",
    fontFamily: "Poppins, sans-serif",
    transition: "0.3s ease-in-out",
    display: "inline-block"
  }}
>
  Join Now
</Link>

      </div>
    </div>
    </center>
  </>
) : (
  ''
)}

  <div className="wlcm">
   
 {UserInfo.length>0 &&(<center><h3>Welcome {UserInfo[0].payload.name} 👋</h3></center>)}
  </div>
    <div className="dashboard-container">
     {UserInfo.length>0 &&(<h1 className="dashboard-title" style={{display:"flex",justifyContent:"center",alignItems:"center"}}>🛠️ {UserInfo[0].payload.role==0 ? ("Student"):("Educator")} Features</h1>)} 
    {UserInfo.length>0 &&(<>
    {UserInfo[0].payload.role==0 ? (<>
    <div className="feature-grid">
  <FeatureCard
    icon={<Search />}
    title="Join Class"
    description="Enter a class code to join a viva session and access related content."
  />
  <FeatureCard
    icon={<BookOpen />}
    title="View Syllabus"
    description="Access the syllabus uploaded by your teacher for viva preparation."
  />
  <FeatureCard
    icon={<HelpCircle />}
    title="Take Viva"
    description="Start the AI-powered viva session based on your class schedule."
  />
  <FeatureCard
    icon={<Clock />}
    title="View Viva Timer"
    description="Track remaining time during the viva to stay on pace."
  />
  <FeatureCard
    icon={<FileText />}
    title="View Results"
    description="See your viva scores, correct answers, and AI feedback."
  />
  <FeatureCard
    icon={<RefreshCw />}
    title="Retake Viva (If Allowed)"
    description="Retake the viva if your teacher has enabled multiple attempts."
  />
  <FeatureCard
    icon={<Bell />}
    title="View Announcements"
    description="Check for important messages or instructions from your teacher."
  />
  <FeatureCard
    icon={<LogOut />}
    title="Logout"
    description="Securely log out and end your session."
  />
</div>

    </>):(
      <>
       <div className="feature-grid">
        <FeatureCard
          icon={<Plus />}
          title="Create Class Code"
          description="Generate unique class codes to group students and manage viva sessions."
          />
        <FeatureCard
          icon={<Upload />}
          title="Upload Syllabus"
          description="Upload a syllabus file or text to be used for AI-based question generation."
          />
        <FeatureCard
          icon={<CalendarDays />}
          title="Schedule Viva"
          description="Set a date, time, and duration for AI-powered viva tests."
          />
        <FeatureCard
          icon={<Users />}
          title="View Students"
          description="See all students enrolled under your class codes with status updates."
          />
        <FeatureCard
          icon={<FileText />}
          title="Student Results"
          description="Access student viva scores, AI-evaluated marks, and answer summaries."
          />
        <FeatureCard
          icon={<RefreshCw />}
          title="Regenerate Questions"
          description="Use AI to regenerate a new set of viva questions based on the syllabus."
          />
        <FeatureCard
          icon={<Megaphone />}
          title="Send Announcement"
          description="Send messages or updates to students linked to your class codes."
          />
        <FeatureCard
          icon={<LogOut />}
          title="Logout"
          description="Securely log out and end your current session."
          />
      </div></>
    )}
    </>)}
     
    </div>
          </>
  );
}
export default Home