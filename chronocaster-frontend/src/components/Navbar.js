// src/components/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../theme/ThemeContext';

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-lg">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-gray-800 dark:text-white">ChronoCaster</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/dashboard" className="text-gray-800 dark:text-white">Dashboard</Link>
            <Link to="/programs" className="text-gray-800 dark:text-white">Programs</Link>
            <Link to="/units" className="text-gray-800 dark:text-white">Units</Link>
            <button
              onClick={toggleTheme}
              className="text-gray-800 dark:text-white bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded"
            >
              {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
