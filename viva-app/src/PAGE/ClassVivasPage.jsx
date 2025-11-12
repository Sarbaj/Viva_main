import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import { BookOpen, Calendar, Clock, FileText, Lock, CheckCircle, ArrowLeft } from 'lucide-react';
import '../CSS/classvivaspage.css';

const ClassVivasPage = () => {
  const { classCode } = useParams();
  const navigate = useNavigate();
  const [vivas, setVivas] = useState([]);
  const [className, setClassName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [userid, setUserId] = useState("");
  const { UserInfo } = useSelector((state) => state.user);

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
        const response = await fetch("https://vivabackend.onrender.com/bin/getUsername", {
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
        const response = await fetch('https://vivabackend.onrender.com/bin/get/viva-info', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ studentId: userid })
        });

        if (response.ok) {
          const data = await response.json();
          // Filter vivas for this specific class
          const classVivas = data.vivas.filter(viva => viva.classCode === classCode);
          setVivas(classVivas);
          setClassName(`Class ${classCode}`);
        }
        setIsLoading(false);
      } catch (error) {
        console.log(error);
        setIsLoading(false);
        toast.error("Failed to load vivas");
      }
    };

    fetchClassVivas();
  }, [userid, classCode]);

  const handleAttendViva = (viva) => {
    if (viva.status === "false") {
      toast.error("This viva is not active yet");
      return;
    }
    localStorage.setItem('VivaId', viva._id);
    navigate('/vivatest');
  };

  return (
    <>
      <div className="classvivaspage-container">
        {/* Header */}
        <div className="classvivaspage-header">
          <button onClick={() => navigate('/join')} className="classvivaspage-back-btn">
            <ArrowLeft size={20} /> Back to Classes
          </button>
          <div className="classvivaspage-header-content">
            <BookOpen size={48} className="classvivaspage-header-icon" />
            <h1>{className}</h1>
            <p className="classvivaspage-class-code">Class Code: {classCode}</p>
            <p className="classvivaspage-subtitle">All viva assessments for this class</p>
          </div>
        </div>

        {/* Vivas Grid */}
        {isLoading ? (
          <div className="classvivaspage-loading">
            <div className="classvivaspage-spinner"></div>
            <p>Loading vivas...</p>
          </div>
        ) : vivas.length > 0 ? (
          <div className="classvivaspage-grid">
            {vivas.map((viva, index) => (
              <div className="classvivaspage-card" key={index}>
                <div className="classvivaspage-card-header">
                  <h3>{viva.title}</h3>
                  {viva.status === "true" ? (
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

                <button
                  onClick={() => handleAttendViva(viva)}
                  className={`classvivaspage-attend-btn ${viva.status === "false" ? "locked" : ""}`}
                  disabled={viva.status === "false"}
                >
                  {viva.status === "true" ? (
                    <>
                      <CheckCircle size={18} /> Attend Viva
                    </>
                  ) : (
                    <>
                      <Lock size={18} /> Locked
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="classvivaspage-empty">
            <BookOpen size={80} className="classvivaspage-empty-icon" />
            <h2>No Vivas Available</h2>
            <p>There are no viva assessments in this class yet</p>
          </div>
        )}
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

export default ClassVivasPage;
