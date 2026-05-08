import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Event from './pages/Event';
import Programs from './pages/Programs';
import Units from './pages/Units';
import Segments from './pages/Segments';
import NotFound from './pages/NotFound';
import ProtectedRoute from './auth/ProtectedRoute';
import AccessTokenBridge from './auth/AccessTokenBridge';

const guard = (el) => <ProtectedRoute>{el}</ProtectedRoute>;

function App() {
  return (
    <>
      <AccessTokenBridge />
      <Routes>
        <Route path="/" element={guard(<Dashboard />)} />
        <Route path="/dashboard" element={guard(<Dashboard />)} />
        <Route path="/events/:id" element={guard(<Event />)} />
        <Route path="/programs" element={guard(<Programs />)} />
        <Route path="/units" element={guard(<Units />)} />
        <Route path="/segments" element={guard(<Segments />)} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
