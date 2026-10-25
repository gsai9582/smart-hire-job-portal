// src/utils/api.js
import axios from 'axios';
import toast from 'react-hot-toast';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  timeout: 15000,
});

// Attach token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle global errors
API.interceptors.response.use(
  (response) => response,
  (error) => {
    const msg = error.response?.data?.message || 'Something went wrong';
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ─── Auth ─────────────────────────────────────────────────────────────────────
export const authAPI = {
  register: (data) => API.post('/auth/register', data),
  login: (data) => API.post('/auth/login', data),
  verifyOTP: (data) => API.post('/auth/verify-otp', data),
  resendOTP: (data) => API.post('/auth/resend-otp', data),
  getMe: () => API.get('/auth/me'),
  forgotPassword: (data) => API.post('/auth/forgot-password', data),
  resetPassword: (token, data) => API.put(`/auth/reset-password/${token}`, data),
  changePassword: (data) => API.put('/auth/change-password', data),
};

// ─── Jobs ─────────────────────────────────────────────────────────────────────
export const jobAPI = {
  getAll: (params) => API.get('/jobs', { params }),
  getOne: (id) => API.get(`/jobs/${id}`),
  create: (data) => API.post('/jobs', data),
  update: (id, data) => API.put(`/jobs/${id}`, data),
  delete: (id) => API.delete(`/jobs/${id}`),
  getMyJobs: (params) => API.get('/jobs/recruiter/my-jobs', { params }),
  getStats: () => API.get('/jobs/stats/overview'),
};

// ─── Applications ─────────────────────────────────────────────────────────────
export const applicationAPI = {
  apply: (jobId, data) => API.post(`/applications/${jobId}`, data),
  getMyApplications: (params) => API.get('/applications/my', { params }),
  getJobApplications: (jobId, params) => API.get(`/applications/job/${jobId}`, { params }),
  updateStatus: (id, data) => API.put(`/applications/${id}/status`, data),
  withdraw: (id) => API.delete(`/applications/${id}`),
  getStats: () => API.get('/applications/stats'),
};

// ─── Users ────────────────────────────────────────────────────────────────────
export const userAPI = {
  getProfile: () => API.get('/users/profile'),
  updateProfile: (data) => API.put('/users/profile', data),
  uploadAvatar: (data) => API.put('/users/avatar', data),
  uploadResume: (data) => API.put('/users/resume', data),
  saveJob: (jobId) => API.post(`/users/save-job/${jobId}`),
  getSavedJobs: () => API.get('/users/saved-jobs'),
  getPublicProfile: (id) => API.get(`/users/${id}/public`),
};

// ─── Notifications ────────────────────────────────────────────────────────────
export const notifAPI = {
  getAll: (params) => API.get('/notifications', { params }),
  markRead: (id) => API.put(`/notifications/${id}/read`),
  markAllRead: () => API.put('/notifications/read-all'),
  delete: (id) => API.delete(`/notifications/${id}`),
};

// ─── Chat ─────────────────────────────────────────────────────────────────────
export const chatAPI = {
  send: (message) => API.post('/chat/message', { message }),
};

// ─── Admin ────────────────────────────────────────────────────────────────────
export const adminAPI = {
  getDashboard: () => API.get('/admin/dashboard'),
  getUsers: (params) => API.get('/admin/users', { params }),
  blockUser: (id) => API.put(`/admin/users/${id}/block`),
  deleteUser: (id) => API.delete(`/admin/users/${id}`),
  getAllJobs: (params) => API.get('/admin/jobs', { params }),
  featureJob: (id) => API.put(`/admin/jobs/${id}/feature`),
  deleteJob: (id) => API.delete(`/admin/jobs/${id}`),
};

export default API;
