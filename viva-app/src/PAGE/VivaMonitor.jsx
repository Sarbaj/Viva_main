import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { getApiUrl } from "../utils/api";
import {
  ArrowLeft,
  BookOpen,
  Clock,
  FileText,
  Users,
  Download,
  CheckCircle,
  XCircle,
  Activity,
  Calendar,
  TrendingUp,
} from "lucide-react";
import * as XLSX from "xlsx";
import "../CSS/vivamonitor.css";

const VivaMonitor = () => {
  const { vivaId } = useParams();
  const navigate = useNavigate();
  const [vivaData, setVivaData] = useState(null);
  const [students, setStudents] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    submitted: 0,
    inProgress: 0,
    notStarted: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [className, setClassName] = useState("");

  useEffect(() => {
    fetchVivaMonitorData();
  }, [vivaId]);

  const fetchVivaMonitorData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(getApiUrl("bin/viva/monitor-data"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vivaId: vivaId }),
      });

      const result = await response.json();
      
      if (result.success) {
        console.log("Viva Data:", result.viva);
        console.log("Total Questions:", result.viva.totalquetions, "Type:", typeof result.viva.totalquetions);
        console.log("Marks Per Question:", result.viva.marksPerQuestion, "Type:", typeof result.viva.marksPerQuestion);
        console.log("Total Possible Marks:", parseInt(result.viva.totalquetions) * (result.viva.marksPerQuestion || 1));
        
        setVivaData(result.viva);
        setStudents(result.students);
        setStats(result.stats);
        setClassName(result.className);
      } else {
        toast.error("Failed to load viva data");
      }
    } catch (error) {
      console.error("Error fetching viva monitor data:", error);
      toast.error("An error occurred while loading data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEndViva = async () => {
    const confirmEnd = window.confirm(
      "Are you sure you want to END this viva?\n\n⚠️ This will:\n- Permanently end the viva\n- Students can no longer access it\n- Viva cannot be restarted or edited\n- This action cannot be undone\n\nDo you want to continue?"
    );

    if (!confirmEnd) return;

    try {
      const response = await fetch(getApiUrl("bin/viva/toggle-status"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vivaId: vivaId, status: "ended" }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Viva ended successfully! 🎉");
        // Update local state
        setVivaData({ ...vivaData, status: "ended" });
        // Refresh data to get updated student statuses
        setTimeout(() => {
          fetchVivaMonitorData();
        }, 1000);
      } else {
        toast.error("Failed to end viva");
      }
    } catch (error) {
      console.error("Error ending viva:", error);
      toast.error("An error occurred while ending the viva");
    }
  };

  const handleDownloadExcel = () => {
    if (students.length === 0) {
      toast.error("No student data to download");
      return;
    }

    // Calculate total possible marks
    const marksPerQuestion = vivaData.marksPerQuestion || 1;
    const totalPossibleMarks = parseInt(vivaData.totalquetions) * marksPerQuestion;
    
    // Prepare data for Excel
    const excelData = students.map((student, index) => ({
      "Sr. No.": index + 1,
      "Enrollment": student.enrollment,
      "Student Name": student.name,
      "Email": student.email,
      "Status": student.status === "submitted" ? "Submitted" : 
                student.status === "in-progress" ? "In Progress" : "Not Submitted",
      "Marks": student.marks !== null ? `${student.marks}/${totalPossibleMarks}` : "-",
      "Submitted At": student.submittedAt ? new Date(student.submittedAt).toLocaleString() : "-",
    }));

    // Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    
    // Set column widths
    worksheet['!cols'] = [
      { wch: 8 },  // Sr. No.
      { wch: 15 }, // Enrollment
      { wch: 20 }, // Student Name
      { wch: 25 }, // Email
      { wch: 15 }, // Status
      { wch: 10 }, // Marks
      { wch: 20 }, // Submitted At
    ];

    // Create workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Viva Results");

    // Generate filename
    const filename = `${vivaData.title.replace(/\s+/g, '_')}_Results_${new Date().toISOString().split('T')[0]}.xlsx`;

    // Download
    XLSX.writeFile(workbook, filename);
    toast.success("Excel file downloaded successfully! 📥");
  };

  if (isLoading) {
    return (
      <div className="viva-monitor-loading">
        <div className="viva-monitor-spinner"></div>
        <p>Loading viva data...</p>
      </div>
    );
  }

  if (!vivaData) {
    return (
      <div className="viva-monitor-error">
        <h2>Viva not found</h2>
        <button onClick={() => navigate(-1)}>Go Back</button>
      </div>
    );
  }

  return (
    <>
      <div className="viva-monitor-container">
        {/* Header */}
        <div className="viva-monitor-header">
          <button
            onClick={() => navigate(-1)}
            className="viva-monitor-back-btn"
          >
            <ArrowLeft size={20} /> Back
          </button>

          <div className="viva-monitor-header-content">
            <div className="viva-monitor-title-section">
              <BookOpen size={48} className="viva-monitor-icon" />
              <div>
                <h1>{vivaData.title}</h1>
                <p className="viva-monitor-class-name">{className}</p>
              </div>
            </div>

            <div className="viva-monitor-header-details">
              <div className="viva-monitor-detail-item">
                <Calendar size={18} />
                <span>{new Date(vivaData.date).toLocaleDateString()}</span>
              </div>
              <div className="viva-monitor-detail-item">
                <Clock size={18} />
                <span>{vivaData.time} minutes</span>
              </div>
              <div className="viva-monitor-detail-item">
                <FileText size={18} />
                <span>{vivaData.totalquetions} questions</span>
              </div>
              <div className="viva-monitor-detail-item">
                {vivaData.status === "active" || vivaData.status === "true" ? (
                  <span className="viva-monitor-status-active">
                    <CheckCircle size={18} /> Active
                  </span>
                ) : vivaData.status === "ended" ? (
                  <span className="viva-monitor-status-ended">
                    <XCircle size={18} /> Ended
                  </span>
                ) : (
                  <span className="viva-monitor-status-inactive">
                    <XCircle size={18} /> Inactive
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="viva-monitor-header-actions">
            <button
              onClick={handleDownloadExcel}
              className="viva-monitor-download-btn"
            >
              <Download size={20} />
              Download Excel
            </button>
            {(vivaData.status === "active" || vivaData.status === "true") && (
              <button
                onClick={handleEndViva}
                className="viva-monitor-end-btn"
              >
                <XCircle size={20} />
                End Viva
              </button>
            )}
          </div>
        </div>

        {/* Syllabus Section */}
        {vivaData.syllabus && (
          <div className="viva-monitor-syllabus-section">
            <div className="viva-monitor-syllabus-header">
              <BookOpen size={24} />
              <h3>Syllabus</h3>
            </div>
            <div className="viva-monitor-syllabus-content">
              <p>{vivaData.syllabus}</p>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="viva-monitor-stats">
          <div className="viva-monitor-stat-card">
            <div className="viva-monitor-stat-icon total">
              <Users size={32} />
            </div>
            <div className="viva-monitor-stat-content">
              <h3>{stats.total}</h3>
              <p>Total Students</p>
            </div>
          </div>

          <div className="viva-monitor-stat-card">
            <div className="viva-monitor-stat-icon submitted">
              <CheckCircle size={32} />
            </div>
            <div className="viva-monitor-stat-content">
              <h3>{stats.submitted}</h3>
              <p>Submitted</p>
            </div>
          </div>

          <div className="viva-monitor-stat-card">
            <div className="viva-monitor-stat-icon progress">
              <Activity size={32} />
            </div>
            <div className="viva-monitor-stat-content">
              <h3>{stats.inProgress}</h3>
              <p>In Progress</p>
            </div>
          </div>

          <div className="viva-monitor-stat-card">
            <div className="viva-monitor-stat-icon pending">
              <XCircle size={32} />
            </div>
            <div className="viva-monitor-stat-content">
              <h3>{stats.notStarted}</h3>
              <p>Not Started</p>
            </div>
          </div>
        </div>

        {/* Students Table */}
        <div className="viva-monitor-table-section">
          <div className="viva-monitor-section-header">
            <h2>
              <Users size={24} />
              Student Submissions
            </h2>
            <p>{students.length} students enrolled</p>
          </div>

          <div className="viva-monitor-table-container">
            <table className="viva-monitor-table">
              <thead>
                <tr>
                  <th>Sr.</th>
                  <th>Enrollment</th>
                  <th>Student Name</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Marks</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student, index) => (
                  <tr key={student._id}>
                    <td>{index + 1}</td>
                    <td className="viva-monitor-enrollment">{student.enrollment}</td>
                    <td className="viva-monitor-name">{student.name}</td>
                    <td className="viva-monitor-email">{student.email}</td>
                    <td>
                      {student.status === "submitted" ? (
                        <span className="viva-monitor-badge submitted">
                          <CheckCircle size={16} /> Submitted
                        </span>
                      ) : student.status === "in-progress" ? (
                        <span className="viva-monitor-badge progress">
                          <Activity size={16} /> In Progress
                        </span>
                      ) : (
                        <span className="viva-monitor-badge pending">
                          <XCircle size={16} /> Not Started
                        </span>
                      )}
                    </td>
                    <td className="viva-monitor-marks">
                      {student.marks !== null ? (
                        <span className="viva-monitor-marks-value">
                          {student.marks}/{(parseInt(vivaData.totalquetions) * (vivaData.marksPerQuestion || 1))}
                        </span>
                      ) : (
                        <span className="viva-monitor-marks-dash">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
        draggable
        pauseOnFocusLoss
      />
    </>
  );
};

export default VivaMonitor;
