import axios from 'axios';
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { API_URL } from './config';


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

function readStoredUser(): AuthUser | null {
  const storedUser = localStorage.getItem('user');
  if (!storedUser) return null;
  try {
    return JSON.parse(storedUser);
  } catch {
    localStorage.removeItem('user');
    return null;
  }
}

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => readStoredUser());
  useEffect(() => {
    setUser(readStoredUser());

    function onStorage(e: StorageEvent) {
      if (e.key === 'user') {
        setUser(readStoredUser());
      }
    }
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);


  const login = async (data) => {
    try {
      const response = await axios.post(`${API_URL}/api/Login`, data);
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

      localStorage.setItem('user', JSON.stringify(loggedUser));
      setUser(loggedUser);

      return { code: 200, message: 'Login Successful' };
    } catch (err: any) {
      if (err.response?.status === 401) {
        return { code: 401, message: 'Invalid email or password' };
      }
      if (err.response?.status === 403) {
        return { code: 403, message: err.response?.data?.error ?? 'This account has been deactivated.' };
      }
      return { code: 500, message: 'Login failed' };
    }
  };


  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
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