import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fetchStats = async () => {
  const { data } = await apiClient.get('/stats');
  return data;
};

export const fetchPrograms = async () => {
  const { data } = await apiClient.get('/programs');
  return data;
};
