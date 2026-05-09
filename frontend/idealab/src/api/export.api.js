import api from './axios'

export const exportCSV  = (ideaId) => api.post(`/export/csv/${ideaId}/`)
export const exportJSON = (ideaId) => api.post(`/export/json/${ideaId}/`)
export const exportPDF  = (ideaId) => api.post(`/export/pdf/${ideaId}/`)
export const getExportStatus = (taskId) => api.get(`/export/status/${taskId}/`)
