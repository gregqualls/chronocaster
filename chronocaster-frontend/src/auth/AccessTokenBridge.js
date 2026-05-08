import { useEffect } from 'react';
import { setAccessTokenGetter } from '../services/api';
import { useAuth } from './useAuth';

const AccessTokenBridge = () => {
  const { getAccessToken, isAuthenticated, isDemo } = useAuth();

  useEffect(() => {
    if (isDemo || !isAuthenticated) {
      setAccessTokenGetter(async () => null);
      return;
    }
    setAccessTokenGetter(getAccessToken);
  }, [getAccessToken, isAuthenticated, isDemo]);

  return null;
};

export default AccessTokenBridge;
