import React, { useState } from 'react';
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
import { createProgram } from '../services/events';

const CreateProgramDialog = ({ open, onClose, onCreated }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [defaultMinutes, setDefaultMinutes] = useState(60);
  const [recurrence, setRecurrence] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  const reset = () => {
    setName('');
    setDescription('');
    setDefaultMinutes(60);
    setRecurrence('');
    setError(null);
  };

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const created = await createProgram({
        name,
        description: description || null,
        default_duration: Math.max(0, Number(defaultMinutes) || 0) * 60,
        recurrence: recurrence || null,
      });
      onCreated?.(created);
      reset();
      onClose?.();
    } catch (err) {
      const data = err.response?.data;
      const firstError = data?.errors ? Object.values(data.errors)[0]?.[0] : null;
      setError(firstError ?? data?.message ?? 'Failed to create program');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        New Program
        <IconButton onClick={onClose} size="small">
          <Close />
        </IconButton>
      </DialogTitle>
      <Box component="form" onSubmit={submit}>
        <DialogContent sx={{ pt: 1 }}>
          <Stack spacing={2.5}>
            {error && <Alert severity="error">{error}</Alert>}
            <TextField
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoFocus
              placeholder="The Long Road Podcast"
              fullWidth
            />
            <TextField
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              multiline
              rows={2}
              fullWidth
            />
            <TextField
              label="Default runtime (minutes)"
              type="number"
              value={defaultMinutes}
              onChange={(e) => setDefaultMinutes(e.target.value)}
              inputProps={{ min: 0 }}
              fullWidth
              helperText="Used to pre-fill the duration when scheduling new events."
            />
            <TextField
              select
              label="Recurrence"
              value={recurrence}
              onChange={(e) => setRecurrence(e.target.value)}
              fullWidth
              helperText="Cadence the show typically airs at."
            >
              <MenuItem value="">On demand</MenuItem>
              <MenuItem value="daily">Daily</MenuItem>
              <MenuItem value="weekly">Weekly</MenuItem>
              <MenuItem value="biweekly">Biweekly</MenuItem>
              <MenuItem value="monthly">Monthly</MenuItem>
            </TextField>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={onClose} color="inherit">Cancel</Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={busy || !name}
            startIcon={busy ? <CircularProgress size={16} color="inherit" /> : null}
          >
            Create
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default CreateProgramDialog;
