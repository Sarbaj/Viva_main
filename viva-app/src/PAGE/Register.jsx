import React, { useState } from 'react';
import '../CSS/register.css';
import { ToastContainer ,toast} from 'react-toastify';
import { Link } from 'react-router-dom';
const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmpassword:'',
    ennumber: '',
  });

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    if (formData.password===formData.confirmpassword) {
      try{
        const data=await fetch("http://localhost:5050/bin/registerstudent",{
          method:"POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name:formData.name,email:formData.email,password:formData.password,ennumber:formData.ennumber })})
          const result=await data.json() 
       
          
          if (result.status!==201) {
            toast.error(result.message)
            return;
          }
          if (result.status===201) {
            toast.success("Successfully Registered !")
          setFormData({
             name: '',
    email: '',
    password: '',
    confirmpassword:'',
    ennumber: '',
          })
          }
          
      
      
  } catch (error) {
    toast.error(result.message)
  }
    }
    if (formData.password!=formData.confirmpassword) {
        toast.error("Password Is Not Matching !!!")
    }
  };

  return (
    <div className="register-wrapper">
      <form className="register-form" onSubmit={handleSubmit}>
        <h2>Create Account</h2>

        <label>Full Name</label>
        <input
          type="text"
          name="name"
          placeholder="Your full name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <label>Email</label>
        <input
          type="email"
          name="email"
          placeholder="you@example.com"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <label>Password</label>
        <input
          type="password"
          name="password"
          placeholder="••••••••"
          value={formData.password}
          onChange={handleChange}
          required
          minLength={6}
        />
        <label>Confirm Password</label>
        <input
          type="password"
          name="confirmpassword"
          placeholder="••••••••"
          value={formData.confirmpassword}
          onChange={handleChange}
          required
          minLength={6}
        />

        <label>Enrollment Number</label>
        <input
          type="text"
          name="ennumber"
          placeholder="Enrollment number"
          value={formData.ennumber}
          onChange={handleChange}
          required
        />

        <button type="submit">Register</button>

        <p className="login-text">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
           <ToastContainer
              position="top-center"
              autoClose={3000}      // 3 seconds
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              pauseOnHover
              draggable
              pauseOnFocusLoss
            />
    </div>
  );
};

export default Register;
