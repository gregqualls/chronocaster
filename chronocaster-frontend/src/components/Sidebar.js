// src/components/Sidebar.js
import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../theme/ThemeContext';
import {
  HomeIcon,
  Squares2X2Icon,
  RectangleStackIcon,
  Cog6ToothIcon,
  SunIcon,
  MoonIcon,
} from '@heroicons/react/24/outline';

const Sidebar = () => {
  const { theme, toggleTheme } = useTheme();
  const isDarkMode = theme === 'dark';

  return (
    <div className="bg-gray-800 dark:bg-gray-900 text-white h-screen w-64 flex flex-col justify-between">
      <div className="flex-grow">
        <div className="flex items-center justify-center py-6">
          <h1 className="text-2xl font-bold">ChronoCaster</h1>
        </div>
        <nav className="mt-10">
          <Link
            to="/dashboard"
            className="flex items-center py-2 px-8 text-gray-300 hover:bg-gray-700 hover:text-gray-100"
          >
            <HomeIcon className="h-6 w-6 mr-2" />
            <span>Dashboard</span>
          </Link>
          <Link
            to="/programs"
            className="flex items-center py-2 px-8 text-gray-300 hover:bg-gray-700 hover:text-gray-100"
          >
            <RectangleStackIcon className="h-6 w-6 mr-2" />
            <span>Programs</span>
          </Link>
          <Link
            to="/units"
            className="flex items-center py-2 px-8 text-gray-300 hover:bg-gray-700 hover:text-gray-100"
          >
            <Squares2X2Icon className="h-6 w-6 mr-2" />
            <span>Units</span>
          </Link>
          <Link
            to="/settings"
            className="flex items-center py-2 px-8 text-gray-300 hover:bg-gray-700 hover:text-gray-100"
          >
            <Cog6ToothIcon className="h-6 w-6 mr-2" />
            <span>Settings</span>
          </Link>
        </nav>
      </div>
      <div className="flex items-center justify-between px-8 py-4 border-t border-gray-700">
        <div className="flex items-center text-sm text-gray-300">
          {isDarkMode ? (
            <>
              <MoonIcon className="h-5 w-5 mr-2" />
              <span>Dark Mode</span>
            </>
          ) : (
            <>
              <SunIcon className="h-5 w-5 mr-2" />
              <span>Light Mode</span>
            </>
          )}
        </div>
        <button
          onClick={toggleTheme}
          className={`w-10 h-6 flex items-center rounded-full p-1 transition-colors ${
            isDarkMode ? 'bg-gray-600 justify-end' : 'bg-gray-200 justify-start'
          }`}
        >
          <div
            className={`w-4 h-4 bg-white rounded-full shadow transform transition-transform ${
              isDarkMode ? 'translate-x-0' : 'translate-x-0'
            }`}
          ></div>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
