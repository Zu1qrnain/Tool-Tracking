// src/services/api.js
import axios from 'axios'

const API_BASE = 'http://127.0.0.1:8000/api'

// Create axios instance
const axiosInstance = axios.create({
  baseURL: API_BASE,
})

// ✅ Automatically attach JWT token for every request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// ✅ Handle token expiration (optional)
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const refresh = localStorage.getItem('refresh_token')
      if (refresh) {
        try {
          const res = await axios.post(`${API_BASE}/token/refresh/`, { refresh })
          localStorage.setItem('access_token', res.data.access)
          error.config.headers.Authorization = `Bearer ${res.data.access}`
          return axiosInstance(error.config) // retry request
        } catch (err) {
          console.log('Refresh token expired, logging out...')
          localStorage.clear()
          window.location.href = '/login'
        }
      }
    }
    return Promise.reject(error)
  }
)

// =====================
// Export API functions
// =====================

// Tools
export const getTools = async () => {
  const res = await axiosInstance.get('/tools/')
  return res.data
}

// Issuances
export const getMyIssuances = async () => {
  const res = await axiosInstance.get('/issuances/my/')
  return res.data
}

// Borrow / Return
export const borrowTool = async (toolId) => {
  const res = await axiosInstance.post('/borrow/', { tool_id: toolId })
  return res.data
}

export const returnTool = async (issuanceId) => {
  const res = await axiosInstance.post(`/return/${issuanceId}/`)
  return res.data
}

// Calibration / Maintenance
export const getCalibrations = async () => {
  const res = await axiosInstance.get('/calibration/')
  return res.data
}

export const getMaintenance = async () => {
  const res = await axiosInstance.get('/maintenance/')
  return res.data
}

// Login
export const loginUser = async (username, password) => {
  const res = await axios.post(`${API_BASE}/token/`, { username, password })
  localStorage.setItem('access_token', res.data.access)
  localStorage.setItem('refresh_token', res.data.refresh)
  return res.data
}
