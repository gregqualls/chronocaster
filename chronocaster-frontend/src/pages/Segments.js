import React from 'react';
import Sidebar from '../components/Sidebar';

const Segments = () => {
  return (
    <div>
      <div style={{ display: 'flex' }}>
        <Sidebar />
        <main>
          <h2>Segments</h2>
          <p>Manage your segments here.</p>
        </main>
      </div>
    </div>
  );
};

export default Segments;
