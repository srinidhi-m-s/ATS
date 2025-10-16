import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth APIs
export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  getMe: () => api.get('/auth/me'),
};

// Job APIs
export const jobAPI = {
  getAll: () => api.get('/jobs'),
  getById: (id) => api.get(`/jobs/${id}`),
  create: (data) => api.post('/jobs', data),
  update: (id, data) => api.put(`/jobs/${id}`, data),
  delete: (id) => api.delete(`/jobs/${id}`),
};

// Application APIs
export const applicationAPI = {
  create: (data) => api.post('/applications', data),
  getMy: () => api.get('/applications/my'),
  getAll: () => api.get('/applications'),
  getById: (id) => api.get(`/applications/${id}`),
  updateStatus: (id, data) => api.put(`/applications/${id}`, data),
};



// Bot APIs
export const botAPI = {
  processAll: () => api.post('/bot/process'),
  processSingle: (id) => api.post(`/bot/process/${id}`),
  getPending: () => api.get('/bot/pending'),
};

export default api;
