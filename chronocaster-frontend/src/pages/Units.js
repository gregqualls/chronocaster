import React from 'react';
import Sidebar from '../components/Sidebar';

const Units = () => {
  return (
    <div>
      <div style={{ display: 'flex' }}>
        <Sidebar />
        <main>
          <h2>Units</h2>
          <p>Manage your units here.</p>
        </main>
      </div>
    </div>
  );
};

export default Units;
