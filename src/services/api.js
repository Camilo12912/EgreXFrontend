import axios from 'axios';

const getBaseURL = () => {
  const envUrl = process.env.REACT_APP_API_URL;
  if (!envUrl) return '/api';

  // Si no tiene http/https, lo forzamos para evitar URL relativas fallidas en Vercel
  const normalizedUrl = envUrl.startsWith('http') ? envUrl : `https://${envUrl}`;

  // Eliminamos slash final si lo tiene y añadimos /api
  return `${normalizedUrl.replace(/\/$/, '')}/api`;
};

const api = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json',
  },
});

api.getRecentUsers = () => api.get('/admin/recent-users');
api.getVerifiedUsers = () => api.get('/admin/verified-users');

// History-related API calls
api.getGlobalHistory = () => api.get('/admin/history');
api.getUserHistory = (id) => api.get(`/admin/users/${id}/history`);

// Event-related API calls
api.registerToEvent = (id, formResponses) => api.post(`/events/${id}/register`, { formResponses });
api.getEventParticipants = (id) => api.get(`/events/${id}/participants`);
api.markAttendance = (eventId, userId, attended) => api.post(`/events/${eventId}/attendance/${userId}`, { attended });

// Add a request interceptor to include the JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      // Clear token and redirect to login if unauthorized
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('loginTimestamp');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
