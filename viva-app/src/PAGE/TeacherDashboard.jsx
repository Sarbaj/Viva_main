import React, { useEffect, useState } from 'react'
import { MdDelete } from "react-icons/md";
import '../CSS/teacher.css';
import { Link } from 'react-router-dom'
import { useSelector} from "react-redux";
const TeacherDashboard = () => {
  const [userid, setUsername] = useState("")
  const [ClassRoom, setClassRoom] = useState([])
    const [popupStatus, setpopupStatus] = useState(false);
   const [formData, setFormData] = useState({
      classname: "",
      time: "",
    });
  const {UserInfo}=useSelector((state)=>state.user)

  useEffect(()=>{
    if (UserInfo && UserInfo.length > 0) {
     setUsername(UserInfo[0].payload._id);
     if(UserInfo[0].payload.role!=1){
        window.location.href="/login"
     }
     
    }
    }, [UserInfo]);

useEffect(() => {
  const GetClassCode=async()=>{
  try{
      const data=await fetch("https://vivabackend.onrender.com/bin/get/student",{
        method:"POST",
         headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ teacherid:userid })})
      const result=await data.json() 
      if (result.message.length>0) {
        
        setClassRoom(result.message)
      }
      
      
  } catch (error) {
    
  }
}
GetClassCode()
},[userid])
 const HandleInputchange = (e) => {
  const now = new Date();

  // Get hours and format 12-hour time
  let hours = now.getHours();
  const minutes = now.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  
  hours = hours % 12;
  hours = hours ? hours : 12; // 0 => 12
  
  const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;

  // Date parts
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = now.getFullYear();


    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
      time:`${hours}:${formattedMinutes}${ampm} ${day}/${month}/${year}`
    }));
  };
 const HandleCreteClass = async (e) => {
    e.preventDefault();
    try {
      console.log(formData.classname );
      
         const response = await fetch("https://vivabackend.onrender.com/bin/create/classcode", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ teacherid:userid,classnname:formData.classname }),
        });
        const Data=await response.json()
       console.log(Data.result);
       setClassRoom([...ClassRoom,Data.result])
        
    } catch (error) {
        console.log(error);
        
    }
    console.log(formData);
}
  const HandleFalse = () => {
    setpopupStatus(false);
  };

  return (
    <>
    <div className='mainteacher'>
      <div className="uppr">
       {UserInfo.length>0 &&(<h1>{UserInfo[0].payload.name}</h1>)}
        <h2>"A teacher's words may fade from memory,
But their impact echoes for a lifetime."</h2>
          <button onClick={()=>setpopupStatus(true)}>Create New Class</button>
      </div>
      <div className="lower">
        {ClassRoom.length > 0 && (ClassRoom.map((data,i)=>{
        return <div className="card" key={i}>
          <button><MdDelete /></button>
          <p>{data.classname}</p>
          <p>#{data.code}</p>
          <Link to={`/class/overview/${data.code}`} className='linkstyle'>View Class</Link>
        </div>
        }))}
       
      </div>
       {popupStatus && (
          <div className="popup">
            <p onClick={() => HandleFalse()}>X</p>
            <h2>Create Class</h2>
            <input
              type="text"
              placeholder="Enter Classname"
              name="classname"
              value={formData.classname}
              onChange={HandleInputchange}
            />
        
            <button onClick={(e) => HandleCreteClass(e)}>CREATE CLASS</button>
          </div>
        )}
    </div >
    </>
  )
}

export default TeacherDashboard