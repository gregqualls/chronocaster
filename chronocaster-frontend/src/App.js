import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Event from './pages/Event';
import Programs from './pages/Programs';
import Units from './pages/Units';
import Segments from './pages/Segments';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';
import Watch from './pages/Watch';
import ProtectedRoute from './auth/ProtectedRoute';

const guard = (el) => <ProtectedRoute>{el}</ProtectedRoute>;

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/watch/:token" element={<Watch />} />
      <Route path="/" element={guard(<Dashboard />)} />
      <Route path="/dashboard" element={guard(<Dashboard />)} />
      <Route path="/events/:id" element={guard(<Event />)} />
      <Route path="/programs" element={guard(<Programs />)} />
      <Route path="/units" element={guard(<Units />)} />
      <Route path="/segments" element={guard(<Segments />)} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
