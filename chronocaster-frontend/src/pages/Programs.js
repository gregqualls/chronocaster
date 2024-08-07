import React from 'react';
import Sidebar from '../components/Sidebar';

const Programs = () => {
  return (
    <div>
      <div style={{ display: 'flex' }}>
        <Sidebar />
        <main>
          <h2>Programs</h2>
          <p>Manage your programs here.</p>
        </main>
      </div>
    </div>
  );
};

export default Programs;
