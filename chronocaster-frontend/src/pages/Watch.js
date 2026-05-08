import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Divider,
  LinearProgress,
  Stack,
  Typography,
} from '@mui/material';
import { FiberManualRecord, Schedule, Sync } from '@mui/icons-material';
import { fetchWatchState } from '../services/events';
import { fmtDuration, fmtSchedule, fmtSigned, fmtTimer } from '../utils/format';

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
  if (!event?.rundown?.length) return { activeIndex: 0, elapsedInActive: 0, totalElapsed: 0, totalDuration: 0 };
  const totalDuration = event.rundown.reduce((a, s) => a + s.duration, 0);
  if (!event.currentSegmentStartedAt) return { activeIndex: 0, elapsedInActive: 0, totalElapsed: 0, totalDuration };

  const startedMs = new Date(event.currentSegmentStartedAt).getTime();
  const reference = event.status === 'paused' && event.pausedAt ? new Date(event.pausedAt).getTime() : nowMs;
  const elapsedInActive = Math.max(0, Math.floor((reference - startedMs) / 1000));

  let activeIndex = event.rundown.findIndex((s) => String(s.id) === String(event.currentSegmentId));
  if (activeIndex < 0) activeIndex = 0;

  const totalElapsed =
    event.rundown.slice(0, activeIndex).reduce((a, s) => a + s.duration, 0) + elapsedInActive;

  return { activeIndex, elapsedInActive, totalElapsed, totalDuration };
};

const RundownRow = ({ seg, index, activeIndex }) => {
  const isActive = index === activeIndex;
  const isDone = activeIndex > -1 && index < activeIndex;
  const isNext = activeIndex > -1 && index === activeIndex + 1;

  return (
    <Box
      sx={{
        px: 3, py: 2,
        display: 'grid',
        gridTemplateColumns: '40px 110px 1fr 120px',
        alignItems: 'center', gap: 2,
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
          <Chip size="small" label="NEXT" color="secondary" variant="outlined" sx={{ fontWeight: 700, letterSpacing: 1.5 }} />
        )}
      </Box>
      <Typography sx={{ fontWeight: isActive ? 600 : 400 }}>{seg.name}</Typography>
      <Typography sx={{ fontFamily: 'JetBrains Mono, monospace', color: 'text.secondary', textAlign: 'right' }}>
        {fmtTimer(seg.duration)}
      </Typography>
    </Box>
  );
};

const Watch = () => {
  const { token } = useParams();
  const [event, setEvent] = useState(null);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    try {
      const data = await fetchWatchState(token);
      setEvent(data);
      setError(null);
    } catch (err) {
      setError(err.response?.status === 404 ? 'Event not found' : 'Failed to load');
    }
  }, [token]);

  useEffect(() => {
    refresh();
    const id = setInterval(refresh, POLL_MS);
    return () => clearInterval(id);
  }, [refresh]);

  const nowMs = useNowMs();

  if (error) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', display: 'grid', placeItems: 'center' }}>
        <Container maxWidth="sm" sx={{ textAlign: 'center' }}>
          <Typography variant="h5">{error}</Typography>
          <Typography color="text.secondary" sx={{ mt: 1 }}>
            Ask the producer to send you a fresh link.
          </Typography>
        </Container>
      </Box>
    );
  }

  if (!event) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', display: 'grid', placeItems: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  const { activeIndex, elapsedInActive, totalElapsed, totalDuration } = computeLive(event, nowMs);
  const active = event.rundown[activeIndex] ?? event.rundown[0];
  const remaining = (active?.duration ?? 0) - elapsedInActive;
  const remainingTotal = totalDuration - totalElapsed;
  const progress = active ? Math.min(100, (elapsedInActive / Math.max(1, active.duration)) * 100) : 0;
  const isLive = event.status === 'live' || event.status === 'paused';
  const isPaused = event.status === 'paused';

  const showStartedMs = event.startedAt ? new Date(event.startedAt).getTime() : null;
  const referenceMs = isPaused && event.pausedAt ? new Date(event.pausedAt).getTime() : nowMs;
  const actualElapsedSec = showStartedMs ? Math.max(0, Math.floor((referenceMs - showStartedMs) / 1000)) : 0;
  const pace = totalElapsed - actualElapsedSec;

  const secsToStart = event.scheduledAt
    ? Math.round((new Date(event.scheduledAt).getTime() - nowMs) / 1000)
    : 0;

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Container maxWidth="md" sx={{ py: 5 }}>
        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1 }}>
          <Box
            sx={{
              width: 28, height: 28, borderRadius: '50%',
              border: '2px solid', borderColor: 'primary.main',
              display: 'grid', placeItems: 'center',
              fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, fontSize: 14,
              color: 'primary.main',
            }}
          >
            CC
          </Box>
          <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: 2 }}>
            CHRONOCASTER · VIEWER
          </Typography>
        </Stack>
        <Typography variant="h4" sx={{ mb: 0.5 }}>
          {event.name}
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 4 }}>
          {event.show} · {fmtSchedule(event.scheduledAt)} · {fmtDuration(event.durationSec)}
        </Typography>

        <Card sx={{ mb: 3 }}>
          <Box
            sx={{
              px: 3, py: 2, borderBottom: 1, borderColor: 'divider',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}
          >
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Chip
                size="small"
                icon={isLive ? <FiberManualRecord sx={{ fontSize: 10 }} /> : undefined}
                label={
                  isLive ? (isPaused ? 'PAUSED' : 'LIVE')
                  : event.status === 'completed' ? 'OFF AIR'
                  : secsToStart > 0 ? 'STANDBY'
                  : 'READY'
                }
                color={isLive ? (isPaused ? 'warning' : 'primary') : 'secondary'}
                variant={isLive || event.status === 'completed' ? 'filled' : 'outlined'}
                sx={{ fontWeight: 700, letterSpacing: 1.5 }}
              />
              {isLive && (
                <Typography variant="overline" color="text.secondary">
                  Segment {activeIndex + 1} of {event.rundown.length}
                </Typography>
              )}
            </Stack>
          </Box>
          <CardContent sx={{ py: 5, textAlign: 'center' }}>
            <Typography variant="overline" color="text.secondary">
              {isLive ? 'Time Remaining' : event.status === 'completed' ? 'Show Complete' : 'Starts In'}
            </Typography>
            <Typography
              sx={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: { xs: 64, md: 120 },
                lineHeight: 1,
                color: isLive && remaining < 30 ? 'primary.main' : 'text.primary',
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {isLive
                ? fmtTimer(remaining)
                : event.status === 'completed'
                  ? '—'
                  : fmtTimer(Math.max(0, secsToStart))}
            </Typography>
            {isLive && (
              <>
                <Typography variant="h6" sx={{ mt: 1.5 }}>
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
              </>
            )}
          </CardContent>
        </Card>

        {isLive && (
          <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
            <Card elevation={0} sx={{ flex: 1 }}>
              <CardContent>
                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1 }}>
                  <Schedule color="secondary" fontSize="small" />
                  <Typography variant="overline" color="text.secondary">
                    Show Remaining
                  </Typography>
                </Stack>
                <Typography variant="h5" sx={{ fontFamily: 'JetBrains Mono, monospace' }}>
                  {fmtTimer(remainingTotal)}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {fmtTimer(totalElapsed)} of {fmtTimer(totalDuration)}
                </Typography>
              </CardContent>
            </Card>
            <Card elevation={0} sx={{ flex: 1 }}>
              <CardContent>
                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1 }}>
                  <Sync color={pace >= 0 ? 'success' : 'warning'} fontSize="small" />
                  <Typography variant="overline" color="text.secondary">
                    Schedule Pace
                  </Typography>
                </Stack>
                <Typography
                  variant="h5"
                  sx={{
                    fontFamily: 'JetBrains Mono, monospace',
                    color: pace >= 0 ? 'success.main' : 'warning.main',
                  }}
                >
                  {fmtSigned(pace)}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {pace >= 0 ? 'ahead of plan' : 'over plan'}
                </Typography>
              </CardContent>
            </Card>
          </Stack>
        )}

        <Card>
          <Box sx={{ px: 3, py: 2, borderBottom: 1, borderColor: 'divider' }}>
            <Typography variant="overline" color="text.secondary">
              Rundown
            </Typography>
          </Box>
          {event.rundown.map((seg, i) => (
            <React.Fragment key={seg.id}>
              <RundownRow seg={seg} index={i} activeIndex={isLive ? activeIndex : -1} />
              {i < event.rundown.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </Card>

        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center', mt: 3 }}>
          Read-only viewer link · refreshes every {POLL_MS / 1000}s
        </Typography>
      </Container>
    </Box>
  );
};

export default Watch;
