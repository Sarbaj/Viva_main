import React from "react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  GraduationCap,
  Users,
  BookOpen,
  BarChart3,
  Plus,
  Upload,
  Calendar,
  Trash2,
  Eye,
  Activity,
  TrendingUp,
  Clock,
  FileText,
  Award,
  Loader2,
} from "lucide-react";
import "../CSS/teacher.css";
import "../CSS/global-loading.css";

const TeacherDashboard = () => {
  const [userid, setUsername] = useState("");
  const [teacherName, setTeacherName] = useState("");
  const [ClassRoom, setClassRoom] = useState([]);
  const [popupStatus, setpopupStatus] = useState(false);
  const [isCreatingClass, setIsCreatingClass] = useState(false);
  const [formData, setFormData] = useState({ classname: "", time: "" });
  const [stats, setStats] = useState({
    totalClasses: 0,
    totalVivas: 0,
    totalStudents: 0,
  });
  const { UserInfo } = useSelector((state) => state.user);

  useEffect(() => {
    if (UserInfo && UserInfo.length > 0) {
      setUsername(UserInfo[0].payload._id);
      setTeacherName(UserInfo[0].payload.name);
      if (UserInfo[0].payload.role != 1) {
        window.location.href = "/login";
      }
    }
  }, [UserInfo]);

  useEffect(() => {
    const GetClassCode = async () => {
      try {
        const data = await fetch("http://localhost:5050/bin/get/student", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ teacherid: userid }),
        });
        const result = await data.json();
        if (result.message.length > 0) {
          setClassRoom(result.message);

          // Calculate stats
          const totalClasses = result.message.length;
          // For now, we'll use placeholder values for vivas and students
          // In a real app, you'd fetch this data from additional API calls
          setStats({
            totalClasses: totalClasses,
            totalVivas: totalClasses * 3, // Placeholder: assume 3 vivas per class
            totalStudents: totalClasses * 25, // Placeholder: assume 25 students per class
          });
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

    if (!formData.classname.trim()) {
      alert("Please enter a class name");
      return;
    }

    setIsCreatingClass(true);
    try {
      const response = await fetch(
        "http://localhost:5050/bin/create/classcode",
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

      if (response.ok) {
        setClassRoom([...ClassRoom, Data.result]);

        // Update stats
        const newTotalClasses = ClassRoom.length + 1;
        setStats({
          totalClasses: newTotalClasses,
          totalVivas: newTotalClasses * 3,
          totalStudents: newTotalClasses * 25,
        });

        // Reset form and close modal
        setFormData({ classname: "", time: "" });
        setpopupStatus(false);

        // Show success message
        alert("Class created successfully! 🎉");
      } else {
        alert("Failed to create class. Please try again.");
      }
    } catch (error) {
      console.log(error);
      alert("An error occurred while creating the class.");
    } finally {
      setIsCreatingClass(false);
    }
  };

  const HandleDeleteClass = (classData) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${classData.classname}"?\n\nThis action cannot be undone and will remove all associated data including vivas and student records.`
    );

    if (confirmDelete) {
      // Here you would typically make an API call to delete the class
      // For now, we'll just remove it from the local state
      const updatedClasses = ClassRoom.filter(
        (item) => item.code !== classData.code
      );
      setClassRoom(updatedClasses);

      // Update stats
      const newTotalClasses = updatedClasses.length;
      setStats({
        totalClasses: newTotalClasses,
        totalVivas: newTotalClasses * 3,
        totalStudents: newTotalClasses * 25,
      });

      alert("Class deleted successfully.");
    }
  };

  return (
    <div className="teacher-dashboard-container">
      {/* Header Section */}
      <div className="teacher-dashboard-header">
        <div className="teacher-header-content">
          <div className="teacher-header-info">
            <GraduationCap size={48} className="teacher-header-icon" />
            <div className="teacher-header-text">
              <h1>Welcome back, {teacherName || "Teacher"}!</h1>
              <p>Manage your classes and track student progress</p>
            </div>
          </div>
          <div className="teacher-header-actions">
            <button className="teacher-notification-btn">
              <Activity size={20} />
              <span className="teacher-notification-badge">3</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="teacher-stats-section">
        <div className="teacher-stat-card">
          <div className="teacher-stat-icon">
            <BookOpen size={40} />
          </div>
          <div className="teacher-stat-content">
            <h3>{stats.totalClasses}</h3>
            <p>Total Classes</p>
            <span className="teacher-stat-trend">
              <TrendingUp size={16} />+{ClassRoom.length > 0 ? 1 : 0} this week
            </span>
          </div>
        </div>

        <div className="teacher-stat-card">
          <div className="teacher-stat-icon">
            <FileText size={40} />
          </div>
          <div className="teacher-stat-content">
            <h3>{stats.totalVivas}</h3>
            <p>Total Vivas</p>
            <span className="teacher-stat-trend">
              <TrendingUp size={16} />
              +5 this week
            </span>
          </div>
        </div>

        <div className="teacher-stat-card">
          <div className="teacher-stat-icon">
            <Users size={40} />
          </div>
          <div className="teacher-stat-content">
            <h3>{stats.totalStudents}</h3>
            <p>Total Students</p>
            <span className="teacher-stat-trend">
              <TrendingUp size={16} />
              +12 this week
            </span>
          </div>
        </div>

        <div className="teacher-stat-card">
          <div className="teacher-stat-icon">
            <BarChart3 size={40} />
          </div>
          <div className="teacher-stat-content">
            <h3>94%</h3>
            <p>Success Rate</p>
            <span className="teacher-stat-trend">
              <TrendingUp size={16} />
              +2% this week
            </span>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="teacher-main-content">
        {/* Quick Actions */}
        <div className="teacher-quick-actions-card">
          <h2>Quick Actions</h2>
          <div className="teacher-actions-grid">
            <button
              className="teacher-action-btn teacher-action-primary"
              onClick={() => setpopupStatus(true)}
            >
              <Plus size={20} />
              Create New Class
            </button>
            <button className="teacher-action-btn">
              <Upload size={20} />
              Upload Syllabus
            </button>
            <button className="teacher-action-btn">
              <Calendar size={20} />
              Schedule Test
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="teacher-activity-card">
          <h2>Recent Activity</h2>
          <div className="teacher-activity-list">
            <div className="teacher-activity-item">
              <div className="teacher-activity-icon">
                <FileText size={20} />
              </div>
              <div className="teacher-activity-content">
                <span className="teacher-activity-title">
                  Math Test - Algebra Basics
                </span>
                <span className="teacher-activity-time">2 hours ago</span>
              </div>
              <span className="teacher-activity-tag teacher-tag-test">
                Test
              </span>
            </div>
            <div className="teacher-activity-item">
              <div className="teacher-activity-icon">
                <BookOpen size={20} />
              </div>
              <div className="teacher-activity-content">
                <span className="teacher-activity-title">
                  Physics Class - Motion Laws
                </span>
                <span className="teacher-activity-time">5 hours ago</span>
              </div>
              <span className="teacher-activity-tag teacher-tag-class">
                Class
              </span>
            </div>
            <div className="teacher-activity-item">
              <div className="teacher-activity-icon">
                <Clock size={20} />
              </div>
              <div className="teacher-activity-content">
                <span className="teacher-activity-title">
                  Chemistry Assignment Due
                </span>
                <span className="teacher-activity-time">1 day ago</span>
              </div>
              <span className="teacher-activity-tag teacher-tag-assignment">
                Assignment
              </span>
            </div>
            <div className="teacher-activity-item">
              <div className="teacher-activity-icon">
                <Award size={20} />
              </div>
              <div className="teacher-activity-content">
                <span className="teacher-activity-title">
                  Biology Quiz Results
                </span>
                <span className="teacher-activity-time">2 days ago</span>
              </div>
              <span className="teacher-activity-tag teacher-tag-result">
                Result
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Classes Section */}
      <div className="teacher-classes-section">
        <div className="teacher-section-header">
          <h2>Your Classes</h2>
          <p>{ClassRoom.length} active classes</p>
        </div>
        <div className="teacher-classes-grid">
          {ClassRoom.length > 0 ? (
            ClassRoom.map((data, i) => (
              <div className="teacher-class-card" key={i}>
                <div className="teacher-class-card-header">
                  <div className="teacher-class-info">
                    <BookOpen size={54} className="teacher-class-icon" />
                    <div>
                      <h3>{data.classname}</h3>
                      <p className="teacher-class-code">Code: {data.code}</p>
                    </div>
                  </div>
                  <button
                    className="teacher-delete-btn"
                    onClick={() => HandleDeleteClass(data)}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                <div className="teacher-class-stats">
                  <div className="teacher-class-stat">
                    <Users size={16} />
                    <span>25 Students</span>
                  </div>
                  <div className="teacher-class-stat">
                    <FileText size={16} />
                    <span>3 Vivas</span>
                  </div>
                </div>
                <Link
                  to={`/class/overview/${data.code}`}
                  className="teacher-view-class-btn"
                >
                  <Eye size={18} />
                  View Class
                </Link>
              </div>
            ))
          ) : (
            <div className="teacher-empty-state">
              <BookOpen size={64} className="teacher-empty-icon" />
              <h3>No Classes Yet</h3>
              <p>Create your first class to get started</p>
              <button
                className="teacher-create-first-class-btn"
                onClick={() => setpopupStatus(true)}
              >
                <Plus size={20} />
                Create Your First Class
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Loading Overlay */}
      {isCreatingClass && (
        <div className="global-loading-overlay">
          <div className="global-loading-spinner">
            <Loader2 className="global-spinner-icon" size={48} />
            <p>Creating class...</p>
          </div>
        </div>
      )}

      {/* Create Class Modal */}
      {popupStatus && (
        <div
          className="teacher-modal-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget && !isCreatingClass) {
              setpopupStatus(false);
            }
          }}
        >
          <div className="teacher-modal-content">
            <div className="teacher-modal-header">
              <h2>Create New Class</h2>
              <button
                className="teacher-modal-close"
                onClick={() => setpopupStatus(false)}
                disabled={isCreatingClass}
              >
                ×
              </button>
            </div>
            <div className="teacher-modal-body">
              <div className="teacher-form-group">
                <label>Class Name</label>
                <input
                  type="text"
                  placeholder="Enter class name (e.g., Mathematics, Physics)"
                  name="classname"
                  value={formData.classname}
                  onChange={HandleInputchange}
                  disabled={isCreatingClass}
                />
              </div>
            </div>
            <div className="teacher-modal-footer">
              <button
                className="teacher-btn-secondary"
                onClick={() => setpopupStatus(false)}
                disabled={isCreatingClass}
              >
                Cancel
              </button>
              <button
                className="teacher-btn-primary"
                onClick={(e) => HandleCreteClass(e)}
                disabled={isCreatingClass}
              >
                {isCreatingClass ? (
                  <>
                    <Loader2 className="teacher-spinner" size={18} />
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus size={18} />
                    Create Class
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherDashboard;
