import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Programs from './pages/Programs';
import Units from './pages/Units';
import Segments from './pages/Segments';
import NotFound from './pages/NotFound';
// Remove unused imports
// import HomePage from './pages/HomePage';
// import Auth0ProviderWithHistory from './auth/auth0-provider';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/programs" element={<Programs />} />
        <Route path="/units" element={<Units />} />
        <Route path="/segments" element={<Segments />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;