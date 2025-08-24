import React from "react";
import { Route, Routes } from "react-router-dom";
import Login from "./PAGE/Login";
import Home from "./PAGE/Home";
import Register from "./PAGE/Register";
import NavBar from "./PAGE/NavBar";
import JoinClass from "./PAGE/JoinClass";
import VivaTest from "./PAGE/VivaTest";
import TeacherDashboard from "./PAGE/TeacherDashboard";
import ClassOverview from "./PAGE/ClassOverview";
import "../src/App.css";
import Studentresult from "./PAGE/Studentresult";
import VivaAnalytics from "./PAGE/VivaAnalytics";
const App = () => {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/join" element={<JoinClass />} />
        <Route path="/analytics" element={<VivaAnalytics />} />
        <Route path="/vivatest" element={<VivaTest />} />
        <Route path="/teacherdashboard" element={<TeacherDashboard />} />
        <Route
          path="/class/overview/:teacherclasscodeid"
          element={<ClassOverview />}
        />
        <Route
          path="/class/overview/studentresult"
          element={<Studentresult />}
        />
      </Routes>
    </>
  );
};

export default App;
