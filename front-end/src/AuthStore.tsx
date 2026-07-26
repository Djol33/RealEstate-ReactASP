import axios from 'axios';
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';


export type AuthUser = {
  id: number;
  fname: string;
  lname: string;
  email: string;
  token: string;
  userRole: number;
  company: string | null;
}

export type AuthResponse = { code: number; message: string };

interface AuthContextType {
  user: AuthUser | null;
  login: (data: any) => Promise<AuthResponse | undefined>;
  logout: () => void;
}
const AuthContext = createContext<AuthContextType | null>(null);

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;

  });
  useEffect(() => {

    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      console.log("parsiaran je", JSON.parse(storedUser))
    }
  }, []);


  const login = async (data) => {
    try {
      const response = await axios.post('https://localhost:7154/api/LoginTEST', data);
      const result = response.data;

      const loggedUser: AuthUser = {
        id: result.id,
        fname: result.firstName,
        lname: result.lastName,
        email: result.email,
        token: result.token,
        userRole: result.userRole,
        company: result.company ?? null,
      };

      setUser(loggedUser);
      localStorage.setItem('user', JSON.stringify(loggedUser));

      return { code: 200, message: 'Login Successful' };
    } catch (err: any) {
      if (err.response?.status === 401) {
        return { code: 401, message: 'Invalid email or password' };
      }
      console.error('Login error:', err);
      return { code: 500, message: 'Login failed' };
    }
  };


  const logout = () => {
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