import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const HomePage = () => {
  const { loginWithRedirect, isAuthenticated, logout } = useAuth0();

  return (
    <div>
      <h1>Welcome to ChronoCaster</h1>
      {isAuthenticated ? (
        <button onClick={() => logout({ returnTo: window.location.origin })}>
          Log Out
        </button>
      ) : (
        <button onClick={() => loginWithRedirect()}>Log In</button>
      )}
    </div>
  );
};

export default HomePage;
