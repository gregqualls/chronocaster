import React from 'react';
import { Container, Typography } from '@mui/material';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

const Dashboard = () => {
  return (
    <div>
      <Navbar />
      <div style={{ display: 'flex' }}>
        <Sidebar />
        <Container>
          <Typography variant="h2" gutterBottom>
            Dashboard
          </Typography>
          <Typography variant="body1">
            Welcome to the ChronoCaster Dashboard! Here you can manage your programs, units, and segments.
          </Typography>
        </Container>
      </div>
    </div>
  );
};

export default Dashboard;
