import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api'

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const authApi = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
}

export const projectApi = {
  getAll: () => api.get('/projects'),
  create: (data) => api.post('/projects', data),
  update: (id, data) => api.put(`/projects/${id}`, data),
  delete: (id) => api.delete(`/projects/${id}`),
}

export const sessionApi = {
  getAll: (params) => api.get('/sessions', { params }),
  start: (data) => api.post('/sessions/start', data),
  stop: (id) => api.put(`/sessions/${id}/stop`),
  getActive: () => api.get('/sessions/active'),
  getStats: (params) => api.get('/sessions/stats', { params }),
}

export default api
