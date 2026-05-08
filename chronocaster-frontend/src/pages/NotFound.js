import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Button, Container, Typography } from '@mui/material';
import Navbar from '../components/Navbar';

const NotFound = () => (
  <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
    <Navbar />
    <Container sx={{ py: 10, textAlign: 'center' }}>
      <Typography
        sx={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 96, color: 'primary.main' }}
      >
        404
      </Typography>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Off-air
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        The page you're looking for isn't on the rundown.
      </Typography>
      <Button component={Link} to="/" variant="contained" color="primary">
        Back to control room
      </Button>
    </Container>
  </Box>
);

export default NotFound;
