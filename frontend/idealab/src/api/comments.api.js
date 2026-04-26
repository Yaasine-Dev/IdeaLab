import api from './axios'

export const getComments = (ideaId) => api.get(`/comments/idea/${ideaId}/`)
export const postComment = (ideaId, data) => api.post(`/comments/idea/${ideaId}/`, data)
export const editComment = (id, data) => api.put(`/comments/${id}/`, data)
export const deleteComment = (id) => api.delete(`/comments/${id}/`)
