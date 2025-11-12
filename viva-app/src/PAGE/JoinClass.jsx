import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../CSS/joinclass.css';
import '../CSS/global-loading.css';
import { useSelector } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import { Loader2, BookOpen, Plus, GraduationCap } from 'lucide-react';

const JoinClass = () => {
  const [showModal, setShowModal] = useState(false);
  const [myClasses, setMyClasses] = useState([]);
  const [classCode, setClassCode] = useState('');
  const [userid, setUserId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingClasses, setIsLoadingClasses] = useState(true);
  const { UserInfo } = useSelector((state) => state.user);
   
    useEffect(() => {
    if (UserInfo && UserInfo.length > 0) {
     setUserId(UserInfo[0].payload._id);
     if (UserInfo[0].payload.role!=0) {
      window.location.href="/login"
     }
    }
    }, [UserInfo]);

      const verifyToken = async () => {
            try {
              const token =localStorage.getItem("authToken");
              if (!token) {
                console.log("no token");
                 window.location.href="/login"
              }
              const response = await fetch("https://vivabackend.onrender.com/bin/getUsername", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ token }),
              });
      
              if (!response.ok) {
                const errorData = await response.json();
                setErrorlogin(errorData.message);
              }
              
              const data = await response.json();
              
              if (data.payload.role!=0) {
                console.log("Not Allowed");
                window.location.href="/login"
                
              }
              
            } catch (error) {
              console.log("error");
            }
          };
      useEffect(() => {
    
          verifyToken();
        }, []);
   
    
    const HandleFalseViva=(e)=>{
      e.preventDefault()
      toast.error("Viva Does Not Start Yet");
    }
    const HandleTrueViva=(e,vivaid)=>{
      localStorage.setItem('VivaId',vivaid)
      toast.success("Yup You Can Start")
    }
  const handleJoin = async() => {
    if (!classCode.trim()) {
      toast.error("Please enter a class code");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('https://vivabackend.onrender.com/bin/join/class', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({classcode:classCode,studentid:userid})
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        setIsLoading(false);
        toast.error(errorData.message);
        return;
      }
      
      const data = await response.json();
      toast.success("Class Joined Successfully! 🎉");
      setClassCode('');
      setShowModal(false);
      setIsLoading(false);
      fetchMyClasses(); // Refresh classes list
    } catch (error) {
      setIsLoading(false);
      toast.error("Failed to join class");
    }
  };

  const fetchMyClasses = async() => {
    if (!userid) return;
    
    setIsLoadingClasses(true);
    try {
      // Get joined classes
      const response = await fetch('https://vivabackend.onrender.com/bin/get/studentinclass', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({classCode: ""}) // We'll need to modify this
      });
      
      // For now, get viva info which includes class codes
      const vivaResponse = await fetch('https://vivabackend.onrender.com/bin/get/viva-info', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({studentId:userid})
      });
      
      if (vivaResponse.ok) {
        const vivaData = await vivaResponse.json();
        
        // Group vivas by class code
        const classesMap = {};
        vivaData.vivas.forEach(viva => {
          if (!classesMap[viva.classCode]) {
            classesMap[viva.classCode] = {
              classCode: viva.classCode,
              className: `Class ${viva.classCode}`,
              vivas: []
            };
          }
          classesMap[viva.classCode].vivas.push(viva);
        });
        
        setMyClasses(Object.values(classesMap));
      }
      
      setIsLoadingClasses(false);
    } catch (error) {
      console.log(error);
      setIsLoadingClasses(false);
    }
  }
  
  useEffect(() => {
    if (userid) {
      fetchMyClasses();
    }
  }, [userid]);
  

  return (
    <>
      {/* Loading Overlay for Join Class */}
      {isLoading && (
        <div className="global-loading-overlay">
          <div className="global-loading-spinner">
            <Loader2 className="global-spinner-icon" size={48} />
            <p>Joining class...</p>
          </div>
        </div>
      )}

      <div className="joinclass-container">
        {/* Header Section */}
        <div className="joinclass-header">
          <div className="joinclass-header-content">
            <GraduationCap size={48} className="joinclass-header-icon" />
            <h1>My Classes</h1>
            <p>Manage your enrolled classes and access viva assessments</p>
          </div>
          <button onClick={() => setShowModal(true)} className="joinclass-join-btn">
            <Plus size={20} /> Join New Class
          </button>
        </div>

        {/* Classes Grid */}
        {isLoadingClasses ? (
          <div className="joinclass-loading-state">
            <Loader2 className="joinclass-spinner-icon" size={48} />
            <p>Loading your classes...</p>
          </div>
        ) : myClasses.length > 0 ? (
          <div className="joinclass-grid">
            {myClasses.map((classItem, index) => (
              <div className="joinclass-card" key={index}>
                <div className="joinclass-card-header">
                  <BookOpen size={32} className="joinclass-card-icon" />
                  <div className="joinclass-card-info">
                    <h3>{classItem.className}</h3>
                    <p className="joinclass-card-code">Code: {classItem.classCode}</p>
                  </div>
                </div>
                <div className="joinclass-card-stats">
                  <div className="joinclass-stat">
                    <span className="joinclass-stat-number">{classItem.vivas.length}</span>
                    <span className="joinclass-stat-label">Vivas</span>
                  </div>
                </div>
                <Link 
                  to={`/class/${classItem.classCode}/vivas`} 
                  className="joinclass-view-btn"
                >
                  View Class →
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="joinclass-empty-state">
            <div className="joinclass-empty-icon-container">
              <BookOpen size={80} className="joinclass-empty-icon" />
            </div>
            <h2>No Classes Joined Yet</h2>
            <p>Start your learning journey by joining a class</p>
            <button onClick={() => setShowModal(true)} className="joinclass-join-btn-large">
              <Plus size={20} /> Join Your First Class
            </button>
          </div>
        )}
      </div>

      {/* Join Class Modal */}
      {showModal && (
        <div className="joinclass-modal-overlay">
          <div className="joinclass-modal-content">
            <button className="joinclass-modal-close" onClick={() => setShowModal(false)}>×</button>
            <h2>Join a Class</h2>
            <p className="joinclass-modal-subtitle">Enter the class code provided by your teacher</p>
            <input
              type="text"
              value={classCode}
              onChange={(e) => setClassCode(e.target.value)}
              placeholder="Enter class code (e.g., ABC123)"
              className="joinclass-modal-input"
              disabled={isLoading}
            />
            <div className="joinclass-modal-buttons">
              <button onClick={handleJoin} className="joinclass-modal-join-btn" disabled={isLoading}>
                {isLoading ? "Joining..." : "Join Class"}
              </button>
              <button onClick={() => setShowModal(false)} className="joinclass-modal-cancel-btn" disabled={isLoading}>
                Cancel
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

export default JoinClass;
