import React, { useEffect, useState } from "react";
import { MdDelete } from "react-icons/md";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import "../CSS/teacher.css";

const TeacherDashboard = () => {
  const [userid, setUsername] = useState("");
  const [ClassRoom, setClassRoom] = useState([]);
  const [popupStatus, setpopupStatus] = useState(false);
  const [formData, setFormData] = useState({ classname: "", time: "" });
  const { UserInfo } = useSelector((state) => state.user);

  useEffect(() => {
    if (UserInfo && UserInfo.length > 0) {
      setUsername(UserInfo[0].payload._id);
      if (UserInfo[0].payload.role != 1) {
        alert(UserInfo[0].payload.role);
        console.log(UserInfo[0].payload.role);
        window.location.href = "/login";
      }
    }
  }, [UserInfo]);

  useEffect(() => {
    const GetClassCode = async () => {
      try {
        const data = await fetch(
          "https://vivabackend.onrender.com/bin/get/student",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ teacherid: userid }),
          }
        );
        const result = await data.json();
        if (result.message.length > 0) {
          setClassRoom(result.message);
          console.log(result.message);
        }
      } catch (error) {
        console.log(error);
      }
    };
    if (userid) GetClassCode();
  }, [userid]);

  const HandleInputchange = (e) => {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;
    const day = String(now.getDate()).padStart(2, "0");
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const year = now.getFullYear();

    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
      time: `${hours}:${formattedMinutes}${ampm} ${day}/${month}/${year}`,
    }));
  };

  const HandleCreteClass = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        "https://vivabackend.onrender.com/bin/create/classcode",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            teacherid: userid,
            classnname: formData.classname,
          }),
        }
      );
      const Data = await response.json();
      setClassRoom([...ClassRoom, Data.result]);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="dashboard1">
      {/* Top header */}
      <div className="dashboard-header">
        <h1>Teacher Dashboard</h1>
        <p>Manage your classes and track student progress</p>
        <div className="header-buttons">
          <button>🔔 Notifications</button>
          <button>⚙ Settings</button>
        </div>
      </div>

      {/* Stats Section */}
      <div className="stats-grid">
        <div className="stat-card">
          <span className="icon">👥</span>
          <h2>{ClassRoom.length > 0 ? ClassRoom.length : "Loading.."}</h2>
          <p>Active Classes</p>
          <span className="badge">+2 this week</span>
        </div>
        
      </div>

      {/* Quick Actions + Activity */}
      <div className="grid-2">
        <div className="card">
          <h2>Quick Actions</h2>
          <button className="primary">⬆ Upload Syllabus</button>
          <button onClick={() => setpopupStatus(true)}>
            👩‍🏫 Create New Class
          </button>
          <button>🕒 Schedule Test</button>
        </div>
        <div className="card">
          <h2>Recent Activity</h2>
          <ul className="activity-list">
            <li>
              <span>Math Test - Algebra Basics</span>
              <span className="tag">Test</span>
            </li>
            <li>
              <span>Physics Class - Motion Laws</span>
              <span className="tag">Class</span>
            </li>
            <li>
              <span>Chemistry Assignment Due</span>
              <span className="tag">Assignment</span>
            </li>
            <li>
              <span>Biology Quiz Results</span>
              <span className="tag">Result</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Classroom Cards */}
      <div className="class-list">
        {ClassRoom.length > 0 &&
          ClassRoom.map((data, i) => (
            <div className="class-card" key={i}>
              <button className="delete-btn">
                <MdDelete />
              </button>
              <h3>
                Class Name :{" "}
                <span style={{ color: "#7b5cff", marginBottom: "15px" }}>
                  {data.classname}
                </span>
              </h3>
              <p>Class Code : {data.code}</p>
              <Link to={`/class/overview/${data.code}`} className="linkstyle">
                View Class
              </Link>
            </div>
          ))}
      </div>

      {/* Popup Modal */}
      {popupStatus && (
        <div className="popup">
          <div className="popup-content">
            <p className="close" onClick={() => setpopupStatus(false)}>
              X
            </p>
            <h2>Create Class</h2>
            <input
              type="text"
              placeholder="Enter Classname"
              name="classname"
              value={formData.classname}
              onChange={HandleInputchange}
            />
            <button className="primary" onClick={(e) => HandleCreteClass(e)}>
              CREATE CLASS
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherDashboard;
