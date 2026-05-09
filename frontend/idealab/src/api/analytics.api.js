import api from './axios'

export const getDashboard        = () => api.get('/analytics/entrepreneur/')
export const getReviewerStats    = () => api.get('/analytics/reviewer/')
export const getAdminStats       = () => api.get('/analytics/admin/')
