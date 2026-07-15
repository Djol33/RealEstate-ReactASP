import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
 import { useAuth } from '../../../../AuthStore';
 

export function User( ) {
  const nav = useNavigate();
  const {user} = useAuth()
  useEffect(()=>{
    if(user==null) nav(-1)
  }, [user])


  return  <Outlet/>;
}
