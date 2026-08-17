import axios from 'axios';

axios.defaults.timeout = 20000;

axios.interceptors.request.use(
  (config) => {
    const stored = localStorage.getItem('user');
    const token = stored ? JSON.parse(stored).token : null;

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    const sentWithToken = !!error.config?.headers?.Authorization;

    if (error.response?.status === 401 && sentWithToken) {
      const wasLoggedIn = !!localStorage.getItem('user');
      localStorage.removeItem('user');

      const onAuthPage = window.location.pathname.startsWith('/auth');
      if (wasLoggedIn && !onAuthPage) {
        sessionStorage.setItem('auth-flash', 'Your session has expired. Please log in again.');
        window.location.href = '/auth/login';
      }
    }
    return Promise.reject(error);
  }
);

const JWTProvider = ({ children }) => children;

export default JWTProvider;
