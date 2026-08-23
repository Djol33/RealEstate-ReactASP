import './core/Interceptor/JWT/jwt.jsx'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { Main } from './features/main/components/Main/Main.js'
import JWTProvider from './core/Interceptor/JWT/jwt.jsx'
 import  AuthProvider  from './AuthStore.tsx'
import { ToastProvider } from './shared/components/Toast/ToastProvider'


createRoot(document.getElementById('root')).render(
  <StrictMode>


      <HelmetProvider>
      <AuthProvider>
      <ToastProvider>
      <App />
      </ToastProvider>
      </AuthProvider>
      </HelmetProvider>



  </StrictMode>,
)
