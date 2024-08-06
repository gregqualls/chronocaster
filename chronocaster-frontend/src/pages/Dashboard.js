import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const Dashboard = () => {
  const { user, isAuthenticated } = useAuth0();

  return (
    <div>
      <h2>Dashboard</h2>
      {isAuthenticated && (
        <div>
          <h3>Welcome, {user.name}</h3>
          <p>Email: {user.email}</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
