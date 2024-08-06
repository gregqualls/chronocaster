import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';
import Auth0ProviderWithHistory from './auth/auth0-provider';
import { withAuthenticationRequired } from '@auth0/auth0-react';
import Loading from './components/Loading'; // Ensure you have a loading component

function App() {
  return (
    <Auth0ProviderWithHistory>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/dashboard"
            element={<ProtectedRoute component={Dashboard} />}
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </Auth0ProviderWithHistory>
  );
}

export default App;

const ProtectedRoute = ({ component }) => {
  const Component = withAuthenticationRequired(component, {
    onRedirecting: () => <Loading />,
  });

  return <Component />;
};
