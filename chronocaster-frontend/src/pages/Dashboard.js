// src/pages/Dashboard.js
import React from 'react';
import Sidebar from '../components/Sidebar';

const Dashboard = () => {
  return (
    <div>
      <Sidebar />
      <div className="p-4">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="mt-2 text-gray-600">Welcome to the ChronoCaster Dashboard!</p>
      </div>
    </div>
  );
};

export default Dashboard;
