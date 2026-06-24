import api from './api'

const citationService = {
  listBySource: async (sourceId) => {
    const response = await api.get(`/citations/source/${sourceId}`)
    return response.data
  },
}

export default citationService
