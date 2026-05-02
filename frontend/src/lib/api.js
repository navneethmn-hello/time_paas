import axios from 'axios';

const fallbackApiUrl = 'http://localhost:5000/api';

export const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') || fallbackApiUrl;

export const api = axios.create({
  baseURL: apiBaseUrl,
});
