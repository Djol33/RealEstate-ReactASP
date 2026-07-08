import React, { useEffect } from 'react';
import { useAuth } from '../../../AuthStore';
import   './Header.scss';
import { Link } from 'react-router-dom';
import { Profile } from '../Profile/components/Profile/Profile';
 

export function Header( ) {

  const { user, logout } = useAuth();
  
  return <header>
    <h1><Link to="/"><img src="/src/assets/images/logonekretnine.png" alt="logonekretnine" /></Link></h1>
    <nav>
<ul>
  {!user && (
    <li>
      <Link to="/auth/login">Login</Link>
    </li>
  )}

  {!user && (
    <li>
      <Link to="/auth/registerUser">Register user</Link>
    </li>
  )}

  {!user && (
    <li>
      <Link to="/auth/registerCompany">Register company</Link>
    </li>
  )}

  {user && (
    <li>
      <Link to="/apartment/add">Add Apartment</Link>
    </li>
  )}

  <li>
    <Profile />
  </li>
</ul>
    </nav>
  </header>
 
}
