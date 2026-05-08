import React, { useState } from 'react';
import { Link as RouterLink, Navigate, useNavigate } from 'react-router-dom';
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

const Register = () => {
  const { register, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  if (!isLoading && isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await register(name, email, password);
      navigate('/', { replace: true });
    } catch (err) {
      const data = err.response?.data;
      const firstError = data?.errors ? Object.values(data.errors)[0]?.[0] : null;
      setError(firstError ?? data?.message ?? 'Registration failed');
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
              width: 44, height: 44, borderRadius: '50%',
              border: '2px solid', borderColor: 'primary.main',
              display: 'grid', placeItems: 'center',
              fontFamily: 'JetBrains Mono, monospace', fontWeight: 700,
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
                <Typography variant="h6">Create account</Typography>
                {error && <Alert severity="error">{error}</Alert>}
                <TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} required autoFocus fullWidth />
                <TextField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" fullWidth />
                <TextField
                  label="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                  helperText="Minimum 8 characters."
                  fullWidth
                />
                <Button type="submit" variant="contained" color="primary" disabled={busy} startIcon={busy ? <CircularProgress size={16} color="inherit" /> : null}>
                  Create account
                </Button>
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                  Already have one?{' '}
                  <Link component={RouterLink} to="/login">
                    Sign in
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

export default Register;
