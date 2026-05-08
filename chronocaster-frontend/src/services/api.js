import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
});

export const fetchStats = async () => {
  const { data } = await apiClient.get('/stats');
  return data;
};

export const fetchServerTime = async () => {
  const { data } = await apiClient.get('/now');
  return data;
};

export default apiClient;
