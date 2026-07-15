import React from 'react';
import User, { BasicUser, CompanyUser } from './../../../../shared/Types/types';
import axios from 'axios';
import { useEffect } from 'react';
import  './UserProfile.css';
import { useLoaderData } from 'react-router-dom';

 export async function preLoadUser(user){
 

  let dataFetch =  await axios.get("https://localhost:7154/api/Profile/"+user.id)
  let data = dataFetch.data;
  console.log(user)
  let userInstance: User;
    if (data?.userBasic) {
      userInstance = {
        type: "basic",
        email: data.email,
        firstName: data.userBasic.firstName,
        lastName: data.userBasic.lastName
      } as BasicUser;
    } else if (data?.userCompany) {
      userInstance = {
        type: "company",
        email: data.email,
        BIP: data.userCompany.BIP
      } as CompanyUser;
    } else {
      throw new Error("Unknown user type");
    }
    console.log("ovde jer re",data);
  return userInstance;
 }
export function UserProfile( ) {
  let data =  useLoaderData()
  useEffect(()=>{
    console.log("Podaci",data)
  })
  

  
  return <>

<div id="profile">


  { data.type =="basic" ?
<div className="userProfile">
    <h1> Welcome {data.firstName + " " + data.lastName}</h1>
    <h2>email: {data.email}</h2>

</div>:
<p>Bye</p>


  }

    
</div>
  </>;
}
