import React, { useState } from 'react';
import { Link as RouterLink, Navigate, useLocation, useNavigate } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Link,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useAuth } from '../auth/AuthContext';

const Login = () => {
  const { login, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  if (!isLoading && isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message ?? 'Sign-in failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', display: 'grid', placeItems: 'center' }}>
      <Container maxWidth="xs">
        <Stack spacing={2} alignItems="center" sx={{ mb: 3 }}>
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: '50%',
              border: '2px solid',
              borderColor: 'primary.main',
              display: 'grid',
              placeItems: 'center',
              fontFamily: 'JetBrains Mono, monospace',
              fontWeight: 700,
              color: 'primary.main',
            }}
          >
            CC
          </Box>
          <Typography variant="h5" sx={{ fontFamily: 'JetBrains Mono, monospace', letterSpacing: 1 }}>
            CHRONOCASTER
          </Typography>
        </Stack>
        <Card>
          <CardContent>
            <Box component="form" onSubmit={submit}>
              <Stack spacing={2}>
                <Typography variant="h6">Sign in</Typography>
                {error && <Alert severity="error">{error}</Alert>}
                <TextField
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoFocus
                  autoComplete="email"
                  fullWidth
                />
                <TextField
                  label="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  fullWidth
                />
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={busy}
                  startIcon={busy ? <CircularProgress size={16} color="inherit" /> : null}
                  sx={{ fontWeight: 700, letterSpacing: 1 }}
                >
                  Sign in
                </Button>
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                  Need an account?{' '}
                  <Link component={RouterLink} to="/register">
                    Create one
                  </Link>
                </Typography>
              </Stack>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default Login;
