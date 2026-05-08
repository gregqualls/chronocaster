import axios from 'axios';

let tokenGetter = async () => null;

export const setAccessTokenGetter = (fn) => {
  tokenGetter = fn;
};

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(async (config) => {
  try {
    const token = await tokenGetter();
    if (token) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (_) {
    // ignore — request will go out unauthenticated and 401 if required.
  }
  return config;
});

export const fetchMe = async () => {
  const { data } = await apiClient.get('/me');
  return data;
};

export const fetchStats = async () => {
  const { data } = await apiClient.get('/stats');
  return data;
};

export const fetchServerTime = async () => {
  const { data } = await apiClient.get('/now');
  return data;
};

export default apiClient;
