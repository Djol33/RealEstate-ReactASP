import React, { useEffect } from 'react';
import {useAuth} from"../../../../AuthStore";
import   './Auth.css';
import { useNavigate } from 'react-router-dom';
 import { Outlet } from 'react-router-dom';

export default function Auth({children} ) {
  const { user } = useAuth();
  const navigate = useNavigate();
  useEffect(()=>{
    console.log("auth", user)
    
    if(user != null) navigate(-1);


  })

return <Outlet/>;
}
