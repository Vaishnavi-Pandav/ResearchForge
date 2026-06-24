import api from './api'

const authService = {
  login: async (email, password) => {
    const formData = new FormData()
    formData.append('username', email)
    formData.append('password', password)
    const response = await api.post('/auth/login', formData)
    return response.data
  },

  signup: async (userData) => {
    const response = await api.post('/auth/signup', userData)
    return response.data
  },
}

export default authService
