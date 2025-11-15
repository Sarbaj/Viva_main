import React from "react";
import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import { getApiUrl } from "../utils/api";
import {
  BookOpen,
  Calendar,
  Clock,
  FileText,
  Lock,
  CheckCircle,
  ArrowLeft,
  Eye,
  XCircle,
} from "lucide-react";
import "../CSS/classvivaspage.css";

const ClassVivasPage = () => {
  const { classCode } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [vivas, setVivas] = useState([]);
  const [classname, setClassname] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [userid, setUserId] = useState("");
  const [submittedVivas, setSubmittedVivas] = useState([]);
  const [showResultModal, setShowResultModal] = useState(false);
  const [selectedVivaResult, setSelectedVivaResult] = useState(null);
  const [activeFilter, setActiveFilter] = useState("not-submitted");
  const [allVivas, setAllVivas] = useState([]);
  const { UserInfo} = useSelector((state) => state.user);

  useEffect(() => {
    if (UserInfo && UserInfo.length > 0) {
      setUserId(UserInfo[0].payload._id);
      if (UserInfo[0].payload.role != 0) {
        window.location.href = "/login";
      }
    }
  }, [UserInfo]);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          window.location.href = "/login";
        }
        const response = await fetch(getApiUrl("bin/getUsername"), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        });

        if (!response.ok) {
          window.location.href = "/login";
        }

        const data = await response.json();

        if (data.payload.role != 0) {
          window.location.href = "/login";
        }
      } catch (error) {
        console.log("error");
      }
    };
    verifyToken();
  }, []);

  useEffect(() => {
    const fetchClassVivas = async () => {
      if (!userid) return;

      setIsLoading(true);
      try {
        const response = await fetch(
          getApiUrl("bin/get/viva-info"),
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ studentId: userid }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          // Filter vivas for this specific class
          const classVivas = data.vivas.filter(
            (viva) => viva.classCode === classCode
          );
          setAllVivas(classVivas);

          // Fetch student's submitted vivas
          const resultsResponse = await fetch(
            getApiUrl("bin/get/studentinresult"),
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ classCode: classCode, student: userid }),
            }
          );

          let submittedIds = [];
          if (resultsResponse.ok) {
            const resultsData = await resultsResponse.json();
            // Get list of submitted viva IDs
            submittedIds = resultsData
              .filter(result => result.active === false)
              .map(result => result.vivaId);
            setSubmittedVivas(submittedIds);
          }

          // Apply default filter (not-submitted)
          // Show vivas that are NOT submitted AND NOT ended
          const notSubmittedVivas = classVivas.filter((viva) => {
            const isSubmitted = submittedIds.includes(viva._id);
            const isEnded = viva.status === "ended";
            return !isSubmitted && !isEnded;
          });
          setVivas(notSubmittedVivas);

          // Use class name from navigation state if available
          if (location.state?.className) {
            setClassname(location.state.className);
          } else {
            // Fallback: Fetch class name from backend
            try {
              const classInfoResponse = await fetch(
                getApiUrl("bin/get/class-info"),
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({ classCode: classCode }),
                }
              );

              if (classInfoResponse.ok) {
                const classInfoData = await classInfoResponse.json();
                if (classInfoData.success && classInfoData.className) {
                  setClassname(classInfoData.className);
                } else {
                  setClassname(`Class ${classCode}`);
                }
              } else {
                setClassname(`Class ${classCode}`);
              }
            } catch (error) {
              console.log("Failed to fetch class name:", error);
              setClassname(`Class ${classCode}`);
            }
          }
        }
        setIsLoading(false);
      } catch (error) {
        console.log(error);
        setIsLoading(false);
        toast.error("Failed to load vivas");
      }
    };

    fetchClassVivas();
  }, [userid, classCode, location.state]);

  const handleAttendViva = (viva) => {
    if (viva.status === "false") {
      toast.error("This viva is not active yet");
      return;
    }
    localStorage.setItem("VivaId", viva._id);
    navigate("/vivatest");
  };

  const handleFilterNotSubmitted = () => {
    setActiveFilter("not-submitted");
    // Show vivas that are NOT submitted AND NOT ended
    const filtered = allVivas.filter((viva) => {
      const isSubmitted = submittedVivas.includes(viva._id);
      const isEnded = viva.status === "ended";
      // Show only if NOT submitted AND NOT ended
      return !isSubmitted && !isEnded;
    });
    setVivas(filtered);
  };

  const handleFilterSubmitted = () => {
    setActiveFilter("submitted");
    // Show only submitted vivas (regardless of status)
    const filtered = allVivas.filter((viva) => submittedVivas.includes(viva._id));
    setVivas(filtered);
  };

  const handleViewResult = async (viva) => {
    console.log("Fetching result for viva:", viva._id);
    console.log("User ID:", userid);
    console.log("Class Code:", classCode);
    
    try {
      // Fetch student's result for this viva
      const response = await fetch(
        getApiUrl("bin/get/studentinresult"),
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ classCode: classCode, student: userid }),
        }
      );

      console.log("Response status:", response.status);

      if (response.ok) {
        const results = await response.json();
        console.log("All results:", results);
        
        // Find the result for this specific viva
        const vivaResult = results.find(r => {
          console.log("Checking result:", r.vivaId, "against", viva._id, "active:", r.active);
          return r.vivaId === viva._id && r.active === false;
        });
        
        console.log("Found viva result:", vivaResult);
        
        if (vivaResult) {
          const resultData = {
            ...vivaResult,
            vivaTitle: viva.title,
            marksPerQuestion: viva.marksPerQuestion || 1,
            totalQuestions: parseInt(viva.totalquetions),
          };
          
          console.log("Setting result data:", resultData);
          setSelectedVivaResult(resultData);
          setShowResultModal(true);
        } else {
          console.error("No matching result found");
          toast.error("No result found for this viva");
        }
      } else {
        console.error("Response not OK:", response.status);
        toast.error("Failed to fetch results");
      }
    } catch (error) {
      console.error("Error in handleViewResult:", error);
      toast.error("Failed to load result");
    }
  };

  return (
    <>
      <div className="classvivaspage-container">
        {/* Header */}
        <div className="classvivaspage-header">
          <button
            onClick={() => navigate("/join")}
            className="classvivaspage-back-btn"
          >
            <ArrowLeft size={20} /> Back to Classes
          </button>
          <div className="classvivaspage-header-content">
            <BookOpen size={48} className="classvivaspage-header-icon" />
            <h1>{classname}</h1>
            <p className="classvivaspage-class-code">Class Code: {classCode}</p>
            <p className="classvivaspage-subtitle">
              All viva assessments for this class
            </p>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="classvivaspage-filters">
          <button
            className={`classvivaspage-filter-btn ${
              activeFilter === "not-submitted" ? "active" : ""
            }`}
            onClick={handleFilterNotSubmitted}
          >
            Not Submitted
          </button>
          <button
            className={`classvivaspage-filter-btn ${
              activeFilter === "submitted" ? "active" : ""
            }`}
            onClick={handleFilterSubmitted}
          >
            Submitted
          </button>
        </div>

        {/* Vivas Grid */}
        {isLoading ? (
          <div className="classvivaspage-loading">
            <div className="classvivaspage-spinner"></div>
            <p>Loading vivas...</p>
          </div>
        ) : vivas.length > 0 ? (
          <div className="classvivaspage-grid">
            {vivas.map((viva, index) => {
              const isSubmitted = submittedVivas.includes(viva._id);
              console.log(`Viva ${viva.title} (${viva._id}):`, {
                isSubmitted,
                submittedVivas,
                vivaId: viva._id
              });
              
              return (
              <div className="classvivaspage-card" key={index}>
                <div className="classvivaspage-card-header">
                  <h3>{viva.title}</h3>
                  {submittedVivas.includes(viva._id) ? (
                    <span className="classvivaspage-badge submitted">
                      <CheckCircle size={16} /> Submitted
                    </span>
                  ) : viva.status === "active" || viva.status === "true" ? (
                    <span className="classvivaspage-badge active">
                      <CheckCircle size={16} /> Active
                    </span>
                  ) : (
                    <span className="classvivaspage-badge locked">
                      <Lock size={16} /> Locked
                    </span>
                  )}
                </div>

                <div className="classvivaspage-card-body">
                  <div className="classvivaspage-info-item">
                    <Calendar size={18} />
                    <span>{new Date(viva.date).toLocaleDateString()}</span>
                  </div>
                  <div className="classvivaspage-info-item">
                    <Clock size={18} />
                    <span>{viva.time} minutes</span>
                  </div>
                  <div className="classvivaspage-info-item">
                    <FileText size={18} />
                    <span>{viva.totalquetions} questions</span>
                  </div>
                </div>

                <div className="classvivaspage-card-actions">
                  {/* Show different buttons based on submission status */}
                  {submittedVivas.includes(viva._id) ? (
                    // Submitted - Show View Result button
                    <button
                      onClick={() => {
                        console.log("View Result button clicked for viva:", viva._id);
                        handleViewResult(viva);
                      }}
                      className="classvivaspage-result-btn"
                      style={{ pointerEvents: 'auto', cursor: 'pointer' }}
                    >
                      <Eye size={18} /> View Result
                    </button>
                  ) : (
                    // Not Submitted - Show appropriate button based on viva status
                    <button
                      onClick={() => handleAttendViva(viva)}
                      className={`classvivaspage-attend-btn ${
                        (viva.status === "inactive" || viva.status === "false") ? "locked" : ""
                      }`}
                      disabled={viva.status === "inactive" || viva.status === "false"}
                    >
                      {(viva.status === "active" || viva.status === "true") ? (
                        <>
                          <CheckCircle size={18} /> Attend Viva
                        </>
                      ) : (
                        <>
                          <Lock size={18} /> Upcoming
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
            })}
          </div>
        ) : (
          <div className="classvivaspage-empty">
            <BookOpen size={80} className="classvivaspage-empty-icon" />
            <h2>No Vivas Available</h2>
            <p>There are no viva assessments in this class yet</p>
          </div>
        )}
      </div>

      {/* Result Modal */}
      {showResultModal && selectedVivaResult && (
        <div className="classvivaspage-modal-overlay" onClick={() => setShowResultModal(false)}>
          <div className="classvivaspage-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="classvivaspage-modal-header">
              <h2>📊 Viva Result</h2>
              <button
                className="classvivaspage-modal-close"
                onClick={() => setShowResultModal(false)}
              >
                ×
              </button>
            </div>

            <div className="classvivaspage-modal-body">
              <div className="classvivaspage-result-summary">
                <h3>{selectedVivaResult.vivaTitle || "Viva Result"}</h3>
                <div className="classvivaspage-result-score">
                  <div className="classvivaspage-score-circle">
                    <span className="classvivaspage-score-number">
                      {selectedVivaResult.score || 0}
                    </span>
                    <span className="classvivaspage-score-total">
                      / {(selectedVivaResult.totalQuestions || 0) * (selectedVivaResult.marksPerQuestion || 1)}
                    </span>
                  </div>
                  <p className="classvivaspage-score-label">Total Marks</p>
                </div>
              </div>

              <div className="classvivaspage-result-questions">
                <h4>Question-wise Results</h4>
                {selectedVivaResult.answers && selectedVivaResult.answers.length > 0 ? (
                  selectedVivaResult.answers.map((q, index) => {
                    // Handle both string and object options
                    const options = typeof q.options === 'string' ? JSON.parse(q.options) : q.options;
                    const isCorrect = String(q.selectedAnswer || '').trim().toLowerCase() === 
                                     String(q.correctAnswer || '').trim().toLowerCase();
                    
                    return (
                      <div key={index} className={`classvivaspage-result-question ${isCorrect ? 'correct' : 'incorrect'}`}>
                        <div className="classvivaspage-question-header">
                          <span className="classvivaspage-question-number">Q{index + 1}</span>
                          <span className={`classvivaspage-question-status ${isCorrect ? 'correct' : 'incorrect'}`}>
                            {isCorrect ? <CheckCircle size={16} /> : <XCircle size={16} />}
                            {isCorrect ? 'Correct' : 'Incorrect'}
                          </span>
                        </div>
                        <p className="classvivaspage-question-text">{q.question}</p>
                        
                        <div className="classvivaspage-question-options">
                          {options && Object.entries(options).map(([key, value]) => {
                            let optionClass = "classvivaspage-option";
                            if (q.selectedAnswer === key) {
                              optionClass += isCorrect ? " selected-correct" : " selected-incorrect";
                            }
                            if (q.correctAnswer === key && !isCorrect) {
                              optionClass += " correct-answer";
                            }
                            
                            return (
                              <div key={key} className={optionClass}>
                                <span className="classvivaspage-option-key">{key}.</span>
                                <span className="classvivaspage-option-value">{value}</span>
                                {q.selectedAnswer === key && (
                                  <span className="classvivaspage-option-icon">
                                    {isCorrect ? <CheckCircle size={14} /> : <XCircle size={14} />}
                                  </span>
                                )}
                                {q.correctAnswer === key && !isCorrect && (
                                  <span className="classvivaspage-option-icon correct">
                                    <CheckCircle size={14} />
                                  </span>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="classvivaspage-no-answers">No answer details available</p>
                )}
              </div>
            </div>

            <div className="classvivaspage-modal-footer">
              <button
                className="classvivaspage-modal-close-btn"
                onClick={() => setShowResultModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

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

export default ClassVivasPage;
