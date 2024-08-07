import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <aside>
      <ul>
        <li><Link to="/dashboard">Dashboard</Link></li>
        <li><Link to="/programs">Programs</Link></li>
        <li><Link to="/units">Units</Link></li>
        <li><Link to="/segments">Segments</Link></li>
      </ul>
    </aside>
  );
};

export default Sidebar;
