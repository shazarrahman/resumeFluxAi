import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

let authHandler = null;
let errorHandler = null;

export const setAuthHandler = (handler) => {
  authHandler = handler;
};

export const setErrorHandler = (handler) => {
  errorHandler = handler;
};

const handleError = (error) => {
  if (errorHandler) {
    errorHandler(error);
  }
  return Promise.reject(error);
};

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const retryRequest = async (fn, retries = MAX_RETRIES) => {
  let lastError;
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (error.response?.status >= 400 && error.response?.status < 500) {
        throw error;
      }
      if (i < retries - 1) {
        await sleep(RETRY_DELAY * (i + 1));
      }
    }
  }
  throw lastError;
};

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    config.headers['X-XSRF-TOKEN'] = localStorage.getItem('xsrfToken') || '';
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (!originalRequest._retry) {
      originalRequest._retry = true;
      try {
        return await retryRequest(() => api(originalRequest), MAX_RETRIES);
      } catch (retryError) {
        return handleError(retryError);
      }
    }

    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (authHandler) {
        authHandler();
      }
    }
    return handleError(error);
  }
);

export const authAPI = {
  register: (data) => retryRequest(() => api.post('/api/auth/register', data)),
  login: (data) => retryRequest(() => api.post('/api/auth/login', data)),
  getMe: () => retryRequest(() => api.get('/api/auth/me'))
};

export const resumeAPI = {
  upload: (formData) => retryRequest(() => api.post('/api/resume/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })),
  getAll: () => retryRequest(() => api.get('/api/resume')),
  getById: (id) => retryRequest(() => api.get(`/api/resume/${id}`))
};

export const analysisAPI = {
  analyze: (resumeId, jobDescription) => 
    retryRequest(() => api.post('/api/analysis/analyze', { resumeId, jobDescription })),
  getByResumeId: (resumeId) => retryRequest(() => api.get(`/api/analysis/resume/${resumeId}`)),
  getHistory: () => retryRequest(() => api.get('/api/analysis/history'))
};

export default api;