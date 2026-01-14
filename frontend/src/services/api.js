import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  signup: async (data) => {
    const response = await api.post('/auth/signup', data);
    // Backend returns { success, message, data: { user, token } }
    return response.data;
  },
  
  login: async (data) => {
    const response = await api.post('/auth/login', data);
    // Backend returns { success, message, data: { user, token } }
    return response.data;
  },
};

// User APIs
export const userAPI = {
  getProfile: async () => {
    const response = await api.get('/user/profile');
    return response.data;
  },
};

// Scan APIs
export const scanAPI = {
  uploadScan: async (formData) => {
    const response = await api.post('/scan', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  
  getScans: async (limit = 10) => {
    const response = await api.get(`/scan?limit=${limit}`);
    return response.data;
  },
  
  getScanById: async (scanId) => {
    const response = await api.get(`/scan/${scanId}`);
    return response.data;
  },
};

// Progress APIs
export const progressAPI = {
  saveProgress: async (data) => {
    const response = await api.post('/progress', data);
    return response.data;
  },
  
  getProgress: async (weeks = 4) => {
    const response = await api.get(`/progress?weeks=${weeks}`);
    return response.data;
  },
};

// Subscription API
export const subscriptionAPI = {
  createOrder: (planType) => api.post('/subscription/create-order', { plan_type: planType }),
  verifyPayment: (data) => api.post('/subscription/verify-payment', data),
  getStatus: () => api.get('/subscription/status'),
  getPlans: () => api.get('/subscription/plans'),
  cancel: () => api.post('/subscription/cancel'),
};

export default api;
