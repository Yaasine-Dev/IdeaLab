import api from './axios'

export const getNotifs = (params) => api.get('/notifications/', { params })
export const markRead = (id) => api.patch(`/notifications/${id}/`)
export const markAllRead = () => api.post('/notifications/read/')
