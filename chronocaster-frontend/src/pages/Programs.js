import React, { useCallback, useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import { Add, LibraryBooks } from '@mui/icons-material';
import Navbar from '../components/Navbar';
import CreateProgramDialog from '../components/CreateProgramDialog';
import { fetchPrograms } from '../services/events';
import { fmtDuration } from '../utils/format';

const Programs = () => {
  const [programs, setPrograms] = useState([]);
  const [createOpen, setCreateOpen] = useState(false);

  const load = useCallback(() => {
    fetchPrograms().then(setPrograms).catch(() => setPrograms([]));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Navbar />
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', sm: 'center' }}
          spacing={2}
          sx={{ mb: 3 }}
        >
          <Box>
            <Typography variant="overline" color="text.secondary">
              Library
            </Typography>
            <Typography variant="h4">Programs</Typography>
            <Typography color="text.secondary" sx={{ mt: 0.5 }}>
              Reusable show templates. Each program is the parent of its scheduled events.
            </Typography>
          </Box>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<Add />}
            onClick={() => setCreateOpen(true)}
          >
            New Program
          </Button>
        </Stack>

        <Grid container spacing={3}>
          {programs.length === 0 && (
            <Grid item xs={12}>
              <Card>
                <CardContent sx={{ textAlign: 'center', py: 5 }}>
                  <Typography color="text.secondary">No programs yet.</Typography>
                  <Button
                    sx={{ mt: 2 }}
                    variant="contained"
                    color="primary"
                    startIcon={<Add />}
                    onClick={() => setCreateOpen(true)}
                  >
                    Create the first one
                  </Button>
                </CardContent>
              </Card>
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

        <CreateProgramDialog
          open={createOpen}
          onClose={() => setCreateOpen(false)}
          onCreated={() => load()}
        />
      </Container>
    </Box>
  );
};

export default Programs;
