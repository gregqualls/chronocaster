import React, { useCallback, useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  Container,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import {
  Add,
  CalendarMonth,
  FiberManualRecord,
  GroupsOutlined,
  PlayArrow,
  Schedule,
} from '@mui/icons-material';
import Navbar from '../components/Navbar';
import CreateEventDialog from '../components/CreateEventDialog';
import { fetchEvents } from '../services/events';
import { fmtDuration, fmtSchedule } from '../utils/format';

const statusMeta = {
  draft:     { label: 'DRAFT',     color: 'default',   variant: 'outlined' },
  scheduled: { label: 'SCHEDULED', color: 'secondary', variant: 'outlined' },
  ready:     { label: 'READY',     color: 'primary',   variant: 'filled'   },
  live:      { label: 'LIVE',      color: 'primary',   variant: 'filled'   },
  paused:    { label: 'PAUSED',    color: 'warning',   variant: 'filled'   },
  completed: { label: 'COMPLETED', color: 'default',   variant: 'outlined' },
};
const fallbackMeta = { label: 'UNKNOWN', color: 'default', variant: 'outlined' };

const Stat = ({ label, value, sub, icon }) => (
  <Card elevation={0} sx={{ flex: 1 }}>
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

const EventCard = ({ event }) => {
  const meta = statusMeta[event.status] ?? fallbackMeta;
  const isReady = event.status === 'ready';
  const isLive = event.status === 'live' || event.status === 'paused';
  const isCompleted = event.status === 'completed';

  return (
    <Card sx={{ height: '100%', opacity: isCompleted ? 0.65 : 1 }}>
      <CardActionArea
        component={RouterLink}
        to={`/events/${event.id}`}
        sx={{ height: '100%', alignItems: 'stretch' }}
      >
        <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, height: '100%' }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Chip
              size="small"
              icon={
                isReady ? <FiberManualRecord sx={{ fontSize: 10 }} /> : undefined
              }
              label={meta.label}
              color={meta.color}
              variant={meta.variant}
              sx={{ fontWeight: 700, letterSpacing: 1.5 }}
            />
            <Typography variant="caption" color="text.secondary">
              {event.show}
            </Typography>
          </Stack>

          <Typography variant="h6" sx={{ lineHeight: 1.25 }}>
            {event.name}
          </Typography>

          <Stack direction="row" spacing={2} color="text.secondary" sx={{ mt: 'auto' }}>
            <Stack direction="row" spacing={0.75} alignItems="center">
              <Schedule sx={{ fontSize: 16 }} />
              <Typography variant="body2">{fmtSchedule(event.scheduledAt)}</Typography>
            </Stack>
            <Stack direction="row" spacing={0.75} alignItems="center">
              <CalendarMonth sx={{ fontSize: 16 }} />
              <Typography variant="body2">{fmtDuration(event.durationSec)}</Typography>
            </Stack>
            <Stack direction="row" spacing={0.75} alignItems="center">
              <GroupsOutlined sx={{ fontSize: 16 }} />
              <Typography variant="body2">{event.crew.length}</Typography>
            </Stack>
          </Stack>

          {(isReady || isLive) && (
            <Button
              size="small"
              variant="contained"
              color="primary"
              startIcon={<PlayArrow />}
              sx={{ alignSelf: 'flex-start', mt: 1, fontWeight: 700, letterSpacing: 1 }}
            >
              {isLive ? 'JOIN CONTROL ROOM' : 'GO TO CONTROL ROOM'}
            </Button>
          )}
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

const useNow = (intervalMs = 30_000) => {
  const [, force] = useState(0);
  useEffect(() => {
    const id = setInterval(() => force((x) => x + 1), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
};

const Dashboard = () => {
  useNow();
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [createOpen, setCreateOpen] = useState(false);

  const load = useCallback(async () => {
    try {
      const data = await fetchEvents();
      setEvents(data);
    } catch {
      setEvents([]);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const upcoming = events.filter((e) => e.status !== 'completed');
  const recent = events.filter((e) => e.status === 'completed');
  const ready = events.filter((e) => e.status === 'ready');

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
              Control Room
            </Typography>
            <Typography variant="h4">Schedule</Typography>
          </Box>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<Add />}
            onClick={() => setCreateOpen(true)}
          >
            New Event
          </Button>
        </Stack>

        <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} sx={{ mb: 4 }}>
          <Stat
            label="Ready Now"
            value={ready.length}
            sub={ready.length ? 'standby for go-live' : 'nothing queued'}
            icon={<FiberManualRecord color="primary" sx={{ fontSize: 14 }} />}
          />
          <Stat
            label="Upcoming"
            value={upcoming.length}
            sub="across all shows"
            icon={<Schedule color="secondary" fontSize="small" />}
          />
          <Stat
            label="Connected Studios"
            value="4"
            sub="all peers in sync"
            icon={<GroupsOutlined color="success" fontSize="small" />}
          />
        </Stack>

        <Typography variant="overline" color="text.secondary">
          Upcoming
        </Typography>
        <Grid container spacing={3} sx={{ mt: 0.5, mb: 4 }}>
          {upcoming.map((e) => (
            <Grid item xs={12} sm={6} lg={4} key={e.id}>
              <EventCard event={e} />
            </Grid>
          ))}
        </Grid>

        {recent.length > 0 && (
          <>
            <Typography variant="overline" color="text.secondary">
              Recent
            </Typography>
            <Grid container spacing={3} sx={{ mt: 0.5 }}>
              {recent.map((e) => (
                <Grid item xs={12} sm={6} lg={4} key={e.id}>
                  <EventCard event={e} />
                </Grid>
              ))}
            </Grid>
          </>
        )}
      </Container>
      <CreateEventDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreated={async (created) => {
          await load();
          if (created?.id) navigate(`/events/${created.id}`);
        }}
      />
    </Box>
  );
};

export default Dashboard;
