import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import Navbar from '../components/Navbar';

const Units = () => (
  <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
    <Navbar />
    <Container sx={{ py: 6 }}>
      <Typography variant="overline" color="text.secondary">
        Library
      </Typography>
      <Typography variant="h3" sx={{ mb: 1 }}>
        Units
      </Typography>
      <Typography color="text.secondary">
        Episodes, sessions, and individual broadcasts. A unit owns its rundown and timing target.
      </Typography>
    </Container>
  </Box>
);

export default Units;
