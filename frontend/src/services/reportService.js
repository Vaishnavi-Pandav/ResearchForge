import api from './api'

const reportService = {
  listBySession: async (sessionId) => {
    const response = await api.get(`/reports/session/${sessionId}`)
    return response.data
  },

  get: async (id) => {
    const response = await api.get(`/reports/${id}`)
    return response.data
  },
}

export default reportService
