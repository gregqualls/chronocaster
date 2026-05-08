import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Event from './pages/Event';
import Programs from './pages/Programs';
import Units from './pages/Units';
import Segments from './pages/Segments';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/events/:id" element={<Event />} />
        <Route path="/programs" element={<Programs />} />
        <Route path="/units" element={<Units />} />
        <Route path="/segments" element={<Segments />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;