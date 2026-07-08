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
      const stored = localStorage.getItem('user');
      if (!stored) {
        window.location.href = '/auth/login';
      }
    }
    return Promise.reject(error);
  }
);

const JWTProvider = ({ children }) => children;

export default JWTProvider;
