import api from './axios'

export const getFeedbacks = (ideaId) => api.get(`/feedbacks/idea/${ideaId}/`)
export const submitFeedback = (ideaId, data) => api.post(`/feedbacks/idea/${ideaId}/`, data)
export const editFeedback = (id, data) => api.put(`/feedbacks/${id}/`, data)
export const deleteFeedback = (id) => api.delete(`/feedbacks/${id}/`)
export const getMyReviews = () => api.get('/feedbacks/my-reviews/')
