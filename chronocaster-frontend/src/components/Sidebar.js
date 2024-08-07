// src/components/Sidebar.js
import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../theme/ThemeContext';

const Sidebar = () => {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <div className="bg-gray-800 dark:bg-gray-900 text-white h-screen w-64">
      <div className="flex items-center justify-center py-6">
        <h1 className="text-2xl font-bold">Catalyst</h1>
      </div>
      <nav className="mt-10">
        <Link
          to="/dashboard"
          className="flex items-center py-2 px-8 text-gray-300 hover:bg-gray-700 hover:text-gray-100"
        >
          <span>Home</span>
        </Link>
        <Link
          to="/programs"
          className="flex items-center py-2 px-8 text-gray-300 hover:bg-gray-700 hover:text-gray-100"
        >
          <span>Events</span>
        </Link>
        <Link
          to="/units"
          className="flex items-center py-2 px-8 text-gray-300 hover:bg-gray-700 hover:text-gray-100"
        >
          <span>Orders</span>
        </Link>
        <Link
          to="/settings"
          className="flex items-center py-2 px-8 text-gray-300 hover:bg-gray-700 hover:text-gray-100"
        >
          <span>Settings</span>
        </Link>
      </nav>
      <div className="mt-auto flex flex-col items-center p-4">
        <button
          onClick={toggleTheme}
          className="text-gray-300 bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded"
        >
          {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
