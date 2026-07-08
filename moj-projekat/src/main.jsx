import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { Main } from './features/main/components/Main/Main.js'
import JWTProvider from './core/Interceptor/JWT/jwt.jsx'  
 import  AuthProvider  from './AuthStore.tsx'

 
createRoot(document.getElementById('root')).render(
  <StrictMode>

    <JWTProvider>
      <AuthProvider>
      <App />
      </AuthProvider>
    </JWTProvider>
      
 
  </StrictMode>,
)
