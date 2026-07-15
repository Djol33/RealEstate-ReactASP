import axios from 'axios';
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';


export type AuthUser = {
  id: number;
  fname: string;
  lname:string;
  email: string;
  token: string;
}

export type AuthResponse = { code: number; message: string };

interface AuthContextType {
  user: AuthUser | null;
  login: (data: any) => Promise<AuthResponse | undefined>;
  logout: () => void;
}
const AuthContext = createContext<AuthContextType | null>(null);

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(()=>{
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;

  });
  useEffect(()=>{
    
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      console.log("parsiaran je", JSON.parse(storedUser))
    }
  }, []);

 
  const login = async   (data) => {
    let resp;
    try {
    const response = await axios.post('https://localhost:7154/api/LoginTEST', data)
    .then((response)=>{
      console.log('Success:', response.data.token);
      if(response.data.token.code ==401 ){ resp =  {
        code:401,
        message: 'Invalid email or password'

      }};
      setUser(a=>(
        {
          id: response.data.token.id,
          fname: response.data.token.fIrstName  ,
          lname:response.data.token.lastName,
          email: response.data.token.email,
          token: response.data.token.token

        })
      )


      localStorage.setItem('user', JSON.stringify({
                   id: response.data.token.id,
     fname: response.data.token.fIrstName  ,
          lname:response.data.token.lastName,
          email: response.data.token.email,
          token: response.data.token.token}))
  
           
    
  })
  if(resp) return resp;
    return {
        code:200,
        message: 'Login Successful'

      }
 

} catch (err) {
    console.error('Fetch Error:', err);
  }
    
  };

  const logout = () =>{
    setUser(null);
    localStorage.removeItem('user');


  }
 
  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
 
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};