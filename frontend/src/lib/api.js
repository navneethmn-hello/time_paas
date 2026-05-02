import axios from 'axios';

const fallbackApiUrl = 'http://localhost:5000/api';

export const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') || fallbackApiUrl;

export const api = axios.create({
  baseURL: apiBaseUrl,
});

// Authentication APIs
export const loginWithGoogle = (idToken) => api.post('/auth/google', { idToken });
export const updateProfile = (profileData) => api.put('/auth/profile', profileData);
export const getCurrentUser = () => api.get('/auth/me');

// Post APIs
export const getPosts = (sort = 'anti-gravity') => api.get(`/posts?sort=${sort}`);
export const createPost = (postData) => api.post('/posts', postData);
export const votePost = (postId, type) => api.post(`/posts/${postId}/vote`, { type });

// Comment APIs
export const getCommentsForPost = (postId) => api.get(`/comments/post/${postId}`);
export const createComment = (commentData) => api.post('/comments', commentData);

// Community APIs
export const getCommunities = () => api.get('/communities');
export const createCommunity = (communityData) => api.post('/communities', communityData);
export const joinCommunity = (communityId) => api.post(`/communities/${communityId}/join`);
