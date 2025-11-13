import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  TrendingUp,
  Users,
  FileText,
  Award,
  BarChart3,
  BookOpen,
  Target,
  Activity,
  Loader2,
  GraduationCap,
  Trophy,
  CheckCircle,
  Download,
} from "lucide-react";
import * as XLSX from "xlsx";
import "../CSS/analytics.css";

const VivaAnalytics = () => {
  const { UserInfo } = useSelector((state) => state.user);
  const [teacherId, setTeacherId] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState({
    totalStudents: 0,
    totalVivas: 0,
    totalClasses: 0,
    averageScore: 0,
    completionRate: 0,
    classPerformance: [],
    performanceDistribution: [],
    topStudents: [],
    classDetails: [],
    classActivity: [],
    classVivasData: [],
    allStudentsList: [],
  });

  const COLORS = ["#8b5cf6", "#ec4899", "#f59e0b", "#ef4444"];
  const PERFORMANCE_COLORS = {
    Excellent: "#10b981",
    Good: "#3b82f6",
    Average: "#f59e0b",
    "Below Average": "#ef4444",
  };

  useEffect(() => {
    if (UserInfo && UserInfo.length > 0) {
      setTeacherId(UserInfo[0].payload._id);
      if (UserInfo[0].payload.role != 1) {
        window.location.href = "/login";
      }
    }
  }, [UserInfo]);

  useEffect(() => {
    if (teacherId) {
      fetchAnalyticsData();
    }
  }, [teacherId]);

  const fetchAnalyticsData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:5050/bin/get/analytics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teacherId: teacherId }),
      });

      const result = await response.json();

      if (result.classes && result.classes.length > 0) {
        await processAnalyticsData(result); // AWAIT the async function
      } else {
        setAnalyticsData({
          totalStudents: 0,
          totalVivas: 0,
          totalClasses: 0,
          averageScore: 0,
          completionRate: 0,
          classPerformance: [],
          performanceDistribution: [],
          topStudents: [],
          classDetails: [],
          classActivity: [],
          allStudentsList: [],
        });
      }
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const processAnalyticsData = async (data) => {
    console.log("Processing analytics data:", data);
    
    let totalStudents = 0;
    let totalScores = 0;
    let totalSubmissions = 0;
    const allStudents = [];
    const allStudentsList = []; // For complete student list
    const classPerformance = [];
    const classDetails = [];

    // Performance distribution counters
    let excellent = 0;
    let good = 0;
    let average = 0;
    let belowAverage = 0;

    data.classes.forEach((cls) => {
      const classStudents = cls.students || [];
      const classTotal = classStudents.length;
      totalStudents += classTotal;

      let classScoreSum = 0;
      let classSubmissions = 0;

      classStudents.forEach((student) => {
        console.log("Processing student:", student);
        
        const score = student.score || 0;
        classScoreSum += score;
        totalScores += score;

        if (score > 0) {
          classSubmissions++;
          totalSubmissions++;

          // Categorize performance
          const percentage = score;
          if (percentage >= 80) excellent++;
          else if (percentage >= 60) good++;
          else if (percentage >= 40) average++;
          else belowAverage++;

          // Use data directly from backend (already populated)
          allStudents.push({
            studentId: student.studentId,
            name: student.name || "Unknown Student",
            enrollment: student.enrollment || "N/A",
            email: student.email || "N/A",
            score: score,
            className: cls.classname,
          });
        }

        // Add to complete list - use backend data directly
        allStudentsList.push({
          studentId: student.studentId,
          name: student.name || "Unknown Student",
          enrollment: student.enrollment || "N/A",
          email: student.email || "N/A",
          score: score,
          className: cls.classname,
        });
      });

      const classAvg = classSubmissions > 0 ? (classScoreSum / classSubmissions).toFixed(1) : 0;

      classPerformance.push({
        name: cls.classname,
        avgScore: parseFloat(classAvg),
        students: classTotal,
      });

      classDetails.push({
        className: cls.classname,
        code: cls.code,
        totalStudents: classTotal,
        totalVivas: 0,
        averageScore: parseFloat(classAvg),
        completionRate: classTotal > 0 ? ((classSubmissions / classTotal) * 100).toFixed(1) : 0,
      });
    });

    console.log("All students for top 5:", allStudents);
    console.log("All students list:", allStudentsList.slice(0, 5));

    // Calculate overall average
    const overallAverage = totalSubmissions > 0 ? (totalScores / totalSubmissions).toFixed(1) : 0;

    // Calculate completion rate
    const completionRate = totalStudents > 0 ? ((totalSubmissions / totalStudents) * 100).toFixed(1) : 0;

    // Performance distribution
    const performanceDistribution = [
      { name: "Excellent (80-100%)", value: excellent, color: PERFORMANCE_COLORS.Excellent },
      { name: "Good (60-79%)", value: good, color: PERFORMANCE_COLORS.Good },
      { name: "Average (40-59%)", value: average, color: PERFORMANCE_COLORS.Average },
      { name: "Below Average (<40%)", value: belowAverage, color: PERFORMANCE_COLORS["Below Average"] },
    ];

    // Top 5 students - sorted by highest score
    const topStudents = allStudents
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);

    // Class activity data for new graph
    const classActivity = classPerformance.map((cls) => ({
      name: cls.name,
      students: cls.students,
    }));

    // Fetch vivas count for each class
    const classVivasData = [];
    for (const cls of data.classes) {
      try {
        const vivaResponse = await fetch("http://localhost:5050/bin/get/vivavbyclasscode", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ classCode: cls.code }),
        });
        const vivas = await vivaResponse.json();
        classVivasData.push({
          name: cls.classname,
          vivas: vivas.length || 0,
        });
      } catch (error) {
        console.error("Error fetching vivas for class:", cls.classname, error);
        classVivasData.push({
          name: cls.classname,
          vivas: 0,
        });
      }
    }

    setAnalyticsData({
      totalStudents,
      totalVivas: data.totalClasses || 0,
      totalClasses: data.totalClasses || 0,
      averageScore: parseFloat(overallAverage),
      completionRate: parseFloat(completionRate),
      classPerformance,
      performanceDistribution,
      topStudents,
      classDetails,
      classActivity,
      classVivasData, // Class-wise vivas count
      allStudentsList, // Complete student list
    });
  };

  const handleDownloadStudentList = () => {
    if (analyticsData.allStudentsList.length === 0) {
      alert("No student data to download");
      return;
    }

    const excelData = analyticsData.allStudentsList.map((student, index) => ({
      "Sr. No.": index + 1,
      "Student Name": student.name,
      "Enrollment Number": student.enrollment,
      "Email Address": student.email,
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    worksheet["!cols"] = [
      { wch: 8 },
      { wch: 30 },
      { wch: 20 },
      { wch: 35 },
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "All Students");

    const filename = `All_Students_${new Date().toISOString().split("T")[0]}.xlsx`;
    XLSX.writeFile(workbook, filename);
  };

  if (isLoading) {
    return (
      <div className="analytics-loading">
        <Loader2 className="analytics-spinner" size={48} />
        <p>Loading analytics...</p>
      </div>
    );
  }

  return (
    <div className="analytics-container">
      {/* Header Section */}
      <div className="analytics-header">
        <div className="analytics-header-background">
          <div className="analytics-header-pattern"></div>
          <div className="analytics-header-gradient"></div>
        </div>

        <div className="analytics-header-content">
          <div className="analytics-header-info">
            <div className="analytics-header-icon-container">
              <BarChart3 size={56} className="analytics-header-icon" />
              <div className="analytics-header-icon-glow"></div>
            </div>
            <div className="analytics-header-text">
              <h1>Analytics Dashboard</h1>
              <p>Comprehensive insights into your teaching performance</p>
            </div>
          </div>
        </div>
      </div>

      {/* Overview Statistics */}
      <div className="analytics-stats-section">
        <div className="analytics-stat-card">
          <div className="analytics-stat-icon">
            <Users size={40} />
          </div>
          <div className="analytics-stat-content">
            <h3>{analyticsData.totalStudents}</h3>
            <p>Total Students</p>
            <span className="analytics-stat-trend">
              <TrendingUp size={16} />
              Across all classes
            </span>
          </div>
        </div>

        <div className="analytics-stat-card">
          <div className="analytics-stat-icon">
            <FileText size={40} />
          </div>
          <div className="analytics-stat-content">
            <h3>{analyticsData.totalVivas}</h3>
            <p>Total Vivas</p>
            <span className="analytics-stat-trend">
              <Activity size={16} />
              Conducted
            </span>
          </div>
        </div>

        <div className="analytics-stat-card">
          <div className="analytics-stat-icon">
            <Award size={40} />
          </div>
          <div className="analytics-stat-content">
            <h3>{analyticsData.averageScore}%</h3>
            <p>Average Score</p>
            <span className="analytics-stat-trend">
              <Target size={16} />
              Overall performance
            </span>
          </div>
        </div>

        <div className="analytics-stat-card">
          <div className="analytics-stat-icon">
            <CheckCircle size={40} />
          </div>
          <div className="analytics-stat-content">
            <h3>{analyticsData.completionRate}%</h3>
            <p>Completion Rate</p>
            <span className="analytics-stat-trend">
              <TrendingUp size={16} />
              Student engagement
            </span>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="analytics-charts-grid">
        {/* Class Performance Comparison */}
        <div className="analytics-chart-card analytics-chart-large">
          <div className="analytics-chart-header">
            <div className="analytics-chart-title">
              <BarChart3 size={24} />
              <div>
                <h3>Class Performance Comparison</h3>
                <p>Average scores across different classes</p>
              </div>
            </div>
          </div>
          <div className="analytics-chart-body">
            {analyticsData.classPerformance.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analyticsData.classPerformance}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="name" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip
                    contentStyle={{
                      background: "rgba(30, 30, 30, 0.95)",
                      border: "1px solid rgba(139, 92, 246, 0.3)",
                      borderRadius: "8px",
                      color: "white",
                    }}
                  />
                  <Bar dataKey="avgScore" fill="url(#colorGradient)" radius={[8, 8, 0, 0]} />
                  <defs>
                    <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#8b5cf6" stopOpacity={1} />
                      <stop offset="100%" stopColor="#ec4899" stopOpacity={1} />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="analytics-no-data">
                <BookOpen size={48} />
                <p>No class performance data available</p>
              </div>
            )}
          </div>
        </div>

        {/* Student Performance Distribution */}
        <div className="analytics-chart-card">
          <div className="analytics-chart-header">
            <div className="analytics-chart-title">
              <Target size={24} />
              <div>
                <h3>Performance Distribution</h3>
                <p>Student performance categories</p>
              </div>
            </div>
          </div>
          <div className="analytics-chart-body">
            {analyticsData.performanceDistribution.some((d) => d.value > 0) ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={analyticsData.performanceDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {analyticsData.performanceDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: "rgba(30, 30, 30, 0.95)",
                      border: "1px solid rgba(139, 92, 246, 0.3)",
                      borderRadius: "8px",
                      color: "white",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="analytics-no-data">
                <Target size={48} />
                <p>No performance data available</p>
              </div>
            )}
          </div>
        </div>

        {/* Viva Completion Rate */}
        <div className="analytics-chart-card">
          <div className="analytics-chart-header">
            <div className="analytics-chart-title">
              <Activity size={24} />
              <div>
                <h3>Viva Completion Rate</h3>
                <p>Student engagement level</p>
              </div>
            </div>
          </div>
          <div className="analytics-chart-body analytics-completion-body">
            <div className="analytics-completion-circle">
              <svg viewBox="0 0 200 200" className="analytics-circle-svg">
                <circle
                  cx="100"
                  cy="100"
                  r="80"
                  fill="none"
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="20"
                />
                <circle
                  cx="100"
                  cy="100"
                  r="80"
                  fill="none"
                  stroke="url(#completionGradient)"
                  strokeWidth="20"
                  strokeDasharray={`${(analyticsData.completionRate / 100) * 502.4} 502.4`}
                  strokeLinecap="round"
                  transform="rotate(-90 100 100)"
                />
                <defs>
                  <linearGradient id="completionGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#ec4899" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="analytics-completion-text">
                <h2>{analyticsData.completionRate}%</h2>
                <p>Completed</p>
              </div>
            </div>
            <div className="analytics-completion-info">
              <p>
                <strong>{Math.round((analyticsData.totalStudents * analyticsData.completionRate) / 100)}</strong> out of{" "}
                <strong>{analyticsData.totalStudents}</strong> students have completed vivas
              </p>
            </div>
          </div>
        </div>

        {/* Class Activity - New Graph */}
        <div className="analytics-chart-card">
          <div className="analytics-chart-header">
            <div className="analytics-chart-title">
              <Users size={24} />
              <div>
                <h3>Class Student Distribution</h3>
                <p>Number of students in each class</p>
              </div>
            </div>
          </div>
          <div className="analytics-chart-body">
            {analyticsData.classActivity && analyticsData.classActivity.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analyticsData.classActivity}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="name" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip
                    contentStyle={{
                      background: "rgba(30, 30, 30, 0.95)",
                      border: "1px solid rgba(139, 92, 246, 0.3)",
                      borderRadius: "8px",
                      color: "white",
                    }}
                  />
                  <Bar dataKey="students" fill="url(#activityGradient)" radius={[8, 8, 0, 0]} />
                  <defs>
                    <linearGradient id="activityGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity={1} />
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity={1} />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="analytics-no-data">
                <Users size={48} />
                <p>No class activity data available</p>
              </div>
            )}
          </div>
        </div>

        {/* Class-wise Vivas Count */}
        <div className="analytics-chart-card">
          <div className="analytics-chart-header">
            <div className="analytics-chart-title">
              <FileText size={24} />
              <div>
                <h3>Class-wise Vivas</h3>
                <p>Number of vivas in each class</p>
              </div>
            </div>
          </div>
          <div className="analytics-chart-body">
            {analyticsData.classVivasData && analyticsData.classVivasData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analyticsData.classVivasData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="name" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip
                    contentStyle={{
                      background: "rgba(30, 30, 30, 0.95)",
                      border: "1px solid rgba(139, 92, 246, 0.3)",
                      borderRadius: "8px",
                      color: "white",
                    }}
                  />
                  <Bar dataKey="vivas" fill="url(#vivasGradient)" radius={[8, 8, 0, 0]} />
                  <defs>
                    <linearGradient id="vivasGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#f59e0b" stopOpacity={1} />
                      <stop offset="100%" stopColor="#ef4444" stopOpacity={1} />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="analytics-no-data">
                <FileText size={48} />
                <p>No viva data available</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Top Students Leaderboard */}
      <div className="analytics-section">
        <div className="analytics-section-header">
          <Trophy size={28} />
          <div>
            <h2>Top 5 Students</h2>
            <p>Highest performing students across all classes</p>
          </div>
        </div>
        <div className="analytics-leaderboard">
          {analyticsData.topStudents.length > 0 ? (
            analyticsData.topStudents.map((student, index) => (
              <div key={index} className="analytics-leaderboard-item">
                <div className="analytics-rank">
                  {index === 0 && <Trophy size={24} className="analytics-trophy-gold" />}
                  {index === 1 && <Trophy size={24} className="analytics-trophy-silver" />}
                  {index === 2 && <Trophy size={24} className="analytics-trophy-bronze" />}
                  {index > 2 && <span className="analytics-rank-number">#{index + 1}</span>}
                </div>
                <div className="analytics-student-info">
                  <h4>{student.name}</h4>
                  <p>
                    {student.enrollment} • {student.className}
                  </p>
                </div>
                <div className="analytics-student-score">
                  <span className="analytics-score-value">{student.score}%</span>
                </div>
              </div>
            ))
          ) : (
            <div className="analytics-no-data">
              <GraduationCap size={48} />
              <p>No student data available yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Class-wise Statistics Table */}
      <div className="analytics-section">
        <div className="analytics-section-header">
          <BookOpen size={28} />
          <div>
            <h2>Class-wise Statistics</h2>
            <p>Detailed breakdown of each class performance</p>
          </div>
        </div>
        <div className="analytics-table-container">
          {analyticsData.classDetails.length > 0 ? (
            <table className="analytics-table">
              <thead>
                <tr>
                  <th>Class Name</th>
                  <th>Students</th>
                  <th>Average Score</th>
                  <th>Completion Rate</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {analyticsData.classDetails.map((cls, index) => (
                  <tr key={index}>
                    <td>
                      <div className="analytics-class-name">
                        <BookOpen size={18} />
                        <span>{cls.className}</span>
                      </div>
                    </td>
                    <td>{cls.totalStudents}</td>
                    <td>
                      <span className="analytics-score-badge">{cls.averageScore}%</span>
                    </td>
                    <td>
                      <div className="analytics-progress-bar-small">
                        <div
                          className="analytics-progress-fill-small"
                          style={{ width: `${cls.completionRate}%` }}
                        ></div>
                      </div>
                      <span className="analytics-progress-text-small">{cls.completionRate}%</span>
                    </td>
                    <td>
                      <span
                        className={`analytics-status-badge ${
                          cls.averageScore >= 70 ? "status-good" : cls.averageScore >= 50 ? "status-average" : "status-poor"
                        }`}
                      >
                        {cls.averageScore >= 70 ? "Excellent" : cls.averageScore >= 50 ? "Good" : "Needs Attention"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="analytics-no-data">
              <BookOpen size={48} />
              <p>No class data available</p>
            </div>
          )}
        </div>
      </div>

      {/* Complete Student List */}
      <div className="analytics-section">
        <div className="analytics-section-header">
          <GraduationCap size={28} />
          <div>
            <h2>All Students</h2>
            <p>Complete list of all students across all classes</p>
          </div>
          <button className="analytics-download-btn" onClick={handleDownloadStudentList}>
            <Download size={20} />
            Download Excel
          </button>
        </div>
        <div className="analytics-table-container">
          {analyticsData.allStudentsList && analyticsData.allStudentsList.length > 0 ? (
            <table className="analytics-table">
              <thead>
                <tr>
                  <th>Sr.</th>
                  <th>Student Name</th>
                  <th>Enrollment Number</th>
                  <th>Email Address</th>
                </tr>
              </thead>
              <tbody>
                {analyticsData.allStudentsList.map((student, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>
                      <div className="analytics-class-name">
                        <GraduationCap size={18} />
                        <span>{student.name}</span>
                      </div>
                    </td>
                    <td>{student.enrollment}</td>
                    <td className="analytics-email-cell">{student.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="analytics-no-data">
              <GraduationCap size={48} />
              <p>No student data available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VivaAnalytics;
