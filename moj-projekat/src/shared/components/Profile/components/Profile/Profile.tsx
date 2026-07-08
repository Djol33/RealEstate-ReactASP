import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../../../AuthStore'; 
import { Link, useLocation } from 'react-router-dom';
import "./Profile.scss";
export function Profile() {
  const { user, logout } = useAuth();

 
  const [isOpen, setIsOpen] = useState(false);

   const location = useLocation();
  const toggleDropdown = () => {
    setIsOpen(prev => !prev);
  };
  useEffect(()=>{
    if(user == null)  setIsOpen(X=>false)
  },[user])
  useEffect(()=>{
   setIsOpen(X=>false)
  },[location])
  return (
    <div style={{ position: 'relative', display: 'inline-block', cursor: 'pointer' }}>
      <div onClick={toggleDropdown} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
        {user && <Link to="user/profile" style={{ textDecoration:"none",color:"white" }}>{user.fname} {user.lname}</Link>} 
        <span
          style={{
            display: 'inline-block',
            transition: 'transform 0.3s',
            transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)'
          }}
        >
         {user &&  <i className="fa-solid fa-caret-right"></i>}
        </span>
      </div>


      {   isOpen&& (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            right: "8px",
            background: 'white',
            border: '1px solid #ccc',
            borderRadius: '4px',
            boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
            padding: '10px',
            zIndex: 10,
            display:"flex",
            flexDirection:"column",
            alignItems:"flex-start",
            justifyContent:"center",
            color:"black",
           
          }}
        >
         {user && <div onClick={logout} style={{ cursor: 'pointer' }}>Logout</div>}
                  {user && <div onClick={logout} style={{ cursor: 'pointer' }}>Edit Profile</div>}
           {!user && <Link onClick={toggleDropdown} to="/auth/login">Login</Link>}
             {!user && <Link onClick={toggleDropdown} to="/">Register</Link>}
        </div>
      )}
    </div>
  );
}