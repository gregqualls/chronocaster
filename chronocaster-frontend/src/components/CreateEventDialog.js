import React, { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Stack,
  TextField,
} from '@mui/material';
import { Close } from '@mui/icons-material';
import { addSegment, createEvent, fetchPrograms } from '../services/events';

const toLocalInput = (date) => {
  const offset = date.getTimezoneOffset();
  const d = new Date(date.getTime() - offset * 60000);
  return d.toISOString().slice(0, 16);
};

const defaultRundown = [
  { name: 'Cold Open',     duration: 60 },
  { name: 'Welcome',       duration: 180 },
  { name: 'Main Segment',  duration: 1500 },
  { name: 'Q&A',           duration: 600 },
  { name: 'Closing',       duration: 120 },
];

const CreateEventDialog = ({ open, onClose, onCreated }) => {
  const [programs, setPrograms] = useState([]);
  const [programId, setProgramId] = useState('');
  const [name, setName] = useState('');
  const [scheduledAt, setScheduledAt] = useState(() =>
    toLocalInput(new Date(Date.now() + 60 * 60 * 1000)),
  );
  const [seedRundown, setSeedRundown] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!open) return;
    fetchPrograms()
      .then((rows) => {
        setPrograms(rows);
        if (rows.length && !programId) setProgramId(rows[0].id);
      })
      .catch((err) => setError(err.message ?? 'Failed to load programs'));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const program = programs.find((p) => String(p.id) === String(programId));
      const payload = {
        program_id: programId,
        name: name || `${program?.name ?? 'Untitled'} — Episode`,
        scheduled_at: new Date(scheduledAt).toISOString(),
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        status: 'scheduled',
      };
      const created = await createEvent(payload);

      if (seedRundown && created?.id) {
        for (const [i, seg] of defaultRundown.entries()) {
          // eslint-disable-next-line no-await-in-loop
          await addSegment(created.id, { ...seg, position: i });
        }
      }

      onCreated?.(created);
      onClose?.();
    } catch (err) {
      setError(err.response?.data?.message ?? err.message ?? 'Failed to create event');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        New Event
        <IconButton onClick={onClose} size="small">
          <Close />
        </IconButton>
      </DialogTitle>
      <Box component="form" onSubmit={submit}>
        <DialogContent sx={{ pt: 1 }}>
          <Stack spacing={2.5}>
            {error && <Alert severity="error">{error}</Alert>}
            <TextField
              select
              label="Program"
              value={programId}
              onChange={(e) => setProgramId(e.target.value)}
              required
              fullWidth
            >
              {programs.length === 0 && (
                <MenuItem value="" disabled>
                  No programs yet
                </MenuItem>
              )}
              {programs.map((p) => (
                <MenuItem key={p.id} value={p.id}>
                  {p.name}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Event name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Episode 042 — The Long Road"
              fullWidth
            />
            <TextField
              label="Scheduled start"
              type="datetime-local"
              value={scheduledAt}
              onChange={(e) => setScheduledAt(e.target.value)}
              required
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              select
              label="Starter rundown"
              value={seedRundown ? 'yes' : 'no'}
              onChange={(e) => setSeedRundown(e.target.value === 'yes')}
              fullWidth
              helperText={
                seedRundown
                  ? 'Adds a default 5-segment rundown you can edit later.'
                  : 'Empty rundown — add segments before going live.'
              }
            >
              <MenuItem value="yes">Use default 5-segment rundown</MenuItem>
              <MenuItem value="no">Start empty</MenuItem>
            </TextField>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={onClose} color="inherit">Cancel</Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={busy || !programId}
            startIcon={busy ? <CircularProgress size={16} color="inherit" /> : null}
          >
            Create
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default CreateEventDialog;
