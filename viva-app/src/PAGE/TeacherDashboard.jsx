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
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [classToDelete, setClassToDelete] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [stats, setStats] = useState({
    totalClasses: 0,
    totalVivas: 0,
    totalStudents: 0,
    successRate: 0,
  });
  const [showCelebration, setShowCelebration] = useState(false);
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
        const data = await fetch("http://localhost:5050/bin/get/teacher-classes-with-stats", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ teacherid: userid }),
        });
        const result = await data.json();
        if (result.message.length > 0) {
          setClassRoom(result.message);

          // Use real stats from backend
          setStats(result.totalStats);

          // Calculate real success rate from analytics
          try {
            const analyticsResponse = await fetch("http://localhost:5050/bin/get/analytics", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ teacherId: userid }),
            });
            const analyticsData = await analyticsResponse.json();

            if (analyticsData.classes && analyticsData.classes.length > 0) {
              let totalScore = 0;
              let totalSubmissions = 0;

              analyticsData.classes.forEach((cls) => {
                cls.students.forEach((student) => {
                  if (student.score > 0) {
                    totalScore += student.score;
                    totalSubmissions++;
                  }
                });
              });

              const successRate = totalSubmissions > 0 ? Math.round(totalScore / totalSubmissions) : 0;
              setStats((prev) => ({ ...prev, successRate }));
            }
          } catch (error) {
            console.log("Error fetching success rate:", error);
          }
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
        // Add the new class with initial counts
        const newClass = {
          ...Data.result,
          studentCount: 0,
          vivaCount: 0,
        };
        setClassRoom([...ClassRoom, newClass]);

        // Update stats
        const newTotalClasses = ClassRoom.length + 1;
        setStats({
          totalClasses: newTotalClasses,
          totalVivas: stats.totalVivas, // Keep current total
          totalStudents: stats.totalStudents, // Keep current total
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
    setClassToDelete(classData);
    setDeleteConfirmation("");
    setDeleteModalOpen(true);
  };

  const HandleConfirmDelete = async () => {
    if (deleteConfirmation !== classToDelete.classname) {
      alert("Class name doesn't match. Please type the exact class name.");
      return;
    }

    setIsDeleting(true);
    try {
      const response = await fetch("http://localhost:5050/bin/delete/class", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ classCode: classToDelete.code }),
      });

      const result = await response.json();

      if (response.ok) {
        // Remove from local state
        const updatedClasses = ClassRoom.filter(
          (item) => item.code !== classToDelete.code
        );
        setClassRoom(updatedClasses);

        // Update stats
        setStats({
          totalClasses: updatedClasses.length,
          totalVivas: stats.totalVivas - (classToDelete.vivaCount || 0),
          totalStudents: stats.totalStudents - (classToDelete.studentCount || 0),
        });

        // Close modal and reset
        setDeleteModalOpen(false);
        setClassToDelete(null);
        setDeleteConfirmation("");

        alert(`Class "${classToDelete.classname}" and all associated vivas deleted successfully.`);
      } else {
        alert(result.message || "Failed to delete class. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting class:", error);
      alert("An error occurred while deleting the class.");
    } finally {
      setIsDeleting(false);
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
            <button 
              className="teacher-notification-btn"
            >
              <Activity size={20} />
              <span className="teacher-notification-badge">3</span>
            </button>
          </div>
          
          {/* Celebration Animation */}
          {showCelebration && (
            <div className="celebration-overlay">
              <div className="celebration-star star-1">⭐</div>
              <div className="celebration-star star-2">✨</div>
              <div className="celebration-star star-3">💫</div>
              <div className="celebration-star star-4">🌟</div>
              <div className="celebration-star star-5">⭐</div>
              <div className="celebration-star star-6">✨</div>
              <div className="celebration-star star-7">💫</div>
              <div className="celebration-star star-8">🌟</div>
              <div className="celebration-message">
                <h2>🎉 Happy New Year! 🎊</h2>
                <p>Wishing you success!</p>
              </div>
            </div>
          )}
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
            <h3>{stats.successRate}%</h3>
            <p>Success Rate</p>
            <span className="teacher-stat-trend">
              <TrendingUp size={16} />
              Average score
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
            <button className="teacher-action-btn" style={{ opacity: 0.6, cursor: "not-allowed" }} disabled>
              <Upload size={20} />
              Upload Syllabus
              <span style={{ marginLeft: "auto", fontSize: "0.85rem", color: "#9ca3af" }}>Coming Soon</span>
            </button>
            <button className="teacher-action-btn" style={{ opacity: 0.6, cursor: "not-allowed" }} disabled>
              <Calendar size={20} />
              Schedule Test
              <span style={{ marginLeft: "auto", fontSize: "0.85rem", color: "#9ca3af" }}>Coming Soon</span>
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
                    <span>{data.studentCount || 0} Students</span>
                  </div>
                  <div className="teacher-class-stat">
                    <FileText size={16} />
                    <span>{data.vivaCount || 0} Vivas</span>
                  </div>
                </div>
                <Link
                  to={`/class/overview/${data.code}`}
                  state={{ className: data.classname }}
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

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && classToDelete && (
        <div
          className="teacher-modal-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget && !isDeleting) {
              setDeleteModalOpen(false);
              setClassToDelete(null);
              setDeleteConfirmation("");
            }
          }}
        >
          <div className="teacher-modal-content">
            <div className="teacher-modal-header">
              <h2>⚠️ Delete Class</h2>
              <button
                className="teacher-modal-close"
                onClick={() => {
                  setDeleteModalOpen(false);
                  setClassToDelete(null);
                  setDeleteConfirmation("");
                }}
                disabled={isDeleting}
              >
                ×
              </button>
            </div>
            <div className="teacher-modal-body">
              <div style={{ marginBottom: "20px" }}>
                <p style={{ color: "#f87171", fontWeight: "600", marginBottom: "10px" }}>
                  This action cannot be undone!
                </p>
                <p style={{ color: "#9ca3af", marginBottom: "15px" }}>
                  Deleting this class will permanently remove:
                </p>
                <ul style={{ color: "#9ca3af", marginLeft: "20px", marginBottom: "15px" }}>
                  <li>The class "{classToDelete.classname}"</li>
                  <li>All {classToDelete.vivaCount || 0} vivas in this class</li>
                  <li>All student results and submissions</li>
                  <li>All associated data</li>
                </ul>
              </div>
              <div className="teacher-form-group">
                <label>Type the class name to confirm: <strong>{classToDelete.classname}</strong></label>
                <input
                  type="text"
                  placeholder={`Type "${classToDelete.classname}" to confirm`}
                  value={deleteConfirmation}
                  onChange={(e) => setDeleteConfirmation(e.target.value)}
                  disabled={isDeleting}
                  style={{ 
                    borderColor: deleteConfirmation && deleteConfirmation !== classToDelete.classname 
                      ? "rgba(239, 68, 68, 0.5)" 
                      : "rgba(139, 92, 246, 0.3)" 
                  }}
                />
              </div>
            </div>
            <div className="teacher-modal-footer">
              <button
                className="teacher-btn-secondary"
                onClick={() => {
                  setDeleteModalOpen(false);
                  setClassToDelete(null);
                  setDeleteConfirmation("");
                }}
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                className="teacher-btn-primary"
                onClick={HandleConfirmDelete}
                disabled={isDeleting || deleteConfirmation !== classToDelete.classname}
                style={{
                  background: "linear-gradient(90deg, #ef4444, #dc2626)",
                  opacity: deleteConfirmation !== classToDelete.classname ? 0.5 : 1,
                }}
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="teacher-spinner" size={18} />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 size={18} />
                    Delete Class
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
