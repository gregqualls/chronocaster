import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Container,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import { LibraryBooks } from '@mui/icons-material';
import Navbar from '../components/Navbar';
import { fetchPrograms } from '../services/events';
import { fmtDuration } from '../utils/format';

const Programs = () => {
  const [programs, setPrograms] = useState([]);

  useEffect(() => {
    fetchPrograms().then(setPrograms).catch(() => setPrograms([]));
  }, []);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Navbar />
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Typography variant="overline" color="text.secondary">
          Library
        </Typography>
        <Typography variant="h4" sx={{ mb: 0.5 }}>
          Programs
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 4 }}>
          Reusable show templates. Each program is the parent of all its episodes (units).
        </Typography>

        <Grid container spacing={3}>
          {programs.length === 0 && (
            <Grid item xs={12}>
              <Card><CardContent>
                <Typography color="text.secondary">
                  No programs yet.
                </Typography>
              </CardContent></Card>
            </Grid>
          )}
          {programs.map((p) => (
            <Grid item xs={12} sm={6} lg={4} key={p.id}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1 }}>
                    <LibraryBooks color="secondary" fontSize="small" />
                    <Typography variant="overline" color="text.secondary">
                      {p.recurrence ? p.recurrence.toUpperCase() : 'ON DEMAND'}
                    </Typography>
                  </Stack>
                  <Typography variant="h6">{p.name}</Typography>
                  {p.description && (
                    <Typography color="text.secondary" sx={{ mt: 1 }}>
                      {p.description}
                    </Typography>
                  )}
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
                    Default runtime: {fmtDuration(p.default_duration ?? 0)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Programs;
