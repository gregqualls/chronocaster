import { useAuth0 } from '@auth0/auth0-react';
import { isAuthConfigured } from './auth0-provider';

const DEMO_USER = {
  name: 'Demo Director',
  email: 'demo@chronocaster.local',
  sub: 'demo|local',
  picture: null,
};

export const useAuth = () => {
  const configured = isAuthConfigured();
  const auth0 = useAuth0();

  if (!configured) {
    return {
      isAuthenticated: true,
      isLoading: false,
      isDemo: true,
      user: DEMO_USER,
      login: () => {},
      logout: () => {},
      getAccessToken: async () => null,
    };
  }

  return {
    isAuthenticated: auth0.isAuthenticated,
    isLoading: auth0.isLoading,
    isDemo: false,
    user: auth0.user,
    login: () => auth0.loginWithRedirect(),
    logout: () =>
      auth0.logout({ logoutParams: { returnTo: window.location.origin } }),
    getAccessToken: () =>
      auth0.getAccessTokenSilently().catch(() => null),
  };
};
