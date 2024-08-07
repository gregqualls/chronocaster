import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import LoginButton from '../components/Login';

const HomePage = () => {
  const { isAuthenticated, logout } = useAuth0();

  return (
    <div>
      <h1>Welcome to ChronoCaster</h1>
      {isAuthenticated ? (
        <button onClick={() => logout({ returnTo: window.location.origin })}>
          Log Out
        </button>
      ) : (
        <LoginButton />
      )}
    </div>
  );
};

export default HomePage;
