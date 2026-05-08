import React, { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  Grid,
  LinearProgress,
  Stack,
  Typography,
} from '@mui/material';
import { FiberManualRecord, Sync, Wifi, Schedule } from '@mui/icons-material';
import Navbar from '../components/Navbar';

const rundown = [
  { id: 1, name: 'Cold Open',                duration: 60 },
  { id: 2, name: 'Welcome & Housekeeping',   duration: 180 },
  { id: 3, name: 'Guest Intro: Dr. Avery',   duration: 90 },
  { id: 4, name: 'Main Interview',           duration: 1500 },
  { id: 5, name: 'Audience Q&A',             duration: 600 },
  { id: 6, name: 'Sponsor Read',             duration: 90 },
  { id: 7, name: 'Closing & CTA',            duration: 120 },
];

const totalRunSeconds = rundown.reduce((acc, s) => acc + s.duration, 0);
const ACTIVE_INDEX = 3;
const ACTIVE_ELAPSED = 412;

const fmt = (sec) => {
  const sign = sec < 0 ? '-' : '';
  const a = Math.abs(Math.floor(sec));
  const h = Math.floor(a / 3600);
  const m = Math.floor((a % 3600) / 60);
  const s = a % 60;
  const pad = (n) => String(n).padStart(2, '0');
  return h ? `${sign}${pad(h)}:${pad(m)}:${pad(s)}` : `${sign}${pad(m)}:${pad(s)}`;
};

const useTicker = () => {
  const [t, setT] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setT((x) => x + 1), 1000);
    return () => clearInterval(id);
  }, []);
  return t;
};

const StatusDot = ({ color = 'success.main' }) => (
  <FiberManualRecord sx={{ color, fontSize: 10 }} />
);

const Stat = ({ label, value, sub, icon }) => (
  <Card elevation={0}>
    <CardContent>
      <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 1 }}>
        {icon}
        <Typography variant="overline" color="text.secondary">
          {label}
        </Typography>
      </Stack>
      <Typography variant="h4" sx={{ fontFamily: 'JetBrains Mono, monospace' }}>
        {value}
      </Typography>
      {sub && (
        <Typography variant="caption" color="text.secondary">
          {sub}
        </Typography>
      )}
    </CardContent>
  </Card>
);

const Dashboard = () => {
  const tick = useTicker();
  const elapsed = ACTIVE_ELAPSED + tick;
  const active = rundown[ACTIVE_INDEX];
  const remaining = active.duration - elapsed;
  const progress = Math.min(100, (elapsed / active.duration) * 100);

  const elapsedTotal = useMemo(
    () => rundown.slice(0, ACTIVE_INDEX).reduce((a, s) => a + s.duration, 0) + elapsed,
    [elapsed],
  );
  const remainingTotal = totalRunSeconds - elapsedTotal;

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Navbar />
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} lg={8}>
            <Card sx={{ overflow: 'hidden' }}>
              <Box
                sx={{
                  px: 3,
                  py: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderBottom: 1,
                  borderColor: 'divider',
                }}
              >
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Chip
                    size="small"
                    icon={<FiberManualRecord sx={{ fontSize: 10 }} />}
                    label="LIVE"
                    color="primary"
                    sx={{ fontWeight: 700, letterSpacing: 1.5 }}
                  />
                  <Typography variant="overline" color="text.secondary">
                    Now Playing — Segment {ACTIVE_INDEX + 1} of {rundown.length}
                  </Typography>
                </Stack>
                <Typography variant="overline" color="text.secondary">
                  Episode 042 · The Long Road
                </Typography>
              </Box>

              <CardContent sx={{ py: 5, textAlign: 'center' }}>
                <Typography variant="overline" color="text.secondary">
                  Time Remaining
                </Typography>
                <Typography
                  sx={{
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: { xs: 72, md: 128 },
                    lineHeight: 1,
                    color: remaining < 30 ? 'primary.main' : 'text.primary',
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  {fmt(remaining)}
                </Typography>
                <Typography variant="h5" sx={{ mt: 2 }}>
                  {active.name}
                </Typography>
                <Box sx={{ mt: 3, px: 4 }}>
                  <LinearProgress
                    variant="determinate"
                    value={progress}
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    sx={{ mt: 1, fontFamily: 'JetBrains Mono, monospace' }}
                  >
                    <Typography variant="caption" color="text.secondary">
                      {fmt(elapsed)} elapsed
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {fmt(active.duration)} planned
                    </Typography>
                  </Stack>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} lg={4}>
            <Stack spacing={3}>
              <Stat
                label="Show Remaining"
                value={fmt(remainingTotal)}
                sub={`${fmt(elapsedTotal)} of ${fmt(totalRunSeconds)} elapsed`}
                icon={<Schedule color="secondary" fontSize="small" />}
              />
              <Stat
                label="Connected Clients"
                value="7"
                sub="3 producers · 4 viewers"
                icon={<Wifi color="success" fontSize="small" />}
              />
              <Stat
                label="Sync Drift"
                value="±42ms"
                sub="all clients within tolerance"
                icon={<Sync color="success" fontSize="small" />}
              />
            </Stack>
          </Grid>

          <Grid item xs={12}>
            <Card>
              <Box
                sx={{
                  px: 3,
                  py: 2,
                  borderBottom: 1,
                  borderColor: 'divider',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Typography variant="overline" color="text.secondary">
                  Rundown
                </Typography>
                <Typography variant="overline" color="text.secondary">
                  {rundown.length} segments · {fmt(totalRunSeconds)} total
                </Typography>
              </Box>
              <Box>
                {rundown.map((seg, i) => {
                  const isActive = i === ACTIVE_INDEX;
                  const isDone = i < ACTIVE_INDEX;
                  const isNext = i === ACTIVE_INDEX + 1;
                  return (
                    <React.Fragment key={seg.id}>
                      <Box
                        sx={{
                          px: 3,
                          py: 2,
                          display: 'grid',
                          gridTemplateColumns: '40px 110px 1fr 120px',
                          alignItems: 'center',
                          gap: 2,
                          opacity: isDone ? 0.45 : 1,
                          bgcolor: isActive ? 'action.selected' : 'transparent',
                        }}
                      >
                        <Typography
                          sx={{
                            fontFamily: 'JetBrains Mono, monospace',
                            color: 'text.secondary',
                          }}
                        >
                          {String(i + 1).padStart(2, '0')}
                        </Typography>
                        <Box>
                          {isActive && (
                            <Chip
                              size="small"
                              icon={<FiberManualRecord sx={{ fontSize: 10 }} />}
                              label="LIVE"
                              color="primary"
                              sx={{ fontWeight: 700, letterSpacing: 1.5 }}
                            />
                          )}
                          {isNext && (
                            <Chip
                              size="small"
                              label="NEXT"
                              color="secondary"
                              variant="outlined"
                              sx={{ fontWeight: 700, letterSpacing: 1.5 }}
                            />
                          )}
                          {isDone && (
                            <Stack direction="row" spacing={0.75} alignItems="center">
                              <StatusDot color="text.disabled" />
                              <Typography variant="caption" color="text.disabled">
                                done
                              </Typography>
                            </Stack>
                          )}
                        </Box>
                        <Typography sx={{ fontWeight: isActive ? 600 : 400 }}>
                          {seg.name}
                        </Typography>
                        <Typography
                          sx={{
                            fontFamily: 'JetBrains Mono, monospace',
                            color: 'text.secondary',
                            textAlign: 'right',
                          }}
                        >
                          {fmt(seg.duration)}
                        </Typography>
                      </Box>
                      {i < rundown.length - 1 && <Divider />}
                    </React.Fragment>
                  );
                })}
              </Box>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Dashboard;
