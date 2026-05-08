// Mock data for the demo. No backend round-trip needed.

const minutesFromNow = (m) => new Date(Date.now() + m * 60_000).toISOString();

export const events = [
  {
    id: 'ep-042',
    name: 'Episode 042 — The Long Road',
    show: 'The Long Road Podcast',
    host: 'Maya Chen',
    scheduledAt: minutesFromNow(35),
    durationSec: 44 * 60,
    status: 'ready',
    crew: ['Maya Chen', 'Devon Park', 'Riko Tanaka'],
    rundown: [
      { id: 1, name: 'Cold Open',                  duration: 60 },
      { id: 2, name: 'Welcome & Housekeeping',     duration: 180 },
      { id: 3, name: 'Guest Intro: Dr. Avery',     duration: 90 },
      { id: 4, name: 'Main Interview',             duration: 1500 },
      { id: 5, name: 'Audience Q&A',               duration: 600 },
      { id: 6, name: 'Sponsor Read',               duration: 90 },
      { id: 7, name: 'Closing & CTA',              duration: 120 },
    ],
  },
  {
    id: 'allhands-q3',
    name: 'Q3 All-Hands',
    show: 'Internal',
    host: 'Priya Raman',
    scheduledAt: minutesFromNow(60 * 22),
    durationSec: 60 * 60,
    status: 'scheduled',
    crew: ['Priya Raman', 'Marcus Webb'],
    rundown: [
      { id: 1, name: 'Welcome',           duration: 180 },
      { id: 2, name: 'Quarter Numbers',   duration: 900 },
      { id: 3, name: 'Product Updates',   duration: 1200 },
      { id: 4, name: 'People & Hiring',   duration: 600 },
      { id: 5, name: 'Q&A',               duration: 720 },
    ],
  },
  {
    id: 'launch-aurora',
    name: 'Product Launch: Aurora',
    show: 'Marketing',
    host: 'Sam Vasquez',
    scheduledAt: minutesFromNow(60 * 24 * 6),
    durationSec: 90 * 60,
    status: 'scheduled',
    crew: ['Sam Vasquez', 'Riko Tanaka', 'Lin Park', 'Maya Chen'],
    rundown: [
      { id: 1, name: 'Pre-roll Loop',     duration: 300 },
      { id: 2, name: 'Opening Keynote',   duration: 1500 },
      { id: 3, name: 'Demo: Aurora',      duration: 1800 },
      { id: 4, name: 'Customer Stories',  duration: 900 },
      { id: 5, name: 'Pricing & Avail.',  duration: 600 },
      { id: 6, name: 'Q&A',               duration: 600 },
      { id: 7, name: 'Closing',           duration: 300 },
    ],
  },
  {
    id: 'ep-041',
    name: 'Episode 041 — Origins',
    show: 'The Long Road Podcast',
    host: 'Maya Chen',
    scheduledAt: minutesFromNow(-60 * 72),
    durationSec: 44 * 60,
    status: 'completed',
    crew: ['Maya Chen', 'Devon Park'],
    rundown: [
      { id: 1, name: 'Cold Open',         duration: 60 },
      { id: 2, name: 'Origins Story',     duration: 1500 },
      { id: 3, name: 'Q&A',               duration: 600 },
      { id: 4, name: 'Closing',           duration: 120 },
    ],
  },
];

export const findEvent = (id) => events.find((e) => e.id === id);
