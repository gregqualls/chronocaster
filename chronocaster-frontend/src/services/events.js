import apiClient from './api';
import { events as mockEvents, findEvent as findMockEvent } from '../data/events';

const REMOTE = Boolean(process.env.REACT_APP_API_URL);

const normalizeUnit = (u) => ({
  id: String(u.id),
  name: u.name,
  show: u.show ?? u.program?.name ?? '',
  host: u.host?.name ?? null,
  scheduledAt: u.scheduled_at,
  durationSec: u.duration_sec,
  status: u.status,
  crew: (u.crew ?? []).map((c) => (typeof c === 'string' ? c : c.name)),
  rundown: (u.rundown ?? []).map((s) => ({
    id: s.id,
    name: s.name,
    duration: s.duration,
  })),
  currentSegmentId: u.current_segment_id ?? null,
  currentSegmentStartedAt: u.current_segment_started_at ?? null,
  startedAt: u.started_at ?? null,
  pausedAt: u.paused_at ?? null,
  shareToken: u.share_token ?? null,
});

const unwrap = (data) => data?.data ?? data;

export const fetchEvents = async () => {
  if (!REMOTE) return mockEvents;
  try {
    const { data } = await apiClient.get('/units');
    const units = Array.isArray(data) ? data : data.data;
    return units.map(normalizeUnit);
  } catch (err) {
    if (err.response?.status === 401) return mockEvents;
    throw err;
  }
};

export const fetchEvent = async (id) => {
  if (!REMOTE) return findMockEvent(id);
  try {
    const { data } = await apiClient.get(`/units/${id}`);
    return normalizeUnit(unwrap(data));
  } catch (err) {
    if (err.response?.status === 401 || err.response?.status === 404) {
      return findMockEvent(id);
    }
    throw err;
  }
};

export const fetchEventState = async (id) => {
  if (!REMOTE) return findMockEvent(id);
  const { data } = await apiClient.get(`/units/${id}/state`);
  return normalizeUnit(unwrap(data));
};

const action = (id, verb) => async () => {
  if (!REMOTE) return findMockEvent(id);
  const { data } = await apiClient.post(`/units/${id}/${verb}`);
  return normalizeUnit(unwrap(data));
};

export const startEvent  = (id) => action(id, 'start')();
export const pauseEvent  = (id) => action(id, 'pause')();
export const resumeEvent = (id) => action(id, 'resume')();
export const advanceEvent= (id) => action(id, 'advance')();
export const stopEvent   = (id) => action(id, 'stop')();

export const fetchWatchState = async (token) => {
  if (!REMOTE) {
    const fake = mockEvents[0];
    return { ...fake, status: 'live' };
  }
  const { data } = await apiClient.get(`/watch/${token}`);
  return normalizeUnit(unwrap(data));
};

export const fetchPrograms = async () => {
  if (!REMOTE) {
    return [
      { id: 'mock-1', name: 'The Long Road Podcast', default_duration: 2640 },
      { id: 'mock-2', name: 'Internal All-Hands',    default_duration: 3600 },
      { id: 'mock-3', name: 'Marketing Launch',      default_duration: 5400 },
    ];
  }
  const { data } = await apiClient.get('/programs');
  const items = Array.isArray(data) ? data : data.data;
  return items;
};

export const createEvent = async (payload) => {
  if (!REMOTE) {
    const fake = {
      ...payload,
      id: 'demo-' + Math.random().toString(36).slice(2, 7),
      status: 'scheduled',
      crew: [],
      rundown: [],
      durationSec: payload.duration_sec ?? 0,
    };
    return fake;
  }
  const { data } = await apiClient.post('/units', payload);
  return normalizeUnit(unwrap(data));
};

export const addSegment = async (unitId, payload) => {
  if (!REMOTE) return null;
  const { data } = await apiClient.post(`/units/${unitId}/segments`, payload);
  return unwrap(data);
};
