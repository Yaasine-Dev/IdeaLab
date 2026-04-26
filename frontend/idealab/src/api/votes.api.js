import api from './axios'

export const castVote = (data) => api.post('/votes/', data)
