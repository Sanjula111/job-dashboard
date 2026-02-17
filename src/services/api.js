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
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/updateprofile', data),
};

// Jobs API
export const jobsAPI = {
  getAllJobs: (params) => api.get('/jobs', { params }),
  getRecommendations: () => api.get('/jobs/recommendations'),
  getJobById: (id) => api.get(`/jobs/${id}`),
  saveJob: (id) => api.post(`/jobs/${id}/save`),
};

// Applications API
export const applicationsAPI = {
  apply: (data) => api.post('/applications', data),
  getMyApplications: () => api.get('/applications'),
  withdrawApplication: (id) => api.put(`/applications/${id}/withdraw`),
};

// Users API
export const usersAPI = {
  getProfile: () => api.get('/users/profile'),
  getSkillGap: () => api.get('/users/skill-gap'),
  getDashboardStats: () => api.get('/users/dashboard-stats'),
  getSavedJobs: () => api.get('/users/saved-jobs'),
  updateSkills: (skills) => api.put('/users/skills', { skills }),
  updatePreferences: (preferences) => api.put('/users/preferences', { preferences }),
};

export default api;