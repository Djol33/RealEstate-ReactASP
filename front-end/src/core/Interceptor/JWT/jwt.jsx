import axios from 'axios';

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
    if (error.response?.status === 401) {
      const wasLoggedIn = !!localStorage.getItem('user');
      localStorage.removeItem('user');

      const onAuthPage = window.location.pathname.startsWith('/auth');
      if (wasLoggedIn && !onAuthPage) {
        window.location.href = '/auth/login';
      }
    }
    return Promise.reject(error);
  }
);

const JWTProvider = ({ children }) => children;

export default JWTProvider;
