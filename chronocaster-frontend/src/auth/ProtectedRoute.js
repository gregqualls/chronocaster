import React, { useEffect } from 'react';
import { Box, Button, CircularProgress, Container, Typography } from '@mui/material';
import { useAuth } from './useAuth';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading, isDemo, login } = useAuth();

  useEffect(() => {
    if (!isDemo && !isLoading && !isAuthenticated) {
      login();
    }
  }, [isAuthenticated, isLoading, isDemo, login]);

  if (isDemo || isAuthenticated) return children;

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'background.default',
        display: 'grid',
        placeItems: 'center',
      }}
    >
      <Container maxWidth="sm" sx={{ textAlign: 'center' }}>
        {isLoading ? (
          <CircularProgress />
        ) : (
          <>
            <Typography variant="h5" sx={{ mb: 2 }}>
              Sign in to ChronoCaster
            </Typography>
            <Button variant="contained" color="primary" onClick={login}>
              Continue
            </Button>
          </>
        )}
      </Container>
    </Box>
  );
};

export default ProtectedRoute;
