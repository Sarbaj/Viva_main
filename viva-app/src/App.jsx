import React from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Login from "./PAGE/Login";
import Home from "./PAGE/Home";
import Register from "./PAGE/Register";
import NavBar from "./PAGE/NavBar";
import JoinClass from "./PAGE/JoinClass";
import VivaTest from "./PAGE/VivaTest";
import TeacherDashboard from "./PAGE/TeacherDashboard";
import ClassOverview from "./PAGE/ClassOverview";
import ClassVivasPage from "./PAGE/ClassVivasPage";
import StudentProfile from "./PAGE/StudentProfile";
import AdminLogin from "./PAGE/AdminLogin";
import AdminDashboard from "./PAGE/AdminDashboard";
import "../src/App.css";
import "./CSS/light-theme.css";
import Studentresult from "./PAGE/Studentresult";
import VivaAnalytics from "./PAGE/VivaAnalytics";
import VivaMonitor from "./PAGE/VivaMonitor";
import Resources from "./PAGE/Resources";

const App = () => {
  const location = useLocation();
  const hideNavBarRoutes = ['/vivatest', '/admin/login', '/admin/dashboard'];
  const shouldShowNavBar = !hideNavBarRoutes.includes(location.pathname);

  // Load saved theme on mount
  React.useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "dark";
    if (savedTheme === "light") {
      document.documentElement.classList.add("light-theme");
      document.body.classList.add("light-theme");
    } else {
      document.documentElement.classList.remove("light-theme");
      document.body.classList.remove("light-theme");
    }
  }, []);

  return (
    <>
      {shouldShowNavBar && <NavBar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/join" element={<JoinClass />} />
        <Route path="/profile" element={<StudentProfile />} />
        <Route path="/class/:classCode/vivas" element={<ClassVivasPage />} />
        <Route path="/analytics" element={<VivaAnalytics />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/vivatest" element={<VivaTest />} />
        <Route path="/teacherdashboard" element={<TeacherDashboard />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route
          path="/class/overview/:teacherclasscodeid"
          element={<ClassOverview />}
        />
        <Route
          path="/class/overview/studentresult"
          element={<Studentresult />}
        />
        <Route
          path="/viva/monitor/:vivaId"
          element={<VivaMonitor />}
        />
      </Routes>
    </>
  );
};

export default App;
