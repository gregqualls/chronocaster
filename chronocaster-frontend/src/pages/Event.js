import React, { useEffect, useMemo, useState } from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import {
  Box,
  Button,
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
import {
  ArrowBack,
  CalendarMonth,
  FiberManualRecord,
  GroupsOutlined,
  PlayArrow,
  Schedule,
  Stop,
  Sync,
  Wifi,
} from '@mui/icons-material';
import Navbar from '../components/Navbar';
import { findEvent } from '../data/events';
import { fmtDuration, fmtSchedule, fmtTimer } from '../utils/format';

const useTicker = (active) => {
  const [t, setT] = useState(0);
  useEffect(() => {
    if (!active) return undefined;
    const id = setInterval(() => setT((x) => x + 1), 1000);
    return () => clearInterval(id);
  }, [active]);
  return t;
};

const useCountdownTo = (iso) => {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  return Math.round((new Date(iso).getTime() - now) / 1000);
};

const StatusDot = ({ color = 'success.main' }) => (
  <FiberManualRecord sx={{ color, fontSize: 10 }} />
);

const RundownRow = ({ seg, index, activeIndex }) => {
  const isActive = index === activeIndex;
  const isDone = activeIndex > -1 && index < activeIndex;
  const isNext = activeIndex > -1 && index === activeIndex + 1;

  return (
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
      <Typography sx={{ fontFamily: 'JetBrains Mono, monospace', color: 'text.secondary' }}>
        {String(index + 1).padStart(2, '0')}
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
      <Typography sx={{ fontWeight: isActive ? 600 : 400 }}>{seg.name}</Typography>
      <Typography
        sx={{
          fontFamily: 'JetBrains Mono, monospace',
          color: 'text.secondary',
          textAlign: 'right',
        }}
      >
        {fmtTimer(seg.duration)}
      </Typography>
    </Box>
  );
};

const PreShow = ({ event, onStart }) => {
  const secsToStart = useCountdownTo(event.scheduledAt);
  const future = secsToStart > 0;

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} lg={8}>
        <Card>
          <Box sx={{ px: 3, py: 2, borderBottom: 1, borderColor: 'divider' }}>
            <Stack direction="row" alignItems="center" spacing={1.5}>
              <Chip
                size="small"
                label={future ? 'STANDBY' : 'READY'}
                color={future ? 'secondary' : 'primary'}
                variant={future ? 'outlined' : 'filled'}
                sx={{ fontWeight: 700, letterSpacing: 1.5 }}
              />
              <Typography variant="overline" color="text.secondary">
                {future ? 'Doors open in' : 'Cleared for go-live'}
              </Typography>
            </Stack>
          </Box>
          <CardContent sx={{ py: 5, textAlign: 'center' }}>
            <Typography variant="overline" color="text.secondary">
              {future ? 'Starts in' : 'Scheduled'}
            </Typography>
            <Typography
              sx={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: { xs: 64, md: 112 },
                lineHeight: 1,
                color: future ? 'text.primary' : 'success.main',
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {future ? fmtTimer(secsToStart) : '00:00'}
            </Typography>
            <Typography variant="h5" sx={{ mt: 2 }}>
              {event.name}
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 4 }}>
              {fmtSchedule(event.scheduledAt)} · {fmtDuration(event.durationSec)}
            </Typography>
            <Button
              size="large"
              variant="contained"
              color="primary"
              startIcon={<PlayArrow />}
              onClick={onStart}
              sx={{
                fontWeight: 800,
                letterSpacing: 2,
                px: 5,
                py: 1.5,
                fontSize: 18,
              }}
            >
              GO LIVE
            </Button>
            <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 1.5 }}>
              All connected studios will sync to this clock.
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} lg={4}>
        <Stack spacing={3}>
          <Card elevation={0}>
            <CardContent>
              <Typography variant="overline" color="text.secondary">
                Crew
              </Typography>
              <Stack spacing={1} sx={{ mt: 1.5 }}>
                {event.crew.map((person, i) => (
                  <Stack key={person} direction="row" spacing={1.5} alignItems="center">
                    <Box
                      sx={{
                        width: 28,
                        height: 28,
                        borderRadius: '50%',
                        bgcolor: 'action.selected',
                        display: 'grid',
                        placeItems: 'center',
                        fontSize: 12,
                        fontFamily: 'JetBrains Mono, monospace',
                        color: 'text.secondary',
                      }}
                    >
                      {person
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .slice(0, 2)}
                    </Box>
                    <Typography variant="body2">{person}</Typography>
                    {i === 0 && (
                      <Chip
                        size="small"
                        label="HOST"
                        variant="outlined"
                        sx={{ height: 18, fontSize: 10, letterSpacing: 1 }}
                      />
                    )}
                  </Stack>
                ))}
              </Stack>
            </CardContent>
          </Card>
          <Card elevation={0}>
            <CardContent>
              <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1 }}>
                <Wifi color="success" fontSize="small" />
                <Typography variant="overline" color="text.secondary">
                  Studios Connected
                </Typography>
              </Stack>
              <Typography variant="h4" sx={{ fontFamily: 'JetBrains Mono, monospace' }}>
                4 / 4
              </Typography>
              <Typography variant="caption" color="text.secondary">
                handshake complete · time-sync ±18ms
              </Typography>
            </CardContent>
          </Card>
        </Stack>
      </Grid>
    </Grid>
  );
};

const Live = ({ event, onStop }) => {
  const tick = useTicker(true);
  const total = event.rundown.reduce((a, s) => a + s.duration, 0);

  let activeIndex = 0;
  let elapsedInActive = 0;
  let cumulative = 0;
  for (let i = 0; i < event.rundown.length; i += 1) {
    const seg = event.rundown[i];
    if (tick < cumulative + seg.duration) {
      activeIndex = i;
      elapsedInActive = tick - cumulative;
      break;
    }
    cumulative += seg.duration;
    if (i === event.rundown.length - 1) {
      activeIndex = event.rundown.length - 1;
      elapsedInActive = seg.duration;
    }
  }

  const active = event.rundown[activeIndex];
  const remaining = active.duration - elapsedInActive;
  const progress = Math.min(100, (elapsedInActive / active.duration) * 100);
  const remainingTotal = total - tick;

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} lg={8}>
        <Card>
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
                Now Playing — Segment {activeIndex + 1} of {event.rundown.length}
              </Typography>
            </Stack>
            <Button
              size="small"
              variant="outlined"
              color="inherit"
              startIcon={<Stop />}
              onClick={onStop}
            >
              End
            </Button>
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
              {fmtTimer(remaining)}
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
                  {fmtTimer(elapsedInActive)} elapsed
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {fmtTimer(active.duration)} planned
                </Typography>
              </Stack>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} lg={4}>
        <Stack spacing={3}>
          <Card elevation={0}>
            <CardContent>
              <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1 }}>
                <Schedule color="secondary" fontSize="small" />
                <Typography variant="overline" color="text.secondary">
                  Show Remaining
                </Typography>
              </Stack>
              <Typography variant="h4" sx={{ fontFamily: 'JetBrains Mono, monospace' }}>
                {fmtTimer(remainingTotal)}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {fmtTimer(tick)} of {fmtTimer(total)} elapsed
              </Typography>
            </CardContent>
          </Card>
          <Card elevation={0}>
            <CardContent>
              <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1 }}>
                <Wifi color="success" fontSize="small" />
                <Typography variant="overline" color="text.secondary">
                  Connected Clients
                </Typography>
              </Stack>
              <Typography variant="h4" sx={{ fontFamily: 'JetBrains Mono, monospace' }}>
                {event.crew.length + 4}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {event.crew.length} producers · 4 viewers
              </Typography>
            </CardContent>
          </Card>
          <Card elevation={0}>
            <CardContent>
              <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1 }}>
                <Sync color="success" fontSize="small" />
                <Typography variant="overline" color="text.secondary">
                  Sync Drift
                </Typography>
              </Stack>
              <Typography variant="h4" sx={{ fontFamily: 'JetBrains Mono, monospace' }}>
                ±42ms
              </Typography>
              <Typography variant="caption" color="text.secondary">
                all clients within tolerance
              </Typography>
            </CardContent>
          </Card>
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
              {event.rundown.length} segments · {fmtTimer(total)} total
            </Typography>
          </Box>
          <Box>
            {event.rundown.map((seg, i) => (
              <React.Fragment key={seg.id}>
                <RundownRow seg={seg} index={i} activeIndex={activeIndex} />
                {i < event.rundown.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </Box>
        </Card>
      </Grid>
    </Grid>
  );
};

const PreShowRundown = ({ event }) => {
  const total = event.rundown.reduce((a, s) => a + s.duration, 0);
  return (
    <Card sx={{ mt: 3 }}>
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
          {event.rundown.length} segments · {fmtTimer(total)} total
        </Typography>
      </Box>
      <Box>
        {event.rundown.map((seg, i) => (
          <React.Fragment key={seg.id}>
            <RundownRow seg={seg} index={i} activeIndex={-1} />
            {i < event.rundown.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </Box>
    </Card>
  );
};

const Event = () => {
  const { id } = useParams();
  const event = useMemo(() => findEvent(id), [id]);
  const [live, setLive] = useState(false);

  if (!event) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        <Navbar />
        <Container sx={{ py: 8, textAlign: 'center' }}>
          <Typography variant="h5" gutterBottom>
            Event not found.
          </Typography>
          <Button component={RouterLink} to="/" startIcon={<ArrowBack />}>
            Back to schedule
          </Button>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Navbar />
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: 3 }}
        >
          <Stack direction="row" alignItems="center" spacing={1}>
            <Button
              component={RouterLink}
              to="/"
              size="small"
              startIcon={<ArrowBack />}
              color="inherit"
              sx={{ opacity: 0.7 }}
            >
              Schedule
            </Button>
            <Typography color="text.secondary">/</Typography>
            <Typography variant="overline" color="text.secondary">
              {event.show}
            </Typography>
          </Stack>
          <Stack direction="row" spacing={3} color="text.secondary">
            <Stack direction="row" spacing={0.75} alignItems="center">
              <CalendarMonth sx={{ fontSize: 16 }} />
              <Typography variant="body2">{fmtSchedule(event.scheduledAt)}</Typography>
            </Stack>
            <Stack direction="row" spacing={0.75} alignItems="center">
              <Schedule sx={{ fontSize: 16 }} />
              <Typography variant="body2">{fmtDuration(event.durationSec)}</Typography>
            </Stack>
            <Stack direction="row" spacing={0.75} alignItems="center">
              <GroupsOutlined sx={{ fontSize: 16 }} />
              <Typography variant="body2">{event.crew.length} crew</Typography>
            </Stack>
          </Stack>
        </Stack>

        {live ? (
          <Live event={event} onStop={() => setLive(false)} />
        ) : (
          <>
            <PreShow event={event} onStart={() => setLive(true)} />
            <PreShowRundown event={event} />
          </>
        )}
      </Container>
    </Box>
  );
};

export default Event;
