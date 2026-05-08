import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import Navbar from '../components/Navbar';

const Segments = () => (
  <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
    <Navbar />
    <Container sx={{ py: 6 }}>
      <Typography variant="overline" color="text.secondary">
        Library
      </Typography>
      <Typography variant="h3" sx={{ mb: 1 }}>
        Segments
      </Typography>
      <Typography color="text.secondary">
        The atomic blocks of a show: a cold open, a guest interview, a sponsor read. Drag them into a unit's rundown.
      </Typography>
    </Container>
  </Box>
);

export default Segments;
