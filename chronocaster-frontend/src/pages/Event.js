import React, { useCallback, useEffect, useState } from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
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
  FastForward,
  FiberManualRecord,
  GroupsOutlined,
  Pause,
  PlayArrow,
  Schedule,
  Stop,
  Sync,
  Wifi,
} from '@mui/icons-material';
import Navbar from '../components/Navbar';
import {
  advanceEvent,
  fetchEvent,
  fetchEventState,
  pauseEvent,
  resumeEvent,
  startEvent,
  stopEvent,
} from '../services/events';
import { fmtDuration, fmtSchedule, fmtTimer } from '../utils/format';

const POLL_MS = 2000;

const useNowMs = () => {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  return now;
};

const computeLive = (event, nowMs) => {
  if (!event?.rundown?.length) {
    return { activeIndex: 0, elapsedInActive: 0, totalElapsed: 0, totalDuration: 0 };
  }

  const totalDuration = event.rundown.reduce((a, s) => a + s.duration, 0);

  if (!event.currentSegmentStartedAt) {
    return { activeIndex: 0, elapsedInActive: 0, totalElapsed: 0, totalDuration };
  }

  const startedMs = new Date(event.currentSegmentStartedAt).getTime();
  const reference = event.status === 'paused' && event.pausedAt
    ? new Date(event.pausedAt).getTime()
    : nowMs;

  const elapsedInActive = Math.max(0, Math.floor((reference - startedMs) / 1000));

  let activeIndex = event.rundown.findIndex(
    (s) => String(s.id) === String(event.currentSegmentId),
  );
  if (activeIndex < 0) activeIndex = 0;

  const totalElapsed =
    event.rundown.slice(0, activeIndex).reduce((a, s) => a + s.duration, 0) +
    elapsedInActive;

  return { activeIndex, elapsedInActive, totalElapsed, totalDuration };
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

const PreShow = ({ event, onStart, busy, canControl }) => {
  const nowMs = useNowMs();
  const secsToStart = event.scheduledAt
    ? Math.round((new Date(event.scheduledAt).getTime() - nowMs) / 1000)
    : 0;
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
            {canControl ? (
              <Button
                size="large"
                variant="contained"
                color="primary"
                startIcon={busy ? <CircularProgress size={18} color="inherit" /> : <PlayArrow />}
                onClick={onStart}
                disabled={busy}
                sx={{ fontWeight: 800, letterSpacing: 2, px: 5, py: 1.5, fontSize: 18 }}
              >
                GO LIVE
              </Button>
            ) : (
              <Chip label="Standing by for the director" variant="outlined" />
            )}
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
                {(event.crew ?? []).map((person, i) => (
                  <Stack key={`${person}-${i}`} direction="row" spacing={1.5} alignItems="center">
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

const Live = ({ event, canControl, onPause, onResume, onAdvance, onStop, busy }) => {
  const nowMs = useNowMs();
  const { activeIndex, elapsedInActive, totalElapsed, totalDuration } = computeLive(event, nowMs);
  const active = event.rundown[activeIndex] ?? event.rundown[0];
  const remaining = (active?.duration ?? 0) - elapsedInActive;
  const progress = active ? Math.min(100, (elapsedInActive / Math.max(1, active.duration)) * 100) : 0;
  const remainingTotal = totalDuration - totalElapsed;
  const isPaused = event.status === 'paused';

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} lg={8}>
        <Card>
          <Box
            sx={{
              px: 3, py: 2,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              borderBottom: 1, borderColor: 'divider',
            }}
          >
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Chip
                size="small"
                icon={<FiberManualRecord sx={{ fontSize: 10 }} />}
                label={isPaused ? 'PAUSED' : 'LIVE'}
                color={isPaused ? 'warning' : 'primary'}
                sx={{ fontWeight: 700, letterSpacing: 1.5 }}
              />
              <Typography variant="overline" color="text.secondary">
                Now Playing — Segment {activeIndex + 1} of {event.rundown.length}
              </Typography>
            </Stack>
            {canControl && (
              <Stack direction="row" spacing={1}>
                {isPaused ? (
                  <Button size="small" variant="contained" color="primary" startIcon={<PlayArrow />} onClick={onResume} disabled={busy}>
                    Resume
                  </Button>
                ) : (
                  <Button size="small" variant="outlined" color="inherit" startIcon={<Pause />} onClick={onPause} disabled={busy}>
                    Pause
                  </Button>
                )}
                <Button size="small" variant="outlined" color="inherit" startIcon={<FastForward />} onClick={onAdvance} disabled={busy}>
                  Advance
                </Button>
                <Button size="small" variant="outlined" color="inherit" startIcon={<Stop />} onClick={onStop} disabled={busy}>
                  End
                </Button>
              </Stack>
            )}
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
              {active?.name ?? '—'}
            </Typography>
            <Box sx={{ mt: 3, px: 4 }}>
              <LinearProgress variant="determinate" value={progress} sx={{ height: 8, borderRadius: 4 }} />
              <Stack direction="row" justifyContent="space-between" sx={{ mt: 1, fontFamily: 'JetBrains Mono, monospace' }}>
                <Typography variant="caption" color="text.secondary">
                  {fmtTimer(elapsedInActive)} elapsed
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {fmtTimer(active?.duration ?? 0)} planned
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
                {fmtTimer(totalElapsed)} of {fmtTimer(totalDuration)} elapsed
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
                {(event.crew?.length ?? 0) + 4}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {(event.crew?.length ?? 0)} producers · 4 viewers
              </Typography>
            </CardContent>
          </Card>
          <Card elevation={0}>
            <CardContent>
              <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1 }}>
                <Sync color="success" fontSize="small" />
                <Typography variant="overline" color="text.secondary">
                  Sync
                </Typography>
              </Stack>
              <Typography variant="h4" sx={{ fontFamily: 'JetBrains Mono, monospace' }}>
                {POLL_MS}ms
              </Typography>
              <Typography variant="caption" color="text.secondary">
                polling every {POLL_MS / 1000}s
              </Typography>
            </CardContent>
          </Card>
        </Stack>
      </Grid>

      <Grid item xs={12}>
        <Card>
          <Box
            sx={{
              px: 3, py: 2,
              borderBottom: 1, borderColor: 'divider',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}
          >
            <Typography variant="overline" color="text.secondary">
              Rundown
            </Typography>
            <Typography variant="overline" color="text.secondary">
              {event.rundown.length} segments · {fmtTimer(totalDuration)} total
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
          px: 3, py: 2,
          borderBottom: 1, borderColor: 'divider',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
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
  const [event, setEvent] = useState(null);
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  const refresh = useCallback(async () => {
    try {
      const data = await fetchEventState(id);
      setEvent(data);
      setError(null);
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 404) {
        try {
          const data = await fetchEvent(id);
          setEvent(data);
        } catch (_) {
          setEvent(null);
        }
      } else {
        setError(err.message ?? 'Failed to load event');
      }
    }
  }, [id]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    if (!event) return undefined;
    if (event.status !== 'live' && event.status !== 'paused') return undefined;
    const t = setInterval(refresh, POLL_MS);
    return () => clearInterval(t);
  }, [event?.status, refresh]);

  const run = (fn) => async () => {
    setBusy(true);
    try {
      const updated = await fn(id);
      setEvent(updated);
    } catch (err) {
      setError(err.response?.data?.error ?? err.message ?? 'Action failed');
    } finally {
      setBusy(false);
    }
  };

  if (!event) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        <Navbar />
        <Container sx={{ py: 8, textAlign: 'center' }}>
          {error ? (
            <>
              <Typography variant="h5" gutterBottom>{error}</Typography>
              <Button component={RouterLink} to="/" startIcon={<ArrowBack />}>
                Back to schedule
              </Button>
            </>
          ) : (
            <CircularProgress />
          )}
        </Container>
      </Box>
    );
  }

  const canControl = true; // TODO: gate on user role/permission once role-aware UI lands
  const isLive = event.status === 'live' || event.status === 'paused';

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Navbar />
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
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
              <Typography variant="body2">{event.crew?.length ?? 0} crew</Typography>
            </Stack>
          </Stack>
        </Stack>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {isLive ? (
          <Live
            event={event}
            canControl={canControl}
            busy={busy}
            onPause={run(pauseEvent)}
            onResume={run(resumeEvent)}
            onAdvance={run(advanceEvent)}
            onStop={run(stopEvent)}
          />
        ) : event.status === 'completed' ? (
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 6 }}>
              <Typography variant="overline" color="text.secondary">
                Off air
              </Typography>
              <Typography variant="h4" sx={{ mt: 1 }}>
                Episode complete
              </Typography>
              <Typography color="text.secondary" sx={{ mt: 1 }}>
                {event.name} ran for {fmtDuration(event.durationSec)}.
              </Typography>
            </CardContent>
          </Card>
        ) : (
          <>
            <PreShow event={event} canControl={canControl} busy={busy} onStart={run(startEvent)} />
            <PreShowRundown event={event} />
          </>
        )}
      </Container>
    </Box>
  );
};

export default Event;
