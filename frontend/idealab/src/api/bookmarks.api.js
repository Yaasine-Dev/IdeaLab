import api from './axios'

export const getBookmarks = () => api.get('/bookmarks/')
export const toggleBookmark = (ideaId) => api.post('/bookmarks/toggle/', { idea_id: ideaId })
