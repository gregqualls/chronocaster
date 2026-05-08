import React, { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import SegmentIcon from '@mui/icons-material/Segment';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { fetchStats } from '../services/api';

const cards = [
  { key: 'programs', label: 'Programs', icon: LibraryBooksIcon, color: '#1976d2' },
  { key: 'units', label: 'Units', icon: ViewModuleIcon, color: '#7b1fa2' },
  { key: 'segments', label: 'Segments', icon: SegmentIcon, color: '#2e7d32' },
];

const StatCard = ({ label, value, Icon, color, loading }) => (
  <Card elevation={2} sx={{ height: '100%' }}>
    <CardContent>
      <Stack direction="row" alignItems="center" spacing={2}>
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: 2,
            display: 'grid',
            placeItems: 'center',
            bgcolor: `${color}14`,
            color,
          }}
        >
          <Icon />
        </Box>
        <Box>
          <Typography variant="overline" color="text.secondary">
            {label}
          </Typography>
          <Typography variant="h4">
            {loading ? <CircularProgress size={24} /> : value ?? '—'}
          </Typography>
        </Box>
      </Stack>
    </CardContent>
  </Card>
);

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetchStats()
      .then((data) => {
        if (!cancelled) setStats(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message ?? 'Failed to load stats');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div>
      <Navbar />
      <Box sx={{ display: 'flex' }}>
        <Sidebar />
        <Container sx={{ py: 4 }}>
          <Typography variant="h4" gutterBottom>
            Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Overview of your ChronoCaster content.
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Grid container spacing={3}>
            {cards.map(({ key, label, icon: Icon, color }) => (
              <Grid item xs={12} sm={6} md={4} key={key}>
                <StatCard
                  label={label}
                  value={stats?.[key]}
                  Icon={Icon}
                  color={color}
                  loading={loading}
                />
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </div>
  );
};

export default Dashboard;
