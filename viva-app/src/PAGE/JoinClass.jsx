import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../CSS/joinclass.css';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { ToastContainer ,toast} from 'react-toastify';
const JoinClass = () => {
  const [showModal, setShowModal] = useState(false);
  const [vivaData,setVivaData]=useState([])
  const [classCode, setClassCode] = useState('');
   const [userid, setUserId] = useState("");
    const { UserInfo } = useSelector((state) => state.user);
   
    useEffect(() => {
    if (UserInfo && UserInfo.length > 0) {
     setUserId(UserInfo[0].payload._id);
    }
    }, [UserInfo]);

   
    
    const HandleFalseViva=(e)=>{
      e.preventDefault()
      toast.error("Viva Does Not Start Yet");
    }
    const HandleTrueViva=(e,vivaid)=>{
      localStorage.setItem('VivaId',vivaid)
      toast.success("Yup You Can Start")
    }
  const handleJoin = async() => {
      console.log("Class code joined:", classCode);
      try {
            const response = await fetch('http://localhost:5050/bin/join/class', {
               method: 'POST',
               headers: {
                   'Content-Type': 'application/json'
               },
               body: JSON.stringify({classcode:classCode,studentid:userid})
           });
   
           if (!response.ok) {
               setShowModal(false);
               const errorData = await response.json();
               toast.error(errorData.message)
               throw new Error(errorData.message || 'Login failed');
               
           }
           const data = await response.json();
           console.log(data);
           FetchData()
           toast.success("Class Joined 🤝")
           setShowModal(false);
           
        } catch (error) {
            console.log(error)
        }
  };

    const FetchData=async()=>{
        try {
            const response = await fetch('http://localhost:5050/bin/get/viva-info', {
               method: 'POST',
               headers: {
                   'Content-Type': 'application/json'
               },
               body: JSON.stringify({studentId:userid})
           });
   
           if (!response.ok) {
               const errorData = await response.json();
               throw new Error(errorData.message || 'Login failed');
               
           }
           const data = await response.json();
           setVivaData(data.vivas)
           
        } catch (error) {
            console.log(error)
        }
            
    }
      
   useEffect(() => {
    if (userid) {
      FetchData(); // ✅ Fetch when component mounts or userid changes
      
    }
  }, [userid]);
  

  return ( <>
    <div className="join-class-container">
      <div className="join-button-container">
        <Link onClick={() => setShowModal(true)} className="join-button">
          Join Class
        </Link>
      </div>

      {showModal && (
          <div className="modal-overlay">
          <div className="modal">
            <h2>Enter Class Code</h2>
            <input
              type="text"
              value={classCode}
              onChange={(e) => setClassCode(e.target.value)}
              placeholder="Enter class code"
              />
            <div className="modal-buttons">
              <button onClick={handleJoin}>Join</button>
              <button onClick={() => setShowModal(false)} className="cancel-btn">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    <div className="main">
       {vivaData.length > 0 ? (
        vivaData.map((viva, index) => (
          <div className="card" key={index}>
            <div className="uppr">
              <h4>Title: {viva.title || 'N/A'}</h4>
              <h4>{viva.classCode ? `Class Code: ${viva.classCode} 👋` : 'No Class Code'}</h4>
              <h4>Date: {new Date(viva.date).toLocaleDateString()}</h4>
              <h4>Total Questions: {viva.totalquetions || 0}</h4> 
              {viva.status=="false" ?(<Link className="btn" onClick={(e)=>HandleFalseViva(e)}>Accecss Viva 🔒</Link>) : (<Link to="/vivatest" className="btn" onClick={(e)=>HandleTrueViva(e,viva._id)}>Accecss Viva </Link> )}
            </div>
          </div>
        ))
      ) : (
        <p>No viva records found.</p>
      )}
    </div>
     <ToastContainer
            position="top-right"
            autoClose={3000}      // 3 seconds
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
