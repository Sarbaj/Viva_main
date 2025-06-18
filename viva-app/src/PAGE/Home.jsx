import React from 'react'
import { useState } from 'react';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../CSS/home.css';
import {
  Upload,
  BookOpenText,
  CalendarDays,
  Users,
  FileText,
  Megaphone,
  LogOut,
  Plus,
  RefreshCw
} from "lucide-react";
import { useDispatch, useSelector} from "react-redux";
const Home = () => {
     const { UserInfo } = useSelector((state) => state.user);
     const [username, setUsername] = useState(null)
       useEffect(() => {
      if (UserInfo && UserInfo.length > 0) {
        setUsername(UserInfo[0].payload.name);
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
  <div className="wlcm">
 {UserInfo.length>0 &&(<center><h3>Welcome {UserInfo[0].payload.name} 👋</h3></center>)}
  </div>
    <div className="dashboard-container">
      <h1 className="dashboard-title" style={{display:"flex",justifyContent:"center",alignItems:"center"}}>🛠️ Educator Features</h1>
    
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
      </div>
    </div>
          </>
  );
}
export default Home