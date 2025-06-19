import React, { useState ,useEffect} from 'react';
import { useDispatch, useSelector} from "react-redux";
import '../CSS/navbar.css';
import { Link, useNavigate } from 'react-router-dom';
import { addBasicInfo } from '../REDUX/UserSlice';
import { useLocation } from 'react-router-dom';

const NavBar = () => {
    const navigate = useNavigate();
const location = useLocation();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [Role, SetRole] = useState("");
    const dispatch = useDispatch();
    const handleLogout = () => {
        const token =localStorage.removeItem("authToken");
        setIsLoggedIn(false);
        SetRole("5")
        window.location.href="/login"
    };
    const [username, setUsername] = useState("");
    const { UserInfo } = useSelector((state) => state.user);
    useEffect(() => {
    if (UserInfo && UserInfo.length > 0) {
     setUsername(UserInfo[0].name);
     
    }
    }, [UserInfo]);
    useEffect(() => {
    const verifyToken = async () => {
      try {
        const token =localStorage.getItem("authToken");
        if (!token) {
        console.log("No Token");
        
        }
        const response = await fetch("http://localhost:5050/bin/getUsername", {
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
        setIsLoggedIn(true)
        const data = await response.json();
       
       
        dispatch(addBasicInfo(data))
        setUsername(data)
       SetRole(data.payload.role)
       
        
      } catch (error) {
        console.log("error");
      }
    };
    verifyToken();
  }, [],);



  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/" className="logo-link">🤖AI ViVa</Link>
      </div>

      <div className="nav-links">
        {Role=="1" && (<Link to="/teacherdashboard" className="nav-link">Class Manage</Link>)}
        {isLoggedIn && Role==0 && (<>
            <Link to="/join" className="nav-link">Join Class</Link>
        </>
        ) }
        {isLoggedIn ? (<button className="logout-btn" onClick={handleLogout}>Logout </button>):(
          <Link to="/login" className="nav-link">
            Login
          </Link>
        )} 
      </div>
    </nav>
  );
};

export default NavBar;
