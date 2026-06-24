import axios from 'axios'

const api = axios.create({
  baseURL: '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor (for auth tokens, etc.)
api.interceptors.request.use(
  (config) => {
    // Add auth token here if needed
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle errors globally
    return Promise.reject(error)
  }
)

export default api
