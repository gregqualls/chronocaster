import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import apiClient from '../services/api';

const AuthContext = createContext({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  refresh: async () => {},
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const { data } = await apiClient.get('/auth/me');
      setUser(data?.user ?? null);
    } catch (_) {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const login = useCallback(async (email, password, remember = false) => {
    console.log('login attempt', { email, password, remember });
    const { data } = await apiClient.post('/auth/login', { email, password, remember });
    setUser(data?.user ?? null);
    return data?.user;
  }, []);

  const register = useCallback(async (name, email, password) => {
    const { data } = await apiClient.post('/auth/register', { name, email, password });
    setUser(data?.user ?? null);
    return data?.user;
  }, []);

  const logout = useCallback(async () => {
    try {
      await apiClient.post('/auth/logout');
    } finally {
      setUser(null);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        isLoading,
        login,
        register,
        logout,
        refresh,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
