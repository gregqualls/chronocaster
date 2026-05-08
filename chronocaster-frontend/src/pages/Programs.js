import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import Navbar from '../components/Navbar';

const Programs = () => (
  <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
    <Navbar />
    <Container sx={{ py: 6 }}>
      <Typography variant="overline" color="text.secondary">
        Library
      </Typography>
      <Typography variant="h3" sx={{ mb: 1 }}>
        Programs
      </Typography>
      <Typography color="text.secondary">
        Long-running shows and series. Each program is a recurring event template you can spin into a live run.
      </Typography>
    </Container>
  </Box>
);

export default Programs;
