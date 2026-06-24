import api from './api'

const researchService = {
  create: async (data) => {
    const response = await api.post('/research/', data)
    return response.data
  },

  list: async () => {
    const response = await api.get('/research/')
    return response.data
  },

  get: async (id) => {
    const response = await api.get(`/research/${id}`)
    return response.data
  },
}

export default researchService
